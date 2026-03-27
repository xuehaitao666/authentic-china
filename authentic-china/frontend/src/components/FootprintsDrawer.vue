<template>
  <div v-if="isOpen" class="fixed inset-0 z-[950] flex justify-start font-serif">
    
    <!-- 大后方阴霾遮罩 -->
    <div class="absolute inset-0 bg-ink-black/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
    
    <!-- 藏经阁真身 (左侧抽屉) -->
    <div class="relative w-full sm:w-[380px] h-full bg-paper-base shadow-2xl flex flex-col animate-slide-in-left border-r border-ink-light/20">
      
      <!-- 关门扣 -->
      <button @click="$emit('close')" class="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-ink-light hover:text-china-red transition-colors z-20">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <!-- 顶门楣 -->
      <div class="pt-12 pb-6 px-10 border-b border-ink-light/15 bg-paper-light">
         <h2 class="text-3xl text-ink-black tracking-[0.2em] font-bold flex items-center gap-3">
            <span class="w-1.5 h-6 bg-china-red shadow-[0_0_8px_rgba(209,73,73,0.5)]"></span>藏书阁
         </h2>
         <p class="text-[10px] text-ink-light tracking-widest mt-3 uppercase font-sans">Your Footprints & Favorites</p>
      </div>

      <!-- 玉简书轴 (Tabs) -->
      <div class="flex text-lg border-b border-ink-light/10 text-center tracking-[0.2em] relative bg-paper-light/50">
        <button 
          @click="activeMode = 'favorites'"
          class="flex-1 py-4 transition-all relative"
          :class="activeMode === 'favorites' ? 'text-china-red font-bold' : 'text-ink-light hover:text-ink-black'"
        >
          珍藏名录
          <div v-if="activeMode === 'favorites'" class="absolute bottom-0 left-0 w-full h-[2px] bg-china-red"></div>
        </button>
        <button 
          @click="activeMode = 'history'"
          class="flex-1 py-4 transition-all relative"
          :class="activeMode === 'history' ? 'text-ink-black font-bold' : 'text-ink-light hover:text-ink-black'"
        >
          过眼烟云
          <div v-if="activeMode === 'history'" class="absolute bottom-0 left-0 w-full h-[2px] bg-ink-black"></div>
        </button>
      </div>

      <!-- 陈列架 (内容滚动区) -->
      <div class="flex-1 overflow-y-auto w-full no-scrollbar px-6 py-6 space-y-4">
        
        <!-- 空状态 -->
        <div v-if="displayItems.length === 0" class="h-full flex flex-col items-center justify-center opacity-60">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-ink-light/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
           </svg>
           <p class="text-sm tracking-widest text-ink-light font-serif">阁楼空空如也归鸟不作声</p>
        </div>

        <!-- 扁平简册挂画 -->
        <div 
           v-for="(item, idx) in displayItems" 
           :key="idx" 
           class="flex bg-[#F6F4F0] border border-ink-light/5 rounded-sm overflow-hidden p-3 gap-4 items-center group shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-default relative"
        >
           <!-- 转发/分享按钮 -->
           <button 
              @click.stop="$emit('request-share', item)"
              class="absolute top-2 right-10 w-6 h-6 flex items-center justify-center bg-paper-light rounded-full shadow-sm text-ink-light hover:text-[#9C2727]/90 hover:bg-[#fff9f9] transition-all opacity-0 group-hover:opacity-100 z-10"
              title="飞鸽传书引荐给知音"
           >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
           </button>

           <!-- 撕毁本册 (取消收藏按钮) 仅藏书页展示 -->
           <button 
              v-if="activeMode === 'favorites'" 
              @click.stop="removeItem(item)"
              class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-paper-light rounded-full shadow-sm text-ink-light hover:text-china-red/80 transition-all opacity-0 group-hover:opacity-100 z-10"
              title="移出本卷"
           >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
           </button>

           <img :src="item.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'" class="w-14 h-14 object-cover rounded-[2px] shadow-sm border border-black/5" />
           
           <div class="flex-1 min-w-0 pr-6">
              <h4 class="text-ink-base font-bold text-[15px] tracking-wide truncate mb-1">{{ item.title }}</h4>
              <p class="text-xs text-ink-light tracking-widest truncate">{{ item.subtitle }}</p>
              <p class="text-[10px] text-ink-light/40 mt-1 font-sans tracking-wider">{{ formatTime(item.timestamp) }}</p>
           </div>
        </div>

      </div>
      
      <!-- 阁楼底座倒叙修饰 -->
      <div class="h-12 border-t border-ink-light/10 flex items-center justify-center bg-paper-base shrink-0">
         <span class="text-[10px] text-ink-light/40 tracking-[0.3em]">AUTHENTIC CHINA</span>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFootprints } from '../composables/useFootprints'

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['close', 'request-share'])

const activeMode = ref('favorites')
const { history, favorites, toggleFavorite } = useFootprints()

const displayItems = computed(() => {
  return activeMode.value === 'favorites' ? favorites.value : history.value
})

const formatTime = (ts) => {
  if(!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth()+1}月${d.getDate()}日 ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const removeItem = (item) => {
  if (confirm(`意决：要将『${item.title}』移出这珍籍卷吗？`)) {
    toggleFavorite(item)
  }
}
</script>

<style scoped>
@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-left {
  animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
