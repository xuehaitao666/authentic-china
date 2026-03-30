const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupMessage = sequelize.define('GroupMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('text', 'image'),
    defaultValue: 'text',
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'group_messages',
  timestamps: false, // 手动管理 created_at
  indexes: [
    {
      name: 'idx_group_time',
      fields: ['group_id', 'created_at']
    }
  ]
});

module.exports = GroupMessage;
