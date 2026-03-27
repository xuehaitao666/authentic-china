const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 简单硬编码密钥 (仅作演示，未来应放入 .env)
const JWT_SECRET = process.env.JWT_SECRET || 'authentic_china_secret_key_2026';

// 注册
exports.register = async (req, res) => {
  try {
    const { username, password, phone, role } = req.body;
    
    // 校验输入
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '名号与信物(密码)不可空缺' });
    }
    
    // 防止通过正常渠道越权注册 Admin
    const safeRole = (role === 'admin') ? 'tourist' : (role || 'tourist');

    // 查重
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ code: 409, message: '此名号已在神州志中登记' });
    }

    // 盐化散列
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password_hash,
      phone,
      role: safeRole
    });

    res.status(201).json({
      code: 201,
      message: '名籍录入成功，已可凭印通关',
      data: { id: newUser.id, username: newUser.username, role: newUser.role }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ code: 500, message: '内廷机枢故障' });
  }
};

// 登录
exports.login = async (req, res) => {
  try {
    const { username, password, role_context } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ code: 401, message: '神州志中查无此人，请先登册' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '信物印证失败，核验有误' });
    }

    // 权限与身份登录入口强校验
    if (role_context && role_context === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: '无司局之大权，不得在此擅启后堂秘门' });
    }

    // 签发金牌 (JWT)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      code: 200,
      message: '勘合无误，准予放行',
      data: {
        token,
        user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar_url }
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ code: 500, message: '内廷机枢故障' });
  }
};

/**
 * 更新个人名籍 (头像/信息)
 */
exports.updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '身份未验，请先入关' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { avatar } = req.body;
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ code: 404, message: '神州志中查无此人' });
    }

    if (avatar) user.avatar_url = avatar;
    await user.save();

    res.status(200).json({
      code: 200,
      message: '名籍修缮成功，印鉴已新',
      data: { id: user.id, username: user.username, role: user.role, avatar: user.avatar_url }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ code: 500, message: '机枢修缮失败: ' + error.message });
  }
};
