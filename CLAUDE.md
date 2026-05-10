# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install          # first-time setup
npm run dev          # live-server at http://localhost:8080 (auto-reload on save)
npm run format       # Prettier — write
npm run format:check # Prettier — check only
```

No build step. Files are served directly; changes are reflected immediately via live-server.

## Architecture

This is a **zero-build static site** — plain HTML/CSS/JS, no framework, no bundler.

| File | Role |
|---|---|
| `index.html` | Single page; all sections are inline |
| `style.css` | Design tokens + all section styles |
| `main.js` | Runtime behaviours (scroll, reveal, FAB) |
| `assets/` | Images and hero video (`assets/video/main_video.mp4`) |

### CSS structure (`style.css`)

The file is split into clearly labelled blocks:

1. **Design system tokens** — `:root` CSS custom properties. Variable names mirror Figma variable names 1:1. Always use these tokens; never hard-code raw values.
2. **Reset**
3. **Global utilities** — `.btn`, `.reveal`, `.reveal-stagger`
4. **GNB / header** — `.gnb`, `.gnb--overlay`, `.site-header`
5. **Section blocks** — `.section-s01` through `.section-s07`, `.section-cta`, `.footer`, `.fab-stack`

Responsive breakpoints: `1400px / 1024px / 768px / 480px`. Design reference is `1920px` wide; container max-width is `1400px`.

### JavaScript (`main.js`)

Three self-contained behaviours, executed in order:

1. **Lenis smooth scroll** — initialized at the top; `window.lenis` is the global handle used by later code.
2. **GNB hero-compact + FAB visibility** — IIFE listening to `scroll`/`resize`; toggles `body.hero-compact` and `.fab-stack.is-visible`.
3. **Hero card transform** — IIFE that animates `--hero-margin` and `--hero-radius` CSS variables on the `.hero` element as the user scrolls, creating a full-page → card transition. Hooks into both native `scroll` and `lenis.on('scroll')` to stay in sync.

Scroll reveal works via `IntersectionObserver` watching elements with `.reveal` or `.reveal-stagger`; it adds `.is-visible` once.

### Figma integration

Images currently sourced from `https://www.figma.com/api/mcp/asset/…` are design assets fetched directly via Figma MCP. When replacing with production assets, swap those URLs with paths under `assets/`.

### Fonts

- **Pretendard** (Korean body) — loaded from CDN via `<link>` in `<head>`
- **Outfit** (English headlines) — Google Fonts

## Code conventions

- **HTML**: semantic landmark elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`); decorative images get `alt=""` and `aria-hidden="true"`; interactive images get descriptive `alt`.
- **CSS**: BEM naming (`block__element--modifier`). Section IDs map to Figma frame references noted in HTML comments (e.g. `<!-- Figma 249:863 -->`).
- **JS**: ES5-compatible; no `const`/`let` in global scope (uses `var`); no external dependencies beyond Lenis (loaded via CDN `<script>` before `main.js`).
- **Formatting**: Prettier enforces `printWidth: 100` (HTML: 120), 2-space indent, LF line endings, double quotes, trailing commas in ES5 positions.
