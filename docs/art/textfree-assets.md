# 无文字版角色插画 · 制作需求

用于网站揭晓动画与结果页：这两处只展示角色本身，画面内不出现任何文字。图内文字只保留在电子卡与分享图中。

> 说明：网站上线采用[非人形方案](nonhuman.md)；本需求在非人形成品卡（`asset/nonhuman/cards/final/`）基础上派生，原成品不作修改。

## 一、范围

八张成品卡中，五张画面本身就没有文字（GPT、GLM、Kimi、Claude、Gemini），可直接复用。**只需处理以下三张：**

| 模型 | 现有成品 | 需要移除的内容 |
| :--- | :--- | :--- |
| DeepSeek | `asset/nonhuman/cards/final/deepseek.png` | 头顶右上方思绪文字「嗯，用户现在……」，含六个从左到右渐小、渐浅、渐透明的圆点 |
| Grok | `asset/nonhuman/cards/final/grok.png` | 左上角白色半透明圆角条及其中的英文「Grok, is this real?」 |
| 豆包 | `asset/nonhuman/cards/final/doubao.png` | 画面下方的米黄色卷角便签、便签上的两行手写文字，以及便签的阴影 |

## 二、必须保持不变

- 角色形态、动作、表情、配色、构图与留白
- 画风：细线稿、柔和淡彩、低饱和、左上柔光、纯白背景
- 角色在画面中的位置与尺寸——揭晓动画依赖与原成品完全一致的坐标

## 三、输出

| 项 | 要求 |
| :--- | :--- |
| 路径 | `asset/nonhuman/cards/textfree/` |
| 文件名 | `deepseek.png`、`grok.png`、`doubao.png` |
| 规格 | 1024 × 1536 PNG，白底，画面内无任何文字 |

## 四、验收

1. 与对应成品逐像素比对，除被移除区域外应完全一致
2. 移除区域无痕迹：无补丁边缘、无残留阴影、无色调断层
3. 画面中不存在任何文字、字母、数字、气泡框、便签或标签
4. 角色轮廓、动作与道具位置不变，不重新构图
5. 背景保持纯白，不出现灰块或噪点

## 五、已采用的处理方式

三处附文与角色分离，采用原图叠加白色矢量遮罩去字，不重新生成角色。

- [textfree.drawio](../../asset/nonhuman/cards/textfree/textfree.drawio)：三页可编辑源文件，原图与遮罩分层，原图以内嵌数据保存。
- [operations.json](../../asset/nonhuman/cards/textfree/operations.json)：记录各页遮罩的位置、尺寸与旋转角度。
- [导出脚本](../../tools/art/prepare-textfree-assets.ps1)：按同一几何参数导出 1024 × 1536 PNG，保留遮罩外原始像素；已有输出时停止，避免覆盖。
- [manifest.json](../../asset/nonhuman/cards/textfree/manifest.json)：来源、尺寸、校验值与核验结果。

三张白底去字版已完成，遮罩之外的改动像素均为 0。背景保留原始近白色纹理，不全图重涂；DeepSeek 嘴边的三个小泡泡属于角色动作，继续保留。

另外五款继续使用 `asset/nonhuman/cards/final/{model}.png`。透明底拼接版另行派生，和用于揭晓动画的原坐标白底版区分使用。

## 六、与动画的关系

揭晓动画的局部特写按百分比坐标从这张图裁切得到，因此：

- 三张无文字版必须与成品卡**同尺寸、同构图**
- 若重新生成导致角色位置有偏移，需要同步更新动画取景参数
