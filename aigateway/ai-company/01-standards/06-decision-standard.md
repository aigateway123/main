# AI Company Decision Standard

Version: v1.0

Status: Draft

Owner: CEO

Last Updated: 2026-07-12

---

## 1. Decision Principles

### Principle 1 — Role Bound

每个决策必须由对应职责的角色做出。

禁止越权决策。

---

### Principle 2 — Level Matched

决策层级必须与影响范围匹配。

战略性问题必须升级到 CEO。

操作性问题不得升级到 CEO。

---

### Principle 3 — Escalate When Stuck

无法决策时必须升级。

禁止搁置不决。

---

### Principle 4 — Record All Decisions

所有决策必须有记录。

重大决策必须形成 ADR。

---

### Principle 5 — Reversible Over Irreversible

优先做可逆决策。

不可逆决策必须经过更高级别审批。

---

### Principle 6 — Speed Over Perfection

操作级决策追求速度。

战略级决策追求准确。

---

## 2. Decision Levels

### 四级决策体系

| 级别 | 名称 | 影响范围 | 决策速度 | 典型角色 |
|------|------|---------|---------|---------|
| L1 | Strategic | 全项目 | 慢（需充分论证） | CEO |
| L2 | Tactical | 多模块 / 跨 Sprint | 中 | AI Project Manager, Architect |
| L3 | Operational | 单模块 / 单 Sprint | 快 | PM, QA, Requirement Analyzer |
| L4 | Technical | 单 Task | 最快 | Engineer, Reviewer |

### 级别迁移规则

- L4 无法决策 → 升级到 L3
- L3 无法决策 → 升级到 L2
- L2 无法决策 → 升级到 L1（CEO）
- 任何级别发现影响 Roadmap 或商业模式的决策 → 直接升级到 L1

---

## 3. Decision Matrix

### 产品类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| 产品方向调整 | CEO | — | 全员 | L1 |
| Roadmap Phase 变更 | CEO | AI Project Manager | 全员 | L1 |
| 商业模式调整 | CEO | — | 全员 | L1 |
| 战略合作伙伴选择 | CEO | Architect | 全员 | L1 |
| Standards 发布/修改 | CEO | 相关 Owner | 全员 | L1 |
| Phase 优先级调整 | CEO | AI Project Manager | 全员 | L1 |
| 产品定位修改 | CEO | — | 全员 | L1 |

### 项目类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| Sprint 规划 | AI Project Manager | — | 全员 | L2 |
| Sprint Goal 确认 | AI Project Manager | — | 全员 | L2 |
| Milestone 设定 | AI Project Manager | PM | 全员 | L2 |
| Workflow 选择 | AI Project Manager | Requirement Analyzer | 相关 Agent | L2 |
| 需求优先级排序 | AI Project Manager | PM | 全员 | L2 |
| 资源分配 | AI Project Manager | — | 相关 Agent | L2 |
| Sprint 延期 | AI Project Manager | — | CEO | L2 |
| Phase 启动决策 | AI Project Manager | — | CEO | L2 |

### 需求类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| 需求规模评估（S0~S4） | Requirement Analyzer | — | AI Project Manager | L3 |
| 需求类型判定 | Requirement Analyzer | — | AI Project Manager | L3 |
| 风险评估结论 | Requirement Analyzer | — | PM | L3 |
| Workflow 推荐 | Requirement Analyzer | — | AI Project Manager | L3 |
| 需求接受/拒绝 | Requirement Analyzer | PM | AI Project Manager | L3 |

### 产品设计类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| PRD 内容确认 | PM | — | Architect, Engineer | L3 |
| 用户故事定义 | PM | — | Engineer | L3 |
| 产品设计方案 | PM | Architect | Engineer | L3 |
| 验收标准定义 | PM | QA | Engineer | L3 |
| 功能范围确认 | PM | AI Project Manager | 相关 Agent | L3 |
| 产品验收结论 | PM | — | AI Project Manager | L3 |

### 技术类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| 技术方案选型 | Architect | — | Engineer | L2 |
| 架构设计 | Architect | — | Engineer | L2 |
| 模块划分 | Architect | PM | Engineer | L2 |
| 技术评审结论 | Architect | — | Engineer | L2 |
| ADR 批准 | Architect | — | 相关方 | L2 |
| 数据库设计 | Architect | Engineer | — | L2 |
| 紧急上线决策 | Architect | — | AI Project Manager | L2 |

### 开发类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| 功能实现方式 | Engineer | Architect | — | L4 |
| Bug 修复方案 | Engineer | — | Reviewer | L4 |
| 代码重构范围 | Engineer | Architect | Reviewer | L4 |
| 本地技术债务处理 | Engineer | — | — | L4 |
| 单元测试覆盖范围 | Engineer | — | Reviewer | L4 |
| 配置项修改 | Engineer | — | Reviewer | L4 |

### 质量类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| Code Review 结论 | Reviewer | — | Engineer | L4 |
| 代码质量标准 | Reviewer | Architect | Engineer | L3 |
| 架构合规判定 | Reviewer | Architect | Engineer | L3 |
| Review Blocking 决定 | Reviewer | Architect | AI Project Manager | L3 |

### 测试类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| 测试策略 | QA | — | Engineer | L3 |
| 测试用例设计 | QA | PM | Engineer | L3 |
| 测试验收结论 | QA | — | PM | L3 |
| Bug 严重级别判定 | QA | — | Engineer | L3 |
| 回归测试范围 | QA | Engineer | — | L3 |

### 运营类决策

| 决策事项 | 决策者 | 咨询对象 | 通知对象 | 决策层级 |
|---------|--------|---------|---------|:--------:|
| Rollback 触发 | Engineer / Architect | — | 全员 | L2 |
| 紧急修复方案 | Architect | Engineer | AI Project Manager | L2 |
| 跨 Sprint 范围调整 | AI Project Manager | PM | 全员 | L2 |
| 发布窗口确认 | AI Project Manager | — | 全员 | L2 |

---

## 4. CEO Authority

### 决策范围

- 产品方向
- Roadmap
- 商业模式
- 战略决策
- Standards 审批
- 跨 Phase 变更

### 不可委托事项

以下事项不可委托给其他 Agent：

- Standards 最终批准
- Roadmap 重大变更
- 产品方向调整
- 商业模式决策

### 可委托事项

以下事项可委托，但需记录：

- Standards 初稿评审（可委托 AI Project Manager 组织）
- 阶段性 Roadmap 优化（可委托 AI Project Manager）

---

## 5. AI Project Manager Authority

### 决策范围

- Sprint 规划与调整
- Milestone 设定与跟踪
- Workflow 调度
- Agent 调度
- 需求优先级排序
- 资源分配
- 流程规则执行

### 不可决策事项

- 不得修改产品需求内容
- 不得修改 Standards
- 不得修改 Roadmap
- 不得自行决定产品方向

---

## 6. Requirement Analyzer Authority

### 决策范围

- 需求规模（S0~S4）评估
- 需求类型分类
- 风险评估等级
- Workflow 推荐
- 需求接受/拒绝建议

### 不可决策事项

- 不得决定产品方向
- 不得修改 PRD
- 不得跳过 Workflow

---

## 7. Product Manager Authority

### 决策范围

- PRD 内容
- 用户故事
- 产品设计方案
- 验收标准
- 产品验收结论
- 功能范围

### 不可决策事项

- 不得修改技术方案
- 不得修改 Roadmap
- 不得决定代码实现方式

---

## 8. Architect Authority

### 决策范围

- 技术方案选型
- 架构设计
- 模块划分
- 技术评审结论
- ADR 批准
- 数据库设计
- 紧急上线决策

### 不可决策事项

- 不得修改产品需求
- 不得修改商业模式
- 不得修改 Standards

---

## 9. Engineer Authority

### 决策范围

- 功能实现方式
- Bug 修复方案
- 代码重构范围
- 本地技术债务处理
- 单元测试覆盖范围
- 配置项修改

### 不可决策事项

- 不得修改产品需求
- 不得修改技术方案（可建议）
- 不得自行决定架构变更
- 不得跳过 Code Review
- 不得自行上线

---

## 10. Reviewer Authority

### 决策范围

- Code Review 结论
- 代码质量标准判定
- 架构合规判定
- Review Blocking 决定

### 不可决策事项

- 不得直接修改代码
- 不得修改产品需求
- 不得修改技术方案

### Review 结论类型

| 结论 | 含义 | 后续动作 |
|------|------|---------|
| Approved | 通过 | 进入下一阶段 |
| Conditional | 有条件通过 | 修复 minor 问题后自动通过 |
| Rejected | 不通过 | 返回 Developing 阶段 |

---

## 11. QA Authority

### 决策范围

- 测试策略
- 测试用例设计
- 测试验收结论
- Bug 严重级别判定
- 回归测试范围

### 不可决策事项

- 不得直接修改代码
- 不得修改产品需求
- 不得决定发布窗口

### 测试验收结论类型

| 结论 | 含义 | 后续动作 |
|------|------|---------|
| Passed | 测试通过 | 进入 Acceptance 阶段 |
| Conditional | 有条件通过 | 修复 minor Bug 后自动通过 |
| Failed | 测试不通过 | 返回 Developing 阶段 |

---

## 12. Escalation Rules

### 升级链

```
Engineer
    │
    ▼
Reviewer
    │
    ▼
Architect
    │
    ▼
AI Project Manager
    │
    ▼
CEO
```

### 升级触发条件

| 条件 | 说明 | 升级到 |
|------|------|--------|
| 技术问题无法解决 | Engineer 无法决策 | Architect |
| 架构方案争议 | Architect 与其他角色意见不一致 | AI Project Manager |
| 资源不足 | Sprint 容量不足 | AI Project Manager |
| 跨模块冲突 | 多个模块之间的决策冲突 | AI Project Manager |
| Roadmap 影响 | 决策可能影响 Roadmap | CEO |
| Standards 冲突 | 决策与 Standards 矛盾 | CEO |
| 连续失败 3 次 | 同一阶段连续失败 | AI Project Manager |
| 连续失败 5 次 | 同一阶段连续失败 | CEO |

### 升级超时

| 角色 | 超时时间 | 自动升级到 |
|------|---------|-----------|
| Engineer | 4 小时 | Reviewer |
| Reviewer | 4 小时 | Architect |
| Architect | 8 小时 | AI Project Manager |
| AI Project Manager | 24 小时 | CEO |

### 升级文档要求

每次升级必须包含以下信息：

```markdown
## Escalation Record

- From: [角色名]
- To: [角色名]
- Timestamp: YYYY-MM-DD HH:mm
- Issue: [问题描述]
- Attempted Solutions: [已尝试的方案]
- Requested Decision: [需要什么决策]
```

---

## 13. Conflict Resolution

### 冲突类型与处理方式

| 冲突类型 | 涉及方 | 处理方式 |
|---------|--------|---------|
| 产品分歧 | PM vs Engineer | PM 决策，Engineer 可记录意见 |
| 技术分歧 | Architect vs Engineer | Architect 决策，Engineer 可记录意见 |
| 质量分歧 | Reviewer vs Engineer | Reviewer 决策，Engineer 可申诉到 Architect |
| 测试分歧 | QA vs Engineer | QA 决策，Engineer 可申诉到 PM |
| 范围分歧 | PM vs AI Project Manager | AI Project Manager 决策 |
| 跨角色争议 | 任意角色 | 升级到 AI Project Manager |
| 战略争议 | 任意角色 | 升级到 CEO |

### 冲突处理流程

```
冲突发生
    │
    ▼
争议双方各自陈述
    │
    ▼
对应决策者做出裁决
    │
    ├── 接受 → 执行决策
    │
    └── 不接受 → 按 Escalation Rules 升级
            │
            ▼
      更高级别仲裁
```

### 冲突记录要求

所有冲突必须记录以下信息：

- 冲突描述
- 涉及角色
- 各自立场
- 最终决策
- 决策者
- 时间戳

---

## 14. ADR Rules

### 必须形成 ADR 的场景

| 场景 | 说明 |
|------|------|
| 技术方案选型 | 选择数据库、消息队列、框架等 |
| 架构设计变更 | 模块新增、拆分、合并 |
| 第三方服务选择 | 选择外部 AI API、云服务等 |
| 数据库设计 | 表结构设计、分片策略等 |
| 重大重构 | 架构级重构 |
| Standards 修改 | 修改任何已有 Standard |
| 技术栈变更 | 编程语言、运行时环境变更 |

### ADR 决策流程

```
决策需求识别
    │
    ▼
Architect 撰写 ADR
    │
    ▼
相关角色评审
    │
    ├── 通过 → ADR Accepted
    │
    └── 不通过 → 修改 ADR
            │
            ▼
          重新评审
```

### ADR 文档规范

ADR 文档必须遵循 04-document-standard.md §11 ADR Rule 的格式规范。

---

## 15. Decision Checklist

### 决策前检查

□ 这个决策属于我的职责范围吗？

□ 这个决策属于哪个层级（L1~L4）？

□ 是否应该咨询其他角色？

□ 是否应该通知其他角色？

□ 是否需要形成 ADR？

□ 是否有足够的信息做出决策？

---

### 决策中检查

□ 是否考虑了所有可选方案？

□ 是否评估了每个方案的风险？

□ 是否咨询了应该咨询的角色？

□ 是否有不可逆的后果？

---

### 决策后检查

□ 决策是否已记录？

□ 相关方是否已通知？

□ 是否需要跟踪决策执行？

□ 是否需要定期回顾该决策？

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-12 | v1.0 | 初始版本 | CEO |

---

# End

本规范是 AI Company 所有决策的统一标准。

所有角色必须遵守本规范。

如与 Project Standard 冲突：Project Standard 优先。

如与 Agent Standard 冲突：Agent Standard 优先。

如与 Workflow Standard 冲突：Workflow Standard 优先。
