const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = [...document.querySelectorAll(".nav-link")];
const backToTop = document.querySelector(".back-to-top");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu(returnFocus = false) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu(true);
  }
});

let scrollTicking = false;
function updateScrollState() {
  const scrollPosition = window.scrollY;
  header.classList.toggle("is-scrolled", scrollPosition > 18);
  backToTop.classList.toggle("is-visible", scrollPosition > 650);
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollState);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollState();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });
});

const observedSections = ["home", "work", "services", "about", "process", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navAnchors.forEach((anchor) => {
      const active = anchor.getAttribute("href") === `#${visible.target.id}`;
      anchor.classList.toggle("is-active", active);
      if (active) anchor.setAttribute("aria-current", "location");
      else anchor.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -62% 0px", threshold: [0, 0.15, 0.4] });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");
function animateFeatureNumber(element) {
  const target = Number(element.dataset.count);
  if (!target || element.dataset.counted) return;
  element.dataset.counted = "true";
  if (reducedMotion.matches) {
    element.textContent = String(target).padStart(2, "0");
    return;
  }
  const duration = 480;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = String(Math.round(target * eased)).padStart(2, "0");
    if (progress < 1) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      const counter = entry.target.querySelector("[data-count]");
      if (counter) animateFeatureNumber(counter);
      if (entry.target.matches(".feature-row")) animateFeatureNumber(entry.target.querySelector("[data-count]"));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (window.matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
  document.querySelectorAll(".project-art").forEach((art) => {
    art.addEventListener("pointermove", (event) => {
      const bounds = art.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      art.style.setProperty("--mx", `${x}%`);
      art.style.setProperty("--my", `${y}%`);
    });
    art.addEventListener("pointerleave", () => {
      art.style.setProperty("--mx", "50%");
      art.style.setProperty("--my", "50%");
    });
  });
}

const projectDetails = {
  nova: {
    name: "Nova Business",
    category: "CORPORATE WEBSITE",
    description: "A confident digital home for a modern consultancy. Clear messaging, a considered visual language and an easy path from first visit to first conversation.",
    tags: ["Strategy", "Web Design", "Development"]
  },
  velora: {
    name: "Velora Store",
    category: "E-COMMERCE EXPERIENCE",
    description: "A refined storefront built around the feeling of discovering something worth keeping. Editorial product storytelling meets a simple, friction-free shopping experience.",
    tags: ["Art Direction", "E-commerce", "UX / UI"]
  },
  apex: {
    name: "Apex Studio",
    category: "CREATIVE AGENCY WEBSITE",
    description: "An expressive portfolio for an independent creative studio, designed to let the work lead and make starting a conversation feel effortless.",
    tags: ["Creative Direction", "Web Design", "React"]
  },
  monarch: {
    name: "Monarch",
    category: "LUXURY BRAND LANDING PAGE",
    description: "A quiet, editorial introduction to a contemporary luxury label. Artful pacing, tactile imagery and a distinctive point of view bring the collection to life.",
    tags: ["Art Direction", "Storytelling", "Web Design"]
  }
};

const projectDialog = document.querySelector(".project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCategory = document.querySelector(".dialog-kicker span");
const dialogDescription = document.querySelector(".dialog-description");
const dialogTags = document.querySelector(".dialog-tags");

document.querySelectorAll("[data-open-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.openProject];
    if (!project) return;
    dialogTitle.textContent = project.name;
    dialogCategory.textContent = project.category;
    dialogDescription.textContent = project.description;
    dialogTags.replaceChildren(...project.tags.map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    }));
    projectDialog.showModal();
  });
});

projectDialog.querySelector(".dialog-close").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
projectDialog.querySelector(".dialog-bottom a").addEventListener("click", () => projectDialog.close());
