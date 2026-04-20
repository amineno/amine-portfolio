// Adoption Page JavaScript

// Sample animals data
const animals = [
    {
        id: 1,
        name: "Max",
        type: "chien",
        age: "jeune",
        ageText: "2 ans",
        size: "grand",
        sizeText: "Grand",
        breed: "Berger Allemand",
        gender: "Mâle",
        image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=500&h=400&fit=crop",
        description: "Max est un chien énergique et affectueux qui adore jouer et faire de longues promenades.",
        vaccinated: true,
        sterilized: true,
        personality: ["Énergique", "Affectueux", "Joueur"],
        goodWith: ["Enfants", "Autres chiens"]
    },
    {
        id: 2,
        name: "Luna",
        type: "chat",
        age: "bebe",
        ageText: "6 mois",
        size: "petit",
        sizeText: "Petit",
        breed: "Européen",
        gender: "Femelle",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop",
        description: "Luna est une chatte douce et câline qui aime les moments de tendresse et les siestes au soleil.",
        vaccinated: true,
        sterilized: false,
        personality: ["Calme", "Câline", "Indépendante"],
        goodWith: ["Enfants", "Autres chats"]
    },
    {
        id: 3,
        name: "Rocky",
        type: "chien",
        age: "adulte",
        ageText: "5 ans",
        size: "moyen",
        sizeText: "Moyen",
        breed: "Labrador",
        gender: "Mâle",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop",
        description: "Rocky est un chien loyal et protecteur, parfait pour une famille active.",
        vaccinated: true,
        sterilized: true,
        personality: ["Loyal", "Protecteur", "Intelligent"],
        goodWith: ["Enfants", "Familles"]
    },
    {
        id: 4,
        name: "Mimi",
        type: "chat",
        age: "jeune",
        ageText: "1 an",
        size: "petit",
        sizeText: "Petit",
        breed: "Siamois",
        gender: "Femelle",
        image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500&h=400&fit=crop",
        description: "Mimi est une chatte curieuse et joueuse qui adore explorer et chasser les jouets.",
        vaccinated: true,
        sterilized: true,
        personality: ["Curieuse", "Joueuse", "Vocale"],
        goodWith: ["Adultes"]
    },
    {
        id: 5,
        name: "Buddy",
        type: "chien",
        age: "senior",
        ageText: "8 ans",
        size: "moyen",
        sizeText: "Moyen",
        breed: "Golden Retriever",
        gender: "Mâle",
        image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=500&h=400&fit=crop",
        description: "Buddy est un chien calme et sage, parfait pour une famille tranquille.",
        vaccinated: true,
        sterilized: true,
        personality: ["Calme", "Sage", "Affectueux"],
        goodWith: ["Enfants", "Seniors", "Autres chiens"]
    },
    {
        id: 6,
        name: "Félix",
        type: "chat",
        age: "adulte",
        ageText: "4 ans",
        size: "moyen",
        sizeText: "Moyen",
        breed: "Maine Coon",
        gender: "Mâle",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=400&fit=crop",
        description: "Félix est un chat majestueux et doux, qui aime la compagnie et les câlins.",
        vaccinated: true,
        sterilized: true,
        personality: ["Doux", "Sociable", "Majestueux"],
        goodWith: ["Enfants", "Autres chats", "Chiens"]
    }
];

// Favorites management
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayAnimals(animals);
    setupFilters();
    setupFavorites();
});

// Display animals
function displayAnimals(animalsToDisplay) {
    const grid = document.getElementById('adoptionGrid');
    const noResults = document.getElementById('noResults');
    
    if (animalsToDisplay.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    grid.innerHTML = animalsToDisplay.map(animal => createAnimalCard(animal)).join('');
    
    // Add event listeners
    setupCardEventListeners();
}

// Create animal card HTML
function createAnimalCard(animal) {
    const isFavorite = favorites.includes(animal.id);
    
    return `
        <div class="col-md-6 col-lg-4" data-animal-id="${animal.id}">
            <div class="adoption-card">
                <div class="adoption-card-image">
                    <img src="${animal.image}" alt="${animal.name}">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${animal.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <span class="adoption-badge">${animal.type === 'chien' ? 'Chien' : 'Chat'}</span>
                </div>
                <div class="adoption-card-body">
                    <h3 class="adoption-card-title">${animal.name}</h3>
                    <div class="adoption-card-info">
                        <span class="info-item">
                            <i class="fas fa-birthday-cake"></i>
                            ${animal.ageText}
                        </span>
                        <span class="info-item">
                            <i class="fas fa-ruler-vertical"></i>
                            ${animal.sizeText}
                        </span>
                        <span class="info-item">
                            <i class="fas fa-venus-mars"></i>
                            ${animal.gender}
                        </span>
                    </div>
                    <p class="adoption-card-description">${animal.description}</p>
                    <div class="adoption-card-footer">
                        <button class="btn-adopt" data-id="${animal.id}">
                            <i class="fas fa-heart me-2"></i>Adopter
                        </button>
                        <button class="btn-details" data-id="${animal.id}">
                            <i class="fas fa-info-circle me-2"></i>Détails
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup card event listeners
function setupCardEventListeners() {
    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(parseInt(this.dataset.id));
        });
    });
    
    // Adopt buttons
    document.querySelectorAll('.btn-adopt').forEach(btn => {
        btn.addEventListener('click', function() {
            const animal = animals.find(a => a.id === parseInt(this.dataset.id));
            showAdoptionForm(animal);
        });
    });
    
    // Details buttons
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const animal = animals.find(a => a.id === parseInt(this.dataset.id));
            showAnimalDetails(animal);
        });
    });
}

// Toggle favorite
function toggleFavorite(animalId) {
    const index = favorites.indexOf(animalId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(animalId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update UI
    const btn = document.querySelector(`.favorite-btn[data-id="${animalId}"]`);
    btn.classList.toggle('active');
}

// Setup filters
function setupFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const ageFilter = document.getElementById('ageFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    const resetBtn = document.getElementById('resetFilters');
    
    function applyFilters() {
        const type = typeFilter.value;
        const age = ageFilter.value;
        const size = sizeFilter.value;
        
        let filtered = animals;
        
        if (type !== 'all') {
            filtered = filtered.filter(a => a.type === type);
        }
        
        if (age !== 'all') {
            filtered = filtered.filter(a => a.age === age);
        }
        
        if (size !== 'all') {
            filtered = filtered.filter(a => a.size === size);
        }
        
        displayAnimals(filtered);
    }
    
    typeFilter.addEventListener('change', applyFilters);
    ageFilter.addEventListener('change', applyFilters);
    sizeFilter.addEventListener('change', applyFilters);
    
    resetBtn.addEventListener('click', function() {
        typeFilter.value = 'all';
        ageFilter.value = 'all';
        sizeFilter.value = 'all';
        displayAnimals(animals);
    });
}

// Show animal details in modal
function showAnimalDetails(animal) {
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <img src="${animal.image}" alt="${animal.name}" class="animal-detail-image">
        
        <div class="detail-section">
            <h5><i class="fas fa-paw"></i> Informations générales</h5>
            <ul class="detail-list">
                <li><strong>Nom:</strong> <span>${animal.name}</span></li>
                <li><strong>Race:</strong> <span>${animal.breed}</span></li>
                <li><strong>Âge:</strong> <span>${animal.ageText}</span></li>
                <li><strong>Taille:</strong> <span>${animal.sizeText}</span></li>
                <li><strong>Sexe:</strong> <span>${animal.gender}</span></li>
            </ul>
        </div>
        
        <div class="detail-section">
            <h5><i class="fas fa-syringe"></i> Santé</h5>
            <ul class="detail-list">
                <li><strong>Vacciné:</strong> <span>${animal.vaccinated ? '✅ Oui' : '❌ Non'}</span></li>
                <li><strong>Stérilisé:</strong> <span>${animal.sterilized ? '✅ Oui' : '❌ Non'}</span></li>
            </ul>
        </div>
        
        <div class="detail-section">
            <h5><i class="fas fa-smile"></i> Personnalité</h5>
            <p>${animal.personality.map(p => `<span class="badge bg-primary me-2">${p}</span>`).join('')}</p>
        </div>
        
        <div class="detail-section">
            <h5><i class="fas fa-users"></i> Compatible avec</h5>
            <p>${animal.goodWith.map(g => `<span class="badge bg-success me-2">${g}</span>`).join('')}</p>
        </div>
        
        <div class="detail-section">
            <h5><i class="fas fa-info-circle"></i> Description</h5>
            <p>${animal.description}</p>
        </div>
        
        <div class="text-center mt-4">
            <button class="btn btn-primary btn-lg" onclick="showAdoptionForm(${JSON.stringify(animal).replace(/"/g, '&quot;')})">
                <i class="fas fa-heart me-2"></i>Je veux adopter ${animal.name}
            </button>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('adoptionModal'));
    modal.show();
}

// Show adoption form
function showAdoptionForm(animal) {
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="text-center mb-4">
            <img src="${animal.image}" alt="${animal.name}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%; border: 4px solid #3b82f6;">
            <h4 class="mt-3">Demande d'adoption pour ${animal.name}</h4>
        </div>
        
        <form id="adoptionForm">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Prénom *</label>
                    <input type="text" class="form-control" name="firstName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Nom *</label>
                    <input type="text" class="form-control" name="lastName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" name="email" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Téléphone *</label>
                    <input type="tel" class="form-control" name="phone" required>
                </div>
                <div class="col-12">
                    <label class="form-label">Adresse *</label>
                    <input type="text" class="form-control" name="address" required>
                </div>
                <div class="col-12">
                    <label class="form-label">Pourquoi souhaitez-vous adopter ${animal.name} ? *</label>
                    <textarea class="form-control" name="reason" rows="4" required></textarea>
                </div>
                <div class="col-12">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="termsCheck" required>
                        <label class="form-check-label" for="termsCheck">
                            J'accepte les conditions d'adoption et je m'engage à prendre soin de ${animal.name}
                        </label>
                    </div>
                </div>
                <div class="col-12 text-center">
                    <button type="submit" class="btn btn-primary btn-lg">
                        <i class="fas fa-paper-plane me-2"></i>Envoyer ma demande
                    </button>
                </div>
            </div>
        </form>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('adoptionModal'));
    modal.show();
    
    // Handle form submission
    document.getElementById('adoptionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        
        // Create adoption request object
        const adoptionRequest = {
            id: Date.now(),
            animal: {
                id: animal.id,
                name: animal.name,
                type: animal.type,
                breed: animal.breed,
                image: animal.image
            },
            applicant: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                reason: formData.get('reason')
            },
            status: 'pending',
            date: new Date().toISOString(),
            dateFormatted: new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Save to localStorage
        let adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
        adoptionRequests.unshift(adoptionRequest);
        localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
        
        // Show success message
        modalContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-check-circle text-success" style="font-size: 5rem;"></i>
                <h3 class="mt-4">Demande envoyée avec succès!</h3>
                <p class="text-muted">Nous vous contacterons dans les plus brefs délais pour finaliser l'adoption de ${animal.name}.</p>
                <p class="text-muted"><small>Numéro de demande: #${adoptionRequest.id}</small></p>
                <button class="btn btn-primary mt-3" data-bs-dismiss="modal">Fermer</button>
            </div>
        `;
    });
}

// Setup favorites
function setupFavorites() {
    // Could add a favorites filter or page here
}
