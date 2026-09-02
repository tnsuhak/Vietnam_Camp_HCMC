const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

// Keep the consultation CTA, but remove the duplicated company-info copy inside that section.
const contactStart = html.indexOf('<div class="tns-contact-info"');
if (contactStart >= 0) {
  const contactTail = '</div></div>\n  </div>\n</section>';
  const tailAt = html.indexOf(contactTail, contactStart);
  if (tailAt < 0) throw new Error('Could not safely locate the end of duplicated TNS contact-info block');
  const contactEnd = tailAt + '</div></div>'.length;
  html = html.slice(0, contactStart) + html.slice(contactEnd);
}

// Inline span fills need display:block to show the proportional coloured bars.
const barRule = '.bar__f{height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';
const barRuleFixed = '.bar__f{display:block;height:100%; background:linear-gradient(90deg,var(--sea),var(--palm)); border-radius:999px}';
if (html.includes(barRule)) html = html.replaceAll(barRule, barRuleFixed);

// Remove calculator runtimes left by earlier repair attempts.
// Duration/price controls are rebuilt separately by rebuild-period-price.js.
html = html
  .replace(/\s*<script src="\/ui-fix-runtime\.js"><\/script>\s*/g, '\n')
  .replace(/\s*<script id="tns-mobile-price-runtime">[\s\S]*?<\/script>\s*/g, '\n')
  .replace(/\s*<script id="tns-production-style-calculator">[\s\S]*?<\/script>\s*/g, '\n')
  .replace(/\s*<style id="tns-css-only-period-price">[\s\S]*?<\/style>\s*/g, '\n');

if (html.includes('<div class="tns-contact-info"')) throw new Error('Duplicated TNS contact-info block still remains');
if (!html.includes('220-87-54964')) throw new Error('Lower footer business information is missing');

fs.writeFileSync(FILE, html);
console.log('Applied final non-calculator UI fixes and removed legacy calculator runtimes.');
