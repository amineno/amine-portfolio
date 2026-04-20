const express = require('express');
const { body, validationResult } = require('express-validator');
const { models } = require('../config/database');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await models.User.findByPk(req.user.id, {
      include: [
        {
          model: models.Pet,
          as: 'pets',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'type', 'breed']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// Update user profile
router.put('/profile', authenticateUser, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Prénom invalide (2-50 caractères)'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Nom invalide (2-50 caractères)'),
  body('phone').optional().matches(/^[\+]?[0-9\s\-\(\)]{8,}$/).withMessage('Numéro de téléphone invalide'),
  body('address').optional().isString().isLength({ max: 500 }).withMessage('Adresse trop longue'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date de naissance invalide')
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

    const { firstName, lastName, phone, address, dateOfBirth } = req.body;

    const user = await models.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Update only provided fields
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;

    await user.update(updateData);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

// Update user preferences
router.put('/preferences', authenticateUser, [
  body('emailNotifications').optional().isBoolean().withMessage('Valeur invalide pour les notifications email'),
  body('smsNotifications').optional().isBoolean().withMessage('Valeur invalide pour les notifications SMS'),
  body('reminderNotifications').optional().isBoolean().withMessage('Valeur invalide pour les rappels'),
  body('language').optional().isIn(['fr', 'ar', 'en']).withMessage('Langue invalide')
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

    const user = await models.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Update preferences
    const currentPreferences = user.preferences || {};
    const newPreferences = {
      ...currentPreferences,
      ...req.body
    };

    await user.update({ preferences: newPreferences });

    res.json({
      success: true,
      message: 'Préférences mises à jour avec succès',
      data: { preferences: newPreferences }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des préférences'
    });
  }
});

// Get user dashboard stats
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get booking statistics
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalPets
    ] = await Promise.all([
      models.Booking.count({ where: { userId } }),
      models.Booking.count({ where: { userId, status: 'pending' } }),
      models.Booking.count({ where: { userId, status: 'confirmed' } }),
      models.Booking.count({ where: { userId, status: 'completed' } }),
      models.Pet.count({ where: { userId, isActive: true } })
    ]);

    // Get upcoming bookings
    const upcomingBookings = await models.Booking.findAll({
      where: {
        userId,
        scheduledDate: {
          [models.Booking.sequelize.Sequelize.Op.gte]: new Date()
        },
        status: {
          [models.Booking.sequelize.Sequelize.Op.in]: ['pending', 'confirmed']
        }
      },
      include: [
        {
          model: models.Pet,
          as: 'pet',
          attributes: ['id', 'name', 'type']
        },
        {
          model: models.Service,
          as: 'service',
          attributes: ['id', 'name', 'duration']
        }
      ],
      order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']],
      limit: 5
    });

    // Get recent completed bookings
    const recentBookings = await models.Booking.findAll({
      where: {
        userId,
        status: 'completed'
      },
      include: [
        {
          model: models.Pet,
          as: 'pet',
          attributes: ['id', 'name', 'type']
        },
        {
          model: models.Service,
          as: 'service',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['completedAt', 'DESC']],
      limit: 5
    });

    const stats = {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalPets,
      upcomingBookings,
      recentBookings
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Delete user account
router.delete('/account', authenticateUser, [
  body('password').notEmpty().withMessage('Mot de passe requis pour la suppression'),
  body('confirmation').equals('DELETE').withMessage('Confirmation requise')
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

    const { password } = req.body;

    const user = await models.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }

    // Check for active bookings
    const activeBookings = await models.Booking.count({
      where: {
        userId: user.id,
        status: {
          [models.Booking.sequelize.Sequelize.Op.in]: ['pending', 'confirmed']
        }
      }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer le compte avec des réservations actives'
      });
    }

    // Deactivate account instead of hard delete
    await user.update({
      isActive: false,
      email: `deleted_${Date.now()}_${user.email}`
    });

    // Deactivate pets
    await models.Pet.update(
      { isActive: false },
      { where: { userId: user.id } }
    );

    res.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte'
    });
  }
});

module.exports = router;
