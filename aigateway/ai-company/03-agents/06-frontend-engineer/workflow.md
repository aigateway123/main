# Frontend Engineer — Workflow

## 核心流程

```mermaid
graph TD
    Start([接收 Task]) --> Load[加载 Coding Standard + 项目规划]
    Load --> Read_API[读取 API 文档]
    Read_API --> Dev[页面/组件开发]

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

### 新页面 / 组件开发

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ENG as Frontend Engineer
    participant BE as Backend Engineer
    participant REV as Reviewer
    participant QA as QA

    PM->>ENG: PRD + Wireframe
    ENG->>BE: 确认 API 接口
    BE->>ENG: API 定义
    ENG->>ENG: 页面/组件开发
    ENG->>ENG: api/ 层对接
    ENG->>ENG: 自测
    ENG->>REV: 提交 Code Review
    REV->>REV: Review
    REV->>QA: 通知 QA 测试
```

### Bug 修复

```mermaid
sequenceDiagram
    participant ENG as Frontend Engineer
    participant REV as Reviewer
    participant QA as QA

    ENG->>ENG: Bug 定位（前端层）
    ENG->>ENG: 修复 + 自测
    ENG->>REV: 提交 Code Review
    REV->>QA: 通知 QA
```

---

## 组件开发规范

引用 [11-coding-standard.md](../../01-standards/11-coding-standard.md) §5。

### 目录结构

```
src/pages/          页面组件
src/components/     通用组件（common/ + business/）
src/composables/    组合式函数
src/api/            API 调用层
src/stores/         Pinia 状态
src/types/          TS 类型定义
src/hooks/          自定义 Hooks
src/utils/          工具函数
```

### 组件规则

- 每个 `.vue` 文件只包含一个组件
- 使用 `<script setup lang="ts">`
- Props 和 Emits 必须定义类型
- API 调用走 `src/api/` 层
- 全局状态走 Pinia
