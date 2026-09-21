/* =========================================================
   JOSHI SHUBHAM — PORTFOLIO SCRIPT
   Vanilla JavaScript, no dependencies.

   Sections:
   1. Reduced motion + touch detection
   2. Loading screen
   3. Scroll progress bar
   4. Custom cursor
   5. Navigation (scroll state, active link, mobile menu, smooth scroll)
   6. Scroll reveal (IntersectionObserver)
   7. Skill level bars
   8. Back to top button
   9. Contact form validation
   10. Hero 3D wireframe sphere (Canvas 2D)
   ========================================================= */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouchDevice = window.matchMedia("(hover: none)").matches;
  if (isTouchDevice) {
    document.body.classList.add("touch-device");
  }

  /* ---------- 2. Loading screen ---------- */
  const loader = document.getElementById("loader");

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("hidden");
    // Remove from DOM after the fade transition finishes
    setTimeout(() => loader.remove(), 700);
  };

  // Hide once everything (fonts, images) has loaded, with a small
  // minimum display time so it doesn't just flash on fast connections.
  const loaderStart = Date.now();
  window.addEventListener("load", () => {
    const elapsed = Date.now() - loaderStart;
    const minDisplay = 600;
    setTimeout(hideLoader, Math.max(0, minDisplay - elapsed));
  });

  /* ---------- 3. Scroll progress bar ---------- */
  const progressBar = document.getElementById("scroll-progress");

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";
  };

  /* ---------- 4. Custom cursor ---------- */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  if (!isTouchDevice && cursorDot && cursorRing) {
    // Place both elements at the center of the screen immediately so
    // they don't flash in the top-left corner before the first mousemove.
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Ring follows with a slight delay for a smooth "trailing" feel
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Enlarge ring over interactive elements
    document
      .querySelectorAll("a, button, input, textarea, [data-tilt]")
      .forEach((el) => {
        el.addEventListener("mouseenter", () =>
          cursorRing.classList.add("active")
        );
        el.addEventListener("mouseleave", () =>
          cursorRing.classList.remove("active")
        );
      });
  }

  /* ---------- 5. Navigation ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinksWrap = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = document.querySelectorAll("main section[id]");

  const updateNavScrollState = () => {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  // Mobile hamburger toggle
  if (navToggle && navLinksWrap) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinksWrap.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close mobile menu after choosing a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksWrap.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close the mobile menu automatically if the viewport grows back
    // to desktop size while it's open
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860 && navLinksWrap.classList.contains("open")) {
        navLinksWrap.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // Active link highlighting based on scroll position
  const setActiveLink = () => {
    let currentId = sections[0] ? sections[0].id : "";
    const offset = 140;

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });
  };

  /* ---------- 6. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- 7. Skill level bars ---------- */
  const skillFills = document.querySelectorAll(".skill-level-fill");

  const fillSkillBar = (el) => {
    const level = el.getAttribute("data-level") || "0";
    el.style.width = level + "%";
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    skillFills.forEach(fillSkillBar);
  } else {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fillSkillBar(entry.target);
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillFills.forEach((el) => skillObserver.observe(el));
  }

  /* ---------- 8. Back to top ---------- */
  const backToTop = document.getElementById("backToTop");

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 600);
  };

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- Combined scroll listener ---------- */
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavScrollState();
        setActiveLink();
        updateBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Run once on load to set initial state
  updateScrollProgress();
  updateNavScrollState();
  setActiveLink();
  updateBackToTop();

  /* ---------- 9. Contact form validation ---------- */
  const form = document.getElementById("contactForm");

  if (form) {
    const fields = {
      name: {
        input: document.getElementById("name"),
        error: document.getElementById("nameError"),
        validate: (v) => v.trim().length >= 2,
        message: "Please enter your name (at least 2 characters).",
      },
      email: {
        input: document.getElementById("email"),
        error: document.getElementById("emailError"),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        message: "Please enter a valid email address.",
      },
      message: {
        input: document.getElementById("message"),
        error: document.getElementById("messageError"),
        validate: (v) => v.trim().length >= 10,
        message: "Please write a message with at least 10 characters.",
      },
    };

    const formStatus = document.getElementById("formStatus");

    const validateField = (key) => {
      const field = fields[key];
      const value = field.input.value;
      const isValid = field.validate(value);
      const wrapper = field.input.closest(".form-field");

      wrapper.classList.toggle("invalid", !isValid);
      field.error.textContent = isValid ? "" : field.message;
      return isValid;
    };

    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener("blur", () => validateField(key));
      fields[key].input.addEventListener("input", () => {
        // Clear error as soon as the field becomes valid again
        const wrapper = fields[key].input.closest(".form-field");
        if (wrapper.classList.contains("invalid") && validateField(key)) {
          wrapper.classList.remove("invalid");
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const results = Object.keys(fields).map((key) => validateField(key));
      const allValid = results.every(Boolean);

      if (!allValid) {
        formStatus.textContent = "Please fix the highlighted fields.";
        formStatus.style.color = "#ff8080";
        return;
      }

      // Frontend-only project: no backend is connected, so this only
      // confirms receipt on the interface rather than sending an email.
      formStatus.style.color = "var(--accent)";
      formStatus.textContent =
        "Thanks! Your message has been received on the interface.";
      form.reset();

      Object.values(fields).forEach((field) => {
        field.input.closest(".form-field").classList.remove("invalid");
        field.error.textContent = "";
      });
    });
  }

  /* ---------- 10. Hero 3D wireframe sphere ---------- */
  const canvas = document.getElementById("heroCanvas");

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const heroSection = document.querySelector(".hero");

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Fewer points on small screens / touch devices for performance
    const isSmallScreen = window.innerWidth < 760;
    const LAT_LINES = isSmallScreen ? 8 : 14;
    const LON_LINES = isSmallScreen ? 10 : 18;
    const POINTS_PER_LINE = isSmallScreen ? 24 : 40;
    const PARTICLE_COUNT = isSmallScreen ? 40 : 90;
    const RADIUS_RATIO = isSmallScreen ? 0.34 : 0.3;

    let rotationY = 0;
    let rotationX = 0.3;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    // Sphere points generated as [lat, lon] pairs in radians
    const spherePoints = [];

    const buildSphere = () => {
      spherePoints.length = 0;
      // Latitude rings
      for (let i = 0; i <= LAT_LINES; i++) {
        const lat = (i / LAT_LINES) * Math.PI - Math.PI / 2;
        const ring = [];
        for (let j = 0; j <= POINTS_PER_LINE; j++) {
          const lon = (j / POINTS_PER_LINE) * Math.PI * 2;
          ring.push({ lat, lon });
        }
        spherePoints.push(ring);
      }
    };

    const particles = [];
    const buildParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          lat: Math.random() * Math.PI - Math.PI / 2,
          lon: Math.random() * Math.PI * 2,
          radiusOffset: 1 + Math.random() * 0.25,
          size: Math.random() * 1.6 + 0.6,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    buildSphere();
    buildParticles();
    resize();
    window.addEventListener("resize", resize);

    // Project a lat/lon point on the sphere to 2D screen coordinates,
    // rotating around Y (auto-rotation + mouse) and X (mouse tilt).
    const project = (lat, lon, radius, cx, cy, focal) => {
      let x = radius * Math.cos(lat) * Math.cos(lon);
      let y = radius * Math.sin(lat);
      let z = radius * Math.cos(lat) * Math.sin(lon);

      // Rotate around Y axis
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Simple perspective projection
      const scale = focal / (focal + z2);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale,
        z: z2,
      };
    };

    // Mouse / touch parallax target
    const handlePointerMove = (clientX, clientY) => {
      const rect = heroSection.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width - 0.5;
      const relY = (clientY - rect.top) / rect.height - 0.5;
      targetTiltY = relX * 0.6;
      targetTiltX = relY * 0.4;
    };

    window.addEventListener("mousemove", (e) => {
      handlePointerMove(e.clientX, e.clientY);
    });

    let lastTime = performance.now();
    let visible = true;

    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
    });

    const accentColor = "79, 209, 255";
    const accent2Color = "124, 111, 255";

    const draw = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (visible) {
        // Smoothly ease toward the mouse-driven tilt target
        currentTiltX += (targetTiltX - currentTiltX) * 0.06;
        currentTiltY += (targetTiltY - currentTiltY) * 0.06;

        if (!prefersReducedMotion) {
          rotationY += dt * 0.25 + currentTiltY * dt;
        }
        rotationX = 0.3 + currentTiltX;

        ctx.clearRect(0, 0, width, height);

        const cx = width * 0.72;
        const cy = height * 0.5;
        const radius = Math.min(width, height) * RADIUS_RATIO;
        const focal = radius * 3.2;

        // Draw latitude/longitude wireframe
        ctx.lineWidth = 1;
        spherePoints.forEach((ring, ringIndex) => {
          ctx.beginPath();
          ring.forEach((pt, i) => {
            const p = project(pt.lat, pt.lon, radius, cx, cy, focal);
            const alpha = Math.max(0.05, Math.min(0.55, (p.scale - 0.6) * 1.1));
            if (i === 0) {
              ctx.moveTo(p.x, p.y);
            } else {
              ctx.lineTo(p.x, p.y);
            }
          });
          const midPt = project(
            ring[0].lat,
            ring[0].lon,
            radius,
            cx,
            cy,
            focal
          );
          const alpha = Math.max(0.06, Math.min(0.5, (midPt.scale - 0.55) * 1));
          ctx.strokeStyle = `rgba(${accentColor}, ${alpha})`;
          ctx.stroke();
        });

        // Longitude lines (drawn by connecting same-index points across rings)
        for (let j = 0; j <= POINTS_PER_LINE; j += Math.ceil(POINTS_PER_LINE / LON_LINES)) {
          ctx.beginPath();
          spherePoints.forEach((ring, i) => {
            const pt = ring[j];
            if (!pt) return;
            const p = project(pt.lat, pt.lon, radius, cx, cy, focal);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.strokeStyle = `rgba(${accent2Color}, 0.18)`;
          ctx.stroke();
        }

        // Glowing particles floating around the sphere
        particles.forEach((particle) => {
          const p = project(
            particle.lat,
            particle.lon,
            radius * particle.radiusOffset,
            cx,
            cy,
            focal
          );
          const twinkle =
            0.5 + 0.5 * Math.sin(time * 0.001 * particle.twinkleSpeed + particle.twinkleOffset);
          const alpha = Math.max(0.15, Math.min(1, p.scale)) * twinkle;

          ctx.beginPath();
          ctx.arc(p.x, p.y, particle.size * Math.max(0.4, p.scale), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentColor}, ${alpha * 0.9})`;
          ctx.shadowColor = `rgba(${accentColor}, ${alpha})`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Soft core glow at the center of the sphere
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.1);
        gradient.addColorStop(0, `rgba(${accentColor}, 0.12)`);
        gradient.addColorStop(1, `rgba(${accentColor}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }
})();
