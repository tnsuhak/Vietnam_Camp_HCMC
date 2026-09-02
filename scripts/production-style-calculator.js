const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function replaceBalancedDivByAttribute(source, attrText, replacement){
  const start = source.indexOf(attrText);
  if(start < 0) throw new Error('Target not found: '+attrText);
  const divStart = source.lastIndexOf('<div', start);
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = divStart;
  let depth=0,m;
  while((m=re.exec(source))){
    depth += m[0].startsWith('</') ? -1 : 1;
    if(depth===0) return source.slice(0,divStart)+replacement+source.slice(re.lastIndex);
  }
  throw new Error('Unbalanced div: '+attrText);
}

const key='hcm';
const schedules={
  2:['2027.01.03 ~ 01.16','2027.01.10 ~ 01.23','2027.01.17 ~ 01.30','2027.02.14 ~ 02.27'],
  3:['2027.01.03 ~ 01.23','2027.01.10 ~ 01.30'],
  4:['2027.01.03 ~ 01.30']
};
const families=[
  {id:'p1c1',label:'보호자 1 + 자녀 1',rooms:[{room:'1 Bedroom Deluxe',sub:'약 46㎡ · King',price:{2:3900,3:5750,4:7150}}]},
  {id:'p1c2',label:'보호자 1 + 자녀 2',rooms:[{room:'2 Bedroom Executive',sub:'약 85㎡ · 1 King + 1 Single',price:{2:6575,3:9600,4:12175}}]},
  {id:'p2c1',label:'보호자 2 + 자녀 1',rooms:[{room:'2 Bedroom Executive',sub:'약 85㎡ · 1 King + 1 Single',price:{2:4355,3:6450,4:8095}}]},
  {id:'p1c3',label:'보호자 1 + 자녀 3',rooms:[{room:'3 Bedroom',sub:'약 136㎡',price:{2:9250,3:13450,4:17200}}]},
  {id:'p2c2',label:'보호자 2 + 자녀 2',rooms:[{room:'3 Bedroom',sub:'약 136㎡',price:{2:7030,3:10300,4:13120}}]}
];

function dateHtml(w){return schedules[w].map(d=>`<div class="date"><b>${d}</b><span>${w} WEEKS</span></div>`).join('');}
function familyButtons(active='p1c1'){return families.map(f=>`<button type="button" class="chip" data-fam="${f.id}" aria-pressed="${f.id===active}" onclick="return tnsCalcFamily('${key}','${f.id}',this)">${f.label}</button>`).join('');}
function roomHtml(famId='p1c1',w=4){const f=families.find(x=>x.id===famId)||families[0];return f.rooms.map(r=>`<div class="room"><span class="room__name">${r.room}<small>${r.sub}</small></span><span class="room__won">$${r.price[w].toLocaleString()}<sub>USD / ${w}주</sub></span></div>`).join('')+`<p class="note" style="margin:6px 0 0">${f.label} · ${w}주 기준</p>`;}

const schedRe=new RegExp('<div class="chips" data-sched="'+key+'"[\\s\\S]*?<\\/div>\\s*<div class="dates" id="dates-'+key+'"><\\/div>');
if(!schedRe.test(html)) throw new Error('Schedule block missing');
html=html.replace(schedRe,`<div class="chips" data-sched="${key}" role="group" aria-label="기간 선택"><button type="button" class="chip" data-weeks="2" aria-pressed="false" onclick="return tnsCalcWeeks('${key}',2,this)">2주</button><button type="button" class="chip" data-weeks="3" aria-pressed="false" onclick="return tnsCalcWeeks('${key}',3,this)">3주</button><button type="button" class="chip" data-weeks="4" aria-pressed="true" onclick="return tnsCalcWeeks('${key}',4,this)">4주</button></div><div class="dates" id="dates-${key}">${dateHtml(4)}</div>`);

const priceBlock=`<div class="price" data-price="${key}" data-current-weeks="4" data-current-family="p1c1">
  <div class="price__step"><b>Step 1 · 기간</b><div class="chips" data-role="weeks"><button type="button" class="chip" data-v="2" aria-pressed="false" onclick="return tnsCalcPriceWeeks('${key}',2,this)">2주</button><button type="button" class="chip" data-v="3" aria-pressed="false" onclick="return tnsCalcPriceWeeks('${key}',3,this)">3주</button><button type="button" class="chip" data-v="4" aria-pressed="true" onclick="return tnsCalcPriceWeeks('${key}',4,this)">4주</button></div></div>
  <div class="price__step"><b>Step 2 · 가족 구성</b><div class="chips" data-role="family">${familyButtons()}</div></div>
  <div class="price__step" style="margin-bottom:0"><b>Step 3 · 객실 &amp; 참가비</b><div class="price__out" data-role="out">${roomHtml()}</div></div>
</div>`;
html=replaceBalancedDivByAttribute(html,'data-price="hcm"',priceBlock);

html=html.replace(/\s*<script src="\/ui-fix-runtime\.js"><\/script>\s*/g,'\n').replace(/\s*<script id="tns-mobile-price-runtime">[\s\S]*?<\/script>\s*/g,'\n');

const runtime=`<script id="tns-production-style-calculator">
(function(){
var DATA={hcm:{schedules:${JSON.stringify(schedules)},families:${JSON.stringify(families)}}};
function q(s,r){return (r||document).querySelector(s)} function qa(s,r){return (r||document).querySelectorAll(s)}
function pressed(group,el){qa('.chip',group).forEach(function(b){b.setAttribute('aria-pressed',b===el?'true':'false')})}
function fam(data,id){for(var i=0;i<data.families.length;i++)if(data.families[i].id===id)return data.families[i];return data.families[0]}
function render(key){var root=q('[data-price="'+key+'"]'),data=DATA[key];if(!root)return;var w=Number(root.dataset.currentWeeks||4),f=fam(data,root.dataset.currentFamily);var out=q('[data-role="out"]',root),s='';for(var i=0;i<f.rooms.length;i++){var r=f.rooms[i];s+='<div class="room"><span class="room__name">'+r.room+'<small>'+r.sub+'</small></span><span class="room__won">$'+Number(r.price[w]).toLocaleString('en-US')+'<sub>USD / '+w+'주</sub></span></div>'}out.innerHTML=s+'<p class="note" style="margin:6px 0 0">'+f.label+' · '+w+'주 기준</p>'}
window.tnsCalcWeeks=function(key,w,el){var data=DATA[key],g=q('[data-sched="'+key+'"]');if(g)pressed(g,el);var box=q('#dates-'+key);if(box)box.innerHTML=data.schedules[w].map(function(d){return '<div class="date"><b>'+d+'</b><span>'+w+' WEEKS</span></div>'}).join('');var root=q('[data-price="'+key+'"]');if(root){root.dataset.currentWeeks=String(w);var wg=q('[data-role="weeks"]',root);if(wg){var b=q('.chip[data-v="'+w+'"]',wg);if(b)pressed(wg,b)}render(key)}return false};
window.tnsCalcPriceWeeks=function(key,w,el){var root=q('[data-price="'+key+'"]');if(!root)return false;root.dataset.currentWeeks=String(w);pressed(el.parentElement,el);render(key);var sg=q('[data-sched="'+key+'"]');if(sg){var sb=q('.chip[data-weeks="'+w+'"]',sg);if(sb)pressed(sg,sb)}var box=q('#dates-'+key),data=DATA[key];if(box)box.innerHTML=data.schedules[w].map(function(d){return '<div class="date"><b>'+d+'</b><span>'+w+' WEEKS</span></div>'}).join('');return false};
window.tnsCalcFamily=function(key,id,el){var root=q('[data-price="'+key+'"]');if(!root)return false;root.dataset.currentFamily=id;pressed(el.parentElement,el);render(key);return false};
})();
</script>`;
if(!html.includes('</body>')) throw new Error('Missing body');
html=html.replace('</body>',runtime+'\n</body>');
fs.writeFileSync('index.html',html);
console.log('Applied production-style HCMC calculator with direct mobile-safe controls.');
