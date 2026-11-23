# AITI 素材目录

## 按用途取用

- **实物卡与网页电子卡正面 · 铭文版**：八张角色卡。原始整卡 PNG 可直接取用。与 Q 版混排时，从分层版导出对应角色页，确保底图、边框和字标位置一致。[原始 PNG](design/card-studies/engraved-v1/) · [对齐后总览](design/card-studies/engraved-v1/aligned-overview.jpg) · [分层 draw.io](design/card-studies/engraved-v1/fronts.drawio)
- **实物卡与网页电子卡正面 · Q 版人形**：八张全彩 PNG，与铭文版并行。保留原画配色、动作和道具，三处卡面字标与铭文版一致。[单卡 PNG](design/card-studies/chibi-v1/) · [八款总览](design/card-studies/chibi-v1/overview.jpg) · [分层 draw.io](design/card-studies/chibi-v1/fronts.drawio)
- **卡片背面**：共用版式，含 Beyond Context 字标、学生节信息和 AITI 测试入口二维码。二维码指向已约定的 GitHub Pages 地址。[PNG 预览](design/card-studies/engraved-v1/back.png) · [draw.io 源文件](design/card-studies/engraved-v1/back.drawio) · [独立二维码 SVG](design/card-studies/engraved-v1/aiti-qr.svg)
- **揭晓动画与结果页角色**　构建使用索引中 `transparent` 路径对应的八张原坐标透明底插画。 [八款角色取用索引](nonhuman/cards/source-map.json) · [动画设计](../docs/animation.md)
- **分享图**　构建从铭文版提取纸纹和字标，按 v5 场景配置裁切透明底角色图，并压缩横版城市背景。浏览器按实际结果合成文案和四维条。 [分享图实现说明](../docs/system/design.md#五分享图) · [取景配置](design/card-studies/v5/scenes.json) · [素材构建脚本](../web/scripts/build-assets.ts)

角色设定、字体、活动视觉与第三方素材的出处和授权见 [仓库说明](../README.md#素材来源)。

## 目录结构

```text
asset/
├── README.md                  素材总入口
├── Festival/                  学生节原始主视觉与官方字标
│   ├── background/            横幅与竖版主视觉
│   └── BeyondContext/         六款透明字标
├── design/                    卡面排版与可复用的设计组件
│   ├── card-studies/
│   │   ├── engraved-v1/       铭文版正面与共用背面
│   │   ├── chibi-v1/          全彩 Q 版正面
│   │   └── v5/                已归档的城市背景与圆形承托方案
│   ├── backgrounds/           城市背景 v3 与早期 v1、v2
│   └── typography/            字体、许可与 v5 矢量字形
├── human/                     人形动作定稿与角色参考
│   ├── cards/final/           八款人形动作图与生成记录
│   ├── original/              八款原始人物参考
│   ├── sheets/                七款人物四视图
│   └── notes/                 三份人物小记
├── nonhuman/                  非人形方案，豆包沿用人形
│   ├── final/                 七款非人形四视图与生成记录
│   └── cards/
│       ├── final/             八款动作原稿与生成记录
│       ├── textfree/          三款去附文白底图与 draw.io 遮罩源文件
│       ├── transparent/v1/    八款透明底衍生图与核验记录
│       └── source-map.json    八款白底与透明底图的逐角色路径
└── icon/                      按八个模型归档的 App、网页图标与吉祥物参考
```

两套正面的原始 PNG 均为 1024 × 1536，按模型代号命名，例如 `gpt.png`、`doubao.png`。实物尺寸与出血参数见[卡面讨论稿](design/card-studies/README.md)所列待定项。

## 主视觉与设计组件

- **官方 Beyond Context 字标**：带线框双行 [深蓝](Festival/BeyondContext/1.png) / [白](Festival/BeyondContext/2.png)，双行 [深蓝](Festival/BeyondContext/3.png) / [白](Festival/BeyondContext/4.png)，单行 [深蓝](Festival/BeyondContext/5.png) / [白](Festival/BeyondContext/6.png)。卡背使用白色双行 `4.png`。
- **学生节原始主视觉**：[横版城市人物](Festival/background/1.png) · [竖版城市剪影](Festival/background/2.png) · [竖版双人插画](Festival/background/3.jpg)。卡背内嵌的是竖版城市剪影的裁切画面。
- **城市背景候选**：v3 收录八种构图，覆盖横竖场景、角色区、正文区与分享版式。各图的像素尺寸、留白和选用版本见清单。[预览](design/backgrounds/v3/preview.jpg) · [draw.io](design/backgrounds/v3/backgrounds.drawio) · [清单](design/backgrounds/v3/manifest.json)
- **可复用字形**：Audiowide 用于 AITI 与英文模型名，站酷庆科黄油体用于中文。v5 的矢量字形有 SVG 和轮廓 JSON，现有铭文版、Q 版两套正面直接复用同一组原卡字标。[字体、许可与字形](design/typography/README.md)

## 源文件与历史版本

- 两套 `fronts.drawio` 都按角色分页，卡框、角色和三处字标分层。角色和正面字标是内嵌位图对象。卡背的活动信息是可编辑文字，二维码是可单独替换的矢量图。
- 角色原稿和城市背景的版本、尺寸与校验值见各自的 `manifest.json`，提示词与实际生成过程分别见 `prompts.json` 和 `history.json`。[人形规范](../docs/art/human.md) · [非人形规范](../docs/art/nonhuman.md) · [制作素材说明](../docs/art/production-assets.md) · [制作脚本](../tools/art/)
- 仓库历史稿包括[城市背景 v1](design/backgrounds/v1/)、[城市背景 v2](design/backgrounds/v2/)和 [v5 圆形卡面](design/card-studies/v5/README.md)。本地早期稿另有 `design/card-studies/v1/` 至 `v4/`、`design/comparisons/human-chibi-v1/` 与 `nonhuman/cards/v1/`，这些目录目前未纳入 Git。
