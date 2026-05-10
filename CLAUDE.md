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

**Live Server 접근 URL**: `http://localhost:8080` → 루트 `index.html`이 자동으로 `src/pages/index.html`로 redirect.  
직접 접근: `http://localhost:8080/src/pages/index.html`

## Architecture

This is a **zero-build static site** — plain HTML/CSS/JS, no framework, no bundler.

```
barunmaum-website/
├── index.html              ← redirect 전용 (→ src/pages/index.html)
├── src/
│   ├── pages/
│   │   └── index.html      ← 실제 진입점 (모든 HTML)
│   ├── scripts/
│   │   └── main.js         ← 런타임 동작 (scroll, reveal, FAB)
│   └── styles/
│       ├── main.css        ← @import 진입점 (내용 없음, 순서만)
│       ├── base/
│       │   ├── tokens.css      ← :root CSS 변수 (Design tokens)
│       │   ├── reset.css       ← 리셋
│       │   ├── utilities.css   ← .btn, .reveal, .fab-stack, .container
│       │   └── responsive.css  ← prefers-reduced-motion + 미디어쿼리
│       ├── layout/
│       │   ├── gnb.css         ← GNB / site-header
│       │   └── footer.css      ← Footer
│       └── sections/
│           ├── hero.css    ← S00 비디오 히어로
│           ├── s01.css     ← S01 약속
│           ├── s02.css     ← S02 진료·마키
│           ├── s03.css     ← S03 스토리
│           ├── s04.css     ← S04 대표원장
│           ├── s05.css     ← S05 통계
│           ├── s06.css     ← S06 자연치아 CTA
│           ├── s07.css     ← S07 오시는 길
│           └── cta.css     ← 하단 CTA + float 애니메이션
└── public/
    ├── images/             ← 섹션별 이미지 (s01-card-*, s03-bg, etc.)
    │   └── s02_thum/       ← 진료 카드 썸네일 6장
    ├── video/
    │   └── main_video.mp4  ← 히어로 배경 영상
    ├── fonts/              ← 웹폰트 (현재 CDN 사용)
    └── icons/              ← SVG 아이콘 예정
```

## CSS 구조 (`src/styles/`)

`main.css`는 `@import`만 모아둔 진입점. 섹션별 파일에 직접 수정.

cascade 순서 (main.css @import 순서가 원본과 동일):
1. **tokens.css** — `:root` CSS 변수. Figma 변수명 1:1 매핑. 하드코딩 금지.
2. **reset.css** — box-sizing, body, img, a 리셋
3. **utilities.css** — `.btn`, `.reveal`, `.reveal-stagger`, `.fab-stack`, `.container`, `.placeholder`
4. **gnb.css** — `.site-header.gnb`, `.gnb__*`
5. **footer.css** — `.footer`, `.footer__*`
6. **hero.css ~ cta.css** — 섹션별 스타일
7. **responsive.css** — `prefers-reduced-motion` + `@media (max-width: 1400/1024/768/480px)`

Responsive breakpoints: `1400px / 1024px / 768px / 480px`. 디자인 기준 `1920px`, 컨테이너 `1400px`.

## JavaScript (`src/scripts/main.js`)

세 가지 독립 동작, 순서대로 실행:

1. **Lenis smooth scroll** — 최상단에서 초기화; `window.lenis`가 전역 핸들.
2. **GNB hero-compact + FAB visibility** — `scroll`/`resize` 리스닝; `body.hero-compact`와 `.fab-stack.is-visible` 토글.
3. **Hero card transform** — `.hero` 요소의 `--hero-margin`·`--hero-radius` CSS 변수를 스크롤에 맞춰 애니메이션, 풀페이지 → 카드 전환 구현.

Scroll reveal: `IntersectionObserver`가 `.reveal` / `.reveal-stagger` 요소 감시 → `.is-visible` 추가.

## 에셋 경로 규칙

HTML(`src/pages/index.html`) 기준 상대 경로:

| 대상 | 경로 |
|---|---|
| CSS | `../styles/main.css` |
| JS | `../scripts/main.js` |
| 이미지 | `../../public/images/파일명` |
| 동영상 | `../../public/video/파일명` |

**Figma URL 잔존**: 아직 다운받지 않은 이미지는 `https://www.figma.com/api/mcp/asset/…` 유지.  
다운로드 후 `public/images/` 하위에 배치하고 경로 교체.

## Fonts

- **Pretendard** (한국어 본문) — CDN `<link>` 로드
- **Outfit** (영문 헤드라인) — Google Fonts

## Code conventions

- **HTML**: semantic landmark (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`); 장식 이미지 `alt=""` + `aria-hidden="true"`; 인터랙티브 이미지 설명 `alt`.
- **CSS**: BEM 네이밍 (`block__element--modifier`). 섹션 ID는 Figma 프레임 참조 HTML 주석과 매핑 (e.g. `<!-- Figma 249:863 -->`).
- **JS**: ES5 호환; 전역 스코프에 `const`/`let` 사용하지 않음 (`var` 사용); Lenis 외 외부 의존성 없음 (CDN `<script>`로 `main.js` 앞에 로드).
- **Formatting**: Prettier `printWidth: 100` (HTML: 120), 2-space indent, LF, double quotes, trailing commas (ES5).
