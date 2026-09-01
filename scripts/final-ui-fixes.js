const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

// The same business/company block is already filled in the lower footer.
// Remove the duplicated copy inside the consultation section, but keep the consultation CTA itself.
const contactStart = html.indexOf('<div class="tns-contact-info"');
if (contactStart >= 0) {
  const contactTail = '</div></div>\n  </div>\n</section>';
  const tailAt = html.indexOf(contactTail, contactStart);
  if (tailAt < 0) throw new Error('Could not safely locate the end of duplicated TNS contact-info block');
  const contactEnd = tailAt + '</div></div>'.length;
  html = html.slice(0, contactStart) + html.slice(contactEnd);
}

// Make the proportional Korean-resident comparison bars visible without touching interaction code.
const barRule = '.bar__f{height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';
const barRuleFixed = '.bar__f{display:block;height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';
if (html.includes(barRule)) html = html.replaceAll(barRule, barRuleFixed);

// Important: leave the original production schedule/price calculator completely untouched.
// Do not inject any fallback runtime or replace its buttons/markup.
if (!html.includes('function initPrice(root)')) throw new Error('Original production price calculator JS is missing');
if (!html.includes('data-role="weeks"') || !html.includes('data-role="family"') || !html.includes('data-role="out"')) {
  throw new Error('Original production price selector markup is missing');
}
if (html.includes('tns-css-price') || html.includes('tns-mobile-price-runtime') || html.includes('tns-production-style-calculator')) {
  throw new Error('A calculator override is still present; aborting build');
}

if (html.includes('<div class="tns-contact-info"')) throw new Error('Duplicated TNS contact-info block still remains');
if (!html.includes('220-87-54964')) throw new Error('Lower footer business information is missing');

fs.writeFileSync(FILE, html);
console.log('Applied non-interactive UI fixes and preserved the original production calculator.');
