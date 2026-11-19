# 技术方案

站点的技术选型、构建配置、资源规格与部署方式。系统形态见[系统总览](overview.md)，页面与动画见[页面与交互](pages.md)。

## 一、总体形态

纯前端静态站点：没有后端、没有数据库、没有账号，也不调用任何大模型。所有计算（答题、计分、结果匹配）都在浏览器里完成，构建产物是纯静态文件。

**不做的技术项**：服务端渲染、PWA、Service Worker、埋点分析、登录鉴权、运行时配置。

## 二、技术栈

| 项 | 选择 | 理由 |
| :--- | :--- | :--- |
| 构建 | Vite | 静态产物直接可用，配置最少 |
| 框架 | React + TypeScript | 6 个状态的状态机足够，类型能防止 16 个代号写错 |
| 样式 | Tailwind CSS | 快速搭版式；动画参数少量用自定义 CSS |
| 动画 | 纯 CSS keyframes | 3 秒分镜是固定脚本，不需要动画库；少一个依赖、少约 50KB |
| 路由 | **不使用** | 无结果链接需求，单页状态切换即可 |
| 状态 | React `useState` + 一个 reducer | 不需要状态库 |
| 二维码 | 构建期用 `qrcode` 生成，产物为 PNG/SVG | 运行时不生成 |

## 三、目录结构

```
web/
├─ index.html
├─ vite.config.ts            # base: '/AITI/'
├─ tailwind.config.js
├─ scripts/
│  └─ build-images.mjs       # 从 asset/ 生成压缩图到 public/
├─ public/
│  ├─ img/characters/        # {modelId}.webp ×8，无文字版
│  ├─ share/                 # 卡片底图 ×16
│  ├─ brand/                 # 主视觉与 Beyond Context 字标
│  └─ qr/                    # 生成的活动二维码
└─ src/
   ├─ main.tsx
   ├─ App.tsx                # 状态机：intro / quiz / reveal / result / card
   ├─ screens/
   │  ├─ Intro.tsx  Quiz.tsx  Reveal.tsx  Result.tsx  Card.tsx  Screen.tsx
   ├─ data/
   │  ├─ personalities.ts    # 16 个代号
   │  ├─ questions.ts        # 10 道题
   │  └─ dimensions.ts       # 4 个维度与档位
   ├─ lib/
   │  ├─ score.ts            # 计分与代号计算
   │  └─ crop.ts             # 8 个取景参数
   └─ styles/
```

## 四、构建配置

```ts
// vite.config.ts
export default defineConfig({
  base: '/AITI/',            // 项目页在子路径下，缺了这行所有资源 404
  build: { outDir: 'dist', assetsInlineLimit: 4096 },
})
```

## 五、部署

部署到 GitHub Pages，地址：

```
https://gmh06.github.io/AITI/
```

流程：

1. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**
2. 推送到 `main` 触发构建
3. 工作流：`checkout` → `setup-node 20` → `npm ci`（工作目录 `web/`）→ `npm run build` → `upload-pages-artifact`（路径 `web/dist`）→ `deploy-pages`
4. 首次部署后在手机与电脑各打开一次，确认资源全部加载（`base` 配错时表现是白屏或样式全丢）

**注意**：Pages 未启用前访问会返回 404，属正常现象；目前该仓库尚未启用 Pages。

## 六、资源规格与预算

原始素材体积远超网页可用范围（`asset/Festival/background/1.png` 为 13000×5000、35.9MB），必须由构建脚本降采样压缩。**原始素材保留在仓库，网页只引用压缩产物。**

| 资源 | 来源 | 输出规格 | 单张预算 |
| :--- | :--- | :--- | :--- |
| 角色插画 | `asset/nonhuman/cards/textfree/*.png` | WebP，限宽 900，质量 80 | ≤ 150 KB |
| 卡片底图 | 卡片设计环节提供 | WebP，限宽 1200，质量 82 | ≤ 250 KB |
| 主视觉背景 | `asset/Festival/background/` | WebP，限宽 2560，质量 75 | ≤ 400 KB |
| Beyond Context 字标 | `asset/Festival/BeyondContext/*.png` | 保留透明 PNG 或 WebP，限宽 1200 | ≤ 60 KB |

整体预算：

| 指标 | 目标 |
| :--- | :--- |
| 首屏 JS（gzip） | ≤ 150 KB |
| 首屏 CSS（gzip） | ≤ 20 KB |
| 首屏图片 | ≤ 200 KB |
| 单次会话实际加载 | ≈ 1 张角色图 + 1 张卡片底图 |
| 4G 下 LCP | ≤ 2.5 s |

**字体**：只用系统字体栈（`-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`），不引入外部字体文件，避免首屏阻塞与授权问题。

## 七、图片加载策略

- 首屏**不预加载**任何角色图——用户可能直接退出，8 张图全预载约 1.2MB 是浪费。
- 第 10 题作答完成后，立即 `new Image()` 预取目标角色图；揭晓动画开头的噪声阶段正好是加载窗口。
- 图片加载失败时显示纯色占位与重试提示，不让页面卡死在动画里。
- 分享图只在进入电子卡页时加载。

## 八、分享图的合成

分享图**不能预先出图**：四维强度因人而异，单维 4 种强度、四维 256 种组合、乘 16 个人格共 4096 张。因此采用「底图 + 运行时叠加」：

1. 加载该人格的卡片底图（16 款之一）。底图上已画好角色、人格名、模型与代号、描述、寄语、二维码、学生节信息，以及 4 条四维空槽与维度名
2. `ctx.drawImage(底图)`，再按本次得分在 4 个槽位内填充彩色条
3. `canvas.toBlob('image/png')` 导出并触发下载

设计环节需额外交付 4 个槽位的矩形坐标（`x, y, w, h`，单位为底图像素），见[内容与版本](content.md)。

实现要点：

| 项 | 要求 |
| :--- | :--- |
| 字体 | 导出前等待 `document.fonts.ready`，避免文字未就绪 |
| canvas 尺寸 | 取底图原始尺寸，避免二次缩放导致模糊 |
| 条形颜色 | 取自主视觉，不在运行时另设 |
| iOS 保存 | `download` 属性行为不一致；失败时提示用户长按图片 |

## 九、二维码

| 项 | 规定 |
| :--- | :--- |
| 内容 | `https://gmh06.github.io/AITI/`（29 字符） |
| 纠错等级 | **Q（25%）**——29 字符在 M 与 Q 下模块数相同，取 Q 不增加密度 |
| 输出 | 构建期生成 PNG（≥1024px）与 SVG 两种，交付给做卡的人 |
| 印刷尺寸 | 不小于 2.5cm |
| 文字标注 | **不加**——卡片、分享图、大屏上的二维码都不在旁边标网址 |
| 验收 | 必须打印实物测扫，屏幕上看不算 |

## 十、兼容与降级

| 项 | 目标 |
| :--- | :--- |
| iOS Safari | 15 及以上 |
| 微信内置浏览器 | 主战场，功能需一致；保存图片依赖长按 |
| Android Chrome | 100 及以上 |
| 桌面 Chrome / Edge / Safari | 最新版 |

降级路径：

- `prefers-reduced-motion: reduce` → 跳过揭晓动画，直接显示结果页
- 连续掉帧（超过 10 帧单帧耗时 > 32ms）→ 动画降级为「淡入 + 轻微缩放」
- 不支持 `backdrop-filter` 等新特性时用纯色替代，不阻塞流程

## 十一、为什么不用其它方案

| 方案 | 不采用的原因 |
| :--- | :--- |
| Next.js | 不需要服务端能力，静态站用它会明显更重 |
| 引入动画库 | 3 秒固定分镜用 CSS 足够，依赖越少现场越稳 |
| Service Worker 缓存 | 活动当天最怕「改了内容但用户看到旧的」，不做缓存最安全 |
| PWA 安装 | 现场是扫码即用，没有安装场景 |
