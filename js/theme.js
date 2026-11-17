// ---------- light / dark mode: loaded in <head> so the saved mode is applied before the page is painted ----------
(function () {
  const KEY = 'ix-theme';
  const root = document.documentElement;

  function readSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY));
      return value === 'light' || value === 'dark' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-bs-theme', theme); // Bootstrap components follow the same mode
    const button = document.getElementById('themeToggle');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  // first visit: follow the system setting, afterwards: the saved choice
  let theme = readSaved() || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  apply(theme);

  document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('themeToggle');
    if (!button) return;
    apply(theme);
    button.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, JSON.stringify(theme)); } catch (e) { /* the mode still changes for this visit */ }
      apply(theme);
    });
  });

  // the same choice in another open tab
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY) return;
    const saved = readSaved();
    if (saved) { theme = saved; apply(theme); }
  });
})();
