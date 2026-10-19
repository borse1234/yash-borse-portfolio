const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('is-open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const cursor = document.querySelector('.cursor-orb');
const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

if (supportsCustomCursor.matches && cursor) {
  document.body.classList.add('has-custom-cursor');
  let targetX = -100;
  let targetY = -100;
  let cursorX = targetX;
  let cursorY = targetY;
  let frame = 0;

  const animateCursor = () => {
    cursorX += (targetX - cursorX) * 0.24;
    cursorY += (targetY - cursorY) * 0.24;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    if (Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY) > 0.4) {
      frame = requestAnimationFrame(animateCursor);
    } else {
      frame = 0;
    }
  };

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!frame) frame = requestAnimationFrame(animateCursor);
  }, { passive: true });

  window.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  window.addEventListener('pointerover', (event) => {
    if (event.target.closest('a, button, [role="button"]')) cursor.classList.add('is-hovering');
  });
  window.addEventListener('pointerout', (event) => {
    if (event.target.closest('a, button, [role="button"]') && !event.relatedTarget?.closest('a, button, [role="button"]')) {
      cursor.classList.remove('is-hovering');
    }
  });
  document.documentElement.addEventListener('pointerleave', () => cursor.style.opacity = '0');
  document.documentElement.addEventListener('pointerenter', () => cursor.style.opacity = '');
}