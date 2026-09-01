const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const heading = '호주보다 많은 한국인이 생활하는 베트남';
if (!html.includes(heading)) throw new Error('Diaspora comparison section not found');

const oldRule = '.bar__f{height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';
const newRule = '.bar__f{display:block;height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';

if (html.includes(oldRule)) {
  html = html.replace(oldRule, newRule);
} else if (!html.includes('.bar__f{display:block;')) {
  throw new Error('Expected bar fill CSS rule not found');
}

for (const expected of ['width:100%','width:88.3%','width:27.3%','width:9.3%']) {
  if (!html.includes(expected)) throw new Error('Missing diaspora bar width: ' + expected);
}

fs.writeFileSync(FILE, html);
console.log('Enabled proportional diaspora bar fills.');
