// ===============================
// Mobile Menu
// ===============================
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

function openMobileMenu() {
  mobileNav?.classList.add("open");
  mobileNav?.removeAttribute("hidden");
  menuBtn?.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  mobileNav?.classList.remove("open");
  mobileNav?.setAttribute("hidden", "");
  menuBtn?.setAttribute("aria-expanded", "false");
}

function toggleMobileMenu() {
  if (!mobileNav) return;
  const isOpen = mobileNav.classList.contains("open");
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

menuBtn?.addEventListener("click", toggleMobileMenu);

// Close menu when a link is clicked
mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close menu if clicking outside
document.addEventListener("click", (event) => {
  if (!mobileNav || !menuBtn) return;

  const clickedInsideNav = mobileNav.contains(event.target);
  const clickedMenuBtn = menuBtn.contains(event.target);

  if (!clickedInsideNav && !clickedMenuBtn) {
    closeMobileMenu();
  }
});

// Close menu on Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

// ===============================
// Scroll Reveal
// ===============================
(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const targets = document.querySelectorAll(`
    .section,
    .panel,
    .story-row,
    .story-media,
    .story-text,
    h2,
    .hero-content
  `);

  const bySection = new Map();

  targets.forEach((el) => {
    el.classList.add("reveal");

    const section = el.closest(".section") || document.body;
    if (!bySection.has(section)) bySection.set(section, []);
    bySection.get(section).push(el);
  });

  bySection.forEach((elements) => {
    elements.slice(0, 4).forEach((el, index) => {
      el.setAttribute("data-delay", String(index + 1));
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// ===============================
// Wedding Countdown Timer
// ===============================
(() => {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Wedding date: November 27, 2026
  const targetDate = new Date("2026-11-27T00:00:00");

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
