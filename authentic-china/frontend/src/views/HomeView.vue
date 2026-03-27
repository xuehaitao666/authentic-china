<template>
  <div class="relative w-screen h-screen overflow-hidden bg-[#E2DFD8]/50">
    
    <!-- 动态水墨云朵 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <!-- 借用 SVG 路径滤印作为水墨云纹 -->
      <img src="https://api.iconify.design/ri:cloud-windy-fill.svg?color=%231A1C20" class="absolute top-[15%] -left-20 w-96 h-96 opacity-[0.03] animate-cloud-slow mix-blend-multiply blur-[2px]" />
      <img src="https://api.iconify.design/ri:cloud-windy-fill.svg?color=%231A1C20" class="absolute bottom-[20%] -right-32 w-[600px] h-[600px] opacity-[0.02] animate-cloud-slower mix-blend-multiply blur-[4px]" />
    </div>

    <!-- 悬浮搜索框 -->
    <div class="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md">
      <div class="glass-panel flex items-center px-6 py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-accent-red/40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-ink-light/70 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchKeyword" 
          @keydown.enter="handleSearch"
          type="text" 
          placeholder="搜索地道中国，如：南京" 
          class="bg-transparent border-none outline-none w-full text-ink-base placeholder-ink-light/50 font-medium text-lg"
        />
        <button v-show="searchKeyword" @click="searchKeyword=''" class="text-ink-light/50 hover:text-ink-base transition p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 左侧标题印章 -->
    <div class="absolute bottom-16 left-12 z-10 pointer-events-none hidden md:flex items-start gap-4">
      <div class="flex flex-col items-center">
        <h1 class="font-serif text-6xl text-ink-base opacity-95 tracking-[0.2em] mb-4 drop-shadow-sm" style="writing-mode: vertical-rl; text-orientation: upright;">
          地道中国
        </h1>
        <div class="w-8 h-8 bg-[#9C2727] flex items-center justify-center border border-white/50 shadow-md relative rotate-3 mt-2">
          <span class="text-paper-base text-xs font-serif font-black" style="writing-mode: vertical-rl">漫游</span>
        </div>
      </div>
      
      <!-- 瘦金体/楷体诗意副标题 -->
      <div class="pt-2 pl-2 border-l border-ink-light/20">
         <p class="text-xl text-ink-base/80 tracking-[0.4em] leading-loose opacity-80" 
            style="writing-mode: vertical-rl; text-orientation: upright; font-family: 'KaiTi', 'STKaiti', serif;">
            寻觅地道烟火<br>探访山河知音
         </p>
      </div>
    </div>

    <!-- ECharts 地图容器 -->
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const mapContainer = ref(null)
const searchKeyword = ref('')
let chartInstance = null

// 散点城市数据
const targetCities = [
  { name: '南京', value: [118.796877, 32.060255] },
  { name: '成都', value: [104.066541, 30.572269] },
  { name: '西安', value: [108.93984, 34.34127] }
]

const renderMap = async () => {
  chartInstance = echarts.init(mapContainer.value)
  
  // 显示极简水墨风加载提示
  chartInstance.showLoading({
    text: '研墨铺卷中...',
    color: '#A33B39',
    textColor: '#1A1C20',
    maskColor: 'rgba(244, 241, 236, 0.8)',
    zlevel: 0
  })

  try {
    // 拉取阿里 DataV 最新的中国 GeoJSON
    const res = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const chinaJson = await res.json()
    echarts.registerMap('china', chinaJson)
    
    // 配置 ECharts 交互行为与水墨样式
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if(params.componentSubType === 'effectScatter') {
             return `<div style="padding: 4px 8px; font-family: 'Inter', sans-serif;">
               <div style="font-weight: bold; color: #A33B39; font-size: 16px;">${params.name}</div>
               <div style="color: #666; font-size: 12px; margin-top: 4px;">点击开启长卷</div>
             </div>`
          }
          return ''
        },
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderColor: '#E2DFD8',
        borderWidth: 1,
        textStyle: { color: '#1A1C20' },
        extraCssText: 'border-radius: 8px; backdrop-filter: blur(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.1);'
      },
      geo: {
        map: 'china',
        roam: true, // 开启鼠标缩放/拖拽和移动端双指操作
        zoom: 1.2,
        scaleLimit: { min: 0.8, max: 5 }, // 防止缩放比例失控
        label: { show: false }, // 默认不显示省份名称
        itemStyle: {
          areaColor: '#e8e5df', // 浅米灰/宣纸感
          borderColor: '#b2afa8', // 淡水墨边界
          borderWidth: 1.5,
          shadowColor: 'rgba(120, 115, 110, 0.2)', // 给大地带来微弱立体的阴影
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 5
        },
        emphasis: {
          itemStyle: {
            areaColor: '#d6d2c8', // 悬浮时加深晕染
            borderColor: '#5c5855'
          },
          label: {
            show: true,
            color: '#1A1C20',
            fontFamily: 'Noto Serif SC, serif',
            fontWeight: 'bold'
          }
        }
      },
      series: [
        {
          name: '城市亮点',
          type: 'effectScatter', // 涟漪散点特效层
          coordinateSystem: 'geo',
          data: targetCities,
          symbolSize: 15,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            color: '#A33B39', // 朱砂红同心圆涟漪
            scale: 4
          },
          itemStyle: {
            color: '#A33B39',
            shadowBlur: 10,
            shadowColor: '#A33B39'
          },
          label: {
            show: true,
            formatter: '{b}',
            position: 'right',
            color: '#1A1C20',
            fontFamily: 'Noto Serif SC, serif',
            fontSize: 14,
            fontWeight: 'bold',
            distance: 10
          },
          emphasis: {
            scale: true,
            label: { 
               show: true,
               formatter: (params) => {
                 let icon = '';
                 if(params.name === '成都') icon = ' 🐼';
                 if(params.name === '西安') icon = ' 🧱';
                 if(params.name === '南京') icon = ' 🏯';
                 return params.name + icon;
               }
            }
          }
        }
      ]
    }
    
    chartInstance.hideLoading()
    chartInstance.setOption(option)
    
    // 将地图上省份区块或散点的点击统一与 router 连接
    chartInstance.on('click', (params) => {
      const targetName = params.name
      if (targetName) {
        router.push(`/city/${targetName}`)
      }
    })
    
  } catch (error) {
    console.error('Failed to load map data:', error)
    chartInstance.hideLoading()
  }
}

const handleResize = () => {
  chartInstance && chartInstance.resize()
}

// 搜索栏的软键盘或回车触发
const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    router.push(`/city/${keyword}`)
  }
}

onMounted(() => {
  renderMap()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener('resize', handleResize)
    chartInstance.dispose()
  }
})
</script>

<style scoped>
@keyframes floatSlow {
  0% { transform: translateY(0) translateX(0) scale(1); }
  33% { transform: translateY(-15px) translateX(10px) scale(1.05); }
  66% { transform: translateY(10px) translateX(-5px) scale(0.95); }
  100% { transform: translateY(0) translateX(0) scale(1); }
}

@keyframes floatSlower {
  0% { transform: translateY(0) translateX(0) rotate(0deg); }
  50% { transform: translateY(-20px) translateX(-20px) rotate(2deg); }
  100% { transform: translateY(0) translateX(0) rotate(0deg); }
}

.animate-cloud-slow {
  animation: floatSlow 20s ease-in-out infinite;
}

.animate-cloud-slower {
  animation: floatSlower 30s ease-in-out infinite;
}
</style>
