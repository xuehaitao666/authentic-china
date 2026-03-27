const { sequelize, User, Friendship } = require('../src/models');
const bcrypt = require('bcryptjs');

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('🔗 数据库连通，开始名士入世播种...');

    await sequelize.sync();

    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash('123456', salt);

    // 缔造名士
    const [libai] = await User.findOrCreate({
      where: { username: '李白' },
      defaults: {
        password_hash: hash,
        role: 'tourist',
        avatar_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?fit=crop&w=200'
      }
    });

    const [dufu] = await User.findOrCreate({
      where: { username: '杜甫' },
      defaults: {
        password_hash: hash,
        role: 'tourist',
        avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?fit=crop&w=200'
      }
    });

    const [su] = await User.findOrCreate({
      where: { username: '苏轼' },
      defaults: {
        password_hash: hash,
        role: 'tourist',
        avatar_url: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?fit=crop&w=200'
      }
    });

    const famousIds = [libai.id, dufu.id, su.id];

    // 获取其余所有凡人 (目前数据库里除名士外的所有用户)
    const allUsers = await User.findAll();
    
    for (const user of allUsers) {
      if (famousIds.includes(user.id)) continue; 
      
      for (const fId of famousIds) {
        // 双向结契
        await Friendship.findOrCreate({ where: { user_id: user.id, friend_id: fId }, defaults: { status: 'accepted' }});
        await Friendship.findOrCreate({ where: { user_id: fId, friend_id: user.id }, defaults: { status: 'accepted' }});
      }
    }

    console.log('✅ 名士降临，您（以及所有在册用户）已与李白、杜甫、苏轼互加为知音！(系统默认密码: 123456)');
    process.exit(0);
  } catch(e) {
    console.error('名士入世失败:', e);
    process.exit(1);
  }
}

runSeed();
