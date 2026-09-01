const fs = require('fs');

const HCMC = 'https://vietnam-camp-hcmc.netlify.app/';
const NT_PROD = 'https://vietnam-camp-nt.netlify.app/';
const NT_PREVIEW = 'https://deploy-preview-1--vietnam-camp-nt.netlify.app/';
const NT_TARGET = process.env.CONTEXT === 'deploy-preview' ? NT_PREVIEW : NT_PROD;

function setSeoUrl(html) {
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${HCMC}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${HCMC}">`);
  return html;
}

function setNhaTrangLinks(html) {
  const candidates = [
    'nhatrang.html', './nhatrang.html', '/nhatrang.html',
    'https://vietnam-camp-hcmc.netlify.app/nhatrang.html',
    'https://deploy-preview-1--vietnam-camp-hcmc.netlify.app/nhatrang.html',
    'https://tnsuhak.github.io/Vietnam_Camp_NT/',
    'https://vietnam-camp-nt.netlify.app/',
    'https://deploy-preview-1--vietnam-camp-nt.netlify.app/'
  ];
  for (const value of candidates) {
    html = html.split(`href="${value}"`).join(`href="${NT_TARGET}"`);
    html = html.split(`href='${value}'`).join(`href='${NT_TARGET}'`);
  }
  html = html.replace(/(<a\b[^>]*href=)(["'])[^"']*\2([^>]*>[\s\S]{0,180}?나트랑\s*캠프도\s*보기[\s\S]{0,80}?<\/a>)/i, `$1"${NT_TARGET}"$3`);
  return html;
}

let html = fs.readFileSync('index.html', 'utf8');
html = setSeoUrl(html);
html = setNhaTrangLinks(html);
fs.writeFileSync('index.html', html);

if (fs.existsSync('nhatrang.html')) fs.unlinkSync('nhatrang.html');

fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${HCMC}sitemap.xml\n`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${HCMC}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>\n</urlset>\n`);

console.log(`Standalone HCMC finalized; Nha Trang target: ${NT_TARGET}`);
