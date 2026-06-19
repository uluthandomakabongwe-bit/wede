let currentCat = 'all';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* ── CART FUNCTIONS ── */
function addToCart(name, price) {
  const item = cart.find(p => p.name === name);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  showAddConfirmation(name);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

function showAddConfirmation(name) {
  alert(`✅ "${name}" added to cart!`);
}

/* ── PRODUCT DATA ── */
const productData = {
  nursery: [
    { emoji: '🛏', name: 'Crib Bedding Set', desc: 'Soft cotton sheets, duvet, and pillowcase bundle.', price: 'R 899' },
    { emoji: '🧷', name: 'Diaper Organizer', desc: 'Wall-mounted storage for diapers and essentials.', price: 'R 350' },
    { emoji: '🌙', name: 'Night Light Projector', desc: 'Soothing stars and sounds for peaceful sleep.', price: 'R 450' },
    { emoji: '🛁', name: 'Baby Bath Tub', desc: 'Ergonomic design with temperature sensor.', price: 'R 599' }
  ],
  toys: [
    { emoji: '🧸', name: 'Soft Teddy Bear', desc: 'Huggable and machine washable.', price: 'R 250' },
    { emoji: '🪀', name: 'Wooden Toys for 1-3 Years', desc: 'Perfect for developing fine motor skills.', price: 'R 400' },
    { emoji: '🎶', name: 'Musical Activity Gym', desc: 'Develops motor skills with lights, sounds and textures.', price: 'R 500' },
    { emoji: '🎨', name: 'Chalkboard/Marker Board Easel', desc: 'Perfect for encouraging creativity.', price: 'R 600' }
  ],
  cots: [
    { emoji: '🛺', name: 'Deluxe Pram Pro', desc: 'Lightweight frame with reversible seat and sun canopy. Folds flat.', price: 'R 4 999', badge: 'Bestseller' },
    { emoji: '👶', name: 'Baby walking walker', desc: 'Perfect for encouraging independent movement.', price: 'R 1 699' },
    { emoji: '🚲', name: 'Tricycle', desc: 'Perfect first bike for 2-5 year olds. Safe and durable.', price: 'R 2000' }
  ]
};

/* ── RENDER PRODUCTS ── */
function renderProducts() {
  Object.keys(productData).forEach(cat => {
    const grid = document.getElementById('grid-' + cat);
    if (!grid) return;
    
    grid.innerHTML = productData[cat].map(product => `
      <div class="product-card" data-name="${product.name.toLowerCase()}">
        <div class="product-img" onclick="openLightbox('${product.emoji}', '${product.name}', '${product.desc}', '${product.price}')">
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
          <span style="font-size:3rem;">${product.emoji}</span>
        </div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.desc}</div>
          <div class="product-footer">
            <span class="product-price">${product.price}</span>
            <button class="add-btn" onclick="addToCart('${product.name}', '${product.price}')">+</button>
          </div>
        </div>
      </div>
    `).join('');
  });
}

/* ── CATEGORY FILTER (tabs) ── */
function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  applyFilters();
}

/* ── LIVE SEARCH ── */
function handleSearch() {
  const clearBtn = document.getElementById('clearBtn');
  clearBtn.style.display = document.getElementById('searchInput').value ? 'block' : 'none';
  applyFilters();
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  applyFilters();
}

/* ── COMBINED FILTER LOGIC: category + search work together ── */
function applyFilters() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const sections = document.querySelectorAll('.cat-section');
  let anyVisible = false;

  sections.forEach(section => {
    const sectionCat = section.dataset.cat;
    const catMatches = (currentCat === 'all' || sectionCat === currentCat);
    let sectionHasVisibleCard = false;

    section.querySelectorAll('.product-card').forEach(card => {
      const name = card.dataset.name || '';
      const searchMatches = query === '' || name.includes(query);
      const show = catMatches && searchMatches;
      card.style.display = show ? '' : 'none';
      if (show) sectionHasVisibleCard = true;
    });

    section.style.display = sectionHasVisibleCard ? 'block' : 'none';
    if (sectionHasVisibleCard) anyVisible = true;
  });

  document.getElementById('noResults').style.display = anyVisible ? 'none' : 'block';
}

/* ── LIGHTBOX GALLERY ── */
function openLightbox(emoji, name, desc, price) {
  document.getElementById('lightboxImg').textContent = emoji;
  document.getElementById('lightboxName').textContent = name;
  document.getElementById('lightboxDesc').textContent = desc;
  document.getElementById('lightboxPrice').textContent = price;
  document.getElementById('lightboxOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightboxOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOnOverlay(e) {
  if (e.target.id === 'lightboxOverlay') closeLightbox();
}

/* ── FAQ ACCORDION: rendered dynamically from data using DOM manipulation ── */
const faqData = [
  { q: 'Are products suitable for newborns?', a: 'Yes, all items in our nursery and toy ranges are tested and labelled for newborn safety where applicable. Check each product description for the recommended age range.' },
  { q: 'Can I filter products by category?', a: 'Yes! Use the category buttons above (Nursery Stuff, Toys, Cots & Prams) to filter instantly, or type in the search bar to find a specific item.' },
  { q: 'Do you offer bundle discounts?', a: 'Yes, look out for bundle items like our Pram + Cot Bundle, which combine popular products at a discounted price compared to buying separately.' },
  { q: 'How do I know if an item is in stock?', a: 'Click any product image to open a quick-view, or head to the Enquiry page to ask about live stock and pricing for a specific item.' }
];

function renderFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = faqData.map((item, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-question" onclick="toggleFaq(${i})">
        <span>${item.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">${item.a}</div></div>
    </div>
  `).join('');
}

function toggleFaq(index) {
  const item = document.getElementById('faq-' + index);
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    if (openItem !== item) {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').style.maxHeight = null;
    }
  });

  if (isOpen) {
    item.classList.remove('open');
    answer.style.maxHeight = null;
  } else {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

renderFaq();
renderProducts();
updateCartCount();
