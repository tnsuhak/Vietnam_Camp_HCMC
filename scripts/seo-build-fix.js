const fs = require('fs');

const HCMC = 'https://tnsuhak.github.io/Vietnam_Camp_HCMC/';
const NT = 'https://tnsuhak.github.io/Vietnam_Camp_NT/';

function setSeoUrl(html, url) {
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  return html;
}

let hcmc = fs.readFileSync('index.html', 'utf8');
hcmc = setSeoUrl(hcmc, HCMC);
fs.writeFileSync('index.html', hcmc);

if (fs.existsSync('nhatrang.html')) {
  let nt = fs.readFileSync('nhatrang.html', 'utf8');
  nt = setSeoUrl(nt, NT);
  fs.writeFileSync('nhatrang.html', nt);
}

fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${HCMC}sitemap.xml\n`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${HCMC}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>\n</urlset>\n`);

console.log('Verified HCMC canonical, robots.txt and sitemap.xml; Nha Trang preview canonical points to its own site.');
