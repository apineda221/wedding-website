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

// ===============================
// Background Music + YouTube Sync
// ===============================
(() => {
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  if (!bgMusic || !musicToggle) return;

  let userStartedMusic = false;
  let wasPlayingBeforeVideo = false;

  bgMusic.volume = 0.18; // soft volume

  async function playMusic() {
    try {
      await bgMusic.play();
      userStartedMusic = true;
      musicToggle.textContent = "Music On";
      musicToggle.setAttribute("aria-pressed", "true");
    } catch (err) {
      console.warn("Music play was blocked:", err);
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    musicToggle.textContent = "Music Off";
    musicToggle.setAttribute("aria-pressed", "false");
  }

  musicToggle.addEventListener("click", async () => {
    if (bgMusic.paused) {
      await playMusic();
    } else {
      pauseMusic();
    }
  });

  // Load YouTube Iframe API
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  let player;

  window.onYouTubeIframeAPIReady = function () {
    const iframe = document.getElementById("proposalVideo");
    if (!iframe) return;

    player = new YT.Player("proposalVideo", {
      events: {
        onStateChange: function (event) {
          // YT.PlayerState.PLAYING = 1
          if (event.data === 1) {
            wasPlayingBeforeVideo = !bgMusic.paused;
            pauseMusic();
          }

          // YT.PlayerState.PAUSED = 2
          // YT.PlayerState.ENDED = 0
          if ((event.data === 2 || event.data === 0) && userStartedMusic && wasPlayingBeforeVideo) {
            // optional auto-resume
            playMusic();
            wasPlayingBeforeVideo = false;
          }
        }
      }
    });
  };
})();

// ===============================
// Familia Gallery Lightbox
// ===============================
(() => {
  const lightbox = document.getElementById("familiaLightbox");
  const lightboxImg = document.getElementById("familiaLightboxImg");
  const lightboxClose = document.getElementById("familiaLightboxClose");
  const thumbs = document.querySelectorAll(".familia-thumb");

  if (!lightbox || !lightboxImg || !lightboxClose || !thumbs.length) return;

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const src = thumb.getAttribute("data-full");
      if (src) openLightbox(src);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();

// ===============================
// Intro Memory Flip — Stylized
// ===============================
(() => {
  const introOverlay = document.getElementById("introOverlay");
  const cards = Array.from(document.querySelectorAll(".intro-card"));

  if (!introOverlay || !cards.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let currentIndex = 0;
  const holdTime = prefersReduced ? 180 : 360; // quicker flip
  const endDelay = prefersReduced ? 120 : 300;
  let intervalId;

  function renderStack(index) {
    cards.forEach((card, i) => {
      card.classList.remove("active", "prev", "preprev");

      if (i === index) {
        card.classList.add("active");
      } else if (i === index - 1) {
        card.classList.add("prev");
      } else if (i === index - 2) {
        card.classList.add("preprev");
      }
    });
  }

  function finishIntro() {
    clearInterval(intervalId);
    introOverlay.classList.add("is-hidden");
    document.body.style.overflow = "";
  }

  function startIntro() {
    document.body.style.overflow = "hidden";
    renderStack(currentIndex);

    intervalId = setInterval(() => {
      currentIndex += 1;

      if (currentIndex >= cards.length) {
        setTimeout(finishIntro, endDelay);
        return;
      }

      renderStack(currentIndex);
    }, holdTime);
  }

  window.addEventListener("load", startIntro);
})();

// ===============================
// Dress Code Modal
// ===============================
(() => {
  const trigger = document.getElementById("dresscodeTrigger");
  const modal = document.getElementById("dresscodeModal");
  const closeBtn = document.getElementById("dresscodeClose");
  const backdrop = document.getElementById("dresscodeBackdrop");

  if (!trigger || !modal || !closeBtn || !backdrop) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  trigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();

// ===============================
// Language Toggle EN / ES
// ===============================
(() => {
  const langBtn = document.getElementById("langToggle");
  if (!langBtn) return;

  const translatableEls = document.querySelectorAll("[data-en][data-es]");
  let currentLang = localStorage.getItem("siteLanguage") || "en";

  function applyLanguage(lang) {
    translatableEls.forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.innerHTML = text;
      }
    });

    document.documentElement.lang = lang === "es" ? "es" : "en";
    langBtn.textContent = lang === "en" ? "Español" : "English";
    langBtn.setAttribute("aria-pressed", lang === "es" ? "true" : "false");
    localStorage.setItem("siteLanguage", lang);
  }

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "es" : "en";
    applyLanguage(currentLang);
  });

  applyLanguage(currentLang);
})();

// ===============================
// Language Toggle EN / ES
// ===============================
(() => {
  const langBtn = document.getElementById("langToggle");
  if (!langBtn) return;

  const translatableEls = document.querySelectorAll("[data-en][data-es]");
  let currentLang = localStorage.getItem("siteLanguage") || "en";

  function applyLanguage(lang) {
    translatableEls.forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) {
        el.innerHTML = text;
      }
    });

    document.documentElement.lang = lang === "es" ? "es" : "en";
    langBtn.textContent = lang === "en" ? "Español" : "English";
    langBtn.setAttribute("aria-pressed", lang === "es" ? "true" : "false");
    localStorage.setItem("siteLanguage", lang);
  }

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "es" : "en";
    applyLanguage(currentLang);
  });

  applyLanguage(currentLang);
})();

// ===============================
// Gift Info Modal
// ===============================
(() => {
  const trigger = document.getElementById("giftInfoTrigger");
  const modal = document.getElementById("giftModal");
  const closeBtn = document.getElementById("giftModalClose");
  const backdrop = document.getElementById("giftModalBackdrop");

  if (!trigger || !modal || !closeBtn || !backdrop) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  trigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();

// ===============================
// Proposal Video Modal
// ===============================
(() => {
  const trigger = document.getElementById("proposalModalTrigger");
  const modal = document.getElementById("proposalModal");
  const closeBtn = document.getElementById("proposalModalClose");
  const backdrop = document.getElementById("proposalModalBackdrop");
  const iframe = document.getElementById("proposalModalIframe");

  if (!trigger || !modal || !closeBtn || !backdrop || !iframe) return;

  const baseSrc = iframe.getAttribute("src");

  function openModal() {
    iframe.src = baseSrc.includes("autoplay=1") ? baseSrc : `${baseSrc}&autoplay=1`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    iframe.src = baseSrc; // stops the video
  }

  trigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();
