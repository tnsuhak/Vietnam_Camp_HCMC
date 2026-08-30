const fs = require('fs');

const KAKAO = 'https://open.kakao.com/o/slehLvKi';
const PHONE_HREF = 'tel:01051500105';
const PHONE_DISPLAY = '010-5150-0105';
const CAFE = 'https://cafe.naver.com/tnsuhak.cafe';
const HOME = 'https://tnsuhak.com/';

const styles = `
<style id="tns-direct-contact-styles">
.tns-direct-contact{padding:76px 0;background:#0b2942;color:#fff;position:relative;overflow:hidden}
.tns-direct-contact:before{content:"";position:absolute;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,.04);right:-110px;top:-120px;pointer-events:none}
.tns-direct-contact__inner{position:relative;z-index:1}
.tns-direct-contact__kicker{margin:0 0 12px;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#9fdceb}
.tns-direct-contact h2{margin:0;font-family:var(--font-display,inherit);font-size:clamp(32px,5vw,58px);line-height:1.08;letter-spacing:-.035em;color:#fff}
.tns-direct-contact__lead{max-width:680px;margin:18px 0 30px;color:rgba(255,255,255,.74);font-size:16px;line-height:1.75}
.tns-direct-contact__primary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;max-width:900px}
.tns-direct-contact__card{min-width:0;min-height:92px;padding:20px 22px;border-radius:18px;display:flex;align-items:center;gap:15px;text-decoration:none;transition:transform .18s ease,border-color .18s ease,background .18s ease}
.tns-direct-contact__card:hover{transform:translateY(-2px)}
.tns-direct-contact__card--kakao{background:#fee500;color:#191919}
.tns-direct-contact__card--phone{background:#fff;color:#0b2942}
.tns-direct-contact__icon{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;flex:0 0 46px;font-size:21px;background:rgba(11,41,66,.09)}
.tns-direct-contact__text{min-width:0;display:flex;flex-direction:column;gap:3px}
.tns-direct-contact__text b{font-size:18px;line-height:1.25}
.tns-direct-contact__text small{font-size:13px;opacity:.68;line-height:1.35}
.tns-direct-contact__arrow{margin-left:auto;font-size:19px;font-weight:800}
.tns-direct-contact__secondary{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;max-width:900px}
.tns-direct-contact__secondary a{min-height:48px;padding:12px 16px;border:1px solid rgba(255,255,255,.22);border-radius:999px;display:inline-flex;align-items:center;gap:8px;color:#fff;text-decoration:none;font-size:14px;font-weight:750;background:rgba(255,255,255,.06)}
.tns-direct-contact__secondary a:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.38)}
@media(max-width:720px){.tns-direct-contact{padding:58px 0}.tns-direct-contact__primary{grid-template-columns:1fr}.tns-direct-contact__card{min-height:82px;padding:17px 18px}.tns-direct-contact__secondary{display:grid;grid-template-columns:1fr 1fr}.tns-direct-contact__secondary a{justify-content:center;padding:11px 10px;font-size:13px}}
@media(max-width:390px){.tns-direct-contact__secondary{grid-template-columns:1fr}}
</style>`;

function contactSection(city) {
  return `<section id="inquiry" class="tns-direct-contact" aria-labelledby="tns-contact-title-${city === '호치민' ? 'hcmc' : 'nt'}">
  <div class="wrap tns-direct-contact__inner">
    <p class="tns-direct-contact__kicker">TNS유학 상담 · 등록</p>
    <h2 id="tns-contact-title-${city === '호치민' ? 'hcmc' : 'nt'}">2027 ${city} 겨울캠프 상담</h2>
    <p class="tns-direct-contact__lead">일정·비용·학교 프로그램·숙소와 자녀 연령별 선택까지 궁금한 내용을 편한 방법으로 바로 상담하세요.</p>
    <div class="tns-direct-contact__primary">
      <a class="tns-direct-contact__card tns-direct-contact__card--kakao" href="${KAKAO}" target="_blank" rel="noopener">
        <span class="tns-direct-contact__icon" aria-hidden="true">💬</span>
        <span class="tns-direct-contact__text"><b>카카오톡 상담</b><small>오픈채팅으로 빠르게 질문하기</small></span>
        <span class="tns-direct-contact__arrow" aria-hidden="true">↗</span>
      </a>
      <a class="tns-direct-contact__card tns-direct-contact__card--phone" href="${PHONE_HREF}">
        <span class="tns-direct-contact__icon" aria-hidden="true">☎</span>
        <span class="tns-direct-contact__text"><b>전화 상담</b><small>${PHONE_DISPLAY}</small></span>
        <span class="tns-direct-contact__arrow" aria-hidden="true">→</span>
      </a>
    </div>
    <div class="tns-direct-contact__secondary" aria-label="TNS 바로가기">
      <a href="${CAFE}" target="_blank" rel="noopener">Naver <span>TNS 네이버 카페</span> ↗</a>
      <a href="${HOME}" target="_blank" rel="noopener">TNS <span>홈페이지</span> ↗</a>
    </div>
  </div>
</section>`;
}

function patch(html, city) {
  if (!html.includes('id="tns-direct-contact-styles"')) {
    if (!html.includes('</head>')) throw new Error('Missing </head> for contact styles: ' + city);
    html = html.replace('</head>', styles + '\n</head>');
  }
  const inquiry = /<section\b(?=[^>]*\bid=["']inquiry["'])[^>]*>[\s\S]*?<\/section>/i;
  if (!inquiry.test(html)) throw new Error('Could not find inquiry section to replace: ' + city);
  html = html.replace(inquiry, contactSection(city));
  for (const expected of [KAKAO, PHONE_HREF, CAFE, HOME, 'tns-direct-contact']) {
    if (!html.includes(expected)) throw new Error('Missing contact output for ' + city + ': ' + expected);
  }
  return html;
}

let hcmc = fs.readFileSync('index.html', 'utf8');
hcmc = patch(hcmc, '호치민');
fs.writeFileSync('index.html', hcmc);

if (!fs.existsSync('nhatrang.html')) throw new Error('Missing generated nhatrang.html');
let nt = fs.readFileSync('nhatrang.html', 'utf8');
nt = patch(nt, '나트랑');
fs.writeFileSync('nhatrang.html', nt);

console.log('Replaced non-working inquiry forms with direct TNS contact links on both camp pages.');
