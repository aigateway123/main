#!/usr/bin/env bash
# 迁移 014 回滚脚本（按 RN-20260910-P1-Iteration-008 §7 回滚预案）
#
# 两种模式：
#   reupgrade（默认）回滚 → 重启 gateway 重新应用迁移 → 从备份恢复 anthropic_* 端点
#                     适用于「继续使用新版代码」，回滚后系统仍保持双协议可用
#   legacy            回滚 → 从备份还原 base_url / api_path / api_key_ref
#                     适用于「退回旧版代码」，把 providers 表还原成迁移前结构
#
# 用法：
#   bash infra/scripts/rollback.sh                      # 默认 reupgrade，自动选用最近一次迁移前备份
#   bash infra/scripts/rollback.sh legacy               # 退回旧版代码场景
#   bash infra/scripts/rollback.sh reupgrade providers_bak_20260910120000   # 指定备份表
#
# 注意：down.sql 会删除 anthropic_* 四列并清理 schema_migrations 记录（保证可重新升级）。
#       已搬运的端点数据不会自动恢复，必须依赖迁移前备份表。
#       reupgrade 模式会按备份表形态自动选择恢复方式（迁移前备份从 base_url 恢复）。
#       本脚本只回滚迁移 014；迁移 015（auth_type 默认值与存量修正）不回滚 —— 它无结构变更与
#       数据丢失，旧代码硬编码 Bearer 完全忽略 auth_type，新旧两种回滚场景下保留均无害。

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

mode="${1:-reupgrade}"
[[ "$mode" == "reupgrade" || "$mode" == "legacy" ]] || die "未知模式：$mode（可选 reupgrade | legacy）"

command -v docker >/dev/null 2>&1 || die "未安装 docker"
docker compose version >/dev/null 2>&1 || die "docker compose 不可用"

resolve_compose_file
resolve_env_file
init_pg

# ---------- 选择备份表 ----------

bak="${2:-$(latest_backup_table)}"
[[ -n "$bak" ]] || die "未找到迁移前备份表，请手工指定：bash infra/scripts/rollback.sh $mode <备份表名>"
table_exists "$bak" || die "备份表不存在：$bak"
info "使用迁移前备份表：$bak（$(pq "SELECT count(*) FROM $bak") 行）"

# ---------- 0) 先备份当前状态，防误操作 ----------

backup_providers "rb_$(date +%Y%m%d%H%M%S)"
rb_bak="$BACKUP_TABLE"

# ---------- 1) 执行 down.sql ----------

down_file="$(migration_file "$MIGRATION_014" down)"
info "执行 $(basename "$down_file") …"
pq_stdin < "$down_file"
ok "已删除 anthropic_* 四列并清理 schema_migrations 记录"

# ---------- 2) 按模式恢复 ----------

case "$mode" in
  reupgrade)
    info "重启 gateway 以重新应用迁移 014 …"
    dc restart gateway >/dev/null
    wait_gateway_healthy || die "gateway 重启后健康检查失败，请查看：docker compose -f \"$COMPOSE_FILE\" logs gateway"

    if is_pre_migration_backup "$bak"; then
      info "从迁移前备份恢复 Anthropic 端点（重新升级会以已清空的 base_url 覆写该列，故必须在升级后恢复）…"
      pq "UPDATE providers p
          SET anthropic_base_url    = b.base_url,
              anthropic_api_path    = COALESCE(NULLIF(b.api_path, ''), '/v1/messages'),
              anthropic_api_key_ref = COALESCE(b.api_key_ref, ''),
              anthropic_auth_type   = COALESCE(NULLIF(b.auth_type, ''), 'api_key')
          FROM $bak b
          WHERE p.id = b.id AND b.protocol_type = 'anthropic'" >/dev/null
    else
      info "从迁移后备份恢复 anthropic_* 端点 …"
      pq "UPDATE providers p
          SET anthropic_base_url    = b.anthropic_base_url,
              anthropic_api_path    = b.anthropic_api_path,
              anthropic_api_key_ref = b.anthropic_api_key_ref,
              anthropic_auth_type   = b.anthropic_auth_type
          FROM $bak b WHERE p.id = b.id" >/dev/null
    fi
    ok "端点数据已恢复"

    verify_migration "$bak" || die "回滚后核对未通过"
    ;;

  legacy)
    is_pre_migration_backup "$bak" \
      || die "legacy 模式需要迁移前的备份表（不含 anthropic_* 列），$bak 不满足"

    info "还原 OpenAI 端点列（迁移前语义）…"
    pq "UPDATE providers p
        SET base_url    = b.base_url,
            api_path    = b.api_path,
            api_key_ref = b.api_key_ref
        FROM $bak b WHERE p.id = b.id" >/dev/null

    diff_cnt="$(pq "SELECT count(*) FROM providers p JOIN $bak b ON b.id = p.id
                    WHERE p.base_url IS DISTINCT FROM b.base_url
                       OR p.api_path IS DISTINCT FROM b.api_path
                       OR p.api_key_ref IS DISTINCT FROM b.api_key_ref")"
    [[ "$diff_cnt" == "0" ]] || die "还原后仍有 $diff_cnt 行与备份不一致，请人工检查"
    ok "providers 表已还原为迁移前结构（base_url / api_path / api_key_ref）"

    pq_table "SELECT provider_name, protocol_type, base_url, api_path, api_key_ref
              FROM providers WHERE protocol_type = 'anthropic' ORDER BY id"
    ;;
esac

info "本次回滚前的状态已备份至：$rb_bak（以及 $BACKUP_DIR/providers_*.sql）"
ok "回滚完成"
