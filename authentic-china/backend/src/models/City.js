const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const City = sequelize.define('City', {
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '如 quanzhou'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  province: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6)
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6)
  },
  description: {
    type: DataTypes.TEXT
  },
  cover_url: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'cities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = City;
