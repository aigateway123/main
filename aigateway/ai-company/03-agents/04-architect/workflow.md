# Architect — Workflow

## 核心流程

```mermaid
graph TD
    Start([接收 Task]) --> Load[加载 Standards + 项目规划]
    Load --> Read_PRD[读取 PRD]
    Read_PRD --> Design[架构设计]

    Design --> Need_ADR{是否需要 ADR?}
    Need_ADR -->|是| Write_ADR[撰写 ADR]
    Need_ADR -->|否| Skip_ADR

    Write_ADR --> Review_ADR{ADR 评审}
    Review_ADR -->|通过| Skip_ADR
    Review_ADR -->|不通过| Write_ADR

    Skip_ADR --> Output[输出 Architecture 文档]
    Output --> Handoff_Eng[交付 Engineer]
    Handoff_Eng --> Review{Architecture Review}
    Review -->|Pass| Done([Done])
    Review -->|Need Fix| Design
    Review -->|Reject| Design
```

---

## 各场景架构设计流程

### Feature Workflow（S2~S4）

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ARC as Architect
    participant ENG as Engineer

    PM->>ARC: PRD
    ARC->>ARC: 技术方案评估
    ARC->>ARC: 架构设计
    alt 大型方案
        ARC->>ARC: 撰写 ADR
    end
    ARC->>ENG: Architecture + ADR
    Note over ARC,ENG: Engineer 开发
    ENG->>ARC: Architecture Review
    ARC->>ARC: 评审结论
```

### Emergency Workflow

```mermaid
sequenceDiagram
    participant AIPM as AI Project Manager
    participant ARC as Architect
    participant ENG as Engineer

    AIPM->>ARC: 紧急事件
    ARC->>ARC: 影响评估
    ARC->>ARC: 修复方案
    ARC->>ENG: 下发热修方案
    ENG->>ENG: 修复 + 自验
    ENG->>ARC: 确认修复
    ARC->>ARC: 评估是否上线
    alt 可上线
        ARC->>ENG: 批准上线
    else 不可上线
        ARC->>AIPM: 拒绝上线 + 原因
    end
```

### Research Workflow

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ARC as Architect

    PM->>ARC: Research 目标
    ARC->>ARC: 技术调研
    ARC->>ARC: 多方案对比
    ARC->>ARC: 选型建议
    ARC->>PM: Research Report
    alt 需要 ADR
        ARC->>ARC: 撰写 ADR
    end
```

---

## 架构设计要点

### 必须包含的设计视图

| 视图 | 说明 | Mermaid |
|:----:|------|:-------:|
| System Context | 系统与外部系统的关系 | ✅ |
| Component Diagram | 内部组件和依赖 | ✅ |
| Sequence Diagram | 核心流程交互 | ✅ |
| Layer Design | 分层架构 | — |
| Database Design | 数据模型 | ✅ |
| Deployment | 部署架构 | ✅ (如需) |

### 性能目标参考

| 指标 | 目标 |
|------|------|
| API Gateway 主链路 | < 10ms（不含模型推理） |
| Policy Engine 决策 | < 2ms |
| Router 决策 | < 2ms |
| 数据库查询 (99%) | < 10ms |
| 统计/成本/日志 | 全部异步化 |

### ADR 触发条件

| 场景 | 必须 ADR |
|------|:--------:|
| 技术方案选型 | ✅ |
| 架构设计变更 | ✅ |
| 第三方服务选择 | ✅ |
| 数据库设计 | ✅ |
| 重大重构 | ✅ |
| 技术栈变更 | ✅ |
