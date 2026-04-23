import { defineStore } from 'pinia';
import { ref } from 'vue';
import { chatWithAI } from '../api/ai';

export const useAiChatStore = defineStore('aiChat', () => {
  const isOpen = ref(false);
  const messages = ref([
    {
      role: 'assistant',
      content: '你好！我是你的国风小伴。很高兴在旅途中与你相遇。想要听听哪里的历史故事、文化习俗，或者想要规划旅行线路，都可以问我哦！'
    }
  ]);
  const isLoading = ref(false);

  const toggleChat = () => {
    isOpen.value = !isOpen.value;
  };

  const closeChat = () => {
    isOpen.value = false;
  };

  const sendMessage = async (content) => {
    if (!content.trim() || isLoading.value) return;

    // 添加用户消息
    messages.value.push({
      role: 'user',
      content
    });

    isLoading.value = true;

    try {
      // 提取最新的对白（也可以控制只发过去最近的 N 条上下文）
      const contextMessages = messages.value.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await chatWithAI(contextMessages);
      
      if (res && res.choices && res.choices.length > 0) {
        messages.value.push({
          role: 'assistant',
          content: res.choices[0].message.content
        });
      } else {
         messages.value.push({
           role: 'assistant',
           content: '抱歉，小伴遇到了一点麻烦，请稍后再试。'
         });
      }
    } catch (err) {
      messages.value.push({
        role: 'assistant',
        content: '抱歉，小伴暂时有点发呆，请检查网络或稍后再试。'
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isOpen,
    messages,
    isLoading,
    toggleChat,
    closeChat,
    sendMessage
  };
});
