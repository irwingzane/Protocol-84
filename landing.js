const loadingScreen = document.getElementById('loadingScreen');

function hideLoadingScreen() {
  if (!loadingScreen) return;
  loadingScreen.classList.add('loading-screen-fade');
  loadingScreen.addEventListener(
    'transitionend',
    () => {
      loadingScreen.remove();
    },
    { once: true }
  );
}

const minLoadTime = 1200;
const loadStart = Date.now();

if (document.readyState === 'complete') {
  const delay = Math.max(0, minLoadTime - (Date.now() - loadStart));
  setTimeout(hideLoadingScreen, delay);
} else {
  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStart;
    const delay = Math.max(0, minLoadTime - elapsed);
    setTimeout(hideLoadingScreen, delay);
  });
}

const scrollButtons = document.querySelectorAll('[data-scroll-to]');

scrollButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-scroll-to');
    if (!target) return;
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const yearSpan = document.getElementById('footerYear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

const demoForm = document.getElementById('demoForm');
const statusEl = document.getElementById('demoFormStatus');

if (demoForm && statusEl) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(demoForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const existing = JSON.parse(localStorage.getItem('demoRequests') || '[]');
      existing.push({
        ...payload,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('demoRequests', JSON.stringify(existing));
    } catch {
      // ignore storage issues in this simple MVP
    }

    demoForm.reset();
    statusEl.textContent = 'Thank you. Your demo request has been recorded for follow-up.';
  });
}

const purchaseButtons = document.querySelectorAll('[data-purchase-tier]');

purchaseButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tier = btn.getAttribute('data-purchase-tier');
    if (!tier) return;

    try {
      const purchaseRecord = {
        tier,
        purchasedAt: new Date().toISOString(),
      };
      localStorage.setItem('companyAccess', JSON.stringify(purchaseRecord));
    } catch {
      // ignore storage issues in this simple MVP
    }

    alert(
      'This is a simulated checkout for the MVP. In production, this button would redirect to a secure payment gateway such as Stripe Checkout.\n\nCompany access has been marked as active for local testing.'
    );
  });
});

const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    mobileNav.hidden = isExpanded;
  });

  mobileNav.querySelectorAll('[data-mobile-nav-link]').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });
}

document.body.classList.add('enable-scroll-reveal');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    el.classList.add('reveal-visible');
  });
}

