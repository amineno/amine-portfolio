const express = require('express');
const { body, validationResult } = require('express-validator');
const { models } = require('../config/database');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user's pets
router.get('/', authenticateUser, async (req, res) => {
  try {
    const pets = await models.Pet.findAll({
      where: {
        userId: req.user.id,
        isActive: true
      },
      order: [['name', 'ASC']],
      attributes: {
        exclude: ['userId']
      }
    });

    res.json({
      success: true,
      data: { pets }
    });

  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des animaux'
    });
  }
});

// Get single pet
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const pet = await models.Pet.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isActive: true
      },
      include: [
        {
          model: models.Booking,
          as: 'bookings',
          where: { status: 'completed' },
          required: false,
          order: [['completedAt', 'DESC']],
          limit: 5,
          include: [
            {
              model: models.Service,
              as: 'service',
              attributes: ['name', 'category']
            }
          ]
        }
      ]
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Animal non trouvé'
      });
    }

    res.json({
      success: true,
      data: { pet }
    });

  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'animal'
    });
  }
});

// Create pet
router.post('/', authenticateUser, [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Nom requis (1-50 caractères)'),
  body('type').isIn(['chien', 'chat']).withMessage('Type invalide'),
  body('size').isIn(['petit', 'moyen', 'grand', 'tres-grand']).withMessage('Taille invalide'),
  body('breed').optional().trim().isLength({ max: 100 }).withMessage('Race trop longue'),
  body('age').optional().isIn(['chiot', 'jeune', 'adulte', 'senior']).withMessage('Âge invalide'),
  body('weight').optional().isFloat({ min: 0.1, max: 100 }).withMessage('Poids invalide'),
  body('color').optional().trim().isLength({ max: 50 }).withMessage('Couleur trop longue'),
  body('temperament').optional().isIn(['calme', 'actif', 'nerveux', 'agressif']).withMessage('Tempérament invalide'),
  body('medicalNotes').optional().isString().isLength({ max: 1000 }).withMessage('Notes médicales trop longues'),
  body('allergies').optional().isString().isLength({ max: 500 }).withMessage('Allergies trop longues'),
  body('specialInstructions').optional().isString().isLength({ max: 1000 }).withMessage('Instructions trop longues')
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

    const petData = {
      ...req.body,
      userId: req.user.id
    };

    const pet = await models.Pet.create(petData);

    res.status(201).json({
      success: true,
      message: 'Animal ajouté avec succès',
      data: { pet }
    });

  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'animal'
    });
  }
});

// Update pet
router.put('/:id', authenticateUser, [
  body('name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Nom invalide (1-50 caractères)'),
  body('type').optional().isIn(['chien', 'chat']).withMessage('Type invalide'),
  body('size').optional().isIn(['petit', 'moyen', 'grand', 'tres-grand']).withMessage('Taille invalide'),
  body('breed').optional().trim().isLength({ max: 100 }).withMessage('Race trop longue'),
  body('age').optional().isIn(['chiot', 'jeune', 'adulte', 'senior']).withMessage('Âge invalide'),
  body('weight').optional().isFloat({ min: 0.1, max: 100 }).withMessage('Poids invalide'),
  body('color').optional().trim().isLength({ max: 50 }).withMessage('Couleur trop longue'),
  body('temperament').optional().isIn(['calme', 'actif', 'nerveux', 'agressif']).withMessage('Tempérament invalide'),
  body('medicalNotes').optional().isString().isLength({ max: 1000 }).withMessage('Notes médicales trop longues'),
  body('allergies').optional().isString().isLength({ max: 500 }).withMessage('Allergies trop longues'),
  body('specialInstructions').optional().isString().isLength({ max: 1000 }).withMessage('Instructions trop longues')
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

    const pet = await models.Pet.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isActive: true
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Animal non trouvé'
      });
    }

    await pet.update(req.body);

    res.json({
      success: true,
      message: 'Animal mis à jour avec succès',
      data: { pet }
    });

  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'animal'
    });
  }
});

// Delete pet (soft delete)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const pet = await models.Pet.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isActive: true
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Animal non trouvé'
      });
    }

    // Check if pet has pending or confirmed bookings
    const activeBookings = await models.Booking.count({
      where: {
        petId: pet.id,
        status: {
          [models.Booking.sequelize.Sequelize.Op.in]: ['pending', 'confirmed']
        }
      }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer un animal avec des réservations actives'
      });
    }

    // Soft delete
    await pet.update({ isActive: false });

    res.json({
      success: true,
      message: 'Animal supprimé avec succès'
    });

  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'animal'
    });
  }
});

// Get pet's booking history
router.get('/:id/bookings', authenticateUser, async (req, res) => {
  try {
    const pet = await models.Pet.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isActive: true
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Animal non trouvé'
      });
    }

    const bookings = await models.Booking.findAll({
      where: { petId: pet.id },
      include: [
        {
          model: models.Service,
          as: 'service',
          attributes: ['name', 'category', 'duration']
        }
      ],
      order: [['scheduledDate', 'DESC'], ['scheduledTime', 'DESC']]
    });

    res.json({
      success: true,
      data: { bookings }
    });

  } catch (error) {
    console.error('Get pet bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

module.exports = router;
