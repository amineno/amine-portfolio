const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'pets',
        key: 'id'
      }
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0]
      }
    },
    scheduledTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'),
      allowNull: false,
      defaultValue: 'pending'
    },
    totalPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    servicePrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    travelFee: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    coordinates: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidCoordinates(value) {
          if (value && (!value.lat || !value.lng)) {
            throw new Error('Coordonnées invalides');
          }
        }
      }
    },
    distance: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Distance en kilomètres depuis le point de départ'
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customerNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    groomerNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'transfer', 'online'),
      allowNull: true
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reminderSentAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    beforePhotos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    afterPhotos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'bookings',
    hooks: {
      beforeCreate: async (booking) => {
        if (!booking.bookingNumber) {
          booking.bookingNumber = await generateBookingNumber();
        }
      }
    },
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['petId']
      },
      {
        fields: ['serviceId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['scheduledDate']
      },
      {
        fields: ['bookingNumber'],
        unique: true
      }
    ]
  });

  // Generate unique booking number
  async function generateBookingNumber() {
    const prefix = 'GG';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Instance methods
  Booking.prototype.canBeCancelled = function() {
    const now = new Date();
    const scheduledDateTime = new Date(`${this.scheduledDate}T${this.scheduledTime}`);
    const hoursDifference = (scheduledDateTime - now) / (1000 * 60 * 60);
    
    return this.status === 'pending' || 
           (this.status === 'confirmed' && hoursDifference >= 24);
  };

  Booking.prototype.canBeModified = function() {
    const now = new Date();
    const scheduledDateTime = new Date(`${this.scheduledDate}T${this.scheduledTime}`);
    const hoursDifference = (scheduledDateTime - now) / (1000 * 60 * 60);
    
    return (this.status === 'pending' || this.status === 'confirmed') && 
           hoursDifference >= 48;
  };

  Booking.prototype.isUpcoming = function() {
    const now = new Date();
    const scheduledDateTime = new Date(`${this.scheduledDate}T${this.scheduledTime}`);
    
    return scheduledDateTime > now && 
           (this.status === 'pending' || this.status === 'confirmed');
  };

  Booking.prototype.calculateTravelFee = function(distance) {
    const FREE_RADIUS = 15; // km
    const RATE_PER_KM = 0.5; // DT per km
    
    if (distance <= FREE_RADIUS) {
      return 0;
    }
    
    return Math.ceil((distance - FREE_RADIUS) * RATE_PER_KM);
  };

  // Class methods
  Booking.getUpcomingBookings = function(userId = null) {
    const where = {
      scheduledDate: {
        [sequelize.Sequelize.Op.gte]: new Date()
      },
      status: {
        [sequelize.Sequelize.Op.in]: ['pending', 'confirmed']
      }
    };
    
    if (userId) {
      where.userId = userId;
    }
    
    return this.findAll({
      where,
      order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']],
      include: ['user', 'pet', 'service']
    });
  };

  Booking.getTodaysBookings = function() {
    const today = new Date().toISOString().split('T')[0];
    
    return this.findAll({
      where: {
        scheduledDate: today,
        status: {
          [sequelize.Sequelize.Op.in]: ['confirmed', 'in-progress']
        }
      },
      order: [['scheduledTime', 'ASC']],
      include: ['user', 'pet', 'service']
    });
  };

  // Associations
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Booking.belongsTo(models.Pet, {
      foreignKey: 'petId',
      as: 'pet'
    });
    
    Booking.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      as: 'service'
    });
  };

  return Booking;
};
