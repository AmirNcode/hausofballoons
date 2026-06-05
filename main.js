const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const circle = document.querySelector(".scroll-circle");
const instagramSection = document.querySelector(".instagram");

let ticking = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

root.classList.add("motion-ready");

function updateCircle() {
  ticking = false;

  const viewportWidth = window.innerWidth || 1;
  const viewportHeight = window.innerHeight || 1;
  const instagramHeight = instagramSection.offsetHeight || viewportHeight;
  const animationEnd = Math.max(1, instagramSection.offsetTop);
  const progress = clamp(window.scrollY / animationEnd, 0, 1);
  const eased = prefersReducedMotion.matches ? progress : 1 - Math.pow(1 - progress, 4);
  const coverScale = (Math.hypot(viewportWidth / 2, instagramHeight) / 260) * 1.08;
  const scale = 0.18 + eased * Math.max(coverScale - 0.18, 0);

  circle.style.setProperty("--circle-scale", scale.toFixed(3));
}

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateCircle);
    ticking = true;
  }
}

// Defer Instagram's embed.js until the Instagram section nears the viewport, so it
// never blocks the initial load (and never loads at all for hero-only visits).
function setupInstagramEmbed() {
  if (!instagramSection) return;

  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);
  };

  if (!("IntersectionObserver" in window)) {
    load();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        load();
        observer.disconnect();
      }
    },
    { rootMargin: "500px 0px" }
  );

  observer.observe(instagramSection);
}

// Reveal the "How it works" steps as they scroll into view (reduced-motion safe).
function setupReveal() {
  const list = document.querySelector(".process-list");
  if (!list) return;

  const steps = Array.from(list.querySelectorAll(".process-step"));
  if (!steps.length || prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  list.classList.add("js-anim");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  steps.forEach((step, index) => {
    step.style.transitionDelay = index * 90 + "ms";
    observer.observe(step);
  });
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
prefersReducedMotion.addEventListener("change", requestScrollUpdate);
document.addEventListener("DOMContentLoaded", () => {
  requestScrollUpdate();
  setupInstagramEmbed();
  setupReveal();
});

requestScrollUpdate();
