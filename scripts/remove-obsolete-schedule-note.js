const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const marker = '공식 확정 자료에는 4주(2027.01.03~01.30)와 2주(2027.02.14~02.27)';

let removed = 0;
while (html.includes(marker)) {
  const at = html.indexOf(marker);
  const pStart = html.lastIndexOf('<p', at);
  const pEnd = html.indexOf('</p>', at);
  if (pStart >= 0 && pEnd >= 0 && pStart < at) {
    html = html.slice(0, pStart) + html.slice(pEnd + 4);
    removed++;
  } else {
    // Fallback: remove the full sentence block up to the next paragraph/block boundary.
    const endCandidates = [html.indexOf('</div>', at), html.indexOf('<', at + marker.length)].filter(i => i >= 0);
    const end = endCandidates.length ? Math.min(...endCandidates) : at + marker.length;
    html = html.slice(0, at) + html.slice(end);
    removed++;
  }
}

if (html.includes(marker)) throw new Error('Obsolete HCMC schedule note still remains');
fs.writeFileSync(FILE, html);
console.log(`Removed obsolete HCMC schedule disclaimer (${removed} occurrence${removed === 1 ? '' : 's'}).`);
