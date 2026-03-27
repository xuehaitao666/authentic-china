<template>
  <div class="w-full min-h-screen" style="background: #F5F1EA">
    <!-- 顶部返回导航 -->
    <div class="sticky top-0 z-[100] flex items-center justify-between px-10 py-5"
         style="background: rgba(245,241,234,0.9); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(42,35,24,0.06)">
      <button @click="$router.push('/')" class="flex items-center gap-2 font-serif text-sm tracking-widest transition-all hover:opacity-60" style="color: #2A2318">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        返还全图
      </button>
      <div class="text-center">
        <h1 class="font-serif text-2xl tracking-[0.5em]" style="color:#2A1F13">{{ provinceName }}</h1>
        <p class="text-[10px] tracking-[0.4em] opacity-40 mt-1 font-sans uppercase">Province · {{ cities.length }} Cities</p>
      </div>
      <div class="w-20"></div><!-- 占位 -->
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-40 gap-6">
      <div class="w-12 h-12 border-2 border-t-[#9C2727] border-[#9C2727]/20 rounded-full animate-spin"></div>
      <p class="font-serif text-sm tracking-[0.3em]" style="color:rgba(42,35,24,0.4)">正在展开卷轴...</p>
    </div>

    <!-- 卷轴主体 -->
    <WindingScrollPicker v-else :cities="cities" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import WindingScrollPicker from '../components/common/WindingScrollPicker.vue'

const route = useRoute()
const provinceName = ref(route.params.name || '陕西省')
const cities = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const encodedName = encodeURIComponent(provinceName.value)
    const { data } = await axios.get(`http://localhost:3000/api/v1/provinces/${encodedName}/cities`)
    cities.value = data.data || []
  } catch (e) {
    console.error('获取城市列表失败:', e)
  } finally {
    loading.value = false
  }
})
</script>
