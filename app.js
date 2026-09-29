const data = 장데이터;   // 데이터.js 에서 불러옴 (fetch 없이 동작 - 로컬 더블클릭 가능)
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');

const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// 검색어 강조 (HTML 이스케이프 후 적용)
function mark(html, kw) {
  if (!kw) return html;
  const k = esc(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(k, 'g'), m => `<mark>${m}</mark>`);
}

// 본문 마크다운(### 소제목, **굵게**, 문단) 간단 변환
function toHtml(md, kw) {
  return md.split(/\n{2,}/).map(block => {
    const h = block.match(/^###\s+(.*)$/);
    if (h) return `<h3>${mark(esc(h[1]), kw)}</h3>`;
    const html = mark(esc(block), kw).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return `<p>${html}</p>`;
  }).join('');
}

q.addEventListener('input', () => {
  const kw = q.value.trim();
  const filtered = kw ? data.filter(a => a.본문.includes(kw) || a.제목.includes(kw)) : data;
  render(filtered, kw);
});

function render(arr, kw = '') {
  count.textContent = `결과 ${arr.length}건`;
  list.innerHTML = arr.length ? arr.map(a => `
    <article class="card">
      <span class="label">${esc(a.장)}장</span>
      <div class="title">${mark(esc(a.제목), kw)}</div>
      <div class="body">${toHtml(a.본문, kw)}</div>
    </article>`).join('') : '<p class="empty">검색 결과가 없습니다.</p>';
}

render(data);
