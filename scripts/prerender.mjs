import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {render,getMeta,renderHead,publicPaths} from '../.ssr/entry-server.js';
const template=await readFile('dist/index.html','utf8');
for(const path of [...publicPaths(),'/ar/404','/en/404']){const m=getMeta(path),html=await render(path);const output=template.replace('<html lang="ar" dir="rtl">',`<html lang="${m.lang}" dir="${m.dir}">`).replace('<!--head-->',renderHead(m)).replace('<!--app-->',html);await mkdir(`dist${path}`,{recursive:true});await writeFile(`dist${path}/index.html`,output);}
const origin=getMeta('/ar').url.replace(/\/ar$/,'');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${publicPaths().map(p=>{const m=getMeta(p);return `<url><loc>${m.url}</loc><xhtml:link rel="alternate" hreflang="ar" href="${m.ar}"/><xhtml:link rel="alternate" hreflang="en" href="${m.en}"/></url>`;}).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('dist/404.html',await readFile('dist/ar/404/index.html','utf8'));
console.log(`Prerendered ${publicPaths().length} public routes + two localized 404 pages.`);
