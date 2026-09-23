/* App shell: hash router, public layout, language & theme. */

window.App = (function () {
  const { esc } = UI;
  const pref = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  let lang = pref('ichraqa.lang') || 'ar';
  if (!I18N[lang]) lang = 'ar';

  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.ar[k] || k;

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = I18N[lang].dir;
  }
  function applyTheme() {
    const th = pref('ichraqa.theme');
    if (th) document.documentElement.dataset.theme = th; else delete document.documentElement.dataset.theme;
  }
  function toggleTheme() {
    const dark = document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    pref('ichraqa.theme', dark ? 'light' : 'dark');
    applyTheme();
  }

  function header(route) {
    const me = Store.currentUser();
    const link = (r, k) => `<a href="#/${r}" class="${route === r ? 'active' : ''}">${esc(t(k))}</a>`;
    return `<header class="site-header"><div class="container">
      <a class="brand" href="#/"><img src="assets/logo.svg" alt=""><div><b>إشراقة وعي</b><small>الأكاديمية الدولية للكوتشينغ</small></div></a>
      <nav class="main-nav" id="main-nav">
        ${link('', 'home')}${link('about', 'about')}${link('structure', 'structure')}${link('committees', 'committees')}${link('coaches', 'coaches')}${link('projects', 'projects')}${link('training', 'training')}${link('live', 'live')}
        <div class="dropdown"><button type="button">${esc(t('more'))} ▾</button><div class="dropdown-menu">
          ${link('management', 'management')}${link('teams', 'teams')}${link('library', 'library')}${link('news', 'news')}${link('events', 'events')}${link('certificates', 'certificates')}${link('contact', 'contact')}${link('sitemap', 'sitemap')}
        </div></div>
      </nav>
      <div class="header-actions">
        <select class="lang-select" id="lang" aria-label="Language"><option value="ar" ${lang === 'ar' ? 'selected' : ''}>ع</option><option value="fr" ${lang === 'fr' ? 'selected' : ''}>FR</option><option value="en" ${lang === 'en' ? 'selected' : ''}>EN</option></select>
        <button class="icon-btn" id="theme-btn" aria-label="Theme">🌓</button>
        <a class="btn btn-gold btn-sm btn-login-desktop" href="#/${me ? 'dashboard' : 'login'}">${esc(me ? t('dashboard') : t('login'))}</a>
        <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Menu">☰</button>
      </div></div></header>`;
  }

  function footer() {
    const a = Store.s.academy;
    return `<footer class="site-footer"><div class="container"><div class="cols">
      <div><div class="brand" style="margin-bottom:12px"><img src="assets/logo.svg" alt=""><div><b>إشراقة وعي</b><small>${esc(a.name)}</small></div></div><p>${esc(a.slogan)}</p>
        <div class="socials"><a href="#/contact">TikTok</a><a href="#/contact">YouTube</a><a href="#/contact">Facebook</a><a href="#/contact">LinkedIn</a></div></div>
      <div><h4>الأكاديمية</h4><a href="#/about">${esc(t('about'))}</a><a href="#/structure">${esc(t('structure'))}</a><a href="#/committees">${esc(t('committees'))}</a><a href="#/teams">${esc(t('teams'))}</a><a href="#/coaches">${esc(t('coaches'))}</a></div>
      <div><h4>البرامج</h4><a href="#/training">${esc(t('training'))}</a><a href="#/library">${esc(t('library'))}</a><a href="#/live">TikTok Live</a><a href="#/events">${esc(t('events'))}</a><a href="#/certificates">${esc(t('verify'))}</a></div>
      <div><h4>${esc(t('contact'))}</h4><a href="#/register">${esc(t('join'))}</a><a href="#/login">${esc(t('login'))}</a><a href="#/contact" dir="ltr">${esc(a.email)}</a></div>
    </div><div class="bottom"><span>© ${new Date().getFullYear()} ${esc(a.name)} — ${esc(t('rights'))}</span><span dir="ltr">${esc(a.domain)}</span></div></div></footer>`;
  }

  function route() {
    applyLang();
    const root = document.getElementById('app');
    const parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    const [first, second, third] = parts;

    if (first === 'dashboard') {
      Dashboard.render(root, second || 'home', third);
      window.scrollTo(0, 0);
      return;
    }
    const key = first || '';
    if (key === 'login' && Store.currentUser()) { location.hash = '#/dashboard'; return; }
    const page = PublicPages.routes[key] || PublicPages.routes[''];
    root.innerHTML = header(key) + `<main id="main">${page(second)}</main>` + (key === 'login' ? '' : footer());
    PublicPages.mount(key, root);

    root.querySelector('#lang').addEventListener('change', (e) => { lang = e.target.value; pref('ichraqa.lang', lang); route(); });
    root.querySelector('#theme-btn').addEventListener('click', toggleTheme);
    root.querySelector('#menu-toggle').addEventListener('click', () => root.querySelector('#main-nav').classList.toggle('open'));
    document.title = (key ? (root.querySelector('.page-hero h1, .login-card h2') || {}).textContent + ' — ' : '') + 'إشراقة وعي';
    window.scrollTo(0, 0);
  }

  applyTheme();
  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);

  return { t, toggleTheme };
})();
