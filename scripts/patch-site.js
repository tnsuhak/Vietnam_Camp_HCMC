const fs = require('fs');
const https = require('https');

const HCMC_URL = 'https://vietnam-camp-hcmc.netlify.app/';
const NT_URL = HCMC_URL + 'nhatrang.html';
const NT_REPO = 'tnsuhak/Vietnam_Camp_NT';
const NT_REF = process.env.CONTEXT === 'production' ? 'main' : 'update-2027-content-videos';

function mustReplace(html, from, to, label, all=false) {
  if (!html.includes(from)) throw new Error(`Missing patch target: ${label}`);
  return all ? html.split(from).join(to) : html.replace(from, to);
}

function addVideoStyles(html) {
  const css = `\n<style id="field-video-styles">\n.field-video{padding:44px 0;background:var(--paper-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}\n.field-video__box{max-width:900px;margin:0 auto}.field-video video{display:block;width:100%;background:#061728;border-radius:18px;box-shadow:var(--shadow)}\n.field-video__meta{margin-top:14px}.field-video__meta h3{font-size:19px}.field-video__meta p{margin:6px 0 0;color:var(--muted);font-size:13.5px}\n.school-life{padding:52px 0;background:#fff}.school-life .facts{margin-top:22px}\n</style>\n`;
  return mustReplace(html, '</head>', css + '</head>', 'head close');
}

function hcmcPatch(html) {
  html = mustReplace(html, 'https://YOUR-DOMAIN-HERE/', HCMC_URL, 'HCMC canonical/og URL', true);
  html = addVideoStyles(html);

  const schoolLife = `\n<section class="school-life" aria-labelledby="school-life-title">\n  <div class="wrap">\n    <div class="sec-head">\n      <p class="eyebrow">School life & parent updates</p>\n      <h2 id="school-life-title">학교에 있는 동안에도,<br>아이의 하루를 확인합니다.</h2>\n      <p class="lead">TAS의 학교생활은 수업만으로 끝나지 않습니다. 디지털 학습도구와 학부모 소통 시스템을 통해 학교생활과 학습 진행 상황을 확인할 수 있습니다.</p>\n    </div>\n    <div class="facts">\n      <div class="fact"><h4><span>Parent App</span>Toddle 학부모 앱</h4><p>학생 활동 사진, 과제, 교사 피드백과 학습 진행 상황을 학부모와 공유하는 데 활용됩니다.</p></div>\n      <div class="fact"><h4><span>Digital Learning</span>학생별 iPad 활용</h4><p>수업 자료와 디지털 학습도구를 수업과 과제에 활용합니다.</p></div>\n      <div class="fact"><h4><span>Campus Life</span>Student ID Card</h4><p>학교 출입 체크인과 Cafeteria 이용 등 일상적인 캠퍼스 생활에 사용됩니다.</p></div>\n    </div>\n  </div>\n</section>\n\n<section class="field-video" aria-labelledby="hcmc-video-title">\n  <div class="wrap field-video__box">\n    <p class="eyebrow">Previous programme footage</p>\n    <video controls playsinline preload="metadata" src="/media/hcmc-tas-2026.mp4" aria-label="2026 호치민 TAS 프로그램 현장 영상"></video>\n    <div class="field-video__meta"><h3 id="hcmc-video-title">지난 프로그램 현장 영상</h3><p>2026년 실제 프로그램에서 촬영한 영상입니다. 학교와 수업 환경을 참고해 주세요.</p></div>\n  </div>\n</section>\n`;
  html = mustReplace(html, '<!-- ============ DAY FLOW ============ -->', schoolLife + '\n<!-- ============ DAY FLOW ============ -->', 'HCMC day-flow insertion');

  const supportNeedle = `<div class="sup__i"><div class="ico">⛑</div><b>생활지원 전용 차량</b>\n        <p>마사지·사이공 스퀘어 이동 및 응급 병원 이동 시 이용합니다. <strong>학생 관련 상황과 응급 상황 운행이 최우선</strong>으로 배차됩니다.</p></div>`;
  const supportExtra = supportNeedle + `\n      <div class="sup__i"><div class="ico">⌂</div><b>매일 객실 청소</b><p>서비스드 레지던스의 하우스키핑이 매일 진행되어 장기 체류 중에도 객실 관리 부담을 줄입니다.</p></div>\n      <div class="sup__i"><div class="ico">○</div><b>학부모 여가 안내</b><p>골프·테니스·요가 등 학부모가 이용할 수 있는 현지 활동과 예약 정보를 안내합니다.</p></div>\n      <div class="sup__i"><div class="ico">◇</div><b>주말 가족 일정 지원</b><p>주말 가족여행과 골프 등 선택 일정의 예약과 현지 이용 정보를 지원합니다.</p></div>`;
  html = mustReplace(html, supportNeedle, supportExtra, 'HCMC support cards');
  return html;
}

function ntPatch(html) {
  html = mustReplace(html, 'https://YOUR-DOMAIN-HERE/nhatrang.html', NT_URL, 'NT canonical/og URL', true);
  html = addVideoStyles(html);
  html = mustReplace(html, '08:30 ~ 16:45', '08:30 ~ 16:30', 'AVE schedule', true);
  html = mustReplace(html, '08:30 ~ 15:40', '08:30 ~ 15:00', 'Kid Castle schedule', true);
  html = mustReplace(html, '한 반 최대 15명 · 총 4개 반', '15명 기준 · 총 4개 반 운영', 'AVE class heading', true);
  html = mustReplace(html, '한 반 최대 15명', '15명 기준 · 4개 반 운영', 'AVE class badge/FAQ', true);
  html = mustReplace(html, '한 반 정원은 최대 15명입니다.', '15명 기준으로 총 4개 반을 운영하며, 모집 인원에 따라 반 구성은 조정될 수 있습니다.', 'AVE FAQ sentence', true);

  const classPara = `원어민 교사 1명과 보조 교사 1명이 함께 관리합니다. 모든 참가 학생은 <strong>사전 레벨 테스트</strong>를 거치며,\n          학년을 우선으로 편성한 뒤 전반적인 학습 수준을 함께 고려해 최종 반이 결정됩니다. 영어 실력이 높다고 상위 반으로 가는 방식이 아닙니다.`;
  const classParaNew = classPara + ` <strong>15명 기준으로 총 4개 반을 운영하며 모집 인원에 따라 반 구성은 조정될 수 있습니다.</strong>`;
  if (html.includes(classPara)) html = html.replace(classPara, classParaNew);

  const kidNeedle = `<details><summary>6. 유치원생도 가능한가요?</summary><div class="a">\n        <strong>가능합니다.</strong> 4~6세는 Kid Castle International Kindergarten으로 배정되어 08:30 ~ 15:00 운영됩니다.`;
  const kidReplace = `<details><summary>6. 유치원생도 가능한가요?</summary><div class="a">\n        <strong>가능합니다.</strong> 4~6세(2024년생~2022년생)는 Kid Castle International Kindergarten으로 배정되어 08:30 ~ 15:00 운영됩니다. 각 반은 26명 기준이며 원어민 교사와 이중언어 현지 보조교사 2~3명이 함께 운영합니다. 캠프 참가자만 별도 분리하는 방식이 아니라 기존 재학생과 같은 반에서 생활하며, 캐나다 교육 프로그램을 기반으로 수업합니다.`;
  html = mustReplace(html, kidNeedle, kidReplace, 'Kid Castle FAQ detail');

  const videos = `\n<section class="field-video" aria-labelledby="ave-video-title">\n  <div class="wrap field-video__box">\n    <p class="eyebrow">Previous programme footage</p>\n    <video controls playsinline preload="metadata" src="/media/nha-trang-ave-2026.mp4" aria-label="2026 나트랑 AVE 프로그램 현장 영상"></video>\n    <div class="field-video__meta"><h3 id="ave-video-title">2026 나트랑 AVE 프로그램 현장</h3><p>지난 실제 프로그램에서 촬영한 영상입니다. 2027 겨울 프로그램의 학교·수업 환경을 이해하기 위한 참고 영상입니다.</p></div>\n  </div>\n</section>\n<section class="field-video" aria-labelledby="preschool-video-title" style="background:#fff">\n  <div class="wrap field-video__box">\n    <p class="eyebrow">Previous preschool footage</p>\n    <video controls playsinline preload="metadata" src="/media/nha-trang-preschool-2026.mp4" aria-label="2026 나트랑 유아 프로그램 현장 영상"></video>\n    <div class="field-video__meta"><h3 id="preschool-video-title">2026 나트랑 유아 프로그램 현장 영상</h3><p>영상에는 당시 운영 브랜드가 표시될 수 있습니다. 현재 2027 Kid Castle 프로그램의 수업 환경을 참고하는 현장 자료로 봐 주세요.</p></div>\n  </div>\n</section>\n`;
  html = mustReplace(html, '<!-- ============ DAY FLOW ============ -->', videos + '\n<!-- ============ DAY FLOW ============ -->', 'NT video insertion');

  const stayInsertPoint = '<!-- ============ PRICE ============ -->';
  const support = `\n<section class="school-life" aria-labelledby="nt-life-title">\n  <div class="wrap">\n    <div class="sec-head"><p class="eyebrow">Stay & family support</p><h2 id="nt-life-title">아이 수업뿐 아니라,<br>가족의 2~4주 생활까지.</h2></div>\n    <div class="facts">\n      <div class="fact"><h4><span>Housekeeping</span>주 3회 객실 청소</h4><p>Meliá Vinpearl Empire 객실은 주 3회 하우스키핑이 진행되며 별도 요청 시 추가 청소를 상담할 수 있습니다.</p></div>\n      <div class="fact"><h4><span>Help Desk</span>캠프 전용 Help Desk</h4><p>현지 생활 안내, 유료 세탁 서비스, 학교·생활 관련 문의를 지원합니다.</p></div>\n      <div class="fact"><h4><span>Transport</span>전용 스쿨버스</h4><p>자녀 등·하교에 캠프 전용 차량을 운영해 보호자의 매일 이동 부담을 줄입니다.</p></div>\n      <div class="fact"><h4><span>Parent Programme</span>학부모 시티투어·주말 예약</h4><p>학부모 주 1회 시티투어와 주말 가족여행·골프 예약 안내 등 선택 일정의 현지 지원을 제공합니다.</p></div>\n    </div>\n  </div>\n</section>\n`;
  html = mustReplace(html, stayInsertPoint, support + '\n' + stayInsertPoint, 'NT stay support insertion');

  html = html.replace(/나트랑 별도 브로셔가 없어[^<\n]*/g, '');
  return html;
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'TNS-Netlify-Build' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return resolve(get(res.headers.location));
      if (res.statusCode !== 200) return reject(new Error(`GET ${url}: ${res.statusCode}`));
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const index = fs.readFileSync('index.html', 'utf8');
  fs.writeFileSync('index.html', hcmcPatch(index));

  const ntRaw = await get(`https://raw.githubusercontent.com/${NT_REPO}/${encodeURIComponent(NT_REF)}/index.html`);
  fs.writeFileSync('nhatrang.html', ntPatch(ntRaw));

  fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${HCMC_URL}sitemap.xml\n`);
  fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${HCMC_URL}</loc><lastmod>2026-08-30</lastmod></url>\n  <url><loc>${NT_URL}</loc><lastmod>2026-08-30</lastmod></url>\n</urlset>\n`);
  console.log(`Patched HCMC + Nha Trang (${NT_REF}) and generated robots/sitemap.`);
})();
