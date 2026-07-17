(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initTestimonialCarousel();
    initBookingForm();
    initFooterYear();
    initBackToTop();
    initMinDate();
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

  function initTestimonialCarousel() {
    const track = document.getElementById("testimonial-track");
    const dotsWrap = document.getElementById("t-dots");
    const prevBtn = document.getElementById("t-prev");
    const nextBtn = document.getElementById("t-next");
    if (!track || !dotsWrap) return;

    const cards = Array.from(track.children);
    let index = 0;
    let timer = null;

    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Show review ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      cards.forEach((card, i) => card.classList.toggle("active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }
    function goTo(i) { index = (i + cards.length) % cards.length; render(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function startAutoplay() { stopAutoplay(); timer = setInterval(next, 6500); }
    function stopAutoplay() { if (timer) clearInterval(timer); }

    nextBtn?.addEventListener("click", () => { next(); startAutoplay(); });
    prevBtn?.addEventListener("click", () => { prev(); startAutoplay(); });

    const carousel = track.closest(".testimonial-carousel");
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    render();
    startAutoplay();
  }

  function initBookingForm() {
    const form = document.getElementById("booking-form");
    const success = document.getElementById("booking-success");
    const submitBtn = document.getElementById("booking-submit");
    if (!form) return;

    const validators = {
      name: (v) => v.trim().length > 1,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      treatment: (v) => v.trim().length > 0,
      date: (v) => v.trim().length > 0,
    };

    function validateField(field) {
      const wrapper = field.closest(".field");
      if (!wrapper) return true;
      const validator = validators[field.name];
      const valid = validator ? validator(field.value) : true;
      wrapper.classList.toggle("invalid", !valid);
      return valid;
    }

    form.querySelectorAll("input, select").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const honeypot = form.querySelector('[name="company"]');
      if (honeypot && honeypot.value.trim() !== "") return;

      const fields = Array.from(form.querySelectorAll("input:not(.hp-field):not([type=checkbox]), select"));
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

  function initMinDate() {
    const dateInput = document.getElementById("b-date");
    if (!dateInput) return;
    const iso = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", iso);
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
