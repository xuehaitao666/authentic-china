const { City, Experience, Resident, User } = require('../models');

exports.getCityDetail = async (req, res) => {
  try {
    let { name } = req.params;
    
    // 归一化处理：去除行政后缀（如“市”、“盟”、“自治州”）以匹配数据库精简名
    const cleanName = name.replace(/(市|盟|自治州|地区)$/, '');

    // 联合查出带有关联表（画卷、主家）的复合数据集
    const city = await City.findOne({
      where: { name: cleanName },
      include: [
        {
          model: Experience,
          as: 'experiences',
          include: [
            { model: User, as: 'author', attributes: ['id', 'username', 'avatar_url', 'role'] }
          ]
        },
        {
          model: Resident,
          as: 'hosts',
          include: [
            { model: User, as: 'user', attributes: ['id', 'username', 'avatar_url', 'phone'] }
          ]
        }
      ]
    });

    if (!city) {
      return res.status(404).json({ code: 404, message: '神州大观暂未收录该城池' });
    }

    // 将数据库极深的对象组合成原前端定好的轻便格式
    const experiencesList = city.experiences.map(exp => ({
      id: exp.id,
      type: exp.type,
      title: exp.title,
      description: exp.content, // ContentCard.vue 需要的描述字段
      imageUrl: (exp.image_urls && exp.image_urls.length > 0) ? exp.image_urls[0] : null, // ContentCard 封面字段
      authorGroup: exp.author_group, // 决定是否出【本地地主】小红签
      authorName: exp.author?.username || '天外飞仙',
      authorAvatar: exp.author?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
    }));

    const hostsList = city.hosts.map(host => ({
      id: host.id,
      userId: host.user_id, // HostDrawer.vue 提交订单时需要的核心外键
      name: host.user?.username || '神秘名宿',
      avatar: host.user?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      photos: [host.user?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'], // 强行包裹数组防止 [0] 会报 undefined 导致 Vue 白屏
      reputationScore: host.reputation_score, // HostCard 需要这个字段名
      tags: [(host.can_host_stay ? '全能东道主' : '寻景带路人'), (host.specialty_food ? host.specialty_food.split('，')[0] : '风味家常菜')], // 提供给页面的 tags
      dailyPrice: Number(host.daily_price),
      bio: host.bio || '主家在此闲居片刻，暂未留书。'
    }));

    res.status(200).json({
      code: 200,
      data: {
        city_id: city.id,
        cityName: city.name,
        heroImage: city.cover_url || 'https://images.unsplash.com/photo-1523624867962-cf38ae625cd4?q=80&w=1920&auto=format&fit=crop',
        experiences: experiencesList,  // 长卷瀑布流内容
        hosts: hostsList               // 地道主家底列
      }
    });

  } catch (error) {
    console.error('获取城市画卷异常：', error);
    res.status(500).json({ code: 500, message: '山高路远，画风断绝（数据库取卷失败）' });
  }
}

/**
 * 获取所有城市列表 (用于发布动态时的选择器)
 */
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll({
      attributes: ['id', 'name', 'province'],
      order: [['province', 'ASC'], ['name', 'ASC']]
    });
    res.status(200).json({
      code: 200,
      data: cities
    });
  } catch (error) {
    console.error('获取城市列表异常：', error);
    res.status(500).json({ code: 500, message: '府衙内籍册混乱，请稍后再试' });
  }
};
