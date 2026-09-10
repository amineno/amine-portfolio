// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button and show loading
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
    
    // Préparer les données du message
    const messageData = {
        senderName: formData.get('senderName'),
        senderEmail: formData.get('senderEmail'),
        senderPhone: formData.get('senderPhone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        serviceType: formData.get('serviceType'),
        timestamp: new Date().toISOString(),
        status: 'unread',
        priority: 'normal'
    };
    
    try {
        // Détecter si on est en mode local (file://) ou serveur
        const isLocalFile = window.location.protocol === 'file:';
        
        if (!isLocalFile) {
            // Mode serveur - essayer l'API
            try {
                const response = await fetch('http://localhost:3000/api/messages/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    // Sauvegarder aussi localement
                    saveMessageLocally(messageData);
                    
                    // Show success message
                    showNotification('success', result.message || 'Message envoyé avec succès!');
                    
                    // Reset form
                    e.target.reset();
                    
                    // Show thank you message
                    showThankYouMessage(e.target);
                    return;
                }
            } catch (apiError) {
                console.log('API non disponible, sauvegarde locale');
            }
        }
        
        // Mode local ou API échouée - sauvegarder localement
        saveMessageLocally(messageData);
        
        // Show success message
        showNotification('success', 'Message enregistré avec succès!');
        
        // Reset form
        e.target.reset();
        
        // Show thank you message
        showThankYouMessage(e.target);
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        // En cas d'erreur, sauvegarder quand même localement
        saveMessageLocally(messageData);
        showNotification('warning', 'Message enregistré localement. Il sera traité dès que possible.');
        
        e.target.reset();
        showThankYouMessage(e.target);
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function saveMessageLocally(messageData) {
    try {
        // Récupérer les messages existants
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        
        // Ajouter un ID unique et valide pour JavaScript
        messageData.id = 'MSG_' + Date.now();
        
        // Ajouter le nouveau message
        messages.push(messageData);
        
        // Sauvegarder
        localStorage.setItem('messages', JSON.stringify(messages));
        
        console.log('Message sauvegardé localement:', messageData.id);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde locale:', error);
    }
}

function showNotification(type, message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.contact-notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `contact-notification alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; animation: slideIn 0.3s ease;';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function showValidationErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    document.querySelectorAll('.is-invalid').forEach(e => e.classList.remove('is-invalid'));
    
    errors.forEach(error => {
        const field = document.querySelector(`[name="${error.path}"]`);
        if (field) {
            field.classList.add('is-invalid');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-danger small mt-1';
            errorDiv.textContent = error.msg;
            field.parentElement.appendChild(errorDiv);
        }
    });
}

function showThankYouMessage(form) {
    const thankYouHtml = `
        <div class="text-center py-5">
            <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
            <h3 class="mt-3 mb-2">Message envoyé avec succès!</h3>
            <p class="text-muted">Nous vous répondrons dans les 24-48 heures.</p>
            <button type="button" class="btn btn-primary mt-3" onclick="resetContactForm()">
                <i class="fas fa-envelope me-2"></i>Envoyer un autre message
            </button>
        </div>
    `;
    
    const formContainer = form.parentElement;
    const thankYouDiv = document.createElement('div');
    thankYouDiv.id = 'thankYouMessage';
    thankYouDiv.innerHTML = thankYouHtml;
    
    form.style.display = 'none';
    formContainer.appendChild(thankYouDiv);
}

function resetContactForm() {
    const form = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    if (form && thankYouMessage) {
        form.style.display = 'block';
        thankYouMessage.remove();
    }
}

// Add CSS animations
if (!document.getElementById('contactAnimations')) {
    const style = document.createElement('style');
    style.id = 'contactAnimations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .contact-notification {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .field-error {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
