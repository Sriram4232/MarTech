const products = [
    {
        id: 1,
        title: "iPhone 13 Pro",
        brand: "Apple",
        price: 999,
        category: "smartphone",
        image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-family-hero?wid=940&hei=1112&fmt=png-alpha&.v=1631220221000"
    },
    {
        id: 2,
        title: "Galaxy S22 Ultra",
        brand: "Samsung",
        price: 1199,
        category: "smartphone",
        image: "https://supercells.co.za/wp-content/uploads/2022/03/s22-ultra-black2.jpg"
    },
    {
        id: 3,
        title: "MacBook Pro 14\"",
        brand: "Apple",
        price: 1999,
        category: "laptop",
        image: "https://www.apple.com/v/macbook-pro-14-and-16/b/images/overview/hero/intro__ewz1ro7xs14y_large.jpg"
    },
    {
        id: 4,
        title: "XPS 15",
        brand: "Dell",
        price: 1499,
        category: "laptop",
        image: "https://p1-ofp.static.pub//medias/25932471988_LenovoThinkBook16Gen6ArcticGreyIMG_202307250411401715832386296.png"
    },
    {
        id: 5,
        title: "OLED C1 Series",
        brand: "LG",
        price: 1799,
        category: "tv",
        image: "https://m.media-amazon.com/images/I/71Y3rg1bxMS._AC_.jpg"
    },
    {
        id: 6,
        title: "WH-1000XM4",
        brand: "Sony",
        price: 349,
        category: "audio",
        image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6428/6428314_sd.jpg"
    },
    {
        id: 7,
        title: "AirPods Pro",
        brand: "Apple",
        price: 249,
        category: "audio",
        image: "https://tse1.mm.bing.net/th/id/OIP.134VJ44OStJo8DrF8-JnyAHaHa?rs=1&pid=ImgDetMain"
    },
    {
        id: 8,
        title: "Galaxy Tab S8",
        brand: "Samsung",
        price: 699,
        category: "tablet",
        image: "https://images.samsung.com/in/galaxy-tab-s8/feature/buy/TabS8_S8plus_allColorKV_WithSPen_MO.jpg"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const filterBtn = document.getElementById('filter-btn');
const filterOptions = document.getElementById('filter-options');
const cartBtn = document.querySelector('.cart-btn');
const closeCart = document.querySelector('.close-cart');

// Display products
function displayProducts(productsToDisplay) {
    productGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-brand">${product.brand}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        cartCount.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <p class="cart-item-remove" data-id="${item.id}">Remove</p>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Cart quantity functions
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    updateCart();
}

function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show cart notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Filter functionality
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="price"]:checked')?.value;
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    
    let filteredProducts = [...products];
    
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
    }
    
    if (selectedPrice) {
        const [min, max] = selectedPrice.split('-').map(Number);
        
        filteredProducts = filteredProducts.filter(product => {
            if (selectedPrice.endsWith('+')) {
                return product.price >= min;
            }
            return product.price >= min && product.price <= max;
        });
    }
    
    if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedBrands.includes(product.brand.toLowerCase()));
    }
    
    displayProducts(filteredProducts);
}

// Event Listeners
filterBtn.addEventListener('click', () => {
    filterOptions.style.display = filterOptions.style.display === 'grid' ? 'none' : 'grid';
});

document.querySelector('.apply-filters').addEventListener('click', () => {
    applyFilters();
    filterOptions.style.display = 'none';
});

cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close cart when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Initialize the page
displayProducts(products)