const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');
const originalLength = html.length;

const HOME = 'https://tnsuhak.com/';
const KAKAO = 'https://open.kakao.com/o/slehLvKi';
const CAFE = 'https://cafe.naver.com/tnsuhak.cafe';
const PHONE_HREF = 'tel:01051500105';
const PHONE_DISPLAY = '010-5150-0105';
const EMAIL = 'tns@tnsuhak.com';

function esc(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceFooterAnchor(label, href, text, attrs = '') {
  const pattern = new RegExp(`<a\\b[^>]*>\\s*${esc(label)}\\s*<\\/a>`, 'gi');
  if (pattern.test(html)) {
    pattern.lastIndex = 0;
    html = html.replace(pattern, `<a href="${href}"${attrs}>${text}</a>`);
  } else {
    html = html.split(label).join(text);
  }
}

function replaceFooterBlock(label, replacement) {
  const pattern = new RegExp(`<a\\b[^>]*>\\s*${esc(label)}\\s*<\\/a>`, 'gi');
  if (pattern.test(html)) {
    pattern.lastIndex = 0;
    html = html.replace(pattern, replacement);
  } else {
    html = html.split(label).join(replacement);
  }
}

// Remove only a previously injected standalone company footer/style, if present.
html = html.replace(/<footer\b[^>]*class=(["'])[^"']*tns-company-footer[^"']*\1[^>]*>[\s\S]*?<\/footer>\s*/gi, '');
html = html.replace(/<style\b[^>]*id=(["'])tns-company-footer-styles\1[^>]*>[\s\S]*?<\/style>\s*/gi, '');

// Fill the existing lower footer instead of adding another business-information block.
replaceFooterAnchor('[한국 공식 상담/등록처 회사명]', HOME, 'TNS유학 · ㈜티앤에스월드와이드', ' target="_blank" rel="noopener"');
replaceFooterAnchor('[상담전화]', PHONE_HREF, PHONE_DISPLAY);
replaceFooterAnchor('[카카오톡 상담 링크]', KAKAO, '카카오톡 상담', ' target="_blank" rel="noopener"');
replaceFooterAnchor('[네이버 카페/블로그 링크]', CAFE, 'TNS 네이버 카페', ' target="_blank" rel="noopener"');

const businessDetails = `<span class="tns-footer-business-detail"><span>대표 신윤옥 · 사업자등록번호 220-87-54964</span><span><b>서울본사</b> 서울시 강남구 테헤란로 5길 7 KG타워 B1 (06134) · 02-3288-1733~1735</span><span><b>부산지사</b> 부산 부산진구 중앙대로 694 쥬디스태화 9층 37호 (47295) · 010-9501-8180</span><span>해외지사 · Toronto · Vancouver · Calgary · Vietnam-Ho Chi Minh</span></span>`;
replaceFooterBlock('[사업자정보]', businessDetails);

if (!html.includes('id="tns-footer-business-detail-styles"')) {
  const footerStyles = `<style id="tns-footer-business-detail-styles">.tns-footer-business-detail{display:block;line-height:1.72}.tns-footer-business-detail>span{display:block;margin:.18em 0}.tns-footer-business-detail b{color:inherit}</style>`;
  if (!html.includes('</head>')) throw new Error('Missing </head> while adding footer business styles');
  html = html.replace('</head>', footerStyles + '\n</head>');
}

for (const expected of ['TNS유학','㈜티앤에스월드와이드','220-87-54964','tns-contact-info',EMAIL,KAKAO,CAFE]) {
  if (!html.includes(expected)) throw new Error('TNS company information is missing: ' + expected);
}
if (html.length < originalLength * 0.92) throw new Error('Footer patch removed too much page content; aborting build');

fs.writeFileSync(FILE, html);
console.log('Filled lower-footer placeholders with TNS company, contact and business details where present.');
