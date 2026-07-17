(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initGalleryScroller();
    initReserveForm();
    initFooterYear();
    initBackToTop();
    initMinDateOnReserve();
  });

  /* ---------------- header background on scroll ---------------- */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const toggle = () => header.classList.toggle("scrolled", window.scrollY > 40);
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  /* ---------------- mobile nav ---------------- */
  function initMobileNav() {
    const toggleBtn = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    if (!toggleBtn || !nav) return;

    const close = () => {
      nav.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      nav.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", "true");
    };

    toggleBtn.addEventListener("click", () => {
      nav.classList.contains("open") ? close() : open();
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(e.target) || toggleBtn.contains(e.target)) return;
      close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------- scroll reveal ---------------- */
  function initScrollReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- gallery horizontal scroller ---------------- */
  function initGalleryScroller() {
    const track = document.getElementById("gallery-track");
    const prevBtn = document.getElementById("g-prev");
    const nextBtn = document.getElementById("g-next");
    if (!track) return;

    const scrollByAmount = () => {
      const item = track.querySelector(".gallery-item");
      return item ? item.getBoundingClientRect().width + 18 : 300;
    };

    prevBtn?.addEventListener("click", () => {
      track.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
    });
    nextBtn?.addEventListener("click", () => {
      track.scrollBy({ left: scrollByAmount(), behavior: "smooth" });
    });
  }

  /* ---------------- reservation form ---------------- */
  function initReserveForm() {
    const form = document.getElementById("reserve-form");
    const success = document.getElementById("reserve-success");
    const submitBtn = document.getElementById("reserve-submit");
    if (!form) return;

    const validators = {
      name: (v) => v.trim().length > 1,
      phone: (v) => /^[\d\s\-()+]{7,}$/.test(v.trim()),
      date: (v) => v.trim().length > 0,
      time: (v) => v.trim().length > 0,
      party: (v) => v.trim().length > 0,
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

      const fields = Array.from(form.querySelectorAll("input:not(.hp-field), select"));
      const requiredFields = fields.filter((f) => validators[f.name]);
      const allValid = requiredFields.map((field) => validateField(field)).every(Boolean);

      if (!allValid) {
        requiredFields.find((f) => !validators[f.name](f.value))?.focus();
        return;
      }

      // NOTE: static demo — no backend wired up. In production, POST this
      // form's data to your reservation system or a form handler here.
      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-label").textContent = "Sending…";

      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
      }, 700);
    });
  }

  /* ---------------- prevent picking a past date ---------------- */
  function initMinDateOnReserve() {
    const dateInput = document.getElementById("r-date");
    if (!dateInput) return;
    const today = new Date();
    const iso = today.toISOString().split("T")[0];
    dateInput.setAttribute("min", iso);
  }

  /* ---------------- footer year ---------------- */
  function initFooterYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- back to top ---------------- */
  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();
