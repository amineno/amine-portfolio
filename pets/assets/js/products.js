// Groom'Go - Products & Cart Management System
// Synchronisé avec l'ensemble du catalogue (23 produits réels)

const products = {
    1: {
        id: 1,
        name: "Peigne Démêloir Anti-Nœuds Professionnel pour Animaux",
        category: "shampoo",
        price: 35,
        originalPrice: 40,
        rating: 4.8,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.22.jpeg",
        description: "Peigne démêloir double face pour chiens et chats. Enlève les nœuds et le sous-poil mort tout en douceur."
    },
    2: {
        id: 2,
        name: "Brosse de Bain en Silicone avec Réservoir de Shampoing",
        category: "shampoo",
        price: 28,
        originalPrice: 35,
        rating: 4.2,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.22 (2).jpeg",
        description: "Brosse de bain en silicone souple avec réservoir intégré pour shampoing. Nettoie et masse en même temps."
    },
    3: {
        id: 3,
        name: "Brosse de Douche & Toilettage avec Distributeur",
        category: "shampoo",
        price: 42,
        originalPrice: 48,
        rating: 4.9,
        image: "assets/img/WhatsApp Image 2025-10-14 at 23.47.27 (2).jpeg",
        description: "Petite brosse de douche et massage ergonomique. Le silicone doux nettoie en profondeur sans irriter la peau."
    },
    4: {
        id: 4,
        name: "Brosse de Massage Électrique USB Nettoyante",
        category: "shampoo",
        price: 38,
        originalPrice: 45,
        rating: 4.3,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.22 (1).jpeg",
        description: "Brosse rechargeable par USB pour chiens et chats. Stimule la microcirculation et détend l'animal durant le soin."
    },
    5: {
        id: 5,
        name: "Huile de Brillance et Antinœuds Premium",
        category: "shampoo",
        price: 45,
        originalPrice: 50,
        rating: 4.7,
        image: "assets/img/WhatsApp Image 2025-10-14 at 23.57.14.jpeg",
        description: "Spray lustrant pour pelage soyeux. Prévient les nœuds et protège le poil contre le dessèchement."
    },
    6: {
        id: 6,
        name: "Spray de Soin Apaisant à la Lavande",
        category: "shampoo",
        price: 32,
        originalPrice: 38,
        rating: 4.4,
        image: "assets/img/WhatsApp Image 2025-10-14 at 23.57.14 (1).jpeg",
        description: "Soin naturel calmant sans rinçage. Idéal pour rafraîchir et apaiser votre compagnon entre deux séances."
    },
    7: {
        id: 7,
        name: "Sérum Hydratant Naturel Chien & Chat",
        category: "shampoo",
        price: 48,
        originalPrice: 55,
        rating: 4.6,
        image: "assets/img/WhatsApp Image 2025-10-14 at 23.57.14 (2).jpeg",
        description: "Élixir réparateur à base d'huiles végétales pures pour nourrir la peau sèche et revitaliser la fourrure."
    },
    8: {
        id: 8,
        name: "Shampoing Professionnel Hydratant Doux",
        category: "shampoo",
        price: 42,
        originalPrice: 48,
        rating: 4.7,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.24 (1).jpeg",
        description: "Formule hypoallergénique de qualité salon. Nettoie en douceur et laisse un parfum délicat durable."
    },
    9: {
        id: 9,
        name: "Lotion Démêlante Professionnelle Tout Pelage",
        category: "shampoo",
        price: 36,
        originalPrice: 42,
        rating: 4.5,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.24 (2).jpeg",
        description: "Lotion antistatique facilitant le peignage des poils longs sans tirer ni casser la fibre capillaire."
    },
    10: {
        id: 10,
        name: "Pack Félin : Cage de Transport, Arbre à Chat & Maisonnette",
        category: "accessories",
        price: 65,
        originalPrice: 75,
        rating: 4.1,
        image: "assets/img/WhatsApp Image 2025-10-15 at 00.08.53.jpeg",
        description: "Kit complet pour l'accueil ou le confort de votre félin. Matériaux résistants et sécurisés."
    },
    11: {
        id: 11,
        name: "Balle de Jeu Interactive Lumineuse pour Chat",
        category: "accessories",
        price: 42,
        originalPrice: 50,
        rating: 4.8,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.23.jpeg",
        description: "Balle à trajectoire aléatoire avec lumière LED stimulante. Garde votre chat vif et actif."
    },
    12: {
        id: 12,
        name: "Ensemble Laisse et Collier Tressés Robustes",
        category: "accessories",
        price: 85,
        originalPrice: 95,
        rating: 4.9,
        image: "assets/img/WhatsApp Image 2025-10-15 at 00.08.53 (2).jpeg",
        description: "Confection en corde d'escalade renforcée avec maillon métallique. Résistance maximale pour grands chiens."
    },
    13: {
        id: 13,
        name: "Jouet Distributeur de Croquettes Interactif",
        category: "accessories",
        price: 38,
        originalPrice: 45,
        rating: 4.5,
        image: "assets/img/WhatsApp Image 2025-10-15 at 00.08.53 (3).jpeg",
        description: "Stimule l'intelligence et ralentit la prise alimentaire pour une meilleure digestion."
    },
    14: {
        id: 14,
        name: "Os à Mâcher Ultra Résistant pour Chien",
        category: "accessories",
        price: 48,
        originalPrice: 55,
        rating: 4.7,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.23 (3).jpeg",
        description: "Caoutchouc résistant non toxique. Favorise l'hygiène bucco-dentaire en éliminant la plaque de tartre."
    },
    15: {
        id: 15,
        name: "Gilet Respirant Léger pour Chien (Mesh)",
        category: "accessories",
        price: 32,
        originalPrice: 38,
        rating: 4.3,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.23 (2).jpeg",
        description: "Tissu respirant ultra léger adapté aux balades estivales en Tunisie. Lavable en machine."
    },
    16: {
        id: 16,
        name: "Set Complet Harnais Rembourré, Laisse & Sacs",
        category: "accessories",
        price: 35,
        originalPrice: 45,
        rating: 4.6,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.24.jpeg",
        description: "Harnais anti-traction rembourré avec laisse assortie et distributeur de sacs à déjections."
    },
    17: {
        id: 17,
        name: "Bandana Tie-Dye Élégant Chien & Chat",
        category: "accessories",
        price: 58,
        originalPrice: 65,
        rating: 4.8,
        image: "assets/img/WhatsApp Image 2025-10-15 at 00.08.54 (3).jpeg",
        description: "Foulard stylé aux teintes pastel. Toucher soyeux et nœud facile à ajuster au cou de l'animal."
    },
    18: {
        id: 18,
        name: "Pack Essentiel Chien : Collier, Laisse & Gamelle",
        category: "accessories",
        price: 72,
        originalPrice: 85,
        rating: 4.4,
        image: "assets/img/WhatsApp Image 2025-10-15 at 00.08.55.jpeg",
        description: "L'équipement indispensable pour bien s'occuper de son compagnon : laisse, collier, bol inox et jouet."
    },
    19: {
        id: 19,
        name: "Coussin Matelassé Cuir Vegan Prestige",
        category: "accessories",
        price: 44,
        originalPrice: 55,
        rating: 4.7,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.38.23 (1).jpeg",
        description: "Lit douillet et imperméable en similicuir cognac. Décoratif et facile à essuyer au quotidien."
    },
    20: {
        id: 20,
        name: "Maxi Pot Bâtonnets Tendres Chien & Chat",
        category: "food",
        price: 38,
        originalPrice: 45,
        rating: 4.7,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.40.19 (3).jpeg",
        description: "Gourmandises tendres riches en viande véritable. Idéales pour récompenser ou éduquer vos animaux."
    },
    21: {
        id: 21,
        name: "Croquettes Complètes Premium Spécial Chat",
        category: "food",
        price: 52,
        originalPrice: 60,
        rating: 4.9,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.40.19 (4).jpeg",
        description: "Recette haute digestibilité riche en protéines animales, taurine et acides gras Oméga 3 et 6."
    },
    22: {
        id: 22,
        name: "Pâtée Gourmet Équilibrée Fresh Food Chien",
        category: "food",
        price: 48,
        originalPrice: 55,
        rating: 4.6,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.40.20 (1).jpeg",
        description: "Aliment humide savoureux en conserve. Viandes fraîches, légumes mijotés pour une hydratation optimale."
    },
    23: {
        id: 23,
        name: "Portion Nutrition Crue Naturelle (BARF)",
        category: "food",
        price: 62,
        originalPrice: 70,
        rating: 4.9,
        image: "assets/img/WhatsApp Image 2025-10-15 at 11.40.21.jpeg",
        description: "Repas cru congelé haute valeur biologique respectant le régime naturel des carnivores."
    }
};

// Panier en mémoire
let cart = [];
const DELIVERY_FEE = 7;
const FREE_DELIVERY_THRESHOLD = 60;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    initializeFilters();
    updateCartDisplay();
    initializeProductAnimations();
    setupCheckoutForm();
});

// Initialiser les filtres
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            productItems.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (category === 'all' || itemCat === category) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('show'), 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('show');
                }
            });
        });
    });
}

// Animations d'apparition
function initializeProductAnimations() {
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 40);
    });
}

// Ajouter au panier
function addToCart(productId) {
    const product = products[productId];
    if (!product) {
        console.warn(`Produit avec ID ${productId} introuvable.`);
        return;
    }

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartDisplay();
    showToastNotification(`"${product.name}" a été ajouté à votre panier !`);
}

// Supprimer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

// Modifier la quantité
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        updateCartDisplay();
    }
}

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
    const cartCountElements = document.querySelectorAll('#cartCount, .nav-cart-count');
    const cartBody = document.getElementById('cartBody');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });

    if (!cartBody) return;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="fas fa-shopping-bag fa-3x text-muted mb-3 opacity-50"></i>
                <h5 class="text-white">Votre panier est vide</h5>
                <p class="text-muted small">Parcourez nos soins et accessoires d'élite pour votre compagnon.</p>
                <button class="btn btn-premium btn-premium-primary btn-sm mt-3" onclick="toggleCart()">Explorer la boutique</button>
            </div>
        `;
        if (cartSubtotal) cartSubtotal.textContent = '0 DT';
        if (cartShipping) cartShipping.textContent = '0 DT';
        if (cartTotal) cartTotal.textContent = '0 DT';
        return;
    }

    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item glass-panel p-3 mb-3 d-flex align-items-center gap-3">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <div class="flex-grow-1">
                <h6 class="text-white mb-1 small fw-bold text-truncate" style="max-width: 180px;">${item.name}</h6>
                <div class="text-primary-light fw-bold">${item.price} DT</div>
                <div class="d-flex align-items-center gap-2 mt-2">
                    <button class="btn btn-sm btn-outline-secondary py-0 px-2 text-white" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="text-white fw-bold px-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary py-0 px-2 text-white" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="btn btn-sm text-danger ms-auto border-0" onclick="removeFromCart(${item.id})" title="Supprimer">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const finalTotal = subtotal + shipping;

    if (cartSubtotal) cartSubtotal.textContent = `${subtotal} DT`;
    if (cartShipping) {
        cartShipping.innerHTML = shipping === 0 ? '<span class="text-success fw-bold">Gratuite</span>' : `${shipping} DT`;
    }
    if (cartTotal) cartTotal.textContent = `${finalTotal} DT`;
}

// Ouvrir / Fermer le panier
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartSidebar) cartSidebar.classList.toggle('open');
    if (cartOverlay) cartOverlay.classList.toggle('open');
}

// Ouvrir le modal de validation de commande
function openCheckoutModal() {
    if (cart.length === 0) {
        showToastNotification('Votre panier est vide !', 'warning');
        return;
    }

    // Fermer le panier latéral
    toggleCart();

    // Pré-remplir les données si utilisateur connecté
    const user = JSON.parse(localStorage.getItem('groomgo_user') || 'null');
    if (user) {
        const nameInput = document.getElementById('orderFullName');
        const emailInput = document.getElementById('orderEmail');
        if (nameInput && user.name) nameInput.value = user.name;
        if (emailInput && user.email) emailInput.value = user.email;
    }

    // Calculer le récapitulatif dans le modal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + shipping;

    const summaryEl = document.getElementById('modalOrderSummary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="glass-panel p-3 mb-3">
                <div class="d-flex justify-content-between small text-muted mb-1">
                    <span>Sous-total (${cart.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                    <span>${subtotal} DT</span>
                </div>
                <div class="d-flex justify-content-between small text-muted mb-1">
                    <span>Livraison (Grand Tunis)</span>
                    <span>${shipping === 0 ? 'Gratuite' : shipping + ' DT'}</span>
                </div>
                <div class="d-flex justify-content-between fw-bold text-white fs-5 border-top border-secondary pt-2 mt-2">
                    <span>Total à régler</span>
                    <span class="text-gradient">${total} DT</span>
                </div>
            </div>
        `;
    }

    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}

// Configurer le formulaire de commande
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Traitement...';

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
        const finalTotal = subtotal + shipping;

        const orderData = {
            id: 'CMD-' + Date.now().toString().slice(-6),
            customerName: document.getElementById('orderFullName').value.trim(),
            phone: document.getElementById('orderPhone').value.trim(),
            city: document.getElementById('orderCity').value,
            address: document.getElementById('orderAddress').value.trim(),
            notes: (document.getElementById('orderNotes') || {}).value || '',
            items: [...cart],
            subtotal: subtotal,
            shipping: shipping,
            totalPrice: finalTotal,
            status: 'En attente',
            date: new Date().toLocaleDateString('fr-FR'),
            timestamp: new Date().toISOString()
        };

        // Sauvegarder dans localStorage pour le dashboard admin
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.unshift(orderData);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Vider le panier
        cart = [];
        saveCartToStorage();
        updateCartDisplay();

        // Fermer le modal de commande
        const checkoutModalEl = document.getElementById('checkoutModal');
        const modalInstance = bootstrap.Modal.getInstance(checkoutModalEl);
        if (modalInstance) modalInstance.hide();

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Confirmer ma commande';

        // Afficher le modal de confirmation finale
        showOrderConfirmationModal(orderData);
    });
}

// Modal de confirmation de commande
function showOrderConfirmationModal(order) {
    const itemsList = order.items.map(i => `• ${i.name} (x${i.quantity}) - ${i.price * i.quantity} DT`).join('%0A');
    const waMessage = `Bonjour Groom'Go, je confirme ma commande #${order.id} :%0A%0A${itemsList}%0A%0ATotal: ${order.totalPrice} DT%0ANom: ${order.customerName}%0ATél: ${order.phone}%0AVille: ${order.city}%0AAdresse: ${order.address}`;
    const waLink = `https://wa.me/21629123456?text=${waMessage}`;

    const modalHtml = `
        <div class="modal fade" id="orderSuccessModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content glass-card border-primary p-4 text-center">
                    <div class="icon-box bg-success-soft text-success p-3 rounded-circle mx-auto mb-3" style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-check-circle fs-1"></i>
                    </div>
                    <h3 class="text-white fw-bold mb-2">Commande Enregistrée !</h3>
                    <p class="text-muted">Merci <strong>${order.customerName}</strong>. Votre commande <strong>#${order.id}</strong> a bien été prise en compte par notre équipe.</p>
                    <div class="glass-panel p-3 text-start mb-4">
                        <div class="small text-muted">Total à payer à la livraison : <span class="text-white fw-bold fs-6">${order.totalPrice} DT</span></div>
                        <div class="small text-muted">Livraison estimée : <span class="text-white">24h à 48h sur le Grand Tunis</span></div>
                    </div>
                    <div class="d-flex flex-column gap-2">
                        <a href="${waLink}" target="_blank" class="btn btn-success btn-premium w-100">
                            <i class="fab fa-whatsapp me-2"></i> Confirmer sur WhatsApp
                        </a>
                        <button type="button" class="btn btn-premium btn-premium-outline w-100" data-bs-dismiss="modal">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Nettoyer précédent modal de succès s'il existe
    const oldModal = document.getElementById('orderSuccessModal');
    if (oldModal) oldModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
    successModal.show();
}

// Notifications Toast
function showToastNotification(message, type = 'success') {
    const existing = document.querySelector('.groomgo-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `groomgo-toast alert alert-${type === 'warning' ? 'warning' : 'primary'} position-fixed shadow-lg d-flex align-items-center gap-2`;
    toast.style.cssText = 'bottom: 25px; right: 25px; z-index: 10000; border-radius: 16px; min-width: 280px; max-width: 400px; animation: slideUp 0.3s ease; backdrop-filter: blur(10px);';
    toast.innerHTML = `
        <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'shopping-bag'} text-gradient fs-5"></i>
        <div class="small flex-grow-1 text-white">${message}</div>
        <button type="button" class="btn-close btn-close-white ms-2" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 3500);
}

// Stockage Local
function saveCartToStorage() {
    localStorage.setItem('groomgo_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('groomgo_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}
