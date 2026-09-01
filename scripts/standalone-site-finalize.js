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
  return html;
}

let html = fs.readFileSync('index.html', 'utf8');
html = setSeoUrl(html);
html = setNhaTrangLinks(html);
fs.writeFileSync('index.html', html);

if (fs.existsSync('nhatrang.html')) fs.unlinkSync('nhatrang.html');

fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${HCMC}sitemap.xml\n`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${HCMC}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>\n</urlset>\n`);

const checks = [
  ['TAS YouTube', '7afnKW9_fvA'],
  ['Early bird', '9월 1일 ~ 10월 31일까지'],
  ['Grade 3 notice', 'TAS Grade 3 마감'],
  ['Kakao contact', 'https://open.kakao.com/o/slehLvKi'],
  ['Phone contact', '010-5150-0105'],
  ['Nha Trang cross-link', NT_TARGET]
];
for (const [label, token] of checks) {
  if (!html.includes(token)) throw new Error(`Standalone HCMC check failed: ${label}`);
}
const faq = html.match(/<section id="faq"[\s\S]*?<\/section>/i);
const faqCount = faq ? (faq[0].match(/<details>/g) || []).length : 0;
if (faqCount !== 20) throw new Error(`Standalone HCMC FAQ count is ${faqCount}, expected 20`);
if (fs.existsSync('nhatrang.html')) throw new Error('nhatrang.html must not exist in standalone HCMC output');

console.log(`Standalone HCMC finalized; Nha Trang link -> ${NT_TARGET}; FAQ=${faqCount}`);
