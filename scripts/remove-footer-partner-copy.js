const fs = require('fs');
const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');
const target = '본 사이트는 2027 겨울 베트남 국제학교 프로그램의 한국 판매·상담 파트너가 운영하는 홍보 사이트입니다.';
if (!html.includes(target)) {
  throw new Error('Footer partner copy not found');
}
html = html.replaceAll(target, '');
fs.writeFileSync(FILE, html);
console.log('Removed footer partner promotional sentence.');
