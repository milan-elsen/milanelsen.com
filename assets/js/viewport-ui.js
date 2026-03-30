(function () {
  function alignRailEmail() {
    var sideRail = document.querySelector(".side-rail");
    var email = document.querySelector(".side-rail-email");
    var links = document.querySelector(".side-rail-links");
    if (!sideRail || !email || !links) {
      return;
    }

    if (window.innerWidth < 981) {
      email.style.top = "";
      return;
    }

    email.style.top = "44%";
  }

  function pinBurgerToViewport() {
    var burgerWrap = document.querySelector(".header-burger");
    if (!burgerWrap) {
      return;
    }

    var vv = window.visualViewport;
    var rafId = 0;

    function updateBurgerPosition() {
      var topBaseRem = 0.8;
      var rightBaseRem = 1.25;
      var offsetTop = vv ? vv.offsetTop : 0;
      var offsetLeft = vv ? vv.offsetLeft : 0;
      burgerWrap.style.top = "calc(" + topBaseRem + "rem + " + offsetTop + "px)";
      burgerWrap.style.right = "calc(" + rightBaseRem + "rem - " + offsetLeft + "px)";
    }

    function startTracking() {
      if (rafId) {
        return;
      }

      function tick() {
        updateBurgerPosition();
        rafId = window.requestAnimationFrame(tick);
      }

      rafId = window.requestAnimationFrame(tick);
    }

    function stopTracking() {
      if (!rafId) {
        return;
      }
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function applyTracking() {
      if (window.innerWidth <= 600) {
        startTracking();
      } else {
        stopTracking();
        updateBurgerPosition();
      }
    }

    updateBurgerPosition();
    window.addEventListener("scroll", updateBurgerPosition, { passive: true });
    window.addEventListener("resize", applyTracking);
    window.addEventListener("orientationchange", applyTracking);

    if (vv) {
      vv.addEventListener("scroll", updateBurgerPosition);
      vv.addEventListener("resize", applyTracking);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopTracking();
      } else {
        applyTracking();
      }
    });

    applyTracking();
  }

  function pinSideRailToViewport() {
    var rail = document.querySelector(".side-rail");
    if (!rail) {
      return;
    }

    var vv = window.visualViewport;
    var rafId = 0;

    function updateRailPosition() {
      var offsetTop = vv ? vv.offsetTop : 0;
      var offsetLeft = vv ? vv.offsetLeft : 0;
      var viewportHeight = vv ? vv.height : window.innerHeight;

      rail.style.top = offsetTop + "px";
      rail.style.right = (-offsetLeft) + "px";
      rail.style.height = viewportHeight + "px";
    }

    function startTracking() {
      if (rafId) {
        return;
      }

      function tick() {
        updateRailPosition();
        rafId = window.requestAnimationFrame(tick);
      }

      rafId = window.requestAnimationFrame(tick);
    }

    function stopTracking() {
      if (!rafId) {
        return;
      }
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function applyTracking() {
      if (window.innerWidth > 600) {
        startTracking();
      } else {
        stopTracking();
      }
      updateRailPosition();
    }

    updateRailPosition();
    window.addEventListener("resize", applyTracking);
    window.addEventListener("orientationchange", applyTracking);

    if (vv) {
      vv.addEventListener("scroll", updateRailPosition);
      vv.addEventListener("resize", applyTracking);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopTracking();
      } else {
        applyTracking();
      }
    });

    applyTracking();
  }

  function setupMobileMenu() {
    var burger = document.querySelector(".header-burger-btn");
    var menu = document.querySelector(".header-menu");
    if (!burger || !menu) {
      return;
    }

    var scrollLockY = 0;

    function lockPageScroll() {
      scrollLockY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = "-" + scrollLockY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    function unlockPageScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollLockY);
    }

    function closeMenu() {
      document.body.classList.remove("header--menu-open");
      document.documentElement.classList.remove("header--menu-open");
      unlockPageScroll();
      burger.setAttribute("aria-expanded", "false");
      burger.classList.remove("burger--active");
      burger.querySelector(".js-header-burger-open-title")?.removeAttribute("hidden");
      burger.querySelector(".js-header-burger-close-title")?.setAttribute("hidden", "");
    }

    function toggleMenu() {
      var isOpen = document.body.classList.toggle("header--menu-open");
      document.documentElement.classList.toggle("header--menu-open", isOpen);
      if (isOpen) {
        lockPageScroll();
      } else {
        unlockPageScroll();
      }
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burger.classList.toggle("burger--active", isOpen);
      if (isOpen) {
        burger.querySelector(".js-header-burger-open-title")?.setAttribute("hidden", "");
        burger.querySelector(".js-header-burger-close-title")?.removeAttribute("hidden");
      } else {
        burger.querySelector(".js-header-burger-open-title")?.removeAttribute("hidden");
        burger.querySelector(".js-header-burger-close-title")?.setAttribute("hidden", "");
      }
    }

    burger.addEventListener("click", function (event) {
      event.preventDefault();
      toggleMenu();
    });

    menu.addEventListener("click", function (event) {
      if (event.target === menu || event.target.classList.contains("header-menu-bg")) {
        closeMenu();
      }
    });

    var menuLinks = menu.querySelectorAll("a");
    menuLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  function init() {
    window.addEventListener("resize", alignRailEmail);
    pinBurgerToViewport();
    pinSideRailToViewport();
    setupMobileMenu();
    alignRailEmail();
    window.addEventListener("load", function () {
      alignRailEmail();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
