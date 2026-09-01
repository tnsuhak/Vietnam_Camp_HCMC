const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');
const originalLength = html.length;

// Remove only the previously injected standalone TNS company footer/style.
html = html.replace(/<footer\b[^>]*class=(["'])[^"']*tns-company-footer[^"']*\1[^>]*>[\s\S]*?<\/footer>\s*/gi, '');
html = html.replace(/<style\b[^>]*id=(["'])tns-company-footer-styles\1[^>]*>[\s\S]*?<\/style>\s*/gi, '');

// Keep the company's details inside the consultation section instead.
for (const expected of ['TNS유학','㈜티앤에스월드와이드','220-87-54964','tns-contact-info']) {
  if (!html.includes(expected)) throw new Error('TNS company information is missing from inquiry section: ' + expected);
}

if (html.length < originalLength * 0.92) throw new Error('Cleanup removed too much page content; aborting build');
fs.writeFileSync(FILE, html);
console.log('Verified company information is inside the inquiry section; no standalone TNS footer added.');
