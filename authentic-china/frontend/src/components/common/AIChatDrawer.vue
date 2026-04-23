<template>
  <!-- 背景透黑遮罩 -->
  <div v-show="aiStore.isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500" @click="aiStore.closeChat"></div>
  
  <!-- 抽屉主体 -->
  <div 
    class="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FAF8F5] z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col border-l border-[#DECEC1]"
    :class="aiStore.isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header区：带点水墨底纹的感觉 -->
    <div class="relative flex items-center justify-between p-5 border-b border-[#DECEC1]/60 bg-gradient-to-br from-[#FFFDF9] to-[#F3EDE5] overflow-hidden">
      <!-- 极简背景点缀 -->
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-700/5 rounded-full blur-2xl"></div>
      <div class="absolute right-12 top-4 w-12 h-12 bg-orange-600/5 rounded-full blur-xl"></div>
      
      <div class="relative flex items-center space-x-4">
        <!-- 助手头像/印章风格 -->
        <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-[#BA5A31] to-[#D67140] shadow-inner flex items-center justify-center text-white ring-2 ring-white/60 font-serif rotate-3">
          <span class="text-xl -rotate-3">伴</span>
        </div>
        <div>
          <h2 class="text-xl font-serif font-bold text-[#3B2C24] tracking-widest">国风小伴</h2>
          <p class="text-xs text-[#8B6E59] mt-1 font-serif">您的中华文化向导</p>
        </div>
      </div>
      <button @click="aiStore.closeChat" class="relative p-2 text-[#8B6E59] hover:text-[#BA5A31] hover:bg-[#EAE1D8]/50 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 消息流区 -->
    <div class="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-[#DECEC1] scrollbar-track-transparent" ref="chatContainer">
      <!-- 问候语提示（背景水墨） -->
      <div class="flex justify-center mb-4">
        <span class="text-[10px] text-[#A69586] px-3 py-1 border border-[#DECEC1] rounded-full font-serif">聊聊历史风俗、名胜古迹</span>
      </div>

      <div v-for="(msg, index) in aiStore.messages" :key="index" class="flex w-full" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <!-- 导游头像 (Assistant) -->
        <div v-if="msg.role === 'assistant'" class="w-9 h-9 rounded-lg bg-[#BA5A31] flex-shrink-0 flex items-center justify-center text-white text-sm font-serif mr-3 mt-1 shadow-sm">伴</div>
        
        <!-- 消息气泡 -->
        <div 
          class="max-w-[78%] px-5 py-3.5 shadow-sm text-[15px] whitespace-pre-wrap leading-relaxed tracking-wide font-serif"
          :class="msg.role === 'user' ? 'bg-[#BA5A31] text-white rounded-2xl rounded-tr-sm' : 'bg-white text-[#4A3B32] rounded-2xl rounded-tl-sm border border-[#DECEC1]/80'"
        >
          {{ msg.content }}
        </div>
      </div>
      
      <!-- Loading 占位 -->
      <div v-if="aiStore.isLoading" class="flex justify-start">
        <div class="w-9 h-9 rounded-lg bg-[#BA5A31] flex-shrink-0 flex items-center justify-center text-white text-sm font-serif mr-3 mt-1 opacity-80">伴</div>
        <div class="bg-white text-[#4A3B32] rounded-2xl rounded-tl-sm border border-[#DECEC1]/80 px-5 py-4 flex space-x-2 items-center shadow-sm">
          <div class="w-1.5 h-1.5 rounded-full bg-[#BA5A31]/60 animate-bounce"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-[#BA5A31]/60 animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-[#BA5A31]/60 animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    </div>

    <!-- 输入框区 -->
    <div class="p-4 bg-[#F8F5F0] border-t border-[#DECEC1]/80">
      <div class="relative flex items-center shadow-sm bg-white rounded-xl border border-[#DECEC1] focus-within:ring-2 focus-within:ring-[#BA5A31]/30 focus-within:border-[#BA5A31]/50 transition-all">
        <textarea 
          v-model="inputMsg" 
          @keydown.enter.prevent="handleSend"
          placeholder="问问小伴..."
          class="w-full bg-transparent pl-4 pr-14 py-3.5 focus:outline-none resize-none font-serif text-[#4A3B32] placeholder-[#A69586]"
          rows="1"
        ></textarea>
        <button 
          @click="handleSend"
          :disabled="!inputMsg.trim() || aiStore.isLoading"
          class="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-[#BA5A31] to-[#D67140] text-white rounded-lg hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -rotate-90 transform" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
      <p class="text-center text-[10px] text-[#A69586] mt-2.5 font-serif tracking-widest">
        AI生成内容仅供参考
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useAiChatStore } from '../../store/aiChat';

const aiStore = useAiChatStore();
const inputMsg = ref('');
const chatContainer = ref(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

const handleSend = () => {
  if (!inputMsg.value.trim() || aiStore.isLoading) return;
  aiStore.sendMessage(inputMsg.value);
  inputMsg.value = '';
};

watch(() => aiStore.messages.length, () => {
  scrollToBottom();
});

watch(() => aiStore.isOpen, (newVal) => {
  if (newVal) {
    scrollToBottom();
  }
});
</script>
