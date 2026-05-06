/* =============================================
   EVOLVED EYES AGENCY — script.js
   Handles: Nav, Package Tabs, Contact Form (EmailJS),
            Scroll Animations, Stats Counter, Back-to-Top
   ============================================= */

/* ─────────────────────────────────────────────
   EMAILJS CONFIGURATION
   ─────────────────────────────────────────────
   HOW TO SET THIS UP (free — takes 5 minutes):
   1. Go to https://www.emailjs.com and create a free account.
   2. Click "Add New Service" → choose Gmail → connect your
      evolved.eyes.agency@gmail.com account. Copy the Service ID.
   3. Click "Email Templates" → "Create New Template".
      Use these template variables in your template body:
        From:    {{from_name}} <{{from_email}}>
        Subject: New Enquiry from {{from_name}} – {{service}}
        Body:
          Name:     {{from_name}}
          Business: {{business_name}}
          Email:    {{from_email}}
          Phone:    {{phone}}
          Service:  {{service}}
          Message:  {{message}}
      Save and copy the Template ID.
   4. In your EmailJS dashboard go to Account → Public Key.
      Copy that key.
   5. Paste all three values into the constants below.
   ─────────────────────────────────────────────*/

const EMAILJS_PUBLIC_KEY  = 'dhDLE6RH1UXB-cxsL';
const EMAILJS_SERVICE_ID  = 'service_5yri2t4';
const EMAILJS_TEMPLATE_ID = 'template_hvl3btl';

// Initialise EmailJS with your public key
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();


/* ─────────────────────────────────────────────
   DOM READY
   ─────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', function () {

  initNavbar();
  initPackageTabs();
  initContactForm();
  initScrollAnimations();
  initStatCounters();
  initBackToTop();

});


/* ─────────────────────────────────────────────
   1. NAVBAR — scroll shrink + mobile toggle
   ─────────────────────────────────────────────*/
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = navLinks ? navLinks.querySelectorAll('a') : [];

  // Shrink nav on scroll
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load in case page is already scrolled

  // Mobile hamburger toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when any nav link is clicked
    allLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  }
}


/* ─────────────────────────────────────────────
   2. PACKAGE TABS — Lead Generation / Website Design
   ─────────────────────────────────────────────*/
function initPackageTabs() {
  const tabs         = document.querySelectorAll('.pkg-tab');
  const pkgLeadGen   = document.getElementById('pkg-leadgen');
  const pkgWebDesign = document.getElementById('pkg-webdesign');

  if (!tabs.length || !pkgLeadGen || !pkgWebDesign) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = this.dataset.tab; // 'leadgen' or 'webdesign'

      // Update active state on all tabs
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      // Show/hide the correct packages grid
      if (target === 'leadgen') {
        pkgLeadGen.classList.remove('hidden');
        pkgWebDesign.classList.add('hidden');
      } else if (target === 'webdesign') {
        pkgWebDesign.classList.remove('hidden');
        pkgLeadGen.classList.add('hidden');
      }
    });
  });
}


/* ─────────────────────────────────────────────
   3. CONTACT FORM — EmailJS submission
   ─────────────────────────────────────────────*/
function initContactForm() {
  const form          = document.getElementById('contactForm');
  const submitBtn     = document.getElementById('formSubmitBtn');
  const btnIcon       = document.getElementById('btnIcon');
  const btnText       = document.getElementById('btnText');
  const successMsg    = document.getElementById('formSuccess');
  const errorMsg      = document.getElementById('formError');
  const errorMsgText  = document.getElementById('formErrorMsg');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // ── Basic client-side validation ──
    const name     = form.name.value.trim();
    const business = form.business.value.trim();
    const email    = form.email.value.trim();
    const service  = form.service.value;

    if (!name || !business || !email || !service) {
      showError('Please fill in all required fields before submitting.');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    // ── Loading state ──
    setLoading(true);
    hideMessages();

    // ── EmailJS — send the email ──
    // These variable names must match your EmailJS template exactly
    const templateParams = {
      from_name:     name,
      business_name: business,
      from_email:    email,
      phone:         form.phone.value.trim() || 'Not provided',
      service:       service,
      message:       form.message.value.trim() || 'No additional message provided.',
      reply_to:      email,
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        setLoading(false);
        showSuccess();
        form.reset();
      })
      .catch(function (err) {
        setLoading(false);
        console.error('[EmailJS Error]', err);
        showError(
          'Could not send your message right now. Please email us directly at evolved.eyes.agency@gmail.com'
        );
      });
  });

  // ── Helpers ──
  function setLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.classList.add('btn-loading');
      if (btnIcon) btnIcon.className = 'fas fa-spinner';
      if (btnText) btnText.textContent = 'Sending…';
    } else {
      submitBtn.classList.remove('btn-loading');
      if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
      if (btnText) btnText.textContent = 'Send My Enquiry';
    }
  }

  function showSuccess() {
    if (successMsg) successMsg.classList.remove('hidden');
    if (errorMsg)   errorMsg.classList.add('hidden');
    // Auto-hide success after 8 seconds
    setTimeout(function () {
      if (successMsg) successMsg.classList.add('hidden');
    }, 8000);
  }

  function showError(message) {
    if (errorMsgText) errorMsgText.textContent = message;
    if (errorMsg) errorMsg.classList.remove('hidden');
    if (successMsg) successMsg.classList.add('hidden');
  }

  function hideMessages() {
    if (successMsg) successMsg.classList.add('hidden');
    if (errorMsg)   errorMsg.classList.add('hidden');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/* ─────────────────────────────────────────────
   4. SCROLL ANIMATIONS — IntersectionObserver
   ─────────────────────────────────────────────*/
function initScrollAnimations() {
  const revealEls = document.querySelectorAll('.reveal-on-scroll');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
}


/* ─────────────────────────────────────────────
   5. HERO STAT COUNTERS — animated numbers
   ─────────────────────────────────────────────*/
function initStatCounters() {
  const statEls = document.querySelectorAll('.stat-num');

  if (!statEls.length) return;

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statEls.forEach(function (el) { observer.observe(el); });

  function animateStat(el) {
    const target   = el.getAttribute('data-target');
    const isPrefix = target && target.startsWith('+');
    const numStr   = target ? target.replace(/[^0-9.]/g, '') : '0';
    const end      = parseFloat(numStr);
    const suffix   = target ? target.replace(/[0-9.+]/g, '') : '';
    const prefix   = isPrefix ? '+' : '';
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(eased * end);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }
}


/* ─────────────────────────────────────────────
   6. BACK TO TOP BUTTON
   ─────────────────────────────────────────────*/
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}