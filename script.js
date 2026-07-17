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
