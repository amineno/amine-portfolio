const express = require('express');
const { query } = require('express-validator');
const { models } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all active services
router.get('/', optionalAuth, [
  query('category').optional().isIn(['complet', 'demi-complet', 'baignoire', 'special']),
  query('petType').optional().isIn(['chien', 'chat']),
  query('popular').optional().isBoolean()
], async (req, res) => {
  try {
    const { category, petType, popular } = req.query;

    const where = { isActive: true };
    
    if (category) {
      where.category = category;
    }
    
    if (popular === 'true') {
      where.isPopular = true;
    }

    let services = await models.Service.findAll({
      where,
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    // Filter by pet type if specified
    if (petType) {
      services = services.filter(service => service.petTypes.includes(petType));
    }

    // Add calculated prices for different sizes
    const servicesWithPricing = services.map(service => {
      const serviceData = service.toJSON();
      serviceData.pricing = {
        petit: service.calculatePrice('petit'),
        moyen: service.calculatePrice('moyen'),
        grand: service.calculatePrice('grand'),
        'tres-grand': service.calculatePrice('tres-grand')
      };
      return serviceData;
    });

    res.json({
      success: true,
      data: {
        services: servicesWithPricing
      }
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services'
    });
  }
});

// Get single service
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const service = await models.Service.findOne({
      where: {
        id: req.params.id,
        isActive: true
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    // Add calculated prices for different sizes
    const serviceData = service.toJSON();
    serviceData.pricing = {
      petit: service.calculatePrice('petit'),
      moyen: service.calculatePrice('moyen'),
      grand: service.calculatePrice('grand'),
      'tres-grand': service.calculatePrice('tres-grand')
    };

    // Get service statistics (if user is authenticated)
    if (req.user) {
      const stats = await getServiceStats(service.id);
      serviceData.stats = stats;
    }

    res.json({
      success: true,
      data: {
        service: serviceData
      }
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du service'
    });
  }
});

// Get service by slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const service = await models.Service.findOne({
      where: {
        slug: req.params.slug,
        isActive: true
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    // Add calculated prices for different sizes
    const serviceData = service.toJSON();
    serviceData.pricing = {
      petit: service.calculatePrice('petit'),
      moyen: service.calculatePrice('moyen'),
      grand: service.calculatePrice('grand'),
      'tres-grand': service.calculatePrice('tres-grand')
    };

    res.json({
      success: true,
      data: {
        service: serviceData
      }
    });

  } catch (error) {
    console.error('Get service by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du service'
    });
  }
});

// Get popular services
router.get('/featured/popular', optionalAuth, async (req, res) => {
  try {
    const services = await models.Service.findAll({
      where: {
        isActive: true,
        isPopular: true
      },
      order: [['displayOrder', 'ASC']],
      limit: 6,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    const servicesWithPricing = services.map(service => {
      const serviceData = service.toJSON();
      serviceData.pricing = {
        petit: service.calculatePrice('petit'),
        moyen: service.calculatePrice('moyen'),
        grand: service.calculatePrice('grand'),
        'tres-grand': service.calculatePrice('tres-grand')
      };
      return serviceData;
    });

    res.json({
      success: true,
      data: {
        services: servicesWithPricing
      }
    });

  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services populaires'
    });
  }
});

// Get service categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await models.Service.findAll({
      where: { isActive: true },
      attributes: [
        'category',
        [models.Service.sequelize.fn('COUNT', models.Service.sequelize.col('id')), 'count']
      ],
      group: ['category'],
      order: [['category', 'ASC']]
    });

    const categoryData = categories.map(cat => ({
      name: cat.category,
      count: parseInt(cat.dataValues.count),
      label: getCategoryLabel(cat.category)
    }));

    res.json({
      success: true,
      data: {
        categories: categoryData
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
});

// Helper functions
async function getServiceStats(serviceId) {
  try {
    const totalBookings = await models.Booking.count({
      where: { serviceId }
    });

    const completedBookings = await models.Booking.count({
      where: { 
        serviceId,
        status: 'completed'
      }
    });

    const avgRating = await models.Booking.findOne({
      where: { 
        serviceId,
        status: 'completed',
        rating: {
          [models.Booking.sequelize.Sequelize.Op.not]: null
        }
      },
      attributes: [
        [models.Booking.sequelize.fn('AVG', models.Booking.sequelize.col('rating')), 'avgRating'],
        [models.Booking.sequelize.fn('COUNT', models.Booking.sequelize.col('rating')), 'reviewCount']
      ]
    });

    return {
      totalBookings,
      completedBookings,
      avgRating: avgRating ? parseFloat(avgRating.dataValues.avgRating || 0).toFixed(1) : 0,
      reviewCount: avgRating ? parseInt(avgRating.dataValues.reviewCount || 0) : 0
    };

  } catch (error) {
    console.error('Get service stats error:', error);
    return {
      totalBookings: 0,
      completedBookings: 0,
      avgRating: 0,
      reviewCount: 0
    };
  }
}

function getCategoryLabel(category) {
  const labels = {
    'complet': 'Paquet Complet',
    'demi-complet': 'Paquet Demi-Complet',
    'baignoire': 'Paquet Baignoire',
    'special': 'Services Spéciaux'
  };
  
  return labels[category] || category;
}

module.exports = router;
