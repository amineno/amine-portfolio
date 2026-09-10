// Main JavaScript for Groom'go

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect - Enhanced
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.navbar-nav .nav-link:not(.btn)');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call on page load
    
    // Gestion universelle de l'état d'authentification dans la navbar
    updateNavbarAuth();

    // Gestion du formulaire newsletter
    setupNewsletterForm();

    // Gestion du compteur de panier dans la navigation
    updateNavbarCartBadge();
});

// Mettre à jour la navigation selon l'état de connexion (Client ou Admin)
function updateNavbarAuth() {
    const authContainers = document.querySelectorAll('#authNavContainer, .auth-nav-item');
    if (!authContainers.length) return;

    const user = JSON.parse(localStorage.getItem('groomgo_user') || 'null');
    const adminToken = localStorage.getItem('adminToken');

    authContainers.forEach(container => {
        if (adminToken || (user && user.role === 'admin')) {
            container.innerHTML = `
                <div class="d-flex align-items-center gap-2 ms-lg-3">
                    <a href="admin-dashboard.html" class="btn-premium btn-premium-primary py-2 px-3 fs-6">
                        <i class="fas fa-shield-alt"></i> Dashboard Admin
                    </a>
                    <button onclick="logoutGroomGo()" class="btn btn-outline-danger btn-sm rounded-pill px-3" title="Déconnexion">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;
        } else if (user) {
            const firstName = user.name ? user.name.split(' ')[0] : 'Mon Compte';
            container.innerHTML = `
                <div class="d-flex align-items-center gap-2 ms-lg-3">
                    <span class="badge bg-primary-soft text-primary-light py-2 px-3 rounded-pill">
                        <i class="fas fa-user-circle me-1"></i> ${firstName}
                    </span>
                    <button onclick="logoutGroomGo()" class="btn btn-outline-danger btn-sm rounded-pill px-3" title="Déconnexion">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <a class="nav-link btn-premium btn-premium-outline ms-lg-3" href="login.html" id="authNavBtn">
                    <i class="fas fa-user-circle"></i> Connexion
                </a>
            `;
        }
    });
}

// Fonction globale de déconnexion
window.logoutGroomGo = function() {
    localStorage.removeItem('groomgo_user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    showNotification('Vous avez été déconnecté avec succès.', 'info');
    setTimeout(() => {
        window.location.reload();
    }, 800);
};

// Gestion de la Newsletter
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : '';
            if (email) {
                // Sauvegarder dans les abonnés
                const subscribers = JSON.parse(localStorage.getItem('groomgo_newsletter') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('groomgo_newsletter', JSON.stringify(subscribers));
                }
                showNotification('Merci pour votre inscription à la newsletter Groom\'Go ! 🎉', 'success');
                this.reset();
            }
        });
    }
}

// Badge de panier dans la navbar
function updateNavbarCartBadge() {
    const cart = JSON.parse(localStorage.getItem('groomgo_cart') || '[]');
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badges = document.querySelectorAll('.nav-cart-count');
    badges.forEach(badge => {
        badge.textContent = totalCount;
        badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Form validation utilities
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        const value = input.value.trim();
        let inputValid = true;
        let errorMessage = '';
        
        // Check if field is empty
        if (!value) {
            inputValid = false;
            errorMessage = 'Ce champ est requis';
        }
        
        // Specific validations
        if (value && input.type === 'email' && !validateEmail(value)) {
            inputValid = false;
            errorMessage = 'Veuillez entrer un email valide';
        }
        
        if (value && input.type === 'tel' && !validatePhone(value)) {
            inputValid = false;
            errorMessage = 'Veuillez entrer un numéro de téléphone valide';
        }
        
        // Update input state
        if (inputValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            removeErrorMessage(input);
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            showErrorMessage(input, errorMessage);
            isValid = false;
        }
    });
    
    return isValid;
}

function showErrorMessage(input, message) {
    removeErrorMessage(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(input) {
    const existingError = input.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Utility functions for local storage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// Date and time utilities
function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function formatTime(time) {
    return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(`2000-01-01T${time}`));
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideInRight 0.3s ease-out;
    }
`;
document.head.appendChild(style);
