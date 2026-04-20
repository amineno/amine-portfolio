const { sequelize, models } = require('../config/database');

async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie.');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Tables créées avec succès.');

    // Create default services
    await createDefaultServices();
    console.log('✅ Services par défaut créés.');

    // Create default admin
    await createDefaultAdmin();
    console.log('✅ Administrateur par défaut créé.');

    console.log('🎉 Base de données initialisée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function createDefaultServices() {
  const services = [
    {
      name: 'Paquet Complet',
      slug: 'paquet-complet',
      description: 'Service premium tout inclus pour le bien-être complet de votre animal',
      shortDescription: 'Service premium tout inclus',
      basePrice: 80.00,
      duration: '2h - 3h',
      durationMinutes: 150,
      category: 'complet',
      features: [
        'Bain complet avec shampooing adapté',
        'Séchage professionnel',
        'Brossage et démêlage',
        'Coupe / Tonte selon vos souhaits',
        'Coupe des griffes',
        'Nettoyage des oreilles et des yeux',
        'Parfumage et finition',
        'Brossage et nettoyage des dents',
        'Recommandations personnalisées au propriétaire'
      ],
      petTypes: ['chien', 'chat'],
      sizePricing: {
        petit: 0,
        moyen: 15,
        grand: 25,
        'tres-grand': 40
      },
      isActive: true,
      isPopular: true,
      displayOrder: 1
    },
    {
      name: 'Paquet Demi-Complet',
      slug: 'paquet-demi-complet',
      description: 'Service essentiel et pratique pour l\'hygiène de base de votre animal',
      shortDescription: 'Service essentiel et pratique',
      basePrice: 50.00,
      duration: '1h30 - 2h',
      durationMinutes: 105,
      category: 'demi-complet',
      features: [
        'Bain avec shampooing adapté',
        'Séchage professionnel',
        'Coupe des griffes',
        'Brossage et nettoyage des dents'
      ],
      petTypes: ['chien', 'chat'],
      sizePricing: {
        petit: 0,
        moyen: 10,
        grand: 15,
        'tres-grand': 25
      },
      isActive: true,
      isPopular: true,
      displayOrder: 2
    },
    {
      name: 'Paquet Baignoire',
      slug: 'paquet-baignoire',
      description: 'Service de base pour la propreté et la fraîcheur de votre animal',
      shortDescription: 'Service de base pour la propreté',
      basePrice: 30.00,
      duration: '45min - 1h',
      durationMinutes: 52,
      category: 'baignoire',
      features: [
        'Bain avec shampooing adapté',
        'Séchage professionnel'
      ],
      petTypes: ['chien', 'chat'],
      sizePricing: {
        petit: 0,
        moyen: 5,
        grand: 10,
        'tres-grand': 15
      },
      isActive: true,
      isPopular: false,
      displayOrder: 3
    }
  ];

  for (const serviceData of services) {
    await models.Service.create(serviceData);
  }
}

async function createDefaultAdmin() {
  const adminData = {
    firstName: 'Admin',
    lastName: 'GroomGo',
    email: 'admin@groomgo.tn',
    password: 'admin123',
    role: 'super-admin',
    isActive: true
  };

  await models.Admin.create(adminData);
  console.log('📧 Admin créé: admin@groomgo.tn / admin123');
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
