const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const oldText = '<div class="stat__n">5–6<small>시간</small></div>';
const newText = '<div class="stat__n">5시간 10분</div>';

if (!html.includes(oldText)) {
  throw new Error('HCMC flight-time stat not found');
}

html = html.replace(oldText, newText);
fs.writeFileSync(FILE, html);
console.log('Updated HCMC direct flight time to 5시간 10분.');
