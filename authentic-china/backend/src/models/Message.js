const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true // 允许为空如果仅仅发了画卷
  },
  shared_entity_type: {
    type: DataTypes.ENUM('city', 'experience'),
    allowNull: true,
    comment: '附带发送的名城或画卷类型'
  },
  shared_entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  shared_entity_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '冗余字段：保存名城或画卷标题'
  },
  shared_entity_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '冗余字段：封面缩略图'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Message;
