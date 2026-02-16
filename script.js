// ===============================
// Mobile Menu
// ===============================
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

menuBtn?.addEventListener("click", () => {
  const isOpen = mobileNav.style.display === "block";
  mobileNav.style.display = isOpen ? "none" : "block";
});

// Close menu when a link is clicked
mobileNav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileNav.style.display = "none";
  });
});


// ===============================
// Scroll Reveal (fade + float up on scroll)
// ===============================
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Elements to animate as they enter the viewport
  const targets = document.querySelectorAll(`
    .section,
    .panel,
    .story-row,
    .story-media,
    .story-text,
    h2,
    .hero-content
  `);

  // Add reveal class + gentle stagger per section
  const bySection = new Map();

  targets.forEach((el) => {
    el.classList.add("reveal");

    const section = el.closest(".section") || document.body;
    if (!bySection.has(section)) bySection.set(section, []);
    bySection.get(section).push(el);
  });

  // Apply small stagger delays (first 4 items per section)
  bySection.forEach((els) => {
    els.slice(0, 4).forEach((el, i) => el.setAttribute("data-delay", String(i + 1)));
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
