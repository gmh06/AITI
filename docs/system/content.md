# 内容与版本

站点用到的全部文案、题目、角色图与分享图的来源、结构、校验与冻结安排。页面结构见[页面与交互](pages.md)。

## 一、内容来源

| 内容 | 权威来源 | 站点中的位置 |
| :--- | :--- | :--- |
| 四个维度与八个极 | [AITI 人格分类](../aiti_personality.md) | `data/dimensions.ts` |
| 10 道题与权重 | [题库与计分规则](../tests_design.md) | `data/questions.ts` |
| 16 个人格名与模型对应 | [模型人格设定](../model_character.md) | `data/personalities.ts` |
| 16 段人格描述 | [结果页文案](../result_page.md) | `data/personalities.ts` |
| 8 张角色插画（无文字版） | [无文字版插画需求](../art/textfree-assets.md) | `public/img/characters/` |
| 16 张分享图 | 由卡片设计与出图环节提供 | `public/share/` |
| 主视觉与字标 | `asset/Festival/` | `public/brand/` |

原则：**文档是唯一事实来源，代码里的数据必须由文档抄写而来**。文档与代码不一致时以文档为准，并修代码。

## 二、数据结构

```ts
type Dim = 'D1' | 'D2' | 'D3' | 'D4'
type Code = 'LDRS' | 'LQRS' | ... // 共 16 个

interface Personality {
  code: Code              // 'LDRS'
  persona: string         // '硬核工程师'
  model: string           // 'GPT'
  modelId: string         // 'gpt'，用于图片路径
  description: string     // 200 字以上的完整描述
}

interface Question {
  id: number              // 1..10
  title: string           // '【凌晨两点的 FIT 楼机房】'
  scene: string           // 场景描述
  options: {
    key: 'A' | 'B' | 'C' | 'D'
    text: string
    weights: Partial<Record<Dim, number>>  // 如 { D1: +2, D2: +1 }
  }[]
}
```

图片路径约定：

| 类型 | 路径 | 数量 |
| :--- | :--- | :--- |
| 角色插画 | `public/img/characters/{modelId}.webp` | 8（两个人格共用一张） |
| 分享图 | `public/share/{CODE}.webp` | 16 |

## 三、计分与四维呈现

### 计分

每个维度的得分由两部分相加：主测题每题贡献 ±2，副测题每题贡献 ±1，因此单维满分为 ±7。

| 维度 | 主测题（±2） | 副测题（±1） |
| :--- | :--- | :--- |
| D1 认知内核 | Q1、Q2 | Q5、Q6、Q9 |
| D2 思考倾向 | Q3、Q4 | Q1、Q7、Q10 |
| D3 对齐模式 | Q5、Q6 | Q4、Q8、Q9 |
| D4 交互姿态 | Q7、Q8 | Q2、Q3、Q10 |

主测部分之和必为偶数（−4 / 0 / +4），副测部分之和必为奇数（±1 / ±3），两者相加**必为奇数**，因此得分只可能是 ±1、±3、±5、±7，不会出现 0，也就不存在平局。四维各取符号即得到 16 个代号之一。

**符号约定**：每个维度中第一个极取正、第二个极取负——D1 的 `L` 为正、`H` 为负；D2 的 `D` 为正、`Q` 为负；D3 的 `R` 为正、`U` 为负；D4 的 `S` 为正、`A` 为负。得分的符号直接决定该维度取哪个字母。

### 呈现

网页只表达方向与强弱，**不显示原始分数**——分数容易被误读成「高低分」。

| \|得分\| | 档位文字 | 条长 | 示例 |
| :--- | :--- | :--- | :--- |
| 1 | 略偏 | 14% | 略偏 · 逻辑工程 |
| 3 | 偏向 | 43% | 偏向 · 人文表达 |
| 5 | 明显 | 71% | 明显 · 深度思考 |
| 7 | 极强 | 100% | 极强 · 顺性配合 |

条长 = |得分| ÷ 7，条形向右延展表示取该维度第一个极（L / D / R / S），向左表示第二个极（H / Q / U / A）。

## 四、16 个人格的落地数据

| 代号 | 人格 | 模型 | 角色图 | 分享图 |
| :--- | :--- | :--- | :--- | :--- |
| `LDRS` | 硬核工程师 | GPT | `characters/gpt.webp` | `share/LDRS.webp` |
| `LQRS` | 叠甲老官僚 | GPT | `characters/gpt.webp` | `share/LQRS.webp` |
| `LDRA` | 贪吃肥鱼 | DeepSeek | `characters/deepseek.webp` | `share/LDRA.webp` |
| `LQRA` | 开源游侠 | DeepSeek | `characters/deepseek.webp` | `share/LQRA.webp` |
| `LDUA` | 卷王技术员 | GLM | `characters/glm.webp` | `share/LDUA.webp` |
| `LQUA` | 金牌雇佣兵 | GLM | `characters/glm.webp` | `share/LQUA.webp` |
| `LDUS` | 混世魔王 | Grok | `characters/grok.webp` | `share/LDUS.webp` |
| `LQUS` | 毒舌键盘侠 | Grok | `characters/grok.webp` | `share/LQUS.webp` |
| `HDRA` | 图书管理员 | Kimi | `characters/kimi.webp` | `share/HDRA.webp` |
| `HQRA` | 摇滚浪漫诗人 | Kimi | `characters/kimi.webp` | `share/HQRA.webp` |
| `HDRS` | 名门军师 | Claude | `characters/claude.webp` | `share/HDRS.webp` |
| `HQRS` | 道德标兵 | Claude | `characters/claude.webp` | `share/HQRS.webp` |
| `HDUA` | 首席笔杆子 | Gemini | `characters/gemini.webp` | `share/HDUA.webp` |
| `HDUS` | 情商大师 | Gemini | `characters/gemini.webp` | `share/HDUS.webp` |
| `HQUA` | 情绪甜心 | 豆包 | `characters/doubao.webp` | `share/HQUA.webp` |
| `HQUS` | 直觉派实习生 | 豆包 | `characters/doubao.webp` | `share/HQUS.webp` |

## 五、内容校验清单

上线前逐条核对，任何一条不通过都不能冻结：

- [ ] 16 个代号齐全且唯一，无重复无遗漏
- [ ] 每个模型恰好对应 2 个代号，共 8 个模型
- [ ] 16 段描述与[结果页文案](../result_page.md)逐字一致
- [ ] 10 道题的选项权重与[题库与计分规则](../tests_design.md)一致
- [ ] 8 张角色图存在，且为无文字版
- [ ] 16 张分享图存在，文件名与代号一一对应
- [ ] 随机自测 20 次，结果代号分布正常，无报错、无空数据

## 六、版本与冻结

- 站点**不设运行时版本号**，也没有历史记录；内容改动即随提交发布。
- 站内唯一的时间概念是构建时间，可用于页脚或排查问题。
- **分享图是静态图片**：一旦改了某个人格的描述，必须同步重出该人格的分享图，否则网页文字与保存下来的图片会不一致。这条是最容易漏的地方。
- 冻结时间：**11月25日**。冻结后只允许修错字级别改动；若动了描述文案，必须重新导出对应分享图。
