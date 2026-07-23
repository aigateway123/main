# Review: 02-agent-standard.md 内容审核

## 目标
对比用户提出的 `02-agent-standard.md` 草案与 `01-project-standard.md`（项目标准），指出不一致之处。

---

## 发现的差异点

### 1. 角色名称不一致

| 位置 | Project Standard | 草案 Agent Standard |
|------|-----------------|-------------------|
| 各处 | **AI Project Manager** | **Project Manager**（缺少 AI 前缀） |
| 各处 | **QA** | **QA Engineer**（多了 Engineer） |

**影响**: Naming Convention（第 7 节）中列出的 Agent 列表也需同步修正。

---

### 2. Context Loading Order 顺序错误

**草案第 6 节** 上下文加载顺序：
```
① docs/（项目规划）
↓
② Project Standard
```

**Project Standard「End」节明确规定**：
> "Project Standard 是 AI Gateway 的最高开发规范。所有 Agent 在执行任务之前必须优先读取本规范。如与其他规范冲突：Project Standard 拥有最高优先级。"

这意味着 Project Standard 必须排在第一位，而不是 docs/。

**建议顺序**：
```
① Project Standard（最高规范，必须最优先）
↓
② docs/（项目规划）
↓
③ Agent Standard
↓
④ 当前 Workflow
↓
⑤ Skills
↓
⑥ 当前任务
```

---

### 3. Decision Rules 表述不匹配

| 位置 | Project Standard | 草案 Agent Standard |
|------|-----------------|-------------------|
| 冲突升级 | **架构问题** → Architect | **技术问题** → Architect |

"技术问题"范围太宽（包含开发问题），应精确使用"架构问题"。

---

### 4. Naming Convention 缺少必要 Agent

**草案第 7 节**列出：
```
Project Manager
Requirement Analyzer
Product Manager
Architect
Full Stack Engineer
Reviewer
QA Engineer
```

**Project Standard 第 4 节**定义了 8 个角色：
1. CEO（人类角色，可不列）
2. AI Project Manager
3. Requirement Analyzer
4. Product Manager
5. Architect
6. Full Stack Engineer
7. Reviewer
8. QA

草案中 **Requirement Analyzer** 虽在第 7 节列出，但在第 4 节「Agent Communication」的示例中缺少（只列了 PM → Architect → Full Stack → Reviewer → QA，跳过了 Requirement Analyzer）。

---

### 5. 未体现 Project Standard 中的关键约束

**Project Standard（Section 4 - Architect）**：
> "所有技术选型必须形成 ADR（Architecture Decision Record）。"

**草案第 3.4 Authority** 示例中正确提到 ADR，但**第 3.8 Skills** 中 Architect 的 Skills 未体现 ADR 能力。

**建议**: Architect Skills 补充 ADR Skill。

---

### 6. PM Skills 不完整

**Project Standard（Section 4 - Product Manager）**：
> 负责：PRD、用户故事、**产品设计**、**验收标准**

**草案第 3.8 Skills** 中 PM 只有：
> - PRD Skill
> - User Story Skill

**缺少**: Product Design Skill、Acceptance Criteria Skill

---

## 总结：需要修正的关键项

| # | 问题 | 优先级 |
|---|------|--------|
| 1 | **Project Manager** → **AI Project Manager**（缺少 AI 前缀） | **高** |
| 2 | **QA Engineer** → **QA** | **中** |
| 3 | **Context Loading Order** 中 Project Standard 应排第一 | **高** |
| 4 | "技术问题 → Architect" → "**架构问题** → Architect" | **中** |
| 5 | PM Skills 缺少 产品设计 / 验收标准 | 低 |
| 6 | Architect Skills 缺少 ADR Skill | 低 |
