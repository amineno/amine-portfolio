const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { models } = require('../config/database');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user's bookings
router.get('/', authenticateUser, [
  query('status').optional().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres invalides',
        errors: errors.array()
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId: req.user.id };
    if (status) {
      where.status = status;
    }

    const { count, rows: bookings } = await models.Booking.findAndCountAll({
      where,
      include: [
        {
          model: models.Pet,
          as: 'pet',
          attributes: ['id', 'name', 'type', 'breed', 'size']
        },
        {
          model: models.Service,
          as: 'service',
          attributes: ['id', 'name', 'duration', 'category']
        }
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
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations'
    });
  }
});

// Get single booking
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const booking = await models.Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: models.Pet,
          as: 'pet'
        },
        {
          model: models.Service,
          as: 'service'
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation'
    });
  }
});

// Create booking
router.post('/', authenticateUser, [
  body('petId').isUUID().withMessage('ID animal invalide'),
  body('serviceId').isUUID().withMessage('ID service invalide'),
  body('scheduledDate').isISO8601().withMessage('Date invalide'),
  body('scheduledTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Heure invalide'),
  body('address').notEmpty().withMessage('Adresse requise'),
  body('specialInstructions').optional().isString(),
  body('customerNotes').optional().isString()
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

    const {
      petId,
      serviceId,
      scheduledDate,
      scheduledTime,
      address,
      coordinates,
      specialInstructions,
      customerNotes
    } = req.body;

    // Verify pet belongs to user
    const pet = await models.Pet.findOne({
      where: {
        id: petId,
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

    // Verify service exists and is active
    const service = await models.Service.findOne({
      where: {
        id: serviceId,
        isActive: true
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }

    // Check if service is available for pet type
    if (!service.isAvailableForPet(pet.type)) {
      return res.status(400).json({
        success: false,
        message: 'Ce service n\'est pas disponible pour ce type d\'animal'
      });
    }

    // Calculate pricing
    const servicePrice = service.calculatePrice(pet.size);
    const distance = coordinates ? calculateDistance(coordinates) : 0;
    const travelFee = calculateTravelFee(distance);
    const totalPrice = servicePrice + travelFee;

    // Create booking
    const booking = await models.Booking.create({
      userId: req.user.id,
      petId,
      serviceId,
      scheduledDate,
      scheduledTime,
      address,
      coordinates,
      distance,
      servicePrice,
      travelFee,
      totalPrice,
      specialInstructions,
      customerNotes,
      status: 'pending'
    });

    // Load booking with associations
    const createdBooking = await models.Booking.findByPk(booking.id, {
      include: [
        {
          model: models.Pet,
          as: 'pet',
          attributes: ['id', 'name', 'type', 'breed', 'size']
        },
        {
          model: models.Service,
          as: 'service',
          attributes: ['id', 'name', 'duration', 'category']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: { booking: createdBooking }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation'
    });
  }
});

// Update booking
router.put('/:id', authenticateUser, [
  body('scheduledDate').optional().isISO8601().withMessage('Date invalide'),
  body('scheduledTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Heure invalide'),
  body('address').optional().notEmpty().withMessage('Adresse requise'),
  body('specialInstructions').optional().isString(),
  body('customerNotes').optional().isString()
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

    const booking = await models.Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Check if booking can be modified
    if (!booking.canBeModified()) {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation ne peut plus être modifiée'
      });
    }

    const {
      scheduledDate,
      scheduledTime,
      address,
      coordinates,
      specialInstructions,
      customerNotes
    } = req.body;

    // Update fields
    if (scheduledDate) booking.scheduledDate = scheduledDate;
    if (scheduledTime) booking.scheduledTime = scheduledTime;
    if (address) booking.address = address;
    if (coordinates) {
      booking.coordinates = coordinates;
      const distance = calculateDistance(coordinates);
      booking.distance = distance;
      booking.travelFee = calculateTravelFee(distance);
      booking.totalPrice = booking.servicePrice + booking.travelFee;
    }
    if (specialInstructions !== undefined) booking.specialInstructions = specialInstructions;
    if (customerNotes !== undefined) booking.customerNotes = customerNotes;

    await booking.save();

    // Load updated booking with associations
    const updatedBooking = await models.Booking.findByPk(booking.id, {
      include: [
        {
          model: models.Pet,
          as: 'pet',
          attributes: ['id', 'name', 'type', 'breed', 'size']
        },
        {
          model: models.Service,
          as: 'service',
          attributes: ['id', 'name', 'duration', 'category']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Réservation mise à jour avec succès',
      data: { booking: updatedBooking }
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation'
    });
  }
});

// Cancel booking
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const booking = await models.Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation ne peut plus être annulée'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Annulé par le client';
    await booking.save();

    res.json({
      success: true,
      message: 'Réservation annulée avec succès'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la réservation'
    });
  }
});

// Add review to completed booking
router.post('/:id/review', authenticateUser, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Note invalide (1-5)'),
  body('review').optional().isString().isLength({ max: 1000 }).withMessage('Avis trop long')
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

    const booking = await models.Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        status: 'completed'
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée ou non terminée'
      });
    }

    if (booking.rating) {
      return res.status(400).json({
        success: false,
        message: 'Avis déjà donné pour cette réservation'
      });
    }

    const { rating, review } = req.body;

    booking.rating = rating;
    booking.review = review;
    booking.reviewedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Avis ajouté avec succès'
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'avis'
    });
  }
});

// Helper functions
function calculateDistance(coordinates) {
  // Simplified distance calculation
  // In a real app, you'd use a proper geolocation service
  const TUNIS_CENTER = { lat: 36.8065, lng: 10.1815 };
  
  const R = 6371; // Earth's radius in km
  const dLat = (coordinates.lat - TUNIS_CENTER.lat) * Math.PI / 180;
  const dLng = (coordinates.lng - TUNIS_CENTER.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(TUNIS_CENTER.lat * Math.PI / 180) * Math.cos(coordinates.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateTravelFee(distance) {
  const FREE_RADIUS = 15; // km
  const RATE_PER_KM = 0.5; // DT per km
  
  if (distance <= FREE_RADIUS) {
    return 0;
  }
  
  return Math.ceil((distance - FREE_RADIUS) * RATE_PER_KM);
}

module.exports = router;
