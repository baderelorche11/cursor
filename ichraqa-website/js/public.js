/* Public website pages (sections 4, 5, 20, 38). */

window.PublicPages = (function () {
  const { esc, avatar, fmt, fmtDate, qr } = UI;
  const S = () => Store.s;
  const t = (k) => App.t(k);

  const head = (kicker, title) => `<div class="sec-head"><div class="kicker">${esc(kicker)}</div><h2>${esc(title)}</h2><div class="divider"></div></div>`;
  const pageHero = (title, sub) => `<div class="page-hero"><div class="container"><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div></div>`;

  const ABOUT = {
    about: 'أكاديمية إشراقة وعي الدولية للكوتشينغ فضاء يجمع الكوتشز والخبراء والأساتذة والمهنيين والمتطوعين حول هدف واحد: نشر الوعي ومحاربة التفاهة عبر التكوين الجاد والمواكبة الإنسانية وصناعة محتوى هادف يصل إلى الجميع.',
    vision: 'أن تكون إشراقة وعي مرجعًا دوليًا في الكوتشينغ وبناء الوعي، ومنظومة رقمية حية يعرف فيها كل عضو مكانه، وتُوثَّق فيها كل مساهمة.',
    mission: 'تمكين الإنسان من اكتشاف قدراته وتطويرها، من خلال برامج تكوينية معتمدة، ومواكبة احترافية، ومحتوى توعوي هادف، وعمل جماعي منظم في فرق ولجان.',
    goals: ['نشر ثقافة الوعي ومحاربة المحتوى التافه', 'تكوين كوتشز أكفاء بشهادات قابلة للتحقق', 'بناء مجتمع منظم يتقدم أعضاؤه بمعايير شفافة', 'إطلاق مشاريع ذات أثر اجتماعي ومعرفي', 'عقد شراكات مع مؤسسات وخبراء محليًا ودوليًا'],
  };
  const PROGRAMS = [
    ['🎓', 'التكوين', 'دورات وورشات وبرامج تدريبية معتمدة، حضوريًا وعبر Google Meet.'],
    ['🧭', 'المواكبة', 'جلسات كوتشينغ فردية وجماعية لتطوير الذات والمسار المهني.'],
    ['📡', 'TikTok Live', 'بث مباشر أسبوعي بتدوير الكوتشز حول مواضيع الوعي والتطوير.'],
    ['📚', 'المكتبة الرقمية', 'كتب وأبحاث ومقالات وفيديوهات وأدلة عمل للأعضاء.'],
    ['🤝', 'الشراكات', 'تعاون مع المؤسسات والخبراء لتوسيع دائرة الأثر.'],
    ['🏅', 'الشهادات', 'شهادات إلكترونية برقم فريد ورمز QR للتحقق.'],
  ];

  function home() {
    const s = S();
    const coaches = s.users.filter((u) => ['coach', 'team_leader', 'committee_manager'].includes(u.role)).length;
    return `
    <section class="hero">
      <div class="container">
        <img class="hero-logo" src="assets/logo.svg" alt="">
        <h1>${esc(t('heroTitle'))}</h1>
        <p class="lead">${esc(t('heroSub'))}</p>
        <div class="slogan">${esc(s.academy.slogan)}</div>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#/register">${esc(t('join'))}</a>
          <a class="btn btn-ghost" href="#/about">${esc(t('discover'))}</a>
          <a class="btn btn-ghost" href="#/login">${esc(t('login'))}</a>
          <a class="btn btn-ghost" href="#/training">${esc(t('training'))}</a>
        </div>
        <div class="hero-stats">
          <div><b>${fmt(s.users.length)}+</b><span>عضو</span></div>
          <div><b>${coaches}</b><span>كوتش ومسؤول</span></div>
          <div><b>${s.committees.length}</b><span>لجنة</span></div>
          <div><b>${s.projects.length}</b><span>مشاريع قائمة</span></div>
        </div>
      </div>
    </section>

    <section class="block"><div class="container">
      ${head(t('about'), 'من نحن')}
      <p style="text-align:center;max-width:820px;margin:0 auto 36px;font-size:1.1rem;color:var(--ink-2)">${esc(ABOUT.about)}</p>
      <div class="grid g3">
        <div class="card vm"><div class="ico">🔭</div><h3>${esc(t('vision'))}</h3><p>${esc(ABOUT.vision)}</p></div>
        <div class="card vm"><div class="ico">🎯</div><h3>${esc(t('mission'))}</h3><p>${esc(ABOUT.mission)}</p></div>
        <div class="card vm"><div class="ico">🏁</div><h3>${esc(t('goals'))}</h3><ul>${ABOUT.goals.slice(0, 4).map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
      </div>
    </div></section>

    <section class="block alt"><div class="container">
      ${head(t('programs'), 'برامجنا')}
      <div class="grid g3">${PROGRAMS.map(([i, h, p]) => `<div class="card hover"><div class="ico">${i}</div><h3>${esc(h)}</h3><p class="muted">${esc(p)}</p></div>`).join('')}</div>
    </div></section>

    <section class="block"><div class="container">
      ${head(t('ourTeam'), 'فريقنا')}
      <div class="grid g3">${s.users.slice(0, 3).map(personCard).join('')}</div>
      <p style="text-align:center;margin-top:24px"><a class="btn btn-green" href="#/management">الهيكل الإداري الكامل</a></p>
    </div></section>

    <section class="block alt"><div class="container">
      ${head(t('committees'), 'لجاننا')}
      <div class="grid g4">${s.committees.slice(0, 8).map((c) => `<a class="card hover" href="#/committees"><div class="ico">${c.icon}</div><h3 style="font-size:1.05rem">${esc(c.name)}</h3></a>`).join('')}</div>
      <p style="text-align:center;margin-top:24px"><a class="btn btn-ghost" href="#/committees">كل اللجان (${s.committees.length})</a></p>
    </div></section>

    <section class="block"><div class="container">
      ${head(t('projects'), 'مشاريعنا')}
      <div class="grid g2">${s.projects.map(projectCard).join('')}</div>
    </div></section>

    <section class="block alt"><div class="container">
      <div class="grid g2">
        <div>${head(t('news'), t('latestNews'))}${s.news.map(newsCard).join('<div style="height:14px"></div>')}</div>
        <div>${head(t('events'), t('upcoming'))}${s.events.map(eventRow).join('<div style="height:14px"></div>')}</div>
      </div>
    </div></section>

    <section class="block"><div class="container">
      ${head('مسار العضو', 'دورة حياة العضو داخل الأكاديمية')}
      <div class="flow">${['التسجيل','دراسة الطلب','القبول','تحديد الصفة','تعيين الفريق','تعيين اللجنة','التكوين','المشاركة','تنفيذ المهام','النقاط','التقييم','الترقية','تحمل المسؤولية','قيادة فريق','قيادة لجنة','المساهمة في إدارة الأكاديمية'].map((x) => `<span>${esc(x)}</span>`).join('')}</div>
    </div></section>

    <section class="block" style="padding-top:0"><div class="container">
      <div class="cta"><div><h2>${esc(t('joinUs'))}</h2><p style="margin:6px 0 0;opacity:.9">كوتش، عضو، أستاذ، مهني، خبير، متطوع، متدرب أو شريك — لكل واحد مكانه في إشراقة وعي.</p></div>
      <a class="btn btn-gold" href="#/register">${esc(t('join'))}</a></div>
    </div></section>`;
  }

  function personCard(u) {
    const c = Store.committee(u.committee);
    return `<div class="card person hover">${avatar(u.name)}<h3>${esc(u.name)}</h3><div class="pill gold">${esc(u.title)}</div>${c ? `<p class="muted" style="margin:8px 0 0">${esc(c.name)}</p>` : ''}</div>`;
  }
  function projectCard(p) {
    const c = Store.committee(p.committee);
    return `<div class="card"><h3>${esc(p.name)}</h3><p class="muted">${esc(p.desc)}</p>
      <div style="display:flex;justify-content:space-between;font-size:.9rem"><span>المسؤول: <b>${esc(c ? c.name : '')}</b></span><b>${p.progress}%</b></div>
      <div class="progress gold" style="margin-top:6px"><i style="width:${p.progress}%"></i></div>
      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap"><span class="pill">المهام: ${p.tasks}</span><span class="pill">المكتملة: ${p.done}</span><span class="pill">المتبقية: ${p.tasks - p.done}</span></div></div>`;
  }
  const newsCard = (n) => `<div class="card"><span class="date-badge">${fmtDate(n.date)}</span><h3 style="margin-top:8px">${esc(n.title)}</h3><p class="muted" style="margin:0">${esc(n.body)}</p></div>`;
  const MONTHS = ['يناير','فبراير','مارس','أبريل','ماي','يونيو','يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'];
  const eventRow = (e) => { const [, m, d] = e.date.split('-'); return `<div class="card event"><div class="d"><div><b>${d}</b>${MONTHS[+m - 1]}</div></div><div><h3 style="margin:0;font-size:1.05rem">${esc(e.title)}</h3><span class="muted">📍 ${esc(e.place)}</span></div></div>`; };

  function about() {
    return pageHero(t('about'), S().academy.slogan) + `<section class="block"><div class="container">
      <div class="card" style="margin-bottom:22px"><h3>من نحن</h3><p>${esc(ABOUT.about)}</p>
      <p>تهدف المنصة إلى تحويل الأكاديمية من مجرد موقع تعريفي إلى منظومة رقمية متكاملة لإدارة الأكاديمية وأعضائها وكوتشزها وفرقها ولجانها وبرامجها ومشاريعها.</p></div>
      <div class="grid g2">
        <div class="card vm" id="vision"><h3>${esc(t('vision'))}</h3><p>${esc(ABOUT.vision)}</p></div>
        <div class="card vm" id="mission"><h3>${esc(t('mission'))}</h3><p>${esc(ABOUT.mission)}</p></div>
      </div>
      <div class="card vm" id="goals" style="margin-top:22px"><h3>${esc(t('goals'))}</h3><ul>${ABOUT.goals.map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
      <div class="card" style="margin-top:22px"><h3>القاعدة الذهبية</h3><p style="font-size:1.08rem">كل عضو يعرف مكانه، وكل مسؤول يعرف صلاحياته، وكل لجنة تعرف حقيبتها، وكل مهمة لها مسؤول، وكل مساهمة يمكن توثيقها، وكل ترقية لها معايير، والإدارة تستطيع رؤية الأكاديمية كاملة من لوحة واحدة.</p></div>
    </div></section>`;
  }

  function structure() {
    const u = (id) => Store.user(id);
    const node = (x, resp, cls) => `<div class="org-node ${cls || ''}">${avatar(x.name)}<b>${esc(x.name)}</b><div>${esc(x.title)}</div>${resp ? `<small class="muted" style="display:block;margin-top:6px">${resp.map(esc).join(' · ')}</small>` : ''}</div>`;
    return pageHero(t('structure'), 'الهيكل التنظيمي الرسمي للأكاديمية') + `<section class="block"><div class="container">
      <div class="org">
        ${node(u('u-hassan'), ['التوجيه العام', 'اعتماد القرارات الاستراتيجية', 'تمثيل الأكاديمية'], 'top')}
        <div class="org-row">
          <div>${node(u('u-leila'), ['الإدارة المالية', 'الجانب التقني', 'الموارد', 'الأنظمة الرقمية'])}</div>
          <div>${node(u('u-samira'), ['الأعضاء والكوتشز', 'الاستقبال', 'متابعة الالتزام', 'تنظيم الفرق'])}</div>
        </div>
        <div class="org-line"></div>
        <div class="org-node"><b>اللجان (${S().committees.length}) · الفرق (${S().teams.length})</b><div class="muted">رؤساء اللجان ← رؤساء الفرق ← الكوتشز ← الأعضاء</div></div>
      </div>
      <div style="margin-top:50px">${head('الفئات', 'الفئات داخل الأكاديمية')}
      <div class="flow">${['الإدارة العليا','الإدارة التنفيذية','رؤساء الفرق','رؤساء اللجان','الكوتشز','الأعضاء','المتدربون','الأساتذة والخبراء','المهنيون','المتطوعون','الشركاء'].map((x) => `<span>${esc(x)}</span>`).join('')}</div>
      <p class="muted" style="text-align:center;margin-top:14px">يمكن للإدارة إضافة أو تعديل المناصب مستقبلًا من داخل النظام دون إعادة بناء الموقع.</p></div>
    </div></section>`;
  }

  function management() {
    const top = S().users.filter((u) => ['super_admin', 'finance', 'hr', 'exec_admin'].includes(u.role));
    return pageHero('الإدارة', 'الإدارة العليا والتنفيذية') + `<section class="block"><div class="container"><div class="grid g3">${top.map(personCard).join('')}</div></div></section>`;
  }

  function coaches() {
    const list = S().users.filter((u) => ['coach', 'team_leader', 'committee_manager', 'finance', 'hr'].includes(u.role));
    return pageHero(t('coaches'), 'نخبة من الكوتشز المعتمدين') + `<section class="block"><div class="container"><div class="grid g4">${list.map((u) => `<div class="card person hover">${avatar(u.name)}<h3 style="font-size:1.05rem">${esc(u.name)}</h3><div class="pill gold">${esc(u.title)}</div><div style="margin-top:8px">${(u.skills || []).map((x) => `<span class="pill">${esc(x)}</span>`).join('')}</div></div>`).join('')}</div></div></section>`;
  }

  function committees() {
    return pageHero(t('committees'), 'لكل لجنة ملف مستقل وحقيبة واضحة') + `<section class="block"><div class="container"><div class="grid g3">
      ${S().committees.map((c) => { const n = S().users.filter((u) => u.committee === c.id).length; return `<div class="card hover"><div class="ico">${c.icon}</div><h3>${esc(c.name)}</h3><p class="muted" style="margin:0 0 6px">الحقيبة:</p>${c.portfolio.map((p) => `<span class="pill">${esc(p)}</span>`).join('')}<p class="muted" style="margin:10px 0 0;font-size:.88rem">👥 ${n} عضو</p></div>`; }).join('')}
    </div></div></section>`;
  }

  function teams() {
    return pageHero(t('teams'), 'فرق عمل منظمة بقيادة واضحة') + `<section class="block"><div class="container"><div class="grid g3">
      ${S().teams.map((tm) => { const m = S().users.filter((u) => u.team === tm.id); const pts = m.reduce((a, u) => a + u.points, 0); return `<div class="card"><h3>${esc(tm.name)}</h3><p>رئيس الفريق: <b>${esc(Store.userName(tm.leader))}</b></p><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="pill">الأعضاء: ${m.length}</span><span class="pill">المهام: ${S().tasks.filter((k) => k.team === tm.id).length}</span><span class="pill gold">النقاط: ${fmt(pts)}</span></div></div>`; }).join('')}
    </div></div></section>`;
  }

  function projects() {
    return pageHero(t('projects'), 'لكل مشروع صفحة مستقلة ومتابعة للإنجاز') + `<section class="block"><div class="container"><div class="grid g2">${S().projects.map(projectCard).join('')}</div></div></section>`;
  }

  function training() {
    const items = ['الدورات','الورشات','المحاضرات','Google Meet','الفيديوهات','الملفات','الاختبارات','الشهادات'];
    return pageHero(t('training'), 'مركز التكوين') + `<section class="block"><div class="container">
      <div class="flow" style="margin-bottom:34px">${items.map((x) => `<span>${esc(x)}</span>`).join('')}</div>
      <div class="grid g2">${S().courses.map((c) => `<div class="card hover"><span class="pill gold">${esc(c.type)}</span><h3 style="margin-top:8px">${esc(c.title)}</h3><p class="muted" style="margin:0">⏱ ${c.hours} ساعة · 📍 ${esc(c.mode)} · المستوى: ${esc(c.level)}</p><a class="btn btn-green btn-sm" style="margin-top:12px" href="#/register">التسجيل</a></div>`).join('')}</div>
    </div></section>`;
  }

  function library() {
    const cats = [['📘','كتب'],['📄','PDFs'],['🔬','أبحاث'],['📰','مقالات'],['🎬','فيديوهات'],['📊','عروض'],['🗂️','ملفات التدريب'],['📑','أدلة اللجان'],['🧾','نماذج العمل']];
    return pageHero(t('library'), 'المكتبة الرقمية — مع صلاحيات الوصول') + `<section class="block"><div class="container"><div class="grid g3">
      ${cats.map(([i, n], k) => `<div class="card hover"><div class="ico">${i}</div><h3>${esc(n)}</h3><p class="muted" style="margin:0">${k < 5 ? '🌐 متاح للعموم جزئيًا' : '🔒 للأعضاء فقط'}</p></div>`).join('')}
    </div><p style="text-align:center;margin-top:24px"><a class="btn btn-green" href="#/login">الدخول للوصول الكامل</a></p></div></section>`;
  }

  const news = () => pageHero(t('news'), '') + `<section class="block"><div class="container"><div class="grid g3">${S().news.map(newsCard).join('')}</div></div></section>`;
  const events = () => pageHero(t('events'), '') + `<section class="block"><div class="container" style="max-width:800px"><div class="grid">${S().events.map(eventRow).join('')}</div></div></section>`;

  function live() {
    return pageHero('برنامج البث المباشر', 'TikTok Live — نظام تدوير الكوتشز') + `<section class="block"><div class="container">
      <div class="table-wrap"><table><thead><tr><th>الحلقة</th><th>الموضوع</th><th>التاريخ</th><th>المقدم</th><th>الكوتش</th><th>الضيوف</th><th>الفريق التقني</th><th>حالة التحضير</th></tr></thead><tbody>
      ${S().lives.map((l) => `<tr><td><b>#${l.episode}</b></td><td>${esc(l.topic)}</td><td>${fmtDate(l.date)}</td><td>${esc(Store.userName(l.host))}</td><td>${esc(Store.userName(l.coach))}</td><td>${esc(l.guests)}</td><td>${esc(Store.userName(l.tech))}</td><td>${UI.badge(l.prep === 'تم البث' ? 'done' : l.prep === 'قيد التحضير' ? 'in_progress' : 'new', l.prep)}</td></tr>`).join('')}
      </tbody></table></div></div></section>`;
  }

  function certificates(q) {
    const id = (q || '').trim().toUpperCase();
    const c = id ? S().certificates.find((x) => x.id === id) : null;
    return pageHero(t('verify'), 'أدخل رقم الشهادة أو امسح رمز QR') + `<section class="block"><div class="container" style="max-width:820px">
      <form class="card form" id="verify-form" style="margin-bottom:26px"><label class="f">رقم الشهادة<input name="id" placeholder="IAC-2026-0001" value="${esc(id)}" required dir="ltr"></label><button class="btn btn-green">تحقق</button>
      <small class="muted">للتجربة: IAC-2026-0001</small></form>
      ${id ? (c ? `<div class="alert" style="margin-bottom:18px">✓ شهادة صحيحة وصادرة عن الأكاديمية.</div>${certificateView(c)}` : `<div class="alert err">✕ لم يتم العثور على شهادة بهذا الرقم.</div>`) : ''}
    </div></section>`;
  }
  function certificateView(c) {
    return `<div class="certificate"><img src="assets/logo.svg" alt="" style="width:70px"><div style="font-weight:700;color:#0B3D2A">${esc(S().academy.name)}</div>
      <h2 style="margin-top:14px">شهادة إتمام</h2><p>تشهد الأكاديمية بأن</p><div class="name">${esc(c.name)}</div><p>قد أتمّ(ت) بنجاح برنامج</p><h3 style="color:#0F6B45">${esc(c.program)}</h3>
      <div class="meta"><div style="text-align:start">تاريخ الإصدار: <b>${fmtDate(c.date)}</b><br>رقم الشهادة: <b dir="ltr">${esc(c.id)}</b></div>${qr(c.id)}<div>توقيع الإدارة<br><span style="font-family:var(--display);font-size:1.3rem;color:#9E7A2C">المدير العام</span></div></div></div>`;
  }

  function register() {
    const types = S().membershipTypes;
    return pageHero('انضم إلى إشراقة وعي', 'املأ الاستمارة وسيتم دراسة طلبك من طرف لجنة الموارد البشرية') + `<section class="block"><div class="container" style="max-width:880px">
      <form class="card form" id="register-form" novalidate>
        <h3>1. نوع العضوية</h3>
        <div class="types">${types.map((x, i) => `<label><input type="radio" name="type" value="${esc(x)}" ${i === 1 ? 'checked' : ''}>${esc(x)}</label>`).join('')}</div>
        <h3 style="margin-top:10px">2. المعلومات الشخصية</h3>
        <div class="form-row">
          <label class="f"><span class="req">الاسم الكامل</span><input name="name" required maxlength="80"></label>
          <label class="f"><span class="req">البريد الإلكتروني</span><input name="email" type="email" required dir="ltr"></label>
          <label class="f"><span class="req">الهاتف</span><input name="phone" type="tel" required dir="ltr"></label>
          <label class="f">المدينة<input name="city"></label>
          <label class="f">الدولة<input name="country" value="المغرب"></label>
          <label class="f">التخصص<input name="specialty"></label>
        </div>
        <h3 style="margin-top:10px">3. المسار والكفاءات</h3>
        <div class="form-row">
          <label class="f">المؤهلات<textarea name="qualifications"></textarea></label>
          <label class="f">الخبرة<textarea name="experience"></textarea></label>
          <label class="f">المهارات<textarea name="skills" placeholder="افصل بفاصلة"></textarea></label>
          <label class="f">مجالات الاهتمام<textarea name="interests"></textarea></label>
        </div>
        <div class="form-row">
          <label class="f">السيرة الذاتية (PDF)<input name="cv" type="file" accept=".pdf,.doc,.docx"></label>
          <label class="f">صورة شخصية<input name="photo" type="file" accept="image/*"></label>
        </div>
        <label class="f">روابط الأعمال<input name="links" dir="ltr" placeholder="https://"></label>
        <h3 style="margin-top:10px">4. الدافع والمساهمة</h3>
        <label class="f"><span class="req">سبب الانضمام</span><textarea name="reason" required></textarea></label>
        <label class="f">كيف ستساهم في الأكاديمية؟<textarea name="contribution"></textarea></label>
        <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="consent" required style="width:auto"> أوافق على معالجة بياناتي الشخصية لأغراض دراسة الطلب.</label>
        <div id="register-msg"></div>
        <button class="btn btn-gold" type="submit">إرسال طلب الانضمام</button>
      </form></div></section>`;
  }

  function contact() {
    const a = S().academy;
    return pageHero(t('contact'), 'يسعدنا تواصلكم') + `<section class="block"><div class="container"><div class="grid g2">
      <div class="card"><h3>معلومات التواصل</h3><p>📧 <span dir="ltr">${esc(a.email)}</span></p><p>📞 <span dir="ltr">${esc(a.phone)}</span></p><p>🌐 <span dir="ltr">${esc(a.domain)}</span></p>
      <div class="socials" style="--x:0">${['TikTok','YouTube','Facebook','LinkedIn'].map((s) => `<span class="pill">${s}</span>`).join('')}</div></div>
      <form class="card form" id="contact-form"><h3>راسلنا</h3><label class="f"><span class="req">الاسم</span><input name="name" required></label><label class="f"><span class="req">البريد الإلكتروني</span><input name="email" type="email" required dir="ltr"></label><label class="f"><span class="req">الرسالة</span><textarea name="msg" required></textarea></label><button class="btn btn-green">إرسال</button></form>
    </div></div></section>`;
  }

  function login() {
    const demo = S().users.filter((u) => ['u-hassan','u-leila','u-samira','u-omar','u-karim','u-sara','u-youssef'].includes(u.id));
    return `<div class="login-wrap"><div class="card login-card">
      <div style="text-align:center"><img src="assets/logo.svg" alt="" style="width:72px"><h2 style="color:var(--green)">دخول الأعضاء</h2></div>
      <form class="form" id="login-form"><label class="f">البريد الإلكتروني<input name="email" type="email" required dir="ltr" autocomplete="username"></label>
      <label class="f">كلمة المرور<input name="password" type="password" required dir="ltr" autocomplete="current-password"></label>
      <div id="login-msg"></div><button class="btn btn-green">دخول</button></form>
      <hr style="border:0;border-top:1px solid var(--line);margin:20px 0">
      <b>حسابات تجريبية</b> <small class="muted">(كلمة المرور: demo)</small>
      <div class="demo-accounts">${demo.map((u) => `<button type="button" data-demo="${u.id}"><span>${esc(u.name)}</span><small class="muted">${esc(S().roles[u.role].label.split(' — ')[0])}</small></button>`).join('')}</div>
    </div></div>`;
  }

  function sitemap() {
    return pageHero('بنية الموقع', S().academy.domain) + `<section class="block"><div class="container"><div class="tree">${esc(`${S().academy.domain}
/
├── الرئيسية        #/
├── من نحن          #/about
├── الهيكل التنظيمي #/structure
├── الإدارة         #/management
├── الكوتشز         #/coaches
├── اللجان          #/committees
├── الفرق           #/teams
├── المشاريع        #/projects
├── التكوين         #/training
├── المكتبة         #/library
├── الأخبار         #/news
├── الفعاليات       #/events
├── TikTok Live     #/live
├── الشهادات        #/certificates
├── التسجيل         #/register
├── التواصل         #/contact
│
└── /dashboard      #/dashboard`)}</div></div></section>`;
  }

  /* Event wiring after each render. */
  function mount(route, root) {
    const f = (id) => root.querySelector('#' + id);
    if (f('register-form')) {
      f('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const msg = f('register-msg');
        const d = Object.fromEntries(new FormData(form).entries());
        const email = String(d.email || '').trim();
        if (!d.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !d.phone.trim() || !d.reason.trim() || !form.consent.checked) {
          msg.innerHTML = '<div class="alert err">المرجو ملء الحقول الإجبارية بشكل صحيح والموافقة على معالجة البيانات.</div>';
          return;
        }
        if (Store.s.requests.some((r) => r.email.toLowerCase() === email.toLowerCase() && r.status === 'pending')) {
          msg.innerHTML = '<div class="alert err">يوجد طلب قيد الدراسة بهذا البريد الإلكتروني.</div>';
          return;
        }
        delete d.cv; delete d.photo; delete d.consent;
        d.email = email;
        Store.submitRequest(d);
        form.reset();
        msg.innerHTML = '<div class="alert">✓ تم إرسال طلبك بنجاح! حالة الطلب: 🟡 قيد الدراسة. سنتواصل معك عبر البريد الإلكتروني.</div>';
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
    if (f('contact-form')) {
      f('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target).entries());
        Store.s.messages.unshift(Object.assign({ at: Store.now() }, d));
        Store.save();
        e.target.reset();
        UI.toast('✓ تم إرسال رسالتك، شكرًا لك.');
      });
    }
    if (f('verify-form')) {
      f('verify-form').addEventListener('submit', (e) => {
        e.preventDefault();
        location.hash = '#/certificates/' + encodeURIComponent(e.target.id.value.trim());
      });
    }
    if (f('login-form')) {
      const go = () => { location.hash = '#/dashboard'; };
      f('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = Store.login(e.target.email.value, e.target.password.value);
        if (u) go(); else f('login-msg').innerHTML = '<div class="alert err">البريد الإلكتروني أو كلمة المرور غير صحيحة.</div>';
      });
      root.querySelectorAll('[data-demo]').forEach((b) => b.addEventListener('click', () => {
        const u = Store.user(b.dataset.demo);
        Store.login(u.email, 'demo');
        go();
      }));
    }
  }

  return {
    routes: { '': home, about, structure, management, coaches, committees, teams, projects, training, library, news, events, live, certificates, register, contact, login, sitemap },
    mount, certificateView,
  };
})();
