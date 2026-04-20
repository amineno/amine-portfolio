const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[a-z0-9-]+$/
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shortDescription: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    basePrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    duration: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 15,
        max: 480
      }
    },
    category: {
      type: DataTypes.ENUM('complet', 'demi-complet', 'baignoire', 'special'),
      allowNull: false,
      defaultValue: 'complet'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    petTypes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ['chien', 'chat'],
      validate: {
        isValidPetTypes(value) {
          const validTypes = ['chien', 'chat'];
          if (!Array.isArray(value) || !value.every(type => validTypes.includes(type))) {
            throw new Error('Types d\'animaux invalides');
          }
        }
      }
    },
    sizePricing: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        petit: 0,
        moyen: 10,
        grand: 20,
        'tres-grand': 30
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gallery: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'services',
    indexes: [
      {
        fields: ['slug'],
        unique: true
      },
      {
        fields: ['category']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['displayOrder']
      }
    ]
  });

  // Instance methods
  Service.prototype.calculatePrice = function(petSize) {
    let price = parseFloat(this.basePrice);
    
    if (this.sizePricing && this.sizePricing[petSize]) {
      price += parseFloat(this.sizePricing[petSize]);
    }
    
    return price;
  };

  Service.prototype.isAvailableForPet = function(petType) {
    return this.petTypes.includes(petType);
  };

  // Class methods
  Service.getActiveServices = function() {
    return this.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });
  };

  Service.getPopularServices = function() {
    return this.findAll({
      where: { 
        isActive: true,
        isPopular: true 
      },
      order: [['displayOrder', 'ASC']]
    });
  };

  // Associations
  Service.associate = (models) => {
    Service.hasMany(models.Booking, {
      foreignKey: 'serviceId',
      as: 'bookings'
    });
  };

  return Service;
};
