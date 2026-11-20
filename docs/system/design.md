# 系统设计

本文定义 AITI 网站的行为、数据、接口与构建方式。约束来源见[现实约束与要求](requirements.md)，验收见[测试与验收](verification.md)。

**不在本文范围**：界面视觉、版式、配色、动效分镜和界面文字。这些在后续界面设计中确定，但须满足本文定义的状态、接口和约束。本文提到“界面层”时，只规定它接收什么、触发什么。

## 一、总体结构

纯前端单页应用，构建产物为静态文件，部署在 GitHub Pages，访问地址 `https://gmh06.github.io/AITI/`。

| 层 | 内容 | 依赖 |
| :--- | :--- | :--- |
| 内容层 `content/` | 题目与人格长文（JSON，由文档导入）、维度与计分表（TypeScript，手写）（见第二节） | 纯数据，无依赖 |
| 核心层 `core/` | 计分、流程状态机、四维呈现数据、分享图合成、环境判断 | 纯 TypeScript，不依赖 React，全部可单元测试 |
| 界面层 `screens/` | 各状态的界面，手机与电脑各一种布局（见第八节） | React；视觉与动效待界面设计 |

核心层与界面层分开，是为了让界面设计可以晚于逻辑开发进行：界面层只读取状态、派发事件，替换或重做界面不影响计分和流程。

技术选型：

| 项 | 选择 | 理由 |
| :--- | :--- | :--- |
| 构建 | Vite | 产物为纯静态文件；资源文件名自动带内容哈希 |
| 语言与框架 | TypeScript + React | 状态和代号的类型约束能防止拼写错误 |
| 路由 | 不使用路由库 | 不做结果链接，状态只存在内存中 |
| 状态 | 一个 reducer | 状态少且线性，不需要状态库 |
| 测试 | Vitest | 与 Vite 共用配置 |
| 图片处理 | sharp（构建脚本） | 原始素材在构建时压缩，网页只引用产物 |
| 样式与动画 | 随界面设计确定 | 须满足首屏 JS、CSS 预算 |

目录：

```
web/
├─ package.json
├─ vite.config.ts              # base: '/AITI/'
├─ scripts/
│  ├─ build-assets.ts          # asset/ → src/generated/img/
│  ├─ check-budget.ts          # 构建后检查产物体积
│  └─ import-content.ts        # 一次性：tests_design.md、result_page.md → content/*.json，见第二节，不在任何自动流程中
├─ src/
│  ├─ content/                 # 站点内容数据，见第二节
│  │  ├─ types.ts              # 类型，以及极、代号、模型 ID 的常量列表
│  │  ├─ dimensions.ts         # 维度、极名、计分表，手写
│  │  ├─ questions.json        # 由 tests_design.md 导入
│  │  ├─ personalities.json    # 由 result_page.md 导入
│  │  └─ index.ts              # 导入 JSON 并加上类型
│  ├─ generated/               # 构建生成，不提交
│  ├─ core/
│  │  ├─ score.ts              # 计分与代号
│  │  ├─ flow.ts               # 状态机
│  │  ├─ dimensions.ts         # 四维呈现数据
│  │  ├─ share.ts              # 分享图合成
│  │  └─ env.ts                # 微信、文件分享、减少动态效果等判断
│  ├─ screens/                 # 界面层
│  └─ main.tsx
└─ tests/
```

`asset/` 下的素材由他人提供，留在仓库原位置；`web/` 的构建脚本只读取，不修改。

## 二、内容数据

只有两类内容从文档导入：10 道题（题干、选项、权重；【】括起的题目标题不导入），以及 16 个人格的名称、对应模型和描述。结果页与分享卡共用同一人格条目的 `description`。维度名、极名和界面文字写在代码里：

| 内容 | 位置 | 来源 |
| :--- | :--- | :--- |
| 10 道题 | `content/questions.json` | 由 [tests_design.md](../tests_design.md) 导入 |
| 16 个人格（名称、对应模型、描述） | `content/personalities.json` | 由 [result_page.md](../result_page.md) 导入 |
| 4 个维度名、8 个极名、计分表（主测、副测题号） | `content/dimensions.ts` | 手写，对照 [aiti_personality.md](../aiti_personality.md) 和 [tests_design.md](../tests_design.md) 第一节 |
| 按钮、提示、揭晓文案、错误信息等界面文字 | 界面层代码中 | 手写，随界面设计确定，没有统一的文案文件 |

构建和运行时都不读取、不解析 `docs/` 下的 Markdown 文档。

### 1. 导入与文档的关系

JSON 首次由脚本从文档生成，之后与文档各自独立。

| 项 | 规定 |
| :--- | :--- |
| 上线内容 | 题目和人格长文以 `web/src/content/` 的 JSON 为准，网页显示什么由它决定 |
| 首次生成 | 开发期运行一次 `scripts/import-content.ts`：读取 [tests_design.md](../tests_design.md) 和 [result_page.md](../result_page.md)，写出 `questions.json` 和 `personalities.json`。脚本是确定性的解析，不经过模型重新输入文字；“对应模型：GPT”这类名称到 `modelId` 的对应，在脚本里用一张固定的表。产出由人审阅 diff 后再提交 |
| 此后的修改 | 直接改 JSON，不再回头改文档，也不再运行脚本 |
| 脚本的状态 | 脚本留在仓库中存档，文件开头注明“已完成首次导入，不再使用”。输出文件已存在时脚本默认拒绝运行，要覆盖须显式加 `--force`，以免覆盖手改的内容 |
| 文档的状态 | [tests_design.md](../tests_design.md) 和 [result_page.md](../result_page.md) 开头各加一行说明：上线内容以 JSON 为准，导入后本文不再同步，仅用于讨论和存档。其余内容文档不受影响 |
| 一致性 | 不做同步，不做比对，也不再有人工核对清单 |

脚本只在开发者本机运行一次，不在 `npm test`、`npm run build` 和部署工作流中，所以不违反“构建和运行时不解析 Markdown”。

### 2. 数据结构

`types.ts` 先定义常量列表，再由列表推出类型，让校验测试和类型使用同一份来源：

```ts
export const DIMS = ['D1', 'D2', 'D3', 'D4'] as const
export const POLES = ['L', 'H', 'D', 'Q', 'R', 'U', 'S', 'A'] as const
export const CODES = ['LDRS', 'LQRS', 'LDRA', 'LQRA', 'LDUA', 'LQUA', 'LDUS', 'LQUS',
                      'HDRA', 'HQRA', 'HDRS', 'HQRS', 'HDUA', 'HDUS', 'HQUA', 'HQUS'] as const
export const MODEL_IDS = ['gpt', 'deepseek', 'glm', 'grok', 'kimi', 'claude', 'gemini', 'doubao'] as const

type Dim = typeof DIMS[number]
type Pole = typeof POLES[number]
type Code = typeof CODES[number]
type ModelId = typeof MODEL_IDS[number]

interface Dimension {                       // dimensions.ts 导出 Dimension[]，手写
  id: Dim
  name: string                              // '认知内核'
  pos: { letter: Pole; name: string }       // 第一个极，如 L 逻辑工程
  neg: { letter: Pole; name: string }       // 第二个极，如 H 人文表达
  primary: [number, number]                 // 主测题号，如 [1, 2]
  secondary: [number, number, number]       // 副测题号，如 [5, 6, 9]
}

interface Question {                        // questions.json 是 Question[]，10 项按题号排列
  id: number                                // 1..10
  scene: Text                               // 题干，界面上作为本题标题；文档中以【】括起的题目标题不导入
  options: Record<'A' | 'B' | 'C' | 'D', {
    text: Text
    weights: Partial<Record<Pole, 1 | 2>>   // 如 { "H": 2, "Q": 1 }
  }>
}

interface Personality {                     // personalities.json 是 Record<Code, Personality>
  persona: string                           // '硬核工程师'
  model: string                             // 'GPT'
  modelId: ModelId
  description: Text                         // 结果页与分享卡共用正文
}

type Text = string | Segment[]
type Segment = { text: string; style?: 'em' | 'code' }
```

`index.ts` 用 `resolveJsonModule` 导入两个 JSON，加上上述类型后导出。JSON 导入的类型只是宽泛的 `string`，TypeScript 无法检查代号是否齐全、权重是否合法，所以这一层由第 3 小节的测试负责，不依赖编译器，也不引入运行时校验库，以免占用首屏 JS 预算。

几点约定：

- **文本不含标记**。字符串里不写 `**`、`` ` `` 之类的 Markdown 符号。需要强调或等宽显示的片段（如选项里的 `Segmentation Fault`、`git diff`）写成 `Segment[]`，由界面层决定如何呈现。导入脚本负责把 Markdown 标记转成 `Segment[]`。
- **权重按极字母书写**，如 `{ "H": 2, "Q": 1 }`。计分前由 `core/score.ts` 换成有符号数：第一个极为正，第二个极为负，例如 `{ H: 2 }` 换成 `{ D1: -2 }`。
- **计分表**写在 `Dimension` 的 `primary` 和 `secondary` 中，与题目权重分开维护。两者来源不同（一个手写，一个导入），第 3 小节的测试会交叉检查它们，这同时能发现导入时的权重错误。

### 3. 校验

JSON 没有字面量类型，代号缺一个、权重写成 3、模型 ID 拼错，编译器都不会报。因此这些规则都由 Vitest 校验，部署工作流在构建前运行测试，不通过就不部署：

1. **结构**：两个 JSON 的字段齐全、类型正确；`weights` 的键属于 `POLES`、值只能是 1 或 2；`modelId` 属于 `MODEL_IDS`；题号合法。
2. 8 个极字母互不相同，4 个维度各占两个。
3. 题目编号为 1～10 连续。
4. 同一选项里不会同时出现一个维度的两极。
5. 每个选项涉及的维度和分值与计分表一致：该题是某维度的主测题时，该维度分值为 2；是副测题时为 1；不涉及的维度没有分值。
6. `personalities.json` 的键恰好是 `CODES` 的 16 个值，不多不少；每个代号由 D1～D4 各取一个极字母组成；每个 `modelId` 恰好对应 2 个代号。
7. 文本中不含 `**`、`` ` `` 等 Markdown 标记残留。

每条规则另配一份故意写错的测试数据，确认能检出（见[测试与验收](verification.md)）。

以下情况只在测试输出中提示、不判失败：某题四个选项没有覆盖它所测两个维度的全部四种正负组合。这时各结果出现的概率会不均匀，属于内容取舍，由内容负责人确认。

## 三、计分

1. 每个维度的得分为 10 道题所选选项在该维度的权重之和。第一个极（L / D / R / S）为正，第二个极（H / Q / U / A）为负。
2. 每个维度有 2 道主测题（±2）和 3 道副测题（±1），得分范围为 −7～+7。主测部分之和为偶数，副测部分之和为奇数，所以总分必为奇数，只可能是 ±1、±3、±5、±7，不存在 0，也就没有平局。这个性质依赖当前计分表的结构，由[自动化测试](verification.md)穷举全部作答组合来保证，计分表变动后会被立即发现。
3. 每个维度按得分符号取一个字母，按 D1～D4 顺序拼成代号。

四维呈现数据由 `dimensions.ts` 计算，结果页和分享图共用：

```ts
interface DimensionView {
  dim: Dim
  name: string          // 维度名，如 '认知内核'
  pos: Dimension['pos'] // 右端的字母和中文极名
  neg: Dimension['neg'] // 左端的字母和中文极名
  side: 'pos' | 'neg'   // 得分为正取 pos
  letter: string        // 所取极的字母
  poleName: string      // 所取极的中文名
  ratio: number         // |得分| / 7，取值 1/7、3/7、5/7、1
}
```

`ratio` 是条形长度相对于该侧最大长度的比例。条形的具体形态由界面设计和分享图版式决定。界面层不得显示原始分数或程度词。

## 四、流程与状态

### 1. 状态

| 状态 | 数据 | 说明 |
| :--- | :--- | :--- |
| `intro` | 无 | 首页 |
| `quiz` | 当前题号 `index`（0～9）、已选答案 | 一页一题 |
| `reveal` | 计算出的结果 | 揭晓过程 |
| `result` | 结果 | 结果页 |

结果 = 代号 + 四维得分。状态只存在内存中，不写入任何存储，刷新或关闭页面后回到 `intro`。

### 2. 事件与转换

| 当前状态 | 事件 | 结果 |
| :--- | :--- | :--- |
| `intro` | `START` | `quiz`，`index = 0`，答案清空 |
| `quiz` | `ANSWER(index, key)` | 记录答案；`index < 9` 时进入下一题，否则计算结果并进入 `reveal` |
| `quiz` | `BACK` | `index > 0` 时回到上一题，已选答案保留并显示；`index = 0` 时回到 `intro` |
| `reveal` | `REVEAL_DONE` 或 `BACK` | `result` |
| `result` | `BACK` | `intro` |
| `result` | `RESTART` | `intro`，答案清空 |

`ANSWER` 带上发出时的题号；题号与当前 `index` 不一致时忽略。快速连点同一题时，只有第一次生效，不依赖时间防抖。

### 3. 系统返回键

安卓返回键、iOS 和微信的侧滑返回默认会离开站点。处理方式：离开 `intro` 时用 `history.pushState` 压入一条记录；每次触发 `popstate` 时派发 `BACK`，若新状态不是 `intro`，再压入一条记录。在 `intro` 按返回键则正常离开站点。

### 4. 揭晓过程的接口

揭晓的视觉表现待界面设计确定，但必须满足：

| 要求 | 说明 |
| :--- | :--- |
| 输入 | 结果，以及该结果角色图的加载状态 |
| 结束 | 播放完毕后派发 `REVEAL_DONE` |
| 跳过 | 点击或触摸任意位置，或在电脑上按 Enter、空格、Esc，立即派发 `REVEAL_DONE` |
| 减少动态效果 | 系统开启“减少动态效果”时不播放，直接派发 `REVEAL_DONE` |
| 等图 | 角色图未加载完成前不进入需要显示角色的阶段；超过 8 秒仍未加载完成，进入 `result` 并显示加载失败与重试 |
| 角色图 | 揭晓和结果页共用原尺寸的透明无文字版，结果页将角色绘制在框线前 |

实现揭晓效果时的技术限制：

- 角色图源文件宽 1024px。只有“显示宽度（CSS px）× 放大倍数 × `devicePixelRatio` ≤ 1024”时画面才清晰。手机屏幕物理宽度一般为 1080～1290px，所以全屏显示时任何放大都会变糊，揭晓效果不应依赖清晰的局部放大。
- 不对大面积区域使用逐帧变化的 SVG 滤镜（如每帧更换种子的 `feTurbulence`），中低端安卓上会掉帧。

### 5. 图片加载

- 首屏不加载任何角色图。
- 作答第 10 题后立即预加载该结果的角色图。打开保存窗口后才加载宣传图素材。
- 图片加载失败时显示失败状态和重试操作，流程不卡住。
- 题目、人格等内容打包在 JS 中，页面加载后断网仍可答题和看文字结果，只有图片需要网络。

## 五、分享图

在结果页点击「保存图片」会打开预览窗口。窗口状态保留在结果页内，关闭后回到触发按钮。生成失败时可在窗口内重试。

### 1. 合成

1. 打开保存窗口时加载铭文卡纸纹、原字标、模型字样、当前角色图、主视觉衍生城市图和卡背二维码。顶部左侧为 Beyond Context，右侧为 AITI。上半部左列依次为人格名、四字母代号和模型名，右列为角色。
2. 在宽 1080、起始高 1440 像素的画布上，将低透明度主视觉铺在中间内容区。四维条在上，正文在下，段落首行缩进两个字。正文和结果页共用 `web/src/content/personalities.json` 中该人格的 `description`。描述为富文本片段时，按顺序拼接各片段的文字供画布排版。
3. 画布底部以铭文卡字体绘制学生节信息，配卡背同款圆角二维码，指向 `https://gmh06.github.io/AITI/`。较长的文案自动换行，必要时增加画布高度，确保文案和底部信息栏各有空间。
4. 导出 JPEG 并以 `<img>` 显示在预览窗口中。

### 2. 保存

保存方式按环境区分：

| 环境 | 方式 |
| :--- | :--- |
| 微信内置浏览器 | 只提示长按图片保存；图片地址用 data URL（微信对 blob URL 的长按识别不可靠，须真机验证） |
| 支持 `navigator.canShare({ files })` 的触屏浏览器 | 保存按钮调起系统分享面板，用户可存入相册 |
| 其余浏览器 | 保存按钮通过 `<a download>` 下载；同时保留长按或右键保存 |

微信的判断依据是 UA 中的 `MicroMessenger`。

## 六、资源构建

`build-assets` 压缩原始素材并输出到 `src/generated/img/` 和 `src/generated/share/`。Vite 生成的产物文件名带内容哈希，素材更新后地址随之变化。

| 资源 | 来源 | 输出 | 单张上限 |
| :--- | :--- | :--- | :--- |
| 揭晓和结果页角色图 ×8 | 角色取用索引中的 `transparent` 路径 | 带透明通道的 WebP，保持原宽 1024，质量 80 | 150 KB |
| 分享卡纸纹、字标和模型字样 | `asset/design/card-studies/engraved-v1/fronts.drawio` | 纸纹 WebP、透明字标 PNG | 250 KB |
| 分享卡内容衬底和二维码 | `asset/design/backgrounds/v3/city-landscape.png`、铭文卡背的 `aiti-qr.png` | 城市背景 WebP、二维码 PNG | 250 KB |
| 宣传图透明角色 ×8 | `asset/nonhuman/cards/transparent/v1/` | 保留角色与道具，最长边 400 px 的 WebP | 150 KB |
| 主视觉 | `asset/Festival/` | 是否使用及尺寸随界面设计确定 | 随用途确定 |

揭晓用角色图缺失时，开发模式使用占位图并告警。发布构建仅在设置 `AITI_ALLOW_PLACEHOLDER=1` 时允许揭晓用占位图，上线前须去掉该变量。

分享卡的人格名、代号和活动信息用站酷庆科黄油体，四维标签与正文用得意黑。两份字体子集随站点发布，打开保存窗口时加载。文案新增字符时，可用 `tools/art/prepare-share-fonts.py` 更新字形覆盖。

`check-budget` 在构建后检查首屏 JS（gzip ≤ 150 KB）和 CSS（gzip ≤ 20 KB），超出时构建失败。

## 七、部署

1. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**（一次性手动操作，目前尚未启用）。
2. 推送到 `main` 触发工作流：检出 → 安装 Node 24 LTS → 在 `web/` 执行 `npm ci` → `npm test` → `npm run build` → 上传 `web/dist` → 部署到 Pages。测试不通过时不部署。
3. `vite.config.ts` 的 `base` 为 `/AITI/`，与仓库名一致。已印刷的二维码指向 `https://gmh06.github.io/AITI/`，仓库不能再改名。
4. 本地 `origin` 仍指向旧地址 `https://github.com/gmh06/THUCST-StudentFestival-AITI`，GitHub 会自动重定向，建议改为新地址。

不使用 Service Worker 和任何离线缓存，避免内容更新后用户仍看到旧版本。

## 八、设备适配

手机和电脑走同一个状态机、读同一份数据，区别只在界面层：每个状态提供手机布局和电脑布局两种。两种布局的具体版式由界面设计确定，本节只规定切换方式和各自必须处理的技术问题。

### 1. 切换方式

| 项 | 规定 |
| :--- | :--- |
| 依据 | 视口宽度。宽度小于 768 CSS px 用手机布局，否则用电脑布局。阈值可以调整，但须保证[现实约束与要求](requirements.md)第二节的屏幕范围各自落在对应布局内 |
| 不用 UA 判断 | 设备类型不从 UA 推断。UA 只用于判断微信（第五节第 2 小节） |
| 实现 | 用 CSS 媒体查询切换布局；需要在脚本中区分时，用 `matchMedia` 读取同一阈值，阈值只定义一处 |
| 切换时机 | 旋转屏幕或调整窗口跨过阈值时立即切换，当前状态和已选答案不丢失 |
| 资源 | 两种布局共用同一套图片 |

### 2. 手机布局须处理

| 问题 | 处理 |
| :--- | :--- |
| 刘海与底部手势条 | 用 `viewport-fit=cover` 和 `env(safe-area-inset-*)` 留出安全区 |
| 地址栏收起导致高度变化 | 需要占满一屏的区域用 `dvh` 而非 `vh`，iOS Safari 15.4 以下不支持 `dvh`，同时写一条 `vh` 作为回退 |
| 微信底部工具栏 | 关键按钮不贴屏幕最底边，避免被工具栏遮挡 |
| 误触缩放 | 可点元素设 `touch-action: manipulation`，避免双击缩放；不禁止双指缩放 |
| 横屏 | 内容可完整查看和操作，不要求专门设计 |

### 3. 电脑布局须处理

| 问题 | 处理 |
| :--- | :--- |
| 键盘操作 | 所有可操作元素用原生 `<button>`，可用 Tab 依次聚焦、Enter 或空格触发；焦点样式不得去掉 |
| 焦点转移 | 切换状态或题目后，焦点移到新内容的第一个可操作元素或标题，键盘用户不需要从页面顶部重新找 |
| 后退 | 浏览器后退按钮与手机系统返回键相同，触发 `BACK`（第四节第 3 小节） |
| 图片清晰度 | 屏幕更大时角色图的显示尺寸也更大。显示宽度（CSS px）× `devicePixelRatio` 超过 1024 时画面会变糊，因此须限制角色图的最大显示宽度 |
| 保存分享图 | 走第五节第 2 小节的下载方式，同时保留右键另存 |

## 九、兼容

| 能力 | 用途 | 不支持时 |
| :--- | :--- | :--- |
| WebP | 角色图、底图 | 支持范围内的浏览器均支持，不做降级 |
| canvas 导出 | 分享图 | 显示失败提示，引导截屏 |
| `navigator.share` 文件分享 | 保存分享图 | 改用下载或长按 |
| `prefers-reduced-motion` | 跳过揭晓 | 按未开启处理 |
| History API | 拦截返回键 | 支持范围内均支持 |
