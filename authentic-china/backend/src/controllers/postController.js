const { Post, User } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'authentic_china_secret_key_2026';

// 从 Token 中获取用户信息
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
};

/**
 * 发布新动态 (墨印成书)
 */
exports.createPost = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ code: 401, message: '身份未验，请先入关' });
    }

    const { content, image_url, location } = req.body;
    if (!content) {
      return res.status(400).json({ code: 400, message: '行记内容不可为空' });
    }

    const post = await Post.create({
      user_id: user.id,
      content,
      image_url,
      location
    });

    res.status(200).json({
      code: 200,
      message: '墨印已成，锦囊入库',
      data: post
    });
  } catch (error) {
    console.error('发布动态故障:', error);
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};

/**
 * 获取动态列表 (全部或特定用户)
 */
exports.getPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const where = userId ? { user_id: userId } : {};

    const posts = await Post.findAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar_url']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      code: 200,
      data: posts
    });
  } catch (error) {
    console.error('获取动态故障:', error);
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};
