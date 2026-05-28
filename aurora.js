/* ========================================================
   Reshape · Aurora — interactivity
   - Vanilla JS, no dependencies
   - Cursor glow, scroll-reveal, nav scroll state, mobile menu,
     marquee fallback, work filter, testimonial carousel,
     counters, contact form, newsletter
   ======================================================== */

(() => {
  "use strict";

  // ---------- CURSOR GLOW ----------
  const glow = document.getElementById("cursor-glow");
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let glowTargetX = glowX;
  let glowTargetY = glowY;

  function isFinePointer() {
    return window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }
  if (isFinePointer()) {
    document.body.classList.add("glow-on");
    document.addEventListener("pointermove", (e) => {
      glowTargetX = e.clientX;
      glowTargetY = e.clientY;
    });
    function tick() {
      glowX += (glowTargetX - glowX) * 0.12;
      glowY += (glowTargetY - glowY) * 0.12;
      glow.style.transform = `translate3d(${glowX - 320}px, ${glowY - 320}px, 0)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------- NAV SCROLL STATE ----------
  const nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- MOBILE MENU ----------
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    burger.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // ---------- REVEAL ON SCROLL ----------
  // Opt-in pattern: elements are visible by CSS default. Only when this
  // script is confident IO works do we hide them and animate them in.
  // If IO never fires (some screenshot tools, throttled engines), the
  // safety timeout below reveals everything so content is never invisible.
  const reveals = document.querySelectorAll("[data-reveal]");
  const supportsIO = "IntersectionObserver" in window;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (supportsIO && !reduceMotion) {
    document.body.classList.add("js-reveals");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));

    // Trip anything currently above the fold immediately (covers cases
    // where IO doesn't fire for elements that are already intersecting).
    requestAnimationFrame(() => {
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-in");
        }
      });
    });

    // Safety net: if anything is somehow still hidden after 2s, reveal it.
    setTimeout(() => {
      reveals.forEach((el) => el.classList.add("is-in"));
    }, 2000);
  }

  // ---------- WORK FILTER (removed) ----------

  // ---------- TESTIMONIAL CAROUSEL (removed) ----------

  // ---------- STAT COUNTERS ----------
  const stats = document.querySelectorAll("[data-count]");
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toString();
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      statIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  stats.forEach((s) => statIo.observe(s));

  // ---------- CONTACT FORM (removed) ----------

  // ---------- NEWSLETTER (removed) ----------

  // ---------- HERO RIBBON SUBTLE PARALLAX ----------
  const ribbon = document.querySelector(".hero__ribbon");
  if (ribbon && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let raf;
    window.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 1200) {
          ribbon.style.transform = `translateY(${y * 0.12}px)`;
        }
        raf = null;
      });
    }, { passive: true });
  }

  // ---------- SMOOTH SCROLL FOR # LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

})();
