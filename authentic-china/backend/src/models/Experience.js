const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Experience = sequelize.define('Experience', {
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  author_group: {
    type: DataTypes.ENUM('official_host', 'tourist'),
    allowNull: false,
    comment: '官方与地主一类，普通游客一类'
  },
  type: {
    type: DataTypes.ENUM('story', 'food', 'sightseeing'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image_urls: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'experiences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Experience;
