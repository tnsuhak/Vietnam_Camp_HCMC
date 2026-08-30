const fs = require('fs');

function replaceOnceOrAlready(html, from, to, label) {
  if (html.includes(to)) return html;
  if (!html.includes(from)) throw new Error('Missing label target: ' + label);
  return html.replace(from, to);
}

function fixHcmc(html) {
  html = replaceOnceOrAlready(
    html,
    '<b>HO CHI MINH · 2027 WINTER</b>',
    '<b>HO CHI MINH · 2027 WINTER CAMP</b>',
    'HCMC top logo'
  );
  html = replaceOnceOrAlready(
    html,
    '<p class="hero__kicker">2027 <em>Winter</em><br>Ho Chi Minh</p>',
    '<p class="hero__kicker">2027 <em>Winter Camp</em><br>Ho Chi Minh</p>',
    'HCMC hero kicker'
  );
  html = replaceOnceOrAlready(
    html,
    '<a class="hdr__other" href="#" data-site-href="ntUrl">나트랑 캠프 →</a>',
    '<a class="hdr__other" href="#" data-site-href="ntUrl">나트랑 캠프도 보기 →</a>',
    'HCMC city switch'
  );
  return html;
}

function fixNhaTrang(html) {
  html = replaceOnceOrAlready(
    html,
    '<b>NHA TRANG · 2027 WINTER</b>',
    '<b>NHA TRANG · 2027 WINTER CAMP</b>',
    'Nha Trang top logo'
  );
  html = replaceOnceOrAlready(
    html,
    '<p class="hero__kicker">2027 <em>Winter</em><br>Nha Trang</p>',
    '<p class="hero__kicker">2027 <em>Winter Camp</em><br>Nha Trang</p>',
    'Nha Trang hero kicker'
  );
  html = replaceOnceOrAlready(
    html,
    '<a class="hdr__other" href="#" data-site-href="hcmUrl">호치민 캠프 →</a>',
    '<a class="hdr__other" href="#" data-site-href="hcmUrl">호치민 캠프도 보기 →</a>',
    'Nha Trang city switch'
  );
  return html;
}

let hcmc = fs.readFileSync('index.html', 'utf8');
hcmc = fixHcmc(hcmc);
fs.writeFileSync('index.html', hcmc);

if (fs.existsSync('nhatrang.html')) {
  let nt = fs.readFileSync('nhatrang.html', 'utf8');
  nt = fixNhaTrang(nt);
  fs.writeFileSync('nhatrang.html', nt);
}

console.log('Verified 2027 WINTER CAMP labels and cross-city buttons.');
