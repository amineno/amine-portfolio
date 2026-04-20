const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'groomgo_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Import models
const User = require('../models/User');
const Pet = require('../models/Pet');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Admin = require('../models/Admin');
const Message = require('../models/Message');

// Initialize models
const models = {
  User: User(sequelize),
  Pet: Pet(sequelize),
  Service: Service(sequelize),
  Booking: Booking(sequelize),
  Admin: Admin(sequelize),
  Message: Message(sequelize)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  models
};
