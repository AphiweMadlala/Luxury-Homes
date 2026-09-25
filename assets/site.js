/* Luxury Homes South Africa: progressive enhancement only. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  // ---------------------------------------------------------------- dialogs
  let lockCount = 0;
  const lock = on => {
    lockCount = Math.max(0, lockCount + (on ? 1 : -1));
    document.documentElement.classList.toggle('is-locked', lockCount > 0);
  };
  function trap(dialog, e) {
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, dialog).filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  const inert = on => $$('body > :not(.lightbox):not(.site-header), .site-header__inner').forEach(el => { el.inert = on; });

  // ---------------------------------------------------------------- menu
  const menu = $('[data-menu]');
  const openBtn = $('[data-menu-open]');
  if (menu && openBtn) {
    $$('li', menu).forEach((li, i) => li.style.setProperty('--i', i));
    const close = () => {
      if (menu.hidden) return;
      menu.hidden = true; openBtn.setAttribute('aria-expanded', 'false'); lock(false); inert(false); openBtn.focus();
    };
    openBtn.addEventListener('click', () => {
      menu.hidden = false; openBtn.setAttribute('aria-expanded', 'true'); lock(true); inert(true);
      $('[data-menu-close]', menu).focus();
    });
    $('[data-menu-close]', menu).addEventListener('click', close);
    menu.addEventListener('keydown', e => { if (e.key === 'Escape') close(); else trap(menu, e); });
    matchMedia('(min-width: 1080px)').addEventListener('change', e => { if (e.matches) close(); });
  }

  // ---------------------------------------------------------------- lightbox
  const dataEl = $('[data-lightbox-data]');
  if (dataEl) {
    const items = JSON.parse(dataEl.textContent);
    const box = document.createElement('div');
    box.className = 'lightbox'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photographs');
    box.innerHTML = `<div class="lightbox__bar"><p class="lightbox__count" aria-live="polite"></p><button type="button" class="icon-btn" data-lb-close aria-label="Close photographs">${closeIcon()}</button></div>
      <div class="lightbox__stage"><img alt=""></div>
      <div class="lightbox__nav"><button type="button" class="icon-btn" data-lb-prev aria-label="Previous photograph">${arrow('left')}</button><button type="button" class="icon-btn" data-lb-next aria-label="Next photograph">${arrow('right')}</button></div>`;
    document.body.append(box);
    const img = $('img', box), count = $('.lightbox__count', box);
    let i = 0, opener = null, touchX = null;
    const show = n => {
      i = (n + items.length) % items.length;
      const it = items[i];
      img.removeAttribute('srcset'); img.src = it.src; img.srcset = it.srcset; img.sizes = '100vw'; img.alt = it.alt;
      img.width = it.w; img.height = it.h; img.style.maxWidth = it.w + 'px';
      count.textContent = `${i + 1} of ${items.length}`;
      [items[i + 1], items[i - 1]].forEach(p => { if (p) { const pre = new Image(); pre.srcset = p.srcset; pre.sizes = '100vw'; } });
    };
    const open = (n, from) => { opener = from; show(n); box.hidden = false; lock(true); inert(true); $('[data-lb-close]', box).focus(); };
    const close = () => { box.hidden = true; lock(false); inert(false); opener?.focus(); };
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-lightbox]');
      if (b) { e.preventDefault(); open(Number(b.dataset.lightbox), b); }
    });
    $('[data-lb-close]', box).addEventListener('click', close);
    $('[data-lb-prev]', box).addEventListener('click', () => show(i - 1));
    $('[data-lb-next]', box).addEventListener('click', () => show(i + 1));
    box.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === 'ArrowRight') show(i + 1);
      else trap(box, e);
    });
    box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('lightbox__stage')) close(); });
    box.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    });
  }
  function tpl(name) { return document.getElementById('icon-' + name)?.innerHTML || ''; }
  function closeIcon() { return tpl('x'); }
  function arrow(dir) { return tpl(dir === 'left' ? 'arrow-left' : 'arrow-right'); }

  // ---------------------------------------------------------------- film facade
  $$('[data-film]').forEach(f => {
    $('.film__play', f).addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(f.dataset.id)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = f.dataset.title || 'Film';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      f.append(iframe); f.classList.add('is-playing'); iframe.focus();
    });
  });

  // ---------------------------------------------------------------- price parsing
  // Accepts R15 000 000, R15000000, 15,000,000, 15m, 15.5 million.
  const parsePrice = s => {
    if (!s) return null;
    const str = String(s).toLowerCase().replace(/\s|\u00A0| /g, '');
    const m = str.match(/^r?([\d.,]+)(m|mil|million|k)?$/);
    if (!m) return NaN;
    let n = m[2] ? parseFloat(m[1].replace(/,/g, '')) : parseFloat(m[1].replace(/[.,](?=\d{3}(\D|$))/g, '').replace(',', '.'));
    if (m[2] === 'k') n *= 1e3; else if (m[2]) n *= 1e6;
    return Number.isFinite(n) ? Math.round(n) : NaN;
  };
  const fmt = n => 'R ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // ---------------------------------------------------------------- residences filters
  const form = $('[data-filters]');
  if (form) {
    const cards = $$('[data-residence]');
    const grid = $('[data-results]');
    const empty = $('[data-empty]');
    const countEl = $('[data-count]');
    const note = $('[data-status-note]');
    const pmin = Number(form.dataset.pmin), pmax = Number(form.dataset.pmax);
    const rMin = $('[data-range-min]', form), rMax = $('[data-range-max]', form), fill = $('[data-range-fill]', form);
    const tMin = form.elements.min, tMax = form.elements.max;
    // Prices span R6m to R220m, so the sliders move on a log scale, snapped to R500 000.
    const L0 = Math.log(pmin), L1 = Math.log(pmax);
    const toPrice = pos => { const v = Math.exp(L0 + (L1 - L0) * pos / 100); return pos <= 0 ? pmin : pos >= 100 ? pmax : Math.round(v / 5e5) * 5e5; };
    const toPos = price => Math.max(0, Math.min(100, Math.round((Math.log(Math.max(pmin, Math.min(pmax, price))) - L0) / (L1 - L0) * 100)));
    const NOTES = {
      'for-sale': 'Each available residence has been checked against its agency listing. Enquiries go to the listing agent.',
      sold: 'Homes presented on Luxury Homes South Africa that have since sold.',
      unknown: 'Homes presented for sale between 2021 and 2025. We could not confirm a current listing for these, so they are shown for reference, with the price as presented at the time.',
    };
    const DEFAULTS = { status: 'for-sale', q: '', province: '', beds: '', baths: '', sort: 'recent', min: '', max: '' };

    const readForm = () => ({
      status: form.elements.status.value, q: form.elements.q.value.trim(), province: form.elements.province.value,
      beds: form.elements.beds.value, baths: form.elements.baths.value, sort: form.elements.sort.value,
      min: parsePrice(tMin.value) || '', max: parsePrice(tMax.value) || '',
    });
    const writeForm = st => {
      $$('input[name="status"]', form).forEach(r => { r.checked = r.value === st.status; });
      form.elements.q.value = st.q; form.elements.province.value = st.province; form.elements.beds.value = st.beds;
      form.elements.baths.value = st.baths; form.elements.sort.value = st.sort;
      tMin.value = st.min ? fmt(st.min) : ''; tMax.value = st.max ? fmt(st.max) : '';
      rMin.value = st.min ? toPos(st.min) : 0; rMax.value = st.max ? toPos(st.max) : 100; paintRange();
    };
    const fromURL = () => {
      const p = new URLSearchParams(location.search);
      const st = { ...DEFAULTS };
      for (const k of Object.keys(DEFAULTS)) if (p.has(k)) st[k] = p.get(k);
      if (!['for-sale', 'sold', 'unknown'].includes(st.status)) st.status = 'for-sale';
      st.min = parsePrice(st.min) || ''; st.max = parsePrice(st.max) || '';
      return st;
    };
    const toURL = (st, push) => {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(st)) if (v !== '' && v != null && v !== DEFAULTS[k]) p.set(k, v);
      const url = location.pathname + (p.toString() ? `?${p}` : '');
      if (url !== location.pathname + location.search) history[push ? 'pushState' : 'replaceState'](st, '', url);
    };
    function paintRange() {
      const a = Number(rMin.value), b = Number(rMax.value);
      fill.style.left = a + '%'; fill.style.right = (100 - b) + '%';
      rMin.setAttribute('aria-valuetext', fmt(toPrice(a))); rMax.setAttribute('aria-valuetext', fmt(toPrice(b)));
    }
    const apply = st => {
      const q = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      let lo = st.min || 0, hi = st.max || Infinity;
      if (lo > hi) [lo, hi] = [hi, lo];
      const priced = st.min || st.max;
      const shown = cards.filter(c => {
        const d = c.dataset, price = Number(d.price) || null;
        const ok = d.status === st.status
          && (!st.province || d.province === st.province)
          && (!st.beds || Number(d.beds) >= Number(st.beds))
          && (!st.baths || Number(d.baths) >= Number(st.baths))
          && (!priced || (price != null && price >= lo && price <= hi))
          && q.every(w => d.search.includes(w));
        c.hidden = !ok;
        return ok;
      });
      const key = c => st.sort === 'recent' ? c.dataset.date : Number(c.dataset.price) || (st.sort === 'price-asc' ? Infinity : -1);
      shown.sort((a, b) => st.sort === 'price-asc' ? key(a) - key(b) : st.sort === 'price-desc' ? key(b) - key(a) : (key(b) > key(a) ? 1 : -1));
      shown.forEach(c => grid.append(c));
      const label = { 'for-sale': 'available residence', sold: 'sold residence', unknown: 'archive residence' }[st.status];
      countEl.textContent = `${shown.length} ${label}${shown.length === 1 ? '' : 's'}`;
      empty.hidden = shown.length > 0;
      note.textContent = NOTES[st.status];
      [tMin, tMax].forEach(inp => inp.setAttribute('aria-invalid', Number.isNaN(parsePrice(inp.value)) ? 'true' : 'false'));
    };
    const update = push => { const st = readForm(); apply(st); toURL(st, push); };

    form.addEventListener('submit', e => { e.preventDefault(); update(true); });
    form.addEventListener('change', e => {
      if (e.target === tMin || e.target === tMax) {
        const v = parsePrice(e.target.value);
        if (v) { e.target.value = fmt(v); (e.target === tMin ? rMin : rMax).value = toPos(v); paintRange(); }
      }
      if (e.target.type !== 'range') update(true);
    });
    let qTimer;
    form.elements.q.addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => update(false), 180); });
    const onRange = which => {
      if (Number(rMin.value) > Number(rMax.value)) (which === rMin ? rMin : rMax).value = (which === rMin ? rMax : rMin).value;
      tMin.value = Number(rMin.value) > 0 ? fmt(toPrice(Number(rMin.value))) : '';
      tMax.value = Number(rMax.value) < 100 ? fmt(toPrice(Number(rMax.value))) : '';
      paintRange(); update(false);
    };
    [rMin, rMax].forEach(r => { r.addEventListener('input', () => onRange(r)); r.addEventListener('change', () => update(true)); });
    const reset = e => { e?.preventDefault(); writeForm(DEFAULTS); update(true); };
    form.addEventListener('reset', reset);
    $$('[data-reset]').forEach(b => b.type === 'button' && b.addEventListener('click', reset));
    addEventListener('popstate', () => { const st = fromURL(); writeForm(st); apply(st); });
    const initial = fromURL(); writeForm(initial); apply(initial);
    // On small screens the refine panel starts closed unless a refinement is active.
    const refine = $('[data-refine]', form);
    const active = ['q', 'province', 'beds', 'baths', 'min', 'max'].some(k => initial[k]);
    if (refine && matchMedia('(max-width: 767px)').matches && !active) refine.open = false;
  }

  // ---------------------------------------------------------------- houses filters
  const hform = $('[data-house-filters]');
  if (hform) {
    const cards = $$('[data-house]');
    const countEl = $('[data-count]', hform), empty = $('[data-empty]');
    const grid = $('[data-results]'), refine = $('[data-house-refine]', hform);
    const D = { type: '', province: '', creative: '' };
    const read = () => ({ type: hform.elements.type.value, province: hform.elements.province.value, creative: hform.elements.creative.value });
    const write = st => { $$('input[name="type"]', hform).forEach(r => { r.checked = r.value === st.type; }); hform.elements.province.value = st.province; hform.elements.creative.value = st.creative; };
    const fromURL = () => { const p = new URLSearchParams(location.search); return { type: p.get('type') || '', province: p.get('province') || '', creative: p.get('creative') || '' }; };
    const apply = st => {
      let n = 0;
      cards.forEach(c => {
        const ok = (!st.type || c.dataset.type === st.type) && (!st.province || c.dataset.province === st.province) && (!st.creative || c.dataset.creatives.split(' ').includes(st.creative));
        c.hidden = !ok; if (ok) n++;
      });
      countEl.textContent = `${n} house${n === 1 ? '' : 's'}`; empty.hidden = n > 0;
      // The plate composition is authored for the full set; any filter switches to a plain grid.
      grid?.classList.toggle('is-filtered', !!(st.type || st.province || st.creative));
      if (refine && (st.province || st.creative)) refine.open = true;
    };
    const update = () => {
      const st = read(); apply(st);
      const p = new URLSearchParams(); Object.entries(st).forEach(([k, v]) => v && p.set(k, v));
      history.pushState(st, '', location.pathname + (p.toString() ? `?${p}` : ''));
    };
    hform.addEventListener('change', update);
    hform.addEventListener('submit', e => { e.preventDefault(); update(); });
    const reset = e => { e?.preventDefault(); write(D); update(); };
    hform.addEventListener('reset', reset);
    $$('[data-reset]').forEach(b => b.type === 'button' && b.addEventListener('click', reset));
    addEventListener('popstate', () => { const st = fromURL(); write(st); apply(st); });
    const st = fromURL(); write(st); apply(st);
  }

  // ---------------------------------------------------------------- compose email
  const compose = $('[data-compose]');
  if (compose) {
    compose.addEventListener('submit', e => {
      e.preventDefault();
      const f = compose.elements;
      const name = f.property;
      const err = name.parentElement.querySelector('.field__error');
      if (!name.value.trim()) { name.setAttribute('aria-invalid', 'true'); err.hidden = false; name.focus(); return; }
      name.removeAttribute('aria-invalid'); err.hidden = true;
      const lines = [
        'Hello Luxury Homes South Africa,', '', `I am ${f.role.value.toLowerCase()} and would like to feature a home.`, '',
        `Property or project: ${f.property.value}`,
        (f.location.value || null) && `Location: ${f.location.value}`,
        (f.credits.value || null) && `Architect, designer or agent: ${f.credits.value}`,
        (f.price.value || null) && `Asking price: ${f.price.value}`,
        (f.link.value || null) && `Link: ${f.link.value}`, '', 'Photography and video attached or linked.', '',
      ].filter(l => typeof l === 'string');
      location.href = `mailto:${compose.dataset.to}?subject=${encodeURIComponent(`Feature request: ${f.property.value}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
    });
  }

  // ---------------------------------------------------------------- rail buttons
  $$('[data-rail-prev], [data-rail-next]').forEach(b => b.addEventListener('click', () => {
    const r = document.getElementById(b.getAttribute('aria-controls'));
    r?.scrollBy({ left: (b.hasAttribute('data-rail-next') ? 1 : -1) * r.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));

  // ---------------------------------------------------------------- rail keyboard
  $$('.rail').forEach(r => r.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); r.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * r.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  }));
})();
