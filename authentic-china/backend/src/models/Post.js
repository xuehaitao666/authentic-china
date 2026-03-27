const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '行记文字内容'
  },
  image_url: {
    type: DataTypes.STRING(1024),
    allowNull: true,
    comment: '锦囊配图'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '打卡城池/地点'
  }
}, {
  tableName: 'posts',
  underscored: true,
  timestamps: true
});

module.exports = Post;
