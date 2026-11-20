# AITI · Beyond Context

清华大学计算机科学与技术系第44届学生节路演互动活动。

An interactive AI personality quiz for the roadshow of Tsinghua CS's 44th Student Festival, **Beyond Context**.

## 项目简介

AITI 是一项趣味 AI 人格测试活动，计划在学生节前的路演中与同学们见面。

我们希望通过轻松、有参与感的互动，让同学们发现自己更多面的可能，并与本届学生节的主题 **Beyond Context** 建立联系。

## 主题背景

- **Context 帮助我们理解世界。** 大模型依靠上下文理解信息；人的家庭、学校、专业、朋友与经历，也构成了各自认识世界的背景。
- **Context 也影响我们如何认识自己。** 熟悉的环境和已有的经验塑造了我们的判断与自我定义。
- **Beyond 意味着继续拓展。** 带着已有的经历，走进更大的 Context，看见新的视角与可能。

## 当前进展

纯前端测试应用位于 `web/`，包含 10 道题、揭晓动画和 16 种人格结果。结果页的「保存图片」打开本次结果的图片预览，可下载或在微信内长按保存。宣传图文案编辑 `web/src/content/personalities.json` 中对应人格的 `shareDescription`。

## 本地运行

需要 Node.js 24 LTS。在仓库根目录执行以下命令，打开终端输出的 `/AITI/` 地址。

```sh
cd web
npm ci
npm run dev
```

`npm test` 运行类型和单元测试。`npm run build` 生成 `web/dist/`，并检查资源大小。`npm run preview` 可以预览构建后的站点。

浏览器验收可先运行 `npx playwright install chromium`，再运行 `npm run test:browser`。使用本机 Chrome 时，可将环境变量 `AITI_BROWSER_CHANNEL` 设为 `chrome`。

## 项目资料

- [活动策划案](docs/Activity_draft.md)：活动流程、系统功能、卡片设计、现场安排及待落实事项。
- [项目简报](docs/PROJECT_BRIEF.md)：已确认的背景、目标与方案摘要。
- [AITI 设计总览](AITI设计总览.md)：测试结构，以及人格分类、模型人格设定和题库计分规则的阅读入口。
- [结果页文案](docs/result_page.md)：16 个人格的结果页描述文案及对应模型。
- [原卡片形象与生图规范](docs/art/human.md)：已确认的人形方案插画及生图记录，与非人形方案互为替代、并行推进，两套均用于纪念卡片。
- [模型形象设定 · 非人形方案](docs/art/nonhuman.md)：七款非人形角色与八款卡片动作插画均已确认，**网站上线采用本方案**；[四视图终版](asset/nonhuman/final/README.md)及[八款动作插画、prompt 与生成记录](asset/nonhuman/cards/final/)已归档，豆包沿用现有人形，与原版平级维护。
- [动画设计](docs/animation.md)：揭晓动画的时间轴、窥视取景、等待与异常处理，已按系统设计的技术限制修订；[原稿](docs/animation_original.md)留作记录。
- [素材目录](asset/README.md)：铭文版与 Q 版卡面、共用背面、网页角色图、主视觉及背景。可按用途找到 PNG、分层 draw.io 源文件和制作记录。
- 网页的编写与部署：[现实约束与要求](docs/system/requirements.md)、[系统设计](docs/system/design.md)（行为、数据、构建与部署；不含界面视觉）、[测试与验收](docs/system/verification.md)。题目和人格描述存为 `web/src/content/` 的 JSON，首版由脚本从题库和结果页文案一次性导入，此后以 JSON 为准。
