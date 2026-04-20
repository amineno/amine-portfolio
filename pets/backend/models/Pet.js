const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pet = sequelize.define('Pet', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    type: {
      type: DataTypes.ENUM('chien', 'chat'),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['chien', 'chat']]
      }
    },
    breed: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    age: {
      type: DataTypes.ENUM('chiot', 'jeune', 'adulte', 'senior'),
      allowNull: true,
      validate: {
        isIn: [['chiot', 'jeune', 'adulte', 'senior']]
      }
    },
    size: {
      type: DataTypes.ENUM('petit', 'moyen', 'grand', 'tres-grand'),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['petit', 'moyen', 'grand', 'tres-grand']]
      }
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0.1,
        max: 100
      }
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    temperament: {
      type: DataTypes.ENUM('calme', 'actif', 'nerveux', 'agressif'),
      allowNull: true,
      validate: {
        isIn: [['calme', 'actif', 'nerveux', 'agressif']]
      }
    },
    medicalNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastGroomingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    vaccinationStatus: {
      type: DataTypes.ENUM('up-to-date', 'expired', 'unknown'),
      defaultValue: 'unknown'
    },
    vaccinationExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'pets',
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  // Instance methods
  Pet.prototype.getAgeInMonths = function() {
    if (!this.dateOfBirth) return null;
    const now = new Date();
    const birth = new Date(this.dateOfBirth);
    return Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 30));
  };

  Pet.prototype.isVaccinationCurrent = function() {
    if (!this.vaccinationExpiry) return false;
    return new Date(this.vaccinationExpiry) > new Date();
  };

  // Associations
  Pet.associate = (models) => {
    Pet.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner'
    });
    
    Pet.hasMany(models.Booking, {
      foreignKey: 'petId',
      as: 'bookings',
      onDelete: 'CASCADE'
    });
  };

  return Pet;
};
