(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initBeforeAfterSlider();
    initTestimonialCarousel();
    initAccordion();
    initContactForm();
    initFooterYear();
    initBackToTop();
  });

  /* ---------------- header shrink/shadow on scroll ---------------- */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const toggle = () => header.classList.toggle("scrolled", window.scrollY > 8);
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
      const isOpen = nav.classList.contains("open");
      isOpen ? close() : open();
    });

    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", close)
    );

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

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- before/after slider ---------------- */
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

    handle.addEventListener("pointerdown", (e) => {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
    });
    slider.addEventListener("pointermove", (e) => {
      if (dragging) onMove(e.clientX);
    });
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

  /* ---------------- testimonial carousel ---------------- */
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

    function goTo(i) {
      index = (i + cards.length) % cards.length;
      render();
    }

    function next() {
      goTo(index + 1);
    }
    function prev() {
      goTo(index - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, 6000);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }

    nextBtn?.addEventListener("click", () => {
      next();
      startAutoplay();
    });
    prevBtn?.addEventListener("click", () => {
      prev();
      startAutoplay();
    });

    const carousel = track.closest(".testimonial-carousel");
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    render();
    startAutoplay();
  }

  /* ---------------- FAQ accordion ---------------- */
  function initAccordion() {
    const triggers = document.querySelectorAll(".accordion-trigger");
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        triggers.forEach((t) => t.setAttribute("aria-expanded", "false"));
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ---------------- contact form ---------------- */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    const success = document.getElementById("form-success");
    const submitBtn = document.getElementById("form-submit");
    if (!form) return;

    const validators = {
      name: (v) => v.trim().length > 1,
      phone: (v) => /^[\d\s\-()+]{7,}$/.test(v.trim()),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      service: (v) => v.trim().length > 0,
      message: (v) => v.trim().length > 3,
    };

    function validateField(field) {
      const wrapper = field.closest(".field");
      if (!wrapper) return true;
      const validator = validators[field.name];
      const valid = validator ? validator(field.value) : field.checkValidity();
      wrapper.classList.toggle("invalid", !valid);
      return valid;
    }

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // honeypot spam trap — if filled, silently drop the submission
      const honeypot = form.querySelector('[name="company"]');
      if (honeypot && honeypot.value.trim() !== "") return;

      const fields = Array.from(
        form.querySelectorAll("input:not(.hp-field), select, textarea")
      );
      const allValid = fields
        .map((field) => validateField(field))
        .every(Boolean);

      if (!allValid) {
        fields.find((f) => !validators[f.name]?.(f.value))?.focus();
        return;
      }

      // NOTE: this is a static demo — there is no backend wired up.
      // In production, POST `new FormData(form)` to your form handler
      // (e.g. Formspree, Netlify Forms, or your own API endpoint) here.
      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-label").textContent = "Sending…";

      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
        success.focus?.();
      }, 700);
    });
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
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
