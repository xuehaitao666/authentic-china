const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true
  },
  role: {
    type: DataTypes.ENUM('tourist', 'host', 'admin'),
    defaultValue: 'tourist'
  },
  avatar_url: {
    type: DataTypes.TEXT
  },
  real_name_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
