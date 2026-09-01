const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const text = '공식 확정 자료에는 4주(2027.01.03~01.30)와 2주(2027.02.14~02.27) 두 기간이 명시되어 있습니다. 위에 표시된 3주 및 1월 중 2주 일정은 현재 공개된 2027 프로그램 판매 정보 기준이며, 최종 모집요강 확인 필요 항목입니다.';
const at = html.indexOf(text);

if (at >= 0) {
  const pStart = html.lastIndexOf('<p', at);
  const pEnd = html.indexOf('</p>', at);
  if (pStart >= 0 && pEnd >= 0) {
    html = html.slice(0, pStart) + html.slice(pEnd + 4);
  } else {
    html = html.replace(text, '');
  }
}

if (html.includes(text)) throw new Error('Obsolete HCMC schedule note still remains');
fs.writeFileSync(FILE, html);
console.log('Removed obsolete HCMC schedule disclaimer.');
