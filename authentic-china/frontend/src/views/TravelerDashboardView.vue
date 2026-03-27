<template>
  <div class="flex h-screen overflow-hidden font-sans" style="background: #F5F1EA">

    <!-- ===================== 左侧·水墨行旅侧边栏 ===================== -->
    <aside
      class="relative z-20 flex flex-col shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
      :style="{
        width: sidebarExpanded ? '260px' : '76px',
        background: 'linear-gradient(175deg, #FAF8F5 0%, #F0EBE1 100%)',
        borderRight: '1px solid rgba(90,80,65,0.12)',
        boxShadow: '4px 0 30px rgba(90,80,65,0.06)'
      }"
    >
      <!-- 宣纸底纹 -->
      <div class="absolute inset-0 opacity-30 pointer-events-none" style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper-2.png')"></div>

      <!-- 顶部·山水题记 -->
      <div class="relative z-10 flex items-center gap-4 h-24 px-4 overflow-hidden" style="border-bottom: 1px solid rgba(90,80,65,0.1)">
        <!-- 朱砂印章 -->
        <div class="w-11 h-11 shrink-0 flex items-center justify-center rounded-sm shadow-md" style="background: #9C2727; transform: rotate(-3deg)">
          <span class="font-serif text-white text-xl font-black tracking-tight">游</span>
        </div>
        <!-- 行纪题名 -->
        <div class="overflow-hidden whitespace-nowrap transition-all duration-500" :style="{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? '180px' : '0' }">
          <p class="font-serif text-[17px] tracking-[0.3em]" style="color: #2A2318">游者行纪</p>
          <p class="text-[10px] tracking-[0.4em] mt-0.5 font-sans" style="color: #9A8B78">TRAVELER · CHRONICLE</p>
        </div>
      </div>

      <!-- 导航卷轴菜单 -->
      <nav class="relative z-10 flex-1 py-8 px-3 space-y-1.5 overflow-hidden">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="activePanel = item.id"
          class="w-full flex items-center gap-4 px-3 py-4 rounded-sm transition-all duration-400 group relative"
          :style="activePanel === item.id ? {
            background: 'linear-gradient(90deg, rgba(156,39,39,0.08) 0%, rgba(156,39,39,0.02) 100%)',
            borderLeft: '2px solid #9C2727',
          } : {
            borderLeft: '2px solid transparent',
          }"
        >
          <!-- 人文图标 -->
          <span class="w-8 h-8 shrink-0 flex items-center justify-center transition-all duration-300"
                :style="activePanel === item.id ? { color: '#9C2727' } : { color: '#9A8B78' }">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-html="item.icon" stroke-width="1.3"></svg>
          </span>

          <!-- 诗意导航名 -->
          <div class="overflow-hidden whitespace-nowrap transition-all duration-500 text-left" :style="{ opacity: sidebarExpanded ? 1 : 0, maxWidth: sidebarExpanded ? '200px' : '0' }">
            <p class="text-sm tracking-[0.2em] font-serif transition-colors duration-300"
               :style="activePanel === item.id ? { color: '#2A2318', fontWeight: '700' } : { color: '#7A6E62' }">
              {{ item.label }}
            </p>
            <p class="text-[10px] tracking-[0.3em] mt-0.5 font-sans" style="color: #B0A090">{{ item.sub }}</p>
          </div>

          <!-- 收起时飞出的 tooltip -->
          <transition name="tooltip-pop">
            <div v-if="!sidebarExpanded" class="absolute left-full ml-4 px-4 py-2 bg-[#2A2318] text-white text-xs rounded-sm tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50 font-serif" style="top: 50%; transform: translateY(-50%);">
              {{ item.label }}
              <span class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent" style="border-right-color: #2A2318"></span>
            </div>
          </transition>
        </button>
      </nav>

      <!-- 底部：快速前往山河地图 -->
      <div class="relative z-10 p-4 space-y-2" style="border-top: 1px solid rgba(90,80,65,0.1)">
        <button
          @click="$router.push('/tourist/map')"
          class="w-full flex items-center gap-3 px-3 py-3 rounded-sm transition-all group"
          style="background: rgba(90,80,65,0.04)"
          onmouseenter="this.style.background='rgba(156,39,39,0.06)'"
          onmouseleave="this.style.background='rgba(90,80,65,0.04)'"
        >
          <span class="w-8 h-8 shrink-0 flex items-center justify-center" style="color: #9A8B78">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </span>
          <div class="overflow-hidden whitespace-nowrap" :style="{ opacity: sidebarExpanded ? 1 : 0, maxWidth: sidebarExpanded ? '180px' : '0', transition: 'all 0.5s' }">
            <p class="text-xs tracking-widest font-serif" style="color: #7A6E62">神州大图</p>
            <p class="text-[10px] font-sans mt-0.5" style="color: #B0A090">纵览山河版图</p>
          </div>
        </button>

        <!-- 收卷按钮 -->
        <button
          @click="sidebarExpanded = !sidebarExpanded"
          class="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm transition-all text-xs tracking-widest"
          style="color: #9A8B78; background: rgba(90,80,65,0.04)"
          onmouseenter="this.style.background='rgba(90,80,65,0.1)'"
          onmouseleave="this.style.background='rgba(90,80,65,0.04)'"
        >
          <svg class="w-4 h-4 transition-transform duration-500" :class="sidebarExpanded ? '' : 'rotate-180'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <span v-if="sidebarExpanded" class="font-serif">收卷</span>
        </button>
      </div>
    </aside>

    <!-- ===================== 右侧·叙事画卷展开区 ===================== -->
    <main class="flex-1 overflow-hidden flex flex-col min-w-0">
      
      <!-- 顶栏·山水题跋 -->
      <header class="h-16 shrink-0 flex items-center px-10 gap-5 relative" style="background: rgba(250,248,245,0.8); backdropFilter: 'blur(12px)'; borderBottom: '1px solid rgba(90,80,65,0.08)'">
        <!-- 刻度线装饰 -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style="background: #9C2727"></div>
        
        <h1 class="font-serif text-lg tracking-[0.3em]" style="color: #2A2318">{{ currentNavItem?.label }}</h1>
        <span class="text-[10px] tracking-[0.4em] font-sans px-3 py-1 rounded-sm" style="color: #9A8B78; background: rgba(90,80,65,0.06); border: 1px solid rgba(90,80,65,0.1)">{{ currentNavItem?.sub }}</span>
        
        <div class="flex-1"></div>
        
        <!-- 用户胶印 -->
        <div class="flex items-center gap-3">
          <img :src="user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=100'" class="w-9 h-9 rounded-full border-2 object-cover" style="border-color: rgba(156,39,39,0.3)" />
          <div>
            <p class="text-sm font-serif tracking-widest" style="color: #2A2318">{{ user?.username }}</p>
            <p class="text-[10px] tracking-widest font-sans" style="color: #9A8B78">游方客</p>
          </div>
        </div>
      </header>

      <!-- 面板切换·画卷展开动效 -->
      <div class="flex-1 overflow-hidden relative">
        <transition name="scroll-unfurl" mode="out-in">
          <ChroniclePanel v-if="activePanel === 'chronicle'" :user="user" key="chronicle" @navigate="activePanel = $event" />
          <StoriesPanel   v-else-if="activePanel === 'stories'"   :user="user" key="stories" />
          <HistoryPanel   v-else-if="activePanel === 'history'"   :user="user" key="history" />
          <SettingsPanel  v-else-if="activePanel === 'settings'"  :user="user" :token="token" key="settings" />
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import ChroniclePanel from '../components/traveler/ChroniclePanel.vue'
import StoriesPanel   from '../components/traveler/StoriesPanel.vue'
import HistoryPanel   from '../components/traveler/HistoryPanel.vue'
import SettingsPanel  from '../components/traveler/SettingsPanel.vue'

const { user, token } = useAuth()
const sidebarExpanded = ref(true)
const activePanel = ref('chronicle')

const navItems = [
  {
    id: 'chronicle',
    label: '行纪卷轴',
    sub: 'MY CHRONICLE',
    // 羊皮卷轴图标
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`
  },
  {
    id: 'stories',
    label: '锦囊故事',
    sub: 'MY STORIES',
    // 锦囊/包裹图标
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>`
  },
  {
    id: 'history',
    label: '寻山访水',
    sub: 'MY JOURNEY',
    // 古罗盘图标
    icon: `<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`
  },
  {
    id: 'settings',
    label: '墨印章台',
    sub: 'SETTINGS',
    // 墨锭/印鑑图标
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>`
  }
]

const currentNavItem = computed(() => navItems.find(i => i.id === activePanel.value))
</script>

<style scoped>
/* 画卷徐徐铺开动效 */
.scroll-unfurl-enter-active {
  transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top center;
}
.scroll-unfurl-leave-active {
  transition: all 0.3s ease-in;
}
.scroll-unfurl-enter-from {
  opacity: 0;
  transform: translateY(16px) scaleY(0.97);
}
.scroll-unfurl-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.tooltip-pop-enter-active { transition: opacity 0.2s ease; }
.tooltip-pop-enter-from { opacity: 0; }
</style>
