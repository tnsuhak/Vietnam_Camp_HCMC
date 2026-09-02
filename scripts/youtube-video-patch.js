const fs = require('fs');

const videos = [
  {
    file: 'index.html',
    mp4: '/media/hcmc-tas-2026.mp4',
    id: '7afnKW9_fvA',
    title: '베트남 호치민 2027 윈터캠프 TAS 국제학교 영상',
    heading: 'TAS 국제학교 캠프 현장 영상',
    description: 'TAS 국제학교와 캠프 현장을 영상으로 확인해 보세요.'
  },
  {
    file: 'nhatrang.html',
    mp4: '/media/nha-trang-ave-2026.mp4',
    id: 'dp-2G-YKfdk',
    title: '베트남 나트랑 2027 윈터캠프 AVE 아카데미 영상',
    heading: 'AVE Academy 캠프 현장 영상',
    description: 'AVE Academy의 학교 환경과 프로그램 현장을 영상으로 확인해 보세요.'
  },
  {
    file: 'nhatrang.html',
    mp4: '/media/nha-trang-preschool-2026.mp4',
    id: '8MyLW1HuQyc',
    title: '베트남 나트랑 2027 윈터캠프 ACE 캠프 영상',
    heading: 'ACE 캠프 현장 영상',
    description: '나트랑·깜란 ACE 캠프의 수업과 활동 현장을 영상으로 확인해 보세요.'
  }
];

function ensureStyles(html) {
  const css = `<style id="youtube-camp-video-styles">
.field-video__embed{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:18px;background:#061728;box-shadow:var(--shadow)}
.field-video__embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
</style>`;
  return html.includes('id="youtube-camp-video-styles"') ? html : html.replace('</head>', css + '\n</head>');
}

function replaceVideo(html, item) {
  const escaped = item.mp4.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const videoRe = new RegExp(`<video\\b[^>]*src=["']${escaped}["'][^>]*>\\s*<\\/video>`, 'i');
  if (!videoRe.test(html)) return html;

  const embed = `<div class="field-video__embed"><iframe src="https://www.youtube-nocookie.com/embed/${item.id}" title="${item.title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  html = html.replace(videoRe, embed);

  const sectionStart = html.lastIndexOf('<section class="field-video"', html.indexOf(embed));
  const sectionEnd = html.indexOf('</section>', html.indexOf(embed));
  if (sectionStart >= 0 && sectionEnd > sectionStart) {
    let section = html.slice(sectionStart, sectionEnd + 10);
    section = section.replace(/<h3(?:\s+id="[^"]*")?>[\s\S]*?<\/h3>/i, `<h3>${item.heading}</h3>`);
    section = section.replace(/<div class="field-video__meta">([\s\S]*?)<p>[\s\S]*?<\/p>/i, (m, before) => `<div class="field-video__meta">${before}<p>${item.description}</p>`);
    html = html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
  }
  return html;
}

const grouped = {};
for (const item of videos) (grouped[item.file] ||= []).push(item);

for (const [file, items] of Object.entries(grouped)) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  html = ensureStyles(html);
  for (const item of items) html = replaceVideo(html, item);
  fs.writeFileSync(file, html);
}

console.log('Replaced local MP4 players with YouTube embeds.');
