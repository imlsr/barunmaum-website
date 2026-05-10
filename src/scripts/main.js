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
