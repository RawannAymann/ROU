
const PRODUCTS = [
  { 
    id: 1, 
    name: "Backstage Glow Maximizer Face Palette", 
    category: "face", 
    price: 23.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2882553-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Dior",
    description: "Highly pigmented liquid blush for a natural flush"
  },
  { 
    id: 2, 
    name: "Make Me Blush 24H Buildable Powder Blush", 
    category: "face", 
    price: 48.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2935195-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Yves Saint Laurent",
    description: "Glow booster and complexion enhancer"
  },
  { 
    id: 3, 
    name: "Make Me Blush 12H Blurring Liquid Blush", 
    category: "lip", 
    price: 16.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2872182-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Yves Saint Laurent",
    description: "Non-sticky, high-shine lip gloss"
  },
  { 
    id: 4, 
    name: "Huda Beauty Easy Bake Loose Powder", 
    category: "face", 
    price: 38.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2934230-main-zoom.jpg?imwidth=1224",
    featured: false,
    brand: "Huda Beauty",
    description: "Ultra-fine setting powder for flawless finish"
  },
  { 
    id: 5, 
    name: "Mini Easy Blur Silicone-Free Smoothing & Pore-Minimizing Primer", 
    category: "face", 
    price: 31.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2888832-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Huda Beauty",
    description: "Full-coverage, long-wearing concealer"
  },
  { 
    id: 6, 
    name: "Lash Clash Extreme Volume Mascara", 
    category: "eyes", 
    price: 28.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2638336-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Yves Saint Laurent",
    description: "Volumizing and lengthening mascara"
  },
  { 
    id: 7, 
    name: "Couture Mini Clutch Eyeshadow Palette", 
    category: "face", 
    price: 31.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2873453-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Yves Saint Laurent",
    description: "Award-winning concealer with medium-to-full buildable coverage"
  },
  { 
    id: 8, 
    name: "YSL Candy Glaze Lip Gloss Stick", 
    category: "face", 
    price: 36.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2511335-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Yves Saint Laurent",
    description: "Long-lasting makeup setting spray that keeps makeup in place for up to 16 hours"
  },
  { 
    id: 9, 
    name: "YSL Loveshine Plumping Lip Oil Gloss", 
    category: "fragrance", 
    price: 275.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2830172-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Yves Saint Laurent",
    description: "Luxury fragrance with notes of marshmallow, orange blossom, and bergamot"
  },
  { 
    id: 10, 
    name: "Backstage Face & Body Foundation", 
    category: "body", 
    price: 48.00, 
    imageUrl: "https://www.sephora.com/productimages/sku/s2669539-main-zoom.jpg?imwidth=1224",
    featured: true,
    brand: "Dior",
    description: "Firming and toning body cream with guaraná, cupuaçu, and açaí"
  }
];

// Cart State
let cart = [];
let currentView = "home";
let searchQuery = "";

// Helper Functions
function saveCart() {
  localStorage.setItem("luxe_cart", JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem("luxe_cart");
  cart = stored ? JSON.parse(stored) : [];
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countSpan = document.getElementById('count');
  if (countSpan) countSpan.innerText = totalItems;
  const sidebarBadge = document.getElementById('sidebarCartBadge');
  if (sidebarBadge) sidebarBadge.innerText = totalItems;
}

function showToast(msg) {
  let toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Cart Operations
function addToCart(product, qty = 1) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ 
      ...product, 
      quantity: qty,
      imageUrl: product.imageUrl
    });
  }
  saveCart();
  updateCartCount();
  showToast(`✨ ${product.name} added to bag`);
  renderCurrentView();
}

function removeCartItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCurrentView();
  showToast(`Item removed`);
}

function updateQuantity(productId, newQty) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (newQty <= 0) {
      removeCartItem(productId);
    } else {
      item.quantity = newQty;
      saveCart();
      updateCartCount();
      renderCurrentView();
    }
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
}

// Render Functions
function renderProductsGrid(productList, btnText = "Add to Cart") {
  if (!productList.length) {
    return `<div style="text-align:center; padding:3rem;">✨ No matching products found. ✨</div>`;
  }
  return `<div class="products">` + productList.map(prod => {
    let imageHtml = '';
    if (prod.imageUrl) {
      imageHtml = `<img src="${prod.imageUrl}" alt="${prod.name}">`;
    } else if (prod.imageIcon) {
      imageHtml = `<span style="font-size:4rem;">${prod.imageIcon}</span>`;
    } else {
      imageHtml = `<span style="font-size:4rem;">💄</span>`;
    }
    
    return `
      <div class="product-card">
        <div class="product-img">${imageHtml}</div>
        <div class="product-info">
          <div class="product-title">${escapeHtml(prod.name)}</div>
          ${prod.brand ? `<div class="product-brand">${escapeHtml(prod.brand)}</div>` : ''}
          <div class="product-price">$${prod.price.toFixed(2)}</div>
          <button class="add-to-cart" data-id="${prod.id}" data-name="${escapeHtml(prod.name)}" data-price="${prod.price}" data-image="${prod.imageUrl || ''}" data-brand="${escapeHtml(prod.brand) || ''}">${btnText}</button>
        </div>
      </div>
    `;
  }).join('') + `</div>`;
}

function renderHome() {
  const featuredProds = PRODUCTS.filter(p => p.featured === true);
  return `
    <section class="hero">
      <div class="hero-content">
        <h1>Glow Your Beauty</h1>
        <p>Luxury vegan formulas · Professional finish</p>
        <button class="shop-now-btn">Shop Now →</button>
      </div>
    </section>
    <section class="featured">
      <h2>⭐ Featured Selections</h2>
      ${renderProductsGrid(featuredProds, "Quick Add")}
    </section>
  `;
}

function renderProductsView() {
  let filtered = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  return `
    <section class="featured" style="margin-top: 2rem;">
      <h2>🛍️ All Collections</h2>
      <div style="margin-bottom: 1rem; font-size:0.85rem; color:#a36e56;">${filtered.length} products available</div>
      ${renderProductsGrid(filtered, "Add to Cart")}
    </section>
  `;
}

function renderCartView() {
  if (cart.length === 0) {
    return `
      <div class="cart-section">
        <h2>Your Bag 🛒</h2>
        <div class="empty-cart">
          <i class="fas fa-shopping-bag" style="font-size: 3rem; opacity:0.5;"></i>
          <p>Your beauty bag is empty.</p>
          <button class="shop-now-btn" style="margin-top:1rem;">Explore Products</button>
        </div>
      </div>
    `;
  }
  let cartItemsHtml = cart.map(item => `
    <div class="cart-item">
      <div style="display:flex; align-items:center; gap:1rem;">
        ${item.imageUrl ? 
          `<img src="${item.imageUrl}" alt="${item.name}">` : 
          `<span style="font-size:2rem;">${item.imageIcon || '💄'}</span>`
        }
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          ${item.brand ? `<br><small style="color:#a77c64;">${escapeHtml(item.brand)}</small>` : ''}
          <br>$${item.price.toFixed(2)}
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1" style="background:#eee; border:none; width:30px; height:30px; border-radius:30px; cursor:pointer;">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1" style="background:#eee; border:none; width:30px; height:30px; border-radius:30px; cursor:pointer;">+</button>
        <button class="remove-item" data-id="${item.id}" style="background:none; border:none; color:#b55a3a; cursor:pointer; font-size:1.2rem;"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  `).join('');
  return `
    <div class="cart-section">
      <h2>Your Luxury Bag</h2>
      ${cartItemsHtml}
      <div class="cart-total">
        Total: $${getCartTotal()} 
        <button id="checkout-btn" style="margin-left: 1rem; background:#c25b3a;">Checkout →</button>
      </div>
    </div>
  `;
}

function renderContactView() {
  return `
    <div class="contact-section">
      <h2>📞 Get in touch</h2>
      <p style="margin-bottom:1.5rem;">Our beauty experts reply within 24h.</p>
      <form id="contactForm" class="contact-form">
        <input type="text" id="contactName" placeholder="Full name" required>
        <input type="email" id="contactEmail" placeholder="Email address" required>
        <textarea rows="4" placeholder="Your message..."></textarea>
        <button type="submit">Send Message ✨</button>
      </form>
      <div id="formFeedback" style="margin-top:1rem;"></div>
    </div>
  `;
}

function renderCurrentView() {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;
  let html = '';
  if (currentView === 'home') html = renderHome();
  else if (currentView === 'products') html = renderProductsView();
  else if (currentView === 'cart') html = renderCartView();
  else if (currentView === 'contact') html = renderContactView();
  else html = renderHome();
  appRoot.innerHTML = html;
  
  if (currentView === 'products') {
    const searchBox = document.getElementById('search');
    if (searchBox && searchBox.value !== searchQuery) searchBox.value = searchQuery;
  }
}

// Navigation
function navigateTo(view) {
  currentView = view;
  if (view === 'home') {
    searchQuery = '';
    const searchEl = document.getElementById('search');
    if (searchEl) searchEl.value = '';
  }
  renderCurrentView();
  closeSidebar();
}

// Sidebar Functions
function openSidebar() {
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Event Handling
function attachGlobalEvents() {
  document.body.addEventListener('click', (e) => {
    // Add to cart
    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn && addBtn.dataset.id) {
      const id = parseInt(addBtn.dataset.id);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        addToCart(product, 1);
      }
      e.preventDefault();
    }
    
    // Shop now button
    if (e.target.classList.contains('shop-now-btn')) {
      navigateTo('products');
    }
    
    // Navigation links
    const navLink = e.target.closest('[data-nav]');
    if (navLink && navLink.dataset.nav) {
      e.preventDefault();
      navigateTo(navLink.dataset.nav);
    }
    
    // Quantity buttons
    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn && qtyBtn.dataset.id) {
      const id = parseInt(qtyBtn.dataset.id);
      const delta = parseInt(qtyBtn.dataset.delta);
      const cartItem = cart.find(i => i.id === id);
      if (cartItem) updateQuantity(id, cartItem.quantity + delta);
    }
    
    // Remove button
    const removeBtn = e.target.closest('.remove-item');
    if (removeBtn && removeBtn.dataset.id) {
      removeCartItem(parseInt(removeBtn.dataset.id));
    }
    
    // Checkout
    const checkoutBtn = e.target.closest('#checkout-btn');
    if (checkoutBtn) {
      if (cart.length) {
        showToast("🛍️ Proceeding to secure checkout (demo)");
        setTimeout(() => alert("Thank you for shopping at LUXE BEAUTY! (Demo checkout)"), 100);
      } else {
        showToast("Your cart is empty");
      }
    }
  });
  
  // Search input
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (currentView === 'products') renderCurrentView();
    });
  }
  
  // Contact form handler
  function bindContactForm() {
    const form = document.getElementById('contactForm');
    if (form && !form._listener) {
      form._listener = true;
      form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value;
        if (name?.trim()) {
          const fb = document.getElementById('formFeedback');
          if (fb) fb.innerHTML = '<span style="color:#c25b3a;">💌 Thanks! Our team will reply shortly.</span>';
          form.reset();
          setTimeout(() => {
            const fbDiv = document.getElementById('formFeedback');
            if (fbDiv) fbDiv.innerHTML = '';
          }, 3000);
        } else {
          const fb = document.getElementById('formFeedback');
          if (fb) fb.innerHTML = '<span style="color:#b55a3a;">Please fill in your name.</span>';
        }
      };
    }
  }
  bindContactForm();
  setInterval(bindContactForm, 200);
}

// Sidebar Controls
function initSidebarControls() {
  const hamburger = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const overlay = document.getElementById('sidebarOverlay');
  if (hamburger) hamburger.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) closeSidebar();
  });
}

// Initialize App
function init() {
  loadCart();
  const appRoot = document.getElementById('app-root');
  if (!appRoot) {
    const mainContainer = document.createElement('main');
    mainContainer.id = 'app-root';
    document.body.insertBefore(mainContainer, document.querySelector('footer'));
  }
  renderCurrentView();
  attachGlobalEvents();
  initSidebarControls();
  updateCartCount();
}
// Update active link in sidebar based on current view
function updateSidebarActiveLink() {
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  sidebarLinks.forEach(link => {
    const navValue = link.getAttribute('data-nav');
    if (navValue === currentView) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


function renderCurrentView() {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;
  let html = '';
  if (currentView === 'home') html = renderHome();
  else if (currentView === 'products') html = renderProductsView();
  else if (currentView === 'cart') html = renderCartView();
  else if (currentView === 'contact') html = renderContactView();
  else html = renderHome();
  appRoot.innerHTML = html;
  
  if (currentView === 'products') {
    const searchBox = document.getElementById('search');
    if (searchBox && searchBox.value !== searchQuery) searchBox.value = searchQuery;
  }
  
  // Update active link in sidebar
  updateSidebarActiveLink();
}
// Start the app
window.addEventListener('DOMContentLoaded', init);
