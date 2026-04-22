import './style.css';
import { menuData, categories } from './data/menu.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ═══════════════════════════════════════
//            NAVIGATION
// ═══════════════════════════════════════

function initNav() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const nav = $('#main-nav');
  const navInner = $('#nav-inner');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });

    $$('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('py-2');
      nav.classList.remove('py-6');
      navInner.classList.add('bg-brand-blue/95', 'backdrop-blur-md', 'shadow-xl', 'border-white/10', 'scrolled');
      navInner.classList.remove('border-transparent');
    } else {
      nav.classList.add('py-6');
      nav.classList.remove('py-2');
      navInner.classList.remove('bg-brand-blue/95', 'backdrop-blur-md', 'shadow-xl', 'border-white/10', 'scrolled');
      navInner.classList.add('border-transparent');
    }
  }, { passive: true });
}

// ═══════════════════════════════════════
//          SCROLL REVEAL
// ═══════════════════════════════════════

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════
//       PREMIUM INTRO + HERO STORY
// ═══════════════════════════════════════

function initIntro() {
  const overlay = $('#intro-overlay');
  const introName = $('#intro-name');
  const introLine = $('#intro-line');
  const introLogo = $('#intro-logo');
  const introSub = $('#intro-sub');

  // T=100ms → Logo fades in
  setTimeout(() => {
    introLogo.style.opacity = '1';
    introLogo.style.transform = 'scale(1)';
  }, 100);

  // T=500ms → Wordmark slides up
  setTimeout(() => {
    introName.classList.add('show');
  }, 500);

  // T=1000ms → Golden line expands
  setTimeout(() => {
    introLine.style.width = '120px';
  }, 1000);

  // T=1100ms → Subtitle appears
  setTimeout(() => {
    introSub.classList.add('show');
  }, 1100);

  // T=2500ms → Exit intro
  setTimeout(() => {
    overlay.classList.add('exit');
  }, 2500);

  // T=3300ms → Remove + start hero
  setTimeout(() => {
    overlay.style.display = 'none';
    playHeroStory();
  }, 3300);
}

function playHeroStory() {
  const badge = $('#story-badge');
  const wordFriends = $('#word-friends');
  const wordFood = $('#word-food');
  const wordCoffee = $('#word-coffee');
  const line = $('#story-line');
  const desc = $('#story-desc');
  const buttons = $('#story-buttons');
  const scrollIndicator = $('#scroll-indicator');

  const reveal = (el, delay) => {
    setTimeout(() => {
      el.style.translate = '0 0';
      el.style.opacity = '1';
    }, delay);
  };

  // T=0ms → Badge
  reveal(badge, 0);

  // T=300ms → "Friends."
  reveal(wordFriends, 300);

  // T=550ms → "Food."
  reveal(wordFood, 550);

  // T=850ms → "Coffee."
  reveal(wordCoffee, 850);

  // T=1200ms → Line expands
  setTimeout(() => { line.style.width = '80px'; }, 1200);

  // T=1400ms → Description
  reveal(desc, 1400);

  // T=1800ms → CTA buttons
  reveal(buttons, 1800);

  // T=2500ms → Scroll indicator
  setTimeout(() => { scrollIndicator.style.opacity = '1'; }, 2500);
}

// ═══════════════════════════════════════
//         SCROLL INTERACTIONS
// ═══════════════════════════════════════

function initScrollEffects() {
  const scrollIndicator = $('#scroll-indicator');

  window.addEventListener('scroll', () => {
    // Fade out scroll indicator
    if (scrollIndicator) {
      scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
    }
  }, { passive: true });
}

// ═══════════════════════════════════════
//         3D TILT (MENU CARDS)
// ═══════════════════════════════════════

function init3DTilt() {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ═══════════════════════════════════════
//         GALLERY TILT
// ═══════════════════════════════════════

function initGalleryTilt() {
  $$('.gallery-3d-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(600px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-6px) scale(1.02)`;

      const img = item.querySelector('img');
      if (img) img.style.transform = `scale(1.08) translate(${x * -6}px, ${y * -6}px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      const img = item.querySelector('img');
      if (img) img.style.transform = '';
    });
  });
}

// ═══════════════════════════════════════
//              MENU
// ═══════════════════════════════════════

function initMenu() {
  const categoriesContainer = $('#menu-categories');
  const gridContainer = $('#menu-grid');
  const viewMoreContainer = $('#view-more-container');
  const viewMoreBtn = $('#view-more-btn');
  if (!categoriesContainer || !gridContainer) return;

  let currentCategory = 'all';
  let isExpanded = false;
  const INITIAL_ITEMS = 6;

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      isExpanded = true;
      renderMenu();
    });
  }

  function renderCategories() {
    categoriesContainer.innerHTML = categories.map(cat => `
      <button class="category-btn category-btn-3d px-6 py-2 rounded-full font-medium transition-all text-sm ${currentCategory === cat.id ? 'bg-brand-blue text-brand-yellow shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}" data-id="${cat.id}">
        ${cat.icon} ${cat.label}
      </button>
    `).join('');

    $$('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentCategory = e.currentTarget.dataset.id;
        isExpanded = false;
        renderCategories();
        renderMenu();
      });
    });
  }

  function renderMenu() {
    let allItems = [];
    if (currentCategory === 'all') {
      const bakes = menuData.filter(i => i.category === 'bakes');
      const savouries = menuData.filter(i => i.category === 'savouries');
      const beverages = menuData.filter(i => i.category === 'beverages');
      const maxLen = Math.max(bakes.length, savouries.length, beverages.length);
      for (let i = 0; i < maxLen; i++) {
        if (bakes[i]) allItems.push(bakes[i]);
        if (savouries[i]) allItems.push(savouries[i]);
        if (beverages[i]) allItems.push(beverages[i]);
      }
    } else {
      allItems = menuData.filter(item => item.category === currentCategory);
    }

    const items = isExpanded ? allItems : allItems.slice(0, INITIAL_ITEMS);

    gridContainer.innerHTML = items.map((item, i) => {
      let img = item.img;
      if (!img) {
        if (item.category === 'bakes') img = '/assets/chocolate truffle cake.jpeg';
        else if (item.category === 'savouries') img = '/assets/chicken platter.webp';
        else if (item.category === 'beverages') img = '/assets/drink.webp';
        else img = '/assets/logo.jpg';
      }

      return `
        <div class="tilt-card menu-card h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 reveal delay-${(i % 3) * 100}" style="transform-style: preserve-3d;">
          <div class="card-image h-52 shrink-0 overflow-hidden relative">
            <img src="${img}" alt="${item.name}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
            <div class="card-price absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg font-bold text-sm text-brand-blue">
              ₹${item.price}
            </div>
          </div>
          <div class="card-content p-5 flex flex-col grow">
            <h3 class="font-display text-lg font-bold text-brand-blue leading-tight mb-1.5">${item.name}</h3>
            <p class="text-gray-400 text-sm line-clamp-2">${item.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    if (viewMoreContainer) {
      viewMoreContainer.classList.toggle('hidden', allItems.length <= INITIAL_ITEMS || isExpanded);
    }

    initScrollReveal();
    init3DTilt();
  }

  renderCategories();
  renderMenu();
}

// ═══════════════════════════════════════
//              MODAL
// ═══════════════════════════════════════

function initModal() {
  const modal = $('#booking-modal');
  const overlay = $('#booking-modal-overlay');
  const content = $('#booking-modal-content');
  const closeBtn = $('#close-modal');
  const form = $('#booking-form');
  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    content.classList.remove('scale-95', 'opacity-0');
    // Focus first input
    setTimeout(() => { const first = form?.querySelector('input'); if (first) first.focus(); }, 300);
  }

  function closeModal() {
    modal.classList.add('opacity-0');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 500);
  }

  $$('.book-table-btn').forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = encodeURIComponent($('#b-name').value);
      const date = encodeURIComponent($('#b-date').value);
      const time = encodeURIComponent($('#b-time').value);
      const guests = encodeURIComponent($('#b-guests').value);
      const requests = encodeURIComponent($('#b-requests').value || 'None');

      const msg = `Hi%20Double%20D's!%20I'd%20like%20to%20book%20a%20table.%0A%0A*Name:*%20${name}%0A*Date:*%20${date}%0A*Time:*%20${time}%0A*Guests:*%20${guests}%0A*Special%20Requests:*%20${requests}`;
      window.open(`https://wa.me/917854917070?text=${msg}`, '_blank');
      closeModal();
      form.reset();
    });
  }
}

// ═══════════════════════════════════════
//       MOBILE MENU OUTSIDE CLICK
// ═══════════════════════════════════════

function initMobileMenuOutsideClick() {
  document.addEventListener('click', (e) => {
    const mobileMenu = $('#mobile-menu');
    const hamburger = $('#hamburger');
    if (!mobileMenu || mobileMenu.classList.contains('hidden')) return;

    // If click is outside menu and hamburger
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    }
  });
}

// ═══════════════════════════════════════
//      WHATSAPP FLOAT + FOOTER YEAR
// ═══════════════════════════════════════

function initExtras() {
  // Dynamic copyright year
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Show WhatsApp float after scroll
  const waFloat = $('#whatsapp-float');
  if (waFloat) {
    window.addEventListener('scroll', () => {
      waFloat.style.opacity = window.scrollY > 300 ? '1' : '0';
    }, { passive: true });
  }
}

// ═══════════════════════════════════════
//              INIT
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenuOutsideClick();
  initMenu();
  initModal();
  initScrollReveal();
  initScrollEffects();
  initGalleryTilt();
  initExtras();

  // Start the premium intro sequence
  initIntro();
});
