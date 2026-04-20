const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    senderName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    senderEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    senderPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    serviceType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('unread', 'read', 'replied', 'archived'),
      defaultValue: 'unread'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    adminReply: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    repliedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    repliedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Admins',
        key: 'id'
      }
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    readBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Admins',
        key: 'id'
      }
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['senderEmail']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  Message.associate = function(models) {
    Message.belongsTo(models.Admin, {
      as: 'repliedByAdmin',
      foreignKey: 'repliedBy'
    });
    Message.belongsTo(models.Admin, {
      as: 'readByAdmin',
      foreignKey: 'readBy'
    });
  };

  // Instance methods
  Message.prototype.markAsRead = async function(adminId) {
    this.status = 'read';
    this.readAt = new Date();
    this.readBy = adminId;
    return await this.save();
  };

  Message.prototype.reply = async function(replyText, adminId) {
    this.adminReply = replyText;
    this.status = 'replied';
    this.repliedAt = new Date();
    this.repliedBy = adminId;
    return await this.save();
  };

  Message.prototype.archive = async function() {
    this.status = 'archived';
    return await this.save();
  };

  return Message;
};
