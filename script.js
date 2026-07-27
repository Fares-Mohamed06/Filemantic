// 1. Products Data
const products = [
    {
        id: "1",
        name: "Mechanical Keyboard",
        price: 89.00,
        img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80",
        desc: "Tactile switches with customizable RGB lighting and premium build quality."
    },
    {
        id: "2",
        name: "Wireless Mouse",
        price: 49.00,
        img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
        desc: "High precision tracking with comfortable grip and ultra-fast response time."
    },
    {
        id: "3",
        name: "Wireless Earbuds",
        price: 79.00,
        img: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=500&q=80",
        desc: "Crystal clear audio with active noise cancellation and 24h battery life."
    }
];

// 2. Load Data from LocalStorage
let cart = JSON.parse(localStorage.getItem('store_cart')) || [];
let userSession = JSON.parse(localStorage.getItem('user_session')) || { isLoggedIn: false };

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartWidget = document.getElementById('cart-widget');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartCountSpan = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalPriceSpan = document.getElementById('cart-total-price');
const authNavSlot = document.getElementById('auth-nav-slot');

// 3. Render Auth Navbar State
function renderAuthNav() {
    if (!authNavSlot) return;
    if (userSession.isLoggedIn) {
        authNavSlot.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <span style="color:#00FFF0; font-size:14px; font-weight:bold;">👤 ${userSession.name || 'User'}</span>
                <button onclick="logoutUser()" style="background:none; border:1px solid #3d3e3e; color:#a0aec0; padding:5px 10px; border-radius:6px; cursor:pointer;">Logout</button>
            </div>
        `;
    } else {
        authNavSlot.innerHTML = `
            <a href="login.html" style="color:#00FFF0; border:1px solid #00FFF0; padding:6px 14px; border-radius:20px; text-decoration:none; font-size:14px; font-weight:bold; transition:0.3s;">Login / Register</a>
        `;
    }
}

function logoutUser() {
    localStorage.removeItem('user_session');
    userSession = { isLoggedIn: false };
    renderAuthNav();
    showToast("Logged out successfully");
}

// 4. Render Products Grid
function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = ''; 
    products.forEach((product, index) => {
        const cardHTML = `
            <div class="product-card" data-id="${product.id}">
                <img class="product-image" src="${product.img}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.desc}</p>
                    <div class="product-bottom">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-index="${index}">Add 🛒</button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.innerHTML += cardHTML;
    });

    bindProductEvents();
}

// 5. Event Binding
function bindProductEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            window.location.href = `product-details.html?id=${id}`;
        });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const index = button.getAttribute('data-index');
            const product = products[index];

            // Redirect if not logged in
            if (!userSession.isLoggedIn) {
                localStorage.setItem('pending_cart_product', JSON.stringify(product));
                window.location.href = 'login.html';
                return;
            }
            
            // Add to cart if logged in
            addItemToCart(product.id, product.name, product.price);
            
            // UI Feedback
            const originalText = button.innerHTML;
            button.innerHTML = 'Added ✓';
            button.style.backgroundColor = '#00FFF0';
            button.style.color = '#2C2D2D';
            button.disabled = true;

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = 'transparent';
                button.style.color = '#00FFF0';
                button.disabled = false;
            }, 1000);
        });
    });
}

// 6. Update Cart UI
function updateCartUI() {
    localStorage.setItem('store_cart', JSON.stringify(cart));
    
    if (cartCountSpan) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.innerText = totalItems;
    }

    if (cartItemsList) {
        cartItemsList.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p style="color: #718096; text-align:center; padding: 20px;">Your cart is empty.</p>';
        } else {
            cart.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                cartItemsList.innerHTML += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="quantity-control">
                                <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                                <div class="item-qty-display">Quantity: <span>${item.quantity}</span></div>
                                <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                            </div>
                        </div>
                        <span class="product-price">$${itemTotal.toFixed(2)}</span>
                    </div>
                `;
            });
        }
        if (cartTotalPriceSpan) cartTotalPriceSpan.innerText = `$${totalPrice.toFixed(2)}`;
    }
}

// 7. Add Item to Cart
function addItemToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCartUI();
    showToast(`Added ${name} to cart! 🛒`);
    
    if (cartWidget) {
        cartWidget.style.borderColor = '#00FFF0';
        setTimeout(() => cartWidget.style.borderColor = '#3d3e3e', 300);
    }
}

// 8. Quantity Controls
window.changeQuantity = function(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

// 9. Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// 10. Modal Events & Initialization
if (cartWidget) cartWidget.addEventListener('click', () => { cartModal.style.display = 'flex'; });
if (closeModal) closeModal.addEventListener('click', () => { cartModal.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.style.display = 'none'; });

// Initial Run
renderAuthNav();
renderProducts();
updateCartUI();