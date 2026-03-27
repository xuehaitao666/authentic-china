const { Resident, City, User } = require('../models');
const jwt = require('jsonwebtoken');

// 简单硬编码密钥 (必须与 authController 一致)
const JWT_SECRET = process.env.JWT_SECRET || 'authentic_china_secret_key_2026';

// 提取令牌方法
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    console.error('Token Verify Error:', e.message);
    return null;
  }
};

// 挂牌府尹：让主家能够注册或更新自己的驻地信息
exports.upsertResidentProfile = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    // 强制鉴权
    if (!user || user.role !== 'host') {
      return res.status(403).json({ code: 403, message: '非主家血统，无权挂榜' });
    }

    const userId = user.id;
    const { cityName, canHostStay, specialtyFood, bio, coverImage } = req.body;

    if (!cityName) {
      return res.status(400).json({ code: 400, message: '必须选择一座城池挂牌' });
    }

    // 找到城市 ID (假设传过来的是 '南京' 或 '南京市')
    let city = await City.findOne({ where: { name: cityName }});
    if (!city) {
      // 模糊匹配
      city = await City.findOne({ where: { name: cityName.replace('市', '') }});
    }

    if (!city) {
      return res.status(404).json({ code: 404, message: '查无此城，神州未将此地录入版图' });
    }

    // 寻找主家是否已经在这座城市有过挂牌
    let resident = await Resident.findOne({
      where: { user_id: userId, city_id: city.id }
    });

    if (resident) {
      // 更新挂牌信息
      await resident.update({
        can_host_stay: canHostStay || false,
        specialty_food: specialtyFood || '',
        bio: bio || ''
      });
    } else {
      // 全新挂牌
      resident = await Resident.create({
        user_id: userId,
        city_id: city.id,
        can_host_stay: canHostStay || false,
        specialty_food: specialtyFood || '',
        bio: bio || '',
        reputation_score: 100 // 初始信用
      });
    }

    // 如果上传了封面图 (伪装)，我们可以把它更新回 User 表的 avatar_url，让头像变异为封面！
    if (coverImage) {
       await User.update({ avatar_url: coverImage }, { where: { id: userId } });
    }

    return res.status(200).json({
      code: 200,
      message: '挂牌成功，四海宾客已有耳闻',
      data: resident
    });

  } catch (error) {
    console.error('挂牌故障:', error);
    res.status(500).json({ code: 500, message: '府衙走水了，请稍后再试: ' + error.message });
  }
};

// 拉取当前主家自己所有的挂牌
exports.getMyResidentProfiles = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'host') {
      return res.status(403).json({ code: 403, message: '非主家无权探查' });
    }

    const profiles = await Resident.findAll({
      where: { user_id: user.id },
      include: [{ model: City, as: 'city', attributes: ['name', 'id'] }]
    });

    res.status(200).json({ code: 200, data: profiles });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
