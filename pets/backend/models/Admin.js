const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255]
      }
    },
    role: {
      type: DataTypes.ENUM('super-admin', 'admin', 'groomer', 'manager'),
      allowNull: false,
      defaultValue: 'admin'
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'admins',
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
        
        // Set default permissions based on role
        if (!admin.permissions || admin.permissions.length === 0) {
          admin.permissions = getDefaultPermissions(admin.role);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
        
        // Update permissions if role changed
        if (admin.changed('role')) {
          admin.permissions = getDefaultPermissions(admin.role);
        }
      }
    },
    indexes: [
      {
        fields: ['email'],
        unique: true
      },
      {
        fields: ['role']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  // Default permissions by role
  function getDefaultPermissions(role) {
    const permissionSets = {
      'super-admin': [
        'users.view', 'users.create', 'users.update', 'users.delete',
        'bookings.view', 'bookings.create', 'bookings.update', 'bookings.delete',
        'services.view', 'services.create', 'services.update', 'services.delete',
        'pets.view', 'pets.create', 'pets.update', 'pets.delete',
        'admins.view', 'admins.create', 'admins.update', 'admins.delete',
        'reports.view', 'settings.manage', 'system.manage'
      ],
      'admin': [
        'users.view', 'users.update',
        'bookings.view', 'bookings.create', 'bookings.update',
        'services.view', 'services.update',
        'pets.view', 'pets.update',
        'reports.view'
      ],
      'manager': [
        'users.view',
        'bookings.view', 'bookings.update',
        'services.view',
        'pets.view',
        'reports.view'
      ],
      'groomer': [
        'bookings.view', 'bookings.update',
        'pets.view'
      ]
    };
    
    return permissionSets[role] || [];
  }

  // Instance methods
  Admin.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  Admin.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  Admin.prototype.hasPermission = function(permission) {
    return this.permissions.includes(permission) || this.role === 'super-admin';
  };

  Admin.prototype.canManage = function(resource) {
    const managePermissions = [
      `${resource}.create`,
      `${resource}.update`,
      `${resource}.delete`
    ];
    
    return managePermissions.some(perm => this.hasPermission(perm));
  };

  Admin.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // Class methods
  Admin.getActiveAdmins = function() {
    return this.findAll({
      where: { isActive: true },
      order: [['firstName', 'ASC'], ['lastName', 'ASC']]
    });
  };

  Admin.getByRole = function(role) {
    return this.findAll({
      where: { 
        role,
        isActive: true 
      },
      order: [['firstName', 'ASC'], ['lastName', 'ASC']]
    });
  };

  return Admin;
};
