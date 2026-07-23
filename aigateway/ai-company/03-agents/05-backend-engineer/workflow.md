# Backend Engineer — Workflow

## 核心流程

```mermaid
graph TD
    Start([接收 Task]) --> Load[加载 Coding Standard + Architecture]
    Load --> Read_PRD[读取 PRD]
    Read_PRD --> Dev[功能开发]

    Dev --> Self_Test[自测]
    Self_Test --> Pass{通过?}
    Pass -->|是| Submit_Review[提交 Code Review]
    Pass -->|否| Dev

    Submit_Review --> Review_Result{Review 结果}
    Review_Result -->|Pass| QA_Test[QA 测试]
    Review_Result -->|Need Fix| Dev
    Review_Result -->|Reject| Dev

    QA_Test --> QA_Pass{QA 通过?}
    QA_Pass -->|是| Acceptance[产品验收]
    QA_Pass -->|否| Dev

    Acceptance --> ACC_Pass{验收通过?}
    ACC_Pass -->|是| Done([Done])
    ACC_Pass -->|否| Dev
```

---

## 各场景开发流程

### Feature 开发

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ARC as Architect
    participant ENG as Backend Engineer
    participant REV as Reviewer
    participant QA as QA

    PM->>ENG: PRD
    ARC->>ENG: Architecture
    ENG->>ENG: 功能开发
    ENG->>ENG: 编写单元测试
    ENG->>ENG: 自测
    ENG->>REV: 提交 Code Review
    REV->>REV: Review
    alt Pass
        REV->>QA: 通知 QA 测试
        QA->>ENG: 测试反馈
    else Need Fix
        REV->>ENG: 需要修改
    end
```

### Bug 修复

```mermaid
sequenceDiagram
    participant PM as Product Manager（S1）
    participant ENG as Backend Engineer
    participant REV as Reviewer
    participant QA as QA

    PM->>ENG: Bug Task（S1）
    Note over ENG: Bug 定位
    ENG->>ENG: 修复 + 自测
    ENG->>REV: 提交 Code Review
    REV->>REV: Review
    REV->>QA: 通知 QA
    QA->>QA: 验证修复
```

### Emergency 修复

```mermaid
sequenceDiagram
    participant ARC as Architect
    participant ENG as Backend Engineer
    participant REV as Reviewer

    ARC->>ENG: 紧急修复方案
    ENG->>ENG: 修复 + 自验
    ENG->>REV: 快速 Code Review
    REV->>REV: 快速 Review
    REV->>ARC: 确认修复
    ARC->>ARC: 决策上线
```

---

## 开发规范

引用 [11-coding-standard.md](../../01-standards/11-coding-standard.md) §4。

| 规范 | 要求 |
|------|------|
| 目录结构 | `cmd/` + `internal/{controller,service,repository,...}` |
| 分层 | Controller → Service → Repository |
| DI | 构造函数注入 |
| Context | 所有方法必须接收 context.Context |
| 错误处理 | 使用 `internal/errors` |
| 日志 | 使用 Logger，禁止 fmt.Println |
| 测试 | 表格驱动测试，Mock 外部依赖 |
