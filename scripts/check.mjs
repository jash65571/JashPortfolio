import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const base='/JashPortfolio/';
const issues=[];
async function walk(dir){const items=await readdir(dir,{withFileTypes:true});const out=[];for(const x of items){if(['.git','node_modules','qa','test-results'].includes(x.name))continue;const p=join(dir,x.name);if(x.isDirectory())out.push(...await walk(p));else out.push(p)}return out;}
const files=await walk(root);
const pages=files.filter(f=>f.endsWith('.html'));
for(const file of pages){
  const html=await readFile(file,'utf8');
  if((html.match(/<h1\b/g)||[]).length!==1)issues.push(`${file}: must contain one H1`);
  if(!html.includes('<html lang="en">'))issues.push(`${file}: missing document language`);
  if(!html.includes('rel="canonical"'))issues.push(`${file}: missing canonical`);
  if(!html.includes('name="description"'))issues.push(`${file}: missing description`);
  if(/lorem ipsum|coming soon|your name|your email|href="#"/i.test(html))issues.push(`${file}: placeholder content`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)issues.push(`${file}: duplicate IDs`);
  const refs=[...html.matchAll(/(?:href|src)="([^"]+)"/g),...html.matchAll(/property="og:image" content="([^"]+)"/g)].map(m=>m[1].replace('https://jash65571.github.io',''));
  for(const ref of refs){
    if(ref.startsWith('http')||ref.startsWith('mailto:'))continue;
    const [path,hash]=ref.split('#');
    if(path&&!path.startsWith(base)) {issues.push(`${file}: unexpected relative URL ${ref}`);continue;}
    let target=path?resolve(root,path.slice(base.length)):file;
    if(path.endsWith('/'))target=join(target,'index.html');
    try{const info=await stat(target);if(!info.isFile()||info.size===0)issues.push(`Empty asset: ${target}`);
      if(hash&&target.endsWith('.html')){const targetHtml=target===file?html:await readFile(target,'utf8');if(!targetHtml.includes(`id="${hash}"`))issues.push(`Missing anchor: ${ref} in ${file}`);}
    }catch{issues.push(`Missing target ${ref} in ${file}`);}
  }
}
const css=await readFile(join(root,'assets/site.css'),'utf8');
for(const [,path]of css.matchAll(/url\(['"]?\.\/([^)'"\s]+)['"]?\)/g)){try{await stat(join(root,'assets',path));}catch{issues.push(`Missing CSS asset ${path}`)}}
if(issues.length){console.error(issues.join('\n'));process.exit(1)}
console.log(`Verified ${pages.length} HTML pages: local links, anchors, assets, metadata, IDs, and placeholder checks passed.`);
