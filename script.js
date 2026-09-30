const progressBar = document.getElementById('progressBar');
const accordion = document.querySelector('[data-accordion]');
const projectItems = accordion ? [...accordion.querySelectorAll('[data-project-item]')] : [];

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

function panelParts(item) {
  return {
    button: item.querySelector('[data-project-toggle]'),
    panel: item.querySelector('[data-project-panel]')
  };
}

function setItemState(item, open, { updateHash = false } = {}) {
  const { button, panel } = panelParts(item);
  if (!button || !panel) return;

  item.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
  panel.setAttribute('aria-hidden', String(!open));

  if (updateHash) {
    history.replaceState(null, '', open ? `#${item.id}` : '#work');
  }
}

function activateItem(item) {
  const isAlreadyOpen = item.classList.contains('is-open');

  projectItems.forEach((other) => {
    if (other !== item) setItemState(other, false);
  });

  setItemState(item, !isAlreadyOpen, { updateHash: true });

  // Update the progress bar after layout settles. No scroll anchoring here:
  // the user stays fully in control of scrolling during the animation.
  requestAnimationFrame(onScroll);
  window.setTimeout(onScroll, 1050);
}

projectItems.forEach((item) => {
  const { button } = panelParts(item);
  if (!button) return;
  button.addEventListener('click', () => activateItem(item));
});

const initialId = /^#project-0[1-3]$/.test(window.location.hash)
  ? window.location.hash.slice(1)
  : null;

if (initialId) {
  const initialItem = document.getElementById(initialId);
  if (initialItem) setItemState(initialItem, true);
}

window.addEventListener('hashchange', () => {
  if (!/^#project-0[1-3]$/.test(window.location.hash)) return;
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target) return;
  projectItems.forEach((item) => setItemState(item, item === target));
  requestAnimationFrame(onScroll);
});

window.addEventListener('resize', onScroll, { passive: true });
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
