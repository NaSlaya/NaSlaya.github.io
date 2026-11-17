(() => {
  const body = document.body;
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const progress = document.querySelector('.scroll-progress span');
  let scrollTicking = false;
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateProgress);
      scrollTicking = true;
    }
  }, { passive: true });
  updateProgress();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    body.classList.add('has-pointer');
    let pointerX = -500, pointerY = -500, glowX = -500, glowY = -500;
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    }, { passive: true });
    const followPointer = () => {
      glowX += (pointerX - glowX) * .12;
      glowY += (pointerY - glowY) * .12;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(followPointer);
    };
    requestAnimationFrame(followPointer);
  }

  // Subtle 3D tilt, enabled only on pointer devices and disabled for reduced motion.
  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = 'perspective(1100px) rotateX(' + (-y * 2.2) + 'deg) rotateY(' + (x * 2.2) + 'deg) translateY(-3px)';
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Close the mobile menu when Escape is pressed.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav && toggle) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();