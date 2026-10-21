(() => {
  "use strict";
  const config = window.PORTFOLIO_CONFIG || {};
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  $("#year").textContent = new Date().getFullYear();

  const nav = $(".site-nav");
  const topButton = $(".back-to-top");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 24);
    topButton.classList.toggle("visible", window.scrollY > 520);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Close the mobile menu after choosing a section.
  $$("#mainNav .nav-link, #mainNav .nav-cta").forEach(link => {
    link.addEventListener("click", () => {
      const menu = $("#mainNav");
      if (menu.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  const sections = $$("main section[id]");
  const navLinks = $$("#mainNav .nav-link");
  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => activeObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(el => revealObserver.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in-view"));
  }

  const email = (config.email || "").trim();
  const emailConfigured = email && !email.includes("YOUR_EMAIL") && email.includes("@");
  const emailText = $$("[data-email-text]");
  const emailLinks = $$("[data-email-link]");
  emailText.forEach(el => { el.textContent = emailConfigured ? email : "Add your email in js/config.js"; });
  emailLinks.forEach(el => {
    if (emailConfigured) {
      el.href = `mailto:${email}`;
      el.removeAttribute("aria-disabled");
    } else {
      el.href = "#contact";
      el.addEventListener("click", event => {
        event.preventDefault();
        setFormStatus("Add your email address in js/config.js first.", "error");
      });
    }
  });

  const linkedinLink = $("[data-linkedin-link]");
  if (linkedinLink && config.linkedinUrl) {
    linkedinLink.href = config.linkedinUrl;
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener noreferrer";
  } else if (linkedinLink) {
    linkedinLink.href = "#contact";
    linkedinLink.title = "Add your LinkedIn URL in js/config.js";
    linkedinLink.addEventListener("click", event => {
      event.preventDefault();
      setFormStatus("Add your LinkedIn URL in js/config.js when ready.", "error");
    });
  }

  const copyStatus = $("[data-copy-status]");
  $("[data-copy-email]")?.addEventListener("click", async () => {
    if (!emailConfigured) {
      copyStatus.textContent = "Add your email address in js/config.js first.";
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = "Email address copied.";
    } catch {
      copyStatus.textContent = `Your email: ${email}`;
    }
  });

  const form = $("#contactForm");
  const submitButton = $("#sendButton");
  const status = $("#formStatus");
  const initialButtonHTML = submitButton.innerHTML;

  function setFormStatus(message, type = "") {
    status.textContent = message;
    status.className = `form-status${type ? ` ${type}` : ""}`;
  }

  function emailJsReady() {
    const settings = config.emailjs || {};
    return emailConfigured &&
      settings.publicKey && !settings.publicKey.includes("YOUR_") &&
      settings.serviceId && !settings.serviceId.includes("YOUR_") &&
      settings.templateId && !settings.templateId.includes("YOUR_") &&
      window.emailjs && typeof window.emailjs.send === "function";
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    setFormStatus("");

    // Browser validation plus Bootstrap styling.
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      const firstInvalid = form.querySelector(":invalid");
      firstInvalid?.focus();
      setFormStatus("Please check the highlighted fields.", "error");
      return;
    }

    // Honeypot: silently reject bot submissions without sending.
    if ($("#company").value.trim()) {
      form.reset();
      form.classList.remove("was-validated");
      setFormStatus("Thanks. Your message has been received.", "success");
      return;
    }

    if (!emailJsReady()) {
      if (!emailConfigured) {
        setFormStatus("Add your real email address in js/config.js before using the contact form.", "error");
        return;
      }
      const subject = encodeURIComponent(`[Portfolio] ${$("#subject").value.trim()}`);
      const body = encodeURIComponent(
        `Name: ${$("#name").value.trim()}\nEmail: ${$("#email").value.trim()}\n\n${$("#message").value.trim()}`
      );
      setFormStatus("Opening your email app with this message. Please press Send in the email app to deliver it.", "success");
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';
    setFormStatus("Sending your message…");

    try {
      window.emailjs.init({ publicKey: config.emailjs.publicKey });
      const templateParams = {
        to_email: email,
        from_name: $("#name").value.trim(),
        reply_to: $("#email").value.trim(),
        from_email: $("#email").value.trim(),
        subject: $("#subject").value.trim(),
        message: $("#message").value.trim()
      };
      await window.emailjs.send(config.emailjs.serviceId, config.emailjs.templateId, templateParams);
      form.reset();
      form.classList.remove("was-validated");
      setFormStatus("Message sent successfully. Thanks for reaching out!", "success");
    } catch (error) {
      console.error("EmailJS submission failed:", error);
      setFormStatus("Sorry, your message could not be sent. Please try again or email me directly.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = initialButtonHTML;
    }
  });
})();