import { ref } from 'vue';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import axios from 'axios';

let socket = null;
const onlineUsers = ref([]);
const messages = ref([]); 
const currentChatFriendId = ref(null);
const currentGroupId = ref(null);

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

    // --- 雅集 (Group Chat) 监听 ---
    
    // 收到雅集传卷
    socket.on('receive_group_message', (msg) => {
      if (currentGroupId.value && msg.group_id === parseInt(currentGroupId.value)) {
        messages.value.push(msg);
      }
    });

    // 雅集传卷错误处理
    socket.on('error_message', (err) => {
      console.error('Socket Error:', err.message);
      // 可触发全局 Toast
      if (window.dispatchEvent) {
         window.dispatchEvent(new CustomEvent('ink-toast', { 
           detail: { message: err.message, type: 'error' } 
         }));
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

  // --- 雅集 (Group Chat) 核心函数 ---

  // 1. 进入雅集，同步往日旧笺
  const joinGroup = async (groupId) => {
    currentGroupId.value = groupId;
    currentChatFriendId.value = null; // 切换到群聊，清空好友选中
    messages.value = [];
    
    if (socket) {
      socket.emit('join_group', groupId);
    }
    
    await loadGroupHistory(groupId);
  };

  // 2. 翻阅雅集历史旧笺
  const loadGroupHistory = async (groupId, page = 1) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/social/groups/${groupId}/messages?page=${page}`);
      if (res.data.success) {
        messages.value = res.data.data;
      }
    } catch (e) {
      console.error('翻阅雅集卷轴失败:', e);
    }
  };

  // 3. 雅集投笔传笺
  const sendGroupMessage = (groupId, content, type = 'text') => {
    if (!socket || !user.value?.id) return;

    socket.emit('send_group_message', {
      sender_id: user.value.id,
      group_id: groupId,
      content,
      type
    });
  };

  return {
    socket,
    onlineUsers,
    messages,
    initSocket,
    disconnectSocket,
    loadHistory,
    sendMessage,
    currentChatFriendId,
    currentGroupId,
    joinGroup,
    loadGroupHistory,
    sendGroupMessage
  };
};
