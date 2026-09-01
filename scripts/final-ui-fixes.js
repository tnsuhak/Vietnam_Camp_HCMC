const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

// 1) The same business/company block is already filled in the lower footer.
// Remove the duplicated copy inside the consultation section, but keep the consultation CTA itself.
const contactStart = html.indexOf('<div class="tns-contact-info"');
if (contactStart >= 0) {
  const contactTail = '</div></div>\n  </div>\n</section>';
  const tailAt = html.indexOf(contactTail, contactStart);
  if (tailAt < 0) throw new Error('Could not safely locate the end of duplicated TNS contact-info block');
  const contactEnd = tailAt + '</div></div>'.length;
  html = html.slice(0, contactStart) + html.slice(contactEnd);
}

// 2) Inline span fills need display:block to show the proportional coloured bars.
const barRule = '.bar__f{height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';
const barRuleFixed = '.bar__f{display:block;height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';
if (html.includes(barRule)) html = html.replaceAll(barRule, barRuleFixed);

// 3) Re-bind the price selector with a small independent runtime.
// This also synchronises the duration selector above with the fee selector below.
const runtimeTag = '<script src="/ui-fix-runtime.js"></script>';
if (!html.includes(runtimeTag)) {
  if (!html.includes('</body>')) throw new Error('Missing </body> while adding UI runtime');
  html = html.replace('</body>', runtimeTag + '\n</body>');
}

if (html.includes('<div class="tns-contact-info"')) throw new Error('Duplicated TNS contact-info block still remains');
if (!html.includes('220-87-54964')) throw new Error('Lower footer business information is missing');
if (!html.includes('data-role="weeks"') || !html.includes('data-role="family"') || !html.includes('data-role="out"')) {
  throw new Error('Price selector markup is missing');
}

fs.writeFileSync(FILE, html);
console.log('Applied final UI fixes: footer dedupe, visible bars, repaired/synchronised price selector.');
