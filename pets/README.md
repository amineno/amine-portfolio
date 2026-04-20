# 🐾 Groom'go - Service de Toilettage Mobile Premium

**Groom'go** est une plateforme web moderne et complète pour services de toilettage mobile d'animaux de compagnie en Tunisie. Notre service mobile se déplace directement chez vous pour offrir des soins professionnels à vos compagnons à quatre pattes.

## ✨ Fonctionnalités Principales

### 🎨 Frontend Moderne
- **Design glassmorphique** avec effets visuels avancés et thème bleu moderne
- **Page d'accueil interactive** avec animations fluides et hero section dynamique
- **Système d'évaluations et avis clients** avec notation par étoiles
- **Catalogue de produits complet** avec panier d'achat intégré et filtres par catégorie
- **Système de réservation intelligent** avec calcul automatique des prix
- **Page de packages de services** avec tarification détaillée
- **Page d'adoption d'animaux** pour promouvoir l'adoption responsable
- **Interface 100% responsive** optimisée pour tous les appareils
- **Dashboard administrateur** complet avec gestion des réservations

### 🔧 Backend API Robuste
- **API REST sécurisée** avec Node.js et Express
- **Base de données MySQL optimisée** avec Sequelize ORM
- **Authentification JWT avancée** avec refresh tokens
- **Système de gestion des utilisateurs** complet
- **Gestion intelligente des animaux** avec profils détaillés
- **Moteur de réservation** avec calcul automatique des prix et disponibilités
- **Dashboard administrateur** avec analytics et reporting
- **Système de messagerie** intégré pour la communication client
- **Gestion des avis et évaluations** avec modération
- **API de gestion des produits** avec inventaire

### 📦 Services Proposés
1. **Paquet Complet** (80 DT + supplément taille) - *Plus Populaire*
   - Bain complet avec shampoings spécialisés
   - Séchage professionnel
   - Coupe/tonte selon la race
   - Coupe des griffes et nettoyage des dents
   - Nettoyage des oreilles et des yeux
   - Durée: 2h-3h

2. **Paquet Demi-Complet** (50 DT + supplément taille)
   - Bain et séchage
   - Coupe des griffes
   - Nettoyage des dents
   - Brossage du pelage
   - Durée: 1h30-2h

3. **Paquet Baignoire** (30 DT + supplément taille)
   - Bain avec shampoing adapté
   - Séchage complet
   - Brossage de base
   - Durée: 45min-1h

### 🛍️ Catalogue de Produits
- **Produits Cosmétiques**: Shampoings, conditionneurs, sprays, masques
- **Accessoires**: Colliers, laisses, jouets, coussins, outils de toilettage
- **Produits Alimentaires**: Croquettes premium, friandises, compléments

## 📋 Prérequis

- Node.js 16+ 
- MySQL 8.0+
- Navigateur web moderne

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone https://github.com/your-username/groom-go.git
cd eyajbali
```

### 2. Configuration Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` à partir de `.env.example`:
```bash
cp .env.example .env
```

Configurer les variables d'environnement dans `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=groomgo_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

### 3. Initialiser la base de données

```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE groomgo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Initialiser les tables et données par défaut
npm run init-db
```

### 4. Démarrer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur sera disponible sur `http://localhost:3000`

### 5. Frontend

Ouvrir `index.html` dans un navigateur ou utiliser un serveur web local:

```bash
# Avec Python
python -m http.server 8080

# Avec Node.js (http-server)
npx http-server -p 8080
```

Le frontend sera disponible sur `http://localhost:8080`

## 📚 Structure du Projet

```
eyajbali/
├── backend/                    # 🔧 API Backend
│   ├── config/                # Configuration base de données
│   ├── middleware/            # Middlewares (auth, validation, security)
│   ├── models/               # Modèles Sequelize (User, Pet, Booking, etc.)
│   ├── routes/               # Routes API organisées par fonctionnalité
│   ├── scripts/              # Scripts d'initialisation et maintenance
│   ├── server.js             # Point d'entrée serveur Express
│   ├── .env                  # Variables d'environnement
│   ├── .env.example          # Exemple de configuration
│   └── package.json          # Dépendances backend
├── assets/                    # 🎨 Ressources frontend
│   ├── css/                  # Styles CSS modulaires
│   │   ├── style.css         # Styles principaux avec glassmorphisme
│   │   ├── admin-dashboard.css # Styles dashboard admin
│   │   ├── booking.css       # Styles réservation
│   │   ├── products.css      # Styles catalogue produits
│   │   ├── contact-styles.css # Styles section contact
│   │   └── footer-styles.css # Styles footer moderne
│   ├── js/                   # Scripts JavaScript
│   │   ├── main.js           # Script principal
│   │   ├── booking.js        # Logique réservation
│   │   ├── products.js       # Logique catalogue
│   │   ├── admin-dashboard.js # Logique dashboard admin
│   │   └── notes.js          # Logique avis clients
│   └── img/                  # Images et assets produits
├── index.html                 # 🏠 Page d'accueil moderne
├── login.html                 # 🔐 Page de connexion
├── booking.html               # 📅 Page de réservation intelligente
├── products.html              # 🛍️ Catalogue de produits complet
├── packages.html              # 📦 Page des packages de services
├── notes.html                 # ⭐ Page d'évaluations et avis
├── adoption.html              # 🐕 Page d'adoption d'animaux
├── admin-dashboard.html       # 📊 Dashboard administrateur
├── start-local-server.bat     # 🚀 Script de démarrage rapide
└── README.md                  # 📖 Documentation complète
```

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialiser mot de passe
- `GET /api/auth/verify` - Vérifier token

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour profil
- `GET /api/users/dashboard` - Statistiques dashboard

### Animaux
- `GET /api/pets` - Liste des animaux
- `POST /api/pets` - Ajouter un animal
- `PUT /api/pets/:id` - Modifier un animal
- `DELETE /api/pets/:id` - Supprimer un animal

### Services
- `GET /api/services` - Liste des services
- `GET /api/services/:id` - Détails d'un service

### Réservations
- `GET /api/bookings` - Liste des réservations
- `POST /api/bookings` - Créer une réservation
- `PUT /api/bookings/:id` - Modifier une réservation
- `DELETE /api/bookings/:id` - Annuler une réservation

### 🛍️ Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Ajouter un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### ⭐ Avis et Évaluations
- `GET /api/reviews` - Liste des avis
- `POST /api/reviews` - Ajouter un avis
- `PUT /api/reviews/:id` - Modifier un avis
- `DELETE /api/reviews/:id` - Supprimer un avis
- `GET /api/reviews/stats` - Statistiques des avis

### 📊 Administration
- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/dashboard` - Statistiques et analytics
- `GET /api/admin/bookings` - Gestion réservations
- `PUT /api/admin/bookings/:id/status` - Changer statut réservation
- `GET /api/admin/users` - Gestion utilisateurs
- `GET /api/admin/reviews` - Modération des avis

## 👤 Comptes par Défaut

### Administrateur
- Email: `admin@groomgo.tn`
- Mot de passe: `admin123`



## 🛠️ Technologies Utilisées

### 🎨 Frontend Moderne
- **HTML5 & CSS3** avec techniques avancées
- **JavaScript ES6+** avec modules et async/await
- **Bootstrap 5.3** pour la grille responsive
- **Font Awesome 6** pour les icônes
- **Glassmorphisme** avec backdrop-filter et effets visuels
- **Animations CSS** avec keyframes et transitions
- **Flatpickr** pour la sélection de dates
- **Chart.js** pour les graphiques du dashboard

### 🔧 Backend Robuste
- **Node.js 18+** & **Express.js 4.x**
- **MySQL 8.0** & **Sequelize ORM 6.x**
- **JWT** pour l'authentification sécurisée
- **bcryptjs** pour le hachage des mots de passe
- **express-validator** pour la validation des données
- **CORS & Helmet** pour la sécurité
- **express-rate-limit** pour la protection contre le spam
- **multer** pour l'upload de fichiers

## 🔒 Sécurité

- Authentification JWT avec expiration
- Hachage des mots de passe avec bcrypt
- Validation des données côté serveur
- Protection CORS et headers de sécurité
- Rate limiting sur les endpoints sensibles
- Soft delete pour préserver les données

## 📱 Zone de Service

- **Zone gratuite**: Grand Tunis (rayon de 15km)
- **Zone payante**: Au-delà de 15km (5 DT supplémentaires)
- **Calcul automatique** des frais de déplacement

## 🚀 Déploiement

### Backend (Production)
1. Configurer les variables d'environnement
2. Installer les dépendances: `npm install --production`
3. Initialiser la base de données: `npm run init-db`
4. Démarrer: `npm start`

### Frontend
1. Héberger les fichiers HTML/CSS/JS sur un serveur web
2. Configurer l'URL de l'API dans les fichiers JavaScript
3. Optimiser les images et ressources

## 🚀 Démarrage Rapide

Pour démarrer rapidement le projet :

```bash
# Cloner le projet
git clone https://github.com/your-username/groom-go.git
cd eyajbali

# Démarrer le serveur local (Windows)
start-local-server.bat

# Ou manuellement
python -m http.server 8080
```

## 📞 Support & Contact

Pour toute question, suggestion ou support technique :

- 📧 **Email** : contact@groomgo.tn
- 📞 **Téléphone** : +216 XX XXX XXX
- 🐈 **GitHub** : [Issues & Bug Reports](https://github.com/your-repo/issues)
- 💬 **Discord** : Communauté des développeurs

## 🎆 Fonctionnalités Récentes

- ✅ **Design moderne** avec thème bleu et glassmorphisme
- ✅ **Catalogue de produits** avec images réelles et filtres
- ✅ **Page de packages** avec tarification détaillée
- ✅ **Page d'adoption** pour promouvoir l'adoption responsable
- ✅ **Footer moderne** avec liens sociaux et informations de contact
- ✅ **Section contact** avec formulaire intégré

## 🎆 Fonctionnalités à Venir

- 🔔 **Notifications push** en temps réel
- 🌍 **Multi-langues** (Arabe, Français, Anglais)
- 📊 **Analytics avancées** pour les propriétaires
- 🎥 **Galerie photos** avant/après
- 💳 **Paiement en ligne** intégré
- 📱 **Application mobile** native

---

<div align="center">

### 🐾 **Groom'go** - *Prenez soin de vos animaux, sans bouger de chez vous!* 🐕🐱

**Made with ❤️ in Tunisia** 🇹🇳

</div>
