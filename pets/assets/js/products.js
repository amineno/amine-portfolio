// Products Page JavaScript

// Product data
const products = {
    1: { name: "Shampoing Naturel Premium", price: 25, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center" },
    2: { name: "Shampoing Anti-Puces", price: 35, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center" },
    3: { name: "Collier Élégant en Cuir", price: 45, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=center" },
    4: { name: "Laisse Rétractable 5m", price: 55, image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&h=300&fit=crop&crop=center" },
    5: { name: "Brosse Professionnelle", price: 28, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center" },
    6: { name: "Coupe-Griffes Professionnel", price: 32, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=center" },
    7: { name: "Baume Hydratant Pattes", price: 22, image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center" },
    8: { name: "Spray Démêlant", price: 18, image: "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400&h=300&fit=crop&crop=center" },
    9: { name: "Gamelle Inox Double", price: 38, image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400&h=300&fit=crop&crop=center" }
};

// Cart functionality
let cart = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    updateCartDisplay();
    loadCartFromStorage();
    initializeProductAnimations();
});

// Initialiser les animations des produits
function initializeProductAnimations() {
    const productItems = document.querySelectorAll('.product-item');
    
    // Observer pour les animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    productItems.forEach(item => {
        observer.observe(item);
    });
    
    // Animation initiale pour les produits visibles
    setTimeout(() => {
        productItems.forEach((item, index) => {
            if (!item.classList.contains('hidden')) {
                setTimeout(() => {
                    item.classList.add('show');
                }, index * 100);
            }
        });
    }, 300);
}

// Filter functionality améliorée
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    
    // Ajouter les compteurs de produits aux boutons
    updateProductCounts();
    
    // Ajouter le compteur de produits visibles
    addProductsCounter();

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button avec animation
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'scale(1)';
            });
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            
            // Masquer tous les produits d'abord
            productItems.forEach((item, index) => {
                item.classList.remove('show');
                item.classList.add('hidden');
            });
            
            // Afficher les produits filtrés avec délai progressif
            setTimeout(() => {
                let visibleCount = 0;
                productItems.forEach((item, index) => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (category === 'all' || itemCategory === category) {
                        setTimeout(() => {
                            item.classList.remove('hidden');
                            item.classList.add('show');
                            visibleCount++;
                        }, index * 100); // Délai progressif pour effet de vague
                    }
                });
                
                // Mettre à jour le compteur
                setTimeout(() => {
                    updateVisibleProductsCounter(category);
                }, 500);
            }, 200);
        });
    });
}

// Fonction pour compter les produits par catégorie
function updateProductCounts() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    
    filterButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        let count = 0;
        
        if (category === 'all') {
            count = productItems.length;
        } else {
            productItems.forEach(item => {
                if (item.getAttribute('data-category') === category) {
                    count++;
                }
            });
        }
        
        // Ajouter le compteur au bouton
        const existingCount = button.querySelector('.product-count');
        if (existingCount) {
            existingCount.textContent = count;
        } else {
            const countSpan = document.createElement('span');
            countSpan.className = 'product-count';
            countSpan.textContent = count;
            button.appendChild(countSpan);
        }
    });
}

// Ajouter un compteur de produits visibles
function addProductsCounter() {
    const productsSection = document.querySelector('.products-section');
    if (productsSection && !document.querySelector('.products-counter')) {
        const counter = document.createElement('div');
        counter.className = 'products-counter';
        
        // Compter le nombre total de produits
        const totalProducts = document.querySelectorAll('.product-item').length;
        counter.innerHTML = `<span id="visibleCount">${totalProducts}</span> produits disponibles`;
        
        const container = productsSection.querySelector('.container');
        const productsGrid = container.querySelector('.row');
        container.insertBefore(counter, productsGrid);
        
        // Afficher le compteur avec animation
        setTimeout(() => {
            counter.classList.add('show');
        }, 500);
    }
}

// Mettre à jour le compteur de produits visibles
function updateVisibleProductsCounter(category) {
    const visibleCountElement = document.getElementById('visibleCount');
    const productItems = document.querySelectorAll('.product-item');
    
    if (visibleCountElement) {
        let count = 0;
        
        if (category === 'all') {
            count = productItems.length;
        } else {
            productItems.forEach(item => {
                if (item.getAttribute('data-category') === category) {
                    count++;
                }
            });
        }
        
        // Animation du compteur
        visibleCountElement.style.transform = 'scale(1.2)';
        visibleCountElement.style.color = 'var(--primary-color)';
        
        setTimeout(() => {
            visibleCountElement.textContent = count;
            visibleCountElement.style.transform = 'scale(1)';
            visibleCountElement.style.color = '';
        }, 200);
    }
}

// Add to cart function
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCartDisplay();
    saveCartToStorage();
    showAddToCartAnimation();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCartToStorage();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        saveCartToStorage();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart body
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
            </div>
        `;
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} DT</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total} DT`;
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    
    // Prevent body scroll when cart is open
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide!');
        return;
    }

    // Create order summary
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} - ${item.price * item.quantity} DT`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const message = `Nouvelle commande Groom'go:\n\n${orderSummary}\n\nTotal: ${total} DT\n\nMerci de confirmer cette commande.`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/21612345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after order
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    toggleCart();
    
    // Show success message
    showOrderSuccessMessage();
}

// Show add to cart animation
function showAddToCartAnimation() {
    // Create floating notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div class="alert alert-success position-fixed" style="top: 100px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle me-2"></i>
            Produit ajouté au panier!
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add bounce animation
    notification.firstElementChild.classList.add('bounce');
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Show order success message
function showOrderSuccessMessage() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div class="alert alert-success position-fixed" style="top: 100px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle me-2"></i>
            Commande envoyée avec succès!
        </div>
    `;
    
    document.body.appendChild(notification);
    notification.firstElementChild.classList.add('bounce');
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('groomgo_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('groomgo_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartButton = document.querySelector('[onclick="toggleCart()"]');
    
    if (!cartSidebar.contains(e.target) && !cartButton.contains(e.target) && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});

// Handle escape key to close cart
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for images
document.querySelectorAll('.product-image img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.remove('loading');
    });
    
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/400x300/f8f9fa/6c757d?text=Image+Non+Disponible';
        this.classList.remove('loading');
    });
    
    // Add loading class initially
    img.classList.add('loading');
});
