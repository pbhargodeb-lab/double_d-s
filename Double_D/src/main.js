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
  if (!categoriesContainer || !gridContainer) return;

  let currentCategory = 'all';

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
        renderCategories();
        renderMenu();
      });
    });
  }

  // Render menu items
  function renderMenu() {
    const items = currentCategory === 'all' 
      ? menuData 
      : menuData.filter(item => item.category === currentCategory);

    gridContainer.innerHTML = items.map((item, index) => {
      // Use fallback images if empty
      let imgSrc = item.img;
      if (!imgSrc) {
        if (item.category === 'bakes') imgSrc = '/assets/chocolate truffle cake.jpeg';
        else if (item.category === 'savouries') imgSrc = '/assets/chicken platter.webp';
        else if (item.category === 'beverages') imgSrc = '/assets/drink.webp';
        else imgSrc = '/assets/logo.jpg';
      }

      return `
        <div class="menu-card bg-white rounded-2xl overflow-hidden border border-gray-100 reveal delay-${(index % 3) * 100}">
          <div class="h-48 overflow-hidden">
            <img src="${imgSrc}" alt="${item.name}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"/>
          </div>
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-display text-xl font-bold text-brand-blue">${item.name}</h3>
              <span class="font-bold text-brand-yellow bg-brand-blue px-3 py-1 rounded-lg text-sm">₹${item.price}</span>
            </div>
            <p class="text-gray-500 text-sm mb-4">${item.desc}</p>
          </div>
        </div>
      `;
    }).join('');

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
