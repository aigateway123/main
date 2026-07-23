# Release Manager — Workflow

## 核心流程

```mermaid
graph TD
    Start([Release 触发]) --> Check[检查所有前置条件]
    Check --> PRD_Review{PRD Review 通过?}
    PRD_Review -->|是| ARC_Review{Architecture Review 通过?}
    PRD_Review -->|否| Block1[阻塞: 等待 PRD Review]

    ARC_Review -->|是| Code_Review{Code Review 通过?}
    ARC_Review -->|否| Block2[阻塞: 等待 Architecture Review]

    Code_Review -->|是| QA_Test{QA 测试通过?}
    Code_Review -->|否| Block3[阻塞: 等待 Code Review]

    QA_Test -->|是| Acceptance{产品验收通过?}
    QA_Test -->|否| Block4[阻塞: 等待 QA 修复]

    Acceptance -->|是| Release[执行 Release]
    Acceptance -->|否| Block5[阻塞: 等待产品验收]

    Release --> Verify[发布后验证]
    Verify --> Result{验证结果}
    Result -->|成功| Done([Done])
    Result -->|失败| Rollback[执行 Rollback]
    Rollback --> Done_R([Done - Rolled Back])
```

---

## 各场景 Release 流程

### 标准 Release

```mermaid
sequenceDiagram
    participant AIPM as AI Project Manager
    participant RM as Release Manager
    participant ENG as Engineer
    participant QA as QA

    AIPM->>RM: Release 请求
    RM->>RM: 检查前置条件
    alt 所有条件满足
        RM->>ENG: 执行 Release
        ENG->>ENG: 部署
        ENG->>QA: 通知验证
        QA->>QA: 验证
        alt 验证成功
            QA->>RM: 验证通过
            RM->>AIPM: Release 完成
        else 验证失败
            RM->>RM: 执行 Rollback
            RM->>AIPM: Release 失败 - 已回滚
        end
    else 条件不满足
        RM->>AIPM: Release 阻塞 - 列出未满足条件
    end
```

### Emergency Hotfix Release

```mermaid
sequenceDiagram
    participant ARC as Architect
    participant RM as Release Manager
    participant ENG as Engineer

    ARC->>RM: Emergency Release 请求
    RM->>RM: 快速检查（跳过非关键检查项）
    RM->>ENG: Hotfix Release
    ENG->>ENG: 部署
    ENG->>RM: 确认上线
    Note over RM: 24 小时内补交 Release Note
```

---

## Release 检查清单

### 前置条件

| 检查项 | 说明 |
|--------|------|
| PRD Review | 必须通过 |
| Architecture Review | S2+ 必须通过 |
| Code Review | 必须通过 |
| QA 测试 | 必须通过 |
| 产品验收 | 必须通过 |
| 迁移脚本 | 已测试 |
| 配置 | 已更新 |

### Rollback 条件

| 条件 | 动作 |
|------|------|
| 发布后 1 小时内发现 Bug | Rollback |
| 性能下降 > 20% | Rollback |
| 兼容性问题 | Rollback |
