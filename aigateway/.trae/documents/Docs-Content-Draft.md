# 文档中心内容草稿（Docs Content Draft）

Version: v1.0

Status: Draft — 待用户审阅

Owner: Product Manager + Developer

Last Updated: 2026-08-01

---

## 写作说明

- 本文件为门户「文档中心」14 个子页面的内容草稿，**审阅通过后**由开发转换为 HTML 填入 `portal/src/data/docs/index.ts`。
- 所有能力描述以 GAP-20260728-Portal-vs-Backend.md 中「已实现」清单为准，**不出现任何虚假宣称**（SLA / Anycast / 50+ 模型 / 沙盒 / 支付方式等）。
- 与门户其他页面文案保持一致：Base URL `https://api.novagateway.ai/v1`、Key 格式 `nv_sk-xxx`、模型名与模型广场一致。

---

# 一、产品简介（intro）

## 1.1 什么是 Nova AI Gateway（what-is）

**Nova AI Gateway** 是一个面向企业与 AI 开发者的大模型统一接入网关。它聚合了 OpenAI、Anthropic、DeepSeek、智谱 GLM、通义千问等国内外主流大模型，通过**一个统一入口、一套 OpenAI 兼容接口**对外提供服务。

**核心价值：**

- **一次接入，调用全品类模型**：无需为每个模型厂商分别注册账号、维护密钥与充值，只需一个 Nova API Key。
- **完全兼容 OpenAI SDK**：只需替换 `base_url` 与 `api_key`，现有代码零改造即可切换。
- **自动容灾切换**：同一模型可绑定多个 Provider，主用故障时按优先级自动切换备用 Provider，业务无感。
- **按量计费、透明可控**：精确按 Token 计费，支持峰谷分时计价；额度不足时直接返回 402，杜绝超支。

**适用场景：**

- 需要同时调用多家大模型进行对比或互为兜底的应用
- 对服务连续性要求高、需要故障自动切换的生产环境
- 需要统一管理 API Key、额度与权限的团队或项目组

---

## 1.2 核心功能（core-features）

**1. 统一 API 接入**

- 完全兼容 OpenAI Chat Completions 接口规范，支持 Python / JavaScript / Go / cURL 等主流 SDK
- 一个 API Key 调用全部已接入模型
- 提供 `/v1/models` 接口实时查询可用模型列表

**2. 多 Provider 管理与自动切换**

- 每个模型可绑定多个 Provider，配置调用优先级与权重
- 主用 Provider 失败时按顺序自动切换备用 Provider，全程对业务透明

**3. API Key 与额度管理**

- 支持创建多个 API Key，独立设置额度上限
- 支持模型白名单，按 Key/账户粒度控制可调用模型
- 额度扣减采用强一致机制，避免并发超扣

**4. 按量计费与峰谷计价**

- 输入 / 输出 Token 分开计费，单价可在后台动态配置
- 支持峰谷分时计价（如 DeepSeek 白天 / 夜间不同单价）
- 注册即赠送体验额度

**5. SSE 流式响应**

- 完整透传 Provider 流式响应（`text/event-stream`）
- 从流式响应末块解析 Token 用量，流式请求同样精确计费

**6. 用量统计与成本报告**

- 记录每次调用日志：模型、Provider、Token 用量、成本、延迟、状态
- 成本汇总与明细报表，支持 CSV 导出

**7. 权限体系（RBAC）**

- 基于角色的权限控制，支持管理员 / 操作员 / 只读用户等角色
- 覆盖用户、API Key、模型、计费等管理模块的功能权限点

**8. 安全保障**

- 全链路 TLS 1.3 加密传输
- 即时转发架构，不持久保存 Prompt 内容
- 仅记录调用元数据（不记录内容），满足合规要求

---

## 1.3 技术架构（architecture）

Nova AI Gateway 采用分层架构，核心组件如下：

| 组件 | 职责 |
|------|------|
| **API Gateway** | 接收并转发 Chat Completions 请求：认证、额度校验、流式转发、计费 |
| **Router Engine** | 按模型绑定关系选择 Provider，优先级/权重分配流量，故障自动切换 |
| **Policy Engine** | 额度检查、按模型配额控制、成本计算 |
| **Auth Service** | API Key 校验、RBAC 权限校验 |
| **Billing Service** | Token 计费、峰谷计价、额度扣减与流水记录 |

**技术栈：**

- 后端：Go 1.22+，Controller → Service → Repository 分层架构
- 前端：Vue 3 + TypeScript（Admin 控制台）
- 数据库：PostgreSQL 15+（用户、Key、模型、账单流水等）
- 缓存：Redis（权限与热点数据缓存，提升校验效率）
- 部署：Docker Compose，门户 / 控制台 / API 三入口独立域名

**一次请求的完整链路：**

```
客户端
  → API Gateway（API Key 认证 + 额度校验）
  → Router Engine（按优先级选择 Provider）
  → Provider（模型推理）
  → 返回响应 / SSE 流式数据
  → Billing Service（解析 Token 用量 → 计费 → 扣减额度）
  → 异步记录请求日志
```

主链路（网关转发 + 路由）设计目标 < 10ms，99% 的请求不访问数据库，优先走缓存。

---

# 二、快速入门（quickstart）

## 2.1 获取 API Key（get-api-key）

**步骤：**

1. 登录 Nova Admin 控制台（联系管理员开通账号）
2. 进入「API Keys」菜单，点击「创建 API Key」
3. 设置 Key 名称，可选设置额度上限与模型白名单
4. 创建成功后**立即复制保存**（Key 仅完整显示一次）

**Key 格式：** `nv_sk-xxxxxxxxxxxxxxxx`

**安全提示：**

- 请将 Key 存放在服务端环境变量中，切勿提交到代码仓库或嵌入前端代码
- 建议为不同业务 / 环境分别创建独立 Key，便于限额与管理
- 如 Key 泄露，请在控制台立即禁用或删除，再创建新 Key

---

## 2.2 配置客户端（configure-sdk）

Nova 完全兼容 OpenAI SDK，只需修改两个配置项：

| 配置项 | 值 |
|--------|-----|
| `base_url` | `https://api.novagateway.ai/v1` |
| `api_key` | 你的 `nv_sk-xxx` API Key |

**Python（openai SDK）：**

```python
from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="https://api.novagateway.ai/v1",
)
```

**JavaScript（openai SDK）：**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "nv_sk-xxxxxxxxxxxxxxxx",
    baseURL: "https://api.novagateway.ai/v1",
});
```

**Go（sashabaranov/go-openai）：**

```go
client := openai.NewClientWithConfig(
    openai.DefaultConfig(
        "nv_sk-xxxxxxxxxxxxxxxx",
        "https://api.novagateway.ai/v1",
    ),
)
```

---

## 2.3 发起首次调用（first-call）

以 curl 为例调用 Chat Completions：

```bash
curl https://api.novagateway.ai/v1/chat/completions \
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "你好，请介绍一下你自己"}]
  }'
```

**成功响应：**

```json
{
  "id": "chatcmpl-xxxxxxxx",
  "object": "chat.completion",
  "created": 1780000000,
  "model": "deepseek-v4-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！我是 DeepSeek，很高兴为你服务。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 14,
    "completion_tokens": 36,
    "total_tokens": 50
  }
}
```

**常见问题排查：**

| 现象 | 说明 | 处理 |
|------|------|------|
| 401 未授权 | API Key 缺失 / 无效 / 被禁用 | 检查 `Authorization` 头与 Key 是否正确、是否已启用 |
| 402 额度不足 | 账户余额不足以支付本次调用 | 联系管理员充值 / 调整额度 |
| 403 模型未授权 | 当前 Key 无权调用该模型 | 在控制台为该 Key 添加模型白名单 |
| 404 模型不存在 | model 名称写错 | 通过 `/v1/models` 查看可用模型 ID |

---

## 2.4 多语言代码示例（code-samples）

**Python SDK：**

```python
from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="https://api.novagateway.ai/v1"
)

response = client.chat.completions.create