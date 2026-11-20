import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const folder = path.join(root, 'asset/design/backgrounds/v3');
const load = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const pack = await load(path.join(folder, 'prompts.json'));
const records = [];
for (const name of (await fs.readdir(path.join(folder, 'records'))).filter(x => x.endsWith('.json')).sort()) {
  records.push(await load(path.join(folder, 'records', name)));
}
const assets = [];
const pages = [];
for (const spec of pack.images) {
  const record = records.find(x => x.id === spec.id);
  if (!record || record.prompt !== spec.prompt) throw new Error(`Missing executed prompt: ${spec.id}`);
  const data = await fs.readFile(path.join(folder, record.file));
  const source = await fs.readFile(path.join(root, record.source));
  if (sha(data) !== record.sha256 || sha(source) !== record.sourceSha256) throw new Error(`Hash mismatch: ${spec.id}`);
  const width = data.readUInt32BE(16), height = data.readUInt32BE(20);
  const titleZh = spec.titleZh.replace(/\s*\d+:\d+/g, '');
  const knownRatios = [[1, 2], [2, 3], [3, 4], [3, 2], [16, 9], [9, 16]];
  const match = knownRatios.find(([w, h]) => Math.abs(width / height - w / h) < 0.002);
  const nativeRatio = match ? `${width * match[1] === height * match[0] ? '' : '~'}${match[0]}:${match[1]}` : `${width}:${height}`;
  assets.push({
    id: record.id, file: record.file, titleZh, width, height, nativeRatio,
    bytes: data.length, sha256: sha(data), source: record.source, sourceSha256: record.sourceSha256,
    requestedWidth: spec.targetWidth, requestedHeight: spec.targetHeight, requestedRatio: spec.ratio,
    quietZones: spec.quietZones, nativePixelsPreserved: true, status: 'generated-awaiting-review'
  });
  const base = `<mxCell id="background" value="" style="shape=image;imageAspect=0;aspect=fixed;image=data:image/png,${data.toString('base64')};locked=1;" vertex="1" parent="background-layer"><mxGeometry x="0" y="0" width="${width}" height="${height}" as="geometry"/></mxCell>`;
  const controls = spec.quietZones.map((z, i) => `<mxCell id="lift-${i}" value="" style="shape=rectangle;rounded=1;arcSize=20;fillColor=#FFFFFF;strokeColor=none;opacity=25;" vertex="1" parent="lift-layer"><mxGeometry x="${Math.round(z.x * width)}" y="${Math.round(z.y * height)}" width="${Math.round(z.w * width)}" height="${Math.round(z.h * height)}" as="geometry"/></mxCell>`).join('');
  const guides = spec.quietZones.map((z, i) => `<mxCell id="guide-${i}" value="${xml(z.role)}" style="shape=rectangle;fillColor=none;strokeColor=#D97706;dashed=1;fontColor=#9A3412;fontSize=18;verticalAlign=top;align=left;spacing=8;" vertex="1" parent="guide-layer"><mxGeometry x="${Math.round(z.x * width)}" y="${Math.round(z.y * height)}" width="${Math.round(z.w * width)}" height="${Math.round(z.h * height)}" as="geometry"/></mxCell>`).join('');
  pages.push(`<diagram id="${xml(spec.id)}" name="${xml(titleZh)}"><mxGraphModel grid="1" gridSize="10" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" background="#FFFFFF"><root><mxCell id="0"/><mxCell id="background-layer" value="背景原图" parent="0"/><mxCell id="lift-layer" value="可选浅化遮罩（默认隐藏）" parent="0" visible="0"/><mxCell id="guide-layer" value="候选内容区参考线（默认隐藏）" parent="0" visible="0"/>${base}${controls}${guides}</root></mxGraphModel></diagram>`);
}
const selected = new Set(assets.map(x => x.id));
const alternatives = records.filter(x => !selected.has(x.id)).map(x => ({ id: x.id, file: x.file, width: x.width, height: x.height, sha256: x.sha256, reason: 'Earlier candidate retained for provenance; use selected assets for the current library.' }));
pack.status = 'generated-awaiting-review';
pack.updatedDate = '2026-11-20';
await fs.writeFile(path.join(folder, 'prompts.json'), JSON.stringify(pack, null, 2) + '\n');
await fs.writeFile(path.join(folder, 'manifest.json'), JSON.stringify({
  schemaVersion: 1, date: '2026-11-20', startedDate: pack.date, generator: 'built-in image_gen',
  status: 'generated-awaiting-review', promptsFile: 'prompts.json', historyFile: 'history.json',
  drawioFile: 'backgrounds.drawio', previewFile: 'preview.jpg',
  dimensionPolicy: 'width and height are actual native PNG dimensions, not requested sizes. No resampling or stretching was applied.',
  quietZonePolicy: 'Approximate normalized composition guides in the native image, not final text or runtime chart slot coordinates.',
  assets, retainedAlternatives: alternatives
}, null, 2) + '\n');
await fs.writeFile(path.join(folder, 'history.json'), JSON.stringify({
  schemaVersion: 1, date: '2026-11-20', generator: 'built-in image_gen',
  status: 'generated-awaiting-review', recordOrder: 'By identifier; concurrent execution order is not implied.', records
}, null, 2) + '\n');
await fs.writeFile(path.join(folder, 'backgrounds.drawio'), '<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" type="device">' + pages.join('') + '</mxfile>\n');
console.log(JSON.stringify({ selectedAssets: assets.length, executions: records.length, drawioPages: pages.length, actualDimensions: assets.map(({ file, width, height }) => ({ file, width, height })) }));
