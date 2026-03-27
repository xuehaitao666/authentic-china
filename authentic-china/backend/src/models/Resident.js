const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resident = sequelize.define('Resident', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  can_host_stay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  specialty_food: {
    type: DataTypes.STRING(255)
  },
  daily_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  reputation_score: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: '温度值（信用分）'
  },
  bio: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'residents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'city_id']
    }
  ]
});

module.exports = Resident;
