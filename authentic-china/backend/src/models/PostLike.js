const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostLike = sequelize.define('PostLike', {
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
  }
}, {
  tableName: 'post_likes',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['post_id', 'user_id']
    }
  ]
});

module.exports = PostLike;
