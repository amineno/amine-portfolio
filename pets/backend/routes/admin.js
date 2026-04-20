const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { models } = require('../config/database');
const { authenticateAdmin, requirePermission, generateToken } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const admin = await models.Admin.findOne({ where: { email, isActive: true } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'admin'
    });

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        admin: admin.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      pendingBookings,
      todayBookings,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      models.User.count({ where: { isActive: true } }),
      models.Booking.count(),
      models.Booking.count({ where: { status: 'pending' } }),
      models.Booking.count({
        where: {
          scheduledDate: new Date().toISOString().split('T')[0],
          status: { [models.Booking.sequelize.Sequelize.Op.in]: ['confirmed', 'in-progress'] }
        }
      }),
      models.Booking.sum('totalPrice', { where: { status: 'completed' } }),
      models.Booking.sum('totalPrice', {
        where: {
          status: 'completed',
          completedAt: {
            [models.Booking.sequelize.Sequelize.Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    // Recent bookings
    const recentBookings = await models.Booking.findAll({
      include: [
        { model: models.User, as: 'user', attributes: ['firstName', 'lastName', 'phone'] },
        { model: models.Pet, as: 'pet', attributes: ['name', 'type'] },
        { model: models.Service, as: 'service', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const stats = {
      totalUsers,
      totalBookings,
      pendingBookings,
      todayBookings,
      totalRevenue: totalRevenue || 0,
      monthlyRevenue: monthlyRevenue || 0,
      recentBookings
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Manage bookings
router.get('/bookings', authenticateAdmin, requirePermission('bookings.view'), [
  query('status').optional().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']),
  query('date').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (date) where.scheduledDate = date;

    const { count, rows: bookings } = await models.Booking.findAndCountAll({
      where,
      include: [
        { model: models.User, as: 'user', attributes: ['firstName', 'lastName', 'phone', 'email'] },
        { model: models.Pet, as: 'pet', attributes: ['name', 'type', 'breed', 'size'] },
        { model: models.Service, as: 'service', attributes: ['name', 'duration', 'category'] }
      ],
      order: [['scheduledDate', 'DESC'], ['scheduledTime', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations'
    });
  }
});

// Update booking status
router.put('/bookings/:id/status', authenticateAdmin, requirePermission('bookings.update'), [
  body('status').isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']).withMessage('Statut invalide'),
  body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notes trop longues')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { status, notes } = req.body;
    const booking = await models.Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    const updateData = { status };
    if (notes) updateData.groomerNotes = notes;

    // Set timestamps based on status
    const now = new Date();
    switch (status) {
      case 'confirmed':
        updateData.confirmedAt = now;
        break;
      case 'in-progress':
        updateData.startedAt = now;
        break;
      case 'completed':
        updateData.completedAt = now;
        break;
      case 'cancelled':
        updateData.cancelledAt = now;
        break;
    }

    await booking.update(updateData);

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès'
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
});

// Manage users
router.get('/users', authenticateAdmin, requirePermission('users.view'), [
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = { isActive: true };
    if (search) {
      where[models.User.sequelize.Sequelize.Op.or] = [
        { firstName: { [models.User.sequelize.Sequelize.Op.like]: `%${search}%` } },
        { lastName: { [models.User.sequelize.Sequelize.Op.like]: `%${search}%` } },
        { email: { [models.User.sequelize.Sequelize.Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await models.User.findAndCountAll({
      where,
      include: [
        {
          model: models.Pet,
          as: 'pets',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'type']
        },
        {
          model: models.Booking,
          as: 'bookings',
          required: false,
          attributes: ['id', 'status'],
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

// Manage services
router.get('/services', authenticateAdmin, requirePermission('services.view'), async (req, res) => {
  try {
    const services = await models.Service.findAll({
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    console.error('Get admin services error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services'
    });
  }
});

// Update service
router.put('/services/:id', authenticateAdmin, requirePermission('services.update'), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nom invalide'),
  body('basePrice').optional().isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('isActive').optional().isBoolean().withMessage('Statut invalide'),
  body('isPopular').optional().isBoolean().withMessage('Popularité invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const service = await models.Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    await service.update(req.body);

    res.json({
      success: true,
      message: 'Service mis à jour avec succès',
      data: { service }
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du service'
    });
  }
});

module.exports = router;
