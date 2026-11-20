"""Prepare the circle card study and portable display-lettering outlines.

No illustration pixels are edited. Existing source rectangles are preserved.
Requires Pillow, numpy and fontTools; run from any working directory.
"""
from copy import deepcopy
from hashlib import sha256
import json
from pathlib import Path
from xml.sax.saxutils import escape

import numpy as np
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen, DecomposingRecordingPen
from fontTools.pens.qu2cuPen import Qu2CuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'asset/design/card-studies/v5'
TYPE = ROOT / 'asset/design/typography/v1'
OUT.mkdir(parents=True, exist_ok=True)
TYPE.mkdir(parents=True, exist_ok=True)
FONTS = {
    'latin': ('Audiowide', 'asset/design/typography/fonts/audiowide/Audiowide-Regular.ttf'),
    'chinese': ('ZCOOL QingKe HuangYou', 'asset/design/typography/fonts/zcoolqingkehuangyou/ZCOOLQingKeHuangYou-Regular.ttf'),
}


def save_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def lettering(text, filename, height):
    family, file = FONTS['chinese' if text == '豆包' else 'latin']
    font = TTFont(ROOT / file)
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    recorded = RecordingPen()
    advance = 0
    for ch in text:
        name = cmap[ord(ch)]
        decomposed = DecomposingRecordingPen(glyphs)
        glyphs[name].draw(decomposed)
        # Convert every contour to straight lines and cubic curves, so the
        # draw.io SVG and System.Drawing preview share identical geometry.
        decomposed.replay(Qu2CuPen(TransformPen(recorded, (1, 0, 0, 1, advance, 0)), 0.5, all_cubic=True))
        advance += font['hmtx'][name][0]
    bounds = BoundsPen(None)
    recorded.replay(bounds)
    x0, y0, x1, y1 = bounds.bounds
    scale = height / (y1 - y0)
    width = (x1 - x0) * scale
    final = RecordingPen()
    recorded.replay(TransformPen(final, (scale, 0, 0, -scale, -x0 * scale, y1 * scale)))
    commands = [[op, [[round(x, 5), round(y, 5)] for x, y in pts]] for op, pts in final.value]
    assert all(op in ('moveTo', 'lineTo', 'curveTo', 'closePath', 'endPath') for op, pts in commands)
    assert all(len(pts) == 3 for op, pts in commands if op == 'curveTo')
    path = SVGPathPen(None)
    final.replay(path)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
           f'viewBox="0 0 {width} {height}"><title>{escape(text)}</title>'
           f'<path fill="#FFFFFF" d="{path.getCommands()}"/></svg>\n')
    (TYPE / (filename + '.svg')).write_text(svg, encoding='utf-8')
    save_json(TYPE / (filename + '.json'), {
        'text': text, 'fontFamily': family, 'fontFile': file,
        'fontSha256': sha256((ROOT / file).read_bytes()).hexdigest(),
        'width': width, 'height': height, 'commands': commands,
    })
    font.close()
    return {
        'type': 'lettering', 'value': text, 'fontFamily': family,
        'file': (TYPE / (filename + '.svg')).relative_to(ROOT).as_posix(),
        'outlineFile': (TYPE / (filename + '.json')).relative_to(ROOT).as_posix(),
        'w': width, 'h': height, 'fill': '#FFFFFF',
    }


def enclosing_circle(image_file, source_rect):
    alpha = np.asarray(Image.open(ROOT / image_file).getchannel('A'))
    x0, y0, w, h = map(int, source_rect)
    points = []
    for y in range(y0, y0 + h):
        xs = np.flatnonzero(alpha[y, x0:x0+w] >= 16)
        if xs.size:
            points.append((float(xs[0] + x0), float(y)))
            points.append((float(xs[-1] + x0), float(y)))
    pts = np.asarray(points)
    center = (pts.min(axis=0) + pts.max(axis=0)) / 2
    # Center the visible silhouette, then enclose every row endpoint (and hence
    # every foreground pixel), including action props. Faint page-wide alpha
    # noise is outside the already approved source crop.
    radius = float(np.max(np.sum((pts-center)**2, axis=1)))**0.5 + 1
    return center, radius


study = json.loads((OUT / 'scenes.json').read_text(encoding='utf-8'))
study.update({
    'schemaVersion': 3,
    'previewLabels': False,
    'status': 'saved-card-front-version',
    'method': 'Analytic draw.io composition with a true circular translucent backing and portable outlined display typography.',
    'notes': [
        'Only official Beyond Context wordmark, AITI and model name are visible.',
        'Official wordmark at upper left, AITI at upper right, model name at lower left.',
        'Equal-width-and-height circle; complete caption-free character and props fitted uniformly inside.',
        'Full city viewport above the floor, unchanged from v4.',
        'Lettering is independent vector art; original strings and font sources remain in the scene and outline metadata.',
    ],
    'constraints': {
        'visibleLabels': ['Beyond Context', 'AITI', 'modelName'],
        'noCharacterCaptions': True, 'floorExcluded': True,
        'backingShape': 'true-circle', 'completeForegroundInsideBacking': True,
        'noCharacterClipping': True, 'characterSourceRectsUnchanged': True,
    },
})
aiti = lettering('AITI', 'aiti', 28)
circle = {'type': 'circle', 'x': 26, 'y': 190, 'w': 548, 'h': 548}
cx, cy, radius = 300, 464, 274
rows = []
for scene in study['scenes']:
    character = deepcopy(next(o for o in scene['ops'] if o['layer'] == 'character'))
    logo = deepcopy(next(o for o in scene['ops'] if o['type'] == 'image' and o['layer'] == 'brand'))
    background = [deepcopy(o) for o in scene['ops'] if o['layer'] in ('paper', 'scene')]
    # Keep the lower-left title readable without adding footer copy or lines.
    for o in background:
        if o['type'] == 'rect' and o.get('y') == 775:
            o['opacity'] = 0.35
    source_center, source_radius = enclosing_circle(character['file'], character['sourceRect'])
    scale = (radius - 20) / source_radius
    x0, y0, w, h = character['sourceRect']
    character.update({
        'x': cx + (x0-source_center[0])*scale,
        'y': cy + (y0-source_center[1])*scale,
        'w': w*scale, 'h': h*scale,
    })
    backing = {'type': 'ellipse', 'x': 26, 'y': 190, 'w': 548, 'h': 548,
               'fill': '#F4FAFF', 'opacity': 0.77,
               'stroke': '#FFFFFF', 'strokeWidth': 1.2, 'layer': 'backing'}
    top = deepcopy(aiti)
    top.update({'x': 556-top['w'], 'y': 48, 'layer': 'brand'})
    title = lettering(scene['name'], scene['id'], 43)
    title.update({'x': 44, 'y': 813, 'layer': 'information'})
    scene['ops'] = background + [backing, character, logo, top, title]
    scene['title'] = scene['name'] + ' · 圆形承托讨论稿'
    scene['backingGeometry'] = deepcopy(circle)
    scene['frame'] = deepcopy(circle)
    scene['foreground'] = {k: character[k] for k in ('x', 'y', 'w', 'h', 'sourceRect')}
    scene['containment'] = {
        'backingType': 'circle', 'center': [cx, cy], 'radius': radius,
        'nativeSilhouetteCircle': {'center': source_center.tolist(), 'radius': source_radius},
        'fitScale': scale, 'minimumMargin': 20,
        'alphaThreshold': 16, 'sourceRectUnchanged': True,
        'method': 'Enclose the approved crop silhouette, including all props; uniform scale, no circle clipping.',
    }
    rows.append({'model': scene['id'], 'scale': round(scale, 4), 'letteringWidth': round(title['w'], 2)})

save_json(OUT / 'scenes.json', study)
print(json.dumps({'cards': len(rows), 'circleDiameter': 548, 'labelsPerCard': 3, 'items': rows}, ensure_ascii=False))
