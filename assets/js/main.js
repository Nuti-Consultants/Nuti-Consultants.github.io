document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (nav.style.display === 'flex') nav.style.display = 'none';
      else { nav.style.display = 'flex'; nav.style.flexDirection = 'column'; }
    });
  }
  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); history.replaceState(null,'',id); }
      }
    });
  });

  // GitHub Activity (combined across two accounts)
  const activityEl = document.getElementById('gh-activity');
  if (activityEl) {
    (async function loadGH() {
      try {
        const users = ['JagannathS','sjagannath05'];
        const token = (new URLSearchParams(location.search).get('gh') || localStorage.getItem('GH_TOKEN') || '').trim();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const fetchJSON = (url) => fetch(url, { headers }).then(r => r.json());

        let totals = { repos: 0, followers: 0, stars: 0 };
        let reposAll = [];
        for (const u of users) {
          const udata = await fetchJSON(`https://api.github.com/users/${u}`);
          const repos = await fetchJSON(`https://api.github.com/users/${u}/repos?per_page=100&sort=updated`);
          totals.repos += (udata.public_repos || 0);
          totals.followers += (udata.followers || 0);
          totals.stars += (repos || []).reduce((s, r) => s + (r.stargazers_count || 0), 0);
          reposAll = reposAll.concat(repos || []);
        }
        // Deduplicate by full_name and sort by pushed_at desc
        const dedup = new Map();
        for (const r of reposAll) { if (!dedup.has(r.full_name)) dedup.set(r.full_name, r); }
        const recent = Array.from(dedup.values()).sort((a,b) => new Date(b.pushed_at)-new Date(a.pushed_at)).slice(0,6);

        activityEl.innerHTML = `
          <div class="grid">
            <div class="card"><h3>Total Public Repos</h3><p style="font-size:24px;font-weight:700;">${totals.repos}</p></div>
            <div class="card"><h3>Total Stars</h3><p style="font-size:24px;font-weight:700;">${totals.stars}</p></div>
            <div class="card"><h3>Followers</h3><p style="font-size:24px;font-weight:700;">${totals.followers}</p></div>
          </div>
          <h3 style="margin-top:24px">Recent Repositories</h3>
          <div class="grid">
            ${recent.map(r => `
              <div class="card">
                <h4 style="margin:0 0 6px"><a href="${r.html_url}" target="_blank" rel="noopener">${r.full_name}</a></h4>
                <p class="muted">★ ${r.stargazers_count} • Updated ${new Date(r.pushed_at).toLocaleDateString()}</p>
              </div>
            `).join('')}
          </div>
        `;
      } catch (e) {
        activityEl.innerHTML = '<p>Unable to load GitHub activity right now.</p>';
      }
    })();
  }
});

/* Hero diagram: show each network path in turn above the static platform band.
   Auto-advancing content that carries meaning needs a pause control (WCAG 2.2.2),
   and anyone who has asked for reduced motion gets one complete path, no cycling. */
(function () {
  var wrap = document.querySelector('.sigpath');
  if (!wrap) return;
  var paths = Array.prototype.slice.call(wrap.querySelectorAll('.sig-path'));
  var now = wrap.querySelector('.sig-now');
  var btn = wrap.querySelector('.sig-pause');
  var desc = document.getElementById('sigDesc');
  if (!paths.length) return;

  var i = 0, timer = null, paused = false;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(n) {
    paths.forEach(function (p, k) { p.classList.toggle('is-on', k === n); });
    var p = paths[n];
    if (now) now.textContent = p.getAttribute('data-name') || '';
    if (desc) desc.textContent = p.getAttribute('data-desc') || '';
  }
  function advance() { i = (i + 1) % paths.length; show(i); }
  function start() { stop(); timer = setInterval(advance, 6000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  show(0);
  if (reduced) { if (btn) btn.hidden = true; return; }
  start();

  if (btn) {
    btn.addEventListener('click', function () {
      paused = !paused;
      if (paused) { stop(); btn.textContent = 'Play'; btn.setAttribute('aria-label', 'Resume the diagram'); }
      else { start(); btn.textContent = 'Pause'; btn.setAttribute('aria-label', 'Pause the diagram'); }
    });
  }
  // don't animate in a background tab
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else if (!paused) start();
  });
})();
