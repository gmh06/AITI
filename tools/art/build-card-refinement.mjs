import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const version=process.argv[2]??'v2';
if(!/^v\d+(?:\/(?:panel|burst))?$/.test(version))throw new Error('Expected a study version such as v3 or v4/panel');
const dir=path.join(root,'asset/design/card-studies',version);
const study=JSON.parse(await fs.readFile(path.join(dir,'scenes.json'),'utf8'));
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const assets=new Map();
async function read(file){if(!assets.has(file)){const b=await fs.readFile(path.join(root,file));assets.set(file,{bytes:b,width:b.readUInt32BE(16),height:b.readUInt32BE(20),sha256:hash(b)});}return assets.get(file);}
async function readVector(file){if(!assets.has(file)){const b=await fs.readFile(path.join(root,file));assets.set(file,{bytes:b,sha256:hash(b)});}return assets.get(file);}
const layers=study.layers??['paper','scene','frame','character','caption','brand','information'];
let serial=0;
async function cell(o,parent){
  const id='object-'+serial++;
  const opacity=(o.opacity??1)*100;
  if(o.type==='group'){
    let children='';for(const child of o.children)children+=await cell(child,id);
    return `<mxCell id="${id}" value="" style="group;rotation=${o.rotation??0};" vertex="1" parent="${parent}"><mxGeometry x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" as="geometry"/></mxCell>${children}`;
  }
  let style,geometry;
  if(o.type==='image'){
    const a=await read(o.file);const [x,y,w,h]=o.sourceRect;
    const clip=o.radius?`<defs><clipPath id="r"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.radius*w/o.w}"/></clipPath></defs>`:'';
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">${clip}<image x="0" y="0" width="${a.width}" height="${a.height}" ${o.radius?'clip-path="url(#r)"':''} xlink:href="data:image/png;base64,${a.bytes.toString('base64')}"/></svg>`;
    style=`shape=image;imageAspect=0;aspect=fixed;image=data:image/svg+xml,${encodeURIComponent(svg)};`;
  }else if(o.type==='lettering'){
    const svg=await readVector(o.file);await readVector(o.outlineFile);
    style=`shape=image;imageAspect=0;aspect=fixed;image=data:image/svg+xml,${encodeURIComponent(svg.bytes.toString('utf8'))};`;
  }else if(o.type==='polygon'){
    const xs=o.points.map(x=>x[0]),ys=o.points.map(x=>x[1]);
    const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}"><polygon points="${o.points.map(p=>p.join(',')).join(' ')}" fill="${o.fill}" fill-opacity="${o.opacity??1}" stroke="${o.stroke??'none'}" stroke-width="${o.strokeWidth??1}"/></svg>`;
    style=`shape=image;imageAspect=0;image=data:image/svg+xml,${encodeURIComponent(svg)};`;
    geometry=`<mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/>`;
  }else if(o.type==='text')style=`text;html=0;whiteSpace=wrap;align=left;verticalAlign=top;spacing=0;fontFamily=${o.fontFamily??'Microsoft YaHei'};fontSize=${o.size};fontStyle=${o.bold?1:0};fontColor=${o.color};fillColor=none;strokeColor=none;`;
  else if(o.type==='line')style=`endArrow=none;startArrow=none;strokeColor=${o.stroke};strokeWidth=${o.width};opacity=${opacity};`;
  else style=`shape=${o.type==='ellipse'?'ellipse':'rectangle'};rounded=${o.radius?1:0};absoluteArcSize=1;arcSize=${(o.radius??0)*2};fillColor=${o.fill??'none'};strokeColor=${o.stroke??'none'};strokeWidth=${o.strokeWidth??1};opacity=${opacity};`;
  if(o.type==='line')geometry=`<mxGeometry relative="1" as="geometry"><mxPoint x="${o.x1}" y="${o.y1}" as="sourcePoint"/><mxPoint x="${o.x2}" y="${o.y2}" as="targetPoint"/></mxGeometry>`;
  geometry??=`<mxGeometry x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" as="geometry"/>`;
  return `<mxCell id="${id}" value="${esc(o.type==='lettering'?'':o.value??'')}" ${o.type==='lettering'?`data-label="${esc(o.value)}" `:''}style="${esc(style)}" ${o.type==='line'?'edge':'vertex'}="1" parent="${parent}">${geometry}</mxCell>`;
}
const pages=[];
for(const s of study.scenes){
  let body='<mxCell id="0"/>'+layers.map(l=>`<mxCell id="${l}" value="${l}" parent="0"/>`).join('');
  for(const o of s.ops){if(!layers.includes(o.layer))throw new Error(`Unknown layer: ${o.layer}`);body+=await cell(o,o.layer);}
  pages.push(`<diagram id="${s.id}" name="${esc(s.name)}"><mxGraphModel page="1" pageScale="1" pageWidth="600" pageHeight="900" background="#F8FAFD"><root>${body}</root></mxGraphModel></diagram>`);
}
await fs.writeFile(path.join(dir,'refined.drawio'),'<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" type="device">'+pages.join('')+'</mxfile>\n');
await fs.writeFile(path.join(dir,'manifest.json'),JSON.stringify({schemaVersion:1,date:'2026-11-20',version,status:study.status??'refined-study-awaiting-review',constraints:study.constraints??null,method:'Analytic composition of existing illustrations, editable vector/text/frame layers and original raster inputs; no new generated character art.',source:'scenes.json',drawio:'refined.drawio',layoutWidth:600,layoutHeight:900,previewWidth:1200,previewHeight:1800,layers,assets:study.scenes.map(s=>({model:s.id,file:s.id+'.png',name:s.name})),inputs:[...assets].map(([file,{width,height,sha256}])=>({file,width,height,sha256}))},null,2)+'\n');
console.log(JSON.stringify({pages:pages.length,inputs:assets.size,drawioBytes:(await fs.stat(path.join(dir,'refined.drawio'))).size}));
