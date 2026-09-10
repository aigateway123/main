#!/usr/bin/env bash
# Nova AI Gateway 生产发布脚本（服务器本地 Docker Compose 部署）
#
# 流程：
#   1) 前置检查      docker / compose / postgres 容器
#   2) 迁移前备份    providers → 库内 providers_bak_<时间戳> + 宿主机 SQL 文件
#   3) 拉取代码      git pull --ff-only
#   4) 重建并启动    docker compose up -d --build（迁移随 gateway 启动自动执行）
#   5) 迁移后核对    anthropic_* 列 / schema_migrations / 存量端点搬运对比
#   6) 健康检查
#
# 用法：
#   bash infra/scripts/deploy.sh            # 完整发布
#   bash infra/scripts/deploy.sh verify     # 仅核对迁移结果，不做任何变更
#
# 环境变量：
#   COMPOSE_FILE=<path>  指定 compose 文件（默认 infra/docker/docker-compose.yml）
#   ENV_FILE=<path>      指定 env 文件（默认自动探测仓库根目录 .env）
#   SKIP_BACKUP=1        跳过迁移前备份（仅在你已手工备份过时使用）
#   SKIP_PULL=1          跳过 git pull（用于本地演练）
#
# 说明：迁移 014 会清空存量 anthropic Provider 的 base_url / api_path / api_key_ref，
#       不可逆，因此备份步骤默认强制执行。回滚见 rollback.sh。

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

mode="${1:-deploy}"
[[ "$mode" == "deploy" || "$mode" == "verify" ]] || die "未知参数：$mode（可选 deploy | verify）"

command -v docker >/dev/null 2>&1 || die "未安装 docker"
docker compose version >/dev/null 2>&1 || die "docker compose 不可用"

resolve_compose_file
resolve_env_file
init_pg

migration_done=0
if table_exists providers && column_exists providers anthropic_base_url; then
  migration_done=1
fi

if [[ "$mode" == "verify" ]]; then
  verify_migration "$(latest_backup_table)" || exit 1
  exit 0
fi

# ---------- 2) 迁移前备份 ----------

BAK=""
if [[ "$migration_done" == "1" ]]; then
  warn "anthropic_base_url 列已存在，迁移 014 似乎已执行过 → 跳过备份"
else
  if [[ "${SKIP_BACKUP:-0}" == "1" ]]; then
    warn "SKIP_BACKUP=1，已跳过迁移前备份（存量 anthropic Provider 端点将无法恢复）"
  else
    backup_providers "$(date +%Y%m%d%H%M%S)"
  fi
fi
BAK="$BACKUP_TABLE"

# ---------- 3) 拉取代码 ----------

prev_commit="$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"

if [[ "${SKIP_PULL:-0}" == "1" ]]; then
  warn "SKIP_PULL=1，已跳过 git pull"
else
  info "拉取最新代码 …"
  git -C "$REPO_ROOT" pull --ff-only
  info "代码版本：$prev_commit → $(git -C "$REPO_ROOT" rev-parse --short HEAD)"
fi

# ---------- 4) 重建并启动 ----------

info "重建并启动服务（迁移 014 随 gateway 启动自动执行）…"
dc up -d --build

# ---------- 5)(6) 核对与健康检查 ----------

wait_gateway_healthy || die "gateway 未在 60s 内通过健康检查，请查看：docker compose -f \"$COMPOSE_FILE\" logs gateway"

if ! verify_migration "$BAK"; then
  die "迁移核对未通过，如需回滚：bash infra/scripts/rollback.sh reupgrade"
fi

info "上一个版本 commit：$prev_commit（如需回退代码：git revert / git checkout 后重跑本脚本）"
ok "发布完成"
