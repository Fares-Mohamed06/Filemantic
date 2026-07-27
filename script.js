// Sample Products Data
const products = [
    {
        id: 1,
        name: "Custom Mechanical Keyboard",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
    },
    {
        id: 2,
        name: "Pro Wireless Headphones",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 3,
        name: "Precision Gaming Mouse",
        price: 59.00,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
    }
];

// App State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    updateAuthUI();
    renderProducts();

    // Login / Register Form Handlers
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            currentUser = { email: email, name: email.split('@')[0] };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'index.html';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            currentUser = { email: email, name: name };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'index.html';
        });
    }
});

// Render Products Dynamically
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart 🛒</button>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = cart.length;
    }
}

// Auth UI Toggle Header
function updateAuthUI() {
    const authSlot = document.getElementById('auth-nav-slot');
    if (!authSlot) return;

    if (currentUser) {
        authSlot.innerHTML = `
            <span class="user-badge">Hello, ${currentUser.name}</span>
            <button class="btn-login" onclick="logout()">Logout</button>
        `;
    } else {
        authSlot.innerHTML = `
            <a href="login.html" class="btn-login">Login</a>
            <a href="login.html" class="btn-register">Register</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateAuthUI();
}

// Login/Register Tab Switcher
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    if (tab === 'login') {
        loginForm.classList.remove('hidden-form');
        regForm.classList.add('hidden-form');
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
    } else {
        regForm.classList.remove('hidden-form');
        loginForm.classList.add('hidden-form');
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
    }
}
