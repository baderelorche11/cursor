/* Shared UI helpers. Every piece of user-provided text goes through esc()
   before being inserted as HTML. */

window.UI = (function () {
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initials = (name) => {
    const clean = String(name || '').replace(/^(الأستاذ|الكوتش|د\.)\s+/, '');
    return esc(clean.trim().charAt(0) || '؟');
  };
  const avatar = (name, sm) => `<span class="avatar${sm ? ' sm' : ''}" aria-hidden="true">${initials(name)}</span>`;
  const fmt = (n) => Number(n || 0).toLocaleString('en-US');
  const fmtDate = (d) => { if (!d) return '—'; const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };

  const STATUS = {
    pending:     ['warn', '●', 'قيد الدراسة'],
    accepted:    ['ok',   '✓', 'مقبول'],
    info:        ['info', '?', 'يحتاج معلومات إضافية'],
    rejected:    ['bad',  '✕', 'مرفوض'],
    approved:    ['ok',   '✓', 'معتمد'],
    new:         ['neutral', '○', 'جديدة'],
    in_progress: ['info', '◐', 'قيد التنفيذ'],
    review:      ['warn', '◔', 'بانتظار المراجعة'],
    done:        ['ok',   '✓', 'مكتملة'],
    late:        ['bad',  '!', 'متأخرة'],
  };
  const badge = (key, label) => {
    const [cls, icon, text] = STATUS[key] || ['neutral', '•', key];
    return `<span class="st ${cls}">${icon} ${esc(label || text)}</span>`;
  };

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  function modal(html, onMount) {
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    const close = () => back.remove();
    back.addEventListener('click', (e) => { if (e.target === back || e.target.closest('[data-close]')) close(); });
    document.body.appendChild(back);
    if (onMount) onMount(back.querySelector('.modal'), close);
    const first = back.querySelector('input,select,textarea,button');
    if (first) first.focus();
    return close;
  }

  /* Single-series bar chart: one hue, hover tooltip per bar, table fallback via aria-label. */
  function bars(labels, values, unit) {
    const max = Math.max(...values, 1);
    return `<div class="chart" role="img" aria-label="${esc(labels.map((l, i) => l + ': ' + values[i]).join('، '))}">
      <div class="bars">${values.map((v, i) => `<div class="b" tabindex="0"><span class="tip">${esc(labels[i])}: ${fmt(v)} ${esc(unit || '')}</span><i style="height:${Math.max(2, (v / max) * 100)}%"></i></div>`).join('')}</div>
      <div class="bars-labels">${labels.map((l) => `<span title="${esc(l)}">${esc(l)}</span>`).join('')}</div>
    </div>`;
  }

  function hbars(labels, values, unit) {
    const max = Math.max(...values, 1);
    return `<div class="hbars">${values.map((v, i) => `<div class="hbar" title="${esc(labels[i])}: ${fmt(v)} ${esc(unit || '')}"><span>${esc(labels[i])}</span><span class="track"><i style="width:${(v / max) * 100}%"></i></span><b>${fmt(v)}</b></div>`).join('')}</div>`;
  }

  /* Deterministic decorative QR-style pattern derived from the certificate
     number. Visual stand-in until a real QR encoder is wired in. */
  function qr(text) {
    let h = 2166136261;
    for (const c of text) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    const n = 21, cells = [];
    const finder = (x, y) => [[0, 0], [n - 7, 0], [0, n - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      if ((h >>> 0) % 2) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
    const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<svg class="qr" viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges" aria-label="QR"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><g fill="#0B3D2A">${f(0, 0)}${f(n - 7, 0)}${f(0, n - 7)}${cells.join('')}</g></svg>`;
  }

  return { esc, avatar, fmt, fmtDate, badge, toast, modal, bars, hbars, qr, STATUS };
})();
