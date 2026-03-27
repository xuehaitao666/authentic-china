<template>
  <div class="min-h-screen bg-paper-base flex flex-col relative overflow-x-hidden">
    
    <!-- 全局返回按钮 (神州) -->
    <button @click="$router.push('/tourist/map')" class="fixed top-8 left-8 flex items-center gap-2 text-paper-base hover:text-accent-red transition-colors z-50 glass-panel !text-ink-base px-5 py-2.5 rounded-full backdrop-blur-xl shadow-lg border-ink-light/10 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      神州
    </button>
    
    <!-- 顶端 Hero 封面层 -->
    <div class="relative w-full h-[75vh] overflow-hidden bg-ink-base flex items-center justify-center">
      <img 
        v-if="cityData.heroImage" 
        :src="cityData.heroImage" 
        class="absolute inset-0 w-full h-[130%] object-cover opacity-80"
        :style="{ transform: `translateY(${scrollY * 0.4}px)` }"
        alt="City Cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-paper-base via-transparent to-transparent"></div>
      
      <div class="relative z-10 text-center pointer-events-none" :style="{ opacity: 1 - scrollY / 600, transform: `translateY(${scrollY * 0.2}px)` }">
        <span class="text-sm tracking-[0.6em] text-accent-red font-serif mb-6 block drop-shadow-md">AUTHENTIC CHINA</span>
        <h1 class="text-8xl md:text-9xl font-serif text-paper-light mb-4 tracking-[0.1em] drop-shadow-2xl" style="text-shadow: 0 10px 30px rgba(0,0,0,0.6)">
          {{ $route.params.id }}
        </h1>
        <div class="w-20 h-0.5 bg-accent-red mx-auto mt-8 mb-8 opacity-80"></div>
        <p class="text-paper-light/90 text-2xl font-serif tracking-[0.3em] drop-shadow-md">
          掀画卷 · 阅名城
        </p>
      </div>
    </div>

    <!-- 内容装载等待层 -->
    <div v-if="isLoading" class="py-32 flex justify-center text-ink-light font-serif">
      <span class="animate-pulse tracking-widest text-lg">正在落墨铺陈...</span>
    </div>

    <!-- 长卷瀑布内容大区 -->
    <div v-else class="relative z-20 -mt-20 px-6 max-w-[1280px] mx-auto w-full pb-32 bg-paper-base rounded-t-[3rem] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.1)] pt-16">
      
      <!-- 寻景区块 -->
      <section class="mb-32">
        <div class="flex items-end mb-16 border-b border-ink-light/20 pb-4">
          <h2 class="text-6xl font-serif text-ink-base mr-6 tracking-wide drop-shadow-sm">寻景</h2>
          <p class="text-ink-light tracking-[0.2em] text-sm mb-2">避开人潮的私房视角 / SIGHTSEEING</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16">
          <ContentCard v-for="exp in groupedExperiences.sightseeing" :key="exp.id" :experience="exp" />
        </div>
      </section>

      <!-- 觅食区块 -->
      <section class="mb-32">
        <div class="flex items-end mb-16 border-b border-ink-light/20 pb-4">
          <h2 class="text-6xl font-serif text-ink-base mr-6 tracking-wide drop-shadow-sm">觅食</h2>
          <p class="text-ink-light tracking-[0.2em] text-sm mb-2">最地道的那一口烟火 / FOOD</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16">
          <ContentCard v-for="exp in groupedExperiences.food" :key="exp.id" :experience="exp" />
        </div>
      </section>

      <!-- 听故区块 -->
      <section class="mb-32">
        <div class="flex items-end mb-16 border-b border-ink-light/20 pb-4">
          <h2 class="text-6xl font-serif text-ink-base mr-6 tracking-wide drop-shadow-sm">听故</h2>
          <p class="text-ink-light tracking-[0.2em] text-sm mb-2">听这片土地结出的故事 / STORY</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16">
          <ContentCard v-for="exp in groupedExperiences.story" :key="exp.id" :experience="exp" />
        </div>
      </section>
      
      <!-- 遇人区块 (新增地道主家系统展示) -->
      <section class="mb-12 pt-16 bg-ink-light/5 -mx-6 px-6 sm:-mx-12 sm:px-12 py-16 rounded-3xl relative">
        <div class="absolute -top-4 right-12 w-20 h-20 text-accent-red opacity-10 font-serif text-9xl">隐</div>
        <div class="flex items-end mb-12 border-b border-ink-base/10 pb-4">
          <h2 class="text-6xl font-serif text-accent-red mr-6 tracking-wide drop-shadow-md">遇人</h2>
          <p class="text-ink-base tracking-[0.2em] text-sm mb-2 font-bold">在这座城等你的烟火主家 / LOCAL HOST</p>
        </div>
        
        <!-- 横向无限回廊主卷 -->
        <div v-if="cityData.hosts && cityData.hosts.length > 0" class="flex overflow-x-auto gap-10 pb-10 no-scrollbar snap-x snap-mandatory pr-10">
          <div 
             v-for="host in cityData.hosts" 
             :key="host.id" 
             class="snap-center sm:snap-start"
             @click="openHostDrawer(host)"
          >
            <HostCard :host="host" />
          </div>
        </div>
        
        <!-- 虚位以待 空状态 (当数组为0或者假数据没有发配地主) -->
        <div v-else class="flex flex-col items-center justify-center py-20 px-8 bg-paper-base/50 rounded-xl border border-dashed border-ink-light/20 mx-auto max-w-3xl">
          <div class="relative w-20 h-20 mb-6 flex items-center justify-center">
            <div class="absolute inset-0 bg-china-red/5 rounded-full animate-ping"></div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-ink-light/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 class="text-[28px] font-serif text-ink-black mb-3 tracking-[0.2em] relative">
            <span class="absolute -left-6 -top-2 text-china-red/30 text-5xl font-serif">"</span>
            虚位以待
          </h3>
          <p class="text-ink-light tracking-widest text-sm mb-10 text-center leading-relaxed">
            长街漫漫，这家名城尚无向导。<br/>这座城市的烟火故事，正等您来抒写。
          </p>
          <button class="bg-transparent border border-china-red text-china-red hover:bg-china-red hover:text-paper-light px-8 py-3 rounded-sm font-serif transition-colors tracking-[0.2em] text-sm flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            开门迎客
          </button>
        </div>
      </section>
      
    </div>
    
    <!-- 后端联通的挂壁抽屉核心组件 -->
    <HostDrawer 
      :is-open="isDrawerOpen"
      :host="selectedHost"
      :city-id="cityData.city_id"
      @close="isDrawerOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { getCityDetail } from '../api/city'
import ContentCard from '../components/ContentCard.vue'
import HostCard from '../components/HostCard.vue'
import HostDrawer from '../components/HostDrawer.vue'
import { useFootprints } from '../composables/useFootprints'

const route = useRoute()
const { addHistory } = useFootprints()
const isLoading = ref(true)
const cityData = ref({})
const scrollY = ref(0)
const isDrawerOpen = ref(false)
const selectedHost = ref(null)

const groupedExperiences = computed(() => {
  const exps = cityData.value.experiences || []
  return {
    sightseeing: exps.filter(e => e.type === 'sightseeing'),
    food: exps.filter(e => e.type === 'food'),
    story: exps.filter(e => e.type === 'story')
  }
})

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const openHostDrawer = (host) => {
  selectedHost.value = host
  isDrawerOpen.value = true
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  const res = await getCityDetail(route.params.id)
  if (res && res.code === 200) {
    cityData.value = res.data
    // 城市挂卷渲染成功：将本城烙印进您的「过眼烟云」史册
    if(res.data) {
      addHistory({
        id: res.data.city_id,
        type: 'city',
        title: res.data.cityName,
        image: res.data.heroImage || '',
        subtitle: '城池名卷'
      })
    }
  }
  isLoading.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
