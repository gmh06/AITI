# AITI 非人形角色 · 设定与卡片动作

归档日期：2026年11月18日。七款非人形角色均已确认，使用内置 `image_gen` 生成的终版图片与完整 prompt 已集中保存到 [final](final/README.md)。豆包沿用现有成品。

## 终版文件

- [GPT 白龙](final/gpt.png)：白紫鳞片、紫眼、分节角与银结流苏；完整四足龙形，没有长发或鬃毛。
- [DeepSeek 蓝色鲸鱼](final/deepseek.png)：蓝白圆胖鲸体、蓝眼、短胸鳍与鲸尾，无饰品。
- [Claude Clawd](final/claude.png)：橙色圆角方块、深色竖眼、短肢与小橙花。
- [Kimi 小蓝球＋月亮](final/kimi.png)：银白弯月承托光滑蓝球，浅紫眼，背面小 K。
- [Gemini 猫](final/gemini.png)：蓝紫粉短毛、紫红／金色异瞳、耳侧四芒星与细项链；自然猫形，没有披肩或发型。
- [GLM 狐狸](final/glm.png)：自然黑白狐形、白尖尾、蓝灰眼与额上眼罩；耳侧铃铛、挂绳和方牌已整组移除。
- [Grok 小恶魔](final/grok.png)：光滑无毛的黑色身体、小而瘦的躯干、大酒红蝙蝠翼、蓝眼、适度短小的尖牙、偏黄象牙白的哑光双角、细长尖尾；保留小王冠，移除王冠上方的新月。

七张均为 1536 × 1024 PNG。统一采用 2×2 布局：左上正面、右上角色左侧面、左下背面、右下角色右侧面。标签为 `FRONT`、`LEFT`、`BACK`、`RIGHT`。

## 本轮设计要求

- 从原拟人／娘化参考中沿用配色、眼睛、少量标志性饰品和细线淡彩画风，身体采用完整非人形结构。
- 七款均不保留服装；人的长发不转换成鬃毛、发型或附着在身体上的大块毛发，使用正常鳞片、毛被或光滑皮肤。
- 猫的异色瞳按物理左右保持：正面画面左侧紫红、右侧金色；左侧面可见金眼，右侧面可见紫红眼。
- 狐狸保留眼罩，不保留耳侧挂饰；小恶魔无头发，角采用天然角质感而非金属，金属效果仅保留在王冠等饰品上。

## 实际 Prompt 与追溯

- [终版 prompt 集](final/prompts.json)：七款终版的整合描述及实际执行 prompt，包含完整编辑链。
- [实际生成记录](final/history.json)：输入参考、生成顺序、各轮完整 prompt 和输入／输出校验值。
- [终版清单](final/manifest.json)：正式文件名、采用版本、尺寸、字节数及 SHA-256。
- 中间稿已按目录整理清理；完整编辑过程与历史路径保存在上述生成记录中。

原角色参考及已确认卡片插画保持原状。完整方案说明见 [非人形形象设定](../../docs/art/nonhuman.md)。

## 纪念卡片动作终版

八款动作插画（包含沿用人形的豆包）已于2026年11月19日全部确认，使用内置 `image_gen` 生成，正式归档在 [cards/final](cards/final/)，均为白底、1024 × 1536 PNG、竖版 2:3。图片按确认版本原样复制，无裁切、缩放或二次压缩。

- [GPT](cards/final/gpt.png)：审查图纸，已修正多余前爪。
- [DeepSeek](cards/final/deepseek.png)：悬停思考，保留指定文字和渐淡六点。
- [GLM](cards/final/glm.png)：困倦赶工，已修正紫色键帽错位。
- [Grok](cards/final/grok.png)：尾尖戳破气球，保留英文圆角文字条。
- [Kimi](cards/final/kimi.png)：精读长折页，已修正月牙与纸张粘连。
- [Claude](cards/final/claude.png)：短肢抵按方案，明确拍板。
- [Gemini](cards/final/gemini.png)：仰脸踩奶，保留异色瞳。
- [豆包](cards/final/doubao.png)：双手递奶茶，保留两行卷角便签。

[正式清单](cards/final/manifest.json)记录统一文件名、采用版本与校验值；[完整 prompt](cards/final/prompts.json)给出按终版整理的描述；[生成与编辑记录](cards/final/history.json)保留八次生成和三次局部修正的完整实际 prompt 与输入输出校验值。整合描述与实际执行记录明确区分，原稿路径作为历史标识，原稿继续本地保留。
