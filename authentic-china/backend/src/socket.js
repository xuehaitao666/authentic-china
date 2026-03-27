const { Message, User } = require('./models');

// 内存中维护一个映射表: userId -> socketId, 用以定向发送信件
const onlineUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('知音连接已建立 (Socket.IO):', socket.id);

    // 游客/主家亮出身份信物上线
    socket.on('user_online', (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`User ${userId} 已上线 (socket: ${socket.id})`);
      // 广播给所有人更新在线列表（可选功能）
      io.emit('online_users_update', Array.from(onlineUsers.keys()));
    });

    // 核心流转枢纽：发送传笺（文字或带城市卡片）
    socket.on('send_message', async (data) => {
      try {
        // data 结构 = { sender_id, receiver_id, content, shared_entity_type, shared_entity_id, shared_entity_title, shared_entity_image }
        
        // 1. 落笔生金：把该信件作为物理卷宗存入 MySQL
        const newMessage = await Message.create(data);
        
        // 2. 查出寄信人的挂相 (头像、名字)，以便对方签收时展现
        const sender = await User.findByPk(data.sender_id, {
          attributes: ['id', 'username', 'avatar_url', 'role']
        });

        const messagePayload = {
          ...newMessage.toJSON(),
          sender: sender ? sender.toJSON() : null
        };

        // 3. 鹰击长空：如果在册在线，则直接发射过去
        const receiverSocketId = onlineUsers.get(data.receiver_id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', messagePayload);
        }

        // 4. 同步给寄件人的客户端，告诉他“信已送达”
        socket.emit('message_sent', messagePayload);

      } catch (e) {
        console.error('信鸽途中遭鹞子袭击异常:', e);
      }
    });

    // 断线或下线
    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
         console.log(`User ${disconnectedUserId} 退出了连接`);
         io.emit('online_users_update', Array.from(onlineUsers.keys()));
      }
    });
  });
};
