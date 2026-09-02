const fs = require('fs');

const FILE = 'index.html';
const IMAGE = 'https://i.ytimg.com/vi/7afnKW9_fvA/hqdefault.jpg';
const SITE = 'https://vietnam-camp-hcmc.netlify.app/';

let html = fs.readFileSync(FILE, 'utf8');

function removeProperty(property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  html = html.replace(new RegExp(`\\s*<meta\\s+[^>]*property=["']${escaped}["'][^>]*>`, 'gi'), '');
}
function removeName(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  html = html.replace(new RegExp(`\\s*<meta\\s+[^>]*name=["']${escaped}["'][^>]*>`, 'gi'), '');
}

['og:image','og:image:secure_url','og:image:type','og:image:width','og:image:height','og:image:alt','og:site_name','og:url'].forEach(removeProperty);
['twitter:card','twitter:image'].forEach(removeName);

const block = `
<meta property="og:url" content="${SITE}">
<meta property="og:site_name" content="TNS유학">
<meta property="og:image" content="${IMAGE}">
<meta property="og:image:secure_url" content="${IMAGE}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="480">
<meta property="og:image:height" content="360">
<meta property="og:image:alt" content="2027 호치민 TAS 국제학교 겨울캠프">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${IMAGE}">`;

if (!html.includes('</head>')) throw new Error('Missing </head>');
html = html.replace('</head>', block + '\n</head>');

if (!html.includes(`property="og:image" content="${IMAGE}"`)) throw new Error('HCMC og:image was not added');
if (!html.includes(`property="og:url" content="${SITE}"`)) throw new Error('HCMC og:url is incorrect');

fs.writeFileSync(FILE, html);
console.log('Added HCMC Open Graph share thumbnail metadata.');
