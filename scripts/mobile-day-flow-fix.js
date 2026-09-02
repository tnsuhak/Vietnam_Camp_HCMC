const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const STYLE_ID = 'tns-mobile-day-flow-fix';
html = html.replace(new RegExp(`<style id=["']${STYLE_ID}["'][\\s\\S]*?<\\/style>`, 'gi'), '');

const css = `
<style id="${STYLE_ID}">
@media (max-width:699px){
  /* Keep the day-flow grid valid even before/without JS initialization. */
  .flow .rail{
    grid-template-columns:64px minmax(0,1fr) !important;
    width:100%;
  }

  /* Mobile default: child lane only. */
  .flow .rail .rail__h--parent,
  .flow .rail .slot--parent{
    display:none !important;
  }
  .flow .rail .rail__h--child,
  .flow .rail .slot--child{
    display:block !important;
  }

  /* Parent tab swaps the second column instead of adding a third item. */
  body[data-lane="parent"] .flow .rail .rail__h--child,
  body[data-lane="parent"] .flow .rail .slot--child{
    display:none !important;
  }
  body[data-lane="parent"] .flow .rail .rail__h--parent,
  body[data-lane="parent"] .flow .rail .slot--parent{
    display:block !important;
  }

  .flow .rail__h,
  .flow .slot,
  .flow .slot b,
  .flow .slot small{
    min-width:0;
    word-break:keep-all !important;
    overflow-wrap:normal !important;
  }
  .flow .rail__h{
    padding-left:12px;
    letter-spacing:.12em;
  }
  .flow .rail__h--time{
    padding-left:0;
  }
  .flow .rail__t{
    min-width:0;
    padding-right:10px;
    white-space:nowrap;
  }
  .flow .slot{
    padding:12px 12px;
  }
  .flow .slot--child{
    border-right:0;
  }
}
</style>`;

if (!html.includes('</head>')) throw new Error('Missing </head>');
html = html.replace('</head>', css + '\n</head>');

if (!html.includes(`id="${STYLE_ID}"`)) throw new Error('Mobile day-flow style was not added');
fs.writeFileSync(FILE, html);
console.log('Fixed HCMC mobile day-flow layout.');
