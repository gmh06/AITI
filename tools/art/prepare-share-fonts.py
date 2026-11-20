"""Subset the share-card fonts using FontTools with Brotli support.

Pass SmileySans-Oblique.ttf from the upstream v2.0.1 release:
https://github.com/atelier-anchor/smiley-sans/releases/tag/v2.0.1
"""

import argparse
import json
from pathlib import Path

from fontTools import subset


ROOT = Path(__file__).resolve().parents[2]
FONT_ASSETS = ROOT / 'web/assets/style'


def write_subset(source, output, text, family=None):
    options = subset.Options()
    options.flavor = 'woff2'
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 13, 14, 16, 17]
    font = subset.load_font(source, options)
    if family:
        names = {1: family, 3: family, 4: family, 6: family.replace(' ', ''), 16: family}
        for name in font['name'].names:
            if name.nameID in names:
                name.string = names[name.nameID]

    glyphs = subset.Subsetter(options=options)
    glyphs.populate(text=text, unicodes=range(32, 127))
    glyphs.subset(font)
    subset.save_font(font, FONT_ASSETS / output, options)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('smiley', type=Path)
    args = parser.parse_args()

    content = ROOT / 'web/src/content'
    people = json.loads((content / 'personalities.json').read_text(encoding='utf-8'))
    headings = '清华大学计算机科学与技术系第 44 届学生节11月29日 · 大礼堂'
    headings += ''.join(person['persona'] for person in people.values())
    descriptions = [person['description'] for person in people.values()]
    body = ''.join(
        text if isinstance(text, str) else ''.join(segment['text'] for segment in text)
        for text in descriptions
    )
    # Dimension labels are defined in TypeScript alongside their scoring order.
    body += (content / 'dimensions.ts').read_text(encoding='utf-8')
    engraved = ROOT / 'asset/design/typography/fonts/zcoolqingkehuangyou/ZCOOLQingKeHuangYou-Regular.ttf'
    write_subset(engraved, 'engraved-heading.woff2', headings)
    write_subset(args.smiley, 'share-reading.woff2', body, family='AITI Share Reading')


if __name__ == '__main__':
    main()
