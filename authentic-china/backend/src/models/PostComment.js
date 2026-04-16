const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostComment = sequelize.define('PostComment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论内容'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '父级评论ID'
  }
}, {
  tableName: 'post_comments',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      fields: ['post_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['parent_id']
    }
  ]
});

module.exports = PostComment;
