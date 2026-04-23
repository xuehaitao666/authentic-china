<template>
  <button 
    @click="aiStore.toggleChat"
    class="fixed right-6 bottom-24 z-[45] group flex flex-col items-center justify-center animate-bounce-slow cursor-pointer"
    style="animation-duration: 4s;"
  >
    <!-- 祈明灯 (Kongming Lantern) 造型 -->
    <div class="relative w-14 h-16">
      <!-- 灯笼光晕 -->
      <div class="absolute inset-0 bg-yellow-400 blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500 rounded-full"></div>
      
      <!-- 灯身主结构 -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#B05C2B] to-[#EAC274] rounded-t-full rounded-b-[40%] flex items-center justify-center shadow-lg border-2 border-[#D4A373] overflow-hidden">
        <!-- 灯中火光 -->
        <div class="w-5 h-7 bg-gradient-to-t from-orange-500 to-yellow-200 rounded-full blur-sm animate-pulse-fast"></div>
        <!-- 侧面纹理(简单线条) -->
        <div class="absolute inset-0 rounded-t-full rounded-b-[40%] border-x whitespace-nowrap border-yellow-900/10 w-8 mx-auto"></div>
        <div class="absolute inset-0 rounded-t-full rounded-b-[40%] border-x whitespace-nowrap border-yellow-900/10 w-4 mx-auto"></div>
      </div>
      
      <!-- 底座十字支架与火盆区 -->
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#5A3825] rounded-sm flex items-center justify-center">
        <!-- 中心托盘 -->
        <div class="w-4 h-1.5 bg-[#422513] rounded-sm"></div>
      </div>
      <!-- 流苏悬挂位 -->
      <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-red-600/80 shadow-sm">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
      </div>
    </div>
    
    <span class="mt-8 text-xs text-[#8B4513] font-serif font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-md border border-amber-100 tracking-widest">
      国风小伴
    </span>
  </button>
</template>

<script setup>
import { useAiChatStore } from '../../store/aiChat';
const aiStore = useAiChatStore();
</script>

<style scoped>
.animate-bounce-slow {
  animation: float 4s ease-in-out infinite;
}
.animate-pulse-fast {
  animation: flicker 1.5s ease-in-out infinite alternate;
}
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}
@keyframes flicker {
  0% { opacity: 0.8; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.1); }
}
</style>
