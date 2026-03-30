const { Group, GroupMember, GroupMessage, User, sequelize } = require('../models');

/**
 * 获取群聊历史消息
 * @route GET /api/v1/social/groups/:id/messages
 */
exports.getGroupMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const offset = (page - 1) * limit;

    // 分页加载（分页获取历史行踪），最新的在前面
    const { count, rows } = await GroupMessage.findAndCountAll({
      where: { group_id: id },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'avatar_url', 'role']
      }],
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: offset
    });

    // 翻转回正确的时间轴顺序（时间递增）
    const messages = rows.reverse();

    res.json({
      success: true,
      data: messages,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('获取雅集卷轴失败:', error);
    res.status(500).json({
      success: false,
      message: '卷轴尘封，暂时无法查阅'
    });
  }
};

/**
 * 获取雅集同袍（成员）列表
 * @route GET /api/v1/social/groups/:id/members
 */
exports.getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await GroupMember.findAll({
      where: { group_id: id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar_url', 'role']
      }]
    });

    // 格式化输出
    const data = members.map(m => m.user);

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('获取雅集同袍失败:', error);
    res.status(500).json({
      success: false,
      message: '人海茫茫，未能寻得同袍'
    });
  }
};

/**
 * 获取当前用户加入的所有雅集
 * @route GET /api/v1/social/groups/user/:userId
 */
exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    // 通过关联查询用户加入的群组
    const userWithGroups = await User.findByPk(userId, {
      include: [{
        model: Group,
        as: 'memberGroups',
        through: { attributes: [] }, // 不返回中间表字段
        attributes: ['id', 'name', 'avatar', 'description', 'creator_id']
      }]
    });

    if (!userWithGroups) {
      return res.status(404).json({ success: false, message: '未找到该游子信息' });
    }

    res.json({
      success: true,
      data: userWithGroups.memberGroups || []
    });

  } catch (error) {
    console.error('获取加入的雅集失败:', error);
    res.status(500).json({
      success: false,
      message: '卷轴受损，暂无法查阅已入之集'
    });
  }
};

/**
 * 兴建雅集并邀请好友入席
 * @route POST /api/v1/social/groups
 */
exports.createGroup = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, description, avatar, creator_id, memberIds = [] } = req.body;

    if (!name || !creator_id) {
      return res.status(400).json({ success: false, message: '雅集名号与召集人不可或缺' });
    }

    // 1. 创建雅集实体
    const group = await Group.create({
      name,
      description,
      avatar,
      creator_id
    }, { transaction: t });

    // 2. 将召集人设为主理人
    const membersToCreate = [
      { user_id: creator_id, group_id: group.id, role: '主理人' }
    ];

    // 3. 将受邀好友设为客官
    memberIds.forEach(id => {
      if (id !== creator_id) {
        membersToCreate.push({ user_id: id, group_id: group.id, role: '客官' });
      }
    });

    await GroupMember.bulkCreate(membersToCreate, { transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: `雅集『${name}』已开坛聚贤`,
      data: group
    });

  } catch (error) {
    await t.rollback();
    console.error('兴建雅集失败:', error);
    res.status(500).json({
      success: false,
      message: '天地之气不合，雅集兴建失败'
    });
  }
};
