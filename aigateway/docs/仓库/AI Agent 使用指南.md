# AI Agent 使用指南

> 面向 CEO（你）的 AI Company 使用手册。看完就知道怎么给 AI Agent 下需求。

Version: v1.0
Status: Active
Owner: AI Project Manager
Last Updated: 2026-07-20

---

## 一、快速入门

### 一句话原理

```
你说需求 → AI Project Manager（调度）→ 对应 Agent（执行）→ Reviewer（检查）→ 你（验收）
```

### 一个最简单的例子

你只需要说：

> **"调度 Backend Engineer 帮我创建 .env.example"**

AI 就会：
1. 切换到 Backend Engineer 角色
2. 读取项目规范，输出 `.env.example`
3. 调用 Reviewer 审查
4. 切回 AI Project Manager 汇报结果

---

## 二、Agent 调度方式

### 方式 1：直接调度（推荐，点对点任务）

**格式**：`调度 [角色名] 帮我 [任务描述]`

| 示例 | 效果 |
|------|------|
| "调度 Architect 帮我写 ADR-001" | 架构师输出架构决策记录 |
| "调度 Backend Engineer 帮我建 docker-compose" | 后端工程师输出基础设施配置 |
| "调度 Product Manager 帮我写里程碑规划" | 产品经理输出里程碑文档 |

### 方式 2：批量执行（适合按计划推进）

你说一句，AI Project Manager 按计划逐个调度 Agent。

**示例**：

> **"开始执行 Round 2"**

AI Project Manager 就会按之前规划的顺序，依次调度 Backend Engineer 完成 .env.example、docker-compose 等任务，每个任务完成后自动调用 Reviewer 审查。

### 方式 3：自由问答（不涉及开发任务）

直接说话即可，AI 默认以 AI Project Manager 角色回答。

**示例**：
- "当前 Phase 是什么？"
- "项目技术栈是怎样的？"
- "这个概念在术语表里怎么定义的？"

---

## 三、Agent 职责速查

| 角色 | 什么时候用 | 典型任务 |
|------|-----------|---------|
| **AI Project Manager**（默认） | 问项目情况、调度其他 Agent、跟踪进度 | "当前进度如何？" "调度 Architect" |
| **Requirement Analyzer** | 不确定需求该走什么流程 | "分析一下这个需求是什么规模" |
| **Product Manager** | 需要 PRD、用户故事、里程碑 | "写 PRD" "规划里程碑" |
| **Architect** | 需要架构方案、ADR、技术评审 | "写架构文档" "做技术选型" |
| **Backend Engineer** | 需要 Go 代码、数据库、API | "写接口" "建表" "配 Docker" |
| **Frontend Engineer** | 需要 Vue3 页面、组件 | "写管理后台页面" |
| **Reviewer** | 需要代码/文档质量检查 | "审查这个产出" |
| **QA Engineer** | 需要测试用例、功能验证 | "写测试用例" "跑回归测试" |
| **Release Manager** | 需要发布上线、回滚预案 | "发版" "写 Release Note" |

---

## 四、常见使用场景

### 场景 1：我有一个新功能想法

```
你："我想加一个 DeepSeek 的 Provider"

AI PM → 调度 Requirement Analyzer 分析需求规模
      → 需求是 S1，需要 Product Manager + Backend Engineer
      → 调度 Product Manager 写 PRD
      → 调度 Backend Engineer 实现
      → 调度 Reviewer 审查
      → 汇报结果
```

### 场景 2：我发现一个 Bug

```
你："登录页面报 500 错误"

AI PM → 调度 Requirement Analyzer 分析
      → Bug 类型，S0 规模
      → 直接调度 Backend Engineer 修复
      → 调度 Reviewer 审查
      → 调度 QA 验证
      → 汇报
```

### 场景 3：我需要做技术调研

```
你："调研一下 Go 的 HTTP 框架选哪个"

AI PM → 调度 Architect
      → Architect 输出调研报告 + ADR
      → 汇报
```

---

## 五、需求提交流程

对于复杂需求（S2+），建议按以下格式提：

```
需求描述：[一句话说明想要什么]
业务价值：[做这个有什么好处]
优先级：[P0/P1/P2/P3]
期望时间：[可选]
```

**示例**：

> "需求描述：新增智能路由功能，支持按最低价格选择 Provider
> 业务价值：用户能自动使用最便宜的模型，降低 API 成本
> 优先级：P0"

---

## 六、验收标准

当你收到 Agent 的交付物时，可以这样验收：

| 检查项 | 说明 |
|--------|------|
| 是否符合预期？ | 功能/文档是否达到你要的效果 |
| 是否经过 Reviewer？ | 所有产出应有 Review 记录 |
| 是否使用了模板？ | 文档应使用 `06-templates/` 中的对应模板 |
| 是否有 Change Log？ | 文档应有版本和修改记录 |

如果验收不通过，直接说：

> **"这个不行，需要修改：[具体问题]"**

AI 会调度对应 Agent 重新修改。

---

## 七、常见问题

### Q: 我不确定应该调度哪个 Agent？
A: 直接说需求就行，AI Project Manager 会帮你判断。

### Q: 任务做到一半我想换方向？
A: 直接说 "停一下，改成 [新需求]"，AI 会重新调度。

### Q: 我对结果不满意怎么办？
A: 说明具体问题，AI 会调度对应 Agent 修改。

### Q: 多个任务能并行吗？
A: 目前按顺序执行，一个完成后再开始下一个。后续会支持并行。

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-20 | v1.0 | 初始版本 | AI Project Manager |
