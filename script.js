// PartPilot portfolio interactions and motion
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.textContent = open ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.textContent = '☰';
  }));
}

// Scroll progress indicator
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.appendChild(progress);

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = amount + '%';
};
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Reveal sections and cards as they enter the viewport
const motionItems = document.querySelectorAll(
  '.hero-copy, .hero-visual, .stats, .section-heading, .about-lead, .about-copy, ' +
  '.project-card, .project-grid > *, .screen-card, .feature-card, .workflow-step, ' +
  '.database-panel, .skill-box, .learning-banner, .contact-panel, .project-fact, .footer'
);
document.body.classList.add('js-motion');
motionItems.forEach((item, index) => {
  item.classList.add('reveal');
  if (index % 5 === 1) item.classList.add('reveal-scale');
  if (index % 7 === 3) item.classList.add('reveal-left');
  if (item.parentElement && item.parentElement.children.length > 1) {
    item.style.setProperty('--stagger-delay', (Array.from(item.parentElement.children).indexOf(item) * 85) + 'ms');
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });
  motionItems.forEach(item => revealObserver.observe(item));
} else {
  motionItems.forEach(item => item.classList.add('is-visible'));
}

// Soft pointer-following glow on interactive cards (desktop only)
const glowCards = document.querySelectorAll('.project-card, .screen-card, .feature-card, .skill-box');
glowCards.forEach(card => {
  card.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', (event.clientX - rect.left) + 'px');
    card.style.setProperty('--pointer-y', (event.clientY - rect.top) + 'px');
  });
});

// Expand screenshots into a full-screen, contained image viewer
const screenshots = document.querySelectorAll('.screen-card img');
if (screenshots.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Screenshot viewer');
  lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image">×</button><img alt=""><span class="lightbox-hint">TAP OUTSIDE OR PRESS ESC TO CLOSE</span>';
  document.body.appendChild(lightbox);
  const largeImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let previousFocus = null;

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  };
  const openLightbox = image => {
    previousFocus = document.activeElement;
    largeImage.src = image.currentSrc || image.src;
    largeImage.alt = image.alt || 'Expanded project screenshot';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  screenshots.forEach(image => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', 'Enlarge screenshot: ' + (image.alt || 'project screenshot'));
    image.addEventListener('click', () => openLightbox(image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });
  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

// Feature cards respond to clicks with a polished focus/selection state
document.querySelectorAll('.feature-card').forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-pressed', 'false');
  const activate = () => {
    const active = card.classList.toggle('is-expanded');
    card.setAttribute('aria-pressed', String(active));
  };
  card.addEventListener('click', activate);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });
});
