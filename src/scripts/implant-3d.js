// === Lenis — main.js 와 동일. 뷰포트 768px 이하에서는 비활성(네이티브 스크롤) ===
if (typeof Lenis !== "undefined" && window.innerWidth > 768) {
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

// 서브페이지: body hero-compact 고정
// — 흰 배경(Type A)은 HTML 의 body.hero-compact + 아래 보강.

(function () {
  var body = document.body;
  if (body && body.classList.contains("is-subpage")) {
    body.classList.add("hero-compact");
    var header = document.querySelector(".gnb");
    if (header) header.classList.add("is-scrolled");
  }
})();

(function () {
  var gnb = document.querySelector(".gnb");
  var megamenu = document.querySelector(".gnb__megamenu");
  var menuItems = document.querySelectorAll(".gnb__menu-item");
  var menuLinks = document.querySelectorAll(".gnb__menu-link");
  if (!gnb || !megamenu || !menuItems.length) return;

  var hideTimer = null;

  var megaCols = document.querySelectorAll(".gnb__mega-col");

  function syncActiveMenus(activeKey) {
    menuItems.forEach(function (item) {
      var key = item.dataset.menu;
      var on =
        typeof activeKey !== "undefined" &&
        activeKey !== null &&
        activeKey !== "" &&
        key === activeKey;
      item.classList.toggle("is-active", on);
      var link = item.querySelector(".gnb__menu-link");
      if (link) link.classList.toggle("is-active", on);
    });
  }

  function open(activeKey) {
    megamenu.classList.add("is-open");
    alignMegaCols();
    megamenu.setAttribute("aria-hidden", "false");
    syncActiveMenus(activeKey);
  }

  function close() {
    megamenu.classList.remove("is-open");
    megamenu.setAttribute("aria-hidden", "true");
    syncActiveMenus(undefined);
  }

  menuItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      open(item.dataset.menu);
    });
  });

  megaCols.forEach(function (col) {
    col.addEventListener("mouseenter", function () {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      var ck = col.dataset.col;
      if (ck) open(ck);
    });
  });

  megamenu.addEventListener("mouseenter", function () {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  });

  gnb.addEventListener("mouseleave", function () {
    hideTimer = setTimeout(close, 120);
  });

  function alignMegaCols() {
    if (!megamenu) return;
    var megamenuRect = megamenu.getBoundingClientRect();
    menuLinks.forEach(function (link, i) {
      var col = megaCols[i];
      if (!col) return;
      var linkRect = link.getBoundingClientRect();
      var linkCenterX = linkRect.left + linkRect.width / 2;
      var relativeLeft = linkCenterX - megamenuRect.left;
      col.style.left = relativeLeft + "px";
    });
  }

  alignMegaCols();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignMegaCols);
  }

  window.addEventListener("load", alignMegaCols);
  window.addEventListener("resize", alignMegaCols, { passive: true });
})();

// === TOP 플로팅 — main.js 패턴 + 서브는 #s01 없을 때 스크롤 500px 기준, Lenis 연동 ===
(function () {
  var s01 = document.getElementById("s01");
  var fabStack = document.getElementById("fab-stack");
  var fabTop = fabStack && fabStack.querySelector(".fab--top");

  function getScrollTop() {
    if (window.lenis && typeof window.lenis.scroll === "number") {
      return window.lenis.scroll;
    }
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function updateFabVisibility() {
    if (!fabStack) return;
    var visible;
    if (s01) {
      var top = s01.getBoundingClientRect().top;
      visible = top < window.innerHeight * 0.92;
    } else {
      visible = getScrollTop() >= 500;
    }
    fabStack.classList.toggle("is-visible", visible);
    fabStack.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  window.addEventListener("scroll", updateFabVisibility, { passive: true });
  window.addEventListener("resize", updateFabVisibility, { passive: true });
  if (window.lenis) {
    window.lenis.on("scroll", updateFabVisibility);
  }
  updateFabVisibility();

  if (fabTop) {
    fabTop.addEventListener("click", function () {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
})();

// === Scroll Reveal — main.js 와 동일 ( .reveal · .reveal-stagger · .reveal-card )
var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  }
);

document.querySelectorAll(".reveal, .reveal-stagger, .reveal-card").forEach(function (el) {
  revealObserver.observe(el);
});

// === S01 Hero 진입 인터랙션 — 페이지 로드 직후 자동 트리거 ===
// 카드 배경: 가운데에서 양옆으로 펼침 (clip-path)
// 타이틀: 위에서 아래로 슬라이드 인
// 설명(lead): 아래에서 위로 슬라이드 인
(function () {
  function initHeroReveal() {
    var heroCard = document.querySelector(".implant-i3d-hero__card");
    if (!heroCard) return;
    // 살짝 딜레이 → 첫 페인트 후 트리거(자연스러움)
    setTimeout(function () {
      heroCard.classList.add("is-revealed");
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroReveal);
  } else {
    initHeroReveal();
  }
})();
