# AITI 设计总览

AITI 是清华大学计算机科学与技术系第44届学生节「Beyond Context」的趣味 AI 人格测试活动。

参与者完成校园情境选择题后，前端根据四维特征按规则匹配 AI 角色并展示对应结果。不填写昵称，不依赖后端，答题与结果生成无需调用大模型。

## 内容设定

建议按以下顺序阅读：

1. [AITI 人格分类](docs/aiti_personality.md)：认知内核、思考倾向、对齐模式和交互姿态四个维度的定义及两极特征。
2. [模型人格设定](docs/model_character.md)：模型与人格代号的对应关系、角色描述及拟人化设定。
3. [测试题库与计分规则](docs/tests_design.md)：校园情境题、选项及各维度的计分权重。
4. [结果页文案](docs/result_page.md)：16 个人格的结果页描述文案及对应模型。

具体内容在上述四份分文档中维护，本页保留整体说明和阅读入口。

## 角色视觉方案

- [原卡片形象与生图规范](docs/art/human.md)：人形方案的八张插画已确认，与非人形方案互为替代、并行推进，两套均用于纪念卡片，成品与记录继续保留。
- [模型形象设定 · 非人形方案](docs/art/nonhuman.md)：与原版平级维护，**网站上线采用本方案**。GPT 白龙、DeepSeek 蓝色鲸鱼、Claude Clawd、Kimi 小蓝球＋月亮、Gemini 猫、Grok 黑色小恶魔精灵、GLM 狐狸，七款均已确认并归档[四视图终版及完整 prompt](asset/nonhuman/final/README.md)；豆包沿用现有形象。

## 活动与系统方案

[活动策划案](docs/Activity_draft.md)说明参与流程、结果页与卡片、系统功能、现场安排及传播方案；[项目简报](docs/PROJECT_BRIEF.md)汇总活动背景与已确认的方案。

网站与系统的设计文档见[系统总览](docs/system/overview.md)：网站形态与边界、[页面与交互](docs/system/pages.md)（含揭晓动画分镜）、[内容与版本](docs/system/content.md)、[技术方案](docs/system/tech.md)、[实施计划](docs/system/plan.md)。
