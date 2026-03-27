const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  tourist_id: { type: DataTypes.INTEGER, allowNull: false },
  host_id: { type: DataTypes.INTEGER, allowNull: false },
  city_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'), 
    defaultValue: 'pending',
    comment: '状态：待接单、已确认、已履约、已取消'
  },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  guest_count: { type: DataTypes.INTEGER, defaultValue: 1 },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  message: { type: DataTypes.TEXT, comment: '游客留言' }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Order;
