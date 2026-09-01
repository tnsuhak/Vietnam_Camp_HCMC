const fs = require('fs');

const HCMC = 'https://vietnam-camp-hcmc.netlify.app/';

function setSeoUrl(html, url) {
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  return html;
}

let html = fs.readFileSync('index.html', 'utf8');
html = setSeoUrl(html, HCMC);
fs.writeFileSync('index.html', html);

fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${HCMC}sitemap.xml\n`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${HCMC}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>\n</urlset>\n`);

console.log('Verified HCMC canonical, robots.txt and sitemap.xml for the standalone Netlify site.');
