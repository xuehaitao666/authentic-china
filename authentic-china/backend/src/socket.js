const { Message, User, GroupMessage } = require('./models');

// 常规用户资料查询字段（统一对外挂相展示）
const USER_PROFILE_ATTRS = ['id', 'username', 'avatar_url', 'role'];

// 内存中维护一个映射表: userId -> socketId, 用以定向发送信件
const onlineUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    // 游客/主家亮出身份信物上线
    socket.on('user_online', (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      // 广播给所有人更新在线列表
      io.emit('online_users_update', Array.from(onlineUsers.keys()));
    });

    // 核心流转枢纽：发送传笺（私聊）
    socket.on('send_message', async (data) => {
      try {
        // 1. 落笔生金：存入 MySQL
        const newMessage = await Message.create(data);
        
        // 2. 查出寄信人的挂相
        const sender = await User.findByPk(data.sender_id, {
          attributes: USER_PROFILE_ATTRS
        });

        const messagePayload = {
          ...newMessage.toJSON(),
          sender: sender ? sender.toJSON() : null
        };

        // 3. 鹰击长空：定向发射
        const receiverSocketId = onlineUsers.get(data.receiver_id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', messagePayload);
        }

        // 4. 同步给寄件人
        socket.emit('message_sent', messagePayload);

      } catch (e) {
        console.error('信鸽传书异常:', e);
      }
    });

    // --- 雅集 (Group Chat) 核心引擎 ---

    // 1. 投笔入林：加入雅集房间
    socket.on('join_group', (groupId) => {
      socket.join(`group_${groupId}`);
    });

    // 2. 雅集传笺：发送群组消息
    socket.on('send_group_message', async (data) => {
      try {
        // A. 持久化
        const newMessage = await GroupMessage.create({
          sender_id: data.sender_id,
          group_id: data.group_id,
          content: data.content,
          type: data.type || 'text',
          created_at: new Date()
        });

        // B. 身份回溯
        const sender = await User.findByPk(data.sender_id, {
          attributes: USER_PROFILE_ATTRS
        });

        const payload = {
          ...newMessage.toJSON(),
          sender: sender ? sender.toJSON() : null
        };

        // C. 鹰传八方
        io.to(`group_${data.group_id}`).emit('receive_group_message', payload);

      } catch (e) {
        console.error('雅集传笺异常:', e);
        socket.emit('error_message', {
          code: 'DB_WRITE_FAILED',
          message: '笔墨走偏，请重发'
        });
      }
    });

    // 断线或下线
    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('online_users_update', Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });
};
