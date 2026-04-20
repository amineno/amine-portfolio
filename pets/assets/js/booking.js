// Booking System JavaScript - Version Complète et Fonctionnelle

// Variables globales
let currentStep = 1;
let bookingData = {
    service: null,
    pet: {},
    datetime: {},
    contact: {}
};

// Attendre que tout soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du système de réservation...');
    
    // Attendre un peu plus longtemps pour être sûr
    setTimeout(() => {
        initBookingSystem();
    }, 500);
});

function initBookingSystem() {
    console.log('📋 Démarrage du système de réservation...');
    
    // Vérifier si l'utilisateur est connecté
    checkUserAuth();
    
    // Vérification des éléments essentiels
    const serviceOptions = document.querySelectorAll('.service-option');
    const nextButton = document.getElementById('nextStep1');
    
    console.log('🔍 Éléments trouvés:');
    console.log('- Cartes de service:', serviceOptions.length);
    console.log('- Bouton suivant:', !!nextButton);
    
    if (serviceOptions.length === 0) {
        console.error('❌ Aucune carte de service trouvée!');
        return;
    }
    
    if (!nextButton) {
        console.error('❌ Bouton "Suivant" introuvable!');
        return;
    }
    
    // Configuration des cartes de service
    setupServiceCards();
    
    // Configuration de la navigation
    setupNavigation();
    
    // Configuration du formulaire
    setupFormValidation();
    
    // Configuration du sélecteur de date
    setupDatePicker();
    
    // Configuration du formulaire de soumission
    setupFormSubmission();
    
    console.log('✅ Système de réservation initialisé avec succès!');
}

function checkUserAuth() {
    const user = JSON.parse(localStorage.getItem('groomgo_user'));
    
    if (user) {
        console.log('👤 Utilisateur connecté:', user.name);
        
        // Pré-remplir les informations de contact si disponibles
        setTimeout(() => {
            prefillContactInfo(user);
        }, 1000);
    } else {
        console.log('⚠️ Aucun utilisateur connecté - réservation en tant qu\'invité');
    }
}

function prefillContactInfo(user) {
    // Pré-remplir les champs de contact avec les infos utilisateur
    const firstNameField = document.querySelector('input[name="firstName"]');
    const lastNameField = document.querySelector('input[name="lastName"]');
    const emailField = document.querySelector('input[name="email"]');
    
    if (firstNameField && user.name) {
        const nameParts = user.name.split(' ');
        firstNameField.value = nameParts[0] || '';
        if (lastNameField && nameParts.length > 1) {
            lastNameField.value = nameParts.slice(1).join(' ');
        }
    }
    
    if (emailField && user.email) {
        emailField.value = user.email;
    }
    
    console.log('✅ Informations de contact pré-remplies');
}

function setupServiceCards() {
    console.log('🎯 Configuration des cartes de service...');
    
    const serviceOptions = document.querySelectorAll('.service-option');
    
    serviceOptions.forEach((card, index) => {
        console.log(`Carte ${index + 1}:`, card.dataset.service);
        
        // Ajouter les styles nécessaires
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        card.style.position = 'relative';
        card.style.border = '2px solid #e5e7eb';
        card.style.borderRadius = '15px';
        
        // Ajouter l'événement de clic
        card.addEventListener('click', function() {
            console.log('🖱️ Clic sur:', this.dataset.service);
            selectService(this.dataset.service);
        });
        
        // Ajouter l'effet hover
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
            }
        });
    });
}

function selectService(serviceType) {
    console.log('🎯 Sélection du service:', serviceType);
    
    // Supprimer les sélections précédentes
    document.querySelectorAll('.service-option').forEach(card => {
        card.classList.remove('selected');
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
        card.style.borderColor = '#e5e7eb';
        card.style.backgroundColor = 'white';
    });
    
    // Sélectionner la nouvelle carte
    const selectedCard = document.querySelector(`[data-service="${serviceType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.style.transform = 'translateY(-5px)';
        selectedCard.style.boxShadow = '0 15px 30px rgba(79, 70, 229, 0.3)';
        selectedCard.style.borderColor = '#4f46e5';
        selectedCard.style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
        
        // Ajouter une icône de validation
        let checkIcon = selectedCard.querySelector('.check-icon');
        if (!checkIcon) {
            checkIcon = document.createElement('div');
            checkIcon.className = 'check-icon';
            checkIcon.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                width: 25px;
                height: 25px;
                background: #10b981;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bold;
            `;
            checkIcon.innerHTML = '✓';
            selectedCard.appendChild(checkIcon);
        }
        
        // Mettre à jour les données
        const nameElement = selectedCard.querySelector('h5');
        bookingData.service = {
            type: serviceType,
            name: nameElement ? nameElement.textContent : serviceType,
            price: parseInt(selectedCard.dataset.price) || 0,
            duration: selectedCard.dataset.duration || 'N/A'
        };
        
        console.log('✅ Service sélectionné:', bookingData.service);
        
        // Activer le bouton suivant
        const nextButton = document.getElementById('nextStep1');
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
            nextButton.style.backgroundColor = '#4f46e5';
            nextButton.style.borderColor = '#4f46e5';
            console.log('✅ Bouton "Suivant" activé');
        }
        
        // Mettre à jour la sidebar
        updateSidebar();
        
        // Afficher une notification
        showNotification(`Service "${bookingData.service.name}" sélectionné!`, 'success');
    }
}

function setupNavigation() {
    console.log('🧭 Configuration de la navigation...');
    
    // Bouton étape 1 -> 2
    const nextButton1 = document.getElementById('nextStep1');
    if (nextButton1) {
        nextButton1.addEventListener('click', function() {
            console.log('➡️ Passage à l\'étape 2');
            goToStep(2);
        });
    }
    
    // Bouton étape 2 -> 3
    const nextButton2 = document.getElementById('nextStep2');
    if (nextButton2) {
        nextButton2.addEventListener('click', function() {
            if (validateStep2()) {
                console.log('➡️ Passage à l\'étape 3');
                goToStep(3);
            }
        });
    }
    
    // Bouton étape 3 -> 4
    const nextButton3 = document.getElementById('nextStep3');
    if (nextButton3) {
        nextButton3.addEventListener('click', function() {
            if (validateStep3()) {
                console.log('➡️ Passage à l\'étape 4');
                goToStep(4);
            }
        });
    }
    
    // Bouton étape 4 -> 5
    const nextButton4 = document.getElementById('nextStep4');
    if (nextButton4) {
        nextButton4.addEventListener('click', function() {
            if (validateStep4()) {
                console.log('➡️ Passage à l\'étape 5');
                goToStep(5);
            }
        });
    }
    
    // Boutons précédent
    const prevButton2 = document.getElementById('prevStep2');
    if (prevButton2) {
        prevButton2.addEventListener('click', () => goToStep(1));
    }
    
    const prevButton3 = document.getElementById('prevStep3');
    if (prevButton3) {
        prevButton3.addEventListener('click', () => goToStep(2));
    }
    
    const prevButton4 = document.getElementById('prevStep4');
    if (prevButton4) {
        prevButton4.addEventListener('click', () => goToStep(3));
    }
    
    const prevButton5 = document.getElementById('prevStep5');
    if (prevButton5) {
        prevButton5.addEventListener('click', () => goToStep(4));
    }
}

function goToStep(step) {
    console.log(`📍 Passage à l'étape ${step}`);
    
    // Cacher l'étape actuelle
    const currentStepElement = document.querySelector('.booking-step.active');
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
    }
    
    // Afficher la nouvelle étape
    const newStepElement = document.getElementById(`step${step}`);
    if (newStepElement) {
        newStepElement.classList.add('active');
        currentStep = step;
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Mettre à jour la barre de progression
        updateProgressBar();
    }
}

function validateStep2() {
    const petName = document.querySelector('input[name="petName"]');
    const petType = document.querySelector('select[name="petType"]');
    
    if (!petName.value.trim()) {
        showNotification('Veuillez entrer le nom de votre animal', 'error');
        petName.focus();
        return false;
    }
    
    if (!petType.value) {
        showNotification('Veuillez sélectionner le type d\'animal', 'error');
        petType.focus();
        return false;
    }
    
    // Sauvegarder les données
    const formData = new FormData(document.getElementById('bookingForm'));
    bookingData.pet = {
        name: formData.get('petName'),
        type: formData.get('petType'),
        breed: formData.get('petBreed'),
        age: formData.get('petAge'),
        size: formData.get('petSize'),
        temperament: formData.get('petTemperament'),
        notes: formData.get('petNotes')
    };
    
    console.log('✅ Données animal validées:', bookingData.pet);
    updateSidebar();
    return true;
}

function validateStep3() {
    const bookingDate = document.querySelector('input[name="bookingDate"]');
    const bookingTime = document.querySelector('select[name="bookingTime"]');
    
    if (!bookingDate.value.trim()) {
        showNotification('Veuillez sélectionner une date', 'error');
        bookingDate.focus();
        return false;
    }
    
    if (!bookingTime.value) {
        showNotification('Veuillez sélectionner une heure', 'error');
        bookingTime.focus();
        return false;
    }
    
    // Vérifier que la date n'est pas dans le passé
    const selectedDate = new Date(bookingDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Veuillez sélectionner une date future', 'error');
        bookingDate.focus();
        return false;
    }
    
    // Vérifier que ce n'est pas un dimanche
    if (selectedDate.getDay() === 0) {
        showNotification('Les services ne sont pas disponibles le dimanche', 'error');
        bookingDate.focus();
        return false;
    }
    
    // Vérifier que la date n'est pas trop loin dans le futur (90 jours max)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    
    if (selectedDate > maxDate) {
        showNotification('Veuillez sélectionner une date dans les 90 prochains jours', 'error');
        bookingDate.focus();
        return false;
    }
    
    // Sauvegarder les données
    bookingData.datetime = {
        date: bookingDate.value,
        time: bookingTime.value,
        dateFormatted: selectedDate.toLocaleDateString('fr-FR'),
        timeFormatted: bookingTime.options[bookingTime.selectedIndex].text
    };
    
    console.log('✅ Données date/heure validées:', bookingData.datetime);
    updateSidebar();
    return true;
}

function validateStep4() {
    const firstName = document.querySelector('input[name="firstName"]');
    const lastName = document.querySelector('input[name="lastName"]');
    const email = document.querySelector('input[name="email"]');
    const phone = document.querySelector('input[name="phone"]');
    const address = document.querySelector('textarea[name="address"]');
    
    // Validation des champs obligatoires
    if (!firstName.value.trim()) {
        showNotification('Veuillez entrer votre prénom', 'error');
        firstName.focus();
        return false;
    }
    
    if (!lastName.value.trim()) {
        showNotification('Veuillez entrer votre nom', 'error');
        lastName.focus();
        return false;
    }
    
    if (!email.value.trim()) {
        showNotification('Veuillez entrer votre email', 'error');
        email.focus();
        return false;
    }
    
    if (!validateEmail(email.value)) {
        showNotification('Veuillez entrer un email valide', 'error');
        email.focus();
        return false;
    }
    
    if (!phone.value.trim()) {
        showNotification('Veuillez entrer votre numéro de téléphone', 'error');
        phone.focus();
        return false;
    }
    
    if (!address.value.trim()) {
        showNotification('Veuillez entrer votre adresse', 'error');
        address.focus();
        return false;
    }
    
    // Sauvegarder les données
    const formData = new FormData(document.getElementById('bookingForm'));
    bookingData.contact = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        smsNotifications: formData.get('smsNotifications') === 'on'
    };
    
    console.log('✅ Données contact validées:', bookingData.contact);
    updateSidebar();
    return true;
}

function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (progressBar) {
        const progress = (currentStep / 5) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    if (progressSteps) {
        progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index + 1 < currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
            }
        });
    }
}

function updateSidebar() {
    const sidebarSummary = document.getElementById('sidebarSummary');
    
    if (!sidebarSummary || !bookingData.service) {
        return;
    }
    
    let html = `
        <div class="booking-detail-item">
            <strong>${bookingData.service.name}</strong>
            <div class="text-primary fw-bold">${bookingData.service.price} DT</div>
            <small class="text-muted">Durée: ${bookingData.service.duration}</small>
        </div>
    `;
    
    if (bookingData.pet.name) {
        html += `
            <div class="booking-detail-item mt-3">
                <strong>🐾 Animal</strong>
                <div>${bookingData.pet.name} (${bookingData.pet.type})</div>
                ${bookingData.pet.breed ? `<small class="text-muted">${bookingData.pet.breed}</small>` : ''}
                ${bookingData.pet.size ? `<small class="text-muted d-block">Taille: ${bookingData.pet.size}</small>` : ''}
            </div>
        `;
    }
    
    if (bookingData.datetime.date) {
        html += `
            <div class="booking-detail-item mt-3">
                <strong>📅 Rendez-vous</strong>
                <div>${bookingData.datetime.dateFormatted}</div>
                <small class="text-muted">à ${bookingData.datetime.timeFormatted}</small>
            </div>
        `;
    }
    
    if (bookingData.contact.firstName) {
        html += `
            <div class="booking-detail-item mt-3">
                <strong>👤 Contact</strong>
                <div>${bookingData.contact.firstName} ${bookingData.contact.lastName}</div>
                <small class="text-muted d-block">${bookingData.contact.email}</small>
                <small class="text-muted d-block">${bookingData.contact.phone}</small>
            </div>
        `;
    }
    
    sidebarSummary.innerHTML = html;
}

function setupDatePicker() {
    console.log('📅 Configuration du sélecteur de date...');
    
    const dateInput = document.getElementById('bookingDate');
    
    if (dateInput && typeof flatpickr !== 'undefined') {
        // Configuration Flatpickr
        flatpickr(dateInput, {
            locale: 'fr',
            dateFormat: 'Y-m-d',
            minDate: 'today',
            maxDate: new Date().fp_incr(90), // 90 jours dans le futur
            disable: [
                // Désactiver les dimanches (0 = dimanche)
                function(date) {
                    return date.getDay() === 0;
                }
            ],
            onChange: function(selectedDates, dateStr, instance) {
                // Validation automatique quand une date est sélectionnée
                if (selectedDates.length > 0) {
                    dateInput.classList.remove('is-invalid');
                    dateInput.classList.add('is-valid');
                    console.log('📅 Date sélectionnée:', dateStr);
                }
            },
            onReady: function(selectedDates, dateStr, instance) {
                // Ajouter des styles personnalisés
                const calendarContainer = instance.calendarContainer;
                if (calendarContainer) {
                    calendarContainer.style.zIndex = '9999';
                }
            }
        });
        
        console.log('✅ Flatpickr initialisé pour le champ date');
    } else {
        console.log('⚠️ Flatpickr non disponible, utilisation du sélecteur natif');
        
        // Configuration de base pour le sélecteur natif
        if (dateInput) {
            // Définir la date minimum à aujourd'hui
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            dateInput.min = todayStr;
            
            // Définir la date maximum à 90 jours
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 90);
            const maxDateStr = maxDate.toISOString().split('T')[0];
            dateInput.max = maxDateStr;
            
            console.log('✅ Sélecteur de date natif configuré');
        }
    }
}

function setupFormValidation() {
    console.log('📝 Configuration de la validation des formulaires...');
    
    // Validation en temps réel
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (field.type === 'email' && value && !validateEmail(value)) {
        isValid = false;
    }
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    console.log(`📢 Notification: ${message}`);
    
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.booking-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed booking-notification`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Fonctions de test accessibles depuis la console
window.testBooking = function(serviceType = 'complet') {
    console.log('🧪 Test du système de réservation...');
    selectService(serviceType);
};

window.goToStepTest = function(step) {
    console.log(`🧪 Test navigation vers étape ${step}...`);
    goToStep(step);
};

window.showBookingData = function() {
    console.log('📊 Données de réservation actuelles:', bookingData);
    return bookingData;
};

function setupFormSubmission() {
    console.log('📤 Configuration de la soumission du formulaire...');
    
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Vérifier que nous sommes à l'étape 5
            if (currentStep !== 5) {
                console.log('Soumission ignorée, pas à l\'étape 5');
                return;
            }
            
            // Vérifier l'acceptation des conditions
            const acceptTerms = document.getElementById('acceptTerms');
            if (!acceptTerms || !acceptTerms.checked) {
                showNotification('Veuillez accepter les conditions générales', 'error');
                if (acceptTerms) acceptTerms.focus();
                return;
            }
            
            console.log('🚀 Soumission de la réservation...');
            submitBooking();
        });
    }
}

async function submitBooking() {
    console.log('📋 Données complètes de réservation:', bookingData);
    
    showNotification('Envoi de votre réservation...', 'info');
    
    try {
        // Préparer les données pour l'API
        const user = JSON.parse(localStorage.getItem('groomgo_user') || '{}');
        const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
        
        const bookingPayload = {
            serviceId: bookingData.service.id || 1, // ID du service
            petName: bookingData.pet.name,
            petType: bookingData.pet.type,
            petBreed: bookingData.pet.breed || 'Non spécifié',
            petAge: bookingData.pet.age || 'Non spécifié',
            petSize: bookingData.pet.size || 'moyen',
            petWeight: bookingData.pet.weight || 'Non spécifié',
            scheduledDate: bookingData.datetime.date,
            scheduledTime: bookingData.datetime.time,
            address: bookingData.contact.address || 'Non spécifiée',
            specialInstructions: bookingData.pet.notes || '',
            totalPrice: calculateTotalPrice(),
            contactPhone: bookingData.contact.phone || user.phone,
            contactEmail: bookingData.contact.email || user.email,
            contactName: bookingData.contact.name || user.name
        };
        
        // Détecter si on est en mode local ou serveur
        const isLocalFile = window.location.protocol === 'file:';
        let apiSuccess = false;
        
        if (!isLocalFile) {
            // Mode serveur - essayer l'API
            try {
                const response = await fetch('http://localhost:3000/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify(bookingPayload)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    const bookingId = result.data?.booking?.id || 'GG' + Date.now().toString().slice(-6);
                    apiSuccess = true;
                    
                    // Créer l'objet de réservation complet
                    const completeBooking = {
                        id: bookingId,
                        service: bookingData.service,
                        pet: bookingData.pet,
                        datetime: bookingData.datetime,
                        contact: bookingData.contact,
                        status: 'pending',
                        timestamp: new Date().toISOString(),
                        createdAt: new Date().toLocaleDateString('fr-FR'),
                        totalPrice: calculateTotalPrice()
                    };
                    
                    // Sauvegarder dans localStorage
                    saveBookingToLocalStorage(completeBooking);
                    
                    showNotification('Réservation envoyée avec succès!', 'success');
                    showBookingConfirmation(bookingId);
                    
                    console.log('✅ Réservation confirmée avec l\'ID:', bookingId);
                    return;
                }
            } catch (apiError) {
                console.log('API non disponible, sauvegarde locale');
            }
        }
        
        // Si pas d'API ou échec, sauvegarder localement
        if (!apiSuccess) {
            const bookingId = 'GG' + Date.now().toString().slice(-6);
            
            const completeBooking = {
                id: bookingId,
                service: bookingData.service,
                pet: bookingData.pet,
                datetime: bookingData.datetime,
                contact: bookingData.contact,
                status: 'pending',
                timestamp: new Date().toISOString(),
                createdAt: new Date().toLocaleDateString('fr-FR'),
                totalPrice: calculateTotalPrice()
            };
            
            saveBookingToLocalStorage(completeBooking);
            showNotification('Réservation enregistrée avec succès!', 'success');
            showBookingConfirmation(bookingId);
            
            console.log('✅ Réservation sauvegardée localement avec l\'ID:', bookingId);
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:', error);
        
        // Sauvegarder localement en cas d'erreur
        const bookingId = 'GG' + Date.now().toString().slice(-6);
        const completeBooking = {
            id: bookingId,
            service: bookingData.service,
            pet: bookingData.pet,
            datetime: bookingData.datetime,
            contact: bookingData.contact,
            status: 'pending',
            timestamp: new Date().toISOString(),
            createdAt: new Date().toLocaleDateString('fr-FR'),
            totalPrice: calculateTotalPrice()
        };
        
        saveBookingToLocalStorage(completeBooking);
        showNotification('Réservation enregistrée (mode hors ligne)', 'info');
        showBookingConfirmation(bookingId);
    }
}

function calculateTotalPrice() {
    let total = bookingData.service.price;
    
    // Ajouter supplément taille si applicable
    if (bookingData.pet.size) {
        const sizePrices = {
            'petit': 0,
            'moyen': 15,
            'grand': 25,
            'tres-grand': 40
        };
        total += sizePrices[bookingData.pet.size] || 0;
    }
    
    return total;
}

function saveBookingToLocalStorage(booking) {
    try {
        // Récupérer les réservations existantes
        const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        // Ajouter la nouvelle réservation
        existingBookings.push(booking);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('bookings', JSON.stringify(existingBookings));
        
        console.log('📊 Réservations totales:', existingBookings.length);
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        showNotification('Erreur lors de la sauvegarde de la réservation', 'error');
    }
}

function showBookingConfirmation(bookingId) {
    const bookingForm = document.querySelector('.booking-form');
    
    if (bookingForm) {
        bookingForm.innerHTML = `
            <div class="text-center py-5">
                <div class="success-icon mb-4">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 class="text-success mb-3">Réservation Confirmée!</h3>
                <p class="lead mb-4">Votre réservation a été enregistrée avec succès.</p>
                
                <div class="booking-confirmation-details">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Détails de votre réservation</h5>
                            <div class="row text-start">
                                <div class="col-md-6">
                                    <p><strong>N° de réservation:</strong> ${bookingId}</p>
                                    <p><strong>Service:</strong> ${bookingData.service.name}</p>
                                    <p><strong>Animal:</strong> ${bookingData.pet.name} (${bookingData.pet.type})</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Date:</strong> ${bookingData.datetime.dateFormatted}</p>
                                    <p><strong>Heure:</strong> ${bookingData.datetime.timeFormatted}</p>
                                    <p><strong>Prix total:</strong> ${calculateTotalPrice()} DT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <a href="index.html" class="btn btn-primary">Retour à l'accueil</a>
                </div>
            </div>
        `;
    }
    
    // Cacher la barre de progression
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
}

console.log('📚 Fonctions de test disponibles:');
console.log('- testBooking("complet") : Tester la sélection de service');
console.log('- goToStepTest(2) : Aller à une étape spécifique');
console.log('- showBookingData() : Afficher les données actuelles');
