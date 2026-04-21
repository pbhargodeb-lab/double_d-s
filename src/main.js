import './style.css';
import { menuData, categories } from './data/menu.js';

// ─── Helpers ───
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Navigation ───
function initNav() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const nav = $('#main-nav');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
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

  // Navbar scroll effect
  const navInner = $('#nav-inner');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('py-2');
      nav.classList.remove('py-6');
      navInner.classList.add('bg-brand-blue/95', 'backdrop-blur-md', 'shadow-xl', 'border-white/10');
      navInner.classList.remove('border-transparent');
    } else {
      nav.classList.add('py-6');
      nav.classList.remove('py-2');
      navInner.classList.remove('bg-brand-blue/95', 'backdrop-blur-md', 'shadow-xl', 'border-white/10');
      navInner.classList.add('border-transparent');
    }
  });
}

// ─── Scroll Reveal ───
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

// ─── Menu Rendering ───
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

  // Render categories
  function renderCategories() {
    categoriesContainer.innerHTML = categories.map(cat => `
      <button class="category-btn px-6 py-2 rounded-full font-medium transition-all ${currentCategory === cat.id ? 'bg-brand-blue text-brand-yellow shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}" data-id="${cat.id}">
        ${cat.icon} ${cat.label}
      </button>
    `).join('');

    $$('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentCategory = e.currentTarget.dataset.id;
        isExpanded = false; // Reset expand state when changing categories
        renderCategories();
        renderMenu();
      });
    });
  }

  // Render menu items
  function renderMenu() {
    const allItems = currentCategory === 'all' 
      ? menuData 
      : menuData.filter(item => item.category === currentCategory);

    const itemsToShow = isExpanded ? allItems : allItems.slice(0, INITIAL_ITEMS);

    gridContainer.innerHTML = itemsToShow.map((item, index) => {
      // Use fallback images if empty
      let imgSrc = item.img;
      if (!imgSrc) {
        if (item.category === 'bakes') imgSrc = '/assets/chocolate truffle cake.jpeg';
        else if (item.category === 'savouries') imgSrc = '/assets/chicken platter.webp';
        else if (item.category === 'beverages') imgSrc = '/assets/drink.webp';
        else imgSrc = '/assets/logo.jpg';
      }

      return `
        <div class="menu-card h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 reveal delay-${(index % 3) * 100}">
          <div class="h-56 shrink-0 overflow-hidden relative">
            <img src="${imgSrc}" alt="${item.name}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"/>
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-brand-blue shadow-sm">
              ₹${item.price}
            </div>
          </div>
          <div class="p-6 flex flex-col grow">
            <h3 class="font-display text-xl font-bold text-brand-blue leading-tight mb-2">${item.name}</h3>
            <p class="text-gray-500 text-sm line-clamp-2">${item.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    // Update view more button visibility
    if (viewMoreContainer) {
      if (allItems.length > INITIAL_ITEMS && !isExpanded) {
        viewMoreContainer.classList.remove('hidden');
      } else {
        viewMoreContainer.classList.add('hidden');
      }
    }

    // Re-init reveal for new items
    initScrollReveal();
  }

  renderCategories();
  renderMenu();
}

// ─── Modal ───
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
    // Force reflow
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    content.classList.remove('scale-95', 'opacity-0');
  }

  function closeModal() {
    modal.classList.add('opacity-0');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 500);
  }

  $$('.book-table-btn').forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = encodeURIComponent($('#b-name').value);
      const date = encodeURIComponent($('#b-date').value);
      const time = encodeURIComponent($('#b-time').value);
      const guests = encodeURIComponent($('#b-guests').value);
      const requests = encodeURIComponent($('#b-requests').value || 'None');
      
      const message = `Hi%20Double%20D's!%20I'd%20like%20to%20book%20a%20table.%0A%0A*Name:*%20${name}%0A*Date:*%20${date}%0A*Time:*%20${time}%0A*Guests:*%20${guests}%0A*Special%20Requests:*%20${requests}`;
      const waUrl = `https://wa.me/917854917070?text=${message}`;
      window.open(waUrl, '_blank');
      closeModal();
      form.reset();
    });
  }
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMenu();
  initModal();
  initScrollReveal();
});
