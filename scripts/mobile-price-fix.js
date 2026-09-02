const fs = require('fs');
const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

// Remove the previous external fallback so mobile browsers cannot keep using a cached copy.
html = html.replace(/\s*<script src="\/ui-fix-runtime\.js"><\/script>\s*/g, '\n');
html = html.replace(/\s*<script id="tns-mobile-price-runtime">[\s\S]*?<\/script>\s*/g, '\n');

const runtime = String.raw`<script id="tns-mobile-price-runtime">
(function(){
  'use strict';
  var DB = {
    hcm: {
      currency:'USD',
      schedules:{
        '2':['2027.01.03 ~ 01.16','2027.01.10 ~ 01.23','2027.01.17 ~ 01.30','2027.02.14 ~ 02.27'],
        '3':['2027.01.03 ~ 01.23','2027.01.10 ~ 01.30'],
        '4':['2027.01.03 ~ 01.30']
      },
      families:[
        {id:'p1c1',label:'보호자 1 + 자녀 1',rooms:[{room:'1 Bedroom Deluxe',sub:'약 46㎡ · King',price:{'2':3900,'3':5750,'4':7150}}]},
        {id:'p1c2',label:'보호자 1 + 자녀 2',rooms:[{room:'2 Bedroom Executive',sub:'약 85㎡ · 1 King + 1 Single',price:{'2':6575,'3':9600,'4':12175}}]},
        {id:'p2c1',label:'보호자 2 + 자녀 1',rooms:[{room:'2 Bedroom Executive',sub:'약 85㎡ · 1 King + 1 Single',price:{'2':4355,'3':6450,'4':8095}}]},
        {id:'p1c3',label:'보호자 1 + 자녀 3',rooms:[{room:'3 Bedroom',sub:'약 136㎡',price:{'2':9250,'3':13450,'4':17200}}]},
        {id:'p2c2',label:'보호자 2 + 자녀 2',rooms:[{room:'3 Bedroom',sub:'약 136㎡',price:{'2':7030,'3':10300,'4':13120}}]}
      ]
    },
    nt: {
      currency:'USD',
      schedules:{
        '2':['2027.01.03 ~ 01.16','2027.01.10 ~ 01.23','2027.01.17 ~ 01.30'],
        '3':['2027.01.03 ~ 01.23','2027.01.10 ~ 01.30'],
        '4':['2027.01.03 ~ 01.30']
      },
      families:[
        {id:'p1c1',label:'보호자 1 + 자녀 1',rooms:[{room:'Deluxe Twin',sub:'기본 제공 객실',price:{'2':2900,'3':4150,'4':5400}}]},
        {id:'p1c2',label:'보호자 1 + 자녀 2',rooms:[
          {room:'Deluxe (엑스트라 베드 없음)',sub:'개별 상담 필요',consult:true,ref:{'2':4755,'3':6800,'4':8845}},
          {room:'Deluxe + Extra bed',sub:'개별 상담 필요',consult:true,ref:{'2':5015,'3':7200,'4':9385}},
          {room:'Suite / Family Room',sub:'개별 상담 필요',consult:true,ref:{'2':6029,'3':8760,'4':11491}}
        ]},
        {id:'p2c1',label:'보호자 2 + 자녀 1',rooms:[{room:'Deluxe + Extra bed',sub:'개별 상담 필요',consult:true,ref:{'2':3615,'3':5250,'4':6885}}]},
        {id:'p1c3',label:'보호자 1 + 자녀 3',rooms:[{room:'Deluxe 2 rooms',sub:'개별 상담 필요',consult:true,ref:{'2':7655,'3':10950,'4':14245}}]},
        {id:'p2c2',label:'보호자 2 + 자녀 2',rooms:[{room:'Deluxe 2 rooms / 2 Bedroom Suite',sub:'개별 상담 필요',consult:true,ref:{'2':5800,'3':8300,'4':10800}}]}
      ]
    }
  };

  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return (root || document).querySelectorAll(sel); }
  function pressed(group, selected){
    var buttons = qa('.chip', group);
    for (var i=0;i<buttons.length;i++) buttons[i].setAttribute('aria-pressed', buttons[i] === selected ? 'true' : 'false');
  }
  function money(n){ return Number(n).toLocaleString('en-US'); }
  function findFamily(data,id){
    for(var i=0;i<data.families.length;i++) if(data.families[i].id===id) return data.families[i];
    return data.families[0];
  }
  function closestButton(target){
    var el = target;
    while(el && el !== document){
      if(el.tagName === 'BUTTON' && el.classList && el.classList.contains('chip')) return el;
      el = el.parentElement;
    }
    return null;
  }
  function renderDates(key,weeks){
    var data=DB[key], box=q('#dates-'+key);
    if(!data || !box) return;
    var rows=data.schedules[weeks]||[];
    var out='';
    for(var i=0;i<rows.length;i++) out += '<div class="date"><b>'+rows[i]+'</b><span>'+weeks+' WEEKS</span></div>';
    box.innerHTML=out;
    var sched=q('[data-sched="'+key+'"]');
    if(sched){
      var bs=qa('.chip[data-weeks]',sched);
      for(var j=0;j<bs.length;j++) bs[j].setAttribute('aria-pressed',bs[j].getAttribute('data-weeks')===weeks?'true':'false');
    }
  }
  function setup(root){
    var key=root.getAttribute('data-price'), data=DB[key];
    if(!data) return;
    var weeksBox=q('[data-role="weeks"]',root), famBox=q('[data-role="family"]',root), out=q('[data-role="out"]',root);
    if(!weeksBox || !famBox || !out) return;
    var state={weeks:'4',family:data.families[0].id};

    function renderFamilyButtons(){
      var s='';
      for(var i=0;i<data.families.length;i++){
        var f=data.families[i];
        s += '<button type="button" class="chip" data-v="'+f.id+'" aria-pressed="'+(f.id===state.family?'true':'false')+'">'+f.label+'</button>';
      }
      famBox.innerHTML=s;
    }
    function renderPrice(){
      var fam=findFamily(data,state.family), s=''; state.family=fam.id;
      for(var i=0;i<fam.rooms.length;i++){
        var r=fam.rooms[i];
        s += '<div class="room"><span class="room__name">'+r.room+'<small>'+(r.sub||'')+'</small></span>';
        if(r.consult || !r.price || r.price[state.weeks]==null){
          var ref=r.ref && r.ref[state.weeks]!=null ? '참고가 $'+money(r.ref[state.weeks])+' · 확정 전' : '개별 상담';
          s += '<span class="room__won">상담 필요<sub>'+ref+' / '+state.weeks+'주</sub></span>';
        }else{
          s += '<span class="room__won">$'+money(r.price[state.weeks])+'<sub>'+data.currency+' / '+state.weeks+'주</sub></span>';
        }
        s += '</div>';
      }
      s += '<p class="note" style="margin:6px 0 0">'+fam.label+' · '+state.weeks+'주 기준'+(fam.rooms.length>1?' · 객실 타입에 따라 참가비가 달라집니다':'')+'</p>';
      out.innerHTML=s;
    }
    function selectWeeks(weeks,btn){
      state.weeks=weeks;
      if(btn) pressed(weeksBox,btn); else {
        var bs=qa('.chip[data-v]',weeksBox); for(var i=0;i<bs.length;i++) bs[i].setAttribute('aria-pressed',bs[i].getAttribute('data-v')===weeks?'true':'false');
      }
      renderPrice(); renderDates(key,weeks);
    }
    function selectFamily(id,btn){ state.family=id; if(btn) pressed(famBox,btn); renderPrice(); }

    renderFamilyButtons(); renderPrice(); renderDates(key,'4');
    root.__tnsSelectWeeks=selectWeeks;
    root.__tnsSelectFamily=selectFamily;
    root.setAttribute('data-mobile-price-ready','true');
  }

  function handle(e){
    var btn=closestButton(e.target); if(!btn) return;
    var price=btn.closest ? btn.closest('[data-price]') : null;
    var sched=btn.closest ? btn.closest('[data-sched]') : null;
    if(price){
      var weeksBox=btn.parentElement && btn.parentElement.getAttribute('data-role')==='weeks';
      var famBox=btn.parentElement && btn.parentElement.getAttribute('data-role')==='family';
      if(weeksBox && price.__tnsSelectWeeks){ e.preventDefault(); e.stopImmediatePropagation(); price.__tnsSelectWeeks(btn.getAttribute('data-v'),btn); }
      else if(famBox && price.__tnsSelectFamily){ e.preventDefault(); e.stopImmediatePropagation(); price.__tnsSelectFamily(btn.getAttribute('data-v'),btn); }
      return;
    }
    if(sched && btn.getAttribute('data-weeks')){
      var key=sched.getAttribute('data-sched'), p=q('[data-price="'+key+'"]');
      e.preventDefault(); e.stopImmediatePropagation();
      renderDates(key,btn.getAttribute('data-weeks'));
      if(p && p.__tnsSelectWeeks) p.__tnsSelectWeeks(btn.getAttribute('data-weeks'));
    }
  }

  function boot(){
    var roots=qa('[data-price]'); for(var i=0;i<roots.length;i++) setup(roots[i]);
    document.addEventListener('pointerup',handle,true);
    document.addEventListener('click',handle,true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Missing </body> while injecting mobile price runtime');
html = html.replace('</body>', runtime + '\n</body>');
fs.writeFileSync(FILE, html);
console.log('Injected self-contained mobile-safe price calculator.');
