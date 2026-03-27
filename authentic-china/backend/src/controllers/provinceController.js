const axios = require('axios');

const PROVINCE_ADCODE = {
  '陕西省': '610000', '江苏省': '320000', '浙江省': '330000',
  '四川省': '510000', '广东省': '440000', '北京市': '110000',
  '上海市': '310000', '湖南省': '430000', '湖北省': '420000',
  '云南省': '530000', '山东省': '370000', '河南省': '410000',
  '安徽省': '340000', '福建省': '350000', '江西省': '360000',
  '山西省': '140000', '河北省': '130000', '辽宁省': '210000',
  '吉林省': '220000', '黑龙江省': '230000', '贵州省': '520000',
  '广西壮族自治区': '450000', '内蒙古自治区': '150000',
  '新疆维吾尔自治区': '650000', '西藏自治区': '540000',
  '宁夏回族自治区': '640000', '青海省': '630000', '甘肃省': '620000',
  '海南省': '460000', '重庆市': '500000', '天津市': '120000',
};

const AUTHENTIC_CITIES = {
  '西安市': { ancient_name: '长安', motto: '十三朝古都，梦回大唐盛世。' },
  '宝鸡市': { ancient_name: '陈仓', motto: '明修栈道，暗度陈仓。' },
  '汉中市': { ancient_name: '汉中', motto: '汉家发祥地，诸葛躬耕处。' },
  '成都市': { ancient_name: '锦城', motto: '九天开出一成都，万户千门入画图。' },
  '苏州市': { ancient_name: '姑苏', motto: '君到姑苏见，人家尽枕河。' },
  '南京市': { ancient_name: '金陵', motto: '江南佳丽地，金陵帝王州。' },
  '扬州市': { ancient_name: '广陵', motto: '二十四桥明月夜，玉人何处教吹箫。' },
  '杭州市': { ancient_name: '临安', motto: '欲把西湖比西子，淡妆浓抹总相宜。' },
  '广州市': { ancient_name: '羊城', motto: '云山珠水，岭南风骨。' },
  '长沙市': { ancient_name: '潭州', motto: '惟楚有材，于斯为盛。' },
  '武汉市': { ancient_name: '江城', motto: '烟雨莽苍苍，龟蛇锁大江。' },
};

exports.getGeoJSON = async (req, res) => {
  try {
    const { name } = req.params;
    const adcode = PROVINCE_ADCODE[name];
    if (!adcode) return res.status(404).json({ code: 404, message: '此省份尚未列入舆地册' });

    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
    const response = await axios.get(url, { timeout: 8000 });
    res.status(200).json({ code: 200, message: '舆地已送达', data: response.data });
  } catch (error) {
    res.status(500).json({ code: 500, message: '舆图室加急抢修中' });
  }
};

exports.getProvinceCities = async (req, res) => {
  try {
    const { name } = req.params;
    const adcode = PROVINCE_ADCODE[name];
    if (!adcode) return res.status(404).json({ code: 404, message: '暂无该省城市纪实' });

    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
    const response = await axios.get(url, { timeout: 8000 });
    const features = response.data.features;

    const cities = features.map(f => {
      const cityName = f.properties.name;
      const meta = AUTHENTIC_CITIES[cityName] || { ancient_name: cityName.replace('市',''), motto: '神州大地，有缘再续烟火气。' };
      return {
        name: cityName,
        ancient_name: meta.ancient_name,
        motto: meta.motto,
        coords: f.properties.centroid || f.properties.center || [0, 0]
      };
    });

    res.status(200).json({ code: 200, message: '名城已备齐', data: cities });
  } catch (error) {
    res.status(500).json({ code: 500, message: '名籍册查阅受阻: ' + error.message });
  }
};
