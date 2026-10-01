# Repository Guidelines

## Project Structure & Module Organization
- Root pages: `index.html`, `insights.html`, `404.html`.
- Case studies: `cases/` (one page per case, e.g., `cases/observability.html`).
- Assets: `assets/css/`, `assets/js/`, `assets/images/`. Site JS entry: `assets/js/main.js`; styles: `assets/css/main.css`.
- Jekyll disabled via `.nojekyll`; GitHub Pages serves files as‑is (no build step).

## Build, Test, and Development Commands
- Serve locally: `python3 -m http.server 8080` then open `http://localhost:8080`.
- Optional live‑server: `npx serve` (if Node is installed).
- Deploy: push to `main`; GitHub Pages publishes automatically.

## Coding Style & Naming Conventions
- Indentation: 2 spaces for HTML, CSS, JS.
- HTML: semantic sections; use existing class patterns (kebab‑case like `site-header`, `hero-cta`).
- CSS: keep variables in `:root`; group related rules; prefer utility‑like small blocks; avoid inline styles.
- JS: modern DOM APIs, `const/let`, arrow functions, template literals; keep logic in `assets/js/main.js`.
- Filenames: kebab‑case (`telecom-architecture.html`, `main.css`).

## Testing Guidelines
- Validate locally: open pages, check navigation, anchors, and case links.
- Console clean: no errors in DevTools; network calls to GitHub API should not fail silently.
- Accessibility & performance (recommended): run Lighthouse in the browser; ensure sufficient color contrast.
- Link check (optional): `npx linkinator .` if available.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise subject (<=72 chars), e.g., `Add telecom architecture case`.
- Scope small, descriptive bodies when changing UX or behavior.
- PRs: include summary, screenshots of UI changes, affected pages/paths, and manual test notes (local URL, browsers).
- Reference issues when relevant; note any follow‑ups.

## Security & Configuration Tips
- No secrets in repo. For higher GitHub API limits locally, store a token only in browser `localStorage` (key `GH_TOKEN`); never commit it.
- Keep external links `rel="noopener"` and JS minimal to reduce risk.
