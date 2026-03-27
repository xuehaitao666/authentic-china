import { ref } from 'vue';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import axios from 'axios';

let socket = null;
const onlineUsers = ref([]);
const messages = ref([]); 
const currentChatFriendId = ref(null);

export function useChat() {
  const { user, isAuth } = useAuth();

  const initSocket = () => {
    // 确保仅有一个激活的长链接
    if (!isAuth.value || socket) return;

    socket = io('http://localhost:3000');
    
    socket.on('connect', () => {
      // 一旦连入风铃阵，挂起身份木牌
      socket.emit('user_online', user.value.id);
    });

    socket.on('online_users_update', (users) => {
      onlineUsers.value = users;
    });

    // 飞书落入手中
    socket.on('receive_message', (msg) => {
      // 若正好在和此知音围炉对坐，则直接将飞书落在卷面上
      if (currentChatFriendId.value && (msg.sender_id === currentChatFriendId.value || msg.receiver_id === currentChatFriendId.value)) {
        messages.value.push(msg);
      }
    });

    // 本人发出的飞书被风带回的回执确认
    socket.on('message_sent', (msg) => {
      if (currentChatFriendId.value && msg.receiver_id === currentChatFriendId.value) {
        messages.value.push(msg);
      }
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  // 翻阅这知音的往日旧笺
  const loadHistory = async (friendId) => {
    currentChatFriendId.value = friendId;
    messages.value = [];
    if (!user.value?.id) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/social/messages/${user.value.id}/${friendId}`);
      messages.value = res.data.data;
    } catch(e) { console.error('翻阅旧信失败'); }
  };

  // 飞掷传笺，如果有带画卷或名城便一并封好寄出
  const sendMessage = (text, sharedEntity = null) => {
    if(!socket || !user.value?.id || !currentChatFriendId.value) return;

    const payload = {
      sender_id: user.value.id,
      receiver_id: currentChatFriendId.value,
      content: text,
      shared_entity_type: sharedEntity?.type || null,
      shared_entity_id: sharedEntity?.id || null,
      shared_entity_title: sharedEntity?.title || null,
      shared_entity_image: sharedEntity?.image || null
    };

    socket.emit('send_message', payload);
  };

  return {
    socket,
    onlineUsers,
    messages,
    initSocket,
    disconnectSocket,
    loadHistory,
    sendMessage,
    currentChatFriendId
  };
}
