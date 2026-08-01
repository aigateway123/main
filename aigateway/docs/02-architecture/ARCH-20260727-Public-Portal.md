# 架构设计: Nova AI Gateway 门户网站

Version: v1.0

Status: Draft（待评审）

Owner: Architect

Last Updated: 2026-07-27

---

## 1. 项目背景

Nova AI Gateway MVP 已具备完整的产品能力（统一 API 接入、多 Provider 管理、智能路由、API Key 管理、用量计费、Admin 后台），但完全缺乏面向公众的展示窗口。需要建设独立的门户网站作为公司官网和产品 Landing Page。

---

## 2. 设计目标

### 2.1 核心目标

- **G1**: 建设独立的门户网站，与 Admin 后台完全解耦
- **G2**: 展示 Nova AI Gateway 的核心产品能力和价值主张
- **G3**: 打通"官网浏览 → 登录控制台"的转化路径
- **G4**: 建立品牌视觉体系，提升专业形象

### 2.2 非目标

- 不自建用户注册流程（复用 Admin 登录）
- 不做多语言国际化
- 不做 SSR/SSG（MVP 阶段使用纯 SPA）
- 不做后端开发

---

## 3. 架构方案

### 3.1 项目独立性

门户与 Admin 是两个完全独立的前端项目：

```
aigateway/
├── admin/          ← Admin 管理后台（已有）
│   ├── src/
│   └── ...
├── portal/         ← 门户网站（新增，本次建设）
│   ├── src/
│   └── ...
└── infra/
    └── nginx/
        ├── admin.conf       ← Admin 路由配置
        └── portal.conf      ← 门户路由配置（新增）
```

### 3.2 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 框架 | Vue 3 + TypeScript | Composition API, `<script setup>` |
| 构建 | Vite 5 | 与 Admin 保持一致 |
| CSS | Tailwind CSS 3 | 与 Admin 共用 Design Token |
| 图标 | lucide-vue-next | 与 Admin 保持一致 |
| 路由 | vue-router | 支持多页面扩展 |
| 状态管理 | 无需 Pinia（纯展示型站点） | — |
| SEO | vue-meta / useHead | 基础 meta 标签 |

### 3.3 与 Admin 的品牌一致性

门户复用 Admin 的核心 Design Token，同时加入营销感更强的品牌元素：

```
Admin 风格（后台工具感）         门户风格（营销感）
┌─────────────────┐           ┌─────────────────┐
│  专业、克制      │           │  活力、大气      │
│  高对比度        │           │  柔和渐变        │
│  卡片式布局      │           │  全幅视觉        │
│  深色文字        │           │  大标题 + 留白   │
│  主色 #2563eb   │  ──→      │  主色 #2563eb   │
└─────────────────┘           │  + 渐变 #6366f1 │
                              └─────────────────┘
```

---

## 4. 页面结构

### 4.1 整体布局

单页滚动式 Landing Page（参考 nexhina.cn 风格）：

```
┌─────────────────────────────────────────────────────┐
│ [Logo]  [特性] [模型] [定价] [文档]  [登录控制台]     │ ← Header（fixed）
├─────────────────────────────────────────────────────┤
│                                                     │
│   ✦  Hero 主视觉区                                   │ ← 全幅背景
│     一个 API 调用全品类顶级 AI 模型                    │   大标题 + 动效
│     统一接入 · 智能路由 · 成本优化                     │
│     ┌──────────────┐ ┌──────────────┐               │
│     │   开始使用    │ │   查看文档    │               │
│     └──────────────┘ └──────────────┘               │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ✦  Why Section — 为什么选择 Nova AI Gateway        │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 统一 API  │ │ 智能路由  │ │ 高稳定性  │            │ ← 3×2 Grid
│  ├──────────┤ ├──────────┤ ├──────────┤            │    每个卡片
│  │ 降本增效  │ │开发者体验│ │ 安全合规  │            │    icon + 标题 + 描述
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ✦  模型展示区 — 支持的模型                          │
│                                                     │
│  [OpenAI] [Claude] [DeepSeek] [智谱GLM] [Qwen] ...  │ ← Logo 墙
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ✦  基础设施 — 技术架构                              │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │  全球智能分发  │  │  超低延迟    │                 │ ← 2×2 Grid
│  ├──────────────┤  ├──────────────┤                 │
│  │  分层缓存加速  │  │  自动弹性扩容 │                 │
│  └──────────────┘  └──────────────┘                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ✦  CTA Banner                                      │ ← 行动召唤
│     立即接入 Nova AI Gateway，开启智能应用之旅          │
│                   [ 开始使用 ]                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ✦  常见问题 FAQ                                    │ ← 手风琴交互
│  ▸ 如何接入 Nova AI Gateway？                        │
│  ▸ API 兼容 OpenAI 吗？                              │
│  ▸ 如何计费？支持哪些支付方式？                        │
│  ▸ ...                                              │
│                                                     │
├─────────────────────────────────────────────────────┤
│ [Logo]    产品  |  定价  |  文档  |  联系我们          │ ← Footer
│ © 2026 Nova AI Gateway. All rights reserved.        │
└─────────────────────────────────────────────────────┘
```

### 4.2 路由设计

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 单页 Landing Page |
| `/pricing` | 定价页（P1） | 详细定价对比表 |

---

## 5. 组件树

```
App.vue
├── AppHeader.vue          ← 固定顶部导航栏
│   ├── Logo.vue
│   ├── NavMenu.vue        ← 导航链接（锚点滚动）
│   └── CTAButton.vue      ← "登录控制台" 按钮
├── HeroSection.vue        ← 主视觉区
│   ├── HeroTitle.vue
│   ├── HeroSubtitle.vue
│   └── HeroCTA.vue
├── WhySection.vue         ← 产品优势
│   └── FeatureCard.vue    ← 复用 6 次
├── ModelsSection.vue      ← 模型展示
│   └── ModelLogo.vue      ← 模型 Logo 项
├── InfrastructureSection.vue  ← 基础设施
│   └── PillarCard.vue     ← 复用 4 次
├── CTABanner.vue          ← 行动召唤
├── FAQSection.vue         ← 常见问题
│   └── FAQItem.vue        ← 手风琴项
└── AppFooter.vue          ← 底部
```

---

## 6. 数据架构

MVP 阶段全部使用静态数据，集中管理在 `src/data/` 目录：

```
src/data/
├── site.ts              ← 站点元信息（标题、描述、联系方式）
├── features.ts          ← 6 大特性数据
├── models.ts            ← 支持模型列表
├── infrastructure.ts    ← 基础设施数据
├── faq.ts               ← FAQ 数据
├── pricing.ts           ← 定价套餐数据
└── stats.ts             ← 平台统计数据（用户数、模型数等）
```

数据结构示例（TypeScript）：

```typescript
// features.ts
export interface Feature {
  id: string
  icon: string        // lucide-vue-next 图标名
  title: string
  description: string
}

export const features: Feature[] = [
  {
    id: 'unified-api',
    icon: 'Cpu',
    title: '统一 API，无限模型',
    description: '一次接入自由切换所有模型。完全兼容 OpenAI 接口规范，只需变更 model 名称。支持 Function Calling 与 JSON Mode。'
  },
  // ...
]
```

---

## 7. 部署方案

### 7.1 域名方案

门户与 Admin 使用独立访问入口：

| 站点 | 域名方案 A（推荐） | 域名方案 B |
|------|-------------------|-----------|
| 门户网站 | `www.nova-ai.com` | `nova-ai.com` |
| Admin 控制台 | `console.nova-ai.com` | `nova-ai.com/admin` |

**推荐方案 A**（子域名分离），原因：
- 便于独立部署和扩容
- SEO 更友好（主域名权重集中到门户）
- 隔离清晰，不会互相影响

### 7.2 Nginx 配置

门户使用独立的 Nginx server block：

```nginx
# /etc/nginx/conf.d/portal.conf
server {
    listen 80;
    server_name www.nova-ai.com;  # 门户域名

    root /var/www/portal/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

### 7.3 Docker Compose

在 `docker-compose.yml` 中新增 portal 服务：

```yaml
services:
  portal:
    image: nginx:alpine
    container_name: nova-portal
    volumes:
      - ./portal/dist:/usr/share/nginx/html:ro
      - ./infra/nginx/portal.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "8082:80"
    networks:
      - nova-network
    restart: unless-stopped
```

---

## 8. 交互设计

### 8.1 滚动导航

- 导航栏锚点链接点击后平滑滚动到对应区块
- 滚动时导航栏高亮当前所在区块
- Hero 区全屏高度（100vh）

### 8.2 滚动动画

使用 Intersection Observer API 实现：
- 区块进入视口时：`opacity: 0 → 1` + `translateY(20px → 0)`
- 特性卡片依次淡入（stagger：每个延迟 100ms）
- 不使用第三方动画库，减小包体积

### 8.3 响应式断点

| 断点 | 宽度 | 布局 |
|------|------|------|
| 桌面 | ≥ 1024px | 全宽多列布局 |
| 平板 | 768px ~ 1023px | 两列 + 调整间距 |
| 移动端 | < 768px | 单列 + 汉堡菜单 |

### 8.4 CTA 跳转

所有"开始使用/登录控制台"按钮统一跳转到：
- 开发环境：`http://localhost:8080/login`
- 生产环境：`https://console.nova-ai.com/login`

通过 `VITE_ADMIN_URL` 环境变量配置。

---

## 9. 项目文件结构

```
portal/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AppHeader.vue
│   │   ├── HeroSection.vue
│   │   ├── WhySection.vue
│   │   ├── FeatureCard.vue
│   │   ├── ModelsSection.vue
│   │   ├── ModelLogo.vue
│   │   ├── InfrastructureSection.vue
│   │   ├── PillarCard.vue
│   │   ├── CTABanner.vue
│   │   ├── FAQSection.vue
│   │   ├── FAQItem.vue
│   │   └── AppFooter.vue
│   ├── data/
│   │   ├── site.ts
│   │   ├── features.ts
│   │   ├── models.ts
│   │   ├── infrastructure.ts
│   │   ├── faq.ts
│   │   ├── pricing.ts
│   │   └── stats.ts
│   ├── composables/
│   │   └── useScrollAnimation.ts  ← Intersection Observer hook
│   ├── styles/
│   │   └── main.css               ← Tailwind 入口 + 自定义样式
│   ├── App.vue
│   ├── main.ts
│   └── vite-env.d.ts
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── postcss.config.js
```

---

## 10. 设计权衡与决策

| # | 决策 | 选项 | 选择理由 |
|---|------|------|---------|
| D1 | 独立项目 vs monorepo 子应用 | 独立项目 | 门户与 Admin 生命周期不同，独立部署更灵活 |
| D2 | 静态数据 vs 后端 API | 静态数据 | MVP 阶段无后端改动需求，快速上线 |
| D3 | 纯 SPA vs SSR(SSG) | 纯 SPA | MVP 优先上线内容，SEO 后续优化 |
| D4 | Intersection Observer vs 第三方动画库 | Intersection Observer | 零依赖，减小包体积 |
| D5 | 子域名 vs 子路径 | 子域名 | SEO 友好，部署隔离 |

---

## 11. 风险与缓解

| # | 风险 | 等级 | 缓解方案 |
|---|------|------|---------|
| R1 | 门户与 Admin 品牌不一致 | 中 | 共用 Design Token 体系 |
| R2 | 静态数据过期 | 中 | 集中管理 + 版本标注 |
| R3 | 移动端体验不达标 | 中 | 移动优先设计，3 种断点验证 |
| R4 | SPA 首屏加载慢 | 低 | 代码分割 + 懒加载 + 预加载关键资源 |

---

## 12. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-27 | v1.0 | 初始版本 | Architect |

---

# End
