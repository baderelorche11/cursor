/* Member & administration dashboard (sections 7–35, 42, 44). */

window.Dashboard = (function () {
  const { esc, avatar, fmt, fmtDate, badge, toast, modal, bars, hbars } = UI;
  const S = () => Store.s;
  const opt = (list, sel, empty) => (empty ? `<option value="">${esc(empty)}</option>` : '') + list.map(([v, l]) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`).join('');
  const userOpts = (sel, empty) => opt(S().users.map((u) => [u.id, u.name]), sel, empty);
  const teamOpts = (sel, empty) => opt(S().teams.map((t) => [t.id, t.name]), sel, empty);
  const comOpts = (sel, empty) => opt(S().committees.map((c) => [c.id, c.name]), sel, empty);
  const denied = () => `<div class="card"><h3>🔒 غير مصرح</h3><p class="muted">ليست لديك الصلاحية للوصول إلى هذه الصفحة.</p></div>`;
  const title = (h, sub) => `<h1>${esc(h)}</h1><p class="sub">${esc(sub || '')}</p>`;

  /* ---------- Home: Academy Dashboard (section 44) ---------- */
  function home(me) {
    const lv = Store.levelOf(me.points);
    const myTasks = S().tasks.filter((t) => t.assignee === me.id && t.status !== 'done');
    const team = Store.team(me.team), com = Store.committee(me.committee);
    const lastPts = S().pointLog.filter((p) => p.user === me.id).slice(0, 5);
    const meetings = S().meetings.filter((m) => m.participants.includes(me.id) && m.date >= Store.today()).slice(0, 3);
    const span = lv.next ? lv.next.min - lv.current.min : 1;
    const pct = lv.next ? Math.round(((me.points - lv.current.min) / span) * 100) : 100;
    return `
      <div class="welcome"><div><h2>مرحبًا بك في أكاديمية إشراقة وعي</h2><div>${esc(me.name)} — ${esc(me.title)}</div></div>
      <a class="btn btn-gold" href="#/dashboard/points">سجل نقاطي</a></div>
      <div class="kpis">
        <div class="kpi"><span>نقاطك</span><b>${fmt(me.points)}</b></div>
        <div class="kpi"><span>مستواك</span><b style="font-size:1.3rem">${esc(lv.current.name)}</b></div>
        <div class="kpi"><span>نشاطك</span><b>${me.activity}%</b></div>
        <div class="kpi"><span>المهام</span><b>${myTasks.length}</b></div>
        <div class="kpi"><span>الترقية القادمة</span><b>${lv.next ? fmt(lv.next.min - me.points) : '—'}</b><small>${lv.next ? 'نقطة' : 'أعلى مستوى'}</small></div>
        <div class="kpi"><span>فريقك</span><b style="font-size:1.05rem">${esc(team ? team.name.split('—').pop() : '—')}</b></div>
        <div class="kpi"><span>لجنتك</span><b style="font-size:1.05rem">${esc(com ? com.name : '—')}</b></div>
      </div>
      <div class="grid g2">
        <div class="card"><h3>مهماتي</h3>${myTasks.length ? myTasks.map((t) => `<div class="list-row"><div style="flex:1"><b>${esc(t.title)}</b><div class="muted" style="font-size:.85rem">التسليم: ${fmtDate(t.due)} · الأولوية: ${esc(t.priority)}</div></div>${badge(Store.taskStatus(t))}</div>`).join('') : '<p class="muted">لا توجد مهام مفتوحة 🎉</p>'}</div>
        <div class="card"><h3>تقدمي</h3><p style="margin:0">${esc(lv.current.name)} ← <b>${esc(lv.next ? lv.next.name : 'أعلى مستوى')}</b></p><div class="progress gold" style="margin:10px 0"><i style="width:${pct}%"></i></div><p class="muted" style="margin:0">${pct}% من الطريق إلى المستوى التالي</p>
          <p style="margin:14px 0 4px">مؤشر المساهمة: <b>${Store.contributionIndex(me)}/100</b></p><div class="progress"><i style="width:${Store.contributionIndex(me)}%"></i></div></div>
        <div class="card"><h3>آخر نقاطي</h3>${lastPts.length ? lastPts.map((p) => `<div class="list-row"><span style="flex:1">${esc(Store.activity(p.activity).name)} <small class="muted">${fmtDate(p.date)}</small></span><b class="gold">+${p.points}</b>${badge(p.status)}</div>`).join('') : '<p class="muted">لا توجد عمليات بعد.</p>'}</div>
        <div class="card"><h3>اجتماعاتي</h3>${meetings.length ? meetings.map((m) => `<div class="list-row"><span style="flex:1"><b>${esc(m.title)}</b><div class="muted" style="font-size:.85rem">${fmtDate(m.date)} · ${esc(m.time)}</div></span><span class="pill">${esc(m.type)}</span></div>`).join('') : '<p class="muted">لا توجد اجتماعات قادمة.</p>'}</div>
      </div>
      <div class="card" style="margin-top:22px"><h3>إعلانات الإدارة</h3>${S().announcements.slice(0, 3).map((a) => `<div class="list-row">${avatar(Store.userName(a.by), true)}<div style="flex:1"><b>${esc(Store.userName(a.by))}</b> <small class="muted">${fmtDate(a.date)}</small><div>${esc(a.text)}</div></div></div>`).join('')}</div>`;
  }

  /* ---------- Profile card (section 7) ---------- */
  function profile(me, arg) {
    const u = (arg && Store.user(arg)) || me;
    const lv = Store.levelOf(u.points);
    const team = Store.team(u.team), com = Store.committee(u.committee);
    const done = S().tasks.filter((t) => t.assignee === u.id && t.status === 'done').length;
    const certs = S().certificates.filter((c) => c.user === u.id);
    const courses = S().courses.filter((c) => c.enrolled.includes(u.id));
    return title('بطاقة إشراقة وعي', 'الملف الشخصي') + `
      <div class="grid g2">
        <div class="card person" style="background:linear-gradient(160deg,var(--green-deep),var(--green));color:#fff;border-color:var(--gold)">
          ${avatar(u.name)}<h2 style="color:var(--gold);margin:0">${esc(u.name)}</h2><div>${esc(u.title)}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px;text-align:start;font-size:.93rem">
            <div>الفريق<br><b>${esc(team ? team.name : '—')}</b></div><div>اللجنة<br><b>${esc(com ? com.name : '—')}</b></div>
            <div>المستوى<br><b>${esc(lv.current.name)}</b></div><div>تاريخ الانضمام<br><b>${fmtDate(u.joined)}</b></div>
            <div>النقاط<br><b style="color:var(--gold);font-size:1.3rem">${fmt(u.points)}</b></div><div>نسبة النشاط<br><b>${u.activity}%</b></div>
          </div>
          <p style="margin:14px 0 0;font-size:.85rem;opacity:.8">الصلاحية: ${esc(S().roles[u.role].label)}</p>
        </div>
        <div class="card"><h3>الإنجازات والمسار</h3>
          <div class="kpis" style="grid-template-columns:repeat(2,1fr)"><div class="kpi"><span>المهام المكتملة</span><b>${done}</b></div><div class="kpi"><span>مؤشر المساهمة</span><b>${Store.contributionIndex(u)}</b></div></div>
          <p><b>المهارات:</b> ${(u.skills || []).map((s) => `<span class="pill">${esc(s)}</span>`).join('') || '—'}</p>
          <p><b>التكوينات:</b> ${courses.map((c) => `<span class="pill gold">${esc(c.title)}</span>`).join('') || '—'}</p>
          <p><b>الشهادات:</b> ${certs.map((c) => `<a class="pill" href="#/certificates/${esc(c.id)}">${esc(c.program)}</a>`).join('') || '—'}</p>
          <p style="margin:0"><b>الالتزام:</b> ${u.commitment}%</p>
        </div>
      </div>`;
  }

  /* ---------- Points (sections 12–14) ---------- */
  function points(me) {
    const mine = S().pointLog.filter((p) => p.user === me.id);
    const canPropose = Store.can(me, 'points.propose');
    const canApprove = Store.can(me, 'points.approve');
    const pending = S().pointLog.filter((p) => p.status === 'pending');
    return title('النقاط', 'كل نشاط معتمد يحصل على نقاط — ولا تضاف النقاط إلا بعد المراجعة والاعتماد') + `
      <div class="kpis"><div class="kpi"><span>الرصيد الإجمالي</span><b class="gold">${fmt(me.points)}</b><small>نقطة</small></div>
      <div class="kpi"><span>عمليات معتمدة</span><b>${mine.filter((p) => p.status === 'approved').length}</b></div>
      <div class="kpi"><span>قيد المراجعة</span><b>${mine.filter((p) => p.status === 'pending').length}</b></div></div>
      <div class="card" style="margin-bottom:22px"><h3>محرك النقاط</h3><div class="flow">${['نشاط','اقتراح النقاط','مراجعة المسؤول','اعتماد','إضافة إلى رصيد العضو','تسجيل العملية في السجل'].map((x) => `<span>${x}</span>`).join('')}</div></div>
      ${canApprove ? `<div class="card" style="margin-bottom:22px"><h3>طلبات بانتظار الاعتماد (${pending.length})</h3>${pending.length ? `<div class="table-wrap"><table><thead><tr><th>العضو</th><th>النشاط</th><th>النقاط</th><th>اقترحها</th><th>ملاحظة</th><th></th></tr></thead><tbody>
        ${pending.map((p) => { const self = p.by === me.id || p.user === me.id; return `<tr><td>${esc(Store.userName(p.user))}</td><td>${esc(Store.activity(p.activity).name)}</td><td><b>+${p.points}</b></td><td>${esc(Store.userName(p.by))}</td><td>${esc(p.note)}</td><td>${self ? '<small class="muted">لا يمكنك اعتماد اقتراحك أو نقاطك</small>' : `<button class="btn btn-green btn-sm" data-approve="${p.id}">اعتماد</button> <button class="btn btn-ghost btn-sm" data-reject="${p.id}">رفض</button>`}</td></tr>`; }).join('')}
      </tbody></table></div>` : '<p class="muted">لا توجد طلبات.</p>'}</div>` : ''}
      ${canPropose ? `<form class="card form" id="propose-form" style="margin-bottom:22px"><h3>اقتراح نقاط</h3><div class="form-row">
        <label class="f">العضو<select name="user" required>${opt(S().users.filter((u) => u.id !== me.id).map((u) => [u.id, u.name]), '', 'اختر')}</select></label>
        <label class="f">النشاط<select name="activity" required>${opt(S().activities.map((a) => [a.id, `${a.name} (${a.points})`]), '')}</select></label>
        <label class="f">نقاط مخصصة (اختياري)<input name="custom" type="number" min="1" max="500"></label>
        <label class="f">ملاحظة<input name="note" maxlength="140"></label></div>
        <button class="btn btn-gold">إرسال للمراجعة</button></form>` : ''}
      <div class="card"><h3>سجل نقاطي</h3><div class="table-wrap"><table><thead><tr><th>التاريخ</th><th>النشاط</th><th>النقاط</th><th>الحالة</th><th>ملاحظة</th></tr></thead><tbody>
        ${mine.map((p) => `<tr><td>${fmtDate(p.date)}</td><td>${esc(Store.activity(p.activity).name)}</td><td><b>+${p.points}</b></td><td>${badge(p.status)}</td><td>${esc(p.note)}</td></tr>`).join('') || '<tr><td colspan="5" class="muted">لا توجد عمليات.</td></tr>'}
      </tbody></table></div></div>`;
  }
  function mountPoints(me, root, rerender) {
    const f = root.querySelector('#propose-form');
    if (f) f.addEventListener('submit', (e) => {
      e.preventDefault();
      Store.proposePoints(me, f.user.value, f.activity.value, f.note.value, f.custom.value);
      toast('✓ تم إرسال الاقتراح للمراجعة');
      rerender();
    });
    root.querySelectorAll('[data-approve],[data-reject]').forEach((b) => b.addEventListener('click', () => {
      const r = Store.reviewPoints(me, b.dataset.approve || b.dataset.reject, !!b.dataset.approve);
      toast(r === 'ok' ? '✓ تم تحديث الطلب وتسجيله في سجل التدقيق' : 'تعذر تنفيذ العملية');
      rerender();
    }));
  }

  /* ---------- Promotion (sections 15–16) ---------- */
  function requirementsFor(u) {
    const lv = Store.levelOf(u.points), r = S().promotionRules;
    const hasCourse = S().courses.some((c) => c.enrolled.includes(u.id)) || S().certificates.some((c) => c.user === u.id);
    return {
      lv,
      items: [
        ['النقاط المطلوبة' + (lv.next ? ` (${fmt(lv.next.min)})` : ''), !!lv.next && u.points >= lv.next.min],
        [`الحد الأدنى للنشاط (${r.minActivity}%)`, u.activity >= r.minActivity],
        [`الالتزام (${r.minCommitment}%)`, u.commitment >= r.minCommitment],
        ['دورة مطلوبة', !r.requireCourse || hasCourse],
        ['تقييم المسؤول', !r.requireEvaluation || !!u.evaluated],
      ],
    };
  }
  function promotion(me) {
    const { lv, items } = requirementsFor(me);
    const canApprove = Store.can(me, 'promotion.approve');
    const eligible = S().users.filter((u) => u.id !== me.id).map((u) => ({ u, req: requirementsFor(u) })).filter((x) => x.req.lv.next && x.req.items.slice(0, 3).every((i) => i[1]));
    return title('الترقية', 'الترقية لا تعتمد على النقاط وحدها: النقاط · النشاط · الالتزام · الكفاءة والمسؤولية') + `
      <div class="grid g2">
        <div class="card"><h3>لوحة الترقية</h3>
          <div class="kpis" style="grid-template-columns:repeat(2,1fr)"><div class="kpi"><span>المستوى الحالي</span><b style="font-size:1.2rem">${esc(lv.current.name)}</b></div><div class="kpi"><span>المستوى التالي</span><b style="font-size:1.2rem">${esc(lv.next ? lv.next.name : '—')}</b></div>
          <div class="kpi"><span>النقاط</span><b>${fmt(me.points)}</b></div><div class="kpi"><span>المتبقي للترقية</span><b class="gold">${lv.next ? fmt(Math.max(0, lv.next.min - me.points)) : '—'}</b></div></div>
          <h4>المتطلبات</h4><ul class="checklist">${items.map(([l, ok]) => `<li><span class="${ok ? 'yes' : 'no'}">${ok ? '✓' : '⬜'}</span>${esc(l)}</li>`).join('')}</ul></div>
        <div class="card"><h3>سلم المستويات</h3>${S().levels.map((l) => `<div class="list-row"><span class="pill ${l.id === lv.current.id ? 'gold' : ''}">${esc(l.name)}</span><span class="muted" style="margin-inline-start:auto">${fmt(l.min)}+ نقطة</span></div>`).join('')}<small class="muted">مع إمكانية اعتماد المسميات النهائية من الجمع العام.</small></div>
      </div>
      ${canApprove ? `<div class="card" style="margin-top:22px"><h3>أعضاء مؤهلون للمراجعة</h3>${eligible.length ? `<div class="table-wrap"><table><thead><tr><th>العضو</th><th>الحالي</th><th>المقترح</th><th>النقاط</th><th>النشاط</th><th>الدورة/التقييم</th><th></th></tr></thead><tbody>
        ${eligible.map(({ u, req }) => `<tr><td>${esc(u.name)}</td><td>${esc(req.lv.current.name)}</td><td><b>${esc(req.lv.next.name)}</b></td><td>${fmt(u.points)}</td><td>${u.activity}%</td><td>${req.items[3][1] ? '✓' : '⬜'} / ${req.items[4][1] ? '✓' : `<button class="btn btn-ghost btn-sm" data-eval="${u.id}">تقييم ✓</button>`}</td><td><button class="btn btn-green btn-sm" data-promote="${u.id}" ${req.items.every((i) => i[1]) ? '' : 'disabled title="المتطلبات غير مكتملة"'}>اعتماد الترقية</button></td></tr>`).join('')}
      </tbody></table></div>` : '<p class="muted">لا يوجد أعضاء مؤهلون حاليًا.</p>'}</div>` : ''}`;
  }
  function mountPromotion(me, root, rerender) {
    root.querySelectorAll('[data-eval]').forEach((b) => b.addEventListener('click', () => {
      const u = Store.user(b.dataset.eval); u.evaluated = true; Store.log(me.id, 'تقييم المسؤول', u.name); rerender();
    }));
    root.querySelectorAll('[data-promote]').forEach((b) => b.addEventListener('click', () => {
      const u = Store.user(b.dataset.promote);
      const next = Store.levelOf(u.points).next;
      Store.promote(me, u.id, next.name);
      toast('✓ تم اعتماد الترقية وإشعار العضو');
      rerender();
    }));
  }

  /* ---------- Tasks (section 10) ---------- */
  const COLS = [['new', 'جديدة'], ['in_progress', 'قيد التنفيذ'], ['review', 'بانتظار المراجعة'], ['done', 'مكتملة'], ['late', 'متأخرة']];
  let taskScope = 'mine';
  function tasks(me) {
    const all = Store.can(me, 'tasks.manage_all');
    const visible = S().tasks.filter((t) => {
      if (taskScope === 'mine') return t.assignee === me.id || t.owner === me.id;
      if (taskScope === 'team') return t.team && t.team === me.team;
      if (taskScope === 'committee') return t.committee === me.committee;
      return all;
    });
    return title('المهام', 'جديدة ← قيد التنفيذ ← بانتظار المراجعة ← مكتملة (أو متأخرة)') + `
      <div class="toolbar"><div class="tabs" style="margin:0">${[['mine', 'مهامي'], ['team', 'فريقي'], ['committee', 'لجنتي']].concat(all ? [['all', 'الكل']] : []).map(([k, l]) => `<button data-scope="${k}" class="${taskScope === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      ${Store.can(me, 'tasks.create') ? '<button class="btn btn-gold btn-sm" id="new-task" style="margin-inline-start:auto">+ مهمة جديدة</button>' : ''}</div>
      <div class="kanban">${COLS.map(([k, l]) => { const list = visible.filter((t) => Store.taskStatus(t) === k); return `<div class="kcol"><h4><span>${badge(k, l)}</span><span class="muted">${list.length}</span></h4>
        ${list.map((t) => { const c = Store.committee(t.committee); const canMove = t.assignee === me.id || t.owner === me.id || all; return `<div class="kcard"><b>${esc(t.title)}</b>${t.desc ? `<div class="muted" style="font-size:.82rem">${esc(t.desc)}</div>` : ''}
          <div class="row"><span>👤 ${esc(Store.userName(t.assignee))}</span><span>📅 ${fmtDate(t.due)}</span></div><div class="row"><span>${esc(c ? c.name : '')}</span><span class="pill ${t.priority === 'عالية' ? 'gold' : ''}">${esc(t.priority)}</span></div>
          ${canMove ? `<select data-move="${t.id}" aria-label="تغيير الحالة">${opt(COLS.filter((x) => x[0] !== 'late').map((x) => [x[0], x[1]]), t.status)}</select>` : ''}</div>`; }).join('')}</div>`; }).join('')}</div>`;
  }
  function mountTasks(me, root, rerender) {
    root.querySelectorAll('[data-scope]').forEach((b) => b.addEventListener('click', () => { taskScope = b.dataset.scope; rerender(); }));
    root.querySelectorAll('[data-move]').forEach((s) => s.addEventListener('change', () => {
      const t = S().tasks.find((x) => x.id === s.dataset.move);
      if (s.value === 'done' && t.owner !== me.id && !Store.can(me, 'tasks.manage_all')) { toast('يتم الإكمال بعد مراجعة المسؤول — تم نقلها إلى «بانتظار المراجعة»'); Store.moveTask(me, t.id, 'review'); }
      else Store.moveTask(me, t.id, s.value);
      rerender();
    }));
    const nb = root.querySelector('#new-task');
    if (nb) nb.addEventListener('click', () => modal(`<h3>مهمة جديدة</h3><form class="form" id="task-form">
      <label class="f"><span class="req">العنوان</span><input name="title" required maxlength="120"></label><label class="f">الوصف<textarea name="desc"></textarea></label>
      <div class="form-row"><label class="f">اللجنة<select name="committee">${comOpts(me.committee)}</select></label><label class="f">الفريق<select name="team">${teamOpts(me.team, '—')}</select></label>
      <label class="f"><span class="req">المكلف</span><select name="assignee" required>${userOpts('', 'اختر')}</select></label><label class="f">الأولوية<select name="priority">${opt([['عالية', 'عالية'], ['متوسطة', 'متوسطة'], ['منخفضة', 'منخفضة']], 'متوسطة')}</select></label>
      <label class="f">تاريخ البداية<input type="date" name="start" value="${Store.today()}"></label><label class="f"><span class="req">تاريخ التسليم</span><input type="date" name="due" required></label></div>
      <label class="f">الملفات<input type="file" name="files" multiple></label>
      <div style="display:flex;gap:10px"><button class="btn btn-green">حفظ</button><button type="button" class="btn btn-ghost" data-close>إلغاء</button></div></form>`, (m, close) => {
      m.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target).entries()); delete d.files;
        d.team = d.team || null;
        Store.saveTask(me, d); close(); toast('✓ تمت إضافة المهمة وإشعار المكلف'); rerender();
      });
    }));
  }

  /* ---------- Teams & committees (sections 8–9) ---------- */
  function teams(me) {
    const manage = Store.can(me, 'teams.manage');
    return title('الفرق', 'يستطيع المدير إنشاء عدد غير محدود من الفرق') + (manage ? '<div class="toolbar"><button class="btn btn-gold btn-sm" id="new-team">+ فريق جديد</button></div>' : '') + `<div class="grid g2">
      ${S().teams.map((t) => { const m = S().users.filter((u) => u.team === t.id); const tk = S().tasks.filter((k) => k.team === t.id); return `<div class="card"><h3>${esc(t.name)}</h3>
        <p>رئيس الفريق: <b>${esc(Store.userName(t.leader))}</b></p><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"><span class="pill">الأعضاء: ${m.length}</span><span class="pill">المهام: ${tk.length}</span><span class="pill">المكتملة: ${tk.filter((k) => k.status === 'done').length}</span><span class="pill gold">النقاط: ${fmt(m.reduce((a, u) => a + u.points, 0))}</span></div>
        ${m.map((u) => `<div class="list-row">${avatar(u.name, true)}<a href="#/dashboard/profile/${u.id}" style="flex:1">${esc(u.name)}</a><small class="muted">${u.activity}% نشاط</small></div>`).join('')}</div>`; }).join('')}</div>`;
  }
  function mountTeams(me, root, rerender) {
    const b = root.querySelector('#new-team');
    if (b) b.addEventListener('click', () => modal(`<h3>فريق جديد</h3><form class="form"><label class="f"><span class="req">اسم الفريق</span><input name="name" required placeholder="الفريق 04"></label><label class="f">رئيس الفريق<select name="leader">${userOpts('', '—')}</select></label><button class="btn btn-green">إنشاء</button></form>`, (m, close) => {
      m.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); S().teams.push({ id: Store.uid('t'), name: e.target.name.value, leader: e.target.leader.value || null }); Store.log(me.id, 'إنشاء فريق', e.target.name.value); close(); rerender(); });
    }));
  }
  function committees(me) {
    return title('اللجان', 'لكل لجنة ملف مستقل وحقيبة محددة') + `<div class="grid g2">
      ${S().committees.map((c) => { const m = S().users.filter((u) => u.committee === c.id); const tk = S().tasks.filter((k) => k.committee === c.id); return `<div class="card"><h3>${c.icon} ${esc(c.name)}</h3><div>${c.portfolio.map((p) => `<span class="pill">${esc(p)}</span>`).join('')}</div>
        <p class="muted" style="margin:10px 0 4px">الأعضاء (${m.length}) · المهام (${tk.length}) · التقارير (${S().reports.filter((r) => r.committee === c.id).length})</p>${m.map((u) => `<span class="pill gold">${esc(u.name)}</span>`).join('')}</div>`; }).join('')}</div>`;
  }

  function projects() {
    return title('المشاريع', 'متابعة نسب الإنجاز') + `<div class="grid g2">${S().projects.map((p) => `<div class="card"><h3>${esc(p.name)}</h3><p class="muted">${esc(p.desc)}</p>
      <p style="margin:0">المسؤول: <b>${esc(Store.committee(p.committee).name)}</b> · القائد: ${esc(Store.userName(p.lead))}</p><p style="margin:4px 0">المشاركون: ${p.participants.map((x) => esc(Store.userName(x))).join('، ')}</p>
      <div style="display:flex;justify-content:space-between"><span>نسبة الإنجاز</span><b>${p.progress}%</b></div><div class="progress gold"><i style="width:${p.progress}%"></i></div>
      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap"><span class="pill">المهام: ${p.tasks}</span><span class="pill">المكتملة: ${p.done}</span><span class="pill">المتبقية: ${p.tasks - p.done}</span></div></div>`).join('')}</div>`;
  }

  /* ---------- Meetings, minutes, attendance (sections 22–24) ---------- */
  function meetings(me) {
    const list = S().meetings.slice().sort((a, b) => b.date.localeCompare(a.date));
    return title('الاجتماعات', 'إدارة · فريق · لجنة · عام · تكويني') + (Store.can(me, 'meetings.create') ? '<div class="toolbar"><button class="btn btn-gold btn-sm" id="new-meeting">+ اجتماع جديد</button></div>' : '') +
      `<div class="grid">${list.map((m) => `<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h3 style="margin:0">${esc(m.title)}</h3><span class="pill gold">${esc(m.type)}</span></div>
      <p class="muted" style="margin:4px 0 10px">📅 ${fmtDate(m.date)} · 🕗 ${esc(m.time)} · ${esc(Store.committee(m.committee) ? Store.committee(m.committee).name : '')}</p>
      <div class="grid g3" style="gap:14px"><div><b>جدول الأعمال</b><ul>${m.agenda.map((x) => `<li>${esc(x)}</li>`).join('') || '<li>—</li>'}</ul></div><div><b>القرارات</b><ul>${m.decisions.map((x) => `<li>${esc(x)}</li>`).join('') || '<li>—</li>'}</ul></div><div><b>المهام الناتجة</b><ul>${m.tasks.map((x) => `<li>${esc(x)}</li>`).join('') || '<li>—</li>'}</ul></div></div>
      <b>الحضور</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">${m.participants.map((p) => { const st = m.attendance[p]; const can = Store.can(me, 'meetings.create'); return `<button class="btn btn-sm ${st === true ? 'btn-green' : 'btn-ghost'}" ${can ? `data-att="${m.id}|${p}"` : 'disabled'}>${st === true ? '✓' : st === false ? '✕' : '○'} ${esc(Store.userName(p))}</button>`; }).join('')}</div>
      <div style="margin-top:12px"><button class="btn btn-ghost btn-sm" data-minutes="${m.id}">📄 عرض المحضر</button></div></div>`).join('')}</div>`;
  }
  function mountMeetings(me, root, rerender) {
    root.querySelectorAll('[data-att]').forEach((b) => b.addEventListener('click', () => {
      const [mid, uid] = b.dataset.att.split('|');
      const m = S().meetings.find((x) => x.id === mid);
      const was = m.attendance[uid];
      m.attendance[uid] = was === true ? false : true;
      if (m.attendance[uid] === true && !was && uid !== me.id) Store.proposePoints(me, uid, 'meeting', 'حضور: ' + m.title);
      else Store.save();
      rerender();
    }));
    root.querySelectorAll('[data-minutes]').forEach((b) => b.addEventListener('click', () => {
      const m = S().meetings.find((x) => x.id === b.dataset.minutes);
      const present = m.participants.filter((p) => m.attendance[p] === true).map((p) => Store.userName(p));
      modal(`<h3>محضر ${esc(m.title)}</h3><p><b>التاريخ:</b> ${fmtDate(m.date)} — ${esc(m.time)}</p><p><b>الحضور:</b> ${esc(present.join('، ') || 'لم يسجل بعد')}</p>
        <p><b>جدول الأعمال:</b></p><ol>${m.agenda.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><p><b>القرارات:</b></p><ol>${m.decisions.map((x) => `<li>${esc(x)}</li>`).join('') || '<li>—</li>'}</ol>
        <p><b>المهام:</b></p><ol>${m.tasks.map((x) => `<li>${esc(x)}</li>`).join('') || '<li>—</li>'}</ol><button class="btn btn-ghost" data-close>إغلاق</button>`);
    }));
    const nb = root.querySelector('#new-meeting');
    if (nb) nb.addEventListener('click', () => modal(`<h3>اجتماع جديد</h3><form class="form">
      <label class="f"><span class="req">العنوان</span><input name="title" required></label>
      <div class="form-row"><label class="f">النوع<select name="type">${opt(['اجتماع الإدارة', 'اجتماع فريق', 'اجتماع لجنة', 'اجتماع عام', 'اجتماع تكويني'].map((x) => [x, x]), 'اجتماع لجنة')}</select></label><label class="f">اللجنة<select name="committee">${comOpts(me.committee)}</select></label>
      <label class="f"><span class="req">التاريخ</span><input type="date" name="date" required></label><label class="f"><span class="req">الوقت</span><input type="time" name="time" required></label></div>
      <label class="f">المشاركون<select name="participants" multiple size="6">${userOpts()}</select></label>
      <label class="f">جدول الأعمال (سطر لكل نقطة)<textarea name="agenda"></textarea></label><label class="f">القرارات<textarea name="decisions"></textarea></label><label class="f">المهام الناتجة<textarea name="tasks"></textarea></label>
      <button class="btn btn-green">حفظ</button></form>`, (m, close) => {
      m.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault(); const f = e.target; const lines = (v) => v.split('\n').map((x) => x.trim()).filter(Boolean);
        const participants = [...f.participants.selectedOptions].map((o) => o.value);
        S().meetings.push({ id: Store.uid('m'), title: f.title.value, type: f.type.value, committee: f.committee.value, date: f.date.value, time: f.time.value, participants, agenda: lines(f.agenda.value), decisions: lines(f.decisions.value), tasks: lines(f.tasks.value), attendance: {} });
        participants.forEach((p) => Store.notify(p, `لديك اجتماع: ${f.title.value} (${fmtDate(f.date.value)})`));
        Store.log(me.id, 'إنشاء اجتماع', f.title.value); close(); rerender();
      });
    }));
  }

  /* ---------- Training & certificates (sections 19–20) ---------- */
  function training(me) {
    return title('التكوين', 'الدورات · الورشات · المحاضرات · الاختبارات') + `<div class="grid g2">${S().courses.map((c) => { const on = c.enrolled.includes(me.id); return `<div class="card"><span class="pill gold">${esc(c.type)}</span><h3 style="margin-top:8px">${esc(c.title)}</h3><p class="muted">⏱ ${c.hours} ساعة · 📍 ${esc(c.mode)} · ${esc(c.level)} · 👥 ${c.enrolled.length}</p>
      <button class="btn btn-sm ${on ? 'btn-ghost' : 'btn-green'}" data-enroll="${c.id}">${on ? '✓ مسجل — إلغاء' : 'التسجيل'}</button></div>`; }).join('')}</div>`;
  }
  function mountTraining(me, root, rerender) {
    root.querySelectorAll('[data-enroll]').forEach((b) => b.addEventListener('click', () => {
      const c = S().courses.find((x) => x.id === b.dataset.enroll);
      const i = c.enrolled.indexOf(me.id);
      if (i >= 0) c.enrolled.splice(i, 1); else { c.enrolled.push(me.id); Store.notify(me.id, 'تم تسجيلك في: ' + c.title); }
      Store.save(); rerender();
    }));
  }
  function certificates(me) {
    const mine = S().certificates.filter((c) => c.user === me.id);
    const canIssue = Store.can(me, 'users.manage');
    return title('الشهادات', 'شهادات إلكترونية برقم فريد ورمز QR') + (canIssue ? '<div class="toolbar"><button class="btn btn-gold btn-sm" id="issue-cert">+ إصدار شهادة</button></div>' : '') +
      (mine.length ? mine.map((c) => `<div style="margin-bottom:22px">${PublicPages.certificateView(c)}</div>`).join('') : '<div class="card"><p class="muted" style="margin:0">لا توجد شهادات بعد. أتمم برنامجًا معتمدًا للحصول على شهادتك.</p></div>') +
      (canIssue ? `<div class="card" style="margin-top:22px"><h3>كل الشهادات الصادرة</h3><div class="table-wrap"><table><thead><tr><th>الرقم</th><th>الاسم</th><th>البرنامج</th><th>التاريخ</th></tr></thead><tbody>${S().certificates.map((c) => `<tr><td dir="ltr"><a href="#/certificates/${esc(c.id)}">${esc(c.id)}</a></td><td>${esc(c.name)}</td><td>${esc(c.program)}</td><td>${fmtDate(c.date)}</td></tr>`).join('')}</tbody></table></div></div>` : '');
  }
  function mountCertificates(me, root, rerender) {
    const b = root.querySelector('#issue-cert');
    if (b) b.addEventListener('click', () => modal(`<h3>إصدار شهادة</h3><form class="form"><label class="f">المتدرب<select name="user" required>${userOpts('', 'اختر')}</select></label><label class="f">البرنامج<select name="program">${opt(S().courses.map((c) => [c.title, c.title]))}</select></label><button class="btn btn-green">إصدار</button></form>`, (m, close) => {
      m.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault(); const u = Store.user(e.target.user.value);
        const n = S().certificates.length + 1; const id = `IAC-${Store.today().slice(0, 4)}-${String(n).padStart(4, '0')}`;
        S().certificates.push({ id, user: u.id, name: u.name, program: e.target.program.value, date: Store.today() });
        Store.notify(u.id, 'صدرت شهادتك: ' + e.target.program.value); Store.log(me.id, 'إصدار شهادة', `${u.name} — ${id}`); close(); rerender();
      });
    }));
  }

  function live() {
    return title('البثوث — TikTok Live', 'جدول دوري بتدوير الكوتشز') + `<div class="table-wrap"><table><thead><tr><th>الحلقة</th><th>الموضوع</th><th>التاريخ</th><th>الكوتش</th><th>الحالة</th></tr></thead><tbody>
      ${S().lives.map((l) => `<tr><td>#${l.episode}</td><td>${esc(l.topic)}</td><td>${fmtDate(l.date)}</td><td>${esc(Store.userName(l.coach))}</td><td>${esc(l.prep)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  /* ---------- Reports (section 25) ---------- */
  function reports(me) {
    const canSubmit = Store.can(me, 'meetings.create');
    const canView = Store.can(me, 'reports.view');
    const list = canView ? S().reports : S().reports.filter((r) => r.committee === me.committee);
    return title('التقارير', 'تقارير دورية من اللجان تظهر في لوحة التقرير العام') + (canSubmit ? `<form class="card form" id="report-form" style="margin-bottom:22px"><h3>رفع تقرير دوري</h3><div class="form-row">
      <label class="f">اللجنة<select name="committee">${comOpts(me.committee)}</select></label><label class="f">الفترة<input name="period" required placeholder="أكتوبر 2026"></label></div>
      <div class="form-row"><label class="f">الإنجازات<textarea name="achievements" required></textarea></label><label class="f">الصعوبات<textarea name="difficulties"></textarea></label></div>
      <label class="f">الاقتراحات<textarea name="suggestions"></textarea></label><button class="btn btn-green">رفع التقرير</button></form>` : '') +
      `<div class="grid g2">${list.map((r) => `<div class="card"><h3>${esc(Store.committee(r.committee).name)} — ${esc(r.period)}</h3><p class="muted" style="margin-top:0">${esc(Store.userName(r.by))} · ${fmtDate(r.date)}</p><p><b>الإنجازات:</b> ${esc(r.achievements)}</p><p><b>الصعوبات:</b> ${esc(r.difficulties || '—')}</p><p style="margin:0"><b>الاقتراحات:</b> ${esc(r.suggestions || '—')}</p></div>`).join('') || '<p class="muted">لا توجد تقارير.</p>'}</div>`;
  }
  function mountReports(me, root, rerender) {
    const f = root.querySelector('#report-form');
    if (f) f.addEventListener('submit', (e) => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(f).entries());
      S().reports.unshift(Object.assign({ id: Store.uid('rep'), by: me.id, date: Store.today() }, d)); Store.log(me.id, 'رفع تقرير', d.period); toast('✓ تم رفع التقرير'); rerender();
    });
  }

  function announcements(me) {
    return title('الإعلانات', '') + (Store.can(me, 'announce.create') ? `<form class="card form" id="ann-form" style="margin-bottom:22px"><label class="f">إعلان جديد<textarea name="text" required maxlength="500"></textarea></label><button class="btn btn-green">نشر للجميع</button></form>` : '') +
      `<div class="card">${S().announcements.map((a) => `<div class="list-row">${avatar(Store.userName(a.by), true)}<div style="flex:1"><b>${esc(Store.userName(a.by))}</b> <small class="muted">${fmtDate(a.date)}</small><div>${esc(a.text)}</div></div></div>`).join('')}</div>`;
  }
  function mountAnnouncements(me, root, rerender) {
    const f = root.querySelector('#ann-form');
    if (f) f.addEventListener('submit', (e) => {
      e.preventDefault(); const text = f.text.value.trim(); if (!text) return;
      S().announcements.unshift({ id: Store.uid('a'), date: Store.today(), by: me.id, text });
      S().users.forEach((u) => { if (u.id !== me.id) S().notifications.unshift({ id: Store.uid('nt'), user: u.id, at: Store.now(), text: 'إعلان جديد من الإدارة', read: false }); });
      Store.log(me.id, 'نشر إعلان', text.slice(0, 40)); rerender();
    });
  }

  function notifications(me) {
    const list = S().notifications.filter((n) => n.user === me.id);
    list.forEach((n) => { n.read = true; });
    Store.save();
    return title('الإشعارات', '') + `<div class="card">${list.map((n) => `<div class="list-row"><span>🔔</span><span style="flex:1">${esc(n.text)}</span><small class="muted">${esc(n.at)}</small></div>`).join('') || '<p class="muted">لا توجد إشعارات.</p>'}</div>`;
  }

  /* ---------- Join requests (section 6) ---------- */
  let reqFilter = 'pending';
  function requests(me) {
    if (!Store.can(me, 'requests.manage')) return denied();
    const list = S().requests.filter((r) => reqFilter === 'all' || r.status === reqFilter);
    const count = (s) => S().requests.filter((r) => r.status === s).length;
    return title('إدارة طلبات الانضمام', '🟡 قيد الدراسة · 🟢 مقبول · 🔵 يحتاج معلومات إضافية · 🔴 مرفوض') + `
      <div class="tabs">${[['pending', 'قيد الدراسة'], ['info', 'معلومات إضافية'], ['accepted', 'مقبول'], ['rejected', 'مرفوض'], ['all', 'الكل']].map(([k, l]) => `<button data-rf="${k}" class="${reqFilter === k ? 'on' : ''}">${l} (${k === 'all' ? S().requests.length : count(k)})</button>`).join('')}</div>
      <div class="grid g2">${list.map((r) => `<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h3 style="margin:0">${esc(r.name)}</h3>${badge(r.status)}</div>
        <p class="muted" style="margin:4px 0 10px"><span class="pill gold">${esc(r.type)}</span> ${fmtDate(r.date)} · ${esc(r.city || '')} ${esc(r.country || '')}</p>
        <p style="margin:0;font-size:.93rem">📧 <span dir="ltr">${esc(r.email)}</span> · 📞 <span dir="ltr">${esc(r.phone)}</span></p>
        <p style="margin:6px 0;font-size:.93rem"><b>التخصص:</b> ${esc(r.specialty || '—')} · <b>الخبرة:</b> ${esc(r.experience || '—')}</p>
        <p style="margin:6px 0;font-size:.93rem"><b>سبب الانضمام:</b> ${esc(r.reason)}</p>
        ${r.status !== 'accepted' ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button class="btn btn-green btn-sm" data-accept="${r.id}">🟢 قبول</button><button class="btn btn-ghost btn-sm" data-rs="${r.id}|info">🔵 معلومات إضافية</button><button class="btn btn-ghost btn-sm" data-rs="${r.id}|rejected">🔴 رفض</button></div>` : `<p class="muted" style="margin:8px 0 0">تم إنشاء الحساب وتعيين العضو.</p>`}</div>`).join('') || '<p class="muted">لا توجد طلبات.</p>'}</div>`;
  }
  function mountRequests(me, root, rerender) {
    root.querySelectorAll('[data-rf]').forEach((b) => b.addEventListener('click', () => { reqFilter = b.dataset.rf; rerender(); }));
    root.querySelectorAll('[data-rs]').forEach((b) => b.addEventListener('click', () => { const [id, s] = b.dataset.rs.split('|'); Store.setRequestStatus(me, id, s, {}); rerender(); }));
    root.querySelectorAll('[data-accept]').forEach((b) => b.addEventListener('click', () => modal(`<h3>قبول الطلب</h3><p class="muted">ينشأ حساب المستخدم وتحدد فئته ويعيّن لفريق ولجنة ويبدأ سجل نشاطه.</p><form class="form">
      <label class="f">الفريق<select name="team">${teamOpts('', '—')}</select></label><label class="f">اللجنة<select name="committee">${comOpts('', '—')}</select></label><button class="btn btn-green">تأكيد القبول</button></form>`, (m, close) => {
      m.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); Store.setRequestStatus(me, b.dataset.accept, 'accepted', { team: e.target.team.value, committee: e.target.committee.value }); close(); toast('✓ تم قبول العضو وإنشاء حسابه'); rerender(); });
    })));
  }

  /* ---------- Members (HR panel, section 29) ---------- */
  let memberQ = '';
  function members(me) {
    if (!Store.can(me, 'users.manage')) return denied();
    const q = memberQ.trim();
    const list = S().users.filter((u) => !q || u.name.includes(q) || u.email.includes(q));
    return title('الأعضاء والكوتشز', 'إدارة الصفات والفرق واللجان والصلاحيات') + `<div class="toolbar"><input id="member-q" placeholder="بحث بالاسم أو البريد" value="${esc(memberQ)}"></div>
      <div class="table-wrap"><table><thead><tr><th>العضو</th><th>الصلاحية</th><th>الفريق</th><th>اللجنة</th><th>النقاط</th><th>النشاط</th><th>المساهمة</th><th></th></tr></thead><tbody>
      ${list.map((u) => `<tr><td><a href="#/dashboard/profile/${u.id}"><b>${esc(u.name)}</b></a><br><small class="muted">${esc(u.title)}</small></td><td>${esc(S().roles[u.role].label.split(' — ')[1] || u.role)}</td><td>${esc(Store.team(u.team) ? Store.team(u.team).name.split('—')[0] : '—')}</td><td>${esc(Store.committee(u.committee) ? Store.committee(u.committee).name : '—')}</td><td>${fmt(u.points)}</td><td>${u.activity}%</td><td>${Store.contributionIndex(u)}</td><td><button class="btn btn-ghost btn-sm" data-edit="${u.id}">تعديل</button></td></tr>`).join('')}
      </tbody></table></div>`;
  }
  function mountMembers(me, root, rerender) {
    const q = root.querySelector('#member-q');
    if (q) q.addEventListener('change', () => { memberQ = q.value; rerender(); });
    root.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => {
      const u = Store.user(b.dataset.edit);
      const roles = Object.entries(S().roles).filter(([k]) => k !== 'super_admin' || me.role === 'super_admin').map(([k, r]) => [k, r.label]);
      modal(`<h3>تعديل: ${esc(u.name)}</h3><form class="form"><label class="f">الصفة<input name="title" value="${esc(u.title)}"></label>
        <label class="f">الصلاحية (RBAC)<select name="role" ${u.id === me.id ? 'disabled' : ''}>${opt(roles, u.role)}</select></label>
        <div class="form-row"><label class="f">الفريق<select name="team">${teamOpts(u.team, '—')}</select></label><label class="f">اللجنة<select name="committee">${comOpts(u.committee, '—')}</select></label>
        <label class="f">النشاط %<input name="activity" type="number" min="0" max="100" value="${u.activity}"></label><label class="f">الالتزام %<input name="commitment" type="number" min="0" max="100" value="${u.commitment}"></label></div>
        <small class="muted">النقاط لا تعدّل مباشرة — تمر عبر محرك النقاط.</small><button class="btn btn-green">حفظ</button></form>`, (m, close) => {
        m.querySelector('form').addEventListener('submit', (e) => {
          e.preventDefault(); const f = e.target;
          if (u.id !== me.id && S().roles[f.role.value]) u.role = f.role.value;
          u.title = f.title.value; u.team = f.team.value || null; u.committee = f.committee.value || null;
          u.activity = Math.max(0, Math.min(100, +f.activity.value)); u.commitment = Math.max(0, Math.min(100, +f.commitment.value));
          Store.log(me.id, 'تعديل ملف عضو', u.name); close(); rerender();
        });
      });
    }));
  }

  /* ---------- Command Center (section 27) ---------- */
  function command(me) {
    if (!Store.can(me, 'audit.view') && !Store.can(me, 'reports.view')) return denied();
    const s = S();
    const approved = s.pointLog.filter((p) => p.status === 'approved').reduce((a, p) => a + p.points, 0);
    const coaches = s.users.filter((u) => u.role === 'coach').length;
    const openTasks = s.tasks.filter((t) => t.status !== 'done').length;
    const late = s.tasks.filter((t) => Store.taskStatus(t) === 'late').length;
    const byCom = s.committees.map((c) => s.users.filter((u) => u.committee === c.id).reduce((a, u) => a + u.points, 0));
    const top = s.users.slice().sort((a, b) => Store.contributionIndex(b) - Store.contributionIndex(a)).slice(0, 5);
    return title('Academy Command Center', 'نظرة شاملة على الأكاديمية من لوحة واحدة') + `
      <div class="kpis">
        <div class="kpi"><span>الأعضاء</span><b>${s.users.length}</b></div><div class="kpi"><span>الكوتشز</span><b>${coaches}</b></div>
        <div class="kpi"><span>الفرق</span><b>${s.teams.length}</b></div><div class="kpi"><span>اللجان</span><b>${s.committees.length}</b></div>
        <div class="kpi"><span>المشاريع</span><b>${s.projects.length}</b></div><div class="kpi"><span>المهام المفتوحة</span><b>${openTasks}</b><small>${late} متأخرة</small></div>
        <div class="kpi"><span>النقاط المعتمدة</span><b>${fmt(approved)}</b></div><div class="kpi"><span>طلبات الانضمام</span><b>${s.requests.filter((r) => r.status === 'pending').length}</b><small>قيد الدراسة</small></div>
        <div class="kpi"><span>التكوين</span><b>${s.courses.length}</b><small>${s.courses.reduce((a, c) => a + c.enrolled.length, 0)} مسجل</small></div>
        <div class="kpi"><span>البثوث</span><b>${s.lives.length}</b></div>
      </div>
      <div class="grid g2">
        <div class="card"><h3>مجموع النقاط حسب اللجنة</h3>${hbars(s.committees.map((c) => c.name.replace(/^(لجنة|اللجنة)\s*/, '')), byCom, 'نقطة')}</div>
        <div class="card"><h3>نسبة إنجاز المشاريع</h3>${hbars(s.projects.map((p) => p.name.replace(/^(مشروع|برنامج)\s*/, '')), s.projects.map((p) => p.progress), '%')}</div>
        <div class="card"><h3>الأعلى في مؤشر المساهمة</h3>${top.map((u) => `<div class="list-row">${avatar(u.name, true)}<span style="flex:1">${esc(u.name)}</span><div class="progress" style="width:110px"><i style="width:${Store.contributionIndex(u)}%"></i></div><b style="width:32px;text-align:end">${Store.contributionIndex(u)}</b></div>`).join('')}</div>
        <div class="card"><h3>آخر العمليات</h3>${s.audit.slice(0, 6).map((a) => `<div class="list-row"><small class="muted">${esc(a.at)}</small><span style="flex:1"><b>${esc(Store.userName(a.by))}</b> — ${esc(a.action)}: ${esc(a.target)}</span></div>`).join('')}</div>
      </div>`;
  }

  function finance(me) {
    if (!Store.can(me, 'finance.view')) return denied();
    const f = S().finance;
    const inc = f.income.reduce((a, b) => a + b, 0), exp = f.expenses.reduce((a, b) => a + b, 0);
    return title('لوحة الإدارة المالية', '🔒 تعرض فقط للمخولين') + `<div class="kpis"><div class="kpi"><span>المداخيل (6 أشهر)</span><b>${fmt(inc)}</b><small>درهم</small></div><div class="kpi"><span>المصاريف</span><b>${fmt(exp)}</b><small>درهم</small></div>
      <div class="kpi"><span>الرصيد</span><b class="gold">${fmt(inc - exp)}</b></div><div class="kpi"><span>الاشتراكات</span><b>${f.subscriptions}</b></div><div class="kpi"><span>الميزانية السنوية</span><b>${fmt(f.budget)}</b></div></div>
      <div class="grid g2"><div class="card"><h3>المداخيل الشهرية (درهم)</h3>${bars(f.months, f.income, 'درهم')}</div><div class="card"><h3>المصاريف الشهرية (درهم)</h3>${bars(f.months, f.expenses, 'درهم')}</div></div>
      <div class="card" style="margin-top:22px"><h3>الجدول</h3><div class="table-wrap"><table><thead><tr><th>الشهر</th><th>المداخيل</th><th>المصاريف</th><th>الصافي</th></tr></thead><tbody>${f.months.map((m, i) => `<tr><td>${m}</td><td>${fmt(f.income[i])}</td><td>${fmt(f.expenses[i])}</td><td><b>${fmt(f.income[i] - f.expenses[i])}</b></td></tr>`).join('')}</tbody></table></div>
      <p class="muted" style="margin-bottom:0">المرحلة اللاحقة: ربط Stripe، الدورات المدفوعة، الفواتير والدفع الإلكتروني.</p></div>`;
  }

  function audit(me) {
    if (!Store.can(me, 'audit.view')) return denied();
    return title('سجل التدقيق', 'كل عملية إدارية تسجل: من قام بها، ماذا فعل، التاريخ، الوقت، العنصر المتأثر') + `<div class="table-wrap"><table><thead><tr><th>التاريخ والوقت</th><th>المستخدم</th><th>العملية</th><th>العنصر المتأثر</th></tr></thead><tbody>
      ${S().audit.map((a) => `<tr><td dir="ltr" style="text-align:end">${esc(a.at)}</td><td>${esc(Store.userName(a.by))}</td><td>${esc(a.action)}</td><td>${esc(a.target)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  /* ---------- Academy Settings (section 42) ---------- */
  function settings(me) {
    if (!Store.can(me, 'settings.manage')) {
      return title('الإعدادات', '') + `<div class="card"><h3>حسابي</h3><form class="form" id="pwd-form"><label class="f">كلمة مرور جديدة<input type="password" name="p" minlength="6" required dir="ltr"></label><button class="btn btn-green">تحديث</button></form></div>`;
    }
    const s = S();
    return title('Academy Settings', 'تعديل إعدادات الأكاديمية دون الحاجة إلى تعديل البرمجة') + `
      <form class="card form" id="set-acts" style="margin-bottom:22px"><h3>نقاط الأنشطة</h3><div class="form-row">${s.activities.map((a) => `<label class="f">${esc(a.name)}<input type="number" min="0" name="${a.id}" value="${a.points}"></label>`).join('')}</div><button class="btn btn-green">حفظ النقاط</button></form>
      <form class="card form" id="set-levels" style="margin-bottom:22px"><h3>أسماء الرتب وشروطها</h3>${s.levels.map((l) => `<div class="form-row"><label class="f">الرتبة<input name="n_${l.id}" value="${esc(l.name)}" required></label><label class="f">الحد الأدنى للنقاط<input type="number" min="0" name="m_${l.id}" value="${l.min}"></label></div>`).join('')}
        <div class="form-row"><label class="f">الحد الأدنى للنشاط %<input type="number" name="minActivity" value="${s.promotionRules.minActivity}"></label><label class="f">الحد الأدنى للالتزام %<input type="number" name="minCommitment" value="${s.promotionRules.minCommitment}"></label></div>
        <label><input type="checkbox" name="requireCourse" style="width:auto" ${s.promotionRules.requireCourse ? 'checked' : ''}> دورة مطلوبة للترقية</label><label><input type="checkbox" name="requireEvaluation" style="width:auto" ${s.promotionRules.requireEvaluation ? 'checked' : ''}> تقييم المسؤول مطلوب</label>
        <button class="btn btn-green">حفظ الرتب</button></form>
      <form class="card form" id="set-general" style="margin-bottom:22px"><h3>عام</h3><label class="f">شعار الأكاديمية<input name="slogan" value="${esc(s.academy.slogan)}"></label><label class="f">أنواع العضوية (مفصولة بفاصلة)<input name="types" value="${esc(s.membershipTypes.join('، '))}"></label>
        <div class="form-row"><label class="f">البريد<input name="email" value="${esc(s.academy.email)}" dir="ltr"></label><label class="f">الهاتف<input name="phone" value="${esc(s.academy.phone)}" dir="ltr"></label></div><button class="btn btn-green">حفظ</button></form>
      <div class="card"><h3>الصلاحيات (RBAC)</h3><div class="table-wrap"><table><thead><tr><th>الدور</th><th>الصلاحيات</th></tr></thead><tbody>${Object.values(s.roles).map((r) => `<tr><td>${esc(r.label)}</td><td style="white-space:normal">${r.perms.map((p) => `<span class="pill">${esc(p === '*' ? 'كل الصلاحيات' : p)}</span>`).join('') || '<span class="muted">قراءة فقط</span>'}</td></tr>`).join('')}</tbody></table></div>
      <p style="margin-top:18px"><button class="btn btn-danger btn-sm" id="reset-demo">إعادة تعيين بيانات العرض التجريبي</button></p></div>`;
  }
  function mountSettings(me, root, rerender) {
    const s = S(); const q = (id) => root.querySelector('#' + id);
    if (q('pwd-form')) q('pwd-form').addEventListener('submit', (e) => { e.preventDefault(); me.password = e.target.p.value; Store.log(me.id, 'تغيير كلمة المرور', me.name); toast('✓ تم التحديث'); });
    if (!q('set-acts')) return;
    q('set-acts').addEventListener('submit', (e) => { e.preventDefault(); s.activities.forEach((a) => { a.points = Math.max(0, +e.target[a.id].value); }); Store.log(me.id, 'تعديل نقاط الأنشطة', 'الإعدادات'); toast('✓ تم الحفظ'); });
    q('set-levels').addEventListener('submit', (e) => {
      e.preventDefault(); const f = e.target;
      s.levels.forEach((l) => { l.name = f['n_' + l.id].value.trim() || l.name; l.min = Math.max(0, +f['m_' + l.id].value); });
      s.levels.sort((a, b) => a.min - b.min);
      Object.assign(s.promotionRules, { minActivity: +f.minActivity.value, minCommitment: +f.minCommitment.value, requireCourse: f.requireCourse.checked, requireEvaluation: f.requireEvaluation.checked });
      Store.log(me.id, 'تعديل الرتب وشروط الترقية', 'الإعدادات'); toast('✓ تم الحفظ'); rerender();
    });
    q('set-general').addEventListener('submit', (e) => {
      e.preventDefault(); const f = e.target;
      s.academy.slogan = f.slogan.value; s.academy.email = f.email.value; s.academy.phone = f.phone.value;
      s.membershipTypes = f.types.value.split(/[،,]/).map((x) => x.trim()).filter(Boolean);
      Store.log(me.id, 'تعديل الإعدادات العامة', 'الإعدادات'); toast('✓ تم الحفظ');
    });
    q('reset-demo').addEventListener('click', (e) => {
      const b = e.currentTarget;
      if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'اضغط مرة أخرى للتأكيد'; return; }
      Store.reset(); location.hash = '#/login';
    });
  }

  /* Page registry: [key, icon, label, group, visible(me)] */
  const always = () => true;
  const PAGES = [
    ['home', '🏠', 'الرئيسية', 'حسابي', always, home],
    ['profile', '🪪', 'ملفي', 'حسابي', always, profile],
    ['points', '⭐', 'النقاط', 'حسابي', always, points, mountPoints],
    ['promotion', '📈', 'الترقية', 'حسابي', always, promotion, mountPromotion],
    ['tasks', '✅', 'المهام', 'العمل', always, tasks, mountTasks],
    ['teams', '👥', 'الفرق', 'العمل', always, teams, mountTeams],
    ['committees', '🏛️', 'اللجان', 'العمل', always, committees],
    ['projects', '🚀', 'المشاريع', 'العمل', always, projects],
    ['meetings', '🗓️', 'الاجتماعات والحضور', 'العمل', always, meetings, mountMeetings],
    ['training', '🎓', 'التكوين', 'التعلم', always, training, mountTraining],
    ['certificates', '🏅', 'الشهادات', 'التعلم', always, certificates, mountCertificates],
    ['live', '📡', 'البثوث', 'التعلم', always, live],
    ['reports', '📊', 'التقارير', 'التواصل', always, reports, mountReports],
    ['announcements', '📢', 'الإعلانات', 'التواصل', always, announcements, mountAnnouncements],
    ['notifications', '🔔', 'الإشعارات', 'التواصل', always, notifications],
    ['command', '🧭', 'Command Center', 'الإدارة', (me) => Store.can(me, 'audit.view') || Store.can(me, 'reports.view'), command],
    ['requests', '📥', 'طلبات الانضمام', 'الإدارة', (me) => Store.can(me, 'requests.manage'), requests, mountRequests],
    ['members', '🧑‍🤝‍🧑', 'الأعضاء', 'الإدارة', (me) => Store.can(me, 'users.manage'), members, mountMembers],
    ['finance', '💰', 'المالية', 'الإدارة', (me) => Store.can(me, 'finance.view'), finance],
    ['audit', '🛡️', 'سجل التدقيق', 'الإدارة', (me) => Store.can(me, 'audit.view'), audit],
    ['settings', '⚙️', 'الإعدادات', 'الإدارة', always, settings, mountSettings],
  ];

  function render(root, page, arg) {
    const me = Store.currentUser();
    if (!me) { location.hash = '#/login'; return; }
    const def = PAGES.find((p) => p[0] === page) || PAGES[0];
    const unread = S().notifications.filter((n) => n.user === me.id && !n.read).length;
    const pendingReq = S().requests.filter((r) => r.status === 'pending').length;
    const pendingPts = S().pointLog.filter((p) => p.status === 'pending').length;
    const counts = { notifications: unread, requests: pendingReq, points: Store.can(me, 'points.approve') ? pendingPts : 0 };
    let grp = '';
    const nav = PAGES.filter((p) => p[4](me)).map((p) => {
      const g = p[3] !== grp ? `<div class="grp">${esc((grp = p[3]))}</div>` : '';
      return `${g}<a href="#/dashboard/${p[0]}" class="${p[0] === def[0] ? 'active' : ''}"><span>${p[1]}</span>${esc(p[2])}${counts[p[0]] ? `<span class="count">${counts[p[0]]}</span>` : ''}</a>`;
    }).join('');

    root.innerHTML = `<div class="dash">
      <aside class="side" id="side"><a class="brand" href="#/"><img src="assets/logo.svg" alt=""><div><b>إشراقة وعي</b><small>Ichraqa Academy Platform</small></div></a><nav>${nav}</nav>
      <div style="padding:16px 12px 4px"><a href="#/" class="muted" style="color:#cfe0d6">↩ الموقع العام</a></div></aside>
      <div class="dmain"><header class="dtop"><button class="icon-btn side-toggle" id="side-toggle" aria-label="القائمة">☰</button>
        <a class="icon-btn" href="#/dashboard/notifications" aria-label="الإشعارات" style="position:relative">🔔${unread ? `<span class="count" style="position:absolute;top:-6px;inset-inline-end:-6px;background:var(--gold);color:var(--green-deep);border-radius:999px;font-size:.7rem;padding:0 6px;font-weight:800">${unread}</span>` : ''}</a>
        <button class="icon-btn" id="theme-btn2" aria-label="الوضع الليلي">🌓</button>
        <div class="who">${avatar(me.name, true)}<div><b>${esc(me.name)}</b><small>${esc(S().roles[me.role].label.split(' — ')[0])}</small></div><button class="btn btn-ghost btn-sm" id="logout">${esc(App.t('logout'))}</button></div></header>
      <main class="dcontent" id="dcontent"></main></div></div>`;

    const content = root.querySelector('#dcontent');
    const draw = () => {
      const fresh = Store.currentUser();
      content.innerHTML = def[4](fresh) ? def[5](fresh, arg) : denied();
      if (def[6] && def[4](fresh)) def[6](fresh, content, () => render(root, page, arg));
    };
    draw();
    root.querySelector('#logout').addEventListener('click', () => { Store.logout(); location.hash = '#/'; });
    root.querySelector('#side-toggle').addEventListener('click', () => root.querySelector('#side').classList.toggle('open'));
    root.querySelector('#theme-btn2').addEventListener('click', App.toggleTheme);
  }

  return { render };
})();
