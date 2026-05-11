// 서브페이지: GNB 메가메뉴만 (main.js 미로드 · Lenis 없음)
// — main.js의 스크롤·hero-compact 토글 없음. 흰 배경(Type A)은 HTML의 body.hero-compact + 아래 보강.

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

// === TOP 플로팅 + Scroll Reveal — main.js와 동일 (서브는 #s01 없을 때 스크롤 500px 기준 표시) ===
(function () {
  var s01 = document.getElementById("s01");
  var fabStack = document.getElementById("fab-stack");
  var fabTop = fabStack && fabStack.querySelector(".fab--top");

  function updateFabVisibility() {
    if (!fabStack) return;
    var visible;
    if (s01) {
      var top = s01.getBoundingClientRect().top;
      visible = top < window.innerHeight * 0.92;
    } else {
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      visible = y >= 500;
    }
    fabStack.classList.toggle("is-visible", visible);
    fabStack.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  window.addEventListener("scroll", updateFabVisibility, { passive: true });
  window.addEventListener("resize", updateFabVisibility, { passive: true });
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
