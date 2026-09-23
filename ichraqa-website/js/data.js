/* Seed data for the Ichraqa Academy platform.
   Everything here is the initial state only: the store copies it into
   localStorage on first load, and the admin can edit it from the dashboard
   (Academy Settings) without touching code. */

window.SEED = {
  academy: {
    name: 'أكاديمية إشراقة وعي الدولية للكوتشينغ',
    shortName: 'إشراقة وعي',
    slogan: 'معًا لمحاربة التفاهة — نلتقي لنرتقي — والفائدة للجميع',
    domain: 'ichraqa-awareness.com',
    email: 'contact@ichraqa-awareness.com',
    phone: '+212 6 00 00 00 00',
    city: 'المغرب',
  },

  /* RBAC: each role maps to a set of permissions (section 34). */
  roles: {
    super_admin:       { label: 'Super Admin — المدير العام', perms: ['*'] },
    exec_admin:        { label: 'Executive Admin — الإدارة التنفيذية', perms: ['requests.manage','users.manage','points.propose','points.approve','tasks.create','tasks.manage_all','teams.manage','committees.manage','reports.view','promotion.approve','announce.create','audit.view','meetings.create'] },
    finance:           { label: 'Finance Manager — المالية والتقنية', perms: ['finance.view','reports.view','points.propose','tasks.create','audit.view','meetings.create'] },
    hr:                { label: 'HR Manager — الموارد البشرية', perms: ['requests.manage','users.manage','points.propose','points.approve','teams.manage','committees.manage','promotion.approve','reports.view','tasks.create','meetings.create','announce.create'] },
    committee_manager: { label: 'Committee Manager — رئيس لجنة', perms: ['points.propose','tasks.create','reports.view','meetings.create'] },
    team_leader:       { label: 'Team Leader — رئيس فريق', perms: ['points.propose','tasks.create','meetings.create'] },
    coach:             { label: 'Coach — كوتش', perms: [] },
    member:            { label: 'Member — عضو', perms: [] },
    trainee:           { label: 'Trainee — متدرب', perms: [] },
    guest:             { label: 'Guest — زائر', perms: [] },
  },

  membershipTypes: ['كوتش','عضو','أستاذ','مهني','خبير','متطوع','متدرب','شريك'],

  /* Levels (section 15). Thresholds are editable in settings. */
  levels: [
    { id: 'L1', name: 'عضو',        min: 0 },
    { id: 'L2', name: 'عضو نشيط',   min: 300 },
    { id: 'L3', name: 'عضو متقدم',  min: 900 },
    { id: 'L4', name: 'كوتش',       min: 1100 },
    { id: 'L5', name: 'كوتش متقدم', min: 1500 },
    { id: 'L6', name: 'رئيس فريق',  min: 2200 },
    { id: 'L7', name: 'رئيس لجنة',  min: 3000 },
    { id: 'L8', name: 'مشرف',       min: 4000 },
  ],
  promotionRules: { minActivity: 60, minCommitment: 70, requireCourse: true, requireEvaluation: true },

  /* Point values per activity (section 12) – editable by the admin. */
  activities: [
    { id: 'meeting',   name: 'حضور اجتماع',       points: 10 },
    { id: 'active',    name: 'المشاركة الفعالة',  points: 15 },
    { id: 'task',      name: 'تنفيذ مهمة',        points: 20 },
    { id: 'content',   name: 'إعداد محتوى',       points: 25 },
    { id: 'live',      name: 'المشاركة في Live',  points: 30 },
    { id: 'event',     name: 'تنظيم فعالية',      points: 40 },
    { id: 'recruit',   name: 'استقطاب عضو',       points: 20 },
    { id: 'training',  name: 'تكوين',             points: 25 },
    { id: 'lead',      name: 'قيادة مشروع',       points: 60 },
    { id: 'committee', name: 'العمل داخل لجنة',   points: 15 },
  ],

  committees: [
    { id: 'c-admin',    name: 'لجنة الإدارة والتنظيم',   icon: '🏛️', portfolio: ['التنظيم','التخطيط','المتابعة','الاجتماعات','القرارات'] },
    { id: 'c-hr',       name: 'لجنة الموارد البشرية',    icon: '🤝', portfolio: ['استقبال الأعضاء','دراسة الملفات','توزيع الأعضاء','تقييم الأداء','متابعة الالتزام','الترقيات'] },
    { id: 'c-finance',  name: 'اللجنة المالية',          icon: '💼', portfolio: ['المداخيل','المصاريف','الميزانية','الاشتراكات','التقارير المالية'] },
    { id: 'c-tech',     name: 'اللجنة التقنية',          icon: '💻', portfolio: ['الموقع','المنصة','الحسابات','الدعم التقني','الأنظمة الرقمية'] },
    { id: 'c-media',    name: 'لجنة الإعلام والتواصل',   icon: '📣', portfolio: ['TikTok','YouTube','Facebook','LinkedIn','الإعلانات','الحملات','العلاقات الإعلامية'] },
    { id: 'c-content',  name: 'لجنة المحتوى',            icon: '✍️', portfolio: ['إعداد المحتوى','السيناريوهات','المقالات','البرامج','المواد التدريبية'] },
    { id: 'c-training', name: 'لجنة التكوين والتطوير',   icon: '🎓', portfolio: ['الدورات','الورشات','البرامج التدريبية','الاختبارات','تقييم المتدربين'] },
    { id: 'c-research', name: 'لجنة البحث والدراسات',    icon: '🔬', portfolio: ['الأبحاث','الدراسات','المراجع','المشاريع العلمية','تطوير المحتوى المعرفي'] },
    { id: 'c-partners', name: 'لجنة العلاقات والشراكات', icon: '🌐', portfolio: ['الشركاء','المؤسسات','الخبراء','التعاونات','الاتفاقيات'] },
    { id: 'c-events',   name: 'لجنة الفعاليات',          icon: '🎤', portfolio: ['اللقاءات','المؤتمرات','الجمع العام','الأنشطة الحضورية والافتراضية'] },
    { id: 'c-quality',  name: 'لجنة الجودة والتقييم',    icon: '✅', portfolio: ['مراقبة الأداء','مراجعة النقاط','تقييم الأنشطة','مراقبة الالتزام','اقتراح التحسينات'] },
  ],

  teams: [
    { id: 't1', name: 'الفريق 01 — فريق التواصل', leader: 'u-karim' },
    { id: 't2', name: 'الفريق 02 — فريق التكوين', leader: 'u-nadia' },
    { id: 't3', name: 'الفريق 03 — فريق التقنية', leader: 'u-leila' },
  ],

  /* Demo accounts. Password for all demo accounts: demo */
  users: [
    { id: 'u-hassan', name: 'الأستاذ حسن',       email: 'hassan@ichraqa.demo', role: 'super_admin', title: 'المدير العام',                        team: null, committee: 'c-admin',   points: 3450, activity: 95, commitment: 98, joined: '2023-01-10', skills: ['القيادة','التخطيط الاستراتيجي'] },
    { id: 'u-leila',  name: 'الكوتش ليلى جبارا', email: 'leila@ichraqa.demo',  role: 'finance',     title: 'مسؤولة الإدارة المالية والتقنية',     team: 't3', committee: 'c-tech',    points: 2610, activity: 90, commitment: 94, joined: '2023-02-02', skills: ['المالية','الأنظمة الرقمية'] },
    { id: 'u-samira', name: 'الكوتش سميرة المتوكل', email: 'samira@ichraqa.demo', role: 'hr',       title: 'مسؤولة الموارد البشرية والتنظيم',     team: null, committee: 'c-hr',      points: 2480, activity: 88, commitment: 96, joined: '2023-02-15', skills: ['الموارد البشرية','التنظيم'] },
    { id: 'u-omar',   name: 'عمر الإدريسي',       email: 'omar@ichraqa.demo',   role: 'committee_manager', title: 'رئيس لجنة الإعلام والتواصل', team: 't1', committee: 'c-media',  points: 1960, activity: 84, commitment: 85, joined: '2023-06-01', skills: ['الإعلام','صناعة المحتوى'] },
    { id: 'u-karim',  name: 'كريم بناني',         email: 'karim@ichraqa.demo',  role: 'team_leader', title: 'رئيس فريق التواصل',                  team: 't1', committee: 'c-media',   points: 1720, activity: 80, commitment: 82, joined: '2023-09-12', skills: ['التواصل','التنسيق'] },
    { id: 'u-nadia',  name: 'نادية العلوي',       email: 'nadia@ichraqa.demo',  role: 'team_leader', title: 'رئيسة فريق التكوين',                 team: 't2', committee: 'c-training',points: 1650, activity: 78, commitment: 88, joined: '2023-10-03', skills: ['التدريب','تصميم البرامج'] },
    { id: 'u-sara',   name: 'سارة المنصوري',      email: 'coach@ichraqa.demo',  role: 'coach',       title: 'كوتش',                              team: 't1', committee: 'c-media',   points: 1280, activity: 82, commitment: 90, joined: '2024-03-18', skills: ['كوتشينغ الحياة','التحفيز'] },
    { id: 'u-youssef',name: 'يوسف الشرقاوي',      email: 'member@ichraqa.demo', role: 'member',      title: 'عضو',                               team: 't1', committee: 'c-content', points: 780,  activity: 71, commitment: 76, joined: '2024-11-05', skills: ['الكتابة','التصميم'] },
    { id: 'u-hind',   name: 'هند الفاسي',         email: 'hind@ichraqa.demo',   role: 'trainee',     title: 'متدربة',                            team: 't2', committee: 'c-training',points: 240,  activity: 64, commitment: 70, joined: '2025-09-01', skills: ['البحث'] },
    { id: 'u-amine',  name: 'أمين التازي',        email: 'amine@ichraqa.demo',  role: 'coach',       title: 'كوتش',                              team: 't2', committee: 'c-events',  points: 1190, activity: 76, commitment: 80, joined: '2024-05-22', skills: ['تنشيط الورشات'] },
  ],

  pointLog: [
    { id: 'p1', user: 'u-sara',    activity: 'meeting', points: 10, date: '2026-09-20', status: 'approved', by: 'u-karim', reviewer: 'u-samira', note: 'اجتماع الفريق الأسبوعي' },
    { id: 'p2', user: 'u-sara',    activity: 'task',    points: 20, date: '2026-09-21', status: 'approved', by: 'u-karim', reviewer: 'u-samira', note: 'إعداد سيناريو الحلقة 12' },
    { id: 'p3', user: 'u-sara',    activity: 'live',    points: 30, date: '2026-09-22', status: 'approved', by: 'u-omar',  reviewer: 'u-samira', note: 'تقديم بث TikTok Live' },
    { id: 'p4', user: 'u-youssef', activity: 'content', points: 25, date: '2026-09-22', status: 'pending',  by: 'u-karim', reviewer: null,       note: 'مقال عن الذكاء العاطفي' },
    { id: 'p5', user: 'u-hind',    activity: 'training',points: 25, date: '2026-09-22', status: 'pending',  by: 'u-nadia', reviewer: null,       note: 'إتمام ورشة أساسيات الكوتشينغ' },
  ],

  tasks: [
    { id: 'k1', title: 'إعداد سيناريو الحلقة 13 من البث المباشر', desc: 'موضوع: إدارة الوقت', committee: 'c-media',   team: 't1', owner: 'u-omar',  assignee: 'u-sara',    start: '2026-09-20', due: '2026-09-27', priority: 'عالية',  status: 'in_progress' },
    { id: 'k2', title: 'تصميم منشورات الأسبوع',                    desc: '5 منشورات لإنستغرام وفيسبوك', committee: 'c-media', team: 't1', owner: 'u-karim', assignee: 'u-youssef', start: '2026-09-18', due: '2026-09-22', priority: 'متوسطة', status: 'in_progress' },
    { id: 'k3', title: 'مراجعة دليل لجنة التكوين',                  desc: '', committee: 'c-training', team: 't2', owner: 'u-nadia', assignee: 'u-hind',    start: '2026-09-15', due: '2026-10-05', priority: 'متوسطة', status: 'new' },
    { id: 'k4', title: 'تحديث صفحة الكوتشز في الموقع',              desc: '', committee: 'c-tech',     team: 't3', owner: 'u-leila', assignee: 'u-leila',   start: '2026-09-10', due: '2026-09-30', priority: 'عالية',  status: 'review' },
    { id: 'k5', title: 'تحضير محضر اجتماع لجنة الإعلام',           desc: '', committee: 'c-media',    team: 't1', owner: 'u-omar',  assignee: 'u-sara',    start: '2026-09-19', due: '2026-09-21', priority: 'منخفضة', status: 'done' },
    { id: 'k6', title: 'التواصل مع 3 شركاء محتملين',                desc: '', committee: 'c-partners', team: null, owner: 'u-hassan',assignee: 'u-amine',   start: '2026-09-12', due: '2026-10-10', priority: 'عالية',  status: 'new' },
    { id: 'k7', title: 'تقييم متدربي الدفعة الثالثة',               desc: '', committee: 'c-training', team: 't2', owner: 'u-nadia', assignee: 'u-sara',    start: '2026-09-22', due: '2026-10-02', priority: 'متوسطة', status: 'new' },
  ],

  projects: [
    { id: 'pr1', name: 'مشروع تطوير المنصة',        committee: 'c-tech',     lead: 'u-leila', participants: ['u-leila','u-youssef','u-karim'], progress: 65, tasks: 24, done: 16, desc: 'تحويل الموقع التعريفي إلى منظومة رقمية متكاملة لإدارة الأكاديمية.' },
    { id: 'pr2', name: 'برنامج البث المباشر الأسبوعي', committee: 'c-media',  lead: 'u-omar',  participants: ['u-omar','u-sara','u-amine'], progress: 48, tasks: 30, done: 14, desc: 'بث أسبوعي على TikTok Live بتدوير الكوتشز.' },
    { id: 'pr3', name: 'دبلوم الكوتشينغ التأسيسي',   committee: 'c-training', lead: 'u-nadia', participants: ['u-nadia','u-hind','u-sara'], progress: 80, tasks: 15, done: 12, desc: 'برنامج تكويني معتمد يمنح شهادة إلكترونية.' },
    { id: 'pr4', name: 'الجمع العام السنوي 2026',     committee: 'c-events',   lead: 'u-amine', participants: ['u-amine','u-samira'], progress: 30, tasks: 18, done: 5, desc: 'تنظيم الجمع العام واعتماد المسميات النهائية للرتب.' },
  ],

  meetings: [
    { id: 'm1', title: 'اجتماع لجنة الإعلام', type: 'اجتماع لجنة', date: '2026-09-25', time: '20:00', committee: 'c-media', participants: ['u-omar','u-karim','u-sara','u-youssef'], agenda: ['حصيلة البثوث','خطة أكتوبر','توزيع المهام'], decisions: ['اعتماد بثّين أسبوعيًا','إطلاق حملة الانضمام'], tasks: ['إعداد خطة المحتوى','تصميم إعلان الحملة'], attendance: {} },
    { id: 'm2', title: 'اجتماع الإدارة الشهري', type: 'اجتماع الإدارة', date: '2026-09-24', time: '19:00', committee: 'c-admin', participants: ['u-hassan','u-leila','u-samira'], agenda: ['التقارير الشهرية','الترقيات المقترحة'], decisions: [], tasks: [], attendance: {} },
    { id: 'm3', title: 'لقاء تكويني: أدوات الكوتش', type: 'اجتماع تكويني', date: '2026-09-18', time: '18:30', committee: 'c-training', participants: ['u-nadia','u-hind','u-sara','u-amine'], agenda: ['نموذج GROW','تمارين تطبيقية'], decisions: ['تنظيم جلسة تطبيقية ثانية'], tasks: ['رفع التسجيل إلى المكتبة'], attendance: { 'u-nadia': true, 'u-hind': true, 'u-sara': true, 'u-amine': false } },
  ],

  courses: [
    { id: 'co1', title: 'أساسيات الكوتشينغ', type: 'دورة', hours: 12, mode: 'Google Meet', level: 'مبتدئ', enrolled: ['u-hind','u-youssef'] },
    { id: 'co2', title: 'الذكاء العاطفي في المواكبة', type: 'ورشة', hours: 4, mode: 'حضوري', level: 'متوسط', enrolled: ['u-sara'] },
    { id: 'co3', title: 'فن التقديم في البث المباشر', type: 'ورشة', hours: 3, mode: 'Google Meet', level: 'كل المستويات', enrolled: [] },
    { id: 'co4', title: 'دبلوم الكوتشينغ التأسيسي', type: 'برنامج تدريبي', hours: 60, mode: 'مدمج', level: 'متقدم', enrolled: ['u-sara','u-amine'] },
  ],

  certificates: [
    { id: 'IAC-2026-0001', user: 'u-sara',  name: 'سارة المنصوري', program: 'دبلوم الكوتشينغ التأسيسي', date: '2026-06-30' },
    { id: 'IAC-2026-0002', user: 'u-amine', name: 'أمين التازي',   program: 'الذكاء العاطفي في المواكبة', date: '2026-07-14' },
    { id: 'IAC-2026-0003', user: 'u-youssef', name: 'يوسف الشرقاوي', program: 'أساسيات الكوتشينغ', date: '2026-08-02' },
  ],

  lives: [
    { id: 'l12', episode: 12, topic: 'كيف تبني عادات إيجابية', date: '2026-09-22', host: 'u-omar', coach: 'u-sara',  guests: 'د. منير', tech: 'u-karim', prep: 'تم البث', link: '#' },
    { id: 'l13', episode: 13, topic: 'إدارة الوقت بذكاء',      date: '2026-09-29', host: 'u-omar', coach: 'u-amine', guests: '—',       tech: 'u-karim', prep: 'قيد التحضير', link: '' },
    { id: 'l14', episode: 14, topic: 'الثقة بالنفس',          date: '2026-10-06', host: 'u-omar', coach: 'u-nadia', guests: '—',       tech: 'u-karim', prep: 'لم يبدأ', link: '' },
  ],

  news: [
    { id: 'n1', date: '2026-09-20', title: 'إطلاق النسخة الأولى من منصة إشراقة وعي', body: 'دخلت الأكاديمية مرحلة جديدة بمنصة رقمية متكاملة لإدارة الأعضاء والفرق واللجان.' },
    { id: 'n2', date: '2026-09-12', title: 'تخرّج الدفعة الثانية من دبلوم الكوتشينغ', body: 'تسلّم 18 متدربًا شهاداتهم الإلكترونية القابلة للتحقق عبر رمز QR.' },
    { id: 'n3', date: '2026-09-05', title: 'شراكة جديدة مع مؤسسات تعليمية', body: 'توقيع اتفاقيات تعاون لتنظيم ورشات توعوية لفائدة الشباب.' },
  ],

  events: [
    { id: 'e1', date: '2026-09-29', title: 'TikTok Live — الحلقة 13: إدارة الوقت', place: 'بث مباشر' },
    { id: 'e2', date: '2026-10-04', title: 'ورشة: فن التقديم في البث المباشر', place: 'Google Meet' },
    { id: 'e3', date: '2026-11-15', title: 'الجمع العام السنوي', place: 'الدار البيضاء' },
  ],

  announcements: [
    { id: 'a1', date: '2026-09-22', by: 'u-hassan', text: 'مرحبًا بالأعضاء الجدد! نذكّر الجميع بتحديث ملفاتهم الشخصية قبل نهاية الشهر.' },
    { id: 'a2', date: '2026-09-20', by: 'u-samira', text: 'فتح باب الترشح لرئاسة الفريق 04 — آخر أجل 30 سبتمبر.' },
  ],

  requests: [
    { id: 'r1', date: '2026-09-21', type: 'كوتش', name: 'مريم الحسني', email: 'meryem@example.com', phone: '0600000001', city: 'الرباط', country: 'المغرب', specialty: 'كوتشينغ مهني', qualifications: 'شهادة ICF ACC', experience: '4 سنوات', skills: 'الإنصات، التخطيط', interests: 'الشباب، التوجيه', reason: 'المساهمة في نشر الوعي', contribution: 'تقديم ورشات شهرية', links: '', status: 'pending' },
    { id: 'r2', date: '2026-09-22', type: 'متطوع', name: 'إلياس بوعزة', email: 'ilyas@example.com', phone: '0600000002', city: 'فاس', country: 'المغرب', specialty: 'مونتاج فيديو', qualifications: '', experience: 'سنتان', skills: 'Premiere, CapCut', interests: 'الإعلام', reason: 'أحب العمل التطوعي', contribution: 'مونتاج مقاطع البث', links: '', status: 'pending' },
  ],

  finance: {
    months: ['أبريل','ماي','يونيو','يوليوز','غشت','شتنبر'],
    income:   [8200, 9400, 11800, 10300, 9900, 13600],
    expenses: [6100, 7000, 8300, 7900, 7400, 9100],
    subscriptions: 214,
    budget: 120000,
  },
};
