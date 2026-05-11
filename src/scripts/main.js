// === Lenis: 부드러운 스크롤 ===
if (typeof Lenis !== 'undefined') {
  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });
  window.lenis = lenis;

  function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  }
  requestAnimationFrame(lenisRaf);
}

(function () {
  var COMPACT_AFTER = 48;

  function updateHeroCompact() {
    var y =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    document.body.classList.toggle('hero-compact', y >= COMPACT_AFTER);
  }

  window.addEventListener('scroll', updateHeroCompact, { passive: true });
  window.addEventListener('resize', updateHeroCompact, { passive: true });
  updateHeroCompact();

  /* S01(약속 섹션) 상단이 뷰포트에 들어오면 플로팅 버튼 노출 */
  var s01 = document.getElementById('s01');
  var fabStack = document.getElementById('fab-stack');
  var fabTop = fabStack && fabStack.querySelector('.fab--top');

  function updateFabVisibility() {
    if (!s01 || !fabStack) return;
    var top = s01.getBoundingClientRect().top;
    var visible = top < window.innerHeight * 0.92;
    fabStack.classList.toggle('is-visible', visible);
    fabStack.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  window.addEventListener('scroll', updateFabVisibility, { passive: true });
  window.addEventListener('resize', updateFabVisibility, { passive: true });
  updateFabVisibility();

  if (fabTop) {
    fabTop.addEventListener('click', function () {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
})();

// === Scroll Reveal ===
var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  }
);

document.querySelectorAll('.reveal, .reveal-stagger, .reveal-card').forEach(function (el) {
  revealObserver.observe(el);
});

// === 히어로 풀페이지 → 카드 변환 인터랙션 ===
(function () {
  var heroEl = document.querySelector('.hero');
  if (!heroEl) return;

  var TRANSFORM_END = 400;
  var TARGET_MARGIN = 40;
  var TARGET_RADIUS = 40;

  function updateHeroTransform(scrollYArg) {
    var scrollY =
      typeof scrollYArg === 'number' && !isNaN(scrollYArg)
        ? scrollYArg
        : window.scrollY || window.pageYOffset || 0;
    var progress = Math.min(Math.max(scrollY / TRANSFORM_END, 0), 1);

    var margin = TARGET_MARGIN * progress;
    var radius = TARGET_RADIUS * progress;

    heroEl.style.setProperty('--hero-margin', margin + 'px');
    heroEl.style.setProperty('--hero-radius', radius + 'px');
  }

  var rafId = null;
  function onScroll() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(function () {
      updateHeroTransform();
      rafId = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  updateHeroTransform();

  if (typeof window.lenis !== 'undefined' && window.lenis) {
    window.lenis.on('scroll', function (e) {
      var y =
        e && typeof e.scroll === 'number'
          ? e.scroll
          : window.lenis.scroll;
      updateHeroTransform(y);
    });
  }
})();


// === GNB 메가 메뉴 호버 토글 + 컬럼 정렬 ===
(function () {
  var gnb = document.querySelector('.gnb');
  var megamenu = document.querySelector('.gnb__megamenu');
  var menuItems = document.querySelectorAll('.gnb__menu-item');
  var menuLinks = document.querySelectorAll('.gnb__menu-link');
  var megaCols = document.querySelectorAll('.gnb__mega-col');
  if (!gnb || !megamenu || !menuItems.length) return;

  var hideTimer = null;

  function open(activeKey) {
    megamenu.classList.add('is-open');
    alignMegaCols();
    megamenu.setAttribute('aria-hidden', 'false');
    menuLinks.forEach(function (link) {
      var item = link.closest('.gnb__menu-item');
      var key = item && item.dataset.menu;
      link.classList.toggle('is-active', key === activeKey);
    });
  }

  function close() {
    megamenu.classList.remove('is-open');
    megamenu.setAttribute('aria-hidden', 'true');
    menuLinks.forEach(function (link) {
      link.classList.remove('is-active');
    });
  }

  menuItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      open(item.dataset.menu);
    });
  });

  megamenu.addEventListener('mouseenter', function () {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  });

  gnb.addEventListener('mouseleave', function () {
    hideTimer = setTimeout(close, 120);
  });

  // mega-col 의 left 를 위쪽 menu-link 중심 X 좌표에 매칭
  function alignMegaCols() {
    if (!megamenu) return;
    var megamenuRect = megamenu.getBoundingClientRect();
    menuLinks.forEach(function (link, i) {
      var col = megaCols[i];
      if (!col) return;
      var linkRect = link.getBoundingClientRect();
      var linkCenterX = linkRect.left + linkRect.width / 2;
      var relativeLeft = linkCenterX - megamenuRect.left;
      col.style.left = relativeLeft + 'px';
    });
  }

  alignMegaCols();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignMegaCols);
  }
  window.addEventListener('load', alignMegaCols);
  window.addEventListener('resize', alignMegaCols, { passive: true });
})();
