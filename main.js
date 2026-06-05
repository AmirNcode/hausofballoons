const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const circle = document.querySelector(".scroll-circle");
const instagramSection = document.querySelector(".instagram");
const videos = Array.from(document.querySelectorAll(".reel-card video"));

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

function playVideo(video) {
  video.play().catch(() => {
    video.controls = true;
  });
}

function setupVideoPlayback() {
  if (!("IntersectionObserver" in window)) {
    videos.forEach(playVideo);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          playVideo(video);
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: "220px 0px", threshold: 0.1 }
  );

  videos.forEach((video) => observer.observe(video));
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
prefersReducedMotion.addEventListener("change", requestScrollUpdate);
document.addEventListener("DOMContentLoaded", () => {
  requestScrollUpdate();
  setupVideoPlayback();
});

requestScrollUpdate();
