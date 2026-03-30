const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupMember = sequelize.define('GroupMember', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 设置为联合主键的一部分
    allowNull: false
  },
  group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 设置为联合主键的一部分
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('主理人', '客官'),
    defaultValue: '客官',
    allowNull: false
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'group_members',
  timestamps: false, // 除非需要 updatedAt
  indexes: [
    {
      name: 'idx_user_group',
      unique: true,
      fields: ['user_id', 'group_id']
    }
  ]
});

module.exports = GroupMember;
