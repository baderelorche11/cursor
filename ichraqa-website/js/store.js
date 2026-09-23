/* Data layer.
   All reads/writes go through `Store`, so swapping localStorage for Firebase
   (Auth + Firestore) later only means reimplementing this file. */

(function () {
  const KEY = 'ichraqa.state.v1';
  const SESSION = 'ichraqa.session.v1';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const safeGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable: keep in memory */ } };
  const safeDel = (k) => { try { localStorage.removeItem(k); } catch (e) {} };
  const uid = (p) => p + '-' + Math.random().toString(36).slice(2, 9);
  const today = () => new Date().toISOString().slice(0, 10);
  const now = () => { const d = new Date(); return d.toISOString().slice(0, 10) + ' ' + d.toTimeString().slice(0, 5); };

  function fresh() {
    const s = clone(window.SEED);
    s.audit = [
      { at: '2026-09-22 16:20', by: 'u-hassan', action: 'اعتماد ترقية', target: 'كريم بناني → رئيس فريق' },
      { at: '2026-09-22 11:05', by: 'u-samira', action: 'اعتماد نقاط', target: 'سارة المنصوري +30 (Live)' },
    ];
    s.notifications = [
      { id: 'nt1', user: 'u-sara', at: '2026-09-22 18:00', text: 'تمت إضافة نقاط إلى حسابك: +30', read: false },
      { id: 'nt2', user: 'u-sara', at: '2026-09-22 09:00', text: 'تمت إضافة مهمة جديدة: تقييم متدربي الدفعة الثالثة', read: false },
      { id: 'nt3', user: 'u-sara', at: '2026-09-24 10:00', text: 'لديك اجتماع غدًا: اجتماع لجنة الإعلام', read: false },
    ];
    s.reports = [
      { id: 'rep1', committee: 'c-media', period: 'شتنبر 2026', by: 'u-omar', achievements: '4 بثوث مباشرة، 20 منشورًا', difficulties: 'نقص في فريق المونتاج', suggestions: 'استقطاب متطوعين للمونتاج', date: '2026-09-21' },
    ];
    s.messages = [];
    return s;
  }

  let state;
  try { state = JSON.parse(safeGet(KEY)) || fresh(); } catch (e) { state = fresh(); }

  const listeners = [];
  function save() { safeSet(KEY, JSON.stringify(state)); listeners.forEach((f) => f()); }

  const Store = {
    get s() { return state; },
    onChange(f) { listeners.push(f); },
    reset() { state = fresh(); safeDel(SESSION); save(); },
    uid, today, now,

    /* ---------- auth (demo) ---------- */
    currentUser() {
      const id = safeGet(SESSION);
      return id ? state.users.find((u) => u.id === id) || null : null;
    },
    login(email, password) {
      const u = state.users.find((x) => x.email.toLowerCase() === String(email).trim().toLowerCase());
      if (!u || password !== (u.password || 'demo')) return null;
      safeSet(SESSION, u.id);
      this.log(u.id, 'تسجيل الدخول', u.name);
      return u;
    },
    loginAs(id) { safeSet(SESSION, id); },
    logout() { safeDel(SESSION); },

    /* ---------- RBAC ---------- */
    can(user, perm) {
      if (!user) return false;
      const r = state.roles[user.role];
      return !!r && (r.perms.includes('*') || r.perms.includes(perm));
    },

    /* ---------- lookups ---------- */
    user(id) { return state.users.find((u) => u.id === id); },
    userName(id) { const u = this.user(id); return u ? u.name : '—'; },
    team(id) { return state.teams.find((t) => t.id === id); },
    committee(id) { return state.committees.find((c) => c.id === id); },
    activity(id) { return state.activities.find((a) => a.id === id); },
    levelOf(points) {
      const lv = [...state.levels].sort((a, b) => a.min - b.min);
      let cur = lv[0];
      lv.forEach((l) => { if (points >= l.min) cur = l; });
      const next = lv.find((l) => l.min > points) || null;
      return { current: cur, next };
    },
    taskStatus(t) {
      if (t.status !== 'done' && t.due && t.due < today()) return 'late';
      return t.status;
    },
    contributionIndex(u) {
      const tasksDone = state.tasks.filter((t) => t.assignee === u.id && t.status === 'done').length;
      const lead = state.projects.filter((p) => p.lead === u.id).length;
      const score = u.activity * 0.35 + u.commitment * 0.35 + Math.min(u.points / 40, 20) + tasksDone * 2 + lead * 4;
      return Math.min(100, Math.round(score));
    },

    /* ---------- audit + notifications ---------- */
    log(by, action, target) {
      state.audit.unshift({ at: now(), by, action, target });
      save();
    },
    notify(userId, text) {
      state.notifications.unshift({ id: uid('nt'), user: userId, at: now(), text, read: false });
      save();
    },

    /* ---------- points engine (section 13) ----------
       activity -> proposal -> review -> approval -> balance -> audit log */
    proposePoints(by, userId, activityId, note, custom) {
      const a = this.activity(activityId);
      const pts = Number(custom) > 0 ? Number(custom) : a.points;
      state.pointLog.unshift({ id: uid('p'), user: userId, activity: activityId, points: pts, date: today(), status: 'pending', by: by.id, reviewer: null, note: note || '' });
      this.log(by.id, 'اقتراح نقاط', `${this.userName(userId)} +${pts} (${a.name})`);
    },
    reviewPoints(reviewer, entryId, approve) {
      const e = state.pointLog.find((x) => x.id === entryId);
      if (!e || e.status !== 'pending') return 'not-found';
      if (!this.can(reviewer, 'points.approve')) return 'forbidden';
      if (e.by === reviewer.id || e.user === reviewer.id) return 'self';
      e.status = approve ? 'approved' : 'rejected';
      e.reviewer = reviewer.id;
      if (approve) {
        const u = this.user(e.user);
        const before = this.levelOf(u.points).next;
        u.points += e.points;
        this.notify(u.id, `تمت إضافة نقاط إلى حسابك: +${e.points}`);
        if (before && u.points >= before.min) this.notify(u.id, `أنت مؤهل للترقية إلى: ${before.name}`);
      }
      this.log(reviewer.id, approve ? 'اعتماد نقاط' : 'رفض نقاط', `${this.userName(e.user)} +${e.points}`);
      return 'ok';
    },

    /* ---------- join requests (section 6) ---------- */
    submitRequest(data) {
      state.requests.unshift(Object.assign({ id: uid('r'), date: today(), status: 'pending' }, data));
      save();
    },
    setRequestStatus(by, id, status, opts) {
      const r = state.requests.find((x) => x.id === id);
      if (!r) return;
      r.status = status;
      if (status === 'accepted' && !r.userId) {
        const roleByType = { 'كوتش': 'coach', 'متدرب': 'trainee' };
        const u = {
          id: uid('u'), name: r.name, email: r.email, role: roleByType[r.type] || 'member', title: r.type,
          team: opts.team || null, committee: opts.committee || null, points: 0, activity: 50, commitment: 50,
          joined: today(), skills: String(r.skills || '').split(/[،,]/).map((x) => x.trim()).filter(Boolean),
        };
        state.users.push(u);
        r.userId = u.id;
        this.notify(u.id, 'تم قبول طلب عضويتك. مرحبًا بك في إشراقة وعي!');
      }
      const labels = { pending: 'قيد الدراسة', accepted: 'مقبول', info: 'يحتاج معلومات إضافية', rejected: 'مرفوض' };
      this.log(by.id, 'تحديث طلب انضمام', `${r.name} → ${labels[status]}`);
    },

    /* ---------- tasks ---------- */
    saveTask(by, t) {
      if (t.id) {
        const i = state.tasks.findIndex((x) => x.id === t.id);
        state.tasks[i] = Object.assign(state.tasks[i], t);
        this.log(by.id, 'تعديل مهمة', t.title);
      } else {
        t.id = uid('k');
        t.status = t.status || 'new';
        t.owner = by.id;
        state.tasks.unshift(t);
        if (t.assignee) this.notify(t.assignee, 'تمت إضافة مهمة جديدة: ' + t.title);
        this.log(by.id, 'إنشاء مهمة', t.title);
      }
    },
    moveTask(by, id, status) {
      const t = state.tasks.find((x) => x.id === id);
      if (!t) return;
      t.status = status;
      this.log(by.id, 'تغيير حالة مهمة', t.title);
    },

    promote(by, userId, levelName) {
      const u = this.user(userId);
      u.title = levelName;
      this.notify(u.id, 'تم اعتماد ترقيتك إلى: ' + levelName);
      this.log(by.id, 'اعتماد ترقية', `${u.name} → ${levelName}`);
    },

    save,
  };

  window.Store = Store;
})();
