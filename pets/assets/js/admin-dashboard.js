// Admin Dashboard JavaScript

// Global variables
let currentSection = 'overview';
let reservations = [];
let messages = [];
let selectedMessage = null;
let charts = {}; // Store chart instances

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadDashboardData();
    setupEventListeners();
    initializeCharts();
    initializeModals(); // Initialiser les modales
});

// Initialize Dashboard
function initializeDashboard() {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Set active section
    showSection('overview');
    
    // Load initial data
    updateStats();
    loadRecentActivity();
    
    // Set up real-time refresh (every 30 seconds)
    setInterval(() => {
        if (currentSection === 'overview') {
            updateStats();
            loadRecentActivity();
        } else if (currentSection === 'reservations') {
            loadReservations();
        } else if (currentSection === 'messages') {
            loadMessages();
        }
    }, 30000); // Refresh every 30 seconds
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Message search
    const messageSearch = document.getElementById('messageSearch');
    if (messageSearch) {
        messageSearch.addEventListener('input', filterMessages);
    }

    // Filter buttons
    const applyFiltersBtn = document.querySelector('.filters-bar .btn-primary');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Show Section
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
        
        // Load section-specific data
        loadSectionData(sectionName);
    }
}

// Load Section Data
function loadSectionData(section) {
    switch(section) {
        case 'overview':
            updateStats();
            loadRecentActivity();
            // Reinitialize charts when returning to overview
            setTimeout(() => {
                initializeCharts();
            }, 100);
            break;
        case 'reservations':
            loadReservations();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'adoptions':
            loadAdoptions();
            break;
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load data from API
        await updateStats();
        await loadReservations();
        await loadMessages();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update Statistics
async function updateStats() {
    try {
        // Charger les données locales
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        
        // Charger les avis clients
        const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        
        // Calculer les statistiques réelles locales
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const lastMonth = new Date().getMonth() - 1;
        const lastMonthYear = lastMonth < 0 ? thisYear - 1 : thisYear;
        const actualLastMonth = lastMonth < 0 ? 11 : lastMonth;
        
        let monthlyRevenue = 0;
        let lastMonthRevenue = 0;
        let pendingBookings = 0;
        let completedBookings = 0;
        let todayBookings = 0;
        let uniqueClients = new Set();
        let thisMonthBookings = 0;
        let lastMonthBookings = 0;
        let thisMonthClients = new Set();
        let lastMonthClients = new Set();
        
        // Calculer la note moyenne réelle
        let averageRating = 0;
        if (localReviews.length > 0) {
            const totalRating = localReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            averageRating = (totalRating / localReviews.length).toFixed(1);
        }
        
        console.log('⭐ Note moyenne calculée:', averageRating, 'sur', localReviews.length, 'avis');
        
        console.log('📊 Calcul des statistiques réelles:', localBookings.length, 'réservations');
        
        localBookings.forEach(booking => {
            const bookingDate = new Date(booking.timestamp || booking.createdAt);
            const bookingDateStr = bookingDate.toISOString().split('T')[0];
            const bookingMonth = bookingDate.getMonth();
            const bookingYear = bookingDate.getFullYear();
            
            // Identifier le client
            const clientId = booking.contact?.email || booking.contact?.name || 'anonymous';
            
            // Revenus et réservations ce mois
            if (bookingMonth === thisMonth && bookingYear === thisYear) {
                monthlyRevenue += booking.totalPrice || 0;
                thisMonthBookings++;
                thisMonthClients.add(clientId);
            }
            
            // Revenus et réservations mois dernier
            if (bookingMonth === actualLastMonth && bookingYear === lastMonthYear) {
                lastMonthRevenue += booking.totalPrice || 0;
                lastMonthBookings++;
                lastMonthClients.add(clientId);
            }
            
            // Réservations par statut
            if (booking.status === 'pending') {
                pendingBookings++;
            } else if (booking.status === 'completed') {
                completedBookings++;
            }
            
            // Réservations d'aujourd'hui
            if (bookingDateStr === today) {
                todayBookings++;
            }
            
            // Tous les clients uniques
            uniqueClients.add(clientId);
        });
        
        // Calculer les pourcentages de croissance
        const revenueGrowth = lastMonthRevenue > 0 ? 
            (((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(0) : 0;
        const bookingsGrowth = lastMonthBookings > 0 ? 
            (((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100).toFixed(0) : 0;
        const newClientsThisMonth = thisMonthClients.size - lastMonthClients.size;
        
        // Statistiques calculées
        const totalBookings = localBookings.length;
        const activeClients = uniqueClients.size;
        
        console.log('📊 Statistiques calculées:');
        console.log('- Total réservations:', totalBookings);
        console.log('- Revenus ce mois:', monthlyRevenue, 'DT');
        console.log('- Revenus mois dernier:', lastMonthRevenue, 'DT');
        console.log('- Croissance revenus:', revenueGrowth + '%');
        console.log('- Réservations ce mois:', thisMonthBookings);
        console.log('- Réservations mois dernier:', lastMonthBookings);
        console.log('- Croissance réservations:', bookingsGrowth + '%');
        console.log('- Clients actifs:', activeClients);
        console.log('- Nouveaux clients ce mois:', newClientsThisMonth);
        console.log('- En attente:', pendingBookings);
        console.log('- Terminées:', completedBookings);
        
        // Compter les messages non lus
        const unreadMessages = localMessages.filter(m => !m.read).length;
        
        // Essayer de charger depuis l'API
        const token = localStorage.getItem('adminToken');
        let apiStats = null;
        
        // Ne pas essayer l'API si on est en mode fichier local
        const isLocalFile = window.location.protocol === 'file:';
        if (!isLocalFile) {
            try {
                const response = await fetch('http://localhost:3000/api/admin/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    apiStats = result.data.stats;
                }
            } catch (apiError) {
                console.log('API non disponible, utilisation des statistiques locales');
            }
        }
        
        // Utiliser les stats API si disponibles, sinon locales
        if (apiStats) {
            document.getElementById('totalBookings').textContent = (apiStats.totalBookings || 0) + localBookings.length;
            document.getElementById('monthlyRevenue').textContent = ((apiStats.monthlyRevenue || 0) + monthlyRevenue) + ' DT';
            document.getElementById('activeClients').textContent = apiStats.totalUsers || localBookings.length;
            document.getElementById('avgRating').textContent = '4.8/5';
            
            // Update notification counts
            document.getElementById('messageCount').textContent = (apiStats.pendingMessages || 0) + unreadMessages;
            document.getElementById('notificationCount').textContent = (apiStats.pendingBookings || 0) + pendingBookings;
        } else {
            // Utiliser les données réelles locales
            console.log('📊 Mise à jour avec les données réelles');
            
            document.getElementById('totalBookings').textContent = totalBookings;
            document.getElementById('monthlyRevenue').textContent = monthlyRevenue + ' DT';
            document.getElementById('activeClients').textContent = activeClients;
            document.getElementById('avgRating').textContent = averageRating > 0 ? averageRating + '/5' : 'Aucun avis';
            
            // Mettre à jour les textes de croissance
            updateGrowthTexts(bookingsGrowth, revenueGrowth, newClientsThisMonth);
            
            console.log('📊 Note moyenne affichée:', averageRating > 0 ? averageRating + '/5' : 'Aucun avis');
            
            // Mettre à jour les compteurs de notifications
            const messageCountElement = document.getElementById('messageCount');
            const notificationCountElement = document.getElementById('notificationCount');
            
            if (messageCountElement) {
                messageCountElement.textContent = unreadMessages;
            }
            
            if (notificationCountElement) {
                notificationCountElement.textContent = pendingBookings;
                
                // Activer l'icône de notification si il y a des réservations en attente
                const notificationIcon = document.querySelector('.notification-icon');
                if (notificationIcon) {
                    if (pendingBookings > 0) {
                        notificationIcon.classList.add('has-notifications');
                        notificationIcon.setAttribute('title', `${pendingBookings} réservation${pendingBookings > 1 ? 's' : ''} en attente`);
                    } else {
                        notificationIcon.classList.remove('has-notifications');
                        notificationIcon.setAttribute('title', 'Aucune notification');
                    }
                }
            }
            
            console.log('✅ Statistiques mises à jour avec les données réelles');
            console.log('🔔 Notifications activées:', pendingBookings, 'en attente');
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Update Growth Texts
function updateGrowthTexts(bookingsGrowth, revenueGrowth, newClientsThisMonth) {
    console.log('📈 Mise à jour des textes de croissance...');
    
    // Mettre à jour le texte des réservations totales
    const bookingsChangeElement = document.querySelector('.stat-card:nth-child(1) .stat-change');
    if (bookingsChangeElement) {
        const isPositive = bookingsGrowth >= 0;
        const icon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
        const className = isPositive ? 'positive' : 'negative';
        const sign = isPositive ? '+' : '';
        
        bookingsChangeElement.className = `stat-change ${className}`;
        bookingsChangeElement.innerHTML = `
            <i class="fas ${icon}"></i> ${sign}${bookingsGrowth}% ce mois
        `;
        
        console.log('📊 Réservations:', sign + bookingsGrowth + '% ce mois');
    }
    
    // Mettre à jour le texte des revenus
    const revenueChangeElement = document.querySelector('.stat-card:nth-child(2) .stat-change');
    if (revenueChangeElement) {
        const isPositive = revenueGrowth >= 0;
        const icon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
        const className = isPositive ? 'positive' : 'negative';
        const sign = isPositive ? '+' : '';
        
        revenueChangeElement.className = `stat-change ${className}`;
        revenueChangeElement.innerHTML = `
            <i class="fas ${icon}"></i> ${sign}${revenueGrowth}% vs mois dernier
        `;
        
        console.log('💰 Revenus:', sign + revenueGrowth + '% vs mois dernier');
    }
    
    // Mettre à jour le texte des clients actifs
    const clientsChangeElement = document.querySelector('.stat-card:nth-child(3) .stat-change');
    if (clientsChangeElement) {
        const isPositive = newClientsThisMonth >= 0;
        const icon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
        const className = isPositive ? 'positive' : 'negative';
        const sign = isPositive ? '+' : '';
        
        clientsChangeElement.className = `stat-change ${className}`;
        
        if (newClientsThisMonth === 0) {
            clientsChangeElement.innerHTML = `
                <i class="fas fa-minus"></i> Aucun nouveau client
            `;
            clientsChangeElement.className = 'stat-change neutral';
        } else {
            clientsChangeElement.innerHTML = `
                <i class="fas ${icon}"></i> ${sign}${newClientsThisMonth} nouveau${Math.abs(newClientsThisMonth) > 1 ? 'x' : ''}
            `;
        }
        
        console.log('👥 Clients:', sign + newClientsThisMonth, 'nouveau' + (Math.abs(newClientsThisMonth) > 1 ? 'x' : ''));
    }
    
    console.log('✅ Textes de croissance mis à jour');
}

// Load Recent Activity
async function loadRecentActivity() {
    try {
        // Charger les dernières réservations depuis localStorage et API
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const activities = [];
        
        // Trier les réservations par date (plus récentes d'abord)
        const sortedBookings = localBookings.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt);
            const dateB = new Date(b.timestamp || b.createdAt);
            return dateB - dateA;
        });
        
        // Ajouter les 5 réservations les plus récentes
        sortedBookings.slice(0, 5).forEach(booking => {
            const bookingDate = new Date(booking.timestamp || booking.createdAt);
            const timeAgo = formatTimeAgo(bookingDate);
            
            let statusColor = '#10b981'; // vert par défaut
            let statusText = 'Nouvelle réservation';
            
            switch(booking.status) {
                case 'pending':
                    statusColor = '#f59e0b';
                    statusText = 'Réservation en attente';
                    break;
                case 'confirmed':
                    statusColor = '#10b981';
                    statusText = 'Réservation confirmée';
                    break;
                case 'completed':
                    statusColor = '#6366f1';
                    statusText = 'Service terminé';
                    break;
                case 'cancelled':
                    statusColor = '#ef4444';
                    statusText = 'Réservation annulée';
                    break;
            }
            
            activities.push({
                icon: 'fa-calendar-check',
                color: statusColor,
                title: statusText,
                description: `${booking.contact?.name || 'Client'} - ${booking.service?.name || 'Service'} (${booking.totalPrice || 0} DT)`,
                time: timeAgo
            });
        });
        
        console.log('📊 Activités récentes chargées:', activities.length);
        
        // Ajouter les messages récents depuis l'API
        const isLocalFile = window.location.protocol === 'file:';
        if (!isLocalFile) {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch('http://localhost:3000/api/messages/admin/messages?limit=3', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    result.data.messages.forEach(msg => {
                        activities.push({
                            icon: 'fa-envelope',
                            color: '#6366f1',
                            title: 'Nouveau message',
                            description: `${msg.senderName} - ${msg.subject}`,
                            time: formatTimeAgo(new Date(msg.createdAt))
                        });
                    });
                }
            } catch (error) {
                console.error('Error loading messages for activity:', error);
            }
        }
        
        // Si aucune activité, afficher des données par défaut
        if (activities.length === 0) {
            activities.push(
                {
                    icon: 'fa-info-circle',
                    color: '#6366f1',
                    title: 'Bienvenue',
                    description: 'Tableau de bord opérationnel',
                    time: 'Maintenant'
                }
            );
        }
        
        // Afficher les activités
        const activityList = document.getElementById('activityList');
        if (activityList) {
            if (activities.length === 0) {
                activityList.innerHTML = `
                    <div class="activity-item">
                        <div class="activity-icon" style="background-color: #6b7280">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="activity-content">
                            <h4>Aucune activité récente</h4>
                            <p>Les nouvelles réservations et messages apparaîtront ici</p>
                            <span class="activity-time">-</span>
                        </div>
                    </div>
                `;
            } else {
                activityList.innerHTML = activities.slice(0, 5).map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon" style="background-color: ${activity.color}">
                            <i class="fas ${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <h4>${activity.title}</h4>
                            <p>${activity.description}</p>
                            <span class="activity-time">${activity.time}</span>
                        </div>
                    </div>
                `).join('');
            }
            
            console.log('✅ Activités récentes affichées');
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

// Load Reservations
async function loadReservations() {
    try {
        // Charger les réservations depuis localStorage
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        console.log('📋 Chargement des réservations:', localBookings.length, 'trouvées');
        
        // Convertir les réservations locales au bon format
        const localReservations = localBookings.map(booking => {
            // Extraire le nom du client de différentes structures possibles
            let clientName = 'Client';
            if (booking.contact?.name) {
                clientName = booking.contact.name;
            } else if (booking.clientName) {
                clientName = booking.clientName;
            } else if (booking.name) {
                clientName = booking.name;
            } else if (booking.contact?.firstName && booking.contact?.lastName) {
                clientName = `${booking.contact.firstName} ${booking.contact.lastName}`;
            }
            
            // Extraire le nom du service
            let serviceName = 'Service';
            if (booking.service?.name) {
                serviceName = booking.service.name;
            } else if (booking.serviceName) {
                serviceName = booking.serviceName;
            } else if (booking.service) {
                serviceName = booking.service;
            }
            
            // Extraire la date
            let bookingDate = '';
            if (booking.datetime?.date) {
                bookingDate = booking.datetime.date;
            } else if (booking.datetime?.dateFormatted) {
                bookingDate = booking.datetime.dateFormatted;
            } else if (booking.date) {
                bookingDate = booking.date;
            }
            
            // Extraire l'heure
            let bookingTime = '';
            if (booking.datetime?.time) {
                bookingTime = booking.datetime.time;
            } else if (booking.datetime?.timeFormatted) {
                bookingTime = booking.datetime.timeFormatted;
            } else if (booking.time) {
                bookingTime = booking.time;
            }
            
            // Extraire le prix
            let bookingPrice = 0;
            if (booking.totalPrice) {
                bookingPrice = booking.totalPrice;
            } else if (booking.service?.price) {
                bookingPrice = booking.service.price;
            } else if (booking.price) {
                bookingPrice = booking.price;
            }
            
            return {
                id: booking.id,
                client: clientName,
                service: serviceName,
                date: bookingDate,
                time: bookingTime,
                status: booking.status || 'pending',
                price: bookingPrice,
                phone: booking.contact?.phone || booking.phone || '',
                email: booking.contact?.email || booking.email || '',
                isLocal: true // Marquer comme local
            };
        });
        
        // Essayer de charger depuis l'API aussi
        const isLocalFile = window.location.protocol === 'file:';
        let apiReservations = [];
        
        if (!isLocalFile) {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch('http://localhost:3000/api/admin/bookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    apiReservations = result.data.bookings.map(booking => ({
                    id: booking.id,
                    client: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Client inconnu',
                    service: booking.service ? booking.service.name : 'Service inconnu',
                    date: booking.scheduledDate,
                    time: booking.scheduledTime,
                    status: booking.status,
                    price: booking.totalPrice,
                    phone: booking.user ? booking.user.phone : '',
                    email: booking.user ? booking.user.email : '',
                    isLocal: false // Depuis l'API
                    }));
                }
            } catch (apiError) {
                console.log('API non disponible, utilisation des données locales');
            }
        }
        
        // Combiner les réservations (locales + API)
        // Éviter les doublons basés sur l'ID
        const combinedReservations = [...localReservations];
        apiReservations.forEach(apiRes => {
            if (!combinedReservations.find(r => r.id === apiRes.id)) {
                combinedReservations.push(apiRes);
            }
        });
        
        // Trier par date (plus récentes en premier)
        reservations = combinedReservations.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB - dateA;
        });
        
        if (reservations.length === 0) {
            // Use fallback data if API fails
            reservations = [
                {
                    id: 'RES001',
                    client: 'Ahmed Ben Ali',
                    service: 'Toilettage Complet',
                    date: '2024-01-15',
                    time: '10:00',
                    status: 'confirmed',
                    price: 80
                },
                {
                    id: 'RES002',
                    client: 'Sarah Mansouri',
                    service: 'Demi-Complet',
                    date: '2024-01-15',
                    time: '14:00',
                    status: 'pending',
                    price: 60
                },
                {
                    id: 'RES003',
                    client: 'Mohamed Trabelsi',
                    service: 'Baignoire',
                    date: '2024-01-16',
                    time: '09:00',
                    status: 'confirmed',
                    price: 40
                },
                {
                    id: 'RES004',
                    client: 'Leila Gharbi',
                    service: 'Toilettage Complet',
                    date: '2024-01-16',
                    time: '11:00',
                    status: 'completed',
                    price: 80
                },
                {
                    id: 'RES005',
                    client: 'Karim Souissi',
                    service: 'Demi-Complet',
                    date: '2024-01-17',
                    time: '15:00',
                    status: 'cancelled',
                    price: 60
                }
            ];
        }

        displayReservations(reservations);
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

// Display Reservations
function displayReservations(reservationsList) {
    console.log('📋 Affichage des réservations:', reservationsList.length);
    const tbody = document.getElementById('reservationsTableBody');
    
    if (!tbody) {
        console.error('❌ Element reservationsTableBody non trouvé');
        return;
    }
    
    if (reservationsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucune réservation trouvée</td></tr>';
        return;
    }
    
    tbody.innerHTML = reservationsList.map(reservation => `
            <tr style="background: white; transition: background 0.2s ease;" onmouseover="this.style.background='#e0f2fe'" onmouseout="this.style.background='white'">
                <td style="padding: 1rem; color: #1e3a8a; font-weight: 600; border-bottom: 1px solid #e2e8f0; width: 10%;">${reservation.id}</td>
                <td style="padding: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; width: 15%;">${reservation.client}</td>
                <td style="padding: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; width: 18%;">${reservation.service}</td>
                <td style="padding: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; width: 12%;">${reservation.date}</td>
                <td style="padding: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; width: 10%;">${reservation.time}</td>
                <td style="padding: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; width: 13%;"><span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span></td>
                <td style="padding: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; width: 10%;">${reservation.price} DT</td>
                <td style="padding: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; width: 12%;">
                    <div class="action-buttons">
                        <button class="btn-action btn-view" data-tooltip="Voir les détails" onclick="viewReservation('${reservation.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" data-tooltip="Modifier" onclick="editReservation('${reservation.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" data-tooltip="Supprimer" onclick="deleteReservation('${reservation.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }


// Get Status Text
function getStatusText(status) {
    const statusTexts = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        completed: 'Terminée',
        cancelled: 'Annulée'
    };
    return statusTexts[status] || status;
}

// Apply Filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;

    let filteredReservations = [...reservations];

    if (statusFilter !== 'all') {
        filteredReservations = filteredReservations.filter(r => r.status === statusFilter);
    }

    if (dateFilter) {
        filteredReservations = filteredReservations.filter(r => r.date === dateFilter);
    }

    if (serviceFilter !== 'all') {
        filteredReservations = filteredReservations.filter(r => 
            r.service.toLowerCase().includes(serviceFilter.toLowerCase())
        );
    }

    displayReservations(filteredReservations);
}

// Edit Reservation - Design Moderne
function editReservation(id) {
    console.log('🔧 Modification de la réservation:', id);
    
    // Recharger les réservations pour être sûr d'avoir les dernières données
    const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = localBookings.find(b => b.id === id);
    const reservation = reservations.find(r => r.id === id);
    
    if (!reservation && !booking) {
        console.error('❌ Réservation non trouvée:', id);
        showNotification('Réservation non trouvée', 'error');
        return;
    }
    
    // Utiliser les données les plus récentes
    const currentReservation = reservation || {
        id: booking.id,
        client: booking.contact?.name || 'Client',
        service: booking.service?.name || 'Service',
        date: booking.datetime?.date || booking.datetime?.dateFormatted,
        time: booking.datetime?.time || booking.datetime?.timeFormatted,
        status: booking.status || 'pending',
        price: booking.totalPrice || booking.service?.price || 0
    };
    
    console.log('📋 Réservation trouvée:', currentReservation);
    
    const modal = document.getElementById('editModal');
    const modalContent = document.getElementById('editModalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Modal non trouvé');
        return;
    }
    
    console.log('✅ Modal et modalContent trouvés');
    
    modalContent.innerHTML = `
        <form id="editReservationForm" class="edit-form">
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-user"></i> Nom du Client
                </label>
                <input type="text" class="form-input" id="editClient" value="${currentReservation.client}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-cut"></i> Service
                </label>
                <select class="form-select" id="editService" required>
                    <option value="Toilettage Complet" ${currentReservation.service === 'Toilettage Complet' ? 'selected' : ''}>Toilettage Complet</option>
                    <option value="Paquet Complet" ${currentReservation.service === 'Paquet Complet' ? 'selected' : ''}>Paquet Complet</option>
                    <option value="Paquet Demi-Complet" ${currentReservation.service === 'Paquet Demi-Complet' ? 'selected' : ''}>Paquet Demi-Complet</option>
                    <option value="Baignoire" ${currentReservation.service === 'Baignoire' ? 'selected' : ''}>Baignoire</option>
                </select>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-calendar"></i> Date
                    </label>
                    <input type="date" class="form-input" id="editDate" value="${currentReservation.date}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-clock"></i> Heure
                    </label>
                    <select class="form-select" id="editTime" required>
                        <option value="09:00" ${currentReservation.time === '09:00' ? 'selected' : ''}>09:00</option>
                        <option value="10:00" ${currentReservation.time === '10:00' ? 'selected' : ''}>10:00</option>
                        <option value="11:00" ${currentReservation.time === '11:00' ? 'selected' : ''}>11:00</option>
                        <option value="14:00" ${currentReservation.time === '14:00' ? 'selected' : ''}>14:00</option>
                        <option value="15:00" ${currentReservation.time === '15:00' ? 'selected' : ''}>15:00</option>
                        <option value="16:00" ${currentReservation.time === '16:00' ? 'selected' : ''}>16:00</option>
                    </select>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-info-circle"></i> Statut
                    </label>
                    <select class="form-select" id="editStatus" required>
                        <option value="pending" ${currentReservation.status === 'pending' ? 'selected' : ''}>En attente</option>
                        <option value="confirmed" ${currentReservation.status === 'confirmed' ? 'selected' : ''}>Confirmée</option>
                        <option value="completed" ${currentReservation.status === 'completed' ? 'selected' : ''}>Terminée</option>
                        <option value="cancelled" ${currentReservation.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-money-bill"></i> Prix (DT)
                    </label>
                    <input type="number" class="form-input" id="editPrice" value="${currentReservation.price}" min="0" step="5" required>
                </div>
            </div>
        </form>
        
        <div class="modal-actions">
            <button type="button" class="btn-modal btn-modal-primary" onclick="saveReservationEdit('${currentReservation.id}')">
                <i class="fas fa-save"></i> Sauvegarder
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

// Fonction pour fermer les modales - Version simple et efficace
function closeModal(modalId) {
    console.log('🚪 Fermeture de modale:', modalId || 'toutes');
    
    if (modalId) {
        // Fermer une modale spécifique
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none'; // Force hide
            console.log('✅ Modal fermée:', modalId);
        } else {
            console.error('❌ Modal non trouvée:', modalId);
        }
    } else {
        // Fermer toutes les modales
        const modals = ['viewModal', 'editModal', 'deleteModal'];
        modals.forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        });
        console.log('✅ Toutes les modales fermées');
    }
}

// Fonctions spécifiques pour chaque modale
function closeViewModal() {
    console.log('🔵 Fermeture viewModal');
    closeModal('viewModal');
}

function closeEditModal() {
    console.log('🟡 Fermeture editModal');
    closeModal('editModal');
}

function closeDeleteModal() {
    console.log('🔴 Fermeture deleteModal');
    closeModal('deleteModal');
}

// Fonctions globales pour fermer les modales
window.closeModal = closeModal;
window.closeViewModal = closeViewModal;
window.closeEditModal = closeEditModal;
window.closeDeleteModal = closeDeleteModal;

// Initialiser les modales de manière simple
function initializeModals() {
    console.log('🚀 Initialisation des modales...');
    
    // Attendre que le DOM soit prêt
    setTimeout(() => {
        const modals = ['viewModal', 'editModal', 'deleteModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                console.log('✅ Modal trouvée:', modalId);
                
                // Fermer en cliquant sur l'overlay
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        console.log('💆 Clic sur overlay:', modalId);
                        closeModal(modalId);
                    }
                });
            } else {
                console.error('❌ Modal non trouvée:', modalId);
            }
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                console.log('⌨️ Escape pressé');
                closeModal();
            }
        });
        
        console.log('✅ Modales initialisées');
    }, 100);
}

// Fonction de test pour déboguer les modales
window.testModal = function() {
    console.log('🧪 Test des modales:');
    
    const modals = ['viewModal', 'editModal', 'deleteModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        console.log(`Modal ${modalId}:`, modal ? '✅ Trouvée' : '❌ Non trouvée');
        if (modal) {
            console.log(`  - Classes:`, modal.className);
            console.log(`  - Style display:`, modal.style.display);
            console.log(`  - Visible:`, modal.classList.contains('show'));
            
            // Tester le bouton X
            const closeBtn = modal.querySelector('.modal-close');
            console.log(`  - Bouton X:`, closeBtn ? '✅ Trouvé' : '❌ Non trouvé');
            if (closeBtn) {
                console.log(`  - Onclick:`, closeBtn.getAttribute('onclick'));
            }
        }
    });
    
    console.log('Fonction closeModal:', typeof closeModal);
};

// Fonction pour tester la fermeture directe
window.testCloseModal = function(modalId) {
    console.log('🔴 Test fermeture:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        console.log('✅ Modal fermée:', modalId);
    } else {
        console.error('❌ Modal non trouvée:', modalId);
    }
};

// Fonction pour tester la sauvegarde
window.testSaveEdit = function() {
    console.log('💾 Test de sauvegarde...');
    
    // Vérifier si la modale d'édition est ouverte
    const editModal = document.getElementById('editModal');
    if (!editModal || !editModal.classList.contains('show')) {
        console.log('⚠️ Aucune modale d\'édition ouverte');
        return;
    }
    
    // Vérifier les champs du formulaire
    const fields = {
        client: document.getElementById('editClient'),
        service: document.getElementById('editService'),
        date: document.getElementById('editDate'),
        time: document.getElementById('editTime'),
        status: document.getElementById('editStatus'),
        price: document.getElementById('editPrice')
    };
    
    console.log('🔍 Vérification des champs:');
    Object.entries(fields).forEach(([name, field]) => {
        if (field) {
            console.log(`  ${name}: ${field.value}`);
        } else {
            console.error(`  ❌ ${name}: champ non trouvé`);
        }
    });
    
    console.log('Pour forcer la fermeture: testCloseModal("editModal")');
};

// Save Reservation Edit
async function saveReservationEdit(id) {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
        const newDate = document.getElementById('editDate').value;
        const newTime = document.getElementById('editTime').value;
        const newStatus = document.getElementById('editStatus').value;
        
        // Mettre à jour localement
        reservation.date = newDate;
        reservation.time = newTime;
        reservation.status = newStatus;
        
        // Mettre à jour dans localStorage
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localBookingIndex = localBookings.findIndex(b => b.id === id);
        if (localBookingIndex !== -1) {
            localBookings[localBookingIndex].datetime.date = newDate;
            localBookings[localBookingIndex].datetime.time = newTime;
            localBookings[localBookingIndex].status = newStatus;
            localStorage.setItem('bookings', JSON.stringify(localBookings));
        }
        
        // Essayer de mettre à jour via l'API si disponible
        const isLocalFile = window.location.protocol === 'file:';
        if (!isLocalFile) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`http://localhost:3000/api/admin/bookings/${id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        status: newStatus,
                        scheduledDate: newDate,
                        scheduledTime: newTime
                    })
                });
                
                if (response.ok) {
                    console.log('Réservation mise à jour sur le serveur');
                }
            } catch (error) {
                console.log('API non disponible, mise à jour locale uniquement');
            }
        }
        
        // Rafraîchir l'affichage
        displayReservations(reservations);
        closeModal();
        showNotification('Réservation mise à jour avec succès', 'success');
    }
}

// View Reservation - Design Moderne
function viewReservation(id) {
    console.log('👁️ Affichage des détails pour:', id);
    
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) {
        console.error('❌ Réservation non trouvée:', id);
        showNotification('Réservation non trouvée', 'error');
        return;
    }
    
    const modal = document.getElementById('viewModal');
    const modalContent = document.getElementById('viewModalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Modal non trouvé');
        return;
    }
    
    modalContent.innerHTML = `
        <div class="reservation-details">
            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">
                        <i class="fas fa-hashtag"></i> ID Réservation
                    </span>
                    <span class="detail-value">${reservation.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">
                        <i class="fas fa-user"></i> Client
                    </span>
                    <span class="detail-value">${reservation.client}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">
                        <i class="fas fa-cut"></i> Service
                    </span>
                    <span class="detail-value">${reservation.service}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">
                        <i class="fas fa-calendar"></i> Date
                    </span>
                    <span class="detail-value">${reservation.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">
                        <i class="fas fa-clock"></i> Heure
                    </span>
                    <span class="detail-value">${reservation.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">
                        <i class="fas fa-info-circle"></i> Statut
                    </span>
                    <span class="detail-value">
                        <span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">
                        <i class="fas fa-money-bill"></i> Prix
                    </span>
                    <span class="detail-value">${reservation.price} DT</span>
                </div>
            </div>
        </div>
        ${reservation.status === 'pending' ? `
            <div class="modal-actions">
                <button class="btn-modal btn-modal-primary" onclick="confirmReservation('${reservation.id}')">
                    <i class="fas fa-check"></i> Confirmer
                </button>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('show');
}

// Delete Reservation - Design Moderne
function deleteReservation(id) {
    console.log('🗑️ Demande de suppression pour:', id);
    
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) {
        console.error('❌ Réservation non trouvée:', id);
        showNotification('Réservation non trouvée', 'error');
        return;
    }
    
    const modal = document.getElementById('deleteModal');
    const modalContent = document.getElementById('deleteModalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Modal de suppression non trouvé');
        return;
    }
    
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 1rem;">
            <div style="background: #fee2e2; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #dc2626;"></i>
            </div>
            
            <h3 style="margin: 0 0 1rem; color: #1f2937;">Confirmer la suppression</h3>
            
            <p style="color: #6b7280; margin: 0 0 1.5rem; line-height: 1.5;">
                Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?
            </p>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 1rem; margin: 1.5rem 0; border-left: 4px solid #ef4444;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>ID:</strong> <span>${reservation.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>Client:</strong> <span>${reservation.client}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>Service:</strong> <span>${reservation.service}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <strong>Date:</strong> <span>${reservation.date} à ${reservation.time}</span>
                </div>
            </div>
            
            <p style="color: #dc2626; font-size: 0.875rem; margin: 0;">
                <i class="fas fa-info-circle"></i> Cette action est irréversible.
            </p>
        </div>
        
        <div class="modal-actions">
            <button class="btn-modal btn-modal-danger" onclick="confirmDeleteReservation('${reservation.id}')">
                <i class="fas fa-trash"></i> Supprimer définitivement
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

// Confirmer la suppression de réservation
async function confirmDeleteReservation(id) {
    console.log('🗑️ Confirmation de suppression pour:', id);
    
    try {
        // Supprimer de la liste des réservations
        const reservationIndex = reservations.findIndex(r => r.id === id);
        if (reservationIndex !== -1) {
            reservations.splice(reservationIndex, 1);
        }
        
        // Supprimer du localStorage
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const filteredBookings = localBookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(filteredBookings));
        
        // Essayer l'API si disponible
        const isLocalFile = window.location.protocol === 'file:';
        if (!isLocalFile) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`http://localhost:3000/api/admin/bookings/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    console.log('✅ Réservation supprimée sur le serveur');
                }
            } catch (apiError) {
                console.log('⚠️ API non disponible, suppression locale uniquement');
            }
        }
        
        // Fermer la modale
        closeModal('deleteModal');
        
        // Rafraîchir l'affichage
        console.log('🔄 Rafraîchissement de l\'affichage après suppression');
        displayReservations(reservations);
        
        showNotification('Réservation supprimée avec succès', 'success');
        console.log('✅ Réservation supprimée avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Save Reservation Edit - Fonction moderne
async function saveReservationEdit(id) {
    console.log('💾 Sauvegarde des modifications pour:', id);
    
    try {
        // Récupérer les valeurs du formulaire
        const client = document.getElementById('editClient').value;
        const service = document.getElementById('editService').value;
        const date = document.getElementById('editDate').value;
        const time = document.getElementById('editTime').value;
        const status = document.getElementById('editStatus').value;
        const price = parseFloat(document.getElementById('editPrice').value);
        
        // Validation
        if (!client || !service || !date || !time || !status || isNaN(price)) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // Mettre à jour la réservation
        const reservationIndex = reservations.findIndex(r => r.id === id);
        if (reservationIndex !== -1) {
            reservations[reservationIndex] = {
                ...reservations[reservationIndex],
                client,
                service,
                date,
                time,
                status,
                price
            };
        }
        
        // Mettre à jour dans localStorage
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localBookingIndex = localBookings.findIndex(b => b.id === id);
        if (localBookingIndex !== -1) {
            localBookings[localBookingIndex] = {
                ...localBookings[localBookingIndex],
                contact: { ...localBookings[localBookingIndex].contact, name: client },
                service: { ...localBookings[localBookingIndex].service, name: service },
                datetime: { ...localBookings[localBookingIndex].datetime, date, time },
                status,
                totalPrice: price
            };
            localStorage.setItem('bookings', JSON.stringify(localBookings));
        }
        
        // Afficher la notification de succès
        showNotification('Réservation modifiée avec succès', 'success');
        console.log('✅ Réservation modifiée avec succès');
        
        // Rafraîchir l'affichage
        displayReservations(reservations);
        
        // Fermer la modale avec une petite temporisation
        setTimeout(() => {
            const editModal = document.getElementById('editModal');
            if (editModal) {
                editModal.classList.remove('show');
                editModal.style.display = 'none';
                console.log('✅ Modale de modification fermée');
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Erreur lors de la modification:', error);
        showNotification('Erreur lors de la modification', 'error');
    }
}

// Confirm Reservation
async function confirmReservation(id) {
    try {
        // Mettre à jour localement d'abord
        const reservation = reservations.find(r => r.id === id);
        if (reservation) {
            reservation.status = 'confirmed';
            
            // Mettre à jour dans localStorage
            const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const localBookingIndex = localBookings.findIndex(b => b.id === id);
            if (localBookingIndex !== -1) {
                localBookings[localBookingIndex].status = 'confirmed';
                localStorage.setItem('bookings', JSON.stringify(localBookings));
            }
            
            // Essayer l'API si disponible
            const isLocalFile = window.location.protocol === 'file:';
            if (!isLocalFile) {
                try {
                    const token = localStorage.getItem('adminToken');
                    const response = await fetch(`http://localhost:3000/api/admin/bookings/${id}/status`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: 'confirmed' })
                    });
                    
                    if (response.ok) {
                        console.log('Réservation confirmée sur le serveur');
                    }
                } catch (apiError) {
                    console.log('API non disponible, confirmation locale uniquement');
                }
            }
            
            displayReservations(reservations);
            closeModal();
            showNotification('Réservation confirmée avec succès', 'success');
        }
    } catch (error) {
        console.error('Error confirming reservation:', error);
        showNotification('Erreur lors de la confirmation', 'error');
    }
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        console.log('✅ Modal fermé');
    }
}


// Load Messages
async function loadMessages() {
    try {
        // Charger les messages depuis localStorage d'abord
        const localMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        
        // Convertir les messages locaux au bon format
        const localFormattedMessages = localMessages.map(msg => ({
            id: msg.id,
            sender: msg.senderName,
            email: msg.senderEmail,
            phone: msg.senderPhone,
            subject: msg.subject,
            content: msg.message,
            serviceType: msg.serviceType || 'Toilettage',
            status: msg.status || 'unread',
            priority: msg.priority || 'normal',
            time: formatTimeAgo(new Date(msg.timestamp || msg.createdAt)),
            unread: msg.status !== 'read',
            adminReply: msg.adminReply,
            repliedAt: msg.repliedAt
        }));
        
        // Essayer de charger depuis l'API aussi
        const isLocalFile = window.location.protocol === 'file:';
        let apiMessages = [];
        
        if (!isLocalFile) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('http://localhost:3000/api/messages/admin/messages', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    apiMessages = result.data.messages.map(msg => ({
                        id: msg.id,
                        sender: msg.senderName,
                        email: msg.senderEmail,
                        phone: msg.senderPhone,
                        subject: msg.subject,
                        content: msg.message,
                        serviceType: msg.serviceType,
                        status: msg.status,
                        priority: msg.priority,
                        time: formatTimeAgo(new Date(msg.createdAt)),
                        unread: msg.status === 'unread',
                        adminReply: msg.adminReply,
                        repliedAt: msg.repliedAt
                    }));
                }
            } catch (apiError) {
                console.log('API non disponible, utilisation des messages locaux');
            }
        }
        
        // Combiner les messages (locaux + API)
        // Éviter les doublons basés sur l'ID
        messages = [...localFormattedMessages];
        apiMessages.forEach(apiMsg => {
            if (!messages.find(m => m.id === apiMsg.id)) {
                messages.push(apiMsg);
            }
        });
        
        // Trier par date (plus récents en premier)
        messages.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.createdAt || 0);
            const dateB = new Date(b.timestamp || b.createdAt || 0);
            return dateB - dateA;
        });
        
        // Compter les messages non lus
        const unreadCount = messages.filter(m => m.unread).length;
        const messageCountElement = document.getElementById('messageCount');
        if (messageCountElement) {
            messageCountElement.textContent = unreadCount || '0';
        }
        
        if (messages.length === 0) {
            // Use fallback data if API fails
            messages = [
                {
                    id: 1,
                    sender: 'Ahmed Ben Ali',
                    subject: 'Question sur les services',
                    content: 'Bonjour, je voudrais savoir si vous proposez des services de toilettage pour les chats persans?',
                    time: 'Il y a 2 heures',
                    unread: true
                },
                {
                    id: 2,
                    sender: 'Sarah Mansouri',
                    subject: 'Réservation urgente',
                    content: 'J\'ai besoin d\'un toilettage urgent pour mon chien demain. Est-ce possible?',
                    time: 'Il y a 5 heures',
                    unread: true
                },
                {
                    id: 3,
                    sender: 'Mohamed Trabelsi',
                    subject: 'Merci pour le service',
                    content: 'Je voulais vous remercier pour l\'excellent service. Mon chien est magnifique!',
                    time: 'Hier',
                    unread: false
                }
            ];
        }

        displayMessages(messages);
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' ans';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' mois';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' jours';
    
    interval = seconds / 3600;
    if (interval > 1) return 'Il y a ' + Math.floor(interval) + ' heures';
    
    interval = seconds / 60;
    if (interval > 1) return 'Il y a ' + Math.floor(interval) + ' minutes';
    
    return 'À l\'instant';
}

// Display Messages
function displayMessages(messagesList) {
    const messagesListEl = document.getElementById('messagesList');
    if (messagesListEl) {
        messagesListEl.innerHTML = messagesList.map(message => `
            <div class="message-item ${message.unread ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'active' : ''}" 
                 onclick="selectMessage('${message.id}')">
                <div class="message-sender">${message.sender}</div>
                <div class="message-preview">${message.subject}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `).join('');
    }

    // Update unread count
    const unreadCount = messages.filter(m => m.unread).length;
    document.getElementById('messageCount').textContent = unreadCount;
}

// Select Message
async function selectMessage(id) {
    selectedMessage = messages.find(m => m.id === id);
    if (selectedMessage) {
        // Mark as read
        if (selectedMessage.unread) {
            selectedMessage.unread = false;
            
            // Mettre à jour dans localStorage
            const localMessages = JSON.parse(localStorage.getItem('messages') || '[]');
            const msgIndex = localMessages.findIndex(m => m.id === id);
            if (msgIndex !== -1) {
                localMessages[msgIndex].status = 'read';
                localStorage.setItem('messages', JSON.stringify(localMessages));
            }
            
            // Essayer de marquer comme lu dans le backend si pas en mode local
            const isLocalFile = window.location.protocol === 'file:';
            if (!isLocalFile) {
                try {
                    const token = localStorage.getItem('adminToken');
                    await fetch(`http://localhost:3000/api/messages/admin/messages/${id}/read`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (error) {
                    console.error('Error marking message as read in backend:', error);
                }
            }
            
            displayMessages(messages);
        }
        
        // Update message content
        const messageHeader = document.getElementById('messageHeader');
        const messageBody = document.getElementById('messageBody');
        const messageReply = document.getElementById('messageReply');
        
        messageHeader.innerHTML = `
            <div class="message-sender-info">
                <h3>${selectedMessage.sender}</h3>
                <p>${selectedMessage.subject}</p>
                ${selectedMessage.email ? `<small class="text-muted"><i class="fas fa-envelope"></i> ${selectedMessage.email}</small><br>` : ''}
                ${selectedMessage.phone ? `<small class="text-muted"><i class="fas fa-phone"></i> ${selectedMessage.phone}</small>` : ''}
            </div>
        `;
        
        messageBody.innerHTML = `
            <div class="message-text">
                ${selectedMessage.content}
            </div>
            ${selectedMessage.serviceType ? `<div class="mt-2"><span class="badge bg-primary">Service: ${selectedMessage.serviceType}</span></div>` : ''}
            <div class="message-meta mt-3">
                <span>${selectedMessage.time}</span>
            </div>
            ${selectedMessage.adminReply ? `
                <div class="admin-reply mt-3 p-3 bg-light rounded">
                    <h6>Votre réponse:</h6>
                    <p>${selectedMessage.adminReply}</p>
                    <small class="text-muted">Envoyée le ${new Date(selectedMessage.repliedAt).toLocaleString()}</small>
                </div>
            ` : ''}
        `;
        
        messageReply.style.display = 'block';
    }
}

// Filter Messages
function filterMessages() {
    const searchTerm = document.getElementById('messageSearch').value.toLowerCase();
    const filtered = messages.filter(m => 
        m.sender.toLowerCase().includes(searchTerm) ||
        m.subject.toLowerCase().includes(searchTerm) ||
        m.content.toLowerCase().includes(searchTerm)
    );
    displayMessages(filtered);
}

// Send Reply
async function sendReply() {
    const replyText = document.getElementById('replyText').value;
    if (replyText && selectedMessage) {
        try {
            // Mettre à jour localement d'abord
            selectedMessage.adminReply = replyText;
            selectedMessage.repliedAt = new Date().toISOString();
            selectedMessage.status = 'replied';
            
            // Mettre à jour dans localStorage
            const localMessages = JSON.parse(localStorage.getItem('messages') || '[]');
            const msgIndex = localMessages.findIndex(m => m.id === selectedMessage.id);
            if (msgIndex !== -1) {
                localMessages[msgIndex].adminReply = replyText;
                localMessages[msgIndex].repliedAt = selectedMessage.repliedAt;
                localMessages[msgIndex].status = 'replied';
                localStorage.setItem('messages', JSON.stringify(localMessages));
            }
            
            // Essayer l'API seulement si pas en mode local
            const isLocalFile = window.location.protocol === 'file:';
            if (!isLocalFile) {
                try {
                    const token = localStorage.getItem('adminToken');
                    const response = await fetch(`http://localhost:3000/api/messages/admin/messages/${selectedMessage.id}/reply`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ reply: replyText })
                    });
                    
                    if (response.ok) {
                        console.log('Réponse envoyée au serveur');
                    }
                } catch (apiError) {
                    console.log('API non disponible, réponse sauvegardée localement');
                }
            }
            
            // Nettoyer le formulaire et rafraîchir l'affichage
            document.getElementById('replyText').value = '';
            selectMessage(selectedMessage.id); // Refresh display
            showNotification('Réponse envoyée avec succès', 'success');
            
        } catch (error) {
            console.error('Error sending reply:', error);
            showNotification('Erreur lors de l\'envoi de la réponse', 'error');
        }
    } else {
        showNotification('Veuillez saisir une réponse', 'warning');
    }
}

// Calculate Real Chart Data
function calculateChartData() {
    const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    console.log('📊 Calcul des données réelles pour les graphiques:', localBookings.length, 'réservations');
    
    // 1. Calcul des revenus par mois (6 derniers mois)
    const revenueData = [];
    const revenueLabels = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
        revenueLabels.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));
        
        let monthRevenue = 0;
        localBookings.forEach(booking => {
            const bookingDate = new Date(booking.timestamp || booking.createdAt);
            if (bookingDate.getMonth() === date.getMonth() && 
                bookingDate.getFullYear() === date.getFullYear()) {
                monthRevenue += booking.totalPrice || 0;
            }
        });
        revenueData.push(monthRevenue);
    }
    
    // 2. Calcul de la répartition des services
    const serviceStats = {};
    localBookings.forEach(booking => {
        const serviceName = booking.service?.name || 'Service Inconnu';
        if (serviceStats[serviceName]) {
            serviceStats[serviceName]++;
        } else {
            serviceStats[serviceName] = 1;
        }
    });
    
    const serviceLabels = Object.keys(serviceStats);
    const serviceData = Object.values(serviceStats);
    
    console.log('📊 Données calculées:');
    console.log('- Revenus par mois:', revenueData);
    console.log('- Services:', serviceStats);
    
    return {
        revenue: { labels: revenueLabels, data: revenueData },
        services: { labels: serviceLabels, data: serviceData }
    };
}

// Initialize Charts
function initializeCharts() {
    // Destroy existing charts before creating new ones
    destroyCharts();
    
    // Calculer les données réelles
    const chartData = calculateChartData();
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && revenueCtx.getContext) {
        charts.revenueChart = new Chart(revenueCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.revenue.labels,
                datasets: [{
                    label: 'Revenus (DT)',
                    data: chartData.revenue.data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return 'Revenus: ' + context.parsed.y + ' DT';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + ' DT';
                            }
                        }
                    }
                }
            }
        });
    }

    // Services Chart
    const servicesCtx = document.getElementById('servicesChart');
    if (servicesCtx && servicesCtx.getContext) {
        // Couleurs dynamiques pour les services
        const serviceColors = [
            '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', 
            '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#8b5a2b'
        ];
        
        const backgroundColors = chartData.services.labels.map((_, index) => 
            serviceColors[index % serviceColors.length]
        );
        
        charts.servicesChart = new Chart(servicesCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: chartData.services.labels.length > 0 ? chartData.services.labels : ['Aucun service'],
                datasets: [{
                    data: chartData.services.data.length > 0 ? chartData.services.data : [1],
                    backgroundColor: chartData.services.labels.length > 0 ? backgroundColors : ['#6b7280'],
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                                
                                if (label === 'Aucun service') {
                                    return 'Aucune réservation';
                                }
                                
                                return label + ': ' + value + ' réservation' + (value > 1 ? 's' : '') + ' (' + percentage + '%)';
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // Monthly Revenue Chart
    const monthlyRevenueCtx = document.getElementById('monthlyRevenueChart');
    if (monthlyRevenueCtx && monthlyRevenueCtx.getContext) {
        charts.monthlyRevenueChart = new Chart(monthlyRevenueCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [{
                    label: 'Revenus',
                    data: [320, 450, 380, 420, 510, 480, 390],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    borderRadius: 8,
                    hoverBackgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return 'Revenus: ' + context.parsed.y + ' DT';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + ' DT';
                            }
                        }
                    }
                }
            }
        });
    }

    // Top Services Chart
    const topServicesCtx = document.getElementById('topServicesChart');
    if (topServicesCtx && topServicesCtx.getContext) {
        charts.topServicesChart = new Chart(topServicesCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Complet', 'Demi', 'Baignoire'],
                datasets: [{
                    label: 'Revenus',
                    data: [2400, 1600, 800],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return 'Revenus: ' + context.parsed.x + ' DT';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + ' DT';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
}

// Destroy all charts
function destroyCharts() {
    Object.keys(charts).forEach(key => {
        if (charts[key]) {
            charts[key].destroy();
            delete charts[key];
        }
    });
}



// Save Settings
function saveSettings() {
    showNotification('Paramètres enregistrés avec succès', 'success');
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}





// Logout with modern confirmation modal
function logout() {
    showLogoutConfirmation();
}

function showLogoutConfirmation() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'logout-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="logout-modal">
            <div class="logout-modal-header">
                <div class="logout-icon">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
                <h3>Confirmation de déconnexion</h3>
            </div>
            <div class="logout-modal-body">
                <p>Êtes-vous sûr de vouloir vous déconnecter de votre session administrateur ?</p>
                <div class="logout-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Vous devrez vous reconnecter pour accéder au tableau de bord</span>
                </div>
            </div>
            <div class="logout-modal-actions">
                <button class="btn-cancel" onclick="closeLogoutModal()">
                    <i class="fas fa-times"></i>
                    Annuler
                </button>
                <button class="btn-confirm" onclick="confirmLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Se déconnecter
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeLogoutModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLogoutModal();
        }
    });
    
    // Add animation
    setTimeout(() => {
        modalOverlay.classList.add('show');
    }, 10);
}

function closeLogoutModal() {
    const modal = document.querySelector('.logout-modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function confirmLogout() {
    const modal = document.querySelector('.logout-modal-overlay');
    
    // Add loading state
    const confirmBtn = modal.querySelector('.btn-confirm');
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Déconnexion...';
    confirmBtn.disabled = true;
    
    // Simulate logout process
    setTimeout(() => {
        // Remove all auth data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('groomgo_user');
        localStorage.removeItem('groomgo_remember');
        
        // Show success message
        showLogoutSuccess();
        
        // Redirect after success message
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 800);
}

function showLogoutSuccess() {
    const modal = document.querySelector('.logout-modal');
    if (modal) {
        modal.innerHTML = `
            <div class="logout-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Déconnexion réussie</h3>
                <p>Vous allez être redirigé vers la page de connexion...</p>
                <div class="success-animation">
                    <div class="pulse-ring"></div>
                    <div class="pulse-ring"></div>
                    <div class="pulse-ring"></div>
                </div>
            </div>
        `;
    }
}

// ============ ADOPTION MANAGEMENT ============

let adoptionRequests = [];
let currentAdoptionFilter = 'all';

// Load Adoptions
function loadAdoptions() {
    adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
    
    // Ajouter des données d'exemple si aucune demande n'existe
    if (adoptionRequests.length === 0) {
        adoptionRequests = [
            {
                id: 1,
                animal: {
                    name: 'Bella',
                    breed: 'Labrador',
                    type: 'chien',
                    image: 'assets/img/WhatsApp Image 2025-10-13 at 15.45.04.jpeg'
                },
                applicant: {
                    firstName: 'Ahmed',
                    lastName: 'Ben Ali',
                    email: 'ahmed.benali@email.com',
                    phone: '+216 20 123 456',
                    address: '123 Rue de la Liberté, Tunis',
                    reason: 'Je souhaite adopter Bella car j\'ai toujours rêvé d\'avoir un chien. J\'ai un grand jardin et beaucoup de temps libre pour m\'occuper d\'elle. Je pense qu\'elle sera très heureuse dans ma famille.'
                },
                status: 'pending',
                dateFormatted: '15 Octobre 2024'
            },
            {
                id: 2,
                animal: {
                    name: 'Minou',
                    breed: 'Chat Européen',
                    type: 'chat',
                    image: 'assets/img/WhatsApp Image 2025-10-14 at 17.06.27 (1).jpeg'
                },
                applicant: {
                    firstName: 'Sarah',
                    lastName: 'Mansouri',
                    email: 'sarah.mansouri@email.com',
                    phone: '+216 25 789 012',
                    address: '456 Avenue Habib Bourguiba, Sfax',
                    reason: 'Minou a l\'air adorable et j\'aimerais lui offrir un foyer aimant. J\'ai déjà eu des chats et je sais comment bien m\'en occuper.'
                },
                status: 'approved',
                dateFormatted: '12 Octobre 2024'
            },
            {
                id: 3,
                animal: {
                    name: 'Rex',
                    breed: 'Berger Allemand',
                    type: 'chien',
                    image: 'assets/img/WhatsApp Image 2025-10-13 at 15.45.04.jpeg'
                },
                applicant: {
                    firstName: 'Mohamed',
                    lastName: 'Trabelsi',
                    email: 'mohamed.trabelsi@email.com',
                    phone: '+216 22 345 678',
                    address: '789 Rue Ibn Khaldoun, Sousse',
                    reason: 'Rex semble être un chien formidable. J\'ai de l\'expérience avec les grands chiens et je peux lui offrir l\'exercice et l\'attention qu\'il mérite.'
                },
                status: 'rejected',
                dateFormatted: '10 Octobre 2024'
            }
        ];
        localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
        console.log('📋 Données d\'exemple ajoutées pour les demandes d\'adoption');
    }
    
    // Update badge count
    const pendingCount = adoptionRequests.filter(r => r.status === 'pending').length;
    document.getElementById('adoptionCount').textContent = pendingCount;
    
    // Setup filter buttons
    document.querySelectorAll('.filter-btn[data-status]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentAdoptionFilter = this.dataset.status;
            displayAdoptions();
        });
    });
    
    displayAdoptions();
}

// Display Adoptions
function displayAdoptions() {
    // Check if we should use grid or table
    let container = document.querySelector('#adoptions .adoptions-grid');
    
    // If grid doesn't exist, create it
    if (!container) {
        const tableContainer = document.querySelector('#adoptions .table-container');
        if (tableContainer) {
            container = document.createElement('div');
            container.className = 'adoptions-grid';
            tableContainer.parentNode.insertBefore(container, tableContainer.nextSibling);
        }
    }
    
    let filtered = adoptionRequests;
    if (currentAdoptionFilter !== 'all') {
        filtered = adoptionRequests.filter(r => r.status === currentAdoptionFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #64748b;">Aucune demande d\'adoption</p>';
        return;
    }
    
    container.innerHTML = filtered.map(request => `
        <div class="adoption-card">
            <img src="${request.animal.image}" alt="${request.animal.name}" class="adoption-image">
            <div class="adoption-content">
                <div class="adoption-header">
                    <h3 class="adoption-title">${request.animal.name}</h3>
                    <span class="adoption-status status-badge ${request.status}">
                        ${getAdoptionStatusText(request.status)}
                    </span>
                </div>
                <div class="adoption-info">
                    <div class="info-row">
                        <i class="fas fa-paw"></i>
                        <span>${request.animal.breed}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-user"></i>
                        <span>${request.applicant.firstName} ${request.applicant.lastName}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-envelope"></i>
                        <span>${request.applicant.email}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-phone"></i>
                        <span>${request.applicant.phone}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-calendar"></i>
                        <span>${request.dateFormatted}</span>
                    </div>
                </div>
                <div class="adoption-actions">
                    ${request.status === 'pending' ? `
                        <button class="btn-approve" onclick="approveAdoption(${request.id})">
                            <i class="fas fa-check"></i> Approuver
                        </button>
                        <button class="btn-reject" onclick="rejectAdoption(${request.id})">
                            <i class="fas fa-times"></i> Rejeter
                        </button>
                    ` : `
                        <button class="btn-view-details" onclick="viewAdoptionDetails(${request.id})">
                            <i class="fas fa-eye"></i> Voir Détails
                        </button>
                    `}
                </div>
            </div>
        </div>
    `).join('');
}

// Get Adoption Status Text
function getAdoptionStatusText(status) {
    const statusMap = {
        'pending': 'En attente',
        'approved': 'Approuvée',
        'rejected': 'Refusée'
    };
    return statusMap[status] || status;
}

// View Adoption Details
function viewAdoptionDetails(id) {
    console.log('👁️ Affichage des détails de l\'adoption:', id);
    
    const request = adoptionRequests.find(r => r.id === id);
    if (!request) {
        console.error('❌ Demande d\'adoption non trouvée:', id);
        showNotification('Demande d\'adoption non trouvée', 'error');
        return;
    }
    
    console.log('📋 Demande trouvée:', request);
    
    // Utiliser le modal viewModal qui existe dans le HTML
    const modal = document.getElementById('viewModal');
    const modalContent = document.getElementById('viewModalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Modal ou contenu non trouvé');
        showNotification('Erreur d\'affichage du modal', 'error');
        return;
    }
    
    // Mettre à jour le titre du modal
    const modalHeader = modal.querySelector('.modal-header h2');
    if (modalHeader) {
        modalHeader.innerHTML = '<i class="fas fa-heart"></i> Détails de la Demande d\'Adoption';
    }
    
    modalContent.innerHTML = `
        <div style="max-height: 70vh; overflow-y: auto;">
            <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                <img src="${request.animal.image}" alt="${request.animal.name}" 
                     style="width: 200px; height: 200px; object-fit: cover; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 1.5rem;">
                        <i class="fas fa-paw"></i> ${request.animal.name}
                    </h3>
                    <div style="display: grid; gap: 8px;">
                        <p><strong><i class="fas fa-dog"></i> Race:</strong> ${request.animal.breed}</p>
                        <p><strong><i class="fas fa-tag"></i> Type:</strong> ${request.animal.type === 'chien' ? 'Chien' : 'Chat'}</p>
                        <p><strong><i class="fas fa-info-circle"></i> Statut:</strong> 
                            <span class="status-badge status-${request.status}">${getAdoptionStatusText(request.status)}</span>
                        </p>
                    </div>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                <h4 style="color: #1e40af; margin-bottom: 15px;">
                    <i class="fas fa-user"></i> Informations du demandeur
                </h4>
                <div style="display: grid; gap: 10px;">
                    <p><strong><i class="fas fa-user-circle"></i> Nom:</strong> ${request.applicant.firstName} ${request.applicant.lastName}</p>
                    <p><strong><i class="fas fa-envelope"></i> Email:</strong> 
                        <a href="mailto:${request.applicant.email}" style="color: #3b82f6; text-decoration: none;">
                            ${request.applicant.email}
                        </a>
                    </p>
                    <p><strong><i class="fas fa-phone"></i> Téléphone:</strong> 
                        <a href="tel:${request.applicant.phone}" style="color: #3b82f6; text-decoration: none;">
                            ${request.applicant.phone}
                        </a>
                    </p>
                    <p><strong><i class="fas fa-map-marker-alt"></i> Adresse:</strong> ${request.applicant.address}</p>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                <h4 style="color: #92400e; margin-bottom: 15px;">
                    <i class="fas fa-comment-alt"></i> Motivation pour l'adoption
                </h4>
                <div style="background: white; padding: 15px; border-radius: 8px; font-style: italic; line-height: 1.6;">
                    "${request.applicant.reason}"
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f1f5f9; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0;"><strong><i class="fas fa-calendar-alt"></i> Date de la demande:</strong></p>
                <span style="background: #3b82f6; color: white; padding: 5px 12px; border-radius: 20px; font-weight: 600;">
                    ${request.dateFormatted}
                </span>
            </div>
            
            ${request.status === 'pending' ? `
                <div style="display: flex; gap: 15px; margin-top: 25px;">
                    <button class="btn-primary" onclick="approveAdoption(${request.id}); closeAdoptionModal();" 
                            style="flex: 1; padding: 12px; font-size: 1rem; border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; color: white; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-check-circle"></i> Approuver l'adoption
                    </button>
                    <button class="btn-danger" onclick="rejectAdoption(${request.id}); closeAdoptionModal();" 
                            style="flex: 1; padding: 12px; font-size: 1rem; border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border: none; color: white; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-times-circle"></i> Refuser la demande
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    // Afficher le modal avec animation
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    console.log('✅ Modal d\'adoption affiché');
}

// Approve Adoption
function approveAdoption(id) {
    const index = adoptionRequests.findIndex(r => r.id === id);
    if (index > -1) {
        adoptionRequests[index].status = 'approved';
        localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
        showNotification('Demande d\'adoption approuvée', 'success');
        loadAdoptions();
    }
}

// Reject Adoption
function rejectAdoption(id) {
    const index = adoptionRequests.findIndex(r => r.id === id);
    if (index > -1) {
        adoptionRequests[index].status = 'rejected';
        localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
        showNotification('Demande d\'adoption refusée', 'info');
        loadAdoptions();
    }
}

// Delete Adoption
function deleteAdoption(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande d\'adoption ?')) {
        adoptionRequests = adoptionRequests.filter(r => r.id !== id);
        localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
        showNotification('Demande supprimée', 'success');
        loadAdoptions();
    }
}

// Add CSS animations and logout modal styles
const style = document.createElement('style');
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

    /* Logout Modal Styles */
    .logout-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .logout-modal-overlay.show {
        opacity: 1;
        visibility: visible;
    }

    .logout-modal {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
        backdrop-filter: blur(20px);
        border-radius: 24px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
        max-width: 450px;
        width: 90%;
        padding: 0;
        overflow: hidden;
        transform: scale(0.8) translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .logout-modal-overlay.show .logout-modal {
        transform: scale(1) translateY(0);
    }

    .logout-modal-header {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .logout-modal-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: headerGlow 3s ease-in-out infinite;
    }

    @keyframes headerGlow {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }

    .logout-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-size: 2rem;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        animation: iconFloat 2s ease-in-out infinite;
        position: relative;
        z-index: 2;
    }

    @keyframes iconFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
    }

    .logout-modal-header h3 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        position: relative;
        z-index: 2;
    }

    .logout-modal-body {
        padding: 2rem;
        text-align: center;
    }

    .logout-modal-body p {
        color: #374151;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .logout-warning {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #92400e;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
    }

    .logout-warning i {
        color: #f59e0b;
        font-size: 1.1rem;
    }

    .logout-modal-actions {
        display: flex;
        gap: 1rem;
        padding: 0 2rem 2rem;
    }

    .logout-modal-actions button {
        flex: 1;
        padding: 14px 24px;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        position: relative;
        overflow: hidden;
    }

    .btn-cancel {
        background: rgba(107, 114, 128, 0.1);
        color: #6b7280;
        border: 2px solid rgba(107, 114, 128, 0.2);
    }

    .btn-cancel:hover {
        background: rgba(107, 114, 128, 0.15);
        color: #4b5563;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(107, 114, 128, 0.2);
    }

    .btn-confirm {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        border: 2px solid transparent;
    }

    .btn-confirm:hover:not(:disabled) {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
    }

    .btn-confirm:disabled {
        opacity: 0.8;
        cursor: not-allowed;
        transform: none;
    }

    /* Success State */
    .logout-success {
        padding: 3rem 2rem;
        text-align: center;
    }

    .success-icon {
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        font-size: 3rem;
        color: white;
        animation: successPulse 1s ease-out;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    }

    @keyframes successPulse {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .logout-success h3 {
        color: #10b981;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .logout-success p {
        color: #6b7280;
        font-size: 1rem;
        margin-bottom: 2rem;
    }

    .success-animation {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
    }

    .pulse-ring {
        position: absolute;
        width: 40px;
        height: 40px;
        border: 3px solid #10b981;
        border-radius: 50%;
        opacity: 0;
        animation: pulsate 2s ease-out infinite;
    }

    .pulse-ring:nth-child(2) {
        animation-delay: 0.5s;
    }

    .pulse-ring:nth-child(3) {
        animation-delay: 1s;
    }

    @keyframes pulsate {
        0% {
            transform: scale(0.1);
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .logout-modal {
            max-width: 350px;
            margin: 1rem;
        }

        .logout-modal-header {
            padding: 1.5rem;
        }

        .logout-icon {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
        }

        .logout-modal-header h3 {
            font-size: 1.25rem;
        }

        .logout-modal-body {
            padding: 1.5rem;
        }

        .logout-modal-actions {
            flex-direction: column;
            padding: 0 1.5rem 1.5rem;
        }

        .logout-modal-actions button {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

// Close Adoption Modal
function closeAdoptionModal() {
    const modal = document.getElementById('viewModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        console.log('✅ Modal d\'adoption fermé');
    }
}
