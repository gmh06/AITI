# 卡面字体与矢量字形

主题字标继续使用 `asset/Festival/BeyondContext/4.png`，不重新排字。以下字体用于 AITI 和模型名，选择与官方字标相近的圆角几何风格：

- **Audiowide**：AITI、GPT、DeepSeek、GLM、Grok、Kimi、Claude、Gemini。[Google Fonts 源文件](https://github.com/google/fonts/blob/main/ofl/audiowide/Audiowide-Regular.ttf) · [本地许可](fonts/audiowide/OFL.txt)。
- **站酷庆科黄油体 / ZCOOL QingKe HuangYou**：豆包。[Google Fonts 源文件](https://github.com/google/fonts/blob/main/ofl/zcoolqingkehuangyou/ZCOOLQingKeHuangYou-Regular.ttf) · [本地许可](fonts/zcoolqingkehuangyou/OFL.txt)。

两者均附带 SIL Open Font License 1.1；原字体文件未修改。下载来源、日期和 SHA-256 见 [sources.json](fonts/sources.json)。未安装到系统。

[v1](v1/) 保存九组白色矢量字形，每组包含 SVG 和轮廓 JSON。SVG 内置路径与语义标题；JSON 记录原文、字体、原字体哈希、尺寸与绘图命令。draw.io 内嵌 SVG，PNG 导出读取同一轮廓几何，避免字体回退。字形是独立可移动、缩放的矢量对象；替换文字需修改场景准备脚本中的字符串并重新构建，不是双击原生文本框改字。

由 [prepare-circle-study.py](../../../tools/art/prepare-circle-study.py) 使用 fontTools 生成轮廓；未使用生图模型生成文字。
