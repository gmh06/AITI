# 可拼接素材

制作日期：2026年11月19日至20日。本批准备插画素材，卡片、分享图与页面布局后续讨论。角色装饰和动作道具与角色保留在同一张图中，不另做装饰素材包。

## 角色素材

- **原始定稿**：继续保留 [八款动作图](../../asset/nonhuman/cards/final/) 及其完整 prompt 和生成记录。
- **三张去字版**：[DeepSeek](../../asset/nonhuman/cards/textfree/deepseek.png)、[Grok](../../asset/nonhuman/cards/textfree/grok.png)、[豆包](../../asset/nonhuman/cards/textfree/doubao.png)。1024 × 1536，保留原图坐标，遮罩外像素不变；其余五款直接用原定稿。
- **八张透明底版**：[transparent/v1](../../asset/nonhuman/cards/transparent/v1/)。1024 × 1536 RGBA PNG，供后续拼接。由内置 `image_gen` 抠图派生，完整动作、道具和装饰保留；无附文、标签与便签。第一批衍生图待审阅，不替换原始定稿。
- **取用索引**：[source-map.json](../../asset/nonhuman/cards/source-map.json) 同时给出八款的白底版与透明底版路径；网站揭晓动画优先用原坐标白底版。

透明版保留白龙鳞片、纸张、月牙、浅色毛发和软垫等白色前景材质。生成式抠图可能轻微调整边缘或颜色，不承诺与原图逐像素一致；原坐标去字版的像素要求单独验收。

已检查 [浅底预览](../../asset/nonhuman/cards/transparent/v1/preview-light.jpg)、[深底预览](../../asset/nonhuman/cards/transparent/v1/preview-dark.jpg)；这两张仅用于核查透明边缘，不是卡片或分享页设计。[核验记录](../../asset/nonhuman/cards/transparent/v1/verification.json)包含透明通道、尺寸、原图校验与去字版像素检查结果。

## 通用氛围背景

[城市背景素材 · v3](../../asset/design/backgrounds/v3/README.md)：八款当前背景，包括横竖完整场景三款、卡面角色与正文浅化版两款、横竖分享背景两款、横版左侧留白一款。[整套预览](../../asset/design/backgrounds/v3/preview.jpg)便于对比。八款均使用内置 `image_gen` 制作，新增衍生素材待审阅。

整体画风与视觉元素已获认可：蓝青、靛紫城市，尖塔、高楼峡谷、青色光雾、建筑旁的悬浮屏幕、粉紫灯光、暖色窗灯、湿地反射、厚涂笔触与颗粒边缘。v3 移除所有灰色胶囊状空中漂浮物及其粉色尖端。内容版通过光雾减少中央细节，外围保留城市辨识度；不嵌入角色、字标、正文或二维码。

[backgrounds.drawio](../../asset/design/backgrounds/v3/backgrounds.drawio)提供八页可编辑背景，候选内容区参考线、可选浅化遮罩单独分层且默认隐藏。实际 PNG 尺寸、留白区域与选用版本见[清单](../../asset/design/backgrounds/v3/manifest.json)。此前 `v1/`、`v2/` 与未采用的首张分享竖版保留供追溯，当前取用入口指向 v3。

现有 [Beyond Context 六款透明字标](../../asset/Festival/BeyondContext/) 与 [学生节主视觉](../../asset/Festival/background/) 继续复用。

## 源文件与记录

- 去字版：[三页 draw.io 源文件](../../asset/nonhuman/cards/textfree/textfree.drawio)、[遮罩参数](../../asset/nonhuman/cards/textfree/operations.json)、[清单](../../asset/nonhuman/cards/textfree/manifest.json)、[同几何参数的 PNG 导出脚本](../../tools/art/prepare-textfree-assets.ps1)。原图与遮罩分层，原图内嵌于源文件。
- 透明版：[完整 prompt](../../asset/nonhuman/cards/transparent/v1/prompts.json)、[执行记录](../../asset/nonhuman/cards/transparent/v1/history.json)、[清单](../../asset/nonhuman/cards/transparent/v1/manifest.json)。
- 背景：[完整 prompt](../../asset/design/backgrounds/v3/prompts.json)、[执行记录](../../asset/design/backgrounds/v3/history.json)、[清单](../../asset/design/backgrounds/v3/manifest.json)、[素材索引与 draw.io 源文件构建脚本](../../tools/art/build-background-library.mjs)。九次生成记录对应八款当前背景及一张保留候选。

## 后续拼接原则

在 draw.io 中分别放置角色图、背景、官方字标、可编辑文字、卡框和二维码。当前卡面采用无附文形象，不叠加 DeepSeek、Grok、豆包原有的思绪文字、英文条或便签；这些内容继续保留在历史素材与记录中。八款角色及现有道具作为完整插画引用，等比例放入承托区域，不以裁切角色来隐藏溢出。

[当前 v5 卡面讨论稿](../../asset/design/card-studies/v5/README.md)采用满版去地板城市背景与浅透明正圆，只留左上主题字标、右上 AITI、左下模型名。AITI 与模型名采用接近主题字标的圆角几何字体，内嵌为独立矢量轮廓，原字符串与字体来源保留以便重新构建。角色和道具完整入圆。历史框形与爆炸圈方案保留在[讨论稿索引](../../asset/design/card-studies/README.md)；不把文字、二维码或四维图重新生进角色图。
