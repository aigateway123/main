# Product Manager — Workflow

## 核心流程

```mermaid
graph TD
    Start([接收 Task]) --> Load[加载 Standards + 项目规划]
    Load --> RA[读取 Requirement Analysis]
    RA --> PRD[撰写 PRD]
    PRD --> Review_PRD{PRD 自检}

    Review_PRD -->|通过| Handoff_ARC[交付 Architect 评估技术可行性]
    Review_PRD -->|不通过| PRD

    Handoff_ARC --> Tech_Review{Architect 评审}
    Tech_Review -->|通过| Handoff_Dev[交付 Engineer 开发]
    Tech_Review -->|需修改| PRD

    Handoff_Dev --> Dev_Progress[开发进行中]
    Dev_Progress --> Accept_Ready([开发完成 → 产品验收])

    Accept_Ready --> Accept_Test{功能验收}
    Accept_Test -->|通过| Done([验收通过 - 通知 AI Project Manager])
    Accept_Test -->|不通过| Fix[反馈 Engineer 修复]
    Fix --> Accept_Test
```

---

## 与上下游协作流程

```mermaid
sequenceDiagram
    participant AIPM as AI Project Manager
    participant RA as Requirement Analyzer
    participant PM as Product Manager
    participant ARC as Architect
    participant ENG as Engineer
    participant QA as QA

    AIPM->>PM: 分配 Task + Workflow
    PM->>RA: 获取需求分析报告
    PM->>PM: 撰写 PRD
    PM->>ARC: Handoff PRD（技术可行性评估）
    ARC->>PM: 技术反馈
    alt 需要修改
        PM->>PM: 更新 PRD
    end
    PM->>ENG: Handoff PRD + 验收标准
    ENG->>ENG: 开发
    ENG->>QA: QA 测试
    QA->>PM: 通知验收
    PM->>PM: 产品验收
    alt 验收通过
        PM->>AIPM: 通知 Release
    else 验收不通过
        PM->>ENG: 反馈修复
    end
```

---

## PRD 撰写流程

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant K as Knowledge Base

    PM->>K: 加载项目规划
    PM->>K: 加载 Standards
    PM->>PM: 背景与目标分析
    PM->>PM: 问题定义
    PM->>PM: 用户故事编写
    PM->>PM: 功能需求定义（P0/P1/P2）
    PM->>PM: 非功能需求定义
    PM->>PM: 用户流程设计
    PM->>PM: Wireframe（如需）
    PM->>PM: API / 数据库影响分析
    PM->>PM: 风险评估
    PM->>PM: 验收标准定义（Given/When/Then）
    PM->>PM: PRD 完整输出
```

---

## 验收流程

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ENG as Engineer
    participant QA as QA

    QA->>PM: 功能测试完成，通知验收
    PM->>PM: 对照 PRD 逐项检查
    PM->>PM: 检查功能需求（P0 必须全部完成）
    PM->>PM: 检查非功能需求
    PM->>PM: 检查用户体验
    alt 所有标准满足
        PM->>PM: 验收通过
    else 存在问题
        PM->>ENG: 列出问题清单
        ENG->>ENG: 修复
        ENG->>PM: 重新验收
    end
    PM->>PM: 输出验收结论
```

---

## 关键输出规范

### PRD 输出

引用 [03-prd-template.md](../../06-templates/03-prd-template.md)。

PRD 必须包含：

- 背景与目标
- 用户故事
- 功能需求（标注 P0 / P1 / P2）
- 非功能需求
- 验收标准（Given / When / Then）
- 影响范围
- 风险

### 验收结论输出

```markdown
## Product Acceptance

### Result
[Pass / Conditional / Failed]

### Checklist
- [ ] 所有 P0 需求已完成
- [ ] 非功能需求已达标
- [ ] 用户体验符合预期
- [ ] 无影响使用的 Bug

### Issues（如果验收不通过）
| # | Issue | Severity | Assigned To |
|---|-------|----------|-------------|
```
