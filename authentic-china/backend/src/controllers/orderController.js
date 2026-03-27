const { Order } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { host_id, city_id, start_date, end_date, guest_count, message, total_price } = req.body;
    
    // 目前强制假设游客 ID 为 1 (因JWT联调暂时未打通)
    const tourist_id = 1;

    const order = await Order.create({
      tourist_id,
      host_id,
      city_id,
      start_date,
      end_date,
      guest_count,
      total_price,
      message,
      status: 'pending' // 初始预约处于待接单状态
    });

    // 这里由于为了防止无鉴权的预检报错，默认先将数据顺利返回
    res.status(201).json({
      code: 201,
      message: '预约申请已发送至当地主家！',
      data: order
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ code: 500, message: '服务器内部错误或数据格式有误' });
  }
};
