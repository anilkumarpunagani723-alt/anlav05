const services = {
  "web-design": {
    name: "Web Design",
    category: "01 / DIGITAL DESIGN",
    intro: "A distinctive, easy-to-use website design shaped around your brand, your audience and the way you want your business to grow.",
    features: ["Brand-led visual direction", "Responsive page layouts", "User experience planning", "Design handoff and guidance"],
    plans: [
      { name: "Essential", price: "₹12,000", detail: "A polished foundation for a smaller site.", features: ["Up to 3 page designs", "Mobile and desktop layouts", "One design revision"] },
      { name: "Business", price: "₹22,000", detail: "A complete design system for a growing business.", features: ["Up to 6 page designs", "Responsive layouts", "Two design revisions"] },
      { name: "Signature", price: "₹35,000", detail: "A deeper, more tailored digital experience.", features: ["Up to 10 page designs", "Custom visual direction", "Three design revisions"] }
    ]
  },
  "web-development": {
    name: "Web Development",
    category: "02 / WEBSITE DEVELOPMENT",
    intro: "Fast, responsive websites built with clean modern code, thoughtful interactions and the technical foundations to grow with your business.",
    features: ["Responsive front-end build", "Cross-browser testing", "Performance fundamentals", "Launch support"],
    plans: [
      { name: "Essential", price: "₹18,000", detail: "A focused, professional website to get started.", features: ["Up to 3 pages", "Responsive implementation", "Contact form setup"] },
      { name: "Business", price: "₹35,000", detail: "A flexible website for an established business.", features: ["Up to 6 pages", "Custom interactions", "Basic on-page SEO"] },
      { name: "Signature", price: "₹60,000", detail: "A broader build with room for custom needs.", features: ["Up to 10 pages", "Advanced interactions", "Content and launch support"] }
    ]
  },
  maintenance: {
    name: "Website Maintenance",
    category: "03 / ONGOING SUPPORT",
    intro: "Reliable ongoing care for your website, so updates, checks and small improvements don't get left until something breaks.",
    features: ["Routine website health checks", "Content and plugin updates", "Backup and uptime monitoring", "Direct support for requests"],
    plans: [
      { name: "Essential", price: "₹2,500", period: "/ month", detail: "The essentials to keep a small site looked after.", features: ["Monthly updates and checks", "Backup monitoring", "Up to 1 hour of small changes"] },
      { name: "Business", price: "₹5,000", period: "/ month", detail: "More hands-on support for an active website.", features: ["Fortnightly checks", "Updates and backup monitoring", "Up to 3 hours of small changes"] },
      { name: "Priority", price: "₹9,000", period: "/ month", detail: "Frequent care and faster help when needed.", features: ["Weekly checks", "Priority support", "Up to 6 hours of small changes"] }
    ]
  },
  redesign: {
    name: "Website Redesign",
    category: "04 / WEBSITE REDESIGN",
    intro: "A considered refresh of an outdated website, improving its visual clarity, usability and performance while keeping your business goals front and centre.",
    features: ["Review of your current website", "Updated visual direction", "Responsive page designs", "Development and launch options"],
    plans: [
      { name: "Essential", price: "₹15,000", detail: "A focused refresh for your most important pages.", features: ["Up to 3 pages refreshed", "Responsive design", "One design revision"] },
      { name: "Business", price: "₹28,000", detail: "A complete refresh for a growing website.", features: ["Up to 6 pages refreshed", "Updated visual system", "Two design revisions"] },
      { name: "Signature", price: "₹45,000", detail: "A full rethink for a more complex website.", features: ["Up to 10 pages refreshed", "Custom design direction", "Three design revisions"] }
    ]
  }
};

const requestedService = new URLSearchParams(window.location.search).get("service");
const service = services[requestedService] || services["web-design"];
const title = document.querySelector("#service-title");

const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute(
    "content",
    `${service.name} services from ANLAV — tailored web design, development, maintenance and redesign support for growing businesses.`
  );
}

document.title = `${service.name} — Services & Pricing — ANLAV®`;
document.querySelector("#service-kicker").textContent = service.category;
title.textContent = service.name;
document.querySelector("#service-intro").textContent = service.intro;
document.querySelector("#service-features").replaceChildren(...service.features.map((feature) => {
  const item = document.createElement("li");
  item.textContent = feature;
  return item;
}));

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `${service.name} by ANLAV`,
  "provider": {
    "@type": "ProfessionalService",
    "name": "ANLAV",
    "email": "anilkumarpunagani723@gmail.com",
    "url": "index.html"
  },
  "description": service.intro,
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "category": service.name
  }
};

document.head.insertAdjacentHTML(
  "beforeend",
  `<script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>`
);

const pricingGrid = document.querySelector("#pricing-grid");
pricingGrid.replaceChildren(...service.plans.map((plan) => {
  const card = document.createElement("article");
  card.className = "pricing-plan";

  const name = document.createElement("p");
  name.className = "eyebrow pricing-plan-name";
  name.textContent = plan.name;

  const price = document.createElement("p");
  price.className = "pricing-price";
  price.textContent = plan.price;
  if (plan.period) {
    const period = document.createElement("span");
    period.textContent = plan.period;
    price.append(period);
  }

  const detail = document.createElement("p");
  detail.className = "pricing-detail";
  detail.textContent = plan.detail;

  const list = document.createElement("ul");
  list.className = "pricing-features";
  list.append(...plan.features.map((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    return item;
  }));

  const contact = document.createElement("a");
  contact.className = "button pricing-action";
  contact.href = "#contact";
  contact.dataset.serviceEnquiry = "true";
  contact.dataset.plan = plan.name;
  contact.textContent = "Enquire about this plan";

  card.append(name, price, detail, list, contact);
  return card;
}));

const contactMessage = document.querySelector("#contact-message");
document.querySelectorAll("[data-service-enquiry]").forEach((link) => {
  link.addEventListener("click", () => {
    contactMessage.value = `I'm interested in the ${planName(link.dataset.plan)} plan for ${service.name}. Please get in touch to discuss the project.`;
  });
});

function planName(name) {
  return name.toLowerCase();
}

const contactForm = document.querySelector("#service-contact-form");
const contactFormNote = document.querySelector("#contact-form-note");
const contactSubmit = contactForm.querySelector("button[type='submit']");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  contactSubmit.disabled = true;
  contactFormNote.textContent = "Sending your enquiry...";

  try {
    const response = await fetch("https://formsubmit.co/ajax/anilkumarpunagani723@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        service: service.name,
        message: formData.get("message"),
        _subject: `${service.name} enquiry`,
        _replyto: formData.get("email"),
        _template: "table"
      })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error("The enquiry service did not accept the message.");
    }
    if (![true, "true"].includes(result.success)) {
      if (result.message?.toLowerCase().includes("activation")) {
        contactFormNote.textContent = "Check your inbox for the FormSubmit activation email and click its Activate Form link. Enquiries will be delivered here after activation.";
        return;
      }
      throw new Error("The enquiry service did not accept the message.");
    }
    contactForm.reset();
    contactFormNote.textContent = "Thanks, your enquiry has been sent. We'll be in touch soon.";
  } catch {
    contactFormNote.textContent = "We couldn't send your enquiry just now. Please use the email link below instead.";
  } finally {
    contactSubmit.disabled = false;
  }
});
