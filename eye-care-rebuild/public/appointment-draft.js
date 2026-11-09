// The standalone preview cannot send server-side email. Keep the interaction honest
// instead of opening a mail client and implying that delivery happened.
document.addEventListener("submit", function (event) {
  const form = event.target;
  if (!form.matches("form[data-draft-email]")) return;
  event.preventDefault();
  const bn = document.documentElement.lang === "bn";
  form.querySelector('[role="status"]').textContent = bn
    ? "এই অফলাইন প্রিভিউ থেকে ইমেইল পাঠানো যায় না। লাইভ সাইটে অনুরোধ পাঠান অথবা চেম্বারে ফোন করুন।"
    : "Email delivery is not available in this offline preview. Use the live site to send your request or call the chamber.";
});
document.addEventListener("click", (event) => {
  const book = event.target.closest("[data-book-doctor]");
  const select = document.querySelector('select[name="doctor"]');
  if (book && select) select.value = book.dataset.bookDoctor;
});

let doctorIndex = 0;
let aboutCarouselTimer = 0;
let aboutCarouselObserver = null;
let activeAboutCarousel = null;
let aboutCarouselVisible = false;
let aboutCarouselHovered = false;
let aboutCarouselFocused = false;
function showAboutSlide(carousel, target) {
  const slides = Array.from(carousel.querySelectorAll("[data-about-slide]"));
  if (!slides.length) return;
  const index = (target + slides.length) % slides.length;
  carousel.dataset.current = String(index);
  carousel.dataset.orientation = slides[index].dataset.orientation || "portrait";
  slides.forEach((slide, position) => {
    slide.classList.toggle("is-active", position === index);
    slide.classList.toggle("is-prev", position === (index - 1 + slides.length) % slides.length);
    slide.classList.toggle("is-next", position === (index + 1) % slides.length);
    slide.setAttribute("aria-hidden", String(position !== index));
  });
  carousel.querySelectorAll("[data-about-index]").forEach((button) => {
    const active = Number(button.dataset.aboutIndex) === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
function syncAboutCarouselAutoplay() {
  window.clearInterval(aboutCarouselTimer);
  aboutCarouselTimer = 0;
  const carousel = activeAboutCarousel;
  if (!carousel) return;
  const slides = carousel.querySelectorAll("[data-about-slide]");
  if (slides.length < 2 || !aboutCarouselVisible || aboutCarouselHovered || aboutCarouselFocused || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  aboutCarouselTimer = window.setInterval(() => {
    showAboutSlide(carousel, Number(carousel.dataset.current) + 1);
  }, 3000);
}
function initAboutCarousel() {
  window.clearInterval(aboutCarouselTimer);
  aboutCarouselTimer = 0;
  if (aboutCarouselObserver) aboutCarouselObserver.disconnect();
  activeAboutCarousel = document.querySelector("[data-about-carousel]");
  aboutCarouselVisible = false;
  aboutCarouselHovered = false;
  aboutCarouselFocused = false;
  const carousel = activeAboutCarousel;
  if (!carousel) return;
  const slides = carousel.querySelectorAll("[data-about-slide]");
  if (slides.length < 2) return;
  carousel.addEventListener("pointerenter", () => {
    aboutCarouselHovered = true;
    syncAboutCarouselAutoplay();
  });
  carousel.addEventListener("pointerleave", () => {
    aboutCarouselHovered = false;
    syncAboutCarouselAutoplay();
  });
  carousel.addEventListener("focusin", () => {
    aboutCarouselFocused = true;
    syncAboutCarouselAutoplay();
  });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      aboutCarouselFocused = false;
      syncAboutCarouselAutoplay();
    }
  });
  showAboutSlide(carousel, Number(carousel.dataset.current) || 0);
  if ("IntersectionObserver" in window) {
    aboutCarouselObserver = new IntersectionObserver((entries) => {
      aboutCarouselVisible = entries.some((entry) => entry.isIntersecting);
      syncAboutCarouselAutoplay();
    }, { threshold: 0.2 });
    aboutCarouselObserver.observe(carousel);
  } else {
    aboutCarouselVisible = true;
  }
  syncAboutCarouselAutoplay();
}
function moveAboutCarousel(button) {
  const carousel = button.closest("[data-about-carousel]");
  if (!carousel) return;
  const current = Number(carousel.dataset.current) || 0;
  const next = button.hasAttribute("data-about-step")
    ? current + Number(button.dataset.aboutStep)
    : Number(button.dataset.aboutIndex);
  showAboutSlide(carousel, next);
  syncAboutCarouselAutoplay();
}
document.addEventListener("visibilitychange", syncAboutCarouselAutoplay);
function activateStoryTab(button) {
  const index = button.dataset.videoStory;
  document.querySelectorAll("[data-video-story]").forEach((tab) => {
    const active = tab === button;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  const panel = document.querySelector("[data-story-panel]");
  if (panel) panel.setAttribute("aria-labelledby", button.id);
  document.querySelectorAll("[data-story-video]").forEach((video) => {
    const active = video.dataset.storyVideo === index;
    video.classList.toggle("is-active", active);
    if (!active) video.pause();
  });
}
document.addEventListener("keydown", (event) => {
  const tab = event.target.closest?.("[data-video-story]");
  if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = Array.from(document.querySelectorAll("[data-video-story]"));
  const current = tabs.indexOf(tab);
  const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  event.preventDefault();
  tabs[next].focus();
  activateStoryTab(tabs[next]);
});
function syncDoctorControls() {
  const deck = document.querySelector(".doctorDeck");
  const controls = document.querySelector(".deckControls");
  const viewport = document.querySelector(".doctorViewport");
  if (!deck || !controls || !viewport) return;
  if (deck.classList.contains("is-expanded")) {
    controls.hidden = true;
    return;
  }
  controls.hidden = false;
  const cards = Array.from(deck.children);
  const visible = innerWidth > 940 ? 4 : innerWidth > 720 ? 2 : 1;
  const max = Math.max(0, cards.length - visible);
  doctorIndex = Math.max(0, Math.min(doctorIndex, max));
  const step = cards[0] ? cards[0].getBoundingClientRect().width + 20 : 0;
  deck.style.transform = `translateX(-${doctorIndex * step}px)`;
  controls.hidden = max === 0;
  controls.firstElementChild.disabled = doctorIndex === 0;
  controls.lastElementChild.disabled = doctorIndex >= max;
}
function syncContactPosition() {
  const appointment = document.getElementById("appointment");
  if (!appointment) return;
  const area = appointment.getBoundingClientRect();
  document.body.classList.toggle("formInView", area.top < innerHeight && area.bottom > 0);
}

async function prepareTestimonialVideos() {
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) return;
  const videos = Array.from(document.querySelectorAll("[data-story-video]"));
  for (const video of videos) {
    if (video.dataset.ready === "true") continue;
    const frame = document.querySelector(`[data-video-frame="${video.dataset.storyVideo}"]`);
    if (!frame) continue;
    try {
      await frame.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 960;
      canvas.height = 540;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(12);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 1100000 });
      const chunks = [];
      recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
      recorder.start();
      const started = performance.now();
      await new Promise((resolve) => {
        const draw = (now) => {
          const progress = Math.min((now - started) / 4200, 1);
          const scale = 1.03 + progress * 0.04;
          const width = frame.naturalWidth * scale;
          const height = frame.naturalHeight * scale;
          const fit = Math.min(canvas.width / width, canvas.height / height);
          const drawWidth = width * fit;
          const drawHeight = height * fit;
          ctx.fillStyle = "#d9ecfb";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(frame, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
          ctx.fillStyle = "rgba(9,54,90,.16)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (progress < 1) requestAnimationFrame(draw); else resolve();
        };
        requestAnimationFrame(draw);
      });
      recorder.stop();
      await new Promise((resolve) => { recorder.onstop = resolve; });
      video.src = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
      video.dataset.ready = "true";
      video.load();
    } catch {
      // Keep the poster visible if the browser cannot create a local preview video.
    }
  }
}
document.addEventListener("click", (event) => {
  const direction = event.target.closest("[data-slide]");
  if (direction) {
    const deck = document.querySelector(".doctorDeck");
    if (deck) {
      deck.classList.add("is-sliding");
      doctorIndex += Number(direction.dataset.slide);
      syncDoctorControls();
      window.setTimeout(() => deck.classList.remove("is-sliding"), 220);
    }
  }
  const all = event.target.closest("[data-see-all]");
  if (all) {
    const deck = document.querySelector(".doctorDeck");
    const viewport = document.querySelector(".doctorViewport");
    if (deck && viewport) {
      const expanded = deck.classList.toggle("is-expanded");
      viewport.classList.toggle("is-expanded", expanded);
      all.setAttribute("aria-expanded", String(expanded));
      const label = all.firstChild;
      if (label && label.nodeType === Node.TEXT_NODE) {
        label.textContent = expanded ? (document.documentElement.lang === "bn" ? "সীমিত দেখুন" : "Show fewer") : (document.documentElement.lang === "bn" ? "সব চিকিৎসক দেখুন" : "See all doctors");
      }
      syncDoctorControls();
    }
  }
  const story = event.target.closest("[data-video-story]");
  if (story) activateStoryTab(story);
  const aboutControl = event.target.closest("[data-about-step], [data-about-index]");
  if (aboutControl) moveAboutCarousel(aboutControl);
  requestAnimationFrame(syncDoctorControls);
});
document.addEventListener("scroll",syncDoctorControls,true);
window.addEventListener("resize",syncDoctorControls);
window.addEventListener("scroll",syncContactPosition,{passive:true});
window.addEventListener("resize",syncContactPosition);
syncDoctorControls();
syncContactPosition();
initAboutCarousel();
prepareTestimonialVideos();
