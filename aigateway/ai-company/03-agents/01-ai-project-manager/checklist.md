# AI Project Manager — Checklist

引用 [00-agent-framework.md](../../03-agents/00-agent-framework.md) §13 Checklist。

---

## 工作前检查

□ 是否已读取 Project Standard？

□ 是否已读取 Agent Standard？

□ 是否已读取当前 Workflow？

□ 是否已读取 Agent Framework？

□ 需求是否已通过 Requirement Analyzer？

□ 需求规模（S0~S4）是否已确认？

□ Workflow 类型是否匹配需求类型？

---

## 工作中检查

### 调度阶段

□ 是否匹配了正确的 Workflow？

□ 是否分配了正确的 Agent？

□ 是否设置了合理的 Deadline？

□ 每个 Agent 是否清楚自己的任务？

□ Task 是否使用了正确的模板？

### 执行阶段

□ 各阶段是否按 Workflow 推进？

□ 是否有阶段被跳过？

□ 是否有 Agent 越权？

□ 是否有阻塞需要处理？

□ 是否需要升级无法决策的问题？

### Handoff 阶段

□ Handoff 是否通过文档完成？

□ Handoff 文档是否包含 From / To / Timestamp / 交付物清单？

□ 下游 Agent 是否已确认接收？

---

## 工作后检查

□ Output 是否使用了正确模板？

□ Metadata 是否完整（Version / Status / Owner / Last Updated）？

□ 是否符合相关 Standards？

□ 是否已通知下游 Agent？

□ Workflow 状态是否已更新？

□ 是否有需要记录的复盘事项？

---

## 异常检查

□ 是否有阶段连续失败 3 次？（需升级到 CEO）

□ 是否有阶段连续失败 5 次？（需升级到 CEO）

□ 是否有阻塞超过超时时间？

| 阻塞类型 | 超时时间 | 升级路径 |
|---------|:--------:|---------|
| 依赖阻塞 | 2 小时 | AI Project Manager |
| 资源阻塞 | 4 小时 | CEO |
| 决策阻塞 | 4 小时 | 按 Decision Rule |
| 技术阻塞 | 4 小时 | Architect |
