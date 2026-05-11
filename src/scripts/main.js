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


// === S04 대표원장 탭 전환 ===
(function () {
  var doctors = [
    {
      id: 'kimsj',
      name: '김성재',
      title: '대표원장',
      specialty: '통합치의학과 전문의',
      image: '../../public/images/doctors/doctor_01.jpg',
      credentials: [
        '보건복지부인증 통합치의학과 전문의',
        '경희대학교 치과대학병원 외래교수',
        '경희대학교 치의학전문대학원 졸업',
        '경희대학교 치의학대학원 박사 수료 (치과보존학 전공)',
        '미국 HARVARD MEDICAL SCHOOL CME',
        '세계 임플란트학회(ICOI) 정회원',
        '미국 치과임플란트학회(AAID) 정회원',
        '미국 심미치과학회(AACD) 정회원',
        '대한 구강악안면 임플란트학회 정회원',
        '대한 치과보존학회 정회원',
        '대한 턱관절교합학회 정회원',
      ],
    },
    {
      id: 'leesh',
      name: '이세한',
      title: '원장',
      specialty: '치과보철과 전문의',
      image: '../../public/images/doctors/doctor_02.jpg',
      credentials: [
        '보건복지부인증 치과보철과 전문의',
        '보건복지부인증 통합치의학과 전문의',
        '하버드대학교 Implant & Prosthodontics 과정 수료',
        '조선대치과병원 치과보철과 인턴 및 레지던트 수료',
        '조선대학교 치의학 박사 과정',
        '대한치과보철학회 정회원 및 인정의',
        '대한구강악안면임플란트학회 정회원',
        'Dentalbean implant course 수료',
        '2018 International Association for Dental Research 학술발표',
        '대한턱관절교합학회지 논문 등재',
        '전) 가이드본치과 원장',
      ],
    },
    {
      id: 'yangsw',
      name: '양승원',
      title: '원장',
      specialty: '치과보철과 전문의',
      image: '../../public/images/doctors/doctor_03.jpg',
      credentials: [
        '보건복지부인증 치과보철과 전문의',
        '보건복지부인증 통합치의학과 전문의',
        '연세대학교 치의학과 졸업',
        '연세대학교 치의학과 석사',
        '연세대학교 치의학과 박사',
        '연세대학교 치과대학병원 인턴 수료',
        '연세대학교 치과대학병원 보철과 레지던트 수료',
        '대한치과보철학회 정회원 및 인정의',
        '전) 연세대학교 치과대학병원 외래교수',
      ],
    },
  ];

  var tabs = document.querySelectorAll('.s04-tab');
  if (!tabs.length) return;

  var marker = document.querySelector('.s04-tab-marker');
  var imgWrap = document.querySelector('.s04-img');
  var img = imgWrap && imgWrap.querySelector('img');
  var content = document.querySelector('.s04-content');
  if (!marker || !img || !content) return;

  var specialtyEl = content.querySelector('.s04-specialty');
  var nameEl = content.querySelector('.s04-name');
  var credentialsEl = content.querySelector('.s04-credentials');

  var fadeTimer = null;
  var currentIdx = -1;

  img.addEventListener('error', function () {
    console.warn(
      '[S04] 대표원장 이미지를 찾을 수 없습니다: ' + img.src +
      '\n→ public/images/doctors/ 폴더에 doctor_01.jpg / doctor_02.jpg / doctor_03.jpg 파일을 추가하세요.'
    );
  });

  function applyContent(doctor) {
    img.src = doctor.image;
    img.alt = doctor.name + ' ' + doctor.title;
    specialtyEl.textContent = doctor.specialty;
    nameEl.innerHTML = '<strong>' + doctor.name + ' </strong><span>' + doctor.title + '</span>';
    credentialsEl.innerHTML = doctor.credentials
      .map(function (c) { return '<li>' + c + '</li>'; })
      .join('');
  }

  function activate(idx) {
    if (idx === currentIdx) return;
    var doctor = doctors[idx];
    if (!doctor) return;

    if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }

    tabs.forEach(function (t, i) {
      var isActive = i === idx;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    marker.style.transform = 'translateY(' + (idx * 48) + 'px)';

    if (currentIdx === -1) {
      applyContent(doctor);
      currentIdx = idx;
      return;
    }

    imgWrap.classList.add('is-fading');
    content.classList.add('is-fading');

    fadeTimer = setTimeout(function () {
      applyContent(doctor);
      imgWrap.classList.remove('is-fading');
      content.classList.remove('is-fading');
      fadeTimer = null;
    }, 200);

    currentIdx = idx;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var idx = parseInt(tab.getAttribute('data-index'), 10);
      if (!isNaN(idx)) activate(idx);
    });
  });

  activate(0);
})();
