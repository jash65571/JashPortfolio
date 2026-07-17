(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initHeroParallax();
    initStylistFlip();
    initBookingForm();
    initFooterYear();
    initBackToTop();
  });

  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const toggle = () => header.classList.toggle("scrolled", window.scrollY > 8);
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  function initMobileNav() {
    const toggleBtn = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    if (!toggleBtn || !nav) return;
    const close = () => { nav.classList.remove("open"); toggleBtn.setAttribute("aria-expanded", "false"); };
    const open = () => { nav.classList.add("open"); toggleBtn.setAttribute("aria-expanded", "true"); };
    toggleBtn.addEventListener("click", () => (nav.classList.contains("open") ? close() : open()));
    nav.querySelectorAll("a").forEach((l) => l.addEventListener("click", close));
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(e.target) || toggleBtn.contains(e.target)) return;
      close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  function initHeroParallax() {
    const bg = document.getElementById("hero-bg");
    if (!bg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const update = () => {
      bg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* stylist card flip: hover works via CSS alone; this adds tap + keyboard
     support so touch and keyboard-only users can flip cards too */
  function initStylistFlip() {
    const cards = document.querySelectorAll(".stylist-card");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".stylist-link")) return; // let the link work normally
        card.classList.toggle("flipped");
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("flipped");
        }
      });
    });
  }

  function initBookingForm() {
    const form = document.getElementById("booking-form");
    const success = document.getElementById("booking-success");
    const submitBtn = document.getElementById("booking-submit");
    if (!form) return;

    const validators = {
      name: (v) => v.trim().length > 1,
      phone: (v) => /^[\d\s\-()+]{7,}$/.test(v.trim()),
      stylist: (v) => v.trim().length > 0,
      service: (v) => v.trim().length > 0,
    };

    function validateField(field) {
      const wrapper = field.closest(".field");
      if (!wrapper) return true;
      const validator = validators[field.name];
      const valid = validator ? validator(field.value) : true;
      wrapper.classList.toggle("invalid", !valid);
      return valid;
    }

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const honeypot = form.querySelector('[name="company"]');
      if (honeypot && honeypot.value.trim() !== "") return;

      const fields = Array.from(form.querySelectorAll("input:not(.hp-field), select, textarea"));
      const requiredFields = fields.filter((f) => validators[f.name]);
      const allValid = requiredFields.map((field) => validateField(field)).every(Boolean);

      if (!allValid) {
        requiredFields.find((f) => !validators[f.name](f.value))?.focus();
        return;
      }

      // NOTE: static demo — wire this up to a real form handler in production.
      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-label").textContent = "Sending…";
      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
      }, 700);
    });
  }

  function initFooterYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();
