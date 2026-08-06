// Logo splash — fades out on scroll down, back in on scroll up (homepage only)
const logoSplash = document.getElementById('logoSplash');

if (logoSplash) {
  const fadeDistance = () => Math.max(window.innerHeight * 0.1, 1);
  let ticking = false;

  const updateSplash = () => {
    const opacity = Math.max(0, 1 - window.scrollY / fadeDistance());
    logoSplash.style.opacity = String(opacity);
    ticking = false;
  };

  updateSplash();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateSplash);
      ticking = true;
    }
  });
}

// Horizontal scrolling photo gallery (Vogue-style project pages) — pins
// #horizGallery-sticky via CSS position:sticky, then translates the track
// horizontally in proportion to how far the page has scrolled through the
// wrapper's height. Disabled on mobile/reduced-motion, where the CSS falls
// back to a native horizontally-scrollable strip instead.
const horizGallery = document.getElementById('horizGallery');

if (horizGallery) {
  const track = horizGallery.querySelector('.horiz-gallery-track');
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollLength = 0;
  let ticking = false;
  let active = false;

  const measure = () => {
    scrollLength = Math.max(0, track.scrollWidth - window.innerWidth);
    horizGallery.style.height = `${window.innerHeight + scrollLength}px`;
  };

  const updateTrack = () => {
    const progress = Math.min(Math.max(-horizGallery.getBoundingClientRect().top, 0), scrollLength);
    track.style.transform = `translateX(-${progress}px)`;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateTrack);
      ticking = true;
    }
  };

  const enable = () => {
    if (active) return;
    active = true;
    measure();
    updateTrack();
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const disable = () => {
    if (!active) return;
    active = false;
    window.removeEventListener('scroll', onScroll);
    horizGallery.style.height = '';
    track.style.transform = '';
  };

  const sync = () => {
    if (mobileQuery.matches || motionQuery.matches) {
      disable();
    } else {
      enable();
      measure();
      updateTrack();
    }
  };

  sync();
  window.addEventListener('resize', sync);
  mobileQuery.addEventListener('change', sync);
  motionQuery.addEventListener('change', sync);
}

// Full-page menu overlay
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');

if (menuToggle && menuClose && menuOverlay) {
  const openMenu = () => {
    menuOverlay.classList.add('is-open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menuOverlay.classList.remove('is-open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  menuOverlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOverlay.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

// Contact form — static site, so this posts to Formspree (see TODO in index.html).
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const action = contactForm.getAttribute('action') || '';

    if (action.includes('YOUR_FORM_ID')) {
      formStatus.textContent = 'Form isn\'t connected yet — email contact@olaolastudio.com directly for now.';
      formStatus.className = 'form-status is-error';
      return;
    }

    formStatus.textContent = 'Sending…';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        formStatus.textContent = 'Thanks — message sent. I\'ll reply soon.';
        formStatus.className = 'form-status is-ok';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong — email contact@olaolastudio.com directly.';
        formStatus.className = 'form-status is-error';
      }
    } catch (error) {
      formStatus.textContent = 'Something went wrong — email contact@olaolastudio.com directly.';
      formStatus.className = 'form-status is-error';
    }
  });
}
