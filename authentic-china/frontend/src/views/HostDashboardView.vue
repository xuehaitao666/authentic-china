<template>
  <div class="flex h-screen overflow-hidden bg-[#F4F1EC] font-sans">
    
    <!-- ===================== 左侧水墨导航侧边栏 ===================== -->
    <aside
      class="relative z-20 flex flex-col bg-[#1A1C20] text-paper-base shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :style="{ width: sidebarExpanded ? '240px' : '72px' }"
    >
      <!-- 顶部印章 Logo -->
      <div class="flex items-center h-20 px-4 border-b border-white/10 shrink-0 overflow-hidden">
        <div class="w-10 h-10 shrink-0 bg-china-red flex items-center justify-center rounded-sm rotate-3 shadow-lg">
          <span class="font-serif text-white text-lg font-black">主</span>
        </div>
        <div class="ml-4 overflow-hidden whitespace-nowrap transition-all duration-500" :style="{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? '160px' : '0' }">
          <p class="font-serif text-base tracking-[0.2em] text-white">府衙大盘</p>
          <p class="text-[10px] text-white/40 tracking-[0.3em] font-sans mt-0.5">HOST DASHBOARD</p>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 py-6 space-y-1 px-2 overflow-hidden">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="activePanel = item.id"
          class="w-full flex items-center gap-4 px-3 py-3.5 rounded-sm transition-all duration-300 group relative overflow-hidden"
          :class="activePanel === item.id 
            ? 'bg-china-red text-white shadow-[0_5px_20px_-5px_rgba(156,39,39,0.5)]' 
            : 'text-white/50 hover:text-white hover:bg-white/5'"
        >
          <!-- 激活时的左线 -->
          <span v-if="activePanel === item.id" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-full"></span>
          
          <span class="w-6 h-6 shrink-0 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-html="item.icon"></svg>
          </span>
          <span 
            class="text-sm tracking-widest font-serif whitespace-nowrap transition-all duration-500 overflow-hidden"
            :style="{ opacity: sidebarExpanded ? 1 : 0, maxWidth: sidebarExpanded ? '180px' : '0' }"
          >
            {{ item.label }}
          </span>
          
          <!-- 收起时的 tooltip -->
          <div v-if="!sidebarExpanded" class="absolute left-full ml-3 px-3 py-1.5 bg-ink-base text-white text-xs rounded-sm tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50 font-serif">
            {{ item.label }}
            <span class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-ink-base"></span>
          </div>
        </button>
      </nav>

      <!-- 底部用户信息 + 折叠按钮 -->
      <div class="border-t border-white/10 p-3 shrink-0">
        <div class="flex items-center gap-3 overflow-hidden mb-3">
          <img :src="user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=100'" class="w-9 h-9 rounded-full border border-white/20 object-cover shrink-0" />
          <div class="overflow-hidden whitespace-nowrap transition-all duration-500" :style="{ opacity: sidebarExpanded ? 1 : 0, maxWidth: sidebarExpanded ? '160px' : '0' }">
            <p class="text-sm text-white font-bold tracking-widest truncate">{{ user?.username }}</p>
            <p class="text-[10px] text-white/40 tracking-wider">神州主家</p>
          </div>
        </div>
        
        <!-- 折叠 / 展开 按钮 -->
        <button
          @click="sidebarExpanded = !sidebarExpanded"
          class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-xs tracking-widest"
        >
          <svg class="w-4 h-4 transition-transform duration-500" :class="sidebarExpanded ? '' : 'rotate-180'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <span v-if="sidebarExpanded" class="font-serif">收卷</span>
        </button>
      </div>
    </aside>

    <!-- ===================== 右侧主内容区 ===================== -->
    <main class="flex-1 overflow-hidden flex flex-col min-w-0">
      
      <!-- 顶栏 -->
      <header class="h-16 shrink-0 bg-white/60 backdrop-blur-md border-b border-ink-light/10 flex items-center px-8 gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <h1 class="text-xl font-serif text-ink-base tracking-[0.2em]">{{ currentNavItem?.label }}</h1>
        <span class="text-xs text-ink-light/60 tracking-widest font-sans border border-ink-light/20 px-2 py-0.5 rounded-sm bg-paper-base/80">{{ currentNavItem?.subtitle }}</span>
        <div class="flex-1"></div>
        <span class="text-xs text-ink-light/50 tracking-wider font-sans">{{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
      </header>

      <!-- 面板切换区域 -->
      <div class="flex-1 overflow-hidden relative">
        <transition name="panel-fade" mode="out-in">
          <!-- 主家概览 -->
          <OverviewPanel v-if="activePanel === 'overview'" :user="user" :token="token" @navigate="activePanel = $event" key="overview" />
          <!-- 地道秘籍管理 -->
          <ListingPanel v-else-if="activePanel === 'listing'" :user="user" :token="token" key="listing" />
          <!-- 知音畅聊 -->
          <ChatPanel v-else-if="activePanel === 'chat'" :user="user" :token="token" key="chat" />
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import OverviewPanel from '../components/host/OverviewPanel.vue'
import ListingPanel from '../components/host/ListingPanel.vue'
import ChatPanel from '../components/host/ChatPanel.vue'

const { user, token } = useAuth()

const sidebarExpanded = ref(true)
const activePanel = ref('overview')

const navItems = [
  {
    id: 'overview',
    label: '主家概览',
    subtitle: 'OVERVIEW',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />'
  },
  {
    id: 'listing',
    label: '地道秘籍',
    subtitle: 'MY LISTING',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />'
  },
  {
    id: 'chat',
    label: '知音畅聊',
    subtitle: 'CHAT',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />'
  }
]

const currentNavItem = computed(() => navItems.find(i => i.id === activePanel.value))
</script>

<style scoped>
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.panel-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
