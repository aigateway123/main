# 修复计划: Hero 代码块区域行距与换行问题

## 当前问题

HeroSection.vue 的代码展示块中存在两个问题：

1. **行间距过大**：代码容器使用 `leading-relaxed`（line-height: 1.625），对于等宽字体的代码展示来说太松散，导致代码行之间的垂直间距过大。
2. **长行无折行**：部分代码行（尤其 Go 和 cURL）长度超出容器宽度，虽然 `overflow-x-auto` 提供了横向滚动，但在小屏设备上体验差。

## 修改方案

### 文件 1: `portal/src/components/HeroSection.vue`

**位置**：第 162 行，代码内容容器 div 的 class

**当前**：
```html
<div class="p-4 sm:p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
```

**改为**：
```html
<div class="p-4 sm:p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-snug">
```

**改动**：`leading-relaxed` → `leading-snug`

**理由**：
- `leading-snug`（line-height: 1.375）比 `leading-relaxed`（1.625）紧凑约 18%
- 代码是等宽字体，需要更紧密的行距以保持可读性
- 与主流代码编辑器/IDE 的默认行距一致（~1.35）
- 不丢失任何功能，只改一个 class 值

### 文件 2: `portal/src/style.css`

添加一个针对代码块长行的样式规则，让超出容器的代码行自动折行而非强制横向滚动：

```css
/* Code block long line wrapping */
.code-block pre {
  white-space: pre-wrap;
  word-break: break-word;
}
```

或者在 HeroSection.vue 的模板中直接添加 `whitespace-pre-wrap` 到 `<pre>` 标签（第 163 行）。

**推荐在模板中直接改，不增加额外 CSS**：

第 163 行：
```html
<pre class="text-slate-300 whitespace-pre-wrap break-words">
```

**理由**：
- `whitespace-pre-wrap` 保留空格和换行，同时允许长行自动折行
- `break-words` 确保超长单词（如 URL）也会折行
- 不需要额外的 CSS 文件修改

### 不修改的部分

- 数据文件 `src/data/codeSamples.ts` — 代码内容本身没问题
- 行号显示逻辑 — 行号与代码行的对应关系正确
- URL 高亮逻辑 — 高亮功能正常
- 复制功能 — 复制的是原始代码内容，不受显示样式影响

## 验证方式

1. `npm run dev` 启动后，在浏览器中检查代码块：
   - 行间距明显缩小，更接近代码阅读习惯
   - 长行自动折行到下一行，不再溢出容器
   - 行号与代码行对齐正确
2. 切换 4 种语言标签，确保每种语言显示正常
3. 缩窄浏览器到 375px 宽度，确认代码块在小屏上也能完整阅读
4. 复制按钮功能仍然正常
