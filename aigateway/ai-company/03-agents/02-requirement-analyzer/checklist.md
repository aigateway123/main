# Requirement Analyzer — Checklist

引用 [00-agent-framework.md](../../03-agents/00-agent-framework.md) §13 Checklist。

---

## 工作前检查

□ 是否已读取 Project Standard？

□ 是否已读取 Workflow Standard？

□ 是否已读取 Task Standard？

□ 是否已读取 Agent Framework？

□ 用户需求是否已从 AI Project Manager 接收完整？

□ 需求说明是否清晰可理解？

---

## 工作中检查

### 类型分析

□ 需求类型是否已确定（Feature / Bug / Optimization / Research / Emergency）？

□ 类型判定的依据是否充分？

### 规模评估

□ 需求规模是否已评估（S0 / S1 / S2 / S3 / S4）？

□ 规模评估是否参考了 AI Gateway 项目上下文？

□ 预计工期是否合理？

### 风险评估

□ 是否有功能类风险？

□ 是否有性能类风险？

□ 是否有成本类风险？

□ 是否有开发效率类风险？

### Workflow 推荐

□ 推荐的 Workflow 是否与规模匹配？

□ 推荐的 Workflow 是否与类型匹配？

---

## 工作后检查

□ 分析报告是否包含类型 / 规模 / 风险 / Workflow 四项结论？

□ 分析结论是否清晰可读？

□ 是否已交付给 AI Project Manager？

□ 是否已记录分析日志？

---

## 分析输出模板

```markdown
## Requirement Analysis

### Type
[Feature / Bug / Optimization / Research / Emergency]

### Scale Assessment
- Scale: [S0 / S1 / S2 / S3 / S4]
- Estimated Duration: [工期]
- Rationale: [判定依据]

### Risk Assessment
- Level: [High / Medium / Low]
- Risks: [风险列表]

### Workflow Recommendation
- Recommended Workflow: [Workflow 类型]
- Rationale: [推荐依据]

### Suggestion
[Accept / Reject] - [理由]
```
