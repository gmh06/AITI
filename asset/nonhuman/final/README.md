# AITI 非人形角色 · 四视图终版

归档日期：2026年11月18日。前四款按用户要求完成小恶魔尖牙修正后归档；DeepSeek、Claude、Kimi 随后获用户“都同意”确认，七款图片与相关 prompt 统一保存在本目录。豆包沿用原成品。

## 正式文件

- [gpt.png](gpt.png)：GPT 白龙，采用 v2。
- [deepseek.png](deepseek.png)：DeepSeek 蓝色鲸鱼，采用已确认的 remaining-v1。
- [claude.png](claude.png)：Claude Clawd，采用已确认的 remaining-v1。
- [kimi.png](kimi.png)：Kimi 小蓝球与银白弯月，采用已确认的 remaining-v1。
- [gemini.png](gemini.png)：Gemini 猫，采用 v2。
- [glm.png](glm.png)：GLM 狐狸，采用已移除耳侧挂饰的 v3。
- [grok.png](grok.png)：Grok 黑色小恶魔，采用尖牙缩短后的 v6。

七张均为 **1536 × 1024 PNG**。左上正面、右上角色左侧面、左下背面、右下角色右侧面，标签依次为 `FRONT`、`LEFT`、`BACK`、`RIGHT`。

## Prompt 与记录

- [prompts.json](prompts.json)：七款的中文终版特征、整合后的完整描述 prompt，以及实际执行的初始生成与逐轮编辑 prompt。整合描述与实际执行记录明确区分。
- [history.json](history.json)：实际生成／编辑顺序、输入参考、原始输出版本、每步完整 prompt 与文件 SHA-256。
- [manifest.json](manifest.json)：正式文件名、采用版本、尺寸、字节数、SHA-256 和归档依据。

图片均使用内置 `image_gen` 生成，归档时按原始 PNG 内容复制，未进行裁切、缩放或二次压缩。正式取用本目录的七张 PNG。中间稿已按目录整理清理，原始 prompt 和历史路径保存在 [history.json](history.json) 中，仅用于追溯。
