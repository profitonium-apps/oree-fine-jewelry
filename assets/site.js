/**
 * Orée concept page, v2. Catalogue data, currency, bag, wishlist, account, try-on booking,
 * ring sizer, lookbook hotspots, the scroll-driven hero and the sideways atelier chapters.
 * Everything is kept in this browser (localStorage); nothing is sent anywhere.
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------------------------------------------------------------- Storage */

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(`oree2-${key}`);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(`oree2-${key}`, JSON.stringify(value)); } catch (_) { /* private mode: state lasts for this visit */ }
    },
  };

  /* ---------------------------------------------------------------- Images */

  const LANDSCAPE = /^(v2-hero|look-|bridal|salon|mas)/;
  const PORTRAIT = /^(w-|gift|c\d-(recolte|fonte|forge|sertissage|polissage|studio))/;
  /** Path to a rendition; `big` picks the larger of the two widths the build makes. */
  function img(name, big = false) {
    const [small, large] = LANDSCAPE.test(name) ? [800, 1536] : PORTRAIT.test(name) ? [600, 1024] : [520, 1024];
    return `img/${name}-${big ? large : small}.webp`;
  }

  /* ---------------------------------------------------------------- Catalogue */

  const METALS = {
    yellow: { name: 'yellow gold', color: 'linear-gradient(135deg,#EFD592,#C49A4A)' },
    white: { name: 'white gold', color: 'linear-gradient(135deg,#F4F3EE,#C5C7C2)' },
    rose: { name: 'rose gold', color: 'linear-gradient(135deg,#F2CBB6,#C98E77)' },
  };
  const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];

  const PRODUCTS = {
    aube: {
      name: 'Aube Oval Solitaire', cat: 'ring', kind: 'Engagement ring', price: 3450, karat: 18,
      image: 'p-aube', metalImages: { white: 'p-aube-white', rose: 'p-aube-rose' }, worn: 'w-aube', extra: ['v2-hero-5-box', 'c4-griffes'],
      sub: '1.5 ct oval lab-grown diamond', badge: 'Signature', rating: 4.9, reviews: 412,
      desc: 'Our signature: a 1.5 ct oval lab-grown diamond held by four slim claws on a 1.8 mm band, low enough to slip under a glove.',
      metals: ['yellow', 'white', 'rose'], sizes: RING_SIZES, engrave: true, lead: 5, stock: 'In stock, ships in 3–5 days',
      details: ['1.5 ct oval lab-grown diamond, F colour, VS1, grading report', '18k recycled solid gold', 'Band width 1.8 mm', 'Hand-set four-claw head'],
    },
    nacre: {
      name: 'Nacre Pearl Studs', cat: 'earrings', kind: 'Earrings', price: 260,
      image: 'p-nacre', metalImages: { white: 'p-nacre-white' }, worn: 'w-nacre', extra: ['c6-coffret'],
      sub: '7 mm freshwater pearls', badge: 'Bestseller', rating: 4.9, reviews: 318,
      desc: 'Round freshwater pearls with a soft pink lustre on solid gold posts. The pair everyone owns once and reaches for daily.',
      metals: ['yellow', 'white'], sizes: null, engrave: false, lead: 3, stock: 'In stock, ships in 1–2 days',
      details: ['7–7.5 mm AAA freshwater pearls', '14k solid gold posts and backs', 'Sold as a pair'],
    },
    goutte: {
      name: 'Goutte Pear Pendant', cat: 'necklace', kind: 'Necklace', price: 890,
      image: 'p-goutte', metalImages: { white: 'p-goutte-white', rose: 'p-goutte-rose' }, worn: 'w-goutte', extra: ['look-oliveraie'],
      sub: '0.75 ct pear diamond', badge: 'Gift favourite', rating: 4.9, reviews: 204,
      desc: 'A pear-cut lab-grown diamond that falls like a drop of light at the collarbone, on a fine cable chain adjustable from 16 to 18 inches.',
      metals: ['yellow', 'white', 'rose'], sizes: null, engrave: false, lead: 5, stock: 'In stock, ships in 3–5 days',
      details: ['0.75 ct pear lab-grown diamond, grading report', '14k solid gold cable chain, 16–18" adjustable', 'Three-claw setting'],
    },
    lueur: {
      name: 'Lueur Tennis Bracelet', cat: 'bracelet', kind: 'Bracelet', price: 2950,
      image: 'p-lueur', metalImages: { yellow: 'p-lueur-yellow' }, worn: 'w-lueur', extra: [],
      sub: '3 ctw lab-grown diamonds', badge: null, rating: 4.8, reviews: 96,
      desc: 'A single unbroken line of round brilliant lab-grown diamonds, each in its own four-claw cup, finished with a hidden double-lock clasp.',
      metals: ['white', 'yellow'], sizes: ['6.5"', '7"', '7.5"'], sizeLabel: 'Length', engrave: false, lead: 10, stock: 'Made to order, 7–10 days',
      details: ['3 ctw round lab-grown diamonds, G–H, VS', '14k solid gold', 'Box clasp with safety lock'],
    },
    sceau: {
      name: 'Sceau Oval Signet', cat: 'ring', kind: 'Signet ring', price: 680,
      image: 'p-sceau', metalImages: {}, worn: 'w-sceau', extra: ['c3-mandrin'],
      sub: 'Solid gold, engraving offered', badge: null, rating: 4.8, reviews: 141,
      desc: 'A modern signet in solid gold with a smooth oval face, ready for initials, a date or a family crest, engraved by hand at no charge.',
      metals: ['yellow'], sizes: RING_SIZES, engrave: true, lead: 5, stock: 'In stock, ships in 3–5 days',
      details: ['14k recycled solid gold', 'Face 12 × 9 mm', 'Hand engraving offered'],
    },
    ronde: {
      name: 'Ronde Sculpted Hoops', cat: 'earrings', kind: 'Earrings', price: 480,
      image: 'p-ronde', metalImages: {}, worn: 'w-ronde', extra: [],
      sub: '25 mm domed gold', badge: 'Only 4 left', rating: 4.9, reviews: 187,
      desc: 'Generous domed hoops that look solid and wear light, with a click-shut hinge you can close with one hand.',
      metals: ['yellow'], sizes: null, engrave: false, lead: 5, stock: 'Only 4 left in stock',
      details: ['14k gold, hollow-core tube for comfort', '25 mm diameter, 6 mm thick', 'Hinged snap closure'],
    },
    eternite: {
      name: 'Éternité Emerald-Cut Band', cat: 'ring', kind: 'Wedding band', price: 2180,
      image: 'p-eternite', metalImages: { yellow: 'p-eternite-yellow' }, worn: 'w-eternite', extra: ['bridal-v2'],
      sub: '2.4 ctw step-cut diamonds', badge: null, rating: 5.0, reviews: 73,
      desc: 'Emerald-cut lab-grown diamonds set end to end all the way around, for the hall-of-mirrors flash only a step cut gives.',
      metals: ['white', 'yellow'], sizes: RING_SIZES, engrave: true, lead: 10, stock: 'Made to order, 7–10 days',
      details: ['2.4 ctw emerald-cut lab-grown diamonds', '14k recycled solid gold', 'Full eternity: sized to order'],
    },
    medaille: {
      name: 'Médaille Soleil Pendant', cat: 'necklace', kind: 'Necklace', price: 760,
      image: 'p-medaille', metalImages: {}, worn: 'w-medaille', extra: [],
      sub: 'Hammered gold, one diamond', badge: 'New', rating: 4.9, reviews: 58,
      desc: 'A hand-hammered gold medallion that catches light from every angle, with a single diamond at its centre like a sun.',
      metals: ['yellow'], sizes: null, engrave: true, lead: 5, stock: 'In stock, ships in 3–5 days',
      details: ['14k solid gold, 18 mm medallion', '0.05 ct lab-grown diamond', 'Engrave the reverse, offered'],
    },
  };

  const STONES = {
    miel: { id: 'aube-miel', name: 'Aube Miel', stone: 'Honey citrine, 1.2 ct', metal: 'yellow', price: 1480, image: 's-miel', bg: '#EDD3A0', tag: 'Miel · Honey citrine' },
    olive: { id: 'aube-olive', name: 'Aube Olive', stone: 'Olive peridot, 1.2 ct', metal: 'yellow', price: 1390, image: 's-olive', bg: '#CDD0AE', tag: 'Olive · Peridot' },
    terre: { id: 'aube-terre', name: 'Aube Terre', stone: 'Peach sapphire, 1.2 ct', metal: 'rose', price: 2180, image: 's-terre', bg: '#E6B79E', tag: 'Terre · Peach sapphire' },
    roseau: { id: 'aube-roseau', name: 'Aube Roseau', stone: 'Champagne diamond, 1.2 ct', metal: 'white', price: 2640, image: 's-roseau', bg: '#E9DFC9', tag: 'Roseau · Champagne diamond' },
  };
  for (const s of Object.values(STONES)) {
    PRODUCTS[s.id] = {
      name: s.name, cat: 'ring', kind: 'Provence stone solitaire', price: s.price, karat: 18,
      image: s.image, metalImages: {}, worn: 'w-aube', extra: ['c4-sertissage'],
      sub: s.stone, rating: 4.9, reviews: 64,
      desc: `The Aube silhouette with a ${s.stone.split(',')[0].toLowerCase()} in place of the diamond, set in our atelier in Provence.`,
      metals: [s.metal], sizes: RING_SIZES, engrave: true, lead: 10, stock: 'Made to order, 7–10 days',
      details: [`${s.stone}, traced origin`, `18k recycled ${METALS[s.metal].name}`, 'Four-claw head, 1.8 mm band'],
    };
  }

  const GRID_ORDER = ['aube', 'nacre', 'goutte', 'lueur', 'sceau', 'ronde', 'eternite', 'medaille'];
  const LOOK = ['nacre', 'goutte', 'eternite'];
  const UPSELL = ['nacre', 'goutte', 'ronde', 'medaille'];

  const metalLabel = (p, key) => `${p.karat || 14}k ${METALS[key].name}`;
  const packFor = (p, metal) => (p.metalImages && p.metalImages[metal]) || p.image;

  /* ---------------------------------------------------------------- Currency */

  const CURRENCIES = {
    USD: { rate: 1, locale: 'en-US', label: 'USD $', budgets: [500, 1000, 2500] },
    EUR: { rate: 0.92, locale: 'fr-FR', label: 'EUR €', budgets: [500, 1000, 2500] },
    CAD: { rate: 1.37, locale: 'en-US', label: 'CAD $', budgets: [700, 1400, 3500] },
  };
  let currency = CURRENCIES[store.get('cur', 'USD')] ? store.get('cur', 'USD') : 'USD';
  /** Store prices are set in dollars; other currencies are rounded to a clean ten. */
  const local = (usd) => (currency === 'USD' ? usd : Math.round((usd * CURRENCIES[currency].rate) / 10) * 10);
  const fmt = (amount) => new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: 'currency', currency, minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2,
  }).format(amount);
  const price = (usd) => fmt(local(usd));
  const split = (usd) => fmt(local(usd) / 4);

  function setCurrency(code) {
    if (!CURRENCIES[code]) return;
    currency = code;
    store.set('cur', code);
    $('[data-currency-label]').textContent = CURRENCIES[code].label;
    $$('[data-cur]').forEach((el) => {
      const on = el.dataset.cur === code;
      el.setAttribute(el.getAttribute('role') === 'option' ? 'aria-selected' : 'aria-checked', String(on));
    });
    renderPrices();
  }

  function renderPrices() {
    $$('[data-price-usd]').forEach((el) => { el.textContent = price(Number(el.dataset.priceUsd)); });
    renderBudgets();
    renderGrid();
    setStone(currentStone);
    renderLook();
    renderBag();
    if (pdp.open) refreshPdpPrice();
  }

  /* ---------------------------------------------------------------- Dates */

  const DAY = 86400000;
  function addBusinessDays(date, days) {
    const d = new Date(date);
    while (days > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) days -= 1;
    }
    return d;
  }
  const fmtDay = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

  /* ---------------------------------------------------------------- Toast */

  const toastEl = $('[data-toast]');
  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }
  function bump(el) {
    if (!el) return;
    el.classList.remove('is-bump');
    void el.offsetWidth;
    el.classList.add('is-bump');
  }

  /* ---------------------------------------------------------------- Dialogs */

  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  }
  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }
  for (const dialog of $$('dialog')) {
    dialog.addEventListener('close', () => {
      if (!$$('dialog').some((d) => d.open)) document.documentElement.style.overflow = '';
    });
    dialog.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) return closeDialog(dialog);
      if (e.target !== dialog) return;
      // A click on the backdrop lands on the dialog element itself, outside its box.
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(dialog);
    });
  }

  /* ---------------------------------------------------------------- Wishlist */

  let wish = store.get('wish', []).filter((id) => PRODUCTS[id]);
  const isWished = (id) => wish.includes(id);
  function toggleWish(id, source) {
    const on = !isWished(id);
    wish = on ? [...wish, id] : wish.filter((w) => w !== id);
    store.set('wish', wish);
    toast(on ? `${PRODUCTS[id].name} saved to your wishlist` : 'Removed from your wishlist');
    if (source) { source.classList.remove('is-pop'); void source.offsetWidth; source.classList.add('is-pop'); }
    if (on) bump($('[data-wish-btn]'));
    renderWish();
  }
  function renderWish() {
    const n = wish.length;
    const count = $('[data-wish-count]');
    count.textContent = n;
    count.hidden = n === 0;
    $('[data-wish-btn]').setAttribute('aria-label', `Wishlist, ${n} piece${n === 1 ? '' : 's'}`);
    $$('[data-card-wish]').forEach((b) => b.setAttribute('aria-pressed', String(isWished(b.closest('.card').dataset.id))));
    const stoneWish = $('[data-stone-wish]');
    stoneWish.setAttribute('aria-pressed', String(isWished(STONES[currentStone].id)));
    if (pdp.open) $('[data-pdp-wish]').setAttribute('aria-pressed', String(isWished(pdpState.id)));
    renderBookPieces();
    renderAccount();
  }

  /* ---------------------------------------------------------------- Saved ring size */

  let savedSize = store.get('size', null); // { us: '6.5', eu: 53, mm: 16.9 }

  /* ---------------------------------------------------------------- Bag */

  const bag = {
    items: store.get('bag', []).filter((i) => PRODUCTS[i.id] && i.qty > 0),
    gift: store.get('gift', false),
    note: store.get('note', ''),
    save() { store.set('bag', this.items); store.set('gift', this.gift); store.set('note', this.note); },
    count() { return this.items.reduce((n, i) => n + i.qty, 0); },
    subtotal() { return this.items.reduce((n, i) => n + local(PRODUCTS[i.id].price) * i.qty, 0); },
    add(id, { metal, size = null, engraving = '', qty = 1 }) {
      const same = this.items.find((i) => i.id === id && i.metal === metal && i.size === size && i.engraving === engraving);
      if (same) same.qty = Math.min(same.qty + qty, 9);
      else this.items.push({ key: `${id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, id, metal, size, engraving, qty: Math.min(qty, 9) });
      this.save();
      renderBag();
      bump($('[data-bag-btn]'));
    },
    line(key) { return this.items.find((i) => i.key === key); },
    setQty(key, qty) {
      const line = this.line(key);
      if (!line) return;
      if (qty <= 0) this.items = this.items.filter((i) => i.key !== key);
      else line.qty = Math.min(qty, 9);
      this.save();
      renderBag();
    },
  };
  const cartDialog = $('[data-cart]');

  function renderBag() {
    const count = bag.count();
    const countEl = $('[data-cart-count]');
    countEl.textContent = count;
    countEl.hidden = count === 0;
    $('[data-bag-btn]').setAttribute('aria-label', `Open bag, ${count} item${count === 1 ? '' : 's'}`);
    $('[data-cart-head-count]').textContent = count ? `(${count})` : '';

    const list = $('[data-cart-items]');
    const empty = !bag.items.length;
    list.hidden = empty;
    $('[data-cart-empty]').hidden = !empty;
    $('[data-cart-foot]').hidden = empty;

    list.innerHTML = bag.items.map((line) => {
      const p = PRODUCTS[line.id];
      const meta = [metalLabel(p, line.metal), line.size ? `${p.sizeLabel || 'Size'} ${line.size}` : '', line.engraving ? `Engraved “${esc(line.engraving)}”` : ''].filter(Boolean).join(' · ');
      const needsSize = p.sizes && !line.size;
      return `<li class="line">
        <img src="${img(packFor(p, line.metal))}" alt="" loading="lazy">
        <div>
          <div class="line__top"><p class="line__name">${p.name}</p><p>${fmt(local(p.price) * line.qty)}</p></div>
          <p class="line__meta">${meta}</p>
          <div class="line__bottom">
            <div class="qty" aria-label="Quantity for ${p.name}">
              <button type="button" data-line-qty="-1" data-key="${line.key}" aria-label="Decrease quantity">−</button>
              <output>${line.qty}</output>
              <button type="button" data-line-qty="1" data-key="${line.key}" aria-label="Increase quantity">+</button>
            </div>
            ${needsSize ? `<label><span class="sr-only">${p.sizeLabel || 'Ring size'} for ${p.name}</span><select class="line__size" data-line-size data-key="${line.key}"><option value="">Choose size</option>${p.sizes.map((s) => `<option${savedSize && savedSize.us === s ? ' selected' : ''}>${s}</option>`).join('')}</select></label>` : ''}
            <div class="line__links">
              <button type="button" class="line__remove" data-line-later data-key="${line.key}">Save for later</button>
              <button type="button" class="line__remove" data-line-remove data-key="${line.key}">Remove</button>
            </div>
          </div>
        </div>
      </li>`;
    }).join('');
    // A size picked from the saved size is applied straight away.
    $$('[data-line-size]', list).forEach((sel) => { if (sel.value) bag.line(sel.dataset.key).size = sel.value; });
    if ($$('[data-line-size]', list).some((s) => s.value)) { bag.save(); return renderBag(); }

    const subtotal = bag.subtotal();
    $('[data-cart-subtotal]').textContent = fmt(subtotal);
    $('[data-cart-split]').textContent = fmt(subtotal / 4);
    const slowest = bag.items.reduce((d, i) => Math.max(d, PRODUCTS[i.id].lead), 3);
    $('[data-cart-eta]').textContent = fmtDay(addBusinessDays(new Date(), slowest));
    $('[data-cart-gift]').checked = bag.gift;
    $('[data-cart-note-wrap]').hidden = !bag.gift;
    $('[data-cart-note]').value = bag.note;

    const upsellId = UPSELL.find((id) => !bag.items.some((i) => i.id === id));
    const upsell = $('[data-cart-upsell]');
    if (!empty && upsellId) {
      const p = PRODUCTS[upsellId];
      upsell.innerHTML = `<img src="${img(p.image)}" alt=""><p><b>${p.name}</b>Pairs beautifully · ${price(p.price)}</p><button class="btn btn--ghost btn--sm" type="button" data-upsell="${upsellId}">Add</button>`;
    } else upsell.innerHTML = '';
    $('[data-checkout-note]').textContent = '';
  }

  cartDialog.addEventListener('click', (e) => {
    const q = e.target.closest('[data-line-qty]');
    if (q) { const line = bag.line(q.dataset.key); if (line) bag.setQty(line.key, line.qty + Number(q.dataset.lineQty)); return; }
    const rm = e.target.closest('[data-line-remove]');
    if (rm) { bag.setQty(rm.dataset.key, 0); toast('Removed from your bag'); return; }
    const later = e.target.closest('[data-line-later]');
    if (later) {
      const line = bag.line(later.dataset.key);
      if (line && !isWished(line.id)) { wish = [...wish, line.id]; store.set('wish', wish); }
      bag.setQty(later.dataset.key, 0);
      renderWish();
      toast('Moved to your wishlist');
      return;
    }
    const up = e.target.closest('[data-upsell]');
    if (up) { const p = PRODUCTS[up.dataset.upsell]; bag.add(up.dataset.upsell, { metal: p.metals[0] }); toast(`${p.name} added`); return; }
    if (e.target.closest('[data-checkout]')) {
      const missing = bag.items.find((i) => PRODUCTS[i.id].sizes && !i.size);
      $('[data-checkout-note]').textContent = missing
        ? `Choose a ${(PRODUCTS[missing.id].sizeLabel || 'ring size').toLowerCase()} for the ${PRODUCTS[missing.id].name} first.`
        : 'Checkout is switched off in this concept preview. On the live store this opens a secure checkout with 0.0% APR instalments.';
    }
  });
  cartDialog.addEventListener('change', (e) => {
    const sel = e.target.closest('[data-line-size]');
    if (sel && sel.value) { bag.line(sel.dataset.key).size = sel.value; bag.save(); renderBag(); }
    if (e.target.matches('[data-cart-gift]')) { bag.gift = e.target.checked; bag.save(); $('[data-cart-note-wrap]').hidden = !bag.gift; }
  });
  $('[data-cart-note]').addEventListener('input', (e) => { bag.note = e.target.value; bag.save(); });

  /* ---------------------------------------------------------------- Product dialog */

  const pdp = $('[data-pdp]');
  const pdpState = { id: null, metal: null, size: null, qty: 1, gallery: [], index: 0 };
  const pdpMain = $('[data-pdp-img]');

  function pdpGallery() {
    const p = PRODUCTS[pdpState.id];
    return [packFor(p, pdpState.metal), p.worn, ...p.extra].filter(Boolean);
  }

  function openProduct(id, preset = {}) {
    const p = PRODUCTS[id];
    if (!p) return;
    Object.assign(pdpState, { id, metal: p.metals.includes(preset.metal) ? preset.metal : p.metals[0], size: null, qty: 1, index: 0 });
    $('[data-pdp-kind]').textContent = p.kind;
    $('[data-pdp-title]').textContent = p.name;
    $('[data-pdp-reviews]').textContent = `${p.rating.toFixed(1)} · ${p.reviews} reviews`;
    $('[data-pdp-desc]').textContent = p.desc;
    $('[data-pdp-details]').innerHTML = p.details.map((d) => `<li>${d}</li>`).join('');
    $('[data-qty-out]').textContent = '1';
    $('[data-pdp-error]').textContent = '';
    $('[data-pdp-engrave]').hidden = !p.engrave;
    $('[data-pdp-engrave-input]').value = '';
    updateEngrave();
    $('[data-pdp-wish]').setAttribute('aria-pressed', String(isWished(id)));
    refreshPdpPrice();

    const metalRow = $('[data-pdp-metal-row]');
    metalRow.setAttribute('role', 'radiogroup');
    metalRow.setAttribute('aria-label', 'Metal');
    metalRow.innerHTML = p.metals.map((m) => `<button type="button" class="metal-dot" role="radio" aria-checked="${m === pdpState.metal}" data-metal="${m}" style="--metal:${METALS[m].color}" aria-label="${metalLabel(p, m)}" title="${metalLabel(p, m)}"></button>`).join('');
    $('[data-pdp-metal-name]').textContent = metalLabel(p, pdpState.metal);

    const sizes = $('[data-pdp-sizes]');
    sizes.hidden = !p.sizes;
    if (p.sizes) {
      $('[data-pdp-size-label]').textContent = p.sizeLabel || 'Ring size';
      $('[data-open-sizer]', sizes).hidden = !!p.sizeLabel;
      const row = $('[data-pdp-size-row]');
      row.setAttribute('role', 'radiogroup');
      row.setAttribute('aria-label', p.sizeLabel || 'Ring size');
      const preset = !p.sizeLabel && savedSize && p.sizes.includes(savedSize.us) ? savedSize.us : null;
      pdpState.size = preset;
      row.innerHTML = p.sizes.map((s) => `<button type="button" class="size-btn${s === (savedSize && savedSize.us) && !p.sizeLabel ? ' is-saved' : ''}" role="radio" aria-checked="${s === preset}" data-size="${s}">${s}</button>`).join('');
      $('[data-pdp-size-hint]').textContent = p.sizeLabel ? '' : preset ? `Your saved size, ${preset}, is selected. Resizing stays free for 60 days.` : 'Unsure? Measure a ring on screen, or choose your best guess: resizing is free for 60 days.';
    }

    const now = new Date();
    const cutoff = new Date(now); cutoff.setHours(15, 0, 0, 0);
    const before = now < cutoff && now.getDay() !== 0 && now.getDay() !== 6;
    const mins = Math.round((cutoff - now) / 60000);
    $('[data-pdp-ship]').innerHTML = `${p.stock}. ${before && p.lead <= 5 ? `Order within <b>${Math.floor(mins / 60)}h ${mins % 60}m</b> and it arrives` : 'Arrives'} by <b>${fmtDay(addBusinessDays(now, p.lead))}</b>, insured, with a photo of your piece before dispatch.`;

    renderPdpGallery();
    pdp.scrollTop = 0;
    openDialog(pdp);
  }

  function refreshPdpPrice() {
    const p = PRODUCTS[pdpState.id];
    $('[data-pdp-price]').textContent = price(p.price);
    $('[data-pdp-split]').textContent = split(p.price);
  }

  function renderPdpGallery() {
    pdpState.gallery = pdpGallery();
    $('[data-pdp-thumbs]').innerHTML = pdpState.gallery.map((g, i) => `<button type="button" data-thumb="${i}" aria-label="Show image ${i + 1}" aria-current="${i === pdpState.index}"><img src="${img(g)}" alt=""></button>`).join('');
    showPdpImage(pdpState.index);
  }

  function showPdpImage(index) {
    const p = PRODUCTS[pdpState.id];
    const name = pdpState.gallery[index];
    pdpState.index = index;
    pdpMain.classList.add('is-swapping');
    const next = new Image();
    next.onload = next.onerror = () => {
      pdpMain.src = next.src;
      pdpMain.alt = index === 0 ? `${p.name} in ${metalLabel(p, pdpState.metal)}` : `${p.name}, view ${index + 1}`;
      pdpMain.classList.remove('is-swapping');
    };
    next.src = img(name, true);
    $$('[data-thumb]').forEach((t, i) => t.setAttribute('aria-current', String(i === index)));
  }

  pdp.addEventListener('click', (e) => {
    const thumb = e.target.closest('[data-thumb]');
    if (thumb) return showPdpImage(Number(thumb.dataset.thumb));
    const metal = e.target.closest('[data-metal]');
    if (metal) {
      pdpState.metal = metal.dataset.metal;
      $$('[data-metal]', pdp).forEach((b) => b.setAttribute('aria-checked', String(b === metal)));
      $('[data-pdp-metal-name]').textContent = metalLabel(PRODUCTS[pdpState.id], pdpState.metal);
      pdpState.index = 0;
      return renderPdpGallery();
    }
    const size = e.target.closest('[data-size]');
    if (size) {
      pdpState.size = size.dataset.size;
      $$('[data-size]', pdp).forEach((b) => b.setAttribute('aria-checked', String(b === size)));
      $('[data-pdp-error]').textContent = '';
      return;
    }
    const q = e.target.closest('[data-qty]');
    if (q) { pdpState.qty = clamp(pdpState.qty + Number(q.dataset.qty), 1, 9); $('[data-qty-out]').textContent = pdpState.qty; return; }
    const w = e.target.closest('[data-pdp-wish]');
    if (w) { toggleWish(pdpState.id, w); return; }
    if (e.target.closest('[data-pdp-tryon]')) {
      bookState.pieces.add(pdpState.id);
      closeDialog(pdp);
      renderBookPieces();
      $('#rendezvous').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  });

  $('[data-pdp-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const p = PRODUCTS[pdpState.id];
    if (p.sizes && !pdpState.size) {
      $('[data-pdp-error]').textContent = `Choose a ${(p.sizeLabel || 'ring size').toLowerCase()} first.`;
      $('[data-pdp-size-row] button')?.focus();
      return;
    }
    bag.add(pdpState.id, { metal: pdpState.metal, size: pdpState.size, engraving: p.engrave ? $('[data-pdp-engrave-input]').value.trim() : '', qty: pdpState.qty });
    closeDialog(pdp);
    renderBag();
    openDialog(cartDialog);
  });

  /* Engraving preview on the inside of the band. */
  const engraveInput = $('[data-pdp-engrave-input]');
  const engraveText = $('[data-engrave-text]');
  function updateEngrave() {
    const v = engraveInput.value.trim();
    engraveText.textContent = v || 'Your words, inside the band';
    engraveText.parentElement.classList.toggle('is-placeholder', !v);
  }
  engraveInput.addEventListener('input', updateEngrave);

  /* Loupe: a round lens that magnifies the photo under the pointer. */
  const loupe = $('[data-loupe]');
  const lens = $('[data-lens]');
  const ZOOM = 2.4;
  loupe.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = loupe.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    // The photo is drawn with object-fit: cover, so work out its drawn size and offset first.
    const s = Math.max(r.width / (pdpMain.naturalWidth || 1), r.height / (pdpMain.naturalHeight || 1));
    const dw = (pdpMain.naturalWidth || r.width) * s;
    const dh = (pdpMain.naturalHeight || r.height) * s;
    const ox = (r.width - dw) / 2;
    const oy = (r.height - dh) / 2;
    loupe.classList.add('is-zoom');
    lens.style.transform = `translate(${x}px, ${y}px)`;
    lens.style.backgroundImage = `url("${pdpMain.currentSrc || pdpMain.src}")`;
    lens.style.backgroundSize = `${dw * ZOOM}px ${dh * ZOOM}px`;
    lens.style.backgroundPosition = `${-((x - ox) * ZOOM - 95)}px ${-((y - oy) * ZOOM - 95)}px`;
  });
  loupe.addEventListener('pointerleave', () => loupe.classList.remove('is-zoom'));

  /* ---------------------------------------------------------------- Collection grid */

  const grid = $('[data-grid]');
  const filter = { cat: 'all', budget: 'all', sort: 'featured' };

  function renderBudgets() {
    const sel = $('[data-budget]');
    const [a, b, c] = CURRENCIES[currency].budgets;
    const f = (n) => fmt(n);
    const opts = [['all', 'All budgets'], [`0-${a}`, `Under ${f(a)}`], [`${a}-${b}`, `${f(a)} – ${f(b)}`], [`${b}-${c}`, `${f(b)} – ${f(c)}`], [`${c}-1e9`, `${f(c)} and up`]];
    const keep = opts.findIndex(([v]) => v === filter.budget);
    const index = keep >= 0 ? keep : sel.selectedIndex > 0 ? sel.selectedIndex : 0;
    sel.innerHTML = opts.map(([v, label]) => `<option value="${v}">${label}</option>`).join('');
    sel.selectedIndex = index;
    filter.budget = sel.value;
  }

  function renderGrid() {
    let ids = GRID_ORDER.filter((id) => filter.cat === 'all' || PRODUCTS[id].cat === filter.cat);
    if (filter.budget !== 'all') {
      const [min, max] = filter.budget.split('-').map(Number);
      ids = ids.filter((id) => { const v = local(PRODUCTS[id].price); return v >= min && v < max; });
    }
    if (filter.sort === 'low') ids.sort((a, b) => PRODUCTS[a].price - PRODUCTS[b].price);
    if (filter.sort === 'high') ids.sort((a, b) => PRODUCTS[b].price - PRODUCTS[a].price);
    $('[data-grid-empty]').hidden = ids.length > 0;

    grid.innerHTML = ids.map((id, i) => {
      const p = PRODUCTS[id];
      const dots = p.metals.length > 1
        ? `<div class="card__metals" role="group" aria-label="Metal">${p.metals.map((m, j) => `<button type="button" class="metal-dot" data-card-metal="${m}" aria-pressed="${j === 0}" style="--metal:${METALS[m].color}" aria-label="${metalLabel(p, m)}" title="${metalLabel(p, m)}"></button>`).join('')}</div>`
        : '';
      return `<li class="card" data-id="${id}" style="--d:${Math.min(i, 7) * 0.06}s">
        <div class="card__frame">
          <button type="button" class="card__media" data-card-open data-cursor="View" aria-label="View ${p.name}">
            <img class="card__pack" src="${img(p.image)}" srcset="${img(p.image)} 520w, ${img(p.image, true)} 1024w" sizes="(min-width: 1100px) 24vw, (min-width: 761px) 31vw, 46vw" alt="${p.name}" loading="lazy">
            <img class="card__worn" src="${img(p.worn)}" alt="" loading="lazy">
          </button>
          ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
          <button type="button" class="icon-btn card__wish" data-card-wish aria-pressed="${isWished(id)}" aria-label="Save ${p.name} to wishlist"><svg aria-hidden="true"><use href="#i-heart"/></svg></button>
          <div class="card__quick"><button type="button" class="btn btn--sm" data-card-add aria-label="${p.sizes ? 'Choose size for' : 'Add to bag:'} ${p.name}"><span>${p.sizes ? 'Choose size' : 'Quick add'}</span></button></div>
        </div>
        <div class="card__body">
          <div class="card__row"><button type="button" class="card__name" data-card-open>${p.name}</button><span class="card__price">${price(p.price)}</span></div>
          <p class="card__sub">${p.sub}</p>
          ${dots}
        </div>
      </li>`;
    }).join('');
  }

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const id = card.dataset.id;
    const p = PRODUCTS[id];
    const dot = e.target.closest('[data-card-metal]');
    if (dot) {
      $$('[data-card-metal]', card).forEach((b) => b.setAttribute('aria-pressed', String(b === dot)));
      const pack = $('.card__pack', card);
      const name = packFor(p, dot.dataset.cardMetal);
      pack.classList.add('is-swapping');
      const next = new Image();
      next.onload = next.onerror = () => { pack.srcset = `${img(name)} 520w, ${img(name, true)} 1024w`; pack.src = img(name); pack.classList.remove('is-swapping'); };
      next.src = img(name);
      return;
    }
    const metal = $('[data-card-metal][aria-pressed="true"]', card)?.dataset.cardMetal || p.metals[0];
    const w = e.target.closest('[data-card-wish]');
    if (w) return toggleWish(id, w);
    if (e.target.closest('[data-card-add]')) {
      if (p.sizes) return openProduct(id, { metal });
      bag.add(id, { metal });
      toast(`${p.name} added to your bag`);
      return;
    }
    if (e.target.closest('[data-card-open]')) openProduct(id, { metal });
  });

  $('[data-cats]').addEventListener('click', (e) => {
    const tab = e.target.closest('[data-cat]');
    if (!tab) return;
    $$('[data-cat]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    filter.cat = tab.dataset.cat;
    renderGrid();
  });
  $('[data-budget]').addEventListener('change', (e) => { filter.budget = e.target.value; renderGrid(); });
  $('[data-sort]').addEventListener('change', (e) => { filter.sort = e.target.value; renderGrid(); });
  $('[data-reset-filters]').addEventListener('click', () => {
    filter.cat = 'all'; filter.budget = 'all';
    $$('[data-cat]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.cat === 'all')));
    $('[data-budget]').value = 'all';
    renderGrid();
  });

  /* ---------------------------------------------------------------- Provence stones */

  const stonesEl = $('[data-stones]');
  let currentStone = 'miel';
  function setStone(key) {
    const s = STONES[key];
    currentStone = key;
    stonesEl.style.setProperty('--bg', s.bg);
    $$('[data-stone-img]').forEach((el) => el.classList.toggle('is-active', el.dataset.stoneImg === key));
    $$('[data-stone]').forEach((b) => { b.setAttribute('aria-checked', String(b.dataset.stone === key)); b.tabIndex = b.dataset.stone === key ? 0 : -1; });
    $('[data-stone-tag]').textContent = s.tag;
    $('[data-stone-name]').textContent = s.stone;
    $('[data-stone-metal]').textContent = `18k ${METALS[s.metal].name}`;
    $('[data-stone-price]').textContent = price(s.price);
    $('[data-stone-split]').textContent = split(s.price);
    $('[data-stone-wish]').setAttribute('aria-pressed', String(isWished(s.id)));
  }
  const swatches = $('[data-stone-swatches]');
  swatches.addEventListener('click', (e) => { const b = e.target.closest('[data-stone]'); if (b) setStone(b.dataset.stone); });
  swatches.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const keys = Object.keys(STONES);
    const next = keys[(keys.indexOf(currentStone) + step + keys.length) % keys.length];
    setStone(next);
    $(`[data-stone="${next}"]`).focus();
  });
  $('[data-stone-open]').addEventListener('click', () => openProduct(STONES[currentStone].id));
  $('[data-stone-wish]').addEventListener('click', (e) => toggleWish(STONES[currentStone].id, e.currentTarget));

  /* ---------------------------------------------------------------- Lookbook */

  const look = $('[data-look]');
  const pop = $('[data-pop]');
  function renderLook() {
    $('[data-look-items]').innerHTML = LOOK.map((id) => {
      const p = PRODUCTS[id];
      return `<li class="look__item" data-look-item="${id}"><img src="${img(p.image)}" alt=""><div><button type="button" class="look__name" data-look-open="${id}">${p.name}</button><small>${p.sub}</small></div><span>${price(p.price)}</span></li>`;
    }).join('');
    $('[data-look-total]').textContent = price(LOOK.reduce((n, id) => n + PRODUCTS[id].price, 0));
    if (!pop.hidden && pop.dataset.id) showPop(pop.dataset.id);
  }
  function showPop(id) {
    const spot = $(`[data-hotspot="${id}"]`, look);
    const p = PRODUCTS[id];
    $$('[data-hotspot]', look).forEach((h) => h.setAttribute('aria-expanded', String(h === spot)));
    $$('[data-look-item]').forEach((li) => li.classList.toggle('is-hot', li.dataset.lookItem === id));
    pop.dataset.id = id;
    pop.innerHTML = `<img src="${img(p.image)}" alt=""><div><p class="pop__name">${p.name}</p><p class="pop__price">${price(p.price)}</p></div>
      <div class="pop__cta"><button class="btn btn--ink" type="button" data-pop-add>${p.sizes ? 'Choose size' : 'Add to bag'}</button><button class="btn btn--ghost" type="button" data-pop-view>View</button></div>`;
    pop.hidden = false;
    const x = parseFloat(spot.style.getPropertyValue('--x'));
    const y = parseFloat(spot.style.getPropertyValue('--y'));
    const sw = look.clientWidth;
    const sh = look.clientHeight;
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    let left = (x / 100) * sw + (x < 55 ? 28 : -pw - 28);
    let top = (y / 100) * sh - ph / 2;
    left = clamp(left, 8, sw - pw - 8);
    top = clamp(top, 8, sh - ph - 8);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  }
  function hidePop() {
    pop.hidden = true;
    pop.dataset.id = '';
    $$('[data-hotspot]', look).forEach((h) => h.setAttribute('aria-expanded', 'false'));
    $$('[data-look-item]').forEach((li) => li.classList.remove('is-hot'));
  }
  look.addEventListener('click', (e) => {
    const spot = e.target.closest('[data-hotspot]');
    if (spot) { e.stopPropagation(); return pop.dataset.id === spot.dataset.hotspot && !pop.hidden ? hidePop() : showPop(spot.dataset.hotspot); }
    const id = pop.dataset.id;
    if (e.target.closest('[data-pop-add]')) {
      const p = PRODUCTS[id];
      if (p.sizes) { hidePop(); return openProduct(id); }
      bag.add(id, { metal: p.metals[0] });
      toast(`${p.name} added to your bag`);
      return hidePop();
    }
    if (e.target.closest('[data-pop-view]')) { hidePop(); return openProduct(id); }
    if (!e.target.closest('[data-pop]')) hidePop();
  });
  document.addEventListener('click', (e) => { if (!pop.hidden && !e.target.closest('[data-look]')) hidePop(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) hidePop(); });
  $('[data-look-items]').addEventListener('click', (e) => { const b = e.target.closest('[data-look-open]'); if (b) openProduct(b.dataset.lookOpen); });
  $('[data-look-items]').addEventListener('pointerover', (e) => {
    const li = e.target.closest('[data-look-item]');
    $$('[data-hotspot]', look).forEach((h) => h.classList.toggle('is-hot', !!li && h.dataset.hotspot === li.dataset.lookItem));
  });
  $('[data-look-add]').addEventListener('click', () => {
    for (const id of LOOK) {
      const p = PRODUCTS[id];
      const size = p.sizes && !p.sizeLabel && savedSize && p.sizes.includes(savedSize.us) ? savedSize.us : null;
      bag.add(id, { metal: p.metals[0], size });
    }
    hidePop();
    toast('The look is in your bag');
    openDialog(cartDialog);
  });

  /* ---------------------------------------------------------------- Ring sizer */

  const sizer = $('[data-sizer]');
  const calInput = $('[data-sizer-cal]');
  const mmInput = $('[data-sizer-mm]');
  let cardPx = clamp(Number(store.get('cardpx', 324)), 200, 480);
  calInput.value = cardPx;
  /** US sizes run 0.8128 mm of diameter apart from 11.63 mm at size 0; EU sizes are the circumference in mm. */
  const usFromMm = (mm) => Math.round(((mm - 11.63) / 0.8128) * 2) / 2;
  function renderSizer() {
    cardPx = Number(calInput.value);
    $('[data-sizer-card]').style.width = `${cardPx}px`;
    const pxPerMm = cardPx / 85.6;
    const mm = Number(mmInput.value);
    $('[data-sizer-ring]').style.width = `${mm * pxPerMm}px`;
    const us = clamp(usFromMm(mm), 3, 13);
    const usText = String(us);
    $('[data-sizer-dia]').textContent = `${mm.toFixed(1)} mm`;
    $('[data-sizer-us]').textContent = usText;
    $('[data-sizer-eu]').textContent = Math.round(mm * Math.PI);
    $('[data-sizer-save-us]').textContent = usText;
  }
  calInput.addEventListener('input', renderSizer);
  mmInput.addEventListener('input', renderSizer);
  $('[data-sizer-next]').addEventListener('click', () => {
    store.set('cardpx', Number(calInput.value));
    $('[data-sizer-step="1"]').hidden = true;
    $('[data-sizer-step="2"]').hidden = false;
    mmInput.focus();
  });
  $('[data-sizer-back]').addEventListener('click', () => { $('[data-sizer-step="2"]').hidden = true; $('[data-sizer-step="1"]').hidden = false; });
  $('[data-sizer-save]').addEventListener('click', () => {
    const mm = Number(mmInput.value);
    savedSize = { us: String(clamp(usFromMm(mm), 3, 13)), eu: Math.round(mm * Math.PI), mm };
    store.set('size', savedSize);
    toast(`Size ${savedSize.us} (EU ${savedSize.eu}) saved to your account`);
    closeDialog(sizer);
    renderAccount();
    renderBag();
    if (pdp.open) {
      const btn = $(`[data-size="${CSS.escape(savedSize.us)}"]`, pdp);
      if (btn) btn.click();
    }
  });
  function openSizer() {
    if (savedSize) mmInput.value = savedSize.mm;
    const calibrated = store.get('cardpx', null) != null;
    $('[data-sizer-step="1"]').hidden = calibrated;
    $('[data-sizer-step="2"]').hidden = !calibrated;
    renderSizer();
    openDialog(sizer);
  }

  /* ---------------------------------------------------------------- Booking */

  let appts = store.get('appts', []).filter((a) => a && a.date && a.time);
  const SLOTS = ['10:00', '11:30', '14:00', '15:30', '17:00'];
  const PLACES = {
    atelier: 'at the atelier in Provence',
    video: 'by video call with a jeweller',
    home: 'at home, New York or Toronto',
  };
  const bookState = { place: 'atelier', month: null, date: null, time: null, pieces: new Set(['aube']) };
  const booking = $('[data-booking]');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const firstDay = new Date(today.getTime() + DAY);
  const lastDay = new Date(today.getTime() + 75 * DAY);
  bookState.month = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);

  const isOpen = (d) => {
    if (d < firstDay || d > lastDay) return false;
    const dow = d.getDay();
    if (dow === 0) return false; // closed on Sundays everywhere
    return bookState.place === 'video' || dow !== 1; // the atelier and home visits also rest on Mondays
  };
  // A stable pseudo-random "taken" pattern so the calendar looks lived-in.
  const taken = (dateIso, slot) => [...`${dateIso}${slot}${bookState.place}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 3 === 0;

  function renderCal() {
    const m = bookState.month;
    $('[data-cal-title]').textContent = m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    $('[data-cal-prev]').disabled = m <= new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
    $('[data-cal-next]').disabled = new Date(m.getFullYear(), m.getMonth() + 1, 1) > lastDay;
    const lead = (m.getDay() + 6) % 7;
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    let html = '<span></span>'.repeat(lead);
    for (let day = 1; day <= days; day += 1) {
      const d = new Date(m.getFullYear(), m.getMonth(), day);
      const key = iso(d);
      const open = isOpen(d);
      html += `<button type="button" data-day="${key}" ${open ? '' : 'disabled'} aria-pressed="${bookState.date === key}" class="${d.getTime() === today.getTime() ? 'is-today' : ''}" aria-label="${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${open ? '' : ', unavailable'}">${day}</button>`;
    }
    $('[data-cal-grid]').innerHTML = html;
    renderSlots();
  }
  function renderSlots() {
    const box = $('[data-slots]');
    if (!bookState.date) { box.innerHTML = '<p class="micro">Choose a day to see the times.</p>'; return; }
    const slots = bookState.place === 'video' ? [...SLOTS, '18:30'] : SLOTS;
    box.innerHTML = slots.map((t) => {
      const busy = taken(bookState.date, t);
      if (busy && bookState.time === t) bookState.time = null;
      return `<button type="button" role="radio" data-time="${t}" aria-checked="${bookState.time === t}" ${busy ? 'disabled aria-label="' + t + ', taken"' : ''}>${t}</button>`;
    }).join('');
  }
  function renderBookPieces() {
    const ids = [...new Set([...bookState.pieces, ...wish, 'aube', 'eternite', 'nacre', 'goutte'])].filter((id) => PRODUCTS[id]).slice(0, 8);
    // Chips use the piece's own name: "Aube", "Nacre", or "Aube Miel" for the Provence stones.
    const short = (id) => PRODUCTS[id].name.split(' ').slice(0, id.startsWith('aube-') ? 2 : 1).join(' ');
    $('[data-book-pieces]').innerHTML = ids.map((id) => `<button type="button" data-piece="${id}" aria-pressed="${bookState.pieces.has(id)}"><img src="${img(PRODUCTS[id].image)}" alt="">${short(id)}</button>`).join('');
  }

  booking.addEventListener('click', (e) => {
    const place = e.target.closest('[data-place]');
    if (place) {
      bookState.place = place.dataset.place;
      $$('[data-place]').forEach((b) => b.setAttribute('aria-checked', String(b === place)));
      if (bookState.date && !isOpen(fromIso(bookState.date))) { bookState.date = null; bookState.time = null; }
      return renderCal();
    }
    if (e.target.closest('[data-cal-prev]')) { bookState.month = new Date(bookState.month.getFullYear(), bookState.month.getMonth() - 1, 1); return renderCal(); }
    if (e.target.closest('[data-cal-next]')) { bookState.month = new Date(bookState.month.getFullYear(), bookState.month.getMonth() + 1, 1); return renderCal(); }
    const day = e.target.closest('[data-day]');
    if (day && !day.disabled) {
      bookState.date = day.dataset.day;
      bookState.time = null;
      $$('[data-day]').forEach((b) => b.setAttribute('aria-pressed', String(b === day)));
      return renderSlots();
    }
    const time = e.target.closest('[data-time]');
    if (time && !time.disabled) { bookState.time = time.dataset.time; $$('[data-time]').forEach((b) => b.setAttribute('aria-checked', String(b === time))); return; }
    const piece = e.target.closest('[data-piece]');
    if (piece) {
      const id = piece.dataset.piece;
      if (bookState.pieces.has(id)) bookState.pieces.delete(id); else bookState.pieces.add(id);
      piece.setAttribute('aria-pressed', String(bookState.pieces.has(id)));
      return;
    }
    if (e.target.closest('[data-book-again]')) {
      $('[data-book-done]').hidden = true;
      $('[data-book-form]').hidden = false;
      bookState.date = null; bookState.time = null;
      renderCal();
    }
  });

  booking.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = $('[data-book-error]');
    const name = booking.elements.namedItem('name').value.trim();
    const email = booking.elements.namedItem('email').value.trim();
    if (!bookState.date) { error.textContent = 'Choose a day in the calendar.'; return $('[data-day]:not([disabled])')?.focus(); }
    if (!bookState.time) { error.textContent = 'Choose a time.'; return $('[data-time]:not([disabled])')?.focus(); }
    if (!name) { error.textContent = 'Tell us your name.'; return booking.elements.namedItem('name').focus(); }
    if (!emailOk(email)) { error.textContent = 'Enter a valid email address.'; return booking.elements.namedItem('email').focus(); }
    error.textContent = '';
    const appt = { id: Date.now().toString(36), place: bookState.place, date: bookState.date, time: bookState.time, pieces: [...bookState.pieces], name, email };
    appts = [...appts, appt].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    store.set('appts', appts);
    if (!account) signIn(name.split(' ')[0], email, true);
    const pieces = appt.pieces.map((id) => PRODUCTS[id].name).join(', ');
    $('[data-book-summary]').textContent = `${fmtDay(fromIso(appt.date))} at ${appt.time}, ${PLACES[appt.place]}.${pieces ? ` On the tray: ${pieces}.` : ''} A confirmation would go to ${email} (concept preview: nothing was sent).`;
    $('[data-book-form]').hidden = true;
    $('[data-book-done]').hidden = false;
    renderAccount();
    toast('Try-on held');
  });

  /* ---------------------------------------------------------------- Account */

  let account = store.get('account', null);
  const acctSheet = $('[data-account]');
  let acctTab = 'overview';

  function signIn(first, email, quiet) {
    account = { first: first || email.split('@')[0], email };
    store.set('account', account);
    if (!quiet) toast(`Welcome, ${account.first}`);
    renderAccount();
  }

  function renderAccount() {
    $('[data-account-dot]').hidden = !account;
    $('[data-acct-out]').hidden = !!account;
    $('[data-acct-in]').hidden = !account;
    $('[data-acct-signout]').hidden = !account;
    if (account) {
      $('[data-acct-name]').textContent = `Bonjour, ${account.first}.`;
      $('[data-acct-email]').textContent = account.email;
    }
    $('[data-acct-wish-n]').textContent = wish.length ? `(${wish.length})` : '';
    $('[data-acct-appt-n]').textContent = appts.length ? `(${appts.length})` : '';

    $('[data-acct-panel="overview"]').innerHTML = `
      <div class="acct__tile"><b>${savedSize ? `Ring size ${savedSize.us} · EU ${savedSize.eu}` : 'No ring size saved yet'}</b><p>${savedSize ? `Measured at ${savedSize.mm.toFixed(1)} mm; we preselect it on every ring.` : 'Measure a ring on screen and we will preselect it for you.'}</p><button class="link-btn" type="button" data-open-sizer>${savedSize ? 'Measure again' : 'Measure a ring'}</button></div>
      <div class="acct__tile"><b>${wish.length} piece${wish.length === 1 ? '' : 's'} in your wishlist</b><p>Saved pieces come to the table at your next try-on.</p><button class="link-btn" type="button" data-acct-go="wishlist">See wishlist</button></div>
      <div class="acct__tile"><b>${appts.length ? `Next try-on: ${fmtDay(fromIso(appts[0].date))}, ${appts[0].time}` : 'No try-on booked'}</b><p>${appts.length ? `${cap(PLACES[appts[0].place] || '')}.` : 'Thirty minutes with a jeweller, in Provence, by video or at home.'}</p><a class="link-btn" href="#rendezvous" data-close>${appts.length ? 'Book another' : 'Book a try-on'}</a></div>`;

    $('[data-acct-panel="wishlist"]').innerHTML = wish.length
      ? `<ul>${wish.map((id) => { const p = PRODUCTS[id]; return `<li class="line"><img src="${img(p.image)}" alt=""><div><div class="line__top"><p class="line__name">${p.name}</p><p>${price(p.price)}</p></div><p class="line__meta">${p.sub}</p><div class="line__bottom"><button class="btn btn--ink btn--sm" type="button" data-wish-buy="${id}">${p.sizes ? 'Choose size' : 'Add to bag'}</button><button class="line__remove" type="button" data-wish-remove="${id}">Remove</button></div></div></li>`; }).join('')}</ul>`
      : '<div class="empty"><p>Nothing saved yet.</p><p class="micro">Tap the heart on any piece to keep it here.</p><a class="btn btn--ghost" href="#collection" data-close>Explore the collection</a></div>';

    $('[data-acct-panel="appointments"]').innerHTML = appts.length
      ? appts.map((a) => `<div class="appt-card"><b>${fmtDay(fromIso(a.date))} · ${a.time}</b><p>${cap(PLACES[a.place] || '')}</p>${a.pieces.length ? `<p>On the tray: ${a.pieces.map((id) => PRODUCTS[id]?.name).filter(Boolean).join(', ')}</p>` : ''}<button class="link-btn" type="button" data-appt-cancel="${a.id}">Cancel</button></div>`).join('')
      : '<div class="empty"><p>No try-ons booked.</p><p class="micro">Book thirty minutes with a jeweller and the trays of your choice.</p><a class="btn btn--ghost" href="#rendezvous" data-close>Book a try-on</a></div>';
    setAcctTab(acctTab);
  }

  function setAcctTab(tab) {
    acctTab = tab;
    $$('[data-acct-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.acctTab === tab)));
    $$('[data-acct-panel]').forEach((p) => { p.hidden = p.dataset.acctPanel !== tab; });
  }

  acctSheet.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-acct-tab]');
    if (tab) return setAcctTab(tab.dataset.acctTab);
    const go = e.target.closest('[data-acct-go]');
    if (go) return setAcctTab(go.dataset.acctGo);
    const rm = e.target.closest('[data-wish-remove]');
    if (rm) return toggleWish(rm.dataset.wishRemove);
    const buy = e.target.closest('[data-wish-buy]');
    if (buy) {
      const id = buy.dataset.wishBuy;
      const p = PRODUCTS[id];
      closeDialog(acctSheet);
      if (p.sizes) return openProduct(id);
      bag.add(id, { metal: p.metals[0] });
      toast(`${p.name} added to your bag`);
      return;
    }
    const cancel = e.target.closest('[data-appt-cancel]');
    if (cancel) {
      appts = appts.filter((a) => a.id !== cancel.dataset.apptCancel);
      store.set('appts', appts);
      toast('Try-on cancelled');
      renderAccount();
      return;
    }
    if (e.target.closest('[data-acct-signout]')) {
      account = null;
      store.set('account', null);
      toast('Signed out');
      renderAccount();
    }
  });
  $('[data-acct-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem('email').value.trim();
    const first = form.elements.namedItem('first').value.trim();
    if (!emailOk(email)) { $('[data-acct-error]').textContent = 'Enter a valid email address.'; return form.elements.namedItem('email').focus(); }
    $('[data-acct-error]').textContent = '';
    form.reset();
    signIn(first, email);
  });

  function openAccount(tab) {
    renderAccount();
    setAcctTab(tab && tab !== 'true' ? tab : 'overview');
    openDialog(acctSheet);
  }

  /* ---------------------------------------------------------------- Hero */

  const hero = $('[data-hero]');
  const frames = $$('[data-frame]', hero);
  const steps = $$('[data-steps] li', hero);
  const sticky = $('.hero__sticky', hero);
  const copyBox = $('.hero__copy', hero);
  const threadPath = $('[data-thread]', hero);
  const threadBead = $('[data-thread-bead]', hero);
  const threadSvg = $('.hero__thread', hero);
  const progressBar = $('[data-hero-progress]', hero);
  const cue = $('[data-hero-cue]', hero);
  // Where the ring meets the travertine in the source photos (fractions of 1536 × 1024).
  const SUBJECT = { x: 0.651, y: 0.65 };
  let threadLength = 0;
  let lastActive = 0;

  function subjectPoint() {
    const box = sticky.getBoundingClientRect();
    const frame = frames[0];
    const iw = frame.naturalWidth || 1536;
    const ih = frame.naturalHeight || 1024;
    const scale = Math.max(box.width / iw, box.height / ih);
    const rw = iw * scale;
    const rh = ih * scale;
    const [px, py] = getComputedStyle(frame).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const ox = (box.width - rw) * (isNaN(px) ? 0.5 : px);
    const oy = (box.height - rh) * (isNaN(py) ? 0.5 : py);
    return { x: ox + rw * SUBJECT.x, y: oy + rh * SUBJECT.y, w: box.width, h: box.height, left: box.left };
  }

  /** The honey thread rises from below the frame, ties one loop beside the band and runs into the ring's base, never crossing the copy. */
  function layoutThread() {
    const { x, y, w, h, left } = subjectPoint();
    const r = { x: w * 0.04, y: h * 0.08 };
    const range = document.createRange();
    const copyRight = Math.max(...[...copyBox.children].map((el) => { range.selectNodeContents(el); return range.getBoundingClientRect().right; })) - left;
    const L = { x: Math.max(x - w * 0.14, copyRight + r.x + 20), y: y - h * 0.13 };
    const P3 = { x: L.x + r.x, y: L.y };
    const P2 = { x: L.x, y: L.y - r.y };
    const P1 = { x: L.x - r.x, y: L.y };
    const P4 = { x: L.x, y: L.y + r.y };
    const S0 = { x: Math.max(copyRight + 24, L.x - w * 0.035), y: h + 10 };
    const k = 0.56;
    threadSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    threadPath.setAttribute('d', [
      `M ${S0.x} ${S0.y}`,
      `C ${S0.x + w * 0.01} ${S0.y - h * 0.3}, ${P3.x} ${P3.y + r.y * 1.6}, ${P3.x} ${P3.y}`,
      `C ${P3.x} ${P3.y - r.y * k}, ${P2.x + r.x * k} ${P2.y}, ${P2.x} ${P2.y}`,
      `C ${P2.x - r.x * k} ${P2.y}, ${P1.x} ${P1.y - r.y * k}, ${P1.x} ${P1.y}`,
      `C ${P1.x} ${P1.y + r.y * k}, ${P4.x - r.x * k} ${P4.y}, ${P4.x} ${P4.y}`,
      `C ${P4.x + w * 0.06} ${P4.y}, ${x - w * 0.05} ${y + h * 0.01}, ${x} ${y}`,
    ].join(' '));
    threadLength = threadPath.getTotalLength();
    threadPath.style.strokeDasharray = `${threadLength}`;
  }

  // Eased toward the scroll position each frame, so scrubbing feels like a camera rather than a slideshow.
  let heroTarget = 0;
  let heroCurrent = 0;
  let heroRaf = 0;

  function updateHero() {
    const rect = hero.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    heroTarget = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 1;
    if (!heroRaf) heroRaf = requestAnimationFrame(tickHero);
  }

  function tickHero() {
    heroRaf = 0;
    heroCurrent += (heroTarget - heroCurrent) * 0.16;
    if (Math.abs(heroTarget - heroCurrent) < 0.0004) heroCurrent = heroTarget;
    paintHero(heroCurrent);
    if (heroCurrent !== heroTarget) heroRaf = requestAnimationFrame(tickHero);
  }

  /** Stop-motion dissolve: each frame holds, then the next one fades in over it (no double exposure of three frames). */
  function paintHero(progress) {
    const position = progress * (frames.length - 1);
    const base = Math.min(Math.floor(position), frames.length - 1);
    const t = position - base;
    const mix = t <= 0.3 ? 0 : t >= 1 ? 1 : ((x) => x * x * (3 - 2 * x))((t - 0.3) / 0.7);
    frames.forEach((frame, i) => {
      const o = i === base ? 1 : i === base + 1 ? mix : 0;
      frame.style.opacity = String(o);
      if (o > 0) frame.style.transform = `scale(${1.045 - clamp((position - i + 1) / 2, 0, 1) * 0.045})`;
    });
    const active = Number(frames[Math.round(position)].dataset.step);
    if (active !== lastActive) {
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === active);
        if (i === active) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
      });
      lastActive = active;
    }
    progressBar.style.transform = `scaleX(${progress})`;
    // The thread is tied while the ring is made; it lets go once the ring goes into its box.
    const tie = clamp(progress / 0.82, 0, 1);
    if (threadLength) {
      threadPath.style.strokeDashoffset = `${threadLength * (1 - tie)}`;
      threadPath.style.opacity = String(clamp((1 - progress) / 0.12, 0, 1));
      const pt = threadPath.getPointAtLength(threadLength * tie);
      threadBead.setAttribute('cx', pt.x);
      threadBead.setAttribute('cy', pt.y);
      threadBead.style.opacity = tie > 0.01 && tie < 0.99 ? '1' : '0';
    }
    cue.style.opacity = String(clamp(0.9 - progress * 10, 0, 0.9));
  }

  function initHero() {
    if (reducedMotion.matches) {
      hero.classList.add('hero--static');
      frames.forEach((f, i) => { f.style.opacity = i === frames.length - 1 ? '1' : '0'; f.loading = 'eager'; });
      steps.forEach((s, i) => s.classList.toggle('is-active', i === steps.length - 1));
      return;
    }
    // Frames a few steps ahead are fetched early so the dissolve never waits on the network.
    frames.forEach((f) => { f.loading = 'eager'; });
    new ResizeObserver(() => { layoutThread(); updateHero(); }).observe(sticky);
    if (frames[0].complete) layoutThread(); else frames[0].addEventListener('load', layoutThread, { once: true });
    document.fonts?.ready.then(() => { layoutThread(); updateHero(); });
    updateHero();
  }

  /* ---------------------------------------------------------------- Atelier: sideways chapters */

  const atelier = $('[data-atelier]');
  const atelierSticky = $('.atelier__sticky', atelier);
  const track = $('[data-atelier-track]');
  const chaps = $$('[data-chap]', atelier);
  const chapNav = $$('[data-goto]', atelier);
  const atelierBar = $('[data-atelier-progress]');
  let lastChap = -1;

  const pinned = () => getComputedStyle(atelierSticky).position === 'sticky';
  let atTarget = 0;
  let atCurrent = 0;
  let atRaf = 0;
  function updateAtelier() {
    if (!pinned()) { track.style.transform = ''; return; }
    const rect = atelier.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    atTarget = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
    if (reducedMotion.matches) { atCurrent = atTarget; return paintAtelier(atCurrent); }
    if (!atRaf) atRaf = requestAnimationFrame(tickAtelier);
  }
  function tickAtelier() {
    atRaf = 0;
    atCurrent += (atTarget - atCurrent) * 0.14;
    if (Math.abs(atTarget - atCurrent) < 0.0004) atCurrent = atTarget;
    paintAtelier(atCurrent);
    if (atCurrent !== atTarget) atRaf = requestAnimationFrame(tickAtelier);
  }
  function paintAtelier(progress) {
    // Each scroll step lands one chapter on the left edge: move by whole chapter widths plus the gap.
    const step = chaps.length > 1 ? chaps[1].offsetLeft - chaps[0].offsetLeft : 0;
    track.style.transform = `translate3d(${-progress * (chaps.length - 1) * step}px, 0, 0)`;
    atelierBar.style.transform = `scaleX(${progress})`;
    const active = Math.round(progress * (chaps.length - 1));
    if (active !== lastChap) {
      chapNav.forEach((b, i) => { if (i === active) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      lastChap = active;
    }
    // Detail photos drift against the main ones for a little depth.
    const vw = window.innerWidth;
    chaps.forEach((c) => {
      const r = c.getBoundingClientRect();
      const off = (r.left + r.width / 2 - vw / 2) / vw;
      c.style.setProperty('--par', `${off * -40}px`);
    });
  }
  atelier.addEventListener('click', (e) => {
    const b = e.target.closest('[data-goto]');
    if (!b) return;
    const i = Number(b.dataset.goto);
    const top = atelier.getBoundingClientRect().top + window.scrollY;
    const travel = atelier.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * i) / (chaps.length - 1) + 2, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------------- Scroll loop */

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (!reducedMotion.matches) updateHero();
      updateAtelier();
      $('[data-header]').classList.toggle('is-scrolled', window.scrollY > 10);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------------------------------------------------------------- Observers */

  function initObservers() {
    if (!('IntersectionObserver' in window)) { $$('[data-reveal]').forEach((el) => el.classList.add('is-in')); return; }
    const reveal = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        reveal.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('[data-reveal]').forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
      el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 4) * 0.1}s`);
      reveal.observe(el);
    });

    const buybar = $('[data-buybar]');
    const buyBtn = $('button', buybar);
    let pastHero = false;
    let atEnd = false;
    const sync = () => {
      const on = pastHero && !atEnd;
      buybar.classList.toggle('is-on', on);
      buybar.setAttribute('aria-hidden', String(!on));
      buyBtn.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }).observe($('.hero__progress'));
    new IntersectionObserver(([e]) => { atEnd = e.isIntersecting; sync(); }).observe($('.rdv'));
    new IntersectionObserver(([e]) => { if (e.isIntersecting) atEnd = true; else if (e.boundingClientRect.top > 0) atEnd = false; sync(); }).observe($('.join'));
  }

  /* ---------------------------------------------------------------- Cursor label */

  function initCursor() {
    if (!finePointer.matches || reducedMotion.matches) return;
    const cursor = $('[data-cursor]');
    const label = $('[data-cursor-label]');
    window.addEventListener('pointermove', (e) => {
      cursor.style.setProperty('--cx', `${e.clientX}px`);
      cursor.style.setProperty('--cy', `${e.clientY}px`);
      const target = e.target.closest?.('[data-cursor]');
      const blocked = e.target.closest?.('.card__wish, .card__quick, .card__badge');
      cursor.classList.toggle('is-on', !!target && !blocked);
      if (target) label.textContent = target.dataset.cursor;
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
  }

  /* ---------------------------------------------------------------- Header bits */

  function initCurrency() {
    const btn = $('[data-currency-btn]');
    const list = $('[data-currency-list]');
    const close = () => { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = list.hidden;
      list.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) $(`[data-cur="${currency}"]`, list).focus();
    });
    list.addEventListener('click', (e) => { const o = e.target.closest('[data-cur]'); if (o) { setCurrency(o.dataset.cur); close(); btn.focus(); toast(`Prices now in ${o.dataset.cur}`); } });
    list.addEventListener('keydown', (e) => {
      const opts = $$('[data-cur]', list);
      const i = opts.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.click(); }
      if (e.key === 'Escape') { close(); btn.focus(); }
    });
    document.addEventListener('click', (e) => { if (!list.hidden && !e.target.closest('[data-currency]')) close(); });
    $('[data-currency-seg]').addEventListener('click', (e) => { const b = e.target.closest('[data-cur]'); if (b) setCurrency(b.dataset.cur); });
  }

  function initAnnounce() {
    const items = $$('[data-announce] p');
    if (items.length < 2 || reducedMotion.matches) return;
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 4500);
  }

  function initMarquee() {
    const marquee = $('[data-marquee]');
    const button = $('[data-marquee-toggle]', marquee);
    button.addEventListener('click', () => {
      const paused = marquee.classList.toggle('is-paused');
      button.setAttribute('aria-pressed', String(paused));
      button.textContent = paused ? 'Play' : 'Pause';
    });
  }

  /* ---------------------------------------------------------------- Forms */

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  $('[data-join]').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('input', e.currentTarget);
    const msg = $('[data-join-msg]');
    if (!emailOk(input.value.trim())) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
    msg.textContent = 'Merci. The first letter from the atelier is on its way (concept preview: nothing was sent).';
    input.value = '';
  });

  /* ---------------------------------------------------------------- Global clicks */

  document.addEventListener('click', (e) => {
    const product = e.target.closest('[data-open-product]');
    if (product) { e.preventDefault(); closeDialog($('[data-menu]')); return openProduct(product.dataset.openProduct); }
    const acct = e.target.closest('[data-open-account]');
    if (acct) {
      e.preventDefault();
      $$('dialog[open]').forEach((d) => { if (d !== acctSheet) closeDialog(d); });
      return openAccount(acct.dataset.openAccount);
    }
    if (e.target.closest('[data-open-sizer]')) { e.preventDefault(); return openSizer(); }
    if (e.target.closest('[data-open-menu]')) { e.preventDefault(); return openDialog($('[data-menu]')); }
    if (e.target.closest('[data-open-cart]')) { e.preventDefault(); renderBag(); return openDialog(cartDialog); }
  });

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------------------------------------------------------------- Curtain + boot */

  function lift() {
    const curtain = $('[data-curtain]');
    document.documentElement.classList.add('is-ready');
    if (curtain) curtain.classList.add('is-done');
  }

  setCurrency(currency);
  renderWish();
  renderCal();
  renderBookPieces();
  renderAccount();
  initHero();
  initObservers();
  initCursor();
  initCurrency();
  initAnnounce();
  initMarquee();
  onScroll();
  if (reducedMotion.matches) lift();
  else {
    // The curtain stays long enough for the mark to finish (1.3 s) and lifts once fonts and the first frame are in, 2 s at most.
    const start = performance.now();
    Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : null, new Promise((r) => { if (frames[0].complete) r(); else frames[0].addEventListener('load', r, { once: true }); })]),
      new Promise((r) => setTimeout(r, 2000)),
    ]).then(() => setTimeout(lift, Math.max(0, 1300 - (performance.now() - start))));
  }
})();
