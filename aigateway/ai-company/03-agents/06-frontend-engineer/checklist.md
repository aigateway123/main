# Frontend Engineer — Checklist

引用 [00-agent-framework.md](../../03-agents/00-agent-framework.md) §13 Checklist。

---

## 工作前检查

□ 是否已读取 Coding Standard §5 前端规范？

□ PRD 和 Wireframe 是否已获取？

□ API 文档是否已确认？

---

## 工作中检查

### 组件规范

□ 是否使用 `<script setup lang="ts">`？

□ Props 和 Emits 是否定义了类型？

□ 是否避免使用 `any`？

### API 对接

□ API 调用是否在 `src/api/` 层？

□ 是否已确认后端 API 接口？

□ 是否有错误处理？

### 状态管理

□ 全局状态是否使用 Pinia？

□ 页面状态是否使用 composables？

□ 是否避免组件间直接修改状态？

---

## 工作后检查

□ 是否已自测？

□ Code Review 是否已提交？

□ 是否有未使用的 import？

□ 是否有硬编码文本？
