/**
 * Professional Portfolio — Main Script
 * Handles theme toggling, navigation, smooth scrolling, active link
 * highlighting, mobile menu, form validation, and footer year.
 */

(function () {
  "use strict";

  /* ---- Theme Configuration ---- */
  const THEME_STORAGE_KEY = "portfolio-theme";

  const themeToggle = document.getElementById("theme-toggle");

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  function updateThemeToggleLabel(theme) {
    if (!themeToggle) return;

    const isDark = theme === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeToggleLabel(theme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const theme = savedTheme || getSystemTheme();
    applyTheme(theme);
  }

  function toggleTheme() {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  initTheme();

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  /* ---- DOM References ---- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".navbar__link");
  const sections = document.querySelectorAll("main .section[id], main .section--hero");
  const contactForm = document.getElementById("contact-form");
  const currentYearEl = document.getElementById("current-year");
  const header = document.querySelector(".site-header");

  /* ---- Footer: Dynamic Year ---- */
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ---- Mobile Navigation Toggle ---- */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    /* Close menu when a link is clicked */
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener("click", function (event) {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target) &&
        !(themeToggle && themeToggle.contains(event.target))
      ) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Smooth Scroll for Navigation Links ---- */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (targetId && targetId.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(targetId);

        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          /* Move keyboard focus to target section for accessibility */
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }
    });
  });

  /* ---- Active Navigation Link on Scroll ---- */
  function setActiveNavLink() {
    const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 50;

    let currentSectionId = "home";

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === "#" + currentSectionId);
    });
  }

  window.addEventListener("scroll", setActiveNavLink, { passive: true });
  setActiveNavLink();

  /* ---- Contact Form Validation (client-side placeholder) ---- */
  if (contactForm) {
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");
    const formStatus = document.getElementById("form-status");

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, errorEl, message) {
      input.classList.add("invalid");
      errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
      input.classList.remove("invalid");
      errorEl.textContent = "";
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      let isValid = true;

      /* Validate name */
      if (!nameInput.value.trim()) {
        showError(nameInput, nameError, "Please enter your name.");
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      /* Validate email */
      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, "Please enter your email address.");
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      /* Validate message */
      if (!messageInput.value.trim()) {
        showError(messageInput, messageError, "Please enter a message.");
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (isValid) {
        /*
         * Placeholder: connect to a backend or email service later.
         * For now, show a success message and reset the form.
         */
        formStatus.textContent =
          "Thank you! Your message has been validated. (Backend integration pending.)";
        formStatus.classList.add("success");
        contactForm.reset();

        setTimeout(function () {
          formStatus.textContent = "";
          formStatus.classList.remove("success");
        }, 5000);
      } else {
        formStatus.textContent = "";
        formStatus.classList.remove("success");
      }
    });

    /* Clear errors on input */
    [nameInput, emailInput, messageInput].forEach(function (input) {
      input.addEventListener("input", function () {
        const errorEl = document.getElementById(input.id.replace("contact-", "") + "-error");
        if (errorEl) {
          clearError(input, errorEl);
        }
      });
    });
  }
})();
