document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu(returnFocus = false) {
  if (!menu || !nav) return;
  menu.setAttribute('aria-expanded', 'false');
  nav.removeAttribute('data-open');
  menu.querySelector('span').textContent = '+';
  if (returnFocus) menu.focus();
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.dataset.open = String(open);
  menu.querySelector('span').textContent = open ? '−' : '+';
});
nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', e => {
  if (!e.target.closest('.site-header') && menu?.getAttribute('aria-expanded') === 'true') closeMenu();
});
matchMedia('(min-width: 651px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

const layers = {
  interface: ['THE INTERFACE', 'A faster React frontend for the people moving real orders through EPOD.'],
  services: ['THE SERVICES', 'Order and work-order logic moved into PHP/Laravel services and clearer REST APIs.'],
  operations: ['THE OPERATIONS', 'Packaging rules, FedEx shipping, and billing checks that reduce manual corrections.'],
  delivery: ['THE RELEASE', 'Docker images and Jenkins pipelines make releases on AWS more repeatable.'],
};
document.querySelectorAll('[data-layer]').forEach(button => {
  button.addEventListener('click', () => {
    const [label, copy] = layers[button.dataset.layer];
    document.querySelectorAll('[data-layer]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#layer-label').textContent = label;
    document.querySelector('#layer-copy').textContent = copy;
  });
});

document.querySelectorAll('[data-copy-email]').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copyEmail;
    const status = button.parentElement.querySelector('.copy-status');
    let copied = false;
    try { await navigator.clipboard.writeText(value); copied = true; }
    catch {
      const field = document.createElement('textarea');
      field.value = value; field.setAttribute('readonly', '');
      field.style.position = 'fixed'; field.style.left = '-9999px';
      document.body.append(field); field.select();
      try { copied = document.execCommand('copy'); } catch { /* Selection fallback below. */ }
      field.remove(); button.focus();
    }
    status.textContent = copied ? 'Email copied.' : 'Select the email address to copy it.';
  });
});
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#project-search');
if (search) {
  let category = 'All';
  const rows = [...document.querySelectorAll('.index-row')];
  const count = document.querySelector('#filter-count');
  const empty = document.querySelector('.no-results');
  const applyFilters = () => {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    rows.forEach(row => {
      const match = (category === 'All' || row.dataset.category === category) && terms.every(t => row.dataset.search.includes(t));
      row.hidden = !match;
      if (match) visible++;
    });
    count.textContent = `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}`;
    empty.hidden = visible > 0;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    applyFilters();
  }));
  search.addEventListener('input', applyFilters);
  document.querySelector('#clear-search').addEventListener('click', () => {
    category = 'All'; search.value = '';
    filters.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.filter === 'All')));
    applyFilters(); search.focus();
  });
}
