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

const navDropdownToggle = document.getElementById('navDropdownToggle');
const navDropdown = document.getElementById('navDropdown');

if (navDropdownToggle && navDropdown) {
  navDropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !navDropdown.hidden;
    navDropdown.hidden = isOpen;
    navDropdownToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  navDropdown.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navDropdown.hidden = true;
      navDropdownToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', () => {
    if (!navDropdown.hidden) {
      navDropdown.hidden = true;
      navDropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const yearSpan = document.getElementById('footerYear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

const demoForm = document.getElementById('demoForm');
const statusEl = document.getElementById('demoFormStatus');
const FORMSPREE_FORM_ID = 'xaqdpnaq';

if (demoForm && statusEl) {
  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dateInput = document.getElementById('preferredDate');
    const timeInput = document.getElementById('preferredTime');
    const hiddenDateTime = document.getElementById('preferredDateTime');
    if (hiddenDateTime && dateInput && timeInput) {
      const d = dateInput.value.trim();
      const t = timeInput.value.trim();
      hiddenDateTime.value = (d && t) ? d + 'T' + t : (d || t);
    }

    const submitBtn = demoForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : 'Send';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    statusEl.textContent = '';

    const formData = new FormData(demoForm);
    const payload = Object.fromEntries(formData.entries());
    const preferredDateTime = (payload.preferredDateTime || '').toString().trim();
    if (preferredDateTime) {
      try {
        formData.set('preferredDateTime', new Date(preferredDateTime).toLocaleString());
      } catch {
        formData.set('preferredDateTime', preferredDateTime);
      }
    }

    try {
      const res = await fetch('https://formspree.io/f/' + FORMSPREE_FORM_ID, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        demoForm.reset();
        statusEl.textContent = 'Thanks. Your request has been sent and we’ll get back to you soon.';
      } else {
        const data = await res.json().catch(() => ({}));
        statusEl.textContent = data.error || 'Something went wrong. Sending via form instead…';
        // Fallback: programmatic submit (no submit event) so Formspree still receives it
        demoForm.submit();
        return;
      }
    } catch (err) {
      statusEl.textContent = 'Sending via form…';
      demoForm.submit();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
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

function initFeaturesCarousel() {
  const track = document.getElementById('featuresCarouselTrack');
  const viewport = document.querySelector('.features-carousel-viewport');
  const prevBtn = document.querySelector('.features-carousel-prev');
  const nextBtn = document.querySelector('.features-carousel-next');
  const dotsEl = document.getElementById('featuresCarouselDots');
  if (!track || !viewport) return;

  const slides = track.querySelectorAll('.features-carousel-slide');
  const total = slides.length;
  const gap = 16;
  let currentIndex = 0;

  function getSlidesVisible() {
    if (window.matchMedia('(min-width: 960px)').matches) return 3;
    if (window.matchMedia('(min-width: 640px)').matches) return 2;
    return 1;
  }

  function updateCarousel() {
    const visible = getSlidesVisible();
    const maxIndex = Math.max(0, total - visible);
    currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);
    const viewportWidth = viewport.getBoundingClientRect().width;
    const slideWidth = (viewportWidth - (visible - 1) * gap) / visible;
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

    if (dotsEl) {
      dotsEl.innerHTML = '';
      const numDots = maxIndex + 1;
      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'features-carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsEl.appendChild(dot);
      }
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex--;
      updateCarousel();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      updateCarousel();
    });
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

function initPricingCarousel() {
  const track = document.getElementById('pricingCarouselTrack');
  const viewport = document.querySelector('.pricing-carousel-viewport');
  const prevBtn = document.querySelector('.pricing-carousel-prev');
  const nextBtn = document.querySelector('.pricing-carousel-next');
  const dotsEl = document.getElementById('pricingCarouselDots');
  if (!track || !viewport) return;

  const slides = track.querySelectorAll('.pricing-carousel-slide');
  const total = slides.length;
  const gap = 16;
  let currentIndex = 0;

  function getSlidesVisible() {
    if (window.matchMedia('(min-width: 960px)').matches) return 3;
    if (window.matchMedia('(min-width: 640px)').matches) return 2;
    return 1;
  }

  function updateCarousel() {
    const visible = getSlidesVisible();
    const maxIndex = Math.max(0, total - visible);
    currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);
    const viewportWidth = viewport.getBoundingClientRect().width;
    const slideWidth = (viewportWidth - (visible - 1) * gap) / visible;
    const offset = currentIndex * (slideWidth + gap);
    track.style.gap = `${gap}px`;
    track.style.transform = `translateX(-${offset}px)`;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.minWidth = `${slideWidth}px`;
    });

    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

    if (dotsEl) {
      dotsEl.innerHTML = '';
      const numDots = maxIndex + 1;
      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'pricing-carousel-dot';
        dot.setAttribute('aria-label', `Go to plan ${i + 1}`);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsEl.appendChild(dot);
      }
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex--;
      updateCarousel();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      updateCarousel();
    });
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

function initCarousels() {
  initFeaturesCarousel();
  initPricingCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}

