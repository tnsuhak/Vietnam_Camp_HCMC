const fs=require('fs');

const STYLE=`<style id="earlybird-2027-styles">
.earlybird-2027{padding:42px 0;background:#fff7cc;border-top:1px solid #eadf9a;border-bottom:1px solid #eadf9a}
.earlybird-2027__box{background:#fffdf0;border:1px solid #eadf9a;border-radius:20px;padding:24px;box-shadow:0 10px 30px rgba(11,34,57,.08)}
.earlybird-2027__top{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.earlybird-2027__label{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#5f8f39}
.earlybird-2027 h2{margin:4px 0 0;font-size:clamp(24px,5vw,36px)}
.earlybird-2027__period{font-weight:800;color:#5f8f39}
.earlybird-2027__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px}
.earlybird-2027__item{background:#fff;border:1px solid #ece5bd;border-radius:14px;padding:16px 17px}
.earlybird-2027__item b{display:block;font-size:18px;margin-bottom:4px}
.earlybird-2027__item span{font-size:14px;color:var(--muted)}
.earlybird-2027__example{margin:14px 0 0;font-size:13px;color:var(--muted)}
.earlybird-2027__alert{margin-top:18px;background:#fff;border:1px solid #e6a3a3;border-left:4px solid #b63535;border-radius:12px;padding:14px 16px}
.earlybird-2027__alert b{color:#a12626}
@media(max-width:640px){.earlybird-2027{padding:32px 0}.earlybird-2027__grid{grid-template-columns:1fr}.earlybird-2027__box{padding:20px}}
</style>`;

function block(city){
  const grade3=city==='호치민'?`<div class="earlybird-2027__alert"><b>TAS Grade 3 마감</b><br><span>Grade 3 직접 등록은 마감되었습니다. 학년 업·다운으로 등록 가능하며, 상담 시 배정 학년을 확인해 주세요.</span></div>`:'';
  return `<section id="earlybird-2027" class="earlybird-2027" aria-labelledby="earlybird-title-${city==='호치민'?'hcmc':'nt'}"><div class="wrap"><div class="earlybird-2027__box"><div class="earlybird-2027__top"><div><div class="earlybird-2027__label">EDUWING EARLY BIRD</div><h2 id="earlybird-title-${city==='호치민'?'hcmc':'nt'}">2027 겨울캠프 얼리버드</h2></div><div class="earlybird-2027__period">9월 1일 ~ 10월 31일까지</div></div><div class="earlybird-2027__grid"><div class="earlybird-2027__item"><b>한 가족당 US$100 할인</b><span>얼리버드 기간 내 등록 가족 기준</span></div><div class="earlybird-2027__item"><b>형제·자매 각 US$50 추가 할인</b><span>형제·자매 동반 등록 시 추가 적용</span></div></div><p class="earlybird-2027__example">예: 자녀 2명 가족 — 가족 US$100 + 형제 할인 각 US$50 = 총 US$200 할인</p>${grade3}</div></div></section>`;
}

function patch(html,city){
  html=html.replace(/<section id="earlybird-2027"[\s\S]*?<\/section>/,'');
  html=html.replace(/선착순\s*10가족\s*(?:US)?\$?200\s*할인/g,'얼리버드 할인');
  if(!html.includes('id="earlybird-2027-styles"')) html=html.replace('</head>',STYLE+'\n</head>');
  const marker='<!-- ============ PRICE ============ -->';
  if(!html.includes(marker)) throw new Error('PRICE marker not found for '+city);
  html=html.replace(marker,block(city)+'\n'+marker);
  if(!html.includes('9월 1일 ~ 10월 31일까지')) throw new Error('Early bird block missing for '+city);
  if(city==='호치민'&&!html.includes('TAS Grade 3 마감')) throw new Error('Grade 3 alert missing');
  return html;
}

let h=fs.readFileSync('index.html','utf8');
h=patch(h,'호치민');
fs.writeFileSync('index.html',h);
if(fs.existsSync('nhatrang.html')){
  let n=fs.readFileSync('nhatrang.html','utf8');
  n=patch(n,'나트랑');
  fs.writeFileSync('nhatrang.html',n);
}
console.log('Applied 2027 winter early-bird update and HCMC Grade 3 closure notice.');
