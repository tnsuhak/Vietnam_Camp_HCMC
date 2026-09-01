const fs = require('fs');

const FILE = 'index.html';

const styles = `
<style id="tns-company-footer-styles">
.tns-company-footer{background:#061728;color:rgba(255,255,255,.72);padding:38px 0 28px;border-top:1px solid rgba(255,255,255,.08);font-size:12.5px;line-height:1.75}
.tns-company-footer__top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:13px}
.tns-company-footer__brand{font-size:18px;font-weight:850;letter-spacing:-.02em;color:#fff}
.tns-company-footer__corp{font-size:12.5px;color:rgba(255,255,255,.52)}
.tns-company-footer__meta{display:flex;flex-wrap:wrap;gap:4px 18px;margin-bottom:11px}
.tns-company-footer__meta span,.tns-company-footer__meta a{color:rgba(255,255,255,.72);text-decoration:none}
.tns-company-footer__meta a:hover{color:#fff;text-decoration:underline}
.tns-company-footer__office{margin:3px 0;color:rgba(255,255,255,.62)}
.tns-company-footer__office b{color:rgba(255,255,255,.88);font-weight:750;margin-right:6px}
.tns-company-footer__overseas{margin:10px 0 0;color:rgba(255,255,255,.48)}
.tns-company-footer__copy{margin:18px 0 0;padding-top:14px;border-top:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.38);font-size:11.5px}
@media(max-width:640px){.tns-company-footer{padding:32px 0 24px}.tns-company-footer__meta{display:grid;gap:2px}.tns-company-footer__office{font-size:12px}.tns-company-footer__overseas{font-size:11.5px}}
</style>`;

const footer = `<footer class="tns-company-footer" aria-label="TNS유학 회사 정보">
  <div class="wrap">
    <div class="tns-company-footer__top">
      <strong class="tns-company-footer__brand">TNS유학</strong>
      <span class="tns-company-footer__corp">㈜티앤에스월드와이드</span>
    </div>
    <div class="tns-company-footer__meta">
      <span>대표 신윤옥</span>
      <span>사업자등록번호 220-87-54964</span>
      <a href="mailto:tns@tnsuhak.com">tns@tnsuhak.com</a>
    </div>
    <p class="tns-company-footer__office"><b>서울본사</b>서울시 강남구 테헤란로 5길 7 KG타워 B1 (06134) · 02-3288-1733~1735</p>
    <p class="tns-company-footer__office"><b>부산지사</b>부산 부산진구 중앙대로 694 쥬디스태화 9층 37호 (47295) · 010-9501-8180</p>
    <p class="tns-company-footer__overseas">해외지사 · Toronto · Vancouver · Calgary · Vietnam-Ho Chi Minh</p>
    <p class="tns-company-footer__copy">COPYRIGHT © TNSWorldWide Co., Ltd. All Rights Reserved.</p>
  </div>
</footer>`;

function removeRedundantInquiryLinks(html){
  html = html.replace(/<a\b[^>]*href=(["'])[^"']*#inquiry\1[^>]*>\s*\[?\s*(?:카카오톡 상담 링크|네이버 카페\/블로그 링크)\s*\]?\s*<\/a>/gi, '');
  html = html.replace(/<li\b[^>]*>\s*<\/li>/gi, '');
  html = html.replace(/<p\b[^>]*>\s*(?:[|·•-]\s*)*<\/p>/gi, '');
  return html;
}

let html = fs.readFileSync(FILE, 'utf8');
html = removeRedundantInquiryLinks(html);

if (!html.includes('id="tns-company-footer-styles"')) {
  if (!html.includes('</head>')) throw new Error('Missing </head> for TNS company footer styles');
  html = html.replace('</head>', styles + '\n</head>');
}

const existingFooter = /<footer\b[^>]*>[\s\S]*?<\/footer>/i;
if (existingFooter.test(html)) {
  html = html.replace(existingFooter, footer);
} else {
  if (!html.includes('</body>')) throw new Error('Missing </body> for TNS company footer');
  html = html.replace('</body>', footer + '\n</body>');
}

for (const expected of ['TNS유학','㈜티앤에스월드와이드','220-87-54964','tns@tnsuhak.com','02-3288-1733~1735']) {
  if (!html.includes(expected)) throw new Error('Missing TNS company footer output: ' + expected);
}
if (/카카오톡 상담 링크|네이버 카페\/블로그 링크/.test(html)) {
  throw new Error('Redundant inquiry link labels remain after footer patch');
}

fs.writeFileSync(FILE, html);
console.log('Replaced redundant bottom links with TNS company footer.');
