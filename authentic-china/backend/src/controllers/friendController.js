const { User, Friendship, Message } = require('../models');
const { Op } = require('sequelize');

// 人海觅音：根据名字模糊查找
exports.searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.json({ data: [] });
    
    const users = await User.findAll({
      where: { username: { [Op.like]: `%${keyword}%` } },
      attributes: ['id', 'username', 'avatar_url', 'role']
    });
    res.json({ code: 200, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '人海茫茫，寻人罗盘失灵。' });
  }
};

// 结契：直接缔结好友关系
exports.addFriend = async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;
    if (user_id == friend_id) return res.status(400).json({ message: '不可将自身的影踪当作同伴。' });

    // 为了让您立刻体验：省略漫长的申请步骤，双向强行结缘定契！
    await Friendship.findOrCreate({
      where: { user_id, friend_id },
      defaults: { status: 'accepted' }
    });
    await Friendship.findOrCreate({
      where: { user_id: friend_id, friend_id: user_id },
      defaults: { status: 'accepted' }
    });
    
    res.json({ code: 200, message: '飞鸽传信通道已打开，您与他已成为知音。' });
  } catch (error) {
    res.status(500).json({ message: '江湖险恶，结盟暂阻。' });
  }
};

// 获取名册：谁是我的知音？
exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const friendships = await Friendship.findAll({
      where: { user_id: userId, status: 'accepted' },
      include: [{ model: User, as: 'friend', attributes: ['id', 'username', 'avatar_url', 'role'] }]
    });
    
    const friends = friendships.map(f => f.friend);
    res.json({ code: 200, data: friends });
  } catch (error) {
    res.status(500).json({ message: '翻阅知音名册被邪气阻挡。' });
  }
};

// 拉取旧日传笺：历史聊天记录
exports.getMessages = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: friendId },
          { sender_id: friendId, receiver_id: userId }
        ]
      },
      order: [['created_at', 'ASC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'avatar_url'] }
      ]
    });
    res.json({ code: 200, data: messages });
  } catch (error) {
    res.status(500).json({ message: '旧信件已被雨水打湿（读取失败）。' });
  }
};
