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
  // Gentler ease-out on small screens so the expansion feels smooth rather than
  // popping open during fast touch scrolling (desktop keeps the snappier quartic).
  const easePower = viewportWidth <= 780 ? 2 : 4;
  const eased = prefersReducedMotion.matches
    ? progress
    : 1 - Math.pow(1 - progress, easePower);
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

// Staggered reveal: any [data-reveal-group] container has its direct children
// fade/slide in as they scroll into view (reduced-motion safe).
function setupReveal() {
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) return;

  const groups = document.querySelectorAll("[data-reveal-group]");
  if (!groups.length) return;

  root.classList.add("reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  groups.forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.classList.add("reveal-item");
      child.style.transitionDelay = index * 80 + "ms";
      observer.observe(child);
    });
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
