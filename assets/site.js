/**
 * Orée concept page: catalogue data, the scroll-driven hero, budget filters, the
 * pastel variant picker, chapter rail, product dialog, appointment form and a bag
 * kept in this browser (localStorage). Nothing is sent anywhere.
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const img = (name, w) => `img/${name}-${w}.webp`;

  /* ---------------------------------------------------------------- Catalogue */

  const METALS = {
    yellow: { name: 'yellow gold', color: 'linear-gradient(135deg,#E9CF8E,#C49A4A)' },
    white: { name: 'white gold', color: 'linear-gradient(135deg,#F2F2EF,#C9CBC8)' },
    rose: { name: 'rose gold', color: 'linear-gradient(135deg,#F0C8B4,#C98E77)' },
  };
  const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];

  const PRODUCTS = {
    aube: {
      name: 'Aube Oval Solitaire', kind: 'Engagement ring', price: 3450, image: 'p-aube',
      gallery: ['p-aube', 'hero-4-ring', 'bridal-hands', 'ch-3-hand'],
      sub: '1.5 ct oval lab-grown diamond', badge: 'Signature', rating: 4.9, reviews: 412,
      desc: 'Our signature: a 1.5 ct oval lab-grown diamond held by four slim claws on a 1.8 mm band, low enough to slip under a glove.',
      metals: ['yellow', 'white', 'rose'], karat: 18, sizes: RING_SIZES, engrave: true, stock: 'In stock · ships in 3–5 days',
      details: ['1.5 ct oval lab-grown diamond, F colour, VS1, IGI report', '18k solid gold, recycled', 'Band width 1.8 mm', 'Hand-set four-claw head'],
    },
    nacre: {
      name: 'Nacre Pearl Studs', kind: 'Earrings', price: 260, image: 'p-pearl-studs',
      gallery: ['p-pearl-studs', 'ch-4-wear'], sub: '7 mm freshwater pearls', badge: 'Bestseller', rating: 4.9, reviews: 318,
      desc: 'Round freshwater pearls with a soft pink lustre on solid gold posts. The pair everyone owns once and reaches for daily.',
      metals: ['yellow', 'white'], sizes: null, engrave: false, stock: 'In stock · ships in 1–2 days',
      details: ['7–7.5 mm AAA freshwater pearls', '14k solid gold posts and backs', 'Sold as a pair'],
    },
    lueur: {
      name: 'Lueur Tennis Bracelet', kind: 'Bracelet', price: 2950, image: 'p-tennis',
      gallery: ['p-tennis'], sub: '3 ctw lab-grown diamonds', badge: null, rating: 4.8, reviews: 96,
      desc: 'A single unbroken line of round brilliant lab-grown diamonds, each in its own four-claw cup, finished with a hidden double-lock clasp.',
      metals: ['white', 'yellow'], sizes: ['6.5"', '7"', '7.5"'], sizeLabel: 'Length', engrave: false, stock: 'Made to order · 7–10 days',
      details: ['3 ctw round lab-grown diamonds, G–H, VS', '14k solid gold', 'Box clasp with safety lock'],
    },
    goutte: {
      name: 'Goutte Pear Pendant', kind: 'Necklace', price: 890, image: 'p-pear-pendant',
      gallery: ['p-pear-pendant', 'ch-4-wear'], sub: '0.75 ct pear diamond', badge: 'Gift favourite', rating: 4.9, reviews: 204,
      desc: 'A pear-cut lab-grown diamond that falls like a drop of light at the collarbone, on a fine cable chain adjustable from 16 to 18 inches.',
      metals: ['yellow', 'white', 'rose'], sizes: null, engrave: false, stock: 'In stock · ships in 3–5 days',
      details: ['0.75 ct pear lab-grown diamond, IGI report', '14k solid gold cable chain, 16–18" adjustable', 'Three-claw setting'],
    },
    sceau: {
      name: 'Sceau Oval Signet', kind: 'Ring', price: 680, image: 'p-signet',
      gallery: ['p-signet'], sub: 'Solid gold, engraving included', badge: null, rating: 4.8, reviews: 141,
      desc: 'A modern signet in solid gold with a smooth oval face, ready for initials, a date or a family crest, engraved by hand at no charge.',
      metals: ['yellow', 'rose'], sizes: RING_SIZES, engrave: true, stock: 'In stock · ships in 3–5 days',
      details: ['14k solid gold, recycled', 'Face 12 × 9 mm', 'Complimentary hand engraving'],
    },
    ronde: {
      name: 'Ronde Sculpted Hoops', kind: 'Earrings', price: 480, image: 'p-hoops',
      gallery: ['p-hoops'], sub: '25 mm domed gold', badge: 'Only 4 left', low: true, rating: 4.9, reviews: 187,
      desc: 'Generous domed hoops that look solid and wear light, with a click-shut hinge you can close with one hand.',
      metals: ['yellow'], sizes: null, engrave: false, stock: 'Only 4 left in stock',
      details: ['14k gold, hollow-core tube for comfort', '25 mm diameter, 6 mm thick', 'Hinged snap closure'],
    },
    eternite: {
      name: 'Éternité Emerald-Cut Band', kind: 'Wedding band', price: 2180, image: 'p-eternity',
      gallery: ['p-eternity', 'bridal-hands'], sub: '2.4 ctw step-cut diamonds', badge: null, rating: 5.0, reviews: 73,
      desc: 'Emerald-cut lab-grown diamonds set end to end all the way around, for that hall-of-mirrors flash of a step cut.',
      metals: ['white', 'yellow'], sizes: RING_SIZES, engrave: true, stock: 'Made to order · 7–10 days',
      details: ['2.4 ctw emerald-cut lab-grown diamonds', '14k solid gold, recycled', 'Full eternity: sized to order'],
    },
    medaille: {
      name: 'Médaille Soleil Pendant', kind: 'Necklace', price: 760, image: 'p-medallion',
      gallery: ['p-medallion'], sub: 'Hammered gold, one diamond', badge: 'New', rating: 4.9, reviews: 58,
      desc: 'A hand-hammered gold medallion that catches light from every angle, with a single diamond at its centre like a sun.',
      metals: ['yellow'], sizes: null, engrave: true, stock: 'In stock · ships in 3–5 days',
      details: ['14k solid gold, 18 mm medallion', '0.05 ct lab-grown diamond', 'Engrave the reverse, complimentary'],
    },
  };

  const VARIANTS = {
    blush: { id: 'aube-blush', name: 'Aube Blush', stone: 'Pink sapphire, 1.2 ct oval', metal: 'rose', price: 1890, image: 'var-blush', bg: 'var(--blush)', tag: 'Blush · Pink sapphire' },
    celadon: { id: 'aube-celadon', name: 'Aube Céladon', stone: 'Green sapphire, 1.2 ct oval', metal: 'yellow', price: 1950, image: 'var-celadon', bg: 'var(--celadon)', tag: 'Céladon · Green sapphire' },
    ciel: { id: 'aube-ciel', name: 'Aube Ciel', stone: 'Aquamarine, 1.2 ct oval', metal: 'white', price: 1640, image: 'var-aqua', bg: 'var(--ciel)', tag: 'Ciel · Aquamarine' },
    lilas: { id: 'aube-lilas', name: 'Aube Lilas', stone: 'Lavender spinel, 1.2 ct oval', metal: 'white', price: 1720, image: 'var-lilac', bg: 'var(--lilas)', tag: 'Lilas · Lavender spinel' },
  };
  for (const v of Object.values(VARIANTS)) {
    PRODUCTS[v.id] = {
      name: v.name, kind: 'Pastel solitaire', price: v.price, image: v.image, gallery: [v.image, 'hero-4-ring'],
      sub: v.stone, rating: 4.9, reviews: 64,
      desc: `The Aube silhouette with a ${v.stone.split(',')[0].toLowerCase()} in place of the diamond. Made to order in our atelier.`,
      metals: [v.metal], sizes: RING_SIZES, engrave: true, stock: 'Made to order · 7–10 days',
      details: [v.stone + ', traced origin', `14k ${METALS[v.metal].name}, recycled`, 'Four-claw head, 1.8 mm band'],
    };
  }

  const GRID_ORDER = ['aube', 'nacre', 'goutte', 'lueur', 'sceau', 'ronde', 'eternite', 'medaille'];
  const UPSELL_ORDER = ['nacre', 'goutte', 'ronde', 'medaille'];

  const metalLabel = (p, key) => `${p.karat || 14}k ${METALS[key].name}`;

  /* ---------------------------------------------------------------- Dates */

  function addBusinessDays(date, days) {
    const d = new Date(date);
    while (days > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) days -= 1;
    }
    return d;
  }
  const fmtDay = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const leadDays = (p) => (/7–10/.test(p.stock) ? 10 : /1–2/.test(p.stock) ? 3 : 5);

  /* ---------------------------------------------------------------- Toast */

  const toastEl = $('[data-toast]');
  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }

  /* ---------------------------------------------------------------- Bag */

  const STORE_KEY = 'oree-bag-v1';
  const bag = {
    items: [],
    gift: false,
    note: '',
    load() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
        if (saved && Array.isArray(saved.items)) {
          this.items = saved.items.filter((i) => PRODUCTS[i.id] && i.qty > 0);
          this.gift = !!saved.gift;
          this.note = String(saved.note || '');
        }
      } catch (_) { /* private mode or blocked storage: the bag just starts empty */ }
    },
    save() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify({ items: this.items, gift: this.gift, note: this.note })); } catch (_) {}
    },
    count() { return this.items.reduce((n, i) => n + i.qty, 0); },
    subtotal() { return this.items.reduce((n, i) => n + PRODUCTS[i.id].price * i.qty, 0); },
    add(id, { metal, size = null, engraving = '', qty = 1 }) {
      const key = [id, metal, size, engraving].join('|');
      const line = this.items.find((i) => i.key === key);
      if (line) line.qty = Math.min(line.qty + qty, 9);
      else this.items.push({ key, id, metal, size, engraving, qty: Math.min(qty, 9) });
      this.save();
      renderBag();
      const btn = $('[data-open-cart]');
      btn.classList.remove('is-bump');
      void btn.offsetWidth;
      btn.classList.add('is-bump');
    },
    setQty(key, qty) {
      const line = this.items.find((i) => i.key === key);
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
    $('[data-open-cart]').setAttribute('aria-label', `Open bag, ${count} item${count === 1 ? '' : 's'}`);
    $('[data-cart-head-count]').textContent = count ? `(${count})` : '';

    const list = $('[data-cart-items]');
    const empty = !bag.items.length;
    list.hidden = empty;
    $('[data-cart-empty]').hidden = !empty;
    $('[data-cart-foot]').hidden = empty;

    list.innerHTML = bag.items.map((line) => {
      const p = PRODUCTS[line.id];
      const meta = [METALS[line.metal] ? metalLabel(p, line.metal) : '', line.size ? `${p.sizeLabel || 'Size'} ${line.size}` : '', line.engraving ? `Engraved “${escapeHtml(line.engraving)}”` : '']
        .filter(Boolean).join(' · ');
      return `<li class="line">
        <img src="${img(p.image, 520)}" alt="" loading="lazy">
        <div>
          <div class="line__top"><p class="line__name">${p.name}</p><p>${money(p.price * line.qty)}</p></div>
          <p class="line__meta">${meta}</p>
          <div class="line__bottom">
            <div class="qty" aria-label="Quantity for ${p.name}">
              <button type="button" data-line-qty="-1" data-key="${escapeHtml(line.key)}" aria-label="Decrease quantity">−</button>
              <output>${line.qty}</output>
              <button type="button" data-line-qty="1" data-key="${escapeHtml(line.key)}" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="line__remove" data-line-remove data-key="${escapeHtml(line.key)}">Remove</button>
          </div>
        </div>
      </li>`;
    }).join('');

    const subtotal = bag.subtotal();
    $('[data-cart-subtotal]').textContent = money(subtotal);
    $('[data-cart-split]').textContent = money(subtotal / 4);
    const slowest = bag.items.reduce((d, i) => Math.max(d, leadDays(PRODUCTS[i.id])), 5);
    $('[data-cart-eta]').textContent = fmtDay(addBusinessDays(new Date(), slowest));

    const gift = $('[data-cart-gift]');
    gift.checked = bag.gift;
    $('[data-cart-note-wrap]').hidden = !bag.gift;
    $('[data-cart-note]').value = bag.note;

    const upsellId = UPSELL_ORDER.find((id) => !bag.items.some((i) => i.id === id));
    const upsell = $('[data-cart-upsell]');
    if (!empty && upsellId) {
      const p = PRODUCTS[upsellId];
      upsell.innerHTML = `<img src="${img(p.image, 520)}" alt="">
        <p><b>${p.name}</b>Pairs beautifully · ${money(p.price)}</p>
        <button class="btn btn--ghost btn--sm" type="button" data-upsell="${upsellId}">Add</button>`;
    } else {
      upsell.innerHTML = '';
    }
    $('[data-checkout-note]').textContent = '';
  }

  cartDialog.addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('[data-line-qty]');
    if (qtyBtn) {
      const line = bag.items.find((i) => i.key === qtyBtn.dataset.key);
      if (line) bag.setQty(line.key, line.qty + Number(qtyBtn.dataset.lineQty));
      return;
    }
    const remove = e.target.closest('[data-line-remove]');
    if (remove) {
      bag.setQty(remove.dataset.key, 0);
      toast('Removed from your bag');
      return;
    }
    const up = e.target.closest('[data-upsell]');
    if (up) {
      const p = PRODUCTS[up.dataset.upsell];
      bag.add(up.dataset.upsell, { metal: p.metals[0] });
      toast(`${p.name} added`);
      return;
    }
    if (e.target.closest('[data-checkout]')) {
      $('[data-checkout-note]').textContent = 'Checkout is switched off in this concept preview. On the live store this opens a secure checkout.';
    }
  });
  $('[data-cart-gift]').addEventListener('change', (e) => {
    bag.gift = e.target.checked;
    bag.save();
    $('[data-cart-note-wrap]').hidden = !bag.gift;
  });
  $('[data-cart-note]').addEventListener('input', (e) => {
    bag.note = e.target.value;
    bag.save();
  });

  /* ---------------------------------------------------------------- Dialog helpers */

  function openDialog(dialog) {
    if (dialog.open) return;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  }
  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }
  for (const dialog of $$('dialog')) {
    dialog.addEventListener('close', () => {
      if (!$$('dialog').some((d) => d.open)) document.documentElement.style.overflow = '';
    });
    // A click on the backdrop lands on the dialog element itself.
    dialog.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) return closeDialog(dialog);
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeDialog(dialog);
    });
  }

  /* ---------------------------------------------------------------- Product dialog */

  const pdp = $('[data-pdp]');
  const pdpState = { id: null, metal: null, size: null, qty: 1, image: 0 };

  function openProduct(id, preset = {}) {
    const p = PRODUCTS[id];
    if (!p) return;
    Object.assign(pdpState, { id, metal: preset.metal && p.metals.includes(preset.metal) ? preset.metal : p.metals[0], size: null, qty: 1, image: 0 });

    $('[data-pdp-kind]', pdp).textContent = p.kind;
    $('[data-pdp-title]', pdp).textContent = p.name;
    $('[data-pdp-reviews]', pdp).textContent = `${p.rating.toFixed(1)} · ${p.reviews} reviews`;
    $('[data-pdp-price]', pdp).textContent = money(p.price);
    $('[data-pdp-split]', pdp).textContent = money(p.price / 4);
    $('[data-pdp-desc]', pdp).textContent = p.desc;
    $('[data-pdp-details]', pdp).innerHTML = p.details.map((d) => `<li>${d}</li>`).join('');
    $('[data-qty-out]', pdp).textContent = '1';
    $('[data-pdp-error]', pdp).textContent = '';
    $('[data-pdp-engrave]', pdp).hidden = !p.engrave;
    $('[data-pdp-engrave-input]', pdp).value = '';

    $('[data-pdp-thumbs]', pdp).innerHTML = p.gallery.length > 1
      ? p.gallery.map((g, i) => `<button type="button" data-thumb="${i}" aria-label="Show image ${i + 1}" aria-current="${i === 0}"><img src="${img(g, g.startsWith('hero') || g.startsWith('bridal') ? 800 : g.startsWith('ch-') ? 600 : 520)}" alt=""></button>`).join('')
      : '';
    showPdpImage(0);

    const metalRow = $('[data-pdp-metal-row]', pdp);
    metalRow.setAttribute('role', 'radiogroup');
    metalRow.setAttribute('aria-label', 'Metal');
    metalRow.innerHTML = p.metals.map((m) => `<button type="button" class="metal-dot" role="radio" aria-checked="${m === pdpState.metal}" data-metal="${m}" style="--metal:${METALS[m].color}" aria-label="${metalLabel(p, m)}" title="${metalLabel(p, m)}"></button>`).join('');
    $('[data-pdp-metal-name]', pdp).textContent = metalLabel(p, pdpState.metal);

    const sizes = $('[data-pdp-sizes]', pdp);
    sizes.hidden = !p.sizes;
    if (p.sizes) {
      $('[data-pdp-size-label]', pdp).textContent = p.sizeLabel || 'Ring size';
      $('[data-open-size]', sizes).hidden = !!p.sizeLabel;
      const row = $('[data-pdp-size-row]', pdp);
      row.setAttribute('role', 'radiogroup');
      row.setAttribute('aria-label', p.sizeLabel || 'Ring size');
      row.innerHTML = p.sizes.map((s) => `<button type="button" class="size-btn" role="radio" aria-checked="false" data-size="${s}">${s}</button>`).join('');
      $('[data-pdp-size-hint]', pdp).textContent = p.sizeLabel ? '' : 'Unsure? Choose your best guess: resizing is free for 60 days.';
    }

    const lead = leadDays(p);
    const now = new Date();
    const cutoff = new Date(now); cutoff.setHours(15, 0, 0, 0);
    const before = now < cutoff && now.getDay() !== 0 && now.getDay() !== 6;
    const mins = Math.round((cutoff - now) / 60000);
    $('[data-pdp-ship]', pdp).innerHTML = `${p.stock}. ${before && lead <= 5 ? `Order within <b>${Math.floor(mins / 60)}h ${mins % 60}m</b> and it arrives` : 'Arrives'} by <b>${fmtDay(addBusinessDays(now, lead))}</b>, insured.`;

    pdp.scrollTop = 0;
    openDialog(pdp);
  }

  function showPdpImage(index) {
    const p = PRODUCTS[pdpState.id];
    const name = p.gallery[index];
    pdpState.image = index;
    const main = $('[data-pdp-img]', pdp);
    main.src = img(name, name.startsWith('hero') || name.startsWith('bridal') ? 1536 : 1024);
    main.alt = index === 0 ? p.name : `${p.name}, view ${index + 1}`;
    $$('[data-thumb]', pdp).forEach((t, i) => t.setAttribute('aria-current', String(i === index)));
  }

  pdp.addEventListener('click', (e) => {
    const thumb = e.target.closest('[data-thumb]');
    if (thumb) return showPdpImage(Number(thumb.dataset.thumb));
    const metal = e.target.closest('[data-metal]');
    if (metal) {
      pdpState.metal = metal.dataset.metal;
      $$('[data-metal]', pdp).forEach((b) => b.setAttribute('aria-checked', String(b === metal)));
      $('[data-pdp-metal-name]', pdp).textContent = metalLabel(PRODUCTS[pdpState.id], pdpState.metal);
      return;
    }
    const size = e.target.closest('[data-size]');
    if (size) {
      pdpState.size = size.dataset.size;
      $$('[data-size]', pdp).forEach((b) => b.setAttribute('aria-checked', String(b === size)));
      $('[data-pdp-error]', pdp).textContent = '';
      return;
    }
    const q = e.target.closest('[data-qty]');
    if (q) {
      pdpState.qty = clamp(pdpState.qty + Number(q.dataset.qty), 1, 9);
      $('[data-qty-out]', pdp).textContent = pdpState.qty;
    }
  });

  $('[data-pdp-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const p = PRODUCTS[pdpState.id];
    if (p.sizes && !pdpState.size) {
      $('[data-pdp-error]', pdp).textContent = `Choose a ${(p.sizeLabel || 'ring size').toLowerCase()} first.`;
      $('[data-pdp-size-row] button', pdp)?.focus();
      return;
    }
    bag.add(pdpState.id, {
      metal: pdpState.metal,
      size: pdpState.size,
      engraving: p.engrave ? $('[data-pdp-engrave-input]', pdp).value.trim() : '',
      qty: pdpState.qty,
    });
    closeDialog(pdp);
    openDialog(cartDialog);
  });

  /* ---------------------------------------------------------------- Grid + filters */

  const grid = $('[data-grid]');
  function renderGrid() {
    grid.innerHTML = GRID_ORDER.map((id) => {
      const p = PRODUCTS[id];
      const dots = p.metals.length > 1
        ? `<div class="card__metals" role="group" aria-label="Metal">${p.metals.map((m, i) => `<button type="button" class="metal-dot" data-card-metal="${m}" aria-pressed="${i === 0}" style="--metal:${METALS[m].color}" aria-label="${metalLabel(p, m)}" title="${metalLabel(p, m)}"></button>`).join('')}</div>`
        : '';
      return `<li class="card" data-id="${id}" data-price="${p.price}">
        <div class="card__frame">
          <button type="button" class="card__media" data-card-open aria-label="View ${p.name}">
            ${p.badge ? `<span class="card__badge${p.low ? ' card__badge--low' : ''}">${p.badge}</span>` : ''}
            <img src="${img(p.image, 520)}" srcset="${img(p.image, 520)} 520w, ${img(p.image, 1024)} 1024w" sizes="(min-width: 1100px) 24vw, (min-width: 761px) 31vw, 46vw" alt="${p.name}" loading="lazy">
          </button>
          <div class="card__quick"><button type="button" class="btn btn--sm" data-card-add aria-label="${p.sizes ? 'Choose size for' : 'Add to bag:'} ${p.name}"><span>${p.sizes ? 'Choose size' : 'Add to bag'}</span></button></div>
        </div>
        <div class="card__body">
          <div class="card__row"><button type="button" class="card__name" data-card-open>${p.name}</button><span class="card__price">${money(p.price)}</span></div>
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
      return;
    }
    const metal = $('[data-card-metal][aria-pressed="true"]', card)?.dataset.cardMetal || p.metals[0];
    if (e.target.closest('[data-card-add]')) {
      if (p.sizes) return openProduct(id, { metal });
      bag.add(id, { metal });
      toast(`${p.name} added to your bag`);
      return;
    }
    if (e.target.closest('[data-card-open]')) openProduct(id, { metal });
  });

  const filterBar = $('[data-filters]');
  filterBar.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    $$('[data-filter]', filterBar).forEach((c) => {
      const on = c === chip;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    const [min, max] = chip.dataset.filter === 'all' ? [0, Infinity] : chip.dataset.filter.split('-').map(Number);
    $$('.card', grid).forEach((card) => {
      const price = Number(card.dataset.price);
      card.hidden = !(price >= min && price < max);
      if (!card.hidden) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }
    });
  });

  /* ---------------------------------------------------------------- Pastel variants */

  const colour = $('[data-colour]');
  let currentVariant = 'blush';
  function setVariant(key) {
    const v = VARIANTS[key];
    currentVariant = key;
    colour.style.setProperty('--bg', v.bg);
    $$('[data-variant-img]', colour).forEach((el) => el.classList.toggle('is-active', el.dataset.variantImg === key));
    $$('[data-variant]', colour).forEach((b) => {
      b.setAttribute('aria-checked', String(b.dataset.variant === key));
      b.tabIndex = b.dataset.variant === key ? 0 : -1;
    });
    $('[data-variant-tag]', colour).textContent = v.tag;
    $('[data-variant-stone]', colour).textContent = v.stone;
    $('[data-variant-metal]', colour).textContent = `14k ${METALS[v.metal].name}`;
    $('[data-variant-price]', colour).textContent = money(v.price);
    $('[data-variant-split]', colour).textContent = money(v.price / 4);
  }
  const swatchGroup = $('[data-variant-swatches]');
  swatchGroup.addEventListener('click', (e) => {
    const b = e.target.closest('[data-variant]');
    if (b) setVariant(b.dataset.variant);
  });
  swatchGroup.addEventListener('keydown', (e) => {
    const keys = Object.keys(VARIANTS);
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = keys[(keys.indexOf(currentVariant) + step + keys.length) % keys.length];
    setVariant(next);
    $(`[data-variant="${next}"]`, swatchGroup).focus();
  });
  $('[data-variant-add]').addEventListener('click', () => openProduct(VARIANTS[currentVariant].id));
  $('[data-variant-details]').addEventListener('click', () => openProduct(VARIANTS[currentVariant].id));

  /* ---------------------------------------------------------------- Hero */

  const hero = $('[data-hero]');
  const frames = $$('[data-frame]', hero);
  const steps = $$('[data-steps] li', hero);
  const sticky = $('.hero__sticky', hero);
  const threadPath = $('[data-thread]', hero);
  const threadBead = $('[data-thread-bead]', hero);
  const threadSvg = $('.hero__thread', hero);
  const progressBar = $('[data-hero-progress]', hero);
  const cue = $('[data-hero-cue]', hero);
  // Where the ring meets the stone in the source photos (fractions of 1536 × 1024).
  const SUBJECT = { x: 0.655, y: 0.69 };
  const copyBox = $('.hero__copy', hero);
  let threadLength = 0;
  let lastActive = 0;

  /** Maps a point in the photo to the sticky box, honouring object-fit: cover and object-position. */
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

  /**
   * The red thread: rises from below the frame, ties one cursive loop beside the ring's
   * band and runs into its base. It never crosses the copy column.
   */
  function layoutThread() {
    const { x, y, w, h, left } = subjectPoint();
    const r = { x: w * 0.04, y: h * 0.08 };
    // Right edge of the copy's actual text, not its box, so the loop can sit close to it.
    const range = document.createRange();
    const copyRight = Math.max(...[...copyBox.children].map((el) => {
      range.selectNodeContents(el);
      return range.getBoundingClientRect().right;
    })) - left;
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

  function updateHero() {
    const rect = hero.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    const progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 1;
    const position = progress * (frames.length - 1);
    const active = Math.round(position);

    frames.forEach((frame, i) => {
      const distance = Math.abs(position - i);
      frame.style.opacity = String(clamp(1 - distance * 1.2, 0, 1));
      frame.style.transform = `scale(${1 + Math.min(distance, 1) * 0.04})`;
    });
    if (active !== lastActive) {
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === active);
        if (i === active) s.setAttribute('aria-current', 'step');
        else s.removeAttribute('aria-current');
      });
      lastActive = active;
    }
    progressBar.style.transform = `scaleX(${progress})`;
    if (threadLength) {
      threadPath.style.strokeDashoffset = `${threadLength * (1 - progress)}`;
      const pt = threadPath.getPointAtLength(threadLength * progress);
      threadBead.setAttribute('cx', pt.x);
      threadBead.setAttribute('cy', pt.y);
      threadBead.style.opacity = progress > 0.01 && progress < 0.99 ? '1' : '0';
    }
    cue.style.opacity = String(clamp(0.9 - progress * 8, 0, 0.9));
  }

  function initHero() {
    if (reducedMotion.matches) {
      hero.classList.add('hero--static');
      frames.forEach((f, i) => { f.style.opacity = i === frames.length - 1 ? '1' : '0'; f.loading = 'eager'; });
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === steps.length - 1);
        if (i === steps.length - 1) s.setAttribute('aria-current', 'step');
        else s.removeAttribute('aria-current');
      });
      return;
    }
    // Load every frame up front so the scrub never shows an empty frame.
    frames.forEach((f) => { f.loading = 'eager'; });
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; updateHero(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    new ResizeObserver(() => { layoutThread(); updateHero(); }).observe(sticky);
    frames[0].complete ? layoutThread() : frames[0].addEventListener('load', layoutThread, { once: true });
    updateHero();
  }

  /* ---------------------------------------------------------------- Reveal, rail, header, buy bar */

  function initObservers() {
    const header = $('[data-header]');
    const buybar = $('[data-buybar]');
    const buyBtn = $('button', buybar);

    if (!('IntersectionObserver' in window)) {
      $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      return;
    }

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

    const railLinks = new Map($$('[data-rail]').map((a) => [a.getAttribute('href').slice(1), a]));
    const rail = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const [id, link] of railLinks) {
          const on = id === entry.target.id;
          link.classList.toggle('is-current', on);
          if (on) {
            link.setAttribute('aria-current', 'true');
            // Keep the active chapter visible in the horizontal rail on phones.
            const ol = link.closest('ol');
            if (ol.scrollWidth > ol.clientWidth) ol.scrollTo({ left: link.offsetLeft - 16, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
          } else link.removeAttribute('aria-current');
        }
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-chapter]').forEach((c) => rail.observe(c));

    // The mobile buy bar shows once the hero is gone and hides again at the footer.
    let pastHero = false;
    let atFooter = false;
    const syncBuybar = () => {
      const on = pastHero && !atFooter;
      buybar.classList.toggle('is-on', on);
      buybar.setAttribute('aria-hidden', String(!on));
      buyBtn.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      syncBuybar();
    }, { threshold: 0 }).observe($('.hero__progress'));
    new IntersectionObserver(([entry]) => { atFooter = entry.isIntersecting; syncBuybar(); }, { threshold: 0 }).observe($('.join'));

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------- Announcements + marquee */

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

  function initForms() {
    const join = $('[data-join]');
    join.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('input', join);
      const msg = $('[data-join-msg]', join);
      if (!emailOk(input.value.trim())) {
        msg.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }
      msg.textContent = 'Welcome to the Maison. Your care kit is reserved for your first order.';
      input.value = '';
    });

    const appt = $('[data-appointment]');
    const form = $('[data-appt-form]', appt);
    const day = $('[data-appt-day]', form);
    const tomorrow = addBusinessDays(new Date(), 1);
    day.min = tomorrow.toISOString().slice(0, 10);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const error = $('[data-appt-error]', form);
      const name = String(data.get('name') || '').trim();
      if (!name) { error.textContent = 'Please tell us your name.'; return form.elements.namedItem('name').focus(); }
      if (!emailOk(String(data.get('email') || '').trim())) { error.textContent = 'Please enter a valid email address.'; return form.elements.namedItem('email').focus(); }
      if (!data.get('day') || data.get('day') < day.min) { error.textContent = 'Please choose a day from tomorrow onwards.'; return day.focus(); }
      error.textContent = '';
      const when = new Date(`${data.get('day')}T12:00:00`);
      $('[data-appt-summary]', appt).textContent = `${name.split(' ')[0]}, a jeweller will email you to confirm a ${String(data.get('mode')).toLowerCase()} about “${data.get('topic')}” on ${fmtDay(when)}. (Concept preview: nothing was sent.)`;
      form.hidden = true;
      $('[data-appt-done]', appt).hidden = false;
    });
    appt.addEventListener('close', () => {
      form.reset();
      form.hidden = false;
      $('[data-appt-done]', appt).hidden = true;
      $('[data-appt-error]', form).textContent = '';
    });

    $('[data-sizer]').addEventListener('click', () => toast('A free ring sizer would now be on its way (concept preview).'));
  }

  /* ---------------------------------------------------------------- Global clicks */

  document.addEventListener('click', (e) => {
    const product = e.target.closest('[data-open-product]');
    if (product) { e.preventDefault(); return openProduct(product.dataset.openProduct); }
    const appointment = e.target.closest('[data-open-appointment]');
    if (appointment) {
      e.preventDefault();
      const dialog = $('[data-appointment]');
      if (appointment.dataset.topic) $('[data-appt-topic]', dialog).value = appointment.dataset.topic;
      openDialog(dialog);
      return;
    }
    if (e.target.closest('[data-open-size]')) { e.preventDefault(); return openDialog($('[data-size-guide]')); }
    if (e.target.closest('[data-open-cart]')) { e.preventDefault(); renderBag(); return openDialog(cartDialog); }
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------------------------------------------------------------- Boot */

  bag.load();
  renderGrid();
  renderBag();
  setVariant('blush');
  initHero();
  initObservers();
  initAnnounce();
  initMarquee();
  initForms();
})();
