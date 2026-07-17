(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initBeforeAfterSlider();
    initContactForm();
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  function initBeforeAfterSlider() {
    const slider = document.getElementById("ba-slider");
    const handle = document.getElementById("ba-handle");
    const before = document.getElementById("ba-before");
    if (!slider || !handle || !before) return;

    let dragging = false;
    const setPosition = (percent) => {
      const clamped = Math.min(100, Math.max(0, percent));
      before.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      handle.style.left = `${clamped}%`;
      handle.setAttribute("aria-valuenow", Math.round(clamped));
    };
    const percentFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };
    const onMove = (clientX) => setPosition(percentFromClientX(clientX));

    handle.addEventListener("pointerdown", (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
    slider.addEventListener("pointermove", (e) => { if (dragging) onMove(e.clientX); });
    handle.addEventListener("pointerup", () => (dragging = false));
    handle.addEventListener("pointercancel", () => (dragging = false));
    slider.addEventListener("click", (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      onMove(e.clientX);
    });
    handle.addEventListener("keydown", (e) => {
      const current = parseFloat(handle.style.left) || 50;
      if (e.key === "ArrowLeft") setPosition(current - 5);
      if (e.key === "ArrowRight") setPosition(current + 5);
    });
    setPosition(50);
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const success = document.getElementById("form-success");
    const submitBtn = document.getElementById("form-submit");
    if (!form) return;

    const validators = {
      name: (v) => v.trim().length > 1,
      phone: (v) => /^[\d\s\-()+]{7,}$/.test(v.trim()),
      address: (v) => v.trim().length > 4,
      concern: (v) => v.trim().length > 0,
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
