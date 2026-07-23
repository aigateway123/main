# Backend Engineer — Checklist

引用 [00-agent-framework.md](../../03-agents/00-agent-framework.md) §13 Checklist。

---

## 工作前检查

□ 是否已读取 Coding Standard？

□ 是否已读取 Architecture 文档？

□ 是否已读取 PRD？

□ Task 定义是否清晰？

---

## 工作中检查

### 开发规范

□ 是否遵循 Controller → Service → Repository 分层？

□ 所有方法是否已使用 context.Context？

□ Service 层是否包含完整业务逻辑？

□ Repository 层是否只访问数据源？

□ 错误是否已处理（禁止忽略 `_`）？

□ 是否使用 Logger 代替 fmt.Println？

### 数据库

□ 迁移文件是否可回滚？

□ 查询是否使用参数化？

□ 索引是否已考虑？

□ 表是否有 created_at / updated_at？

### 代码质量

□ 命名是否符合规范？

□ 是否有重复代码？

□ 是否有硬编码配置？

□ DI 是否使用构造函数注入？

---

## 工作后检查

□ 是否有单元测试覆盖？

□ 是否已通过自测？

□ Code Review 是否已提交？

□ API 文档是否已更新？

□ 迁移脚本是否已测试？

---

## 提交 Review 前检查

□ 代码逻辑是否正确？

□ 是否覆盖边界情况？

□ 是否有性能隐患？

□ 是否有安全漏洞？

□ 是否遵循命名规范？
