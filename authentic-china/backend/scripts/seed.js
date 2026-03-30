const { sequelize, User, City, Resident, Experience, Friendship } = require('../src/models');
const bcrypt = require('bcryptjs');

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('🔗 数据库已连通，开始创世纪万物播种...');

    // 确保所有关联表被建立
    await sequelize.sync();

    // 1. 造人 (创建账户)
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash('123456', salt);

    const [userNJ] = await User.findOrCreate({
      where: { username: '南京陈阿姨' },
      defaults: {
        password_hash: hash,
        role: 'host',
        phone: '13800138000',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
      }
    });

    const [userCD] = await User.findOrCreate({
      where: { username: '成都酒馆老四' },
      defaults: {
        password_hash: hash,
        role: 'host',
        phone: '13900139000',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      }
    });

    // --- 新增：名士入世 ---
    const [libai] = await User.findOrCreate({
      where: { username: '李白' },
      defaults: { password_hash: hash, role: 'tourist', avatar_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?fit=crop&w=200' }
    });

    const [dufu] = await User.findOrCreate({
      where: { username: '杜甫' },
      defaults: { password_hash: hash, role: 'tourist', avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?fit=crop&w=200' }
    });

    const [su] = await User.findOrCreate({
      where: { username: '苏轼' },
      defaults: { password_hash: hash, role: 'tourist', avatar_url: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?fit=crop&w=200' }
    });

    // 缔结契约：让名士与主家互为知音
    const poets = [libai, dufu, su];
    const hosts = [userNJ, userCD];

    for (const p of poets) {
      for (const h of hosts) {
        await Friendship.findOrCreate({ where: { user_id: p.id, friend_id: h.id }, defaults: { status: 'accepted' }});
        await Friendship.findOrCreate({ where: { user_id: h.id, friend_id: p.id }, defaults: { status: 'accepted' }});
      }
    }

    // 2. 造城
    const [cityNJ] = await City.findOrCreate({
      where: { name: '南京' },
      defaults: {
        code: 'nanjing', province: '江苏',
        description: '江南佳丽地，金陵帝王州。',
        cover_url: 'https://images.unsplash.com/photo-1582203498858-a5ad3089d7fa?w=1920&q=80'
      }
    });

    const [cityCD] = await City.findOrCreate({
      where: { name: '成都' },
      defaults: {
        code: 'chengdu', province: '四川',
        description: '晓看红湿处，花重锦官城。',
        cover_url: 'https://images.unsplash.com/photo-1523624867962-cf38ae625cd4?w=1920&q=80'
      }
    });

    // 3. 挂牌立业
    await Resident.findOrCreate({
      where: { user_id: userNJ.id, city_id: cityNJ.id },
      defaults: {
        can_host_stay: true,
        specialty_food: '古法金陵烤鸭，手工糖藕',
        daily_price: 350.00,
        reputation_score: 99,
        bio: '我家在秦淮河畔生息了三代，能带你看到最内行的水上烟火。'
      }
    });

    await Resident.findOrCreate({
      where: { user_id: userCD.id, city_id: cityCD.id },
      defaults: {
        can_host_stay: false,
        specialty_food: '冷锅串串加包浆豆腐',
        daily_price: 180.00,
        reputation_score: 95,
        bio: '别去宽窄巷子挤了，带你去本地人才找得到的玉林小酒馆彻夜长谈。'
      }
    });

    // 4. 落笔生辉
    await Experience.findOrCreate({
      where: { title: '明故宫黄昏的一撇' },
      defaults: {
        city_id: cityNJ.id, author_id: userNJ.id,
        author_group: 'official_host', type: 'story',
        content: '每当夕阳扫过仅存的石柱础，都能听见六朝金粉的叹息声。',
        image_urls: ['https://images.unsplash.com/photo-1574044158428-fbff7ce243ec?w=600']
      }
    });

    console.log('✅ 龙鳞已成：神州南京与成都，及历代名士播种完毕！');
    process.exit(0);
  } catch(e) {
    console.error('播种异常:', e);
    process.exit(1);
  }
}

runSeed();
