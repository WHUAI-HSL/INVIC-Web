# 项目阅读

该项目当前所有文本与配置文件（ `index.html`、`config.js`、`content-loader.js`、`content-loader.js.backup`、`markdown-styles.css`、`website_manager.py`、`data/**/*.md`）

## 项目目标与定位
- 这是一个单页展示型团队网站（WHUAI · INVIC），用于对外展示团队形象、研究成果、事件时间线与图片集。
- 内容结构强调团队实力与叙事感：Hero + Story + Bento 卡片 + Publications + Timeline + Gallery + 尾页。

## 设计与视觉风格
- 深色基调与 Apple 风格玻璃质感（半透明卡片、模糊、细边框、强对比文字）。
- 视觉强调“高端/科技感”：渐变文字、光晕、背景素材叠层、卡片 hover 位移。
- 动效密集但克制：GSAP/ScrollTrigger 驱动首屏入场、分段故事、内容逐步 reveal。

## 技术栈与实现方式
- 页面：`index.html` 单页 + Tailwind CDN + 自定义内联 CSS。
- 动画：GSAP + ScrollTrigger + TextPlugin。
- Markdown 渲染：`marked`，配合 `markdown-styles.css` 统一内容样式。
- 数据驱动：`config.js` 提供团队、论文、事件、图片的结构化清单。
- 内容加载：`content-loader.js` 在前端 `fetch` 读取 Markdown，渲染到指定容器，并提供详情模态框。

## 自动化与内容管理
- `website_manager.py` 负责：
  - 初始化目录结构
  - 扫描 `data/` 自动生成 `config.js`
  - 交互式添加成员/论文/事件
  - 基础完整性校验
- `config.js` 是自动生成文件，数据来自 `data/` 目录结构与文件命名规则。

## 内容结构（数据与模板）
- `data/team/bios/*.md`：成员简介，标题即姓名；头像默认匹配同名图片，否则回退默认头像。
- `data/publications/*.md`：论文列表，标题/Authors/Venue/Abstract 用于卡片摘要。
- `data/events/*.md`：事件时间线，标题 + 正文首段用于摘要。
- `data/gallery/*`：图片走 `config.js` 列表渲染，点击后新标签页查看。

## 组件与交互要点
- Bento 卡片点击打开大模态框（Team/Achievements/Tech/Mission）。
- Publications 点击打开详情模态框（Markdown 渲染）。
- Team 成员卡片在 Modal1 内动态插入，点击打开成员详情模态框。
- Gallery 横向滚动展示，点击图片打开新标签页。

## 备注
- `content-loader.js` 标注“修复版”，与 `content-loader.js.backup` 对照可看出对 Publications 黑屏问题的修正。
- `index.html` 中存在一段疑似残留文本（`// Modal functions` 后的 `okay` 行）。

---

