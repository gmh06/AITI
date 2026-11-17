# AITI 卡片形象 · 生图 Prompt 集

面向：8 个 AI 娘化形象的卡片插画，逐张用生图模型生成，**文字也由模型直接画进画面，不做后期贴字**。
状态：角色动作与文本层已定稿；画幅已定竖版；具体版面、配色、印量仍未定。

---

## 0. 三个前提（先读，能省掉一半返工）

**一、文字必须在图里，所以文字是这批图最大的风险点。**
Grok 的弹幕条、DeepSeek 的思绪、豆包的便签，都要一次画对。三条纪律：

- 文字用中文直角引号「」或英文双引号**逐字给出**，并明确写「画面中只允许出现这组字，不得增删改、不得出现其他文字」；
- 中文长句最容易糊，豆包那句 20 字的手写便签风险最高，必须多采样择优；
- 另外五张（GPT、GLM、Kimi、Claude、Gemini）**要求画面完全无字**，防止模型自己加装饰字。

**二、统一画风锚点必须每一张都带。**
八张哪怕同一个人同一天同模型跑，风格也会漂。下面这段是公共段，每张 prompt 开头原样复制：

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色，不用纯黑），柔和淡彩上色，低饱和配色，统一左上方向柔光，浅色背景（近白或极浅薰衣草），无场景、无投影、无边框。

**三、参考图分配。**

- **GPT / DeepSeek / Claude**：设计参考用 `asset/mini2_character/` 里的同名小记（最新版，带细节特写与「别画错」提示）；旧四视图 `asset/mini_character/` 仅作细节补查。
- **GLM / Grok / Kimi / Gemini**：只有旧四视图 `asset/mini_character/`，以它为准（暂无小记）。
- **豆包**：只有成人版 3D 图 `asset/original_character/doubao.jpg`，按第 11 节转 2D。
- **画风基准统一取三张小记**（`asset/mini2_character/` 任意一张）：即使设计参考是旧四视图，画风也照小记的细线稿＋柔和淡彩来。

**四、豆包要单独处理画风。**
`asset/original_character/doubao.jpg` 是 **3D 黏土玩偶风**，其余七张是 **2D 日系 Q 版**。豆包的 prompt 必须明确「转 2D 日系 Q 版」，只保留它的固定元素（见第 11 节）。

---

## 1. 画幅与留白

| 项 | 规定 |
| :--- | :--- |
| 比例 | **竖版 2:3**（54 × 85 mm 卡片最接近的比例，裁切损失最小） |
| 生成尺寸 | 1024 × 1536 起，印刷建议 1536 × 2304 |
| 人物占比 | 画面高度约 60–70%，居中偏左 |
| 默认留白 | 右侧约 30% |
| 顶部／底部 | 各留 8–10% |
| 文字区位 | DeepSeek 顶部 25%、Grok 左上角、豆包下缘 |

---

## 2. 负面提示词（分三段用，不要混）

**A. 通用负面词（八张都加）**

> 写实风格，真实照片，3D 渲染，黏土质感，厚涂，油画感，多手，多指，手指畸形，手部模糊，五官歪斜，头身比例失调，头部过小，身体过宽，背景场景，房间，家具，地面投影，水印，签名，logo，二维码，边框，贴纸，成人化，性感化，露骨，暴露，血腥，恐怖，扭曲面部，两人，多人，群像，第二个人物

**B. 无字卡追加（GPT、GLM、Kimi、Claude、Gemini 五张）**

> 任何文字，任何字母，任何数字，标语，装饰文字，题字，签名，花纹字体，乱码

**C. 有字卡追加（Grok、DeepSeek、豆包 三张）**

> 错别字，缺字，多字，繁体字，乱码，扭曲文字，镜像文字，重复文字，第二处文字，额外标签，英文混排（Grok 除外）

---

## 3. 画面文字的写法（三张卡的确切内容）

生图模型对文字的处理规律：**越短越稳、越像印刷体越稳、越少越稳**。所以三张卡的写法都要求「唯一文字」＋「逐字给出」＋「给字形定性」。

### Grok 弹幕条

- **确切内容**：`Grok, is this real?`
- **形态**：白色、约 85% 不透明度的圆角小条，深灰无衬线字母，横置于画面左上，轻微倾斜 −3°，字高约占画面宽度 4%，全小写英文
- **写进 prompt 的句子**：

> 画面左上方横着一条白色圆角小条，条内用深灰色无衬线小号英文字母写着「Grok, is this real?」，全小写，带逗号和问号。这是画面中唯一出现的文字，不得出现任何其他字母、数字或符号。

### DeepSeek 思绪

- **确切内容**：`嗯，用户现在……`
- **形态**：无底色，浅灰蓝细字，位于头顶右上方，字高约占画面宽度 5%，字迹清淡半透明，旁边三个由大到小逐渐淡出的小圆点
- **写进 prompt 的句子**：

> 人物头顶右上方漂浮着一行浅灰蓝色的细体中文小字「嗯，用户现在……」，字迹清淡、略透明，像思绪；文字右侧有三个由大到小逐渐淡出的小圆点。画面中只允许出现这几个字。

### 豆包便签

- **确切内容**：`我用最直白、最不绕弯子的方式告诉你……`
- **形态**：米黄色便利贴，右下角微卷带投影，倾斜约 4°，贴在画面下缘；手写感但**不连笔**，分两行排（第一行「我用最直白、最不绕弯子的」，第二行「方式告诉你……」）
- **写进 prompt 的句子**：

> 画面下方贴着一张米黄色便利贴，右下角微微卷起并带阴影，纸条略微倾斜；纸条上用清晰的手写体分两行写着「我用最直白、最不绕弯子的」和「方式告诉你……」，字体工整不连笔，每个字都清晰可辨。画面中只允许出现这两行字。

**这一张是八张里最可能失败的。** 20 个汉字＋手写体＋两行排，任何一个环节崩都会出现错字。若连续多张都糊，按这个顺序退让：

1. 把「手写体」改成「工整的圆体」——印刷感越强越容易画对；
2. 把两行改成三行，每行更短；
3. 缩短文案（需你拍板，例如改成「我用最直白的方式告诉你……」11 字）；
4. 最后才考虑这一张退回后期贴字。

---

## 4. GPT · 审阅

参考图：`asset/mini2_character/gpt.jpg`（主，Q版小记）；`asset/mini_character/gpt.jpg`（细节补查）

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，画面中不得出现任何文字。
> 角色：雪白及腰大波浪卷发（发色偏白、带一点浅紫），头顶一根细长上翘呆毛，齐眉碎刘海，两侧长鬓蓬松外翻；瞳孔是紫色（**别画成蓝色**），半垂眼、眼尾一道红棕色挑线；头顶一对象牙白分节龙角，向后上方弯；尖长精灵耳。**没有尾巴，没有翅膀。**
> 服装：白色小礼服式蓬蓬短裙，泡泡袖与荷叶边层叠裙摆，胸前细链条与蓝色菱形垂饰；左侧一枚银白色花结发饰，垂小环与流苏；白色短靴，鞋面带蝴蝶结绑带。
> 动作：正面站立，肩膀微微内缩，双手捏着一页白纸的两角翻看（纸是唯一道具，画面中不出现笔），低头盯着纸，眉心紧皱，不抬眼看镜头。
> 构图：竖版 2:3，人物居中偏左，右侧留约 30% 空白，顶部留 10%。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel shading, desaturated palette, pure white background, NO text of any kind in the image.
> Character: waist-length wavy white hair with a faint lavender tint and a single long ahoge, blunt bangs, thick side locks; **purple** half-lidded eyes with a reddish-brown wing line (never blue); a pair of ivory segmented dragon horns curving back; pointed elf ears. **No tail, no wings.**
> Outfit: white party-style puffy short dress with puff sleeves and tiered ruffled hem, a delicate chest chain with blue diamond pendants, a silver-white knotted hair ornament with tassel on the left, white ankle boots with ribbon lacing.
> Pose: standing front-facing, shoulders slightly hunched, holding a single sheet of white paper by its two top corners with both hands, head lowered staring at the paper, brows knitted, not looking at camera. No pen.
> Composition: vertical 2:3, character centered-left, ~30% empty space on the right, 10% headroom.

**验收**：龙角、紫瞳、尖耳都在（**不要出现尾巴和翅膀**）；只有一页纸、无笔；眼睛是「半垂的不耐烦」；画面无任何文字。

---

## 5. DeepSeek · 望天

参考图：`asset/mini2_character/deepseek.jpg`（主，Q版小记）；`asset/mini_character/deepseek.jpg`（细节补查）

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景。
> 角色：靛蓝到浅雾蓝渐变的及腰大波浪卷发，厚齐眉刘海，头顶正上方悬浮一枚蓝色圆环；宝石蓝到冰蓝渐变的圆润大眼、眼下有小点腮红；一对大而明显的鲸鱼胸鳍状耳朵（外蓝内白、带鳍纹，张开后接近头部宽度），一条藏青鲸尾从腰后伸出；眼睛是蓝色（**别换瞳色**）。
> 服装：白色高领竖褶衬衫配深蓝纽扣，藏青泡泡袖短外套（袖口古铜金滚边与白蕾丝），胸前深藏青大蝴蝶结配浅蓝宝石胸针；藏青束腰双排古铜金纽扣；藏青短裙接浅蓝横带（金藤蔓小花纹）与白蕾丝衬裙；白色蕾丝荷叶边围裙，围裙正中一枚喷水的藏青鲸鱼图案；藏青玛丽珍鞋，白色及膝袜。
> 动作：盘腿坐在地上，双手抱着膝盖，一只手的手指无意识地敲着膝盖，仰头望上方放空，腮帮子微微鼓起，嘴角飘一个小泡泡，表情专注又走神。
> 文字：人物头顶右上方漂浮着一行浅灰蓝色的细体中文小字「嗯，用户现在……」，字迹清淡、略透明，像思绪；文字右侧有三个由大到小逐渐淡出的小圆点。画面中只允许出现这几个字，不得出现其他任何文字。
> 构图：竖版 2:3，人物整体压低坐姿，头顶留约 25% 空白，人物居中偏左。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background.
> Character: waist-length wavy indigo-to-pale-blue gradient hair, thick blunt bangs, a floating blue ring above the head; round sapphire-to-ice-blue eyes with small blush dots; large prominent whale-fin-shaped ears (blue outside, white inside, spread nearly as wide as the head), a navy whale tail at the waist; **blue** eyes, never change the eye color.
> Outfit: white high-collar pleated blouse with navy buttons, navy puff-sleeve cropped jacket with antique-gold trim and white lace, large navy bow with a pale blue gem brooch; navy corset belt with double rows of gold buttons; navy short skirt with a light-blue band, white lace petticoat; white lace ruffled apron with a small spouting navy whale emblem at its center; navy Mary Janes, white knee socks.
> Pose: sitting cross-legged on the floor hugging her knees, one hand idly tapping her knee, head tilted up staring blankly, cheeks slightly puffed, a small bubble at the corner of her mouth.
> Text: a single line of small, pale blue-grey, slightly translucent Chinese text 「嗯，用户现在……」 floats above and to the right of her head, with three dots fading out to its right. This must be the ONLY text in the image.
> Composition: vertical 2:3, seated low, 25% empty space above the head, character centered-left.

**验收**：头顶圆环、大鲸鳍、鲸尾都在；眼睛必须是蓝色；鲸鱼徽记别画成别的动物；思绪文字只有那一行，且没有变成对话气泡。

---

## 6. GLM · 上手

参考图：`asset/mini_character/glm.jpg`

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

**注意**：设定图上有五处「Z」字母徽记。让模型画字母必崩，所以 prompt 里全部写成**素面金属扣牌**，这一张定为无字卡。

---

## 7. Grok · 看戏

参考图：`asset/mini_character/grok.jpg`

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.6 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景。
> 角色：香槟金的高位巨型双马尾大波浪卷发，刘海偏分露额，两侧碎发贴脸；天蓝色宝石眼、上眼线粗挑，腮红明显，张口露出一颗上虎牙；一对尖长精灵耳。
> 服装：头顶黑色小金冠（正面一枚圆形罗盘徽章），冠后一枚大型新月饰，两侧黑色大蝴蝶结各挂一枚黑色小蝙蝠翼；黑色哥特式露肩上衣（大领口配黑蕾丝），黑色缎面领结配罗盘金属徽章，酒红色内衬小斗篷；黑色紧身束腰配金链与罗盘徽章；黑色不对称高低裙（金色刺绣滚边、酒红内衬荷叶边）；黑色高跟短靴配金色罗盘搭扣；黑色半透丝袜与带金饰的大腿环。
> 动作：坐在一道台座上，一条腿自然垂下，身体前倾，一只手托腮；挑眉坏笑，斜眼瞟向观者，一副看戏的样子。
> 文字：画面左上方横着一条白色圆角半透明小条，条内用深灰色无衬线小号英文字母写着「Grok, is this real?」，全小写，带逗号和问号，轻微软斜。这是画面中唯一出现的文字，不得出现任何其他字母、数字或符号。
> 构图：竖版 2:3，人物偏右，左上方留出空白，底部保留垂下的腿。

**English Prompt**

> 2D anime chibi illustration, ~2.6 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background.
> Character: champagne-gold enormous twin-tails with big curls, side-parted bangs, face-framing strands; sky-blue jewel eyes with thick upturned liner, strong blush, mouth open showing one small fang; pointed elf ears.
> Outfit: small black-and-gold crown with a round compass medallion, a large crescent ornament behind it, black bows on both sides each with a tiny black bat wing; black gothic off-shoulder top with lace, black satin bow with a compass medallion, wine-red lined mini capelet; black corset with gold chain and compass medallion; black asymmetric high-low skirt with gold embroidery and wine-red ruffled lining; black heeled ankle boots with gold compass buckles; sheer black tights and a gold-trimmed thigh band.
> Pose: sitting on a plinth with one leg hanging down, leaning forward, one hand propping her cheek; smirking with raised eyebrow and a sideways glance at the viewer.
> Text: in the upper-left there is a small white rounded semi-transparent bar containing the lowercase sans-serif grey English text "Grok, is this real?" with a comma and question mark. This must be the ONLY text in the image — no other letters, numbers or symbols anywhere.
> Composition: vertical 2:3, character on the right, empty space upper-left, keep the hanging leg in frame.

**验收**：虎牙、新月饰、蝙蝠翼三个小元素掉一个就变普通金发大小姐；弹幕条内文字必须一字不差，且不能多出第二个文字块。

---

## 8. Kimi · 抱书

参考图：`asset/mini_character/kimi.jpg`

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，画面中不得出现任何文字。
> 角色：银白色（带极浅薰衣草反光）的及腰大波浪卷发，极蓬松，厚刘海，两侧长鬓；薰衣草紫色大眼，眼中有四角星高光，温柔微笑；无兽耳无角无尾。
> 服装：白色蕾丝荷叶边发箍；右侧一串挂饰（银色新月、银色八分音符、藏青蝴蝶结、薰衣草紫菱形水晶坠）；白色高领荷叶边衬衫，藏青缎面蝴蝶结配圆形银边徽章（**素面，不带字母**）；藏青束腰马甲（银纽扣与细银链）；藏青短披肩式小斗篷，肩片印月亮与星座细线；不对称高低裙，上层藏青星空与五线谱音符印花、下摆为钢琴琴键式条带，内层白与紫多层荷叶边；藏青玛丽珍鞋，白色过膝袜。
> 动作：抱着一摞窄而高的书与文件（高过下巴），下巴轻轻压在最上面那一本上，从资料后面露出眼睛看观者，安静地笑。
> 构图：竖版 2:3，那一摞资料形成纵向高轮廓，人物居中偏左，右侧留约 30% 空白。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background, NO text of any kind.
> Character: voluminous waist-length wavy silver-white hair with faint lavender sheen, thick bangs, long side locks; large lavender eyes with four-pointed star highlights, gentle smile; no animal ears, no horns, no tail.
> Outfit: white lace ruffled headband; a hanging charm cluster on her right (silver crescent moon, silver eighth note, navy bow, lavender crystal drop); white high-collar ruffled blouse with a navy satin bow and a **blank** round silver-rimmed badge; navy corset vest with silver buttons and fine chain; navy capelet with moon and constellation line art; asymmetric high-low skirt with navy starry and music-staff print, piano-key border, white and lilac layered ruffles beneath; navy Mary Janes, white over-knee socks.
> Pose: holding a narrow, tall stack of books and papers that rises above her chin, chin resting on the topmost book, peeking at the viewer over the stack with a quiet smile.
> Composition: vertical 2:3, the stack forms a tall vertical silhouette, centered-left, ~30% empty space on the right.

**验收**：徽章必须是素面（不能冒出字母）；书堆高过下巴；右手那串挂饰别丢。

---

## 9. Claude · 点案

参考图：`asset/mini2_character/claude.jpg`（主，Q版小记）；`asset/mini_character/claude.jpg`（细节补查）

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

参考图：`asset/mini_character/gemini.jpg`

**中文 Prompt**

> 2D 日系轻插画，Q 版约 2.8 头身，细线稿（深灰褐色），柔和淡彩上色，低饱和柔和配色，纯白背景，画面中不得出现任何文字。
> 角色：长春花蓝到樱花粉渐变的蓬松及腰长卷发，耳上两侧各一个丸子包头，头顶一根大呆毛；**异色瞳**（画面左眼紫红细瞳、画面右眼金琥珀色），眼中带星形高光；脸颊贴小星点贴饰；一对大型猫耳（外蓝紫、内侧粉色绒毛），一条蓬松紫蓝渐变猫尾。
> 服装：藏蓝短款挂颈上衣（露腰，面料带星空亮片与星纹），胸前四角星胸针垂星链；深蓝紫开襟短外套（宽大幻彩星空渐变袖、白蕾丝荷叶袖口）；藏蓝配白荷叶边短裙，髋侧挂星形坠；厚底松糕鞋（藏蓝鞋身配幻彩珠光厚底、星形挂饰），白色绒毛袜套；右耳侧一枚大型幻彩四角星发饰。
> 动作：站着，上身前倾，双手背在身后，仰头看观者，笑得眼睛眯成弯月，一副等着被表扬的样子。
> 构图：竖版 2:3，人物偏左，右侧留约 30% 空白。

**English Prompt**

> 2D anime chibi illustration, ~2.8 heads tall, thin dark-brown outlines, fine lineart with soft pastel coloring, desaturated palette, pure white background, NO text of any kind.
> Character: voluminous waist-length curly hair gradient from periwinkle blue to sakura pink, two buns on top of the ears, one big ahoge; **heterochromia** (viewer-left eye magenta with a slit pupil, viewer-right eye golden amber), star-shaped highlights; tiny star stickers on the cheek; large cat ears (blue-purple outside, pink fluff inside), a fluffy blue-purple gradient cat tail.
> Outfit: navy halter crop top with starry glitter fabric and a four-point star brooch with a star chain; deep blue-violet open short jacket with iridescent starry wide sleeves and white lace cuffs; navy skirt with white ruffles and a star charm at the hip; chunky platform shoes with iridescent pearl soles and star charms, white fluffy leg warmers; a large iridescent four-point star hair ornament.
> Pose: standing, upper body leaning forward, both hands behind her back, head tilted up looking at the viewer, eyes squinted into happy crescents, waiting to be praised.
> Composition: vertical 2:3, character on the left, ~30% empty space on the right.

**验收**：异色瞳左右不能反（画面左紫红、右金琥珀）；双手必须在身后，不能变成比手势；画面无字。

---

## 11. 豆包 · 端茶（3D → 2D 转换）

参考图：`asset/original_character/doubao.jpg`（**成人版、3D 黏土风、手机截图**）

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

---

## 12. 生成流程、重试与验收

**模型选择**：优先选对中文文字渲染较稳的模型（图像编辑/原生图像类模型通常明显强于纯扩散模型），具体以你手上可用的为准；MJ 这类基本画不了中文，不要用。

**采样**：每个角色先跑 8–12 张。无字五张只挑构图和手部合格的；有字三张要额外过文字关，往往二十张里才有一张字全对。

**逐张验收清单**

1. 头身比 2.6–3 头身（太写实像少女漫画，太Q像表情包）
2. 非人特征齐全（龙角龙尾／鳍耳鲸尾／兽耳狐尾／虎牙蝙蝠翼／猫耳猫尾；Kimi 与豆包必须没有）
3. 手部没有多指、粘连、与道具融合
4. 动作与定稿一致（GPT 无笔、Claude 笔已落、Gemini 手在背后、豆包双手捧杯）
5. 有字三张：**逐字核对**，标点也要对；画面里不能出现第二处文字
6. 无字五张：确认整张图没有任何文字、字母、装饰性题字
7. 背景纯色无场景
8. 八张缩略图排一排，发色与气质是否仍是一套

**最常崩的三处与修法**

| 问题 | 修法 |
| :--- | :--- |
| 手部畸形（捏纸、托腮、捧杯最容易崩） | 换采样；仍不行就把手简化成藏进袖子或被道具遮挡，prompt 加 "hands partly hidden" |
| 中文文字糊字/错字（豆包那张高发） | 先换模型；再改「工整圆体」；再拆三行；仍失败才缩短文案或退回后期 |
| 模型自动补出第二个角色、或自行添加装饰文字 | 负面词保留「两人、多人、第二个人物」与「额外标签、第二处文字」 |

---

## 13. 仍未定、但不影响出图的部分

- 卡片具体尺寸（54×85 已验证可行，最终待物料确认）
- 八款配色与色带
- 单页分享图与翻转卡正面的分栏比例
- 印量与两场配额
