#!/usr/bin/env bash
# Nova AI Gateway 部署脚本公共库
# 由 deploy.sh / rollback.sh source 引入，不单独执行。
#
# 约定：
#   · compose 文件默认取 infra/docker/docker-compose.yml（服务器实际使用的编排文件）
#   · 数据库凭据不解析 .env，直接从 postgres 容器环境读取，避免两份配置漂移

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$SCRIPT_DIR/backups"
COMPOSE_FILE="${COMPOSE_FILE:-}"
HEALTH_URL_IN_CONTAINER="http://localhost:8080/health"

info() { printf '[INFO] %s\n' "$*"; }
ok()   { printf '[ OK ] %s\n' "$*"; }
warn() { printf '[WARN] %s\n' "$*" >&2; }
die()  { printf '[FAIL] %s\n' "$*" >&2; exit 1; }

# ---------- compose ----------

ENV_FILE="${ENV_FILE:-}"

resolve_compose_file() {
  if [[ -n "$COMPOSE_FILE" ]]; then
    [[ -f "$COMPOSE_FILE" ]] || die "COMPOSE_FILE 指向的文件不存在：$COMPOSE_FILE"
  elif [[ -f "$REPO_ROOT/infra/docker/docker-compose.yml" ]]; then
    COMPOSE_FILE="$REPO_ROOT/infra/docker/docker-compose.yml"
  else
    COMPOSE_FILE="$REPO_ROOT/docker-compose.yml"
  fi
  [[ -f "$COMPOSE_FILE" ]] || die "未找到 docker-compose.yml，请用 COMPOSE_FILE 指定"
  info "compose 文件：$COMPOSE_FILE"
}

# 显式传入 env 文件：脚本在非仓库根目录执行时，docker compose 默认读不到 .env，
# 会静默回退到 compose 内置默认口令（POSTGRES_PASSWORD / JWT_SECRET）
resolve_env_file() {
  if [[ -n "$ENV_FILE" ]]; then
    [[ -f "$ENV_FILE" ]] || die "ENV_FILE 指向的文件不存在：$ENV_FILE"
  elif [[ -f "$REPO_ROOT/.env" ]]; then
    ENV_FILE="$REPO_ROOT/.env"
  elif [[ -f "$REPO_ROOT/infra/docker/.env" ]]; then
    ENV_FILE="$REPO_ROOT/infra/docker/.env"
  else
    ENV_FILE=""
  fi

  if [[ -n "$ENV_FILE" ]]; then
    info "env 文件：$ENV_FILE"
  else
    warn "未找到 .env，将使用 compose 内置默认值（生产环境请确认 POSTGRES_PASSWORD / JWT_SECRET）"
  fi
}

dc() {
  if [[ -n "${ENV_FILE:-}" ]]; then
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@"
  else
    docker compose -f "$COMPOSE_FILE" "$@"
  fi
}

# ---------- 迁移文件 ----------

migration_file() { # $1 = up | down
  local matches=("$REPO_ROOT"/backend/migrations/*_add_provider_anthropic_endpoint."$1".sql)
  [[ -f "${matches[0]}" ]] || die "未找到迁移文件 *_add_provider_anthropic_endpoint.$1.sql"
  printf '%s' "${matches[0]}"
}

# 迁移版本号 = 文件名首个 '_' 之前的部分（与 database.RunMigrations 的取值规则一致）
migration_version() {
  local base
  base="$(basename "$(migration_file up)")"
  printf '%s' "${base%%_*}"
}

# ---------- 数据库访问 ----------

init_pg() {
  dc ps --services --status running 2>/dev/null | grep -qx postgres \
    || die "postgres 容器未运行，请先执行：docker compose -f \"$COMPOSE_FILE\" up -d postgres（wait 至 healthy）"
  PG_USER="$(dc exec -T postgres sh -c 'printf %s "$POSTGRES_USER"')"
  PG_DB="$(dc exec -T postgres sh -c 'printf %s "$POSTGRES_DB"')"
  [[ -n "$PG_USER" && -n "$PG_DB" ]] || die "无法从 postgres 容器读取 POSTGRES_USER / POSTGRES_DB"
  info "数据库：$PG_DB（用户 $PG_USER）"
}

pq() { dc exec -T postgres psql -v ON_ERROR_STOP=1 -U "$PG_USER" -d "$PG_DB" -tAc "$1"; }
pq_stdin() { dc exec -T postgres psql -v ON_ERROR_STOP=1 -U "$PG_USER" -d "$PG_DB"; }
pq_table() { dc exec -T postgres psql -U "$PG_USER" -d "$PG_DB" -c "$1"; }

table_exists() { [[ "$(pq "SELECT to_regclass('public.$1') IS NOT NULL")" == "t" ]]; }
table_has_column() { [[ "$(pq "SELECT count(*) FROM information_schema.columns WHERE table_name='$1' AND column_name='$2'")" == "1" ]]; }
column_exists() { table_has_column "$1" "$2"; }

# 备份表形态判定：迁移前备份不含 anthropic_* 列（anthropic 端点当时存于 base_url）
is_pre_migration_backup() { [[ "$(pq "SELECT count(*) FROM information_schema.columns WHERE table_name='$1' AND column_name='anthropic_base_url'")" == "0" ]]; }

# ---------- 备份 ----------

BACKUP_TABLE=""

# 备份 providers：库内表（供 SQL 恢复）+ 宿主机 SQL 文件（防库级故障）
backup_providers() { # $1 = 备份后缀
  local suffix="$1" bak="providers_bak_${suffix}"
  table_exists providers || die "providers 表不存在，无法备份"
  if table_exists "$bak"; then
    die "备份表 $bak 已存在，请更换后缀"
  fi

  mkdir -p "$BACKUP_DIR"
  pq "CREATE TABLE $bak AS SELECT * FROM providers;" >/dev/null
  dc exec -T postgres pg_dump -U "$PG_USER" -d "$PG_DB" -t providers \
    > "$BACKUP_DIR/providers_${suffix}.sql"

  BACKUP_TABLE="$bak"
  ok "已备份 providers（$(pq "SELECT count(*) FROM $bak") 行）"
  info "  · 库内备份表：$bak"
  info "  · 宿主机文件：$BACKUP_DIR/providers_${suffix}.sql"
}

# 最近一次迁移前备份表（排除回滚时生成的 rb_ 备份）
latest_backup_table() {
  pq "SELECT table_name FROM information_schema.tables
      WHERE table_name LIKE 'providers_bak_%'
        AND table_name NOT LIKE 'providers_bak_rb_%'
      ORDER BY table_name DESC LIMIT 1"
}

# ---------- 健康检查 ----------

wait_gateway_healthy() {
  local i
  for i in $(seq 1 30); do
    if dc exec -T gateway wget -qO- "$HEALTH_URL_IN_CONTAINER" >/dev/null 2>&1; then
      ok "gateway 健康检查通过"
      return 0
    fi
    sleep 2
  done
  return 1
}

# ---------- 迁移结果核对 ----------

# $1 = 迁移前备份表名（可为空，为空则跳过存量对比）
verify_migration() {
  local bak="${1:-}"
  local v fail=0 c
  v="$(migration_version)"
  local cols=(anthropic_base_url anthropic_api_path anthropic_api_key_ref anthropic_auth_type)

  info "=== 迁移核对（version=$v）==="

  for c in "${cols[@]}"; do
    if column_exists providers "$c"; then
      ok "列存在：providers.$c"
    else
      warn "缺少列：providers.$c"; fail=1
    fi
  done

  if [[ "$(pq "SELECT count(*) FROM schema_migrations WHERE version='$v'")" == "1" ]]; then
    ok "schema_migrations 已记录 $v"
  else
    warn "schema_migrations 缺少 $v"; fail=1
  fi

  if [[ -n "$bak" ]] && table_exists "$bak"; then
    local bad_ant bad_oai exp_ant not_empty
    if is_pre_migration_backup "$bak"; then
      exp_ant="b.base_url"
      not_empty="b.base_url <> ''"
      info "备份表 $bak 为迁移前形态（端点在 base_url）"
    else
      exp_ant="b.anthropic_base_url"
      not_empty="b.anthropic_base_url <> ''"
      info "备份表 $bak 为迁移后形态（端点已在 anthropic_base_url）"
    fi
    bad_ant="$(pq "SELECT count(*) FROM providers p JOIN $bak b ON b.id = p.id
                   WHERE b.protocol_type = 'anthropic' AND $not_empty
                     AND p.anthropic_base_url <> $exp_ant")"
    bad_oai="$(pq "SELECT count(*) FROM providers p JOIN $bak b ON b.id = p.id
                   WHERE b.protocol_type <> 'anthropic' AND b.base_url <> ''
                     AND p.base_url <> b.base_url")"
    if [[ "$bad_ant" == "0" ]]; then
      ok "存量 anthropic Provider 端点搬运正确"
    else
      warn "存在 $bad_ant 行搬运结果与备份不一致"; fail=1
    fi
    if [[ "$bad_oai" == "0" ]]; then
      ok "存量 openai Provider 端点未被改动"
    else
      warn "存在 $bad_oai 行 openai 端点被意外改动"; fail=1
    fi
    info "（对照备份表 $bak）"
  else
    warn "未找到迁移前备份表，跳过存量搬运对比"
  fi

  info "--- 当前 anthropic 协议 Provider ---"
  pq_table "SELECT provider_name, anthropic_base_url, anthropic_api_path, anthropic_auth_type
            FROM providers WHERE protocol_type = 'anthropic' ORDER BY id"

  if [[ "$fail" == "0" ]]; then
    ok "迁移核对通过"
  else
    warn "迁移核对存在异常，请检查上方输出"
  fi
  return "$fail"
}
