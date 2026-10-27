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

const projectCards = [...document.querySelectorAll('.project-card')];
const projectFilters = [...document.querySelectorAll('.project-filter')];
const projectSearch = document.querySelector('#projectSearch');
const projectEmpty = document.querySelector('#projectEmpty');
const projectDialog = document.querySelector('.project-dialog');
let activeProjectFilter = 'all';

const updateProjects = () => {
  const query = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const matchesCategory = activeProjectFilter === 'all' || card.dataset.category === activeProjectFilter;
    const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
    const visible = matchesCategory && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  projectEmpty.hidden = visibleCount > 0;
};

projectFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    activeProjectFilter = filter.dataset.filter;
    projectFilters.forEach((button) => {
      const isActive = button === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    updateProjects();
  });
});

projectSearch.addEventListener('input', updateProjects);

const openProjectDetails = (button) => {
  const card = button.closest('.project-card');
  const title = card.querySelector('.project-info h3').textContent.trim();
  const description = card.querySelector('.project-info p').textContent.trim();
  const modalTitle = projectDialog.querySelector('#projectDialogTitle');
  const modalOverview = projectDialog.querySelector('.dialog-overview');
  const modalIndex = projectDialog.querySelector('#projectDialogIndex');
  const modalArt = projectDialog.querySelector('.dialog-art');
  const modalTags = projectDialog.querySelector('.dialog-tags');
  const contactLink = projectDialog.querySelector('.dialog-contact');

  modalTitle.textContent = title;
  modalOverview.textContent = description;
  modalIndex.textContent = card.querySelector('.project-index').textContent.trim();
  modalArt.replaceChildren(card.querySelector('.project-art').cloneNode(true));
  modalTags.replaceChildren(...[...card.querySelectorAll('.project-info .tags span')].map((tag) => {
    const chip = document.createElement('span');
    chip.textContent = tag.textContent;
    return chip;
  }));
  contactLink.href = `mailto:yash.borse0806@gmail.com?subject=${encodeURIComponent(`Question about ${title}`)}`;
  projectDialog.showModal();
};

document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => openProjectDetails(button));
});

projectDialog.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

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

