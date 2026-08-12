/**
 * Professional Portfolio — Main Script
 * Handles theme toggling, navigation, smooth scrolling, active link
 * highlighting, mobile menu, typewriter effect, scroll-reveal animations,
 * and form validation.
 */

(function () {
  "use strict";

  /* ---- Theme Configuration ---- */
  const THEME_STORAGE_KEY = "portfolio-theme";
  const DEFAULT_THEME = "dark";
  const themeToggle = document.getElementById("theme-toggle");

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
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
    const theme = savedTheme || DEFAULT_THEME;
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
  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".navbar__link");
  const sections = document.querySelectorAll("main section[id]");
  const contactForm = document.getElementById("contact-form");
  const currentYearEl = document.getElementById("current-year");

  /* ---- Footer: Dynamic Year ---- */
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ---- Header Scroll Shadow ---- */
  function initHeaderScroll() {
    if (!header) return;
    function checkScroll() {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
  }
  initHeaderScroll();

  /* ---- Typewriter Effect for Hero Subtitle ---- */
  function initTypewriter() {
    const typewriterEl = document.getElementById("hero-typewriter");
    if (!typewriterEl) return;

    const wordsData = typewriterEl.getAttribute("data-words");
    if (!wordsData) return;

    let words = [];
    try {
      words = JSON.parse(wordsData);
    } catch (e) {
      words = ["BICT Undergraduate", "Software Engineering Student"];
    }

    /* Check for prefers-reduced-motion */
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      typewriterEl.textContent = words[0];
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 70;
    const deletingSpeed = 35;
    const pauseDelay = 1800;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeout = 400;
      }

      setTimeout(type, timeout);
    }

    type();
  }
  initTypewriter();

  /* ---- Mobile Navigation Drawer ---- */
  if (navToggle && navMenu) {
    function closeMenu() {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }

    function openMenu() {
      navMenu.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    }

    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Close menu when clicking a navigation link */
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    /* Close menu on outside click */
    document.addEventListener("click", function (event) {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target) &&
        !(themeToggle && themeToggle.contains(event.target))
      ) {
        closeMenu();
      }
    });

    /* Close menu on Escape key */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navMenu.classList.contains("open")) {
        closeMenu();
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

          /* Keyboard accessibility focus */
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }
    });
  });

  /* ---- Active Navigation Link Observer (Scrollspy) ---- */
  function initScrollspy() {
    if (!sections.length || !navLinks.length) return;

    if ("IntersectionObserver" in window) {
      const observerOptions = {
        root: null,
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      };

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            navLinks.forEach(function (link) {
              const href = link.getAttribute("href");
              link.classList.toggle("active", href === "#" + activeId);
            });
          }
        });
      }, observerOptions);

      sections.forEach(function (section) {
        observer.observe(section);
      });
    } else {
      /* Fallback scroll handler */
      function setActiveNavLinkFallback() {
        const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 60;
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

      window.addEventListener("scroll", setActiveNavLinkFallback, { passive: true });
      setActiveNavLinkFallback();
    }
  }
  initScrollspy();

  /* ---- Scroll Reveal Animations (IntersectionObserver) ---- */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach(function (el) {
        el.classList.add("revealed");
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }
  initScrollReveal();

  /* ---- Contact Form Validation ---- */
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

      if (!nameInput.value.trim()) {
        showError(nameInput, nameError, "Please enter your name.");
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, "Please enter your email address.");
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, messageError, "Please enter a message.");
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (isValid) {
        formStatus.textContent = "Thank you! Your message has been validated cleanly.";
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
