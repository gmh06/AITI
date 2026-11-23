# AITI 卡片形象 · 已确认生图规范

8 张卡片插画均已确认。正式文件统一位于 [asset/human/cards/final](../../asset/human/cards/final)，均为 1024 × 1536 PNG、竖版 2:3。

- [manifest.json](../../asset/human/cards/final/manifest.json)：8 张成品的文件名、确认版本、尺寸和 SHA-256。
- [prompts.json](../../asset/human/cards/final/prompts.json)：按最终结果整理的中英文 prompt、参考图和文字要求，可用于后续修改或再生成。
- [history.json](../../asset/human/cards/final/history.json)：实际执行过的 prompt、修改记录和历史产物元数据。历史产物名只用于追溯，不作为正式成品的文件依赖。

## 0. 成品文件

- [gpt.png](../../asset/human/cards/final/gpt.png)：审阅。
- [deepseek.png](../../asset/human/cards/final/deepseek.png)：抱膝望天，采用恢复第一版清晰画风的版本。
- [glm.png](../../asset/human/cards/final/glm.png)：上手。
- [grok.png](../../asset/human/cards/final/grok.png)：看戏，采用已确认的浅发色与局部裙摆调整。
- [kimi.png](../../asset/human/cards/final/kimi.png)：抱书，深蓝服装、银白头发、两处 K 标志。
- [claude.png](../../asset/human/cards/final/claude.png)：点案。
- [gemini.png](../../asset/human/cards/final/gemini.png)：等夸。
- [doubao.png](../../asset/human/cards/final/doubao.png)：端茶，采用最终 Q 版比例。

## 1. 通用画面要求

2D 日系轻插画，约 2.8 头身的 Q 版比例；深灰褐细线稿、柔和淡彩、低饱和配色、左上柔光、纯白背景。完整保留人物轮廓，无场景、地面投影、边框、水印或第二个人物。Grok 仅保留动作所需的简洁台座。

一般人物偏左、右侧留白；Grok 偏右、左上留文字位置；DeepSeek 坐姿压低、头顶保留思绪文字空间；豆包底部留便签空间。具体构图以已确认成品为准。

避免写实、3D 黏土或塑料质感、厚涂、多手多指、手与道具融合、畸形面部、裁切人物和自行添加的文字。角色只保留指定道具及配饰。豆包从原始 3D 参考转为同套 2D Q 版。

## 2. 参考图与来源

### 社区与品牌设定

- **GPT、Claude、Gemini、Grok、GLM、Kimi** 的人形设定可与 ZipZipPipe 发布的白龙娘、橙发花饰、紫发星饰猫娘、金发黑裙、黑白狐娘和银发蓝裙对应。作者要求署名和非商业使用。 [Pixiv《AI娘化》](https://www.pixiv.net/artworks/148186519) · [B 站《大AI和小AI们》](https://www.bilibili.com/video/BV1tE9XBbErS/)
- **DeepSeek** 的人形参考为蓝发鲸鱼女仆。鲸鱼娘原角色由上善无形创作，蓝白女仆造型由 ZipZipPipe 二次设计。对应的上游许可为 CC BY-NC-SA 4.0。分发承袭该设计的图像时保留两位作者的署名和来源，标注所作修改，并以相同许可分享改编。 [上善无形原帖](https://www.bilibili.com/opus/1231977657712771073) · [ZipZipPipe 作品说明](https://www.bilibili.com/video/BV1tE9XBbErS/) · [许可条款](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)
- **豆包**根据字节跳动豆包品牌的短发、红围巾 3D 形象制作。仓库中全身参考图的首发页面及再分发许可尚未核实。 [豆包官方应用页面](https://apps.apple.com/cn/app/id6459478672) · [仓库参考图](../../asset/human/original/doubao.jpg)

仓库保存的四视图和「人物小记」用于定位服装、配饰和造型。上述署名对应角色设定的来源，具体参考文件的制作者、首发页面及再分发许可尚未核实。下列本地路径记录了 AITI 卡面制作时实际使用的参考。

### AITI 卡面取用记录

- GPT、DeepSeek、Claude：`asset/human/notes/` 中同名人物小记为主，`asset/human/sheets/` 四视图用于补查细节。
- GLM、Grok、Gemini：`asset/human/sheets/` 中同名四视图为角色参考；统一画风参照 `asset/human/notes/gpt.jpg`。
- Kimi：`asset/human/original/kimi.jpg` 核对深蓝配色和 K 标志，`asset/human/sheets/kimi.jpg` 补充造型，GPT 小记用于统一画风。
- 豆包：`asset/human/original/doubao.jpg` 仅取人物与服装特征，画风参照 `asset/human/notes/claude.jpg`，不保留手机界面或 3D 质感。

AITI 卡面动作、道具和构图由项目组确定，动作插画通过 OpenAI 图像生成工具制作。具体参考输入和调整过程见本页开头链接的记录。

## 3. 画面文字与标志

文字和标志由生图模型直接绘入。GPT、GLM、Claude、Gemini 四张无字；Grok、DeepSeek、豆包保留各自指定文案；Kimi 只保留两处 K。

- Grok：仅 `Grok, is this real?`，G 大写，其余小写，带逗号和问号；左上白色半透明圆角条、深灰无衬线文字。
- DeepSeek：仅 `嗯，用户现在……`。省略号恰好六个小圆点，各点底边与汉字底部基线对齐；从左到右渐小、渐浅、渐透明，最后一点仍可辨认。没有波峰、额外灰色圆点或嘴边气泡。
- 豆包：米黄色卷角便签上分两行写 `我用最直白、最不绕弯子的` 和 `方式告诉你……`，字迹清楚不连笔。
- Kimi：头侧深蓝蝴蝶结中央一个白色 K；腰侧银边深蓝方牌中央一个白色 K。胸口被书遮住，书堆无字。

## 4. GPT · 审阅

参考图：`asset/human/notes/gpt.jpg`（主，Q版小记）；`asset/human/sheets/gpt.jpg`（细节补查）

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，画面中不得出现任何文字。
> 角色：雪白及腰大波浪卷发（发色偏白、带一点浅紫），头顶一根细长上翘呆毛，齐眉碎刘海，两侧长鬓蓬松外翻；瞳孔是紫色（**别画成蓝色**），半垂眼、眼尾一道红棕色挑线；头顶一对象牙白分节龙角，向后上方弯；尖长精灵耳。**没有尾巴，没有翅膀。**
> 服装：白色小礼服式蓬蓬短裙，泡泡袖与荷叶边层叠裙摆，胸前细链条与浅紫色菱形垂饰；左侧一枚银白色花结发饰，垂小环与流苏；白色短靴，鞋面带蝴蝶结绑带。
> 动作：正面站立，肩膀微微内缩，双手捏着一页白纸的两角翻看（纸是唯一道具，画面中不出现笔），低头盯着纸，眉心紧皱，不抬眼看镜头。
> 构图：竖版 2:3，人物居中偏左，右侧留约 30% 空白，顶部留 10%。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel shading, desaturated palette, pure white background, NO text of any kind in the image.
> Character: waist-length wavy white hair with a faint lavender tint and a single long ahoge, blunt bangs, thick side locks; **purple** half-lidded eyes with a reddish-brown wing line (never blue); a pair of ivory segmented dragon horns curving back; pointed elf ears. **No tail, no wings.**
> Outfit: white party-style puffy short dress with puff sleeves and tiered ruffled hem, a delicate chest chain with pale-lavender diamond pendants, a silver-white knotted hair ornament with tassel on the left, white ankle boots with ribbon lacing.
> Pose: standing front-facing, shoulders slightly hunched, holding a single sheet of white paper by its two top corners with both hands, head lowered staring at the paper, brows knitted, not looking at camera. No pen.
> Composition: vertical 2:3, character centered-left, ~30% empty space on the right, 10% headroom.

**验收**：龙角、紫瞳、尖耳都在（**不要出现尾巴和翅膀**）；只有一页纸、无笔；眼睛是「半垂的不耐烦」；画面无任何文字。

---

## 5. DeepSeek · 抱膝望天

参考图：`asset/human/notes/deepseek.jpg`（角色设计）；`asset/human/cards/final/deepseek.png`（已确认抱膝姿态与清晰画风）；`asset/human/sheets/deepseek.jpg`（细节补查）；GPT、Claude 定稿（统一线稿与上色）。当前确认版本为 `deepseek-style-v10`。

画风保持第一版的清晰细线与干净色块；发束、高光、金色纹样、荷叶边和手部细节边界分明，避免水彩晕染、碎色块和模糊边缘。

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景。
> 角色：靛蓝到浅雾蓝渐变的及腰大波浪卷发，厚齐眉刘海，头顶一根蓝色弯曲呆毛，白色蕾丝女仆发饰与两侧蓝蝴蝶结；**没有悬浮光环**；宝石蓝到冰蓝渐变的圆润大眼、眼下有小点腮红；一对大而明显的鲸鱼胸鳍状耳朵（外蓝内白、带鳍纹，张开后接近头部宽度），一条藏青鲸尾从腰后伸出；眼睛是蓝色（**别换瞳色**）。
> 服装：白色高领竖褶衬衫配深蓝纽扣，藏青泡泡袖短外套（袖口古铜金滚边与白蕾丝），胸前深藏青大蝴蝶结配浅蓝宝石胸针；藏青束腰双排古铜金纽扣；藏青短裙接浅蓝横带（金藤蔓小花纹）与白蕾丝衬裙；白色蕾丝荷叶边围裙，围裙正中一枚喷水的藏青鲸鱼图案；藏青玛丽珍鞋，白色及膝袜。
> 动作：参照已确认成品，坐在地上，双腿并拢屈膝抬到身前，双手环抱膝盖，两只鞋并排靠近，一只手的手指无意识地敲着膝盖；**不盘腿，不交叉小腿，不把膝盖向两侧打开**。仰头望上方放空，腮帮子微微鼓起，嘴巴轻抿，表情专注又走神；**不画嘴边气泡**。裙摆自然遮住髋部。
> 文字：人物头顶右上方漂浮着一行浅灰蓝色的细体中文小字「嗯，用户现在……」，字迹清淡、略透明，像思绪；省略号由恰好六个横向小圆点组成，各点底边与汉字底部基线水平对齐，不放在文字中线上。从左到右逐渐变小、变浅、变透明，点间留有清晰间隔，第六个点也必须隐约可见、可数。用渐淡的六点表现思绪慢慢飘远，不画波峰或上下跳动，不额外添加灰色圆点、气泡或运动线。画面中只允许出现这几个字，不得出现其他任何文字。
> 构图：竖版 2:3，人物整体压低坐姿，头顶留约 25% 空白，人物居中偏左。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background.
> Character: waist-length wavy indigo-to-pale-blue gradient hair, thick blunt bangs, a curved blue ahoge, a white lace maid headdress and blue side bows; **no floating halo**; round sapphire-to-ice-blue eyes with small blush dots; large prominent whale-fin-shaped ears (blue outside, white inside, spread nearly as wide as the head), a navy whale tail at the waist; **blue** eyes, never change the eye color.
> Outfit: white high-collar pleated blouse with navy buttons, navy puff-sleeve cropped jacket with antique-gold trim and white lace, large navy bow with a pale blue gem brooch; navy corset belt with double rows of gold buttons; navy short skirt with a light-blue band, white lace petticoat; white lace ruffled apron with a small spouting navy whale emblem at its center; navy Mary Janes, white knee socks.
> Pose: match the approved final illustration: sitting on the floor with both knees raised together in front of the torso, arms hugging the knees, shins together and shoes close side by side; one hand idly tapping a knee. **Not cross-legged, no crossed shins, no knees spread outward.** Head tilted up staring blankly, cheeks slightly puffed, a tiny pursed mouth with **no mouth bubble**. Skirt naturally covers the hips.
> Text: a single line of small, pale blue-grey, slightly translucent Chinese text 「嗯，用户现在……」 floats above and to the right of her head. Use **exactly six small round dots with their lower edges aligned to the bottom baseline of the Chinese characters, not the text midline**, gradually decreasing in size, blue-grey intensity and opacity from left to right, suggesting thoughts trailing off. Keep clean gaps; even the sixth dot must remain faintly visible and countable. No arch, bouncing crest, separate grey thought circles, bubbles or motion lines. This must be the ONLY text in the image.
> Composition: vertical 2:3, seated low, 25% empty space above the head, character centered-left.

**验收**：抱膝姿态与已确认成品一致，双膝并拢抬起、鞋子靠近，不盘腿；蓝色弯曲呆毛、白色女仆发饰、大鲸鳍、鲸尾都在，没有悬浮光环；眼睛必须是蓝色；鲸鱼徽记别画成别的动物；思绪文字只有那一行，省略号恰好六点、底边与文字底部基线对齐、从左到右渐小渐淡，第六点也可辨认；没有额外灰色圆点、思绪气泡或嘴边气泡。

---

## 6. GLM · 上手

参考图：`asset/human/sheets/glm.jpg`

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，画面中不得出现任何文字。
> 角色：墨黑超长直发（发尾透蓝紫光泽），厚刘海，两侧长鬓垂到腰；蓝灰色大眼、眼尾细上挑、眼下有一排点状腮红，安静浅笑；一对大型狐狼耳（外黑内白绒毛），一条极蓬松的黑毛白尖狐尾。
> 服装：头顶白色蕾丝荷叶边发带，发带上趴一只黑色睡眠眼罩（绣着闭眼睫毛）；白色蕾丝高领衬衫（竖细褶、小纽扣），黑色缎带蝴蝶结领结，正中一枚方形金属扣牌（**素面，不带任何字母**）；黑色宽腰封配方形金属扣与细银链；白色长裙外叠黑色多层罩裙，白裙正面有黑银十字架与菱形水晶刺绣；白色系带短靴，黑色鞋头与厚底。
> 动作：蹲姿，一手撑在地上，另一手朝画面外伸出来像要接住递过来的东西，身体前倾，眼睛直视观者，嘴角一撇。
> 构图：竖版 2:3，蹲姿压低重心，人物居中偏左，右侧留约 30% 空白。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background, NO text of any kind.
> Character: extremely long straight ink-black hair with blue-violet sheen at the tips, thick bangs, long side locks; blue-grey large eyes with thin upturned liner and a row of dot blush under the eyes, faint smile; large black fox-wolf ears with white inner fluff, a very fluffy black fox tail with a white tip.
> Outfit: white lace ruffled headband with a black sleep mask resting on it; white lace high-collar blouse with tiny pleats and buttons, black ribbon bow with a **blank square metal plate** at its center; black wide corset belt with a square metal buckle and fine silver chain; white long skirt layered with black overskirts, black-and-silver cross and diamond-crystal embroidery; white lace-up ankle boots with black toe caps and thick soles.
> Pose: crouching, one hand on the floor for support, the other reaching out toward the viewer as if to take something, leaning forward, eyes looking straight at the camera, one corner of the mouth pulled.
> Composition: vertical 2:3, low crouching silhouette, centered-left, ~30% empty space on the right.

**注意**：参考图中的 Z 字母徽记统一改为素面金属扣牌，成品保持无字。

---

## 7. Grok · 看戏

参考图：`asset/human/sheets/grok.jpg`

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.6 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景。
> 角色：极浅奶油香槟金的高位巨型双马尾大波浪卷发，刘海偏分露额，两侧碎发贴脸；天蓝色宝石眼、上眼线粗挑，腮红明显，张口露出一颗上虎牙；一对尖长精灵耳。
> 服装：头顶黑色小金冠（正面一枚圆形罗盘徽章），冠后一枚大型新月饰，两侧黑色大蝴蝶结各挂一枚黑色小蝙蝠翼；黑色哥特式露肩上衣（大领口配黑蕾丝），黑色缎面领结配罗盘金属徽章，酒红色内衬小斗篷；黑色紧身束腰配金链与罗盘徽章；黑色不对称高低裙（金色刺绣滚边、酒红内衬荷叶边）；黑色高跟短靴配金色罗盘搭扣；黑色半透丝袜与带金饰的大腿环。 裙摆只在两侧内缘局部向下延长，充分遮住髋部和两侧开口；中央保留交叠双腿的露出，不改成整片长裙。
> 动作：坐在一道台座上，双腿自然交叠、一条腿垂下，身体前倾，一只手托腮；挑眉坏笑，斜眼瞟向观者，一副看戏的样子。
> 文字：画面左上方横着一条白色圆角半透明小条，条内用深灰色无衬线小号英文字母写着「Grok, is this real?」，首字母 G 大写、其余小写，带逗号和问号，轻微软斜。这是画面中唯一出现的文字，不得出现任何其他字母、数字或符号。
> 构图：竖版 2:3，人物偏右，左上方留出空白，底部保留垂下的腿。

**English Prompt**

> 2D anime chibi illustration, ~2.6 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background.
> Character: very pale creamy champagne-blonde enormous twin-tails with big curls, side-parted bangs, face-framing strands; sky-blue jewel eyes with thick upturned liner, strong blush, mouth open showing one small fang; pointed elf ears.
> Outfit: small black-and-gold crown with a round compass medallion, a large crescent ornament behind it, black bows on both sides each with a tiny black bat wing; black gothic off-shoulder top with lace, black satin bow with a compass medallion, wine-red lined mini capelet; black corset with gold chain and compass medallion; black asymmetric high-low skirt with gold embroidery and wine-red ruffled lining; black heeled ankle boots with gold compass buckles; sheer black tights and a gold-trimmed thigh band. Extend only the two inner side hems enough for full hip coverage; retain the open front showing the crossed legs, rather than a full-length front skirt.
> Pose: sitting on a plinth with legs naturally crossed and one leg hanging down, leaning forward, one hand propping her cheek; smirking with raised eyebrow and a sideways glance at the viewer.
> Text: in the upper-left there is a small white rounded semi-transparent bar containing the sans-serif grey English text "Grok, is this real?" with a comma and question mark. This must be the ONLY text in the image — no other letters, numbers or symbols anywhere.
> Composition: vertical 2:3, character on the right, empty space upper-left, keep the hanging leg in frame.

**验收**：发色为极浅香槟金；两侧裙边充分遮盖，中央保留交叠腿部；虎牙、新月饰、蝙蝠翼三个小元素掉一个就变普通金发大小姐；弹幕条内文字必须一字不差，且不能多出第二个文字块。

---

## 8. Kimi · 抱书

参考图：`asset/human/original/kimi.jpg`（原始配色与 K 标志）；`asset/human/sheets/kimi.jpg`（造型）；`asset/human/notes/gpt.jpg`（统一 Q 版画风）。

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，仅保留头侧蝴蝶结和腰侧方牌上的两处大写 K，不出现其他文字。
> 角色：近雪白的银白色（仅保留冷灰蓝色阴影）的及腰大波浪卷发，极蓬松，厚刘海，两侧长鬓；薰衣草紫色大眼，眼中有四角星高光，温柔微笑；无兽耳无角无尾。
> 服装：白色蕾丝荷叶边发箍；右侧一串挂饰包含银色新月、银色八分音符、深藏青蝴蝶结和浅紫菱形水晶坠，蝴蝶结中央保留白色大写 K；白色高领荷叶边衬衫；深藏青束腰马甲、短披肩和外裙，银纽扣与细银链，月亮、星座、五线谱、音符与琴键下摆图案保留。腰侧银链垂下一枚深蓝底、银色细边的方牌，中央是白色大写 K。白色内裙和荷叶边仅用淡冷蓝灰阴影，避免整体泛紫；藏青玛丽珍鞋、白色过膝袜。主色为接近原图的深藏青蓝，约 #242D4B；胸口标志保持被书堆遮住，不新增第三处可见 K。
> 动作：抱着一摞窄而高的书与文件（高过下巴），下巴轻轻压在最上面那一本上，从资料后面露出眼睛看观者，安静地笑。
> 构图：竖版 2:3，那一摞资料形成纵向高轮廓，人物居中偏左，右侧留约 30% 空白。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background, only the two specified uppercase K emblems and no other lettering.
> Character: voluminous waist-length wavy snow-white/silver-white hair with only faint cool grey-blue shadows, thick bangs, long side locks; large lavender eyes with four-pointed star highlights, gentle smile; no animal ears, no horns, no tail.
> Outfit: white lace ruffled headband; silver crescent, eighth note, deep-navy hair bow and pale-violet crystal drops at the side, with a clearly legible white uppercase K centered on the bow. White high-collar ruffled blouse, deep-navy corset vest, capelet and outer skirt, silver buttons and fine chains; preserve moon, constellation, music-staff, note and piano-key motifs. A small dark-navy square plaque with a thin silver frame and a white uppercase K hangs from the hip chain. White inner ruffles use faint cool blue-grey shading, not an overall violet tint. Navy Mary Janes and white over-knee socks. Match the original deep-navy palette, approximately #242D4B. The chest emblem remains hidden by the books; do not add a third visible K.
> Pose: holding a narrow, tall stack of books and papers that rises above her chin, chin resting on the topmost book, peeking at the viewer over the stack with a quiet smile.
> Composition: vertical 2:3, the stack forms a tall vertical silhouette, centered-left, ~30% empty space on the right.

**验收**：主色为深藏青蓝，头发接近雪白、紫瞳保留；头侧蝴蝶结和腰侧银边方牌各有一个清晰大写 K；书堆遮住胸口标志，书脊与封面无字；抱书姿态与已确认成品一致。

---

## 9. Claude · 点案

参考图：`asset/human/notes/claude.jpg`（主，Q版小记）；`asset/human/sheets/claude.jpg`（细节补查）

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，画面中不得出现任何文字。
> 角色：杏橙色及腰长发，斜分刘海盖额，两侧长鬓；眼睛是**琥珀色**，细长微垂的眼型，眼中有橙金光点；左侧鬓角一朵大型橙色花形发饰（花心珍珠感），后系黑色缎带配米白流苏；金色钟形水滴耳坠；无兽耳无角无尾。
> 服装：米白底配橙色花纹的蓬蓬短裙，层层荷叶边；黑色缎带蝴蝶结配橙色雏菊胸针，**领口那一朵小花也别漏**；黑色腰带，垂米白流苏；黑色玛丽珍鞋，鞋面带橙色小花。
> 动作：3/4 侧身站立，一只手握钢笔，笔尖已经点在摊开的一页方案纸上（纸在腰侧高度，纸面**空白**），另一只手自然下垂；抬眼看观者，眼神犀利，眉头略沉。
> 构图：竖版 2:3，人物偏左，右侧留约 30% 空白。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background, NO text of any kind.
> Character: waist-length apricot-orange hair, side-parted bangs, long side locks; **amber** narrow slightly drooping eyes with golden highlights; a large orange flower ornament by her left temple with black ribbon and cream tassel; gold bell-shaped drop earring; no animal ears, no horns, no tail.
> Outfit: cream puffy short dress with orange floral patterns and tiered ruffles; black ribbon bow with an orange daisy brooch, **plus a small flower at the collar that must not be omitted**; black waist belt with cream tassels; black Mary Jane shoes with orange flower ornaments.
> Pose: standing in 3/4 view, one hand holding a fountain pen with the nib pressed onto an **open blank sheet** of plan paper at hip height, the other arm relaxed; chin slightly raised, sharp gaze at the viewer, brows slightly knitted.
> Composition: vertical 2:3, character on the left, ~30% empty space on the right.

**验收**：笔已经点在纸上（与 GPT 那张区分的关键）；视线在观者脸上；**领口那朵小花要在**；纸上不能有任何字。

---

## 10. Gemini · 等夸

参考图：`asset/human/sheets/gemini.jpg`

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，画面中不得出现任何文字。
> 角色：长春花蓝到樱花粉渐变的蓬松及腰长卷发，耳上两侧各一个丸子包头，头顶一根大呆毛；**异色瞳**（画面左眼紫红细瞳、画面右眼金琥珀色），眼中带星形高光；脸颊贴小星点贴饰；一对大型猫耳（外蓝紫、内侧粉色绒毛），一条蓬松紫蓝渐变猫尾。
> 服装：藏蓝短款挂颈上衣（露腰，面料带星空亮片与星纹），胸前四角星胸针垂星链；深蓝紫开襟短外套（宽大幻彩星空渐变袖、白蕾丝荷叶袖口）；藏蓝配白荷叶边短裙，髋侧挂星形坠；厚底松糕鞋（藏蓝鞋身配幻彩珠光厚底、星形挂饰），白色绒毛袜套；右耳侧一枚大型幻彩四角星发饰。
> 动作：站着，上身前倾，双手背在身后，仰头看观者，笑意明显、双眼保持睁开以清楚呈现异色瞳，一副等着被表扬的样子。
> 构图：竖版 2:3，人物偏左，右侧留约 30% 空白。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background, NO text of any kind.
> Character: voluminous waist-length curly hair gradient from periwinkle blue to sakura pink, two buns on top of the ears, one big ahoge; **heterochromia** (viewer-left eye magenta with a slit pupil, viewer-right eye golden amber), star-shaped highlights; tiny star stickers on the cheek; large cat ears (blue-purple outside, pink fluff inside), a fluffy blue-purple gradient cat tail.
> Outfit: navy halter crop top with starry glitter fabric and a four-point star brooch with a star chain; deep blue-violet open short jacket with iridescent starry wide sleeves and white lace cuffs; navy skirt with white ruffles and a star charm at the hip; chunky platform shoes with iridescent pearl soles and star charms, white fluffy leg warmers; a large iridescent four-point star hair ornament.
> Pose: standing, upper body leaning forward, both hands behind her back, head tilted up looking at the viewer, eyes smiling but open enough to clearly show both different iris colors, waiting to be praised.
> Composition: vertical 2:3, character on the left, ~30% empty space on the right.

**验收**：异色瞳左右不能反（画面左紫红、右金琥珀）；双手必须在身后，不能变成比手势；画面无字。

---

## 11. 豆包 · 端茶（3D → 2D 转换）

参考图：`asset/human/original/doubao.jpg`（**成人版、3D 黏土风、手机截图**）

**转换原则**：参考图只取「是什么」，不取「怎么画」。画风必须变成与另外七张一致的 2D 日系 Q 版；固定元素一个都不能丢。

**必须保留**
1. 深栗棕色**齐脖内扣 bob 短发**，偏分，脸侧一缕较长鬓发
2. **深棕近黑的大圆眼**＋粗黑上睫毛＋细黑眉，温柔笑脸
3. **深砖红色针织围巾**（绕颈一圈，长端垂到腹部，末端流苏）—— 最强识别点
4. **黑色圆领卫衣**（罗纹袖口与下摆）
5. 黑色直筒长裤，裤脚外翻出**浅灰蓝色宽折边**
6. 黑鞋身、**灰色鞋底**的圆头厚底鞋
7. **无任何非人特征**：不加兽耳、角、尾巴、光环
8. 配色只用深栗棕／炭黑／砖红／雾灰蓝，**不加花纹与徽记**

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景。
> 角色：深栗棕色齐脖内扣鲍勃短发，偏分刘海，脸侧一缕较长鬓发；深棕近黑的大圆眼睛配粗黑上睫毛与细黑眉，温柔地笑；**没有任何兽耳、角、尾巴或光环**。
> 服装：深砖红色针织围巾绕颈一圈，长端垂到腹部，末端带流苏；黑色圆领卫衣配罗纹袖口与下摆；黑色直筒长裤，裤脚外翻出浅灰蓝色宽折边；黑色鞋身配灰色鞋底的圆头厚底鞋。
> 动作：站定，双手捧着一杯奶茶向前递出，肩膀放松，笑得甜甜的，眼神温柔地看着观者。
> 文字：画面下方贴着一张米黄色便利贴，右下角微微卷起并带阴影，纸条略微倾斜；纸条上用清晰的手写体分两行写着「我用最直白、最不绕弯子的」和「方式告诉你……」，字体工整不连笔，每个字都清晰可辨。画面中只允许出现这两行字。
> 构图：竖版 2:3，人物偏左，右侧与底部各留空白。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background. **Convert the 3D clay-render reference into flat 2D anime style; do not keep any 3D, clay or plastic-doll look.**
> Character: chestnut-brown chin-length bob with inward curl, side-parted bangs, one longer strand by the cheek; large dark-brown near-black round eyes with thick upper lashes and thin brows, gentle smile; **no animal ears, no horns, no tail, no halo**.
> Outfit: deep brick-red knit scarf wrapped once around the neck with a long fringed end hanging to the abdomen; black crewneck sweatshirt with ribbed cuffs and hem; black straight-leg trousers with wide pale blue-grey turned-up cuffs; black round-toe platform shoes with grey soles.
> Pose: standing, holding a cup of milk tea forward with both hands, relaxed shoulders, sweet smile, looking gently at the viewer.
> Text: at the bottom of the image there is a pale yellow sticky note with a slightly curled lower-right corner and a soft shadow, tilted a few degrees; on it, in clean legible handwriting in two lines: 「我用最直白、最不绕弯子的」 and 「方式告诉你……」. These must be the ONLY two lines of text in the image.
> Composition: vertical 2:3, character on the left, empty space on the right and at the bottom.

**特别注意**：负面词必须额外加 **3D 渲染、黏土质感、塑料高光、盲盒玩偶、写实皮肤**。这四条不加，模型很容易被参考图带回 3D。

## 12. 成品核对

- 仅使用正式目录中的 8 张 PNG，文件名与 manifest.json 一致，尺寸为 1024 × 1536。
- 角色的发色、瞳色、耳角尾与关键配饰符合各自设定。
- 动作保留：GPT 无笔、Claude 笔尖触纸、DeepSeek 双膝并拢抱膝、Gemini 双手在背后且异色瞳可见、豆包双手捧杯。
- Grok 两侧裙边充分遮盖，中央保留交叠腿部；发色为极浅香槟金。
- Kimi 服装为深藏青蓝，头发近雪白，两处 K 清晰。
- 逐字检查指定文案和标点，禁止额外文字；DeepSeek 六点底边与文字底部对齐、渐小渐淡，且不添加气泡。
- 生成方式为内置 image_gen；实际执行记录与最后采用的版本标识保存在 history.json 和 manifest.json，正式使用时只引用 final 目录中的 8 张图。

## 13. 后续物料信息

卡片具体尺寸、色带、分享图分栏、印量与现场配额仍按活动方案落实；这些排版与印刷事项不改变本批已确认插画。54 × 85 mm 是此前讨论的候选卡片尺寸，最终以物料方案为准。
