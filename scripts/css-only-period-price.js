const fs = require('fs');

let html = fs.readFileSync('index.html','utf8');

function replaceBalancedDivByAttribute(source, attrText, replacement){
  const start = source.indexOf(attrText);
  if(start < 0) throw new Error('Target not found: '+attrText);
  const divStart = source.lastIndexOf('<div', start);
  if(divStart < 0) throw new Error('Opening div not found for '+attrText);
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = divStart;
  let depth = 0, m;
  while((m = re.exec(source))){
    if(m[0].startsWith('</')) depth--;
    else depth++;
    if(depth === 0){
      return source.slice(0,divStart)+replacement+source.slice(re.lastIndex);
    }
  }
  throw new Error('Unbalanced div for '+attrText);
}

function replaceSchedule(source,key,dates){
  const groupRe = new RegExp('<div class="chips" data-sched="'+key+'"[\\s\\S]*?<\\/div>\\s*<div class="dates" id="dates-'+key+'"><\\/div>');
  if(!groupRe.test(source)) throw new Error('Schedule block not found: '+key);
  const id = 'tns-'+key+'-sched';
  const panels = [2,3,4].map(w=>`<div class="tns-css-sched__panel tns-css-sched__panel--${w}">${dates[w].map(d=>`<div class="date"><b>${d}</b><span>${w} WEEKS</span></div>`).join('')}</div>`).join('');
  const block = `<div class="tns-css-sched" aria-label="기간 선택">
    <input type="radio" name="${id}" id="${id}-2"><input type="radio" name="${id}" id="${id}-3"><input type="radio" name="${id}" id="${id}-4" checked>
    <div class="chips tns-css-sched__chips"><label class="chip" for="${id}-2">2주</label><label class="chip" for="${id}-3">3주</label><label class="chip" for="${id}-4">4주</label></div>
    <div class="dates tns-css-sched__panels">${panels}</div>
  </div>`;
  return source.replace(groupRe,block);
}

const hcmFamilies = [
  ['보호자 1 + 자녀 1',[['1 Bedroom Deluxe','약 46㎡ · King',{2:3900,3:5750,4:7150}]]],
  ['보호자 1 + 자녀 2',[['2 Bedroom Executive','약 85㎡ · 1 King + 1 Single',{2:6575,3:9600,4:12175}]]],
  ['보호자 2 + 자녀 1',[['2 Bedroom Executive','약 85㎡ · 1 King + 1 Single',{2:4355,3:6450,4:8095}]]],
  ['보호자 1 + 자녀 3',[['3 Bedroom','약 136㎡',{2:9250,3:13450,4:17200}]]],
  ['보호자 2 + 자녀 2',[['3 Bedroom','약 136㎡',{2:7030,3:10300,4:13120}]]]
];

function pricePanel(families,weeks){
  return `<div class="tns-css-price__panel tns-css-price__panel--${weeks}">${families.map(([label,rooms])=>`<div class="tns-css-family"><h4>${label}</h4>${rooms.map(([room,sub,prices])=>`<div class="room"><span class="room__name">${room}<small>${sub}</small></span><span class="room__won">$${Number(prices[weeks]).toLocaleString()}<sub>USD / ${weeks}주</sub></span></div>`).join('')}</div>`).join('')}</div>`;
}

function priceBlock(key,families){
  const id='tns-'+key+'-price';
  return `<div class="price tns-css-price" aria-label="기간별 참가비">
    <input type="radio" name="${id}" id="${id}-2"><input type="radio" name="${id}" id="${id}-3"><input type="radio" name="${id}" id="${id}-4" checked>
    <div class="price__step"><b>Step 1 · 기간</b><div class="chips tns-css-price__chips"><label class="chip" for="${id}-2">2주</label><label class="chip" for="${id}-3">3주</label><label class="chip" for="${id}-4">4주</label></div></div>
    <div class="price__step" style="margin-bottom:0"><b>Step 2 · 가족 구성별 객실 & 참가비</b><div class="price__out tns-css-price__panels">${pricePanel(families,2)}${pricePanel(families,3)}${pricePanel(families,4)}</div></div>
  </div>`;
}

html = replaceSchedule(html,'hcm',{
  2:['2027.01.03 ~ 01.16','2027.01.10 ~ 01.23','2027.01.17 ~ 01.30','2027.02.14 ~ 02.27'],
  3:['2027.01.03 ~ 01.23','2027.01.10 ~ 01.30'],
  4:['2027.01.03 ~ 01.30']
});
html = replaceBalancedDivByAttribute(html,'data-price="hcm"',priceBlock('hcm',hcmFamilies));

const css = `<style id="tns-css-only-period-price">
.tns-css-sched>input,.tns-css-price>input{position:absolute!important;opacity:0!important;width:1px!important;height:1px!important;pointer-events:none!important}
.tns-css-sched__chips label,.tns-css-price__chips label{cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation;display:inline-flex;align-items:center;justify-content:center}
.tns-css-sched__panel,.tns-css-price__panel{display:none}
#tns-hcm-sched-2:checked~.tns-css-sched__chips label[for="tns-hcm-sched-2"],#tns-hcm-sched-3:checked~.tns-css-sched__chips label[for="tns-hcm-sched-3"],#tns-hcm-sched-4:checked~.tns-css-sched__chips label[for="tns-hcm-sched-4"],#tns-hcm-price-2:checked~.price__step .tns-css-price__chips label[for="tns-hcm-price-2"],#tns-hcm-price-3:checked~.price__step .tns-css-price__chips label[for="tns-hcm-price-3"],#tns-hcm-price-4:checked~.price__step .tns-css-price__chips label[for="tns-hcm-price-4"]{background:var(--accent);color:#fff;border-color:var(--accent)}
#tns-hcm-sched-2:checked~.tns-css-sched__panels .tns-css-sched__panel--2,#tns-hcm-sched-3:checked~.tns-css-sched__panels .tns-css-sched__panel--3,#tns-hcm-sched-4:checked~.tns-css-sched__panels .tns-css-sched__panel--4,#tns-hcm-price-2:checked~.price__step .tns-css-price__panels .tns-css-price__panel--2,#tns-hcm-price-3:checked~.price__step .tns-css-price__panels .tns-css-price__panel--3,#tns-hcm-price-4:checked~.price__step .tns-css-price__panels .tns-css-price__panel--4{display:block}
.tns-css-family{padding:14px 0;border-bottom:1px solid var(--line)}.tns-css-family:last-child{border-bottom:0}.tns-css-family h4{font-family:var(--font-body);font-size:14px;margin:0 0 8px;color:var(--ink-2)}
@media(max-width:640px){.tns-css-price__chips,.tns-css-sched__chips{display:grid;grid-template-columns:repeat(3,1fr)}.tns-css-price__chips label,.tns-css-sched__chips label{min-height:46px}.tns-css-family .room{grid-template-columns:1fr;gap:6px}.tns-css-family .room__won{text-align:left}}
</style>`;
if(!html.includes('</head>')) throw new Error('Missing head');
html=html.replace('</head>',css+'\n</head>');

fs.writeFileSync('index.html',html);
console.log('Replaced HCMC schedule and price selectors with CSS-only controls.');
