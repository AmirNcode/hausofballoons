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
      processInstagramEmbeds();
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

let updateInstagramCarouselControls = () => {};

function processInstagramEmbeds() {
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
    window.setTimeout(updateInstagramCarouselControls, 600);
  }
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

function setupGalleryCarousel() {
  const carousel = document.querySelector("[data-gallery-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-gallery-track]");
  const prev = carousel.querySelector("[data-gallery-prev]");
  const next = carousel.querySelector("[data-gallery-next]");
  const status = carousel.querySelector("[data-gallery-status]");

  if (!track || !prev || !next) return;

  renderGalleryImages(track);

  const getScrollStep = () => {
    const firstCard = track.querySelector(".gallery-card");
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : track.clientWidth;
    const cardsPerPage = Math.max(1, Math.round((track.clientWidth + gap) / Math.max(1, cardWidth + gap)));
    return {
      cardsPerPage,
      step: cardsPerPage * (cardWidth + gap),
    };
  };

  const getMaxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

  const updateControls = () => {
    const maxScroll = getMaxScroll();
    const scrollLeft = Math.round(track.scrollLeft);
    prev.disabled = scrollLeft <= 1;
    next.disabled = scrollLeft >= maxScroll - 1;

    if (status) {
      const { cardsPerPage, step } = getScrollStep();
      const totalCards = track.querySelectorAll(".gallery-card").length;
      const totalPages = Math.max(1, Math.ceil(totalCards / cardsPerPage));
      const currentPage = Math.min(Math.max(1, Math.round(scrollLeft / Math.max(1, step)) + 1), totalPages);
      status.textContent = "Gallery page " + currentPage + " of " + totalPages;
    }
  };

  const scrollByPage = (direction) => {
    const { step } = getScrollStep();
    track.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  prev.addEventListener("click", () => scrollByPage(-1));
  next.addEventListener("click", () => scrollByPage(1));
  track.addEventListener("scroll", () => window.requestAnimationFrame(updateControls), { passive: true });
  window.addEventListener("resize", updateControls);
  updateControls();
}

function renderGalleryImages(track) {
  const images = Array.isArray(window.HOB_GALLERY_IMAGES)
    ? window.HOB_GALLERY_IMAGES
    : [];

  track.replaceChildren();

  images.forEach((image) => {
    if (!image || !image.src) return;

    const caption = image.caption || image.file || "Gallery image";
    const figure = document.createElement("figure");
    figure.className = "gallery-card";

    const frame = document.createElement("div");
    frame.className = "gallery-card__frame";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = caption;
    img.loading = "lazy";
    img.decoding = "async";

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = caption;

    frame.append(img);
    figure.append(frame, figcaption);
    track.append(figure);
  });
}

function setupInstagramCarousel() {
  const carousel = document.querySelector("[data-instagram-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-instagram-track]");
  const prev = carousel.querySelector("[data-instagram-prev]");
  const next = carousel.querySelector("[data-instagram-next]");
  const status = carousel.querySelector("[data-instagram-status]");

  if (!track || !prev || !next) return;

  const posts = Array.isArray(window.HOB_INSTAGRAM_POSTS)
    ? window.HOB_INSTAGRAM_POSTS
    : [];

  track.replaceChildren();

  posts.forEach((postUrl) => {
    const embedUrl = getInstagramEmbedUrl(postUrl);
    if (!embedUrl) return;

    const slide = document.createElement("article");
    slide.className = "instagram-slide";

    const blockquote = document.createElement("blockquote");
    blockquote.className = "instagram-media";
    blockquote.setAttribute("data-instgrm-captioned", "");
    blockquote.setAttribute("data-instgrm-permalink", embedUrl);
    blockquote.setAttribute("data-instgrm-version", "14");

    const link = document.createElement("a");
    link.href = embedUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "View this reel on Instagram";

    blockquote.append(link);
    slide.append(blockquote);
    track.append(slide);
  });

  const getScrollStep = () => {
    const firstCard = track.querySelector(".instagram-slide");
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : track.clientWidth;
    const cardsPerPage = Math.max(1, Math.round((track.clientWidth + gap) / Math.max(1, cardWidth + gap)));
    return {
      cardsPerPage,
      step: cardsPerPage * (cardWidth + gap),
    };
  };

  const getMaxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

  const updateControls = () => {
    const maxScroll = getMaxScroll();
    const scrollLeft = Math.round(track.scrollLeft);
    const allVisible = maxScroll <= 1;
    carousel.classList.toggle("is-all-visible", allVisible);
    prev.disabled = allVisible || scrollLeft <= 1;
    next.disabled = allVisible || scrollLeft >= maxScroll - 1;

    if (status) {
      const { cardsPerPage, step } = getScrollStep();
      const totalCards = track.querySelectorAll(".instagram-slide").length;
      const totalPages = Math.max(1, Math.ceil(totalCards / cardsPerPage));
      const currentPage = Math.min(Math.max(1, Math.round(scrollLeft / Math.max(1, step)) + 1), totalPages);
      status.textContent = "Instagram reels page " + currentPage + " of " + totalPages;
    }
  };

  const scrollByPage = (direction) => {
    const { step } = getScrollStep();
    track.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  prev.addEventListener("click", () => scrollByPage(-1));
  next.addEventListener("click", () => scrollByPage(1));
  track.addEventListener("scroll", () => window.requestAnimationFrame(updateControls), { passive: true });
  window.addEventListener("resize", updateControls);
  updateInstagramCarouselControls = updateControls;
  updateControls();
  processInstagramEmbeds();
}

function getInstagramEmbedUrl(postUrl) {
  try {
    const url = new URL(postUrl);
    if (!/(^|\.)instagram\.com$/.test(url.hostname)) return "";
    url.protocol = "https:";
    url.hostname = "www.instagram.com";
    url.hash = "";
    url.search = "?utm_source=ig_embed&utm_campaign=loading";
    if (!url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    return url.toString();
  } catch (error) {
    return "";
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
prefersReducedMotion.addEventListener("change", requestScrollUpdate);
document.addEventListener("DOMContentLoaded", () => {
  requestScrollUpdate();
  setupInstagramCarousel();
  setupInstagramEmbed();
  setupReveal();
  setupGalleryCarousel();
});

requestScrollUpdate();
