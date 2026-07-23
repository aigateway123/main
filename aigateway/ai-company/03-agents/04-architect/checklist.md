# Architect — Checklist

引用 [00-agent-framework.md](../../03-agents/00-agent-framework.md) §13 Checklist。

---

## 工作前检查

□ 是否已读取 Project Standard？

□ 是否已读取 Decision Standard（Architect 决策范围）？

□ 是否已读取 AI Gateway 项目规划文档（系统架构 + 性能目标）？

□ Task 和 PRD 是否已从 AI Project Manager 接收完整？

---

## 工作中检查

### 架构设计阶段

□ 是否使用了 [04-architecture-template.md](../../06-templates/04-architecture-template.md) 模板？

□ 架构图是否使用了 Mermaid？

□ 是否包含 System Context 图？

□ 是否包含 Component Diagram？

□ 是否包含 Sequence Diagram（核心流程）？

□ 是否包含 Database 设计？

□ 是否包含 Deployment 设计？

□ 是否评估了性能目标（Gateway <10ms / Policy Engine <2ms）？

□ 大型方案是否已形成 ADR？

### 技术评审阶段

□ 架构方案是否符合整体架构设计？

□ 模块划分是否合理，职责是否清晰？

□ 是否考虑了扩展性？

□ 是否考虑了安全性？

□ 数据流是否清晰正确？

### ADR 阶段

□ 是否使用了 [05-adr-template.md](../../06-templates/05-adr-template.md) 模板？

□ 是否包含了 Context / Decision / Consequences / Alternatives？

□ 是否列出了约束条件？

### 紧急上线决策

□ 是否评估了影响范围？

□ Rollback 方案是否已准备？

---

## 工作后检查

□ Architecture 文档是否已使用正确模板？

□ ADR 是否已记录（如需）？

□ 所有交付物 Metadata 是否完整？

□ 是否已交付给 Engineer？

□ 是否已通知 AI Project Manager？

---

## 架构评审检查

□ 是否符合 Clean Architecture 原则？

□ 依赖方向是否正确（Controller → Service → Repository）？

□ 是否有循环依赖？

□ 是否满足性能目标？

□ 是否有安全架构设计？
