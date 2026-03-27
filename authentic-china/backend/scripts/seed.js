const { sequelize, User, City, Resident, Experience } = require('../src/models');
const bcrypt = require('bcryptjs');

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('🔗 数据库已连通，开始创世纪万物播种...');

    // 确保所有关联表被建立
    await sequelize.sync();

    // 1. 造人 (创建主家虚拟用户)
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash('123456', salt);

    const [userNJ] = await User.findOrCreate({
      where: { username: '南京陈阿姨' },
      defaults: {
        password_hash: hash,
        role: 'host',
        phone: '13800138000',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' // 人像替代
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

    // 2. 造城 (开垦两座主力城市)
    const [cityNJ] = await City.findOrCreate({
      where: { name: '南京' },
      defaults: {
        code: 'nanjing',
        province: '江苏',
        description: '江南佳丽地，金陵帝王州。',
        cover_url: 'https://images.unsplash.com/photo-1582203498858-a5ad3089d7fa?w=1920&q=80'
      }
    });

    const [cityCD] = await City.findOrCreate({
      where: { name: '成都' },
      defaults: {
        code: 'chengdu',
        province: '四川',
        description: '晓看红湿处，花重锦官城。',
        cover_url: 'https://images.unsplash.com/photo-1523624867962-cf38ae625cd4?w=1920&q=80'
      }
    });
    
    // 北京作为我们的专属空谷意境城市（不配主家）
    await City.findOrCreate({
      where: { name: '北京' },
      defaults: { code: 'beijing', province: '北京', cover_url: 'https://images.unsplash.com/photo-1599577969850-25e24b7a1dfa?w=1920&q=80' }
    });

    // 3. 挂牌立业 (为金陵与锦官城赋予 Resident)
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

    // 4. 落笔生辉 (撰写城市景致图鉴 Experiences)
    await Experience.findOrCreate({
      where: { title: '明故宫黄昏的一撇' },
      defaults: {
        city_id: cityNJ.id,
        author_id: userNJ.id, // 陈阿姨亲笔
        author_group: 'official_host',
        type: 'story',
        content: '每当夕阳扫过仅存的石柱础，都能听见六朝金粉的叹息声。不需要门票，就在我家门口五十步开外的梧桐树荫下。',
        image_urls: ['https://images.unsplash.com/photo-1574044158428-fbff7ce243ec?w=600']
      }
    });

    await Experience.findOrCreate({
      where: { title: '锦江春色来天地' },
      defaults: {
        city_id: cityCD.id,
        author_id: userCD.id, // 酒馆老四亲笔
        author_group: 'official_host',
        type: 'sightseeing',
        content: '大清早站在水波前，看那江水绿得发深蓝。等雾气散去，最适合去街边要一碗浓茶放空这成都烂漫的清晨。',
        image_urls: ['https://images.unsplash.com/photo-1512403754473-27835f7b9984?w=600']
      }
    });

    console.log('✅ 龙鳞已成：神州南京与成都万物播种（Seeded）完毕！');
    process.exit(0);
  } catch(e) {
    console.error('播种遭遇五雷轰顶报错:', e);
    process.exit(1);
  }
}

runSeed();
