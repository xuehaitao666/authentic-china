const { Post, User, PostLike, PostComment, City } = require('../models');
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

    const { content, image_url, location, city_id } = req.body;
    if (!content) {
      return res.status(400).json({ code: 400, message: '行记内容不可为空' });
    }

    const post = await Post.create({
      user_id: user.id,
      content,
      image_url,
      location,
      city_id
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
 * 获取动态列表 (全部/特定用户/特定城市 + 排序 + 分页)
 */
exports.getPosts = async (req, res) => {
  try {
    const currentUser = getUserFromToken(req);
    const { userId, city_id, sort = 'latest', page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (userId) where.user_id = userId;
    if (city_id) where.city_id = city_id;
    if (sort === 'featured') where.is_featured = true;

    // 排序逻辑
    let order = [['created_at', 'DESC']];
    if (sort === 'popular') {
      order = [['performance_score', 'DESC'], ['created_at', 'DESC']];
    } else if (sort === 'featured') {
      order = [['created_at', 'DESC']];
    }

    const offset = (page - 1) * limit;

    const { count, rows: posts } = await Post.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name']
        }
      ],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 如果用户登录了，检查其点赞状态
    let finalPosts = posts.map(p => p.toJSON());
    if (currentUser) {
      const postIds = finalPosts.map(p => p.id);
      const likes = await PostLike.findAll({
        where: {
          post_id: postIds,
          user_id: currentUser.id
        }
      });
      const likedPostIds = new Set(likes.map(l => l.post_id));
      finalPosts = finalPosts.map(p => ({
        ...p,
        is_liked: likedPostIds.has(p.id)
      }));
    }

    res.status(200).json({
      code: 200,
      data: {
        total: count,
        list: finalPosts,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('获取动态故障:', error);
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};

/**
 * 点赞/取消点赞 (点石成金)
 */
exports.toggleLike = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ code: 401, message: '身份未验，请先入关' });

    const { postId } = req.body;
    const existingLike = await PostLike.findOne({ where: { post_id: postId, user_id: user.id } });

    if (existingLike) {
      await existingLike.destroy();
      res.status(200).json({ code: 200, message: '锦囊收回，赞意已消', data: { liked: false } });
    } else {
      await PostLike.create({ post_id: postId, user_id: user.id });
      res.status(200).json({ code: 200, message: '点石成金，赞誉有加', data: { liked: true } });
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};

/**
 * 发表评论 (走笔龙蛇)
 */
exports.addComment = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ code: 401, message: '身份未验，请先入关' });

    const { post_id, content, parent_id } = req.body;
    if (!content) return res.status(400).json({ code: 400, message: '评论不可为空' });

    const comment = await PostComment.create({
      post_id,
      user_id: user.id,
      content,
      parent_id
    });

    const commentWithAuthor = await PostComment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar_url'] }]
    });

    res.status(200).json({ code: 200, message: '走笔龙蛇，高见已录', data: commentWithAuthor });
  } catch (error) {
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};

/**
 * 获取评论列表 (多级嵌套)
 */
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await PostComment.findAll({
      where: { post_id: postId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar_url'] }
      ],
      order: [['created_at', 'ASC']]
    });

    // 将扁平数组转换为树形结构
    const commentMap = {};
    const rootComments = [];

    comments.forEach(c => {
      const commentJson = c.toJSON();
      commentJson.replies = [];
      commentMap[c.id] = commentJson;
    });

    comments.forEach(c => {
      const commentJson = commentMap[c.id];
      if (c.parent_id && commentMap[c.parent_id]) {
        commentMap[c.parent_id].replies.push(commentJson);
      } else {
        rootComments.push(commentJson);
      }
    });

    res.status(200).json({ code: 200, data: rootComments });
  } catch (error) {
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};

/**
 * 删除动态
 */
exports.deletePost = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ code: 401, message: '身份未验，请先入关' });

    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ code: 404, message: '锦囊不存在' });
    if (post.user_id !== user.id) return res.status(403).json({ code: 403, message: '非汝锦囊，不可毁之' });

    await post.destroy();
    res.status(200).json({ code: 200, message: '锦囊已毁，烟消云散' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};

/**
 * 删除评论
 */
exports.deleteComment = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({ code: 401, message: '身份未验，请先入关' });

    const { id } = req.params;
    const comment = await PostComment.findByPk(id);

    if (!comment) return res.status(404).json({ code: 404, message: '评论不存在' });
    if (comment.user_id !== user.id) return res.status(403).json({ code: 403, message: '非汝高见，不可收回' });

    await comment.destroy();
    res.status(200).json({ code: 200, message: '高见已撤，其意自存' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '府衙走水了: ' + error.message });
  }
};
