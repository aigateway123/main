# Nova AI Gateway × AI 编程工具接入操作手册

> 本文档说明如何在 Trae、Cursor、Codex CLI、Claude Code 等 AI 编程工具中接入 Nova AI Gateway，统一调用网关上的多模型（DeepSeek、智谱 GLM、千问、Kimi、MiniMax 等）。
>
> 适用对象：已开通账号并持有 API Key 的开发者 / 企业用户。

Version: v1.0
Status: Active
Owner: Product Manager
Last Updated: 2026-08-23

---

## 一、手册说明

### 1.1 解决的问题

Nova AI Gateway 是大模型统一接入网关：**一个 API Key、一套地址，即可调用多个主流大模型**。接入 AI 编程工具（IDE / CLI）后，你可以在熟悉的工具里直接使用网关上的模型，由网关统一完成鉴权、路由、故障切换与计费。

### 1.2 覆盖工具

| # | 工具 | 接入协议 | 章节 |
|:-:|------|---------|------|
| 1 | Trae（IDE） | OpenAI Chat Completions | [三](#三trae-ide-配置) |
| 2 | Cursor（IDE） | OpenAI Chat Completions | [四](#四cursor-ide-配置) |
| 3 | Codex CLI（OpenAI 官方命令行） | OpenAI Chat Completions | [五](#五codex-cli-配置) |
| 4 | Claude Code（Anthropic 官方命令行） | Anthropic Messages API | [六](#六claude-code-配置) |
| 5 | 其他 OpenAI 兼容工具（Cline / Continue / Roo Code 等） | OpenAI Chat Completions | [七](#七通用-openai-兼容工具接入) |

> 网关同时对外提供两套协议，覆盖绝大多数 AI 工具：
> - **OpenAI 兼容**：`POST /v1/chat/completions`
> - **Anthropic 兼容**：`POST /v1/messages`

### 1.3 前置条件

1. 已在控制台（`http://admin.starnov.cn`）开通账号；
2. 已创建 API Key（`nv_sk-` 开头，仅创建时完整展示一次，请先复制保存）；
3. 账号已授权目标模型（模型白名单由管理员配置）。

---

## 二、接入前准备

### 2.1 关键参数速查表

以下参数在后续所有工具配置中都会用到：

| 参数 | 值 | 说明 |
|------|-----|------|
| API Key | `nv_sk-xxxxxxxxxxxxxxxx` | 网关签发的 Key |
| OpenAI Base URL | `http://api.starnov.cn/v1` | Trae / Cursor / Codex / 通用工具使用 |
| Anthropic Base URL | `http://api.starnov.cn` | Claude Code 使用（SDK 自动拼接 `/v1/messages`） |
| 认证方式 | `Authorization: Bearer` 或 `x-api-key` | 两种头均支持 |
| 模型 ID | 见 2.2 | 必须与网关 modelCode 完全一致 |

### 2.2 查询可用模型

用 cURL 拉取当前账号可用的模型列表（返回的 `id` 即模型 ID）：

```bash
curl http://api.starnov.cn/v1/models \
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx"
```

常见模型 ID 示例（以网关实际返回为准）：

| 模型 ID | 说明 |
|---------|------|
| `deepseek-v4-pro` / `deepseek-v4-flash` | DeepSeek 旗舰 / 轻量 |
| `qwen3.7-plus` / `qwen3.7-flash` | 千问 |
| `GLM-5.2` | 智谱 |
| `kimi-k3` | Kimi |
| `MiniMax-M3` | MiniMax |

> ⚠️ 模型 ID 大小写敏感，必须与后台配置的 modelCode 完全一致。

### 2.3 cURL 连通性验证

配置任何工具前，建议先验证连通性：

```bash
curl http://api.starnov.cn/v1/chat/completions \
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

返回包含 `choices[0].message.content` 即验证通过。若返回 401 / 402 / 404，先对照[第八章](#八常见问题与错误码)排查。

---

## 三、Trae IDE 配置

> 入口：**设置 → 模型 → 添加模型**（或 AI 对话框右下角模型列表 → 添加模型）

### 操作步骤

1. 点击「添加模型」，选择 **「自定义配置」**；
2. **API 格式**：选择 **「OpenAI Chat Completions 格式」**；
3. **请求地址**：
   - 关闭「完整 URL」开关 → 填 `http://api.starnov.cn/v1`
   - 开启「完整 URL」开关 → 填 `http://api.starnov.cn/v1/chat/completions`
   - 两种写法二选一，效果一致；
4. **模型 ID**：填网关上的模型 ID，如 `deepseek-v4-pro`；
5. **API 密钥**：填 `nv_sk-xxxxxxxxxxxxxxxx`；
6. 点击「添加模型」，Trae 会自动预检连通性，成功后模型出现在模型列表；
7. 回到 AI 对话框，选中该模型，发一条测试消息验证。

### 验证要点

- 预检失败时检查：请求地址是否漏 `/v1`、模型 ID 是否与网关一致、Key 是否有空格或复制不全。

---

## 四、Cursor IDE 配置

> 入口：**Settings（⌘+,）→ Models**

### 方式一：OpenAI 兼容覆盖（推荐）

1. 打开 **Settings → Models**；
2. 在「OpenAI API Key」处填入 `nv_sk-xxxxxxxxxxxxxxxx`；
3. 勾选 **「Override OpenAI Base URL」**，填入 `http://api.starnov.cn/v1`；
4. 回到对话框，模型选择器中选择你需要的模型（如 `deepseek-v4-pro`）。

> 若模型未出现在选择器，可在该页底部的自定义模型输入框中手动输入模型 ID。

### 方式二：添加自定义模型（Cursor 新版）

1. **Settings → Models → Add model（添加模型）**；
2. 填写模型名称 / ID（如 `deepseek-v4-pro`）；
3. Base URL 填 `http://api.starnov.cn/v1`；
4. API Key 填 `nv_sk-xxxxxxxxxxxxxxxx`（或配置请求头 `Authorization: Bearer nv_sk-...`）；
5. 保存后在模型选择器中选用。

### 验证要点

- 首次使用时发一条消息，观察是否正常返回；若报 404，核对模型 ID 是否与网关一致。

---

## 五、Codex CLI 配置

> Codex 是 OpenAI 官方开源的命令行编程 Agent。通过 `config.toml` 声明自定义 Provider，即可走网关调用。

### 5.1 安装与初始化

```bash
# 安装（任选其一，按官方文档）
npm install -g @openai/codex
# 或 brew install codex

# 初始化生成 ~/.codex/config.toml（首次运行自动创建，可跳过）
codex
```

### 5.2 配置自定义 Provider

编辑 `~/.codex/config.toml`：

```toml
# 默认使用的模型提供方
model_provider = "nova"

[model_providers.nova]
name = "Nova AI Gateway"
base_url = "http://api.starnov.cn/v1"
env_key = "NOVA_API_KEY"      # 读取环境变量作为 API Key
wire_api = "chat"             # 网关为 OpenAI Chat Completions 协议
```

> `wire_api` 必须为 `"chat"`（对应 `POST /v1/chat/completions`），不能填 `"responses"`。

### 5.3 配置环境变量

在 `~/.zshrc` / `~/.bashrc` 中加入：

```bash
export NOVA_API_KEY="nv_sk-xxxxxxxxxxxxxxxx"
```

然后 `source ~/.zshrc` 生效。

### 5.4 使用

```bash
# 在项目目录中启动，默认使用配置的模型
codex

# 指定模型
codex --model deepseek-v4-pro

# 使用轻量模型处理简单任务
codex --model deepseek-v4-flash
```

`config.toml` 中也可设置默认模型：

```toml
[model]
model = "deepseek-v4-pro"
```

### 验证要点

- 首次对话报 401：检查 `NOVA_API_KEY` 环境变量是否已导出、Key 是否正确；
- 报 404：确认模型 ID 与网关一致。

---

## 六、Claude Code 配置

> Claude Code 是 Anthropic 官方命令行编程 Agent。网关提供 Anthropic 兼容端点（`POST /v1/messages`），Claude Code 可直接指向网关。

### 6.1 安装

```bash
# 按官方文档安装 Claude Code（npm 或 curl 安装脚本）
npm install -g @anthropic-ai/claude-code
```

### 6.2 通过环境变量指向网关

```bash
export ANTHROPIC_BASE_URL="http://api.starnov.cn"      # 注意：不带 /v1，SDK 会自动拼接 /v1/messages
export ANTHROPIC_AUTH_TOKEN="nv_sk-xxxxxxxxxxxxxxxx"
export ANTHROPIC_MODEL="deepseek-v4-pro"               # 默认主模型
export ANTHROPIC_SMALL_FAST_MODEL="deepseek-v4-flash"  # 后台轻量模型（可选，推荐配置）
```

> - `ANTHROPIC_AUTH_TOKEN` 走 `Authorization: Bearer` 头；网关同时支持 `x-api-key` 头，两种均兼容；
> - `ANTHROPIC_BASE_URL` 填到域名为止（`http://api.starnov.cn`），不要带 `/v1/messages`。

### 6.3 启动

```bash
claude
```

在项目目录中启动后，Claude Code 会以网关为后端进行对话、编码。

### 验证要点

- 若报认证失败：确认 `ANTHROPIC_AUTH_TOKEN` 是否为 `nv_sk-` 开头的网关 Key；
- 若报模型不存在：核对 `ANTHROPIC_MODEL` 与网关 modelCode 一致。

---

## 七、通用 OpenAI 兼容工具接入

Cline、Continue、Roo Code 等工具普遍支持「自定义 OpenAI 兼容 Provider」，配置套路一致：

| 配置项 | 值 |
|--------|-----|
| Provider 类型 | OpenAI Compatible / 自定义 |
| Base URL / 请求地址 | `http://api.starnov.cn/v1` |
| API Key | `nv_sk-xxxxxxxxxxxxxxxx` |
| 模型 ID | 网关上的 modelCode（如 `deepseek-v4-pro`） |

### 通用配置步骤

1. 在工具设置中新建「自定义 Provider / 自定义模型」；
2. 选择 OpenAI Chat Completions 格式；
3. 填入上表的 Base URL、API Key、模型 ID；
4. 保存后发起一条测试消息验证。

---

## 八、常见问题与错误码

### 8.1 网关错误码速查

| 错误码 | 含义 | 处理 |
|:---:|------|------|
| 401 | Key 无效 / 未携带 | 检查 `Authorization: Bearer nv_sk-...`，确认无多余空格 |
| 402 | 账号额度不足 | 联系管理员调整额度 |
| 404 | 模型不存在 / 未授权 | 运行 `GET /v1/models` 核对模型 ID 与权限 |
| 429 | 触发限流 | 降低频率，稍后重试 |
| 500 | 网关内部错误 | 记录请求信息，联系管理员 |
| 503 | 模型无可用 Provider | 管理员检查 Provider 配置与启用状态 |

### 8.2 各工具常见报错对照

| 工具 | 报错 | 原因 | 处理 |
|------|------|------|------|
| Trae | 401 Unauthorized | API Key 错误 | 重新复制 `nv_sk-` Key，检查空格 |
| Trae | 404 Model Not Found | 模型 ID 与网关不一致 | `GET /v1/models` 核对模型名 |
| Cursor | Model not found / 404 | 自定义模型 ID 填错 | 在 Models 设置中核对 ID |
| Codex CLI | 401 / Missing key | `NOVA_API_KEY` 未导出 | `echo $NOVA_API_KEY` 检查 |
| Codex CLI | 模型一直报错 | `wire_api` 配置错误 | 确认 `wire_api = "chat"` |
| Claude Code | Auth / 401 | `ANTHROPIC_AUTH_TOKEN` 错误 | 核对是否为网关 Key |
| Claude Code | 404 model not found | `ANTHROPIC_MODEL` 与网关不一致 | 核对 modelCode |
| 通用 | 连接超时 | 地址填错 / 漏 `/v1` | 检查 `http://api.starnov.cn/v1` |
| 通用 | 402 QUOTA_EXCEEDED | 账号额度不足 | 联系管理员充值 |

---

## 九、最佳实践

1. **Key 隔离**：不同项目 / 工具使用不同 API Key，泄露时单独撤销，不影响其他工具；
2. **模型分级**：日常简单任务用 flash 版轻量模型（省钱），复杂任务用 pro 版；
3. **成本可查**：定期在控制台「我的用量」查看各工具 / 模型消耗，及时发现异常；
4. **长回答**：编码工具默认流式输出，网关按响应末尾 usage 计费，无需额外配置；
5. **Key 安全**：不要将 `nv_sk-` Key 提交到 Git 仓库、配置文件模板或公开日志。

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|:----:|---------|--------|
| 2026-08-23 | v1.0 | 初始版本：Trae / Cursor / Codex CLI / Claude Code 及通用 OpenAI 兼容工具接入手册 | Product Manager |

---

# End
