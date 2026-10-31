const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll progress indicator
const progress = document.querySelector(".progress-bar");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Reveal sections when they enter the viewport
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item, index) => {
    if (item.classList.contains("learning-row") || item.classList.contains("service-card") || item.classList.contains("project-card")) {
      item.style.setProperty("--delay", `${(index % 4) * 70}ms`);
    }
    observer.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

// Mobile navigation
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}));

// Subtle custom cursor on devices with a fine pointer
const cursor = document.querySelector(".cursor-dot");
if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  window.addEventListener("pointermove", event => {
    cursor.style.opacity = "1";
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });
  document.addEventListener("pointerleave", () => cursor.style.opacity = "0");
}

// Lightweight animated contour field; no image or WebGL assets required
const canvas = document.querySelector(".contour-canvas");
const context = canvas.getContext("2d");
let width = 0, height = 0, frame = 0;
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function drawContours() {
  context.clearRect(0, 0, width, height);
  const spacing = width < 600 ? 34 : 43;
  for (let y = -spacing; y < height + spacing; y += spacing) {
    context.beginPath();
    for (let x = -spacing; x < width + spacing; x += 12) {
      const wave = Math.sin((x * .008) + frame * .012 + y * .004) * 11;
      const wave2 = Math.cos((y * .014) - frame * .009 + x * .002) * 8;
      const py = y + wave + wave2;
      if (x === -spacing) context.moveTo(x, py);
      else context.lineTo(x, py);
    }
    context.strokeStyle = `rgba(2, 150, 165, ${.08 + (Math.sin(y * .025 + frame * .01) + 1) * .035})`;
    context.lineWidth = 1;
    context.stroke();
  }
  if (!reducedMotion) frame++;
  if (!reducedMotion) requestAnimationFrame(drawContours);
}
resizeCanvas();
drawContours();
window.addEventListener("resize", resizeCanvas, { passive: true });

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
