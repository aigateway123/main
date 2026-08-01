# Nova AI Gateway 门户网站 — 设计原型

Nova AI Gateway 的公众门户网站设计原型，基于 React + TypeScript + Vite + Tailwind CSS 构建。

## 页面

- **首页** — 单页滚动式 Landing Page，包含：
  - Header 导航栏
  - Hero 主视觉区（含代码示例 + 实时数据统计）
  - 6 大产品特性卡片
  - 10 个支持模型展示
  - 基础设施 4 大支柱
  - 成本计算器
  - 三档定价套餐
  - CTA 行动号召
  - FAQ 手风琴
  - Footer
- **弹窗交互**：
  - Console 模态框
  - Playground API 沙盒

## 技术栈

| 技术 | 版本 |
|------|------|
| React | 18.x |
| TypeScript | 5.x |
| Vite | 6.x |
| Tailwind CSS | 3.x |
| lucide-react | 图标库 |

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

开发服务器默认运行在 `http://localhost:3001`。

## 目录结构

```
nova-ai-gateway-portal/
├── src/
│   ├── components/       # UI 组件
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── ModelWall.tsx
│   │   ├── Infrastructure.tsx
│   │   ├── CostCalculator.tsx
│   │   ├── Pricing.tsx
│   │   ├── CtaBanner.tsx
│   │   ├── FaqSection.tsx
│   │   ├── Footer.tsx
│   │   ├── ConsoleModal.tsx
│   │   └── PlaygroundModal.tsx
│   ├── data/
│   │   └── mockData.ts   # 所有静态展示数据
│   ├── types.ts          # TypeScript 类型定义
│   ├── App.tsx           # 根组件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式 + Tailwind
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 相关文档

- [PRD 文档](../../01-product/PRD-20260727-Public-Portal.md)
- [架构设计](../../02-architecture/ARCH-20260727-Public-Portal.md)
- [AI 设计提示词](../../01-product/Portal-Design-Prompts.md)
- [迭代 Release Note](../../08-Release/RN-20260727-P1-Iteration-002.md)
