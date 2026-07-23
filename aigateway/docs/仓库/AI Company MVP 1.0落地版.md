# 设计原则

AI Company 并非模拟一家完整互联网公司的所有岗位，而是围绕 AI Gateway 项目，在一人公司的资源条件下，构建一支能够完成产品设计、架构设计、研发、测试、上线的最小可运行（MVP）AI研发团队。

所有角色均采用 **按需调度（On-demand）** 的方式参与项目，而不是固定参与所有需求



# 一、AI Company 总体架构

```plain
                              👤 CEO（你）
                          产品方向 / 最终决策
                                  │
                                  ▼
                 📋 AI Project Manager（AI项目经理）
                    项目统筹 / 任务调度 / 进度管理
                                  │
                                  ▼
═══════════════════════════════════════════════
               🧠 Decision Center（决策中心）
═══════════════════════════════════════════════

① Requirement Analyzer（需求分析）

↓

② Requirement Scale（需求规模评估）

↓

③ Impact Analysis（影响范围分析）

↓

④ Workflow Generator（自动生成开发流程）

                                  │
                                  ▼
═══════════════════════════════════════════════
             🤖 AI Development Team（研发团队）
═══════════════════════════════════════════════

PM
↓

Architect（兼 Tech Lead）

↓

Full Stack Engineer

↓

Reviewer

↓

QA

↓

Release
```

# 二、Decision Center（决策中心）

决策中心是整个 AI Company 的"大脑"。

任何需求都不会直接进入开发，而是必须经过需求分析、规模评估、影响分析，最终自动生成研发流程。

------

## Step 1：Requirement Analyzer（需求分析）

负责判断需求类型：

| 类型         | 说明       |
| ------------ | ---------- |
| Feature      | 新功能开发 |
| Bug          | Bug 修复   |
| Refactor     | 技术优化   |
| Architecture | 架构升级   |
| DevOps       | 运维部署   |
| Research     | 技术调研   |

输出：

```plain
Type: Feature

Description: 新增 Claude Provider
```

------

## Step 2：Requirement Scale（需求规模评估）

负责评估需求复杂度。

| 等级 | 类型     | 工作量  |
| ---- | -------- | ------- |
| S0   | 微小修改 | <2h     |
| S1   | 普通功能 | 0.5~2天 |
| S2   | 模块开发 | 2~7天   |
| S3   | 系统升级 | 1~4周   |
| S4   | 战略项目 | >1个月  |

输出：

```plain
Scale: S2
```

------

## Step 3：Impact Analysis（影响分析）

分析影响范围。

例如：

```plain
PM: ✔

Architect: ✔

Backend: ✔

Frontend: ✔

Database: ✖

Security: ✖

QA: ✔
```

------

## Step 4：Workflow Generator（工作流生成）

根据：

需求类型 + 需求规模 + 影响范围

自动生成研发流程。

例如：

```plain
PM

↓

Architect

↓

Full Stack

↓

Reviewer

↓

QA

↓

Release
```

------

# 三、需求规模与工作流

------

## S0：微小需求（Micro Task）

**适用场景**

-  修改按钮颜色 
-  修改文案 
-  修复页面样式 
-  小 Bug 

工作流：

```plain
Full Stack

↓

Reviewer

↓

QA

↓

Release
```

------

## S1：普通功能（Normal Feature）

**适用场景**

-  新增 Provider 
-  新增 Dashboard 页面 
-  新增 API 

工作流：

```plain
PM

↓

Full Stack

↓

Reviewer

↓

QA

↓

Release
```

------

## S2：模块开发（Module Feature）

**适用场景**

-  Router 
-  Policy Engine 
-  Cost Engine 
-  Billing 

工作流：

```plain
PM

↓

Architect

↓

Full Stack

↓

Reviewer

↓

QA

↓

Release
```

------

## S3：系统升级（System Upgrade）

**适用场景**

-  多租户 
-  MCP 
-  Plugin System 
-  Redis Cluster 

工作流：

```plain
CEO

↓

PM

↓

Architect

↓

Full Stack

↓

Reviewer

↓

QA

↓

Release
```

------

## S4：战略项目（Strategic Project）

例如：

-  Skill Marketplace 
-  企业版 
-  Workflow 平台 
-  AI Agent Runtime 

工作流：

```plain
CEO

↓

PM

↓

Architect

↓

Full Stack

↓

Reviewer

↓

QA

↓

Release
```

------

# 四、AI 虚拟角色（MVP）

## 1. CEO（产品负责人）

职责：

-  产品方向 
-  商业模式 
-  Roadmap 
-  最终决策 

------

## 2. AI Project Manager（AI项目经理）

职责：

-  创建项目 
-  管理任务 
-  协调 AI Agent 
-  跟踪进度 

输出：

-  Task List 
-  Sprint 
-  Milestone 

------

## 3. Requirement Analyzer（需求分析师）

职责：

-  判断需求类型 
-  判断需求规模 
-  判断影响范围 
-  推荐 Workflow 

输出：

```plain
Type

Scale

Impact

Risk

Workflow
```

------

## 4. PM（产品经理）

职责：

-  输出 PRD 
-  用户故事 
-  验收标准 
-  原型设计（低保真） 

------

## 5. Architect（系统架构师 / Tech Lead）

职责：

-  系统设计 
-  模块拆分 
-  技术方案 
-  代码目录设计 
-  技术评审 

**MVP 阶段同时承担 Tech Lead 职责，不单独设置 CTO 和 DBA。**

------

## 6. Full Stack Engineer（全栈工程师）

职责：

-  Backend（Go） 
-  Frontend（React） 
-  PostgreSQL 
-  Redis 
-  API 
-  Docker 

**MVP 阶段不拆分前后端角色，由全栈角色统一负责实现。**

------

## 7. Reviewer（代码评审）

职责：

-  Review Code 
-  Review Architecture 
-  Coding Standard 
-  Performance Review 

------

## 8. QA（测试工程师）

职责：

-  功能测试 
-  回归测试 
-  API 测试 
-  验收测试 

------

# 五、需求生命周期（Requirement Lifecycle）

```plain
需求提出
    │
    ▼
AI Project Manager
    │
    ▼
Requirement Analyzer
    │
    ▼
① 需求类型判断
（Feature / Bug / Refactor / Architecture）

    │
    ▼
② 需求规模评估
（S0 / S1 / S2 / S3 / S4）

    │
    ▼
③ 影响范围分析
（PM / Architect / Full Stack / QA）

    │
    ▼
④ 自动生成 Workflow

    │
    ▼
AI Agent 执行开发

    │
    ▼
Reviewer

    │
    ▼
QA

    │
    ▼
产品验收

    │
    ├───────────────┐
    │               │
    ▼               ▼
验收通过        验收失败
    │               │
    ▼               ▼
Release      返回 PM 或开发
    │
    ▼
上线

    │
    ▼
持续迭代
```

------