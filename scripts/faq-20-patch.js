const fs=require('fs');

const STYLE=`<style id="faq20-styles">
.faq20{padding:64px 0;background:#fff}.faq20 .sec-head{max-width:760px}.faq20__list{display:grid;gap:10px;max-width:920px}.faq20 details{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(11,34,57,.04)}.faq20 summary{cursor:pointer;list-style:none;padding:17px 52px 17px 18px;font-weight:750;position:relative;line-height:1.5}.faq20 summary::-webkit-details-marker{display:none}.faq20 summary:after{content:'+';position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:22px;color:var(--sea)}.faq20 details[open] summary:after{content:'−'}.faq20__answer{padding:0 18px 18px;color:var(--ink-3);font-size:14.5px;line-height:1.75}.faq20__note{margin-top:16px;font-size:12.5px;color:var(--muted);max-width:900px}@media(max-width:640px){.faq20{padding:52px 0}.faq20 summary{padding:15px 46px 15px 15px}.faq20__answer{padding:0 15px 15px}}
</style>`;

const HCMC=[
['호치민 캠프는 일반 영어캠프와 무엇이 다른가요?','TAS(The American School) 재학생 학급에 참여해 실제 국제학교 생활을 경험하는 스쿨링형 프로그램입니다. 영어만 따로 배우는 어학캠프보다 정규 학교 수업과 생활 경험에 초점이 있습니다.'],
['프로그램은 몇 주 과정인가요?','2주·3주·4주 과정 중 선택하는 구조입니다. 정확한 입·퇴실일과 학교 참여 가능 기간은 신청 시점의 잔여 자리와 학교 일정에 따라 최종 확인합니다.'],
['TAS에서는 어떤 수업을 듣나요?','Math, English, Science, Social Studies 등 주요 교과와 학년별 학교 수업 및 활동에 참여합니다. 세부 과목 구성은 배정 학년과 학교 시간표에 따라 달라질 수 있습니다.'],
['캠프 참가자끼리 별도 반으로 수업하나요?','기본 방향은 TAS 기존 재학생 학급에 참여하는 형태입니다. 따라서 실제 국제학교 학생들과 같은 학교생활을 경험하는 점이 이 프로그램의 핵심입니다.'],
['한 반 인원은 어느 정도인가요?','상세 프로그램 자료에서는 한 반 최대 약 20명 수준으로 안내되어 있습니다. 실제 배정은 학년과 학교 상황에 따라 달라질 수 있습니다.'],
['TAS는 어떤 국제학교인가요?','미국식 커리큘럼을 운영하는 국제학교이며, 현재 안내 기준으로 WASC 인증과 IB PYP Authorized School 정보를 확인할 수 있습니다.'],
['하루 학교생활은 어떻게 진행되나요?','등교 후 오전 정규수업, 점심, 오후 수업과 활동으로 이어지는 실제 학교 일과에 참여합니다. 구체적인 시간표는 학년별로 다를 수 있습니다.'],
['부모가 아이의 학교생활을 확인할 수 있나요?','TAS는 Toddle 학부모 앱을 활용해 학생 활동 사진, 과제, 교사 피드백과 학습 진행 상황 등을 공유하는 데 활용합니다.'],
['학생은 디지털 기기를 수업에 사용하나요?','학생별 iPad를 수업 자료와 디지털 학습도구, 과제 등에 활용하는 방식이 안내되어 있습니다.'],
['Student ID Card는 어디에 사용하나요?','학교 출입 체크인과 Cafeteria 이용 등 캠퍼스 생활에 사용됩니다.'],
['숙소는 어디인가요?','가족 숙소는 Somerset 서비스드 레지던스가 기본 안내 숙소입니다. 가족이 함께 장기 체류하기 편한 레지던스형 숙소입니다.'],
['객실 청소도 제공되나요?','Somerset은 매일 객실 하우스키핑이 진행되는 것으로 안내되어 있어 장기 체류 중 객실 관리 부담을 줄일 수 있습니다.'],
['한국에서 출국은 단체 출국인가요?','아닙니다. 한국에서는 각 가족이 개별 출국합니다. 가족 일정에 맞춰 항공편을 예약해 출국하면 됩니다.'],
['공항 픽업과 드롭은 어떻게 진행되나요?','현지 도착과 출국 시 항공편 시간에 맞춰 가족별로 개별 픽업·드롭을 지원합니다. 항공편 정보를 제출하면 세부 차량 안내를 받게 됩니다.'],
['등록 후 학부모 안내방이 만들어지나요?','네. 등록이 완료되면 학부모님과 현지 운영팀이 함께하는 가족별 개별 단체 채팅방을 개설합니다.'],
['출국 전 OT와 준비 안내는 어디서 받나요?','등록 후 개설되는 단체 채팅방에서 오리엔테이션과 출국 안내, 준비사항을 전달받고 궁금한 내용도 수시로 질문할 수 있습니다.'],
['아이 수업 시간에 보호자는 무엇을 할 수 있나요?','골프·테니스·요가 등 현지 여가활동과 예약 정보를 안내받을 수 있어 보호자는 자녀 수업 시간 동안 별도 일정을 구성할 수 있습니다.'],
['주말 가족 일정도 도움받을 수 있나요?','주말 가족여행과 골프 등 선택 일정의 예약 및 현지 이용 정보를 지원하는 방식이 안내되어 있습니다.'],
['얼리버드 할인은 어떻게 되나요?','현재 안내된 얼리버드는 9월 1일부터 10월 31일까지이며, 기간 내 등록 시 한 가족당 US$100 할인이 적용됩니다.'],
['형제·자매가 같이 가면 추가 할인이 있나요?','형제·자매 동반 등록 시 자녀 1인당 US$50의 추가 할인이 안내되어 있습니다. 예를 들어 자녀 2명 가족은 가족 할인 US$100과 형제 할인 US$50×2를 합쳐 총 US$200 할인 예시가 가능합니다.']
];

const NT=[
['나트랑 캠프는 어떤 프로그램인가요?','연령에 따라 AVE Academy 세미 스쿨링과 Kid Castle 유치원 스쿨링으로 나뉘는 가족형 겨울캠프입니다. 아이는 학교 프로그램에 참여하고 보호자는 나트랑에서 별도 일정을 보낼 수 있습니다.'],
['AVE Academy와 Kid Castle은 어떻게 나뉘나요?','AVE Academy는 7~15세 대상, Kid Castle은 4~6세(2024년생~2022년생) 대상 프로그램으로 안내되어 있습니다.'],
['프로그램은 몇 주 과정인가요?','2주·3주·4주 중 선택할 수 있습니다. 세부 입·퇴실일은 선택 기간과 운영 일정에 따라 최종 확인합니다.'],
['AVE Academy 하루 수업시간은 어떻게 되나요?','2027 WINTER PROGRAM GUIDE 기준으로 08:30~16:30 운영으로 안내되어 있습니다.'],
['AVE Academy 한 반 인원은 몇 명인가요?','15명 기준으로 총 4개 반 운영이 안내되어 있으며, 모집 인원에 따라 실제 반 구성은 조정될 수 있습니다.'],
['AVE 수업은 캠프 학생끼리만 하나요?','오전에는 영어 집중 수업을 진행하고 오후에는 재학생과 함께하는 합동 수업 형태가 포함되는 세미 스쿨링 방식입니다.'],
['Kid Castle 하루 운영시간은 어떻게 되나요?','2027 가이드 기준 08:30~15:00 운영으로 안내되어 있습니다.'],
['Kid Castle 한 반은 몇 명이고 교사는 어떻게 배치되나요?','각 반 26명 기준이며 원어민 교사와 이중언어 현지 보조교사 2~3명이 함께 운영하는 것으로 안내되어 있습니다.'],
['Kid Castle도 기존 재학생과 같이 생활하나요?','캠프 참가자만 별도 분리하는 방식이 아니라 기존 재학생과 같은 반에서 생활하는 형태로 안내되어 있습니다.'],
['Kid Castle은 어떤 교육과정을 사용하나요?','캐나다 교육 프로그램을 기반으로 수업하는 것으로 안내되어 있습니다.'],
['나트랑 숙소는 어디인가요?','가족 숙소는 Meliá Vinpearl Empire가 기본 안내 숙소입니다.'],
['객실 청소는 얼마나 자주 해주나요?','Meliá 객실은 주 3회 하우스키핑이 진행되는 것으로 안내되어 있습니다.'],
['현지에서 문의할 수 있는 데스크가 있나요?','캠프 전용 Help Desk를 통해 현지 생활, 학교, 숙소 관련 문의를 지원하는 방식이 안내되어 있습니다.'],
['아이 등·하교 차량이 있나요?','자녀 등·하교에 캠프 전용 스쿨버스를 운영하는 것으로 안내되어 있습니다.'],
['세탁 서비스도 이용할 수 있나요?','유료 세탁 서비스 이용이 가능한 것으로 안내되어 있습니다.'],
['보호자 프로그램도 있나요?','학부모 대상 주 1회 시티투어가 안내되어 있으며, 자녀 수업 시간 동안 보호자가 나트랑 일정을 즐길 수 있도록 구성되어 있습니다.'],
['주말 여행이나 골프 예약도 도움받을 수 있나요?','주말 가족여행과 골프 등 선택 일정의 예약 안내를 지원하는 것으로 안내되어 있습니다.'],
['아이가 아프면 어떻게 하나요?','현재 프로그램 안내에는 한국어로 소통 가능한 병원 동행 및 현지 지원 내용이 포함되어 있습니다. 실제 긴급상황 대응 범위와 절차는 출국 전 최종 안내를 확인해야 합니다.'],
['항공권과 출국은 단체 출국인가요?','현재 제공된 자료에는 단체 지정 항공편 또는 개별 출국 여부가 명시되어 있지 않습니다. 공항 픽업·드랍 지원은 안내되어 있으므로 항공권 예약 전 최종 출국 방식을 확인하는 것이 좋습니다.'],
['얼리버드 할인은 어떻게 되나요?','현재 안내된 얼리버드는 9월 1일부터 10월 31일까지이며, 한 가족당 US$100 할인과 형제·자매 1인당 US$50 추가 할인이 안내되어 있습니다.']
];

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function faqBlock(city,items){
  const details=items.map((x,i)=>`<details><summary>${i+1}. ${esc(x[0])}</summary><div class="faq20__answer">${esc(x[1])}</div></details>`).join('');
  return `<section id="faq" class="faq20" aria-labelledby="faq-title"><div class="wrap"><div class="sec-head"><p class="eyebrow">FAQ · 20 Questions</p><h2 id="faq-title">자주 묻는 질문 20</h2><p class="lead">${city} 2027 겨울캠프 상담에서 많이 확인하는 내용을 정리했습니다.</p></div><div class="faq20__list">${details}</div><p class="faq20__note">※ 학교·숙소·프로모션의 잔여 자리와 운영 조건은 변동될 수 있어 등록 시점에 최종 확인합니다.</p></div></section>`;
}
function faqSchema(items){return `<script type="application/ld+json" id="faq20-schema">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:items.map(x=>({'@type':'Question',name:x[0],acceptedAnswer:{'@type':'Answer',text:x[1]}}))})}</script>`;}
function replaceFaq(html,city,items){
  if(items.length!==20) throw new Error(city+' FAQ must contain exactly 20 items');
  const block=faqBlock(city,items);
  const byId=/<section\b(?=[^>]*\bid=["']faq["'])[^>]*>[\s\S]*?<\/section>/i;
  const byMarker=/<!--\s*=+\s*FAQ\s*=+\s*-->[\s\S]*?(?=<!--\s*=+\s*[A-Z][A-Z\s&\/-]*\s*=+\s*-->)/i;
  if(byId.test(html)) html=html.replace(byId,block);
  else if(byMarker.test(html)) html=html.replace(byMarker,'<!-- ============ FAQ ============ -->\n'+block+'\n');
  else throw new Error('Could not locate FAQ section for '+city);
  if(!html.includes('id="faq20-styles"')) html=html.replace('</head>',STYLE+'\n</head>');
  html=html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,m=>m.includes('FAQPage')?'':m);
  html=html.replace('</head>',faqSchema(items)+'\n</head>');
  const section=html.match(/<section\b(?=[^>]*\bid=["']faq["'])[^>]*>[\s\S]*?<\/section>/i);
  const count=section?(section[0].match(/<details>/g)||[]).length:0;
  if(count!==20) throw new Error(city+' rendered FAQ count is '+count+', expected 20');
  return html;
}
let h=fs.readFileSync('index.html','utf8');
h=replaceFaq(h,'호치민',HCMC);fs.writeFileSync('index.html',h);
if(fs.existsSync('nhatrang.html')){let n=fs.readFileSync('nhatrang.html','utf8');n=replaceFaq(n,'나트랑',NT);fs.writeFileSync('nhatrang.html',n);}
console.log('Normalized HCMC and Nha Trang FAQs to exactly 20 items each.');
