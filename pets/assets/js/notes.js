// Notes and Reviews Management
let reviews = [];
let currentRating = 0;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Page des notes initialisée');
    
    initializeStarRating();
    loadReviews();
    updateRatingOverview();
    
    // Form submission
    document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmission);
});

// Initialize star rating system
function initializeStarRating() {
    const stars = document.querySelectorAll('#starRating .fa-star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            setRating(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    
    document.getElementById('starRating').addEventListener('mouseleave', function() {
        highlightStars(currentRating);
    });
}

// Set rating
function setRating(rating) {
    currentRating = rating;
    document.getElementById('rating').value = rating;
    highlightStars(rating);
    console.log('⭐ Note sélectionnée:', rating);
}

// Highlight stars
function highlightStars(rating) {
    const stars = document.querySelectorAll('#starRating .fa-star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
            star.style.color = '#fbbf24';
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
            star.style.color = '#d1d5db';
        }
    });
}

// Handle review submission
async function handleReviewSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reviewData = {
        id: 'review_' + Date.now(),
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        serviceType: formData.get('serviceType'),
        rating: parseInt(formData.get('rating')),
        reviewText: formData.get('reviewText'),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('fr-FR'),
        approved: true // Auto-approuvé pour la démo
    };
    
    console.log('📝 Nouvelle évaluation:', reviewData);
    
    // Validation
    if (!reviewData.clientName || !reviewData.rating || !reviewData.reviewText) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    if (reviewData.rating < 1 || reviewData.rating > 5) {
        showNotification('Veuillez sélectionner une note entre 1 et 5 étoiles', 'error');
        return;
    }
    
    try {
        // Sauvegarder localement
        await saveReview(reviewData);
        
        // Essayer de sauvegarder sur le serveur
        await saveReviewToServer(reviewData);
        
        // Réinitialiser le formulaire
        e.target.reset();
        setRating(0);
        
        // Recharger les avis
        loadReviews();
        updateRatingOverview();
        
        // Afficher le modal de succès
        showSuccessModal();
        
        console.log('✅ Évaluation sauvegardée avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        showNotification('Erreur lors de la publication de l\'avis', 'error');
    }
}

// Save review locally
async function saveReview(reviewData) {
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    existingReviews.push(reviewData);
    localStorage.setItem('reviews', JSON.stringify(existingReviews));
    
    console.log('💾 Avis sauvegardé localement');
}

// Save review to server
async function saveReviewToServer(reviewData) {
    const isLocalFile = window.location.protocol === 'file:';
    if (isLocalFile) {
        console.log('📁 Mode fichier local - Pas d\'envoi serveur');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        
        if (response.ok) {
            console.log('🌐 Avis sauvegardé sur le serveur');
        } else {
            console.log('⚠️ Serveur non disponible - Sauvegarde locale uniquement');
        }
    } catch (error) {
        console.log('⚠️ Erreur serveur - Sauvegarde locale uniquement');
    }
}

// Default realistic seed reviews
const defaultSeedReviews = [
    {
        id: 'review_seed_1',
        clientName: 'Yassine Ben Romdhane',
        clientEmail: 'yassine@example.com',
        serviceType: 'Toilettage Complet',
        rating: 5,
        reviewText: "Service absolument impeccable directement au bas de ma résidence à La Marsa ! Mon Golden Retriever Charlie est sorti métamorphosé, poil soyeux et détendu. Plus besoin d'attendre des heures en salon.",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        date: 'Il y a 2 jours',
        approved: true
    },
    {
        id: 'review_seed_2',
        clientName: 'Sonia Karray',
        clientEmail: 'sonia@example.com',
        serviceType: 'Demi-Complet',
        rating: 5,
        reviewText: "Superbe expérience pour mon chat Persan à Ennasr 2. Le van climatisé est d'une propreté chirurgicale et le toiletteur a une patience infinie. Recommandé à 100% !",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        date: 'Il y a 5 jours',
        approved: true
    },
    {
        id: 'review_seed_3',
        clientName: 'Mehdi Triki',
        clientEmail: 'mehdi@example.com',
        serviceType: 'Toilettage Complet',
        rating: 5,
        reviewText: "Concept révolutionnaire en Tunisie ! Ils sont venus au Lac 2 à l'heure pile. Matériel haut de gamme, table hydraulique, shampoing hypoallergénique. Top niveau.",
        timestamp: new Date(Date.now() - 86400000 * 9).toISOString(),
        date: 'Il y a 9 jours',
        approved: true
    },
    {
        id: 'review_seed_4',
        clientName: 'Leila Mansour',
        clientEmail: 'leila@example.com',
        serviceType: 'Baignoire & Bain',
        rating: 4,
        reviewText: "Très bon bain complet pour mon caniche après une sortie plage à Carthage. Séchage et brossage soignés, personnel très poli et bienveillant.",
        timestamp: new Date(Date.now() - 86400000 * 14).toISOString(),
        date: 'Il y a 2 semaines',
        approved: true
    },
    {
        id: 'review_seed_5',
        clientName: 'Hamza Trabelsi',
        clientEmail: 'hamza@example.com',
        serviceType: 'Coupe Griffes / Soins',
        rating: 5,
        reviewText: "Coupe de griffes et nettoyage des oreilles sans aucun stress pour mon chiot Husky à Menzah 9. Toiletteurs ponctuels et passionnés.",
        timestamp: new Date(Date.now() - 86400000 * 20).toISOString(),
        date: 'Il y a 3 semaines',
        approved: true
    }
];

// Load reviews
async function loadReviews() {
    try {
        // Charger depuis localStorage
        let localReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        
        // Essayer de charger depuis le serveur
        let serverReviews = [];
        const isLocalFile = window.location.protocol === 'file:';
        
        if (!isLocalFile) {
            try {
                const response = await fetch('http://localhost:3000/api/reviews');
                if (response.ok) {
                    const result = await response.json();
                    serverReviews = result.data || [];
                }
            } catch (error) {
                console.log('⚠️ Serveur non disponible - Utilisation des données locales');
            }
        }
        
        // Si aucun avis n'est encore enregistré, initialiser avec les avis modèles
        if (localReviews.length === 0 && serverReviews.length === 0) {
            localReviews = defaultSeedReviews;
            localStorage.setItem('reviews', JSON.stringify(localReviews));
        }
        
        // Combiner les avis (serveur + local)
        const allReviews = [...serverReviews, ...localReviews];
        
        // Supprimer les doublons par ID
        const uniqueReviews = allReviews.filter((review, index, self) => 
            index === self.findIndex(r => r.id === review.id)
        );
        
        // Trier par date (plus récents d'abord)
        reviews = uniqueReviews.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        console.log('📋 Avis chargés:', reviews.length);
        displayReviews();
        updateRatingOverview();
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des avis:', error);
    }
}

// Display reviews
function displayReviews() {
    const container = document.getElementById('reviewsContainer');
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-star-half-alt"></i>
                <h3>Aucun avis pour le moment</h3>
                <p>Soyez le premier à laisser un avis sur nos services !</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        ${review.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div class="reviewer-details">
                        <h4>${review.clientName}</h4>
                        ${review.serviceType ? `<span class="service-type">${review.serviceType}</span>` : ''}
                    </div>
                </div>
                <div class="review-meta">
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                    <div class="review-date">${review.date}</div>
                </div>
            </div>
            <div class="review-content">
                <p>${review.reviewText}</p>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Avis affichés:', reviews.length);
}

// Generate stars HTML
function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

// Update rating overview
function updateRatingOverview() {
    if (reviews.length === 0) {
        document.getElementById('averageRating').textContent = '0.0';
        document.getElementById('totalReviews').textContent = '0';
        document.getElementById('averageStars').innerHTML = generateStars(0);
        return;
    }
    
    // Calculer la moyenne
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    // Compter les évaluations par étoile
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        ratingCounts[review.rating]++;
    });
    
    // Mettre à jour l'affichage
    document.getElementById('averageRating').textContent = averageRating;
    document.getElementById('totalReviews').textContent = reviews.length;
    document.getElementById('averageStars').innerHTML = generateStars(Math.round(averageRating));
    
    // Mettre à jour les barres de progression
    for (let i = 1; i <= 5; i++) {
        const count = ratingCounts[i];
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        
        document.getElementById(`count${i}`).textContent = count;
        document.getElementById(`stars${i}`).style.width = percentage + '%';
    }
    
    console.log('📊 Vue d\'ensemble mise à jour - Moyenne:', averageRating);
}

// Show success modal
function showSuccessModal() {
    const modalEl = document.getElementById('successModal');
    if (window.bootstrap && bootstrap.Modal) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.show();
    } else {
        modalEl.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    const modalEl = document.getElementById('successModal');
    if (window.bootstrap && bootstrap.Modal) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    } else {
        modalEl.style.display = 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Afficher avec animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Get average rating (pour utilisation externe)
function getAverageRating() {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
}

// Get reviews count (pour utilisation externe)
function getReviewsCount() {
    return reviews.length;
}

// Export functions for admin dashboard
window.getAverageRating = getAverageRating;
window.getReviewsCount = getReviewsCount;

// Create sample reviews for demo
function createSampleReviews() {
    const sampleReviews = [
        {
            id: 'sample_1',
            clientName: 'Ahmed Ben Ali',
            serviceType: 'Toilettage Complet',
            rating: 5,
            reviewText: 'Service excellent ! Mon chien était très propre et sentait bon. L\'équipe est très professionnelle.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            date: new Date(Date.now() - 86400000).toLocaleDateString('fr-FR'),
            approved: true
        },
        {
            id: 'sample_2',
            clientName: 'Sarah Mansouri',
            serviceType: 'Demi-Complet',
            rating: 4,
            reviewText: 'Très bon service, ponctuel et soigneux. Je recommande vivement !',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            date: new Date(Date.now() - 172800000).toLocaleDateString('fr-FR'),
            approved: true
        },
        {
            id: 'sample_3',
            clientName: 'Mohamed Trabelsi',
            serviceType: 'Baignoire',
            rating: 5,
            reviewText: 'Mon chat était très stressé mais l\'équipe a su le rassurer. Résultat parfait !',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            date: new Date(Date.now() - 259200000).toLocaleDateString('fr-FR'),
            approved: true
        }
    ];
    
    localStorage.setItem('reviews', JSON.stringify(sampleReviews));
    console.log('✅ Avis d\'exemple créés');
    
    loadReviews();
    updateRatingOverview();
}

// Function available in console for testing
window.createSampleReviews = createSampleReviews;
