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

// Read from LocalStorage directly
let cart = [];
let currentUser = null;

try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
} catch (e) {
    console.error("LocalStorage error:", e);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    updateAuthUI();
    renderProducts();

    // Direct mode check from URL
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'register') {
        switchTab('register');
    } else {
        switchTab('login');
    }

    // Login Form Handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            
            if (!email) return;

            const userObj = { email: email, name: email.split('@')[0] };
            
            // Save to LocalStorage FIRST
            localStorage.setItem('currentUser', JSON.stringify(userObj));
            
            // Redirect after saving
            window.location.href = 'index.html';
        });
    }

    // Register Form Handler
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;

            if (!email || !name) return;

            const userObj = { email: email, name: name };

            // Save to LocalStorage FIRST
            localStorage.setItem('currentUser', JSON.stringify(userObj));

            // Redirect after saving
            window.location.href = 'index.html';
        });
    }
});

// Render Products Dynamic Grid
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

// Cart Logic with Login Check
function addToCart(productId) {
    const activeUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!activeUser) {
        alert('Please login first to add items to your cart!');
        window.location.href = 'login.html';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        alert('Item added to cart!');
    }
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = cart.length;
    }
}

// Dynamic Header User Badge & Auth State
function updateAuthUI() {
    const authSlot = document.getElementById('auth-nav-slot');
    if (!authSlot) return;

    const activeUser = JSON.parse(localStorage.getItem('currentUser'));

    if (activeUser) {
        authSlot.innerHTML = `
            <span class="user-badge">Hello, ${activeUser.name}</span>
            <button class="btn-login" onclick="logout()">Logout</button>
        `;
    } else {
        authSlot.innerHTML = `
            <a href="login.html" class="btn-login">Login</a>
            <a href="login.html?mode=register" class="btn-register">Register</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Global Tab Switcher Function
window.switchTab = function(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    if (!loginForm || !regForm) return;

    if (tab === 'login') {
        loginForm.style.display = 'flex';
        regForm.style.display = 'none';
        if (tabLogin) tabLogin.classList.add('active');
        if (tabReg) tabReg.classList.remove('active');
    } else {
        regForm.style.display = 'flex';
        loginForm.style.display = 'none';
        if (tabReg) tabReg.classList.add('active');
        if (tabLogin) tabLogin.classList.remove('active');
    }
};
