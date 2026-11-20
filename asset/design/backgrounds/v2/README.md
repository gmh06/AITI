# AITI 背景 · v2

2026年11月19日，按学生节背景图 1、2 重做，由内置 `image_gen` 生成，待审阅。成品为 [context-atmosphere.png](context-atmosphere.png)，1024 × 1536 PNG。

## 参考理解

- [背景图 1](../../../Festival/background/1.png)：低视角仰望、两侧深色尖塔与不规则机械轮廓、蓝青天空、斜向漂浮物、少量粉紫发光点；数字绘画保留松动的线条和笔触。
- [背景图 2](../../../Festival/background/2.png)：纵向高楼峡谷、青色光雾、层叠远景、悬浮信息屏、暖色窗灯、湿地倒影，边缘有颗粒与飞溅纹理；整体为蓝青和靛紫色的厚涂概念插画。

本版结合两者，保留完整城市与空间纵深，不沿用 v1 的大面积浅色留白。主题字标、角色、卡框、二维码及最终布局后续独立拼接。

## 制作记录

- [prompts.json](prompts.json)：完整实际提示词、两张参考副本的路径和原始来源。
- [history.json](history.json)：执行记录、输入校验值和输出信息。
- [manifest.json](manifest.json)：成品尺寸、字节数及 SHA-256。
- [attempts.json](attempts.json)：首次使用原尺寸输入时的接口错误及重试方式。

原尺寸输入被接口以 `invalid_image_file` 拒绝后，使用 [图 1 等比例参考副本](references/background-1.png)与[图 2 等比例参考副本](references/background-2.png)继续。两份副本保留原图完整画面，仅缩小尺寸；原始文件和 v1 产物继续保留。
