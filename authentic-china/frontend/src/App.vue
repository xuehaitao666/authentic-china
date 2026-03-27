<template>
  <!-- 藏书囊挂饰 (呼出藏经阁：足迹与收藏) 仅在游方模式显示 -->
  <button 
    v-if="route.path !== '/' && user?.role !== 'host'"
    @click="isFootprintsOpen = true"
    class="fixed bottom-10 left-8 z-[900] flex flex-col items-center justify-center gap-1.5 group"
    title="开启藏书阁"
  >
     <div class="w-12 h-12 bg-paper-base text-ink-base rounded-full flex items-center justify-center shadow-[0_5px_15px_-3px_rgba(0,0,0,0.15)] border border-ink-light/20 hover:border-china-red/50 hover:text-china-red hover:bg-[#fff9f9] transition-all transform group-hover:scale-105">
       <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
       </svg>
     </div>
     <span class="text-[10px] bg-paper-base/80 backdrop-blur-sm px-2 py-0.5 rounded-sm text-ink-base font-bold tracking-[0.2em] font-serif shadow-sm border border-ink-light/10 uppercase group-hover:text-china-red transition-colors">
       藏经阁
     </span>
  </button>

  <!-- 飞鸽传信 (右下方知音通信) 全局常驻(除非未进大门) -->
  <button 
    v-if="route.path !== '/'"
    @click="isSocialOpen = true"
    class="fixed bottom-10 right-8 z-[900] flex flex-col items-center justify-center gap-1.5 group"
    title="传书知音"
  >
     <div class="w-12 h-12 bg-paper-base text-ink-base rounded-full flex items-center justify-center shadow-[0_5px_15px_-3px_rgba(0,0,0,0.15)] border border-ink-light/20 hover:border-[#9C2727]/50 hover:text-[#9C2727] hover:bg-white transition-all transform group-hover:scale-105">
       <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
       </svg>
     </div>
     <span class="text-[10px] bg-paper-base/80 backdrop-blur-sm px-2 py-0.5 rounded-sm text-ink-base font-bold tracking-[0.2em] font-serif shadow-sm border border-ink-light/10 uppercase group-hover:text-[#9C2727] transition-colors">
       知音
     </span>
  </button>

  <!-- 全局退朝快捷按钮（呼出鉴权屏风已废弃，只保留退出） -->
  <button 
    v-if="route.path !== '/'"
    class="fixed top-8 right-8 z-[900] flex flex-col items-center justify-center gap-1 group font-serif"
    title="勘验身份"
  >
     <div class="relative cursor-pointer hover:-translate-y-1 transition-transform">
       <img :src="user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=100'" class="w-12 h-12 rounded-full border-2 border-china-red object-cover shadow-lg bg-paper-base" />
       
       <!-- 隐蔽的退朝/登出按钮 -->
       <span @click.stop="doLogout" class="absolute -top-1 -right-2 w-5 h-5 bg-ink-black text-paper-base rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-paper-base hover:bg-china-red shadow-md" title="卸甲退朝">
         ×
       </span>
     </div>
     
     <span class="text-[11px] bg-paper-light/70 backdrop-blur-sm px-2 py-0.5 rounded-sm text-ink-black font-bold tracking-[0.2em] mt-1 shadow-sm border border-ink-light/10">
       {{ `${user?.username || '佚名'}·${myRoleText}` }}
     </span>
  </button>

  <router-view v-slot="{ Component }">
    <transition name="scroll-unfold" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- 藏经阁组件挂载 -->
  <FootprintsDrawer :is-open="isFootprintsOpen" @close="isFootprintsOpen = false" @request-share="handleRequestShare" />

  <!-- 知音飞书组件挂载 -->
  <SocialDrawer :is-open="isSocialOpen" :pending-share="globalPendingShare" @close="isSocialOpen = false" @clear-share="globalPendingShare = null" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { useChat } from './composables/useChat'
import FootprintsDrawer from './components/FootprintsDrawer.vue'
import SocialDrawer from './components/SocialDrawer.vue'

const route = useRoute()
const router = useRouter()

const isFootprintsOpen = ref(false)
const isSocialOpen = ref(false)
const globalPendingShare = ref(null)

const { isAuth, user, myRoleText, clearAuth } = useAuth()
const { initSocket, disconnectSocket } = useChat()

// 监控登录态，连通天地风铃阵 (Socket.IO)
watch(isAuth, (val) => {
  if (val) initSocket()
  else disconnectSocket()
}, { immediate: true })

const handleRequestShare = (item) => {
  globalPendingShare.value = item
  isFootprintsOpen.value = false
  setTimeout(() => isSocialOpen.value = true, 300) // 延迟动画错开
}

const doLogout = () => {
  if (confirm("阁下确定要卸甲退朝，退离这神州大地么？")) {
    clearAuth()
    router.replace('/')
  }
}
</script>

<style>
/* 统筹过渡样式已移交给 index.css 维护 */
</style>
