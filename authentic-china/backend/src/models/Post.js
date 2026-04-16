const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发布者ID'
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
    comment: '打卡地点文字描述'
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '关联城池ID'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否精选'
  },
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '赞赏人数'
  },
  comments_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '评论数量'
  },
  performance_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '活跃评分'
  }
}, {
  tableName: 'posts',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      fields: ['city_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['is_featured']
    },
    {
      fields: ['performance_score']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = Post;
