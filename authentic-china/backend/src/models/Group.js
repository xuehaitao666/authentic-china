const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '群名 / 雅号'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '群头像'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '群公告 / 雅旨'
  },
  creator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '创建者ID'
  }
}, {
  tableName: 'groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Group;
