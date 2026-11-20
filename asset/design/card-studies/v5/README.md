# 正圆承托与三处文字 · 讨论稿

2026年11月20日。八款统一为去地板的满版城市背景，角色后垫浅透明正圆；卡面只保留左上角 **Beyond Context**、右上角 **AITI**、左下角 **模型名称**。日期、序号、活动说明、角色附文与分隔线均已移除。

[八款总览](overview.jpg) · [三款近看](hero.jpg) · [八页 draw.io 源文件](refined.drawio) · [单卡清单](manifest.json) · [核验记录](verification.json)

主题使用官方白色字标。AITI 与英文模型名使用 Audiowide，豆包使用站酷庆科黄油体，取接近主题字标的圆角几何风格。[字体、许可与矢量字形记录](../../typography/README.md)一并保留。AITI、模型名转为独立矢量轮廓，打开 draw.io 无需安装字体；原字符串保存在场景和轮廓元数据中，改字后可重新构建。

正圆直径为 548 个布局单位，宽高相等，浅蓝白填充不透明度 77%。角色与全部动作道具等比例缩放、按可见轮廓居中，距圆边至少约 20 个布局单位；不以圆形裁切角色。透明图原文件、原取景范围、城市背景取景和官方字标均保留。透明图的可见轮廓以 alpha ≥ 16 核对，忽略近透明残留噪点。

布局为 600 × 900，八张单卡 PNG 为 1200 × 1800。2026 年 11 月 20 日确认按本版先行保存；印刷尺寸和后续分享图布局另行确定，历史版式继续留在本地。

复现顺序：`python tools/art/prepare-circle-study.py` → `node tools/art/build-card-refinement.mjs v5` → `tools/art/render-card-refinement.ps1 -Version v5`。完整几何、透明度、取景、字体与分层信息见 [scenes.json](scenes.json)。
