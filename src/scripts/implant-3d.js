// 서브페이지: GNB 메가메뉴만 (main.js 미로드 · Lenis 없음)

(function () {
  var gnb = document.querySelector(".gnb");
  var megamenu = document.querySelector(".gnb__megamenu");
  var menuItems = document.querySelectorAll(".gnb__menu-item");
  var menuLinks = document.querySelectorAll(".gnb__menu-link");
  if (!gnb || !megamenu || !menuItems.length) return;

  var hideTimer = null;

  function open(activeKey) {
    megamenu.classList.add("is-open");
    alignMegaCols();
    megamenu.setAttribute("aria-hidden", "false");
    menuLinks.forEach(function (link) {
      var item = link.closest(".gnb__menu-item");
      var key = item && item.dataset.menu;
      link.classList.toggle("is-active", key === activeKey);
    });
  }

  function close() {
    megamenu.classList.remove("is-open");
    megamenu.setAttribute("aria-hidden", "true");
    menuLinks.forEach(function (link) {
      link.classList.remove("is-active");
    });
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

  megamenu.addEventListener("mouseenter", function () {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  });

  gnb.addEventListener("mouseleave", function () {
    hideTimer = setTimeout(close, 120);
  });

  var megaCols = document.querySelectorAll(".gnb__mega-col");

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
