const express = require('express');
const { body, validationResult, query } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { models } = require('../config/database');
const { authenticateAdmin, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: 'Trop de messages envoyés, veuillez réessayer plus tard.'
  }
});

// Public endpoint - Submit contact form
router.post('/contact', contactLimiter, [
  body('senderName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('senderEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('senderPhone')
    .optional()
    .matches(/^[\+]?[0-9\s\-\(\)]{8,}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Le sujet doit contenir entre 3 et 200 caractères'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Le message doit contenir entre 10 et 2000 caractères'),
  body('serviceType')
    .optional()
    .isIn(['toilettage-complet', 'toilettage-demi', 'baignoire', 'adoption', 'produits', 'autre'])
    .withMessage('Type de service invalide')
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

    const { senderName, senderEmail, senderPhone, subject, message, serviceType } = req.body;

    // Create message
    const newMessage = await models.Message.create({
      senderName,
      senderEmail,
      senderPhone,
      subject,
      message,
      serviceType,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
      data: {
        messageId: newMessage.id,
        estimatedResponse: '24-48 heures'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    });
  }
});

// Admin endpoints - Get all messages
router.get('/admin/messages', authenticateAdmin, requirePermission('messages.view'), [
  query('status').optional().isIn(['unread', 'read', 'replied', 'archived']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    
    if (search) {
      where[models.Message.sequelize.Sequelize.Op.or] = [
        { senderName: { [models.Message.sequelize.Sequelize.Op.like]: `%${search}%` } },
        { senderEmail: { [models.Message.sequelize.Sequelize.Op.like]: `%${search}%` } },
        { subject: { [models.Message.sequelize.Sequelize.Op.like]: `%${search}%` } },
        { message: { [models.Message.sequelize.Sequelize.Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: messages } = await models.Message.findAndCountAll({
      where,
      include: [
        {
          model: models.Admin,
          as: 'repliedByAdmin',
          attributes: ['id', 'name', 'email']
        },
        {
          model: models.Admin,
          as: 'readByAdmin',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    // Get unread count
    const unreadCount = await models.Message.count({ where: { status: 'unread' } });

    res.json({
      success: true,
      data: {
        messages,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages'
    });
  }
});

// Get single message
router.get('/admin/messages/:id', authenticateAdmin, requirePermission('messages.view'), async (req, res) => {
  try {
    const message = await models.Message.findByPk(req.params.id, {
      include: [
        {
          model: models.Admin,
          as: 'repliedByAdmin',
          attributes: ['id', 'name', 'email']
        },
        {
          model: models.Admin,
          as: 'readByAdmin',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Mark as read if unread
    if (message.status === 'unread') {
      await message.markAsRead(req.admin.id);
    }

    res.json({
      success: true,
      data: { message }
    });

  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du message'
    });
  }
});

// Reply to message
router.post('/admin/messages/:id/reply', authenticateAdmin, requirePermission('messages.reply'), [
  body('reply')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('La réponse doit contenir entre 10 et 5000 caractères')
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

    const message = await models.Message.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    await message.reply(req.body.reply, req.admin.id);

    // TODO: Send email reply to sender
    // await sendEmailReply(message.senderEmail, message.subject, req.body.reply);

    res.json({
      success: true,
      message: 'Réponse envoyée avec succès'
    });

  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la réponse'
    });
  }
});

// Update message status
router.put('/admin/messages/:id/status', authenticateAdmin, requirePermission('messages.update'), [
  body('status')
    .isIn(['unread', 'read', 'replied', 'archived'])
    .withMessage('Statut invalide')
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

    const message = await models.Message.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    if (req.body.status === 'read' && message.status === 'unread') {
      await message.markAsRead(req.admin.id);
    } else if (req.body.status === 'archived') {
      await message.archive();
    } else {
      message.status = req.body.status;
      await message.save();
    }

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès'
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
});

// Update message priority
router.put('/admin/messages/:id/priority', authenticateAdmin, requirePermission('messages.update'), [
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priorité invalide')
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

    const message = await models.Message.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    message.priority = req.body.priority;
    await message.save();

    res.json({
      success: true,
      message: 'Priorité mise à jour avec succès'
    });

  } catch (error) {
    console.error('Update message priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la priorité'
    });
  }
});

// Delete message (soft delete by archiving)
router.delete('/admin/messages/:id', authenticateAdmin, requirePermission('messages.delete'), async (req, res) => {
  try {
    const message = await models.Message.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    await message.archive();

    res.json({
      success: true,
      message: 'Message archivé avec succès'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'archivage du message'
    });
  }
});

// Get message statistics
router.get('/admin/messages/stats', authenticateAdmin, requirePermission('messages.view'), async (req, res) => {
  try {
    const [
      totalMessages,
      unreadMessages,
      repliedMessages,
      todayMessages,
      weekMessages
    ] = await Promise.all([
      models.Message.count(),
      models.Message.count({ where: { status: 'unread' } }),
      models.Message.count({ where: { status: 'replied' } }),
      models.Message.count({
        where: {
          createdAt: {
            [models.Message.sequelize.Sequelize.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      models.Message.count({
        where: {
          createdAt: {
            [models.Message.sequelize.Sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Get messages by service type
    const messagesByService = await models.Message.findAll({
      attributes: [
        'serviceType',
        [models.Message.sequelize.fn('COUNT', models.Message.sequelize.col('id')), 'count']
      ],
      group: ['serviceType'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalMessages,
          unreadMessages,
          repliedMessages,
          todayMessages,
          weekMessages,
          responseRate: totalMessages > 0 ? ((repliedMessages / totalMessages) * 100).toFixed(1) : 0
        },
        byService: messagesByService
      }
    });

  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router;
