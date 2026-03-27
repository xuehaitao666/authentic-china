<template>
  <div
    ref="containerRef"
    class="relative w-full overflow-hidden"
    :style="{ minHeight: totalHeight + 'px', background: '#F5F1EA' }"
  >
    <!-- 宣纸底纹 -->
    <div class="absolute inset-0 pointer-events-none opacity-20"
         style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper-2.png')"></div>

    <!-- ===== 墨迹晕染全屏过场遮罩 ===== -->
    <Transition name="ink-splash">
      <div v-if="splashing"
           class="fixed inset-0 pointer-events-none"
           style="z-index: 9999; background: radial-gradient(circle at var(--ink-x) var(--ink-y), rgba(20,12,6,0.97) 0%, rgba(20,12,6,0.6) 40%, transparent 80%)"
      >
        <!-- 中心缩放白点 (城市名残影) -->
        <div class="absolute transition-all"
             :style="{ top: 'var(--ink-y)', left: 'var(--ink-x)',
               transform: 'translate(-50%, -50%) scale(' + splashScale + ')',
               opacity: 1 - splashScale * 0.1 }">
          <span class="font-serif text-4xl tracking-widest"
                style="color: rgba(212,133,106,0.8); writing-mode: vertical-rl;">
            {{ splashCityName }}
          </span>
        </div>
      </div>
    </Transition>

    <!-- 层1：远山（视差底层） -->
    <div class="absolute inset-x-0 pointer-events-none" style="bottom: 0; z-index: 1"
         :style="{ transform: `translateY(${scrollProgress * 60}px)` }">
      <svg width="100%" height="280" viewBox="0 0 1200 280" preserveAspectRatio="xMidYMax meet" fill="none">
        <path d="M0 250 Q120 60 250 160 Q380 250 500 90 Q620 10 740 150 Q860 260 980 80 Q1100 10 1200 150 L1200 280 L0 280Z"
              fill="rgba(42,35,24,0.025)" />
        <path d="M0 268 Q160 120 320 210 Q480 270 640 140 Q800 60 960 180 Q1080 260 1200 190 L1200 280 L0 280Z"
              fill="rgba(42,35,24,0.035)" />
      </svg>
    </div>

    <!-- 层2：前景浮云（z最高，遮挡路径） -->
    <div
      v-for="(cloud, ci) in clouds" :key="'cloud-' + ci"
      class="absolute pointer-events-none"
      :style="{
        top: cloud.top, left: cloud.x, opacity: cloud.opacity,
        zIndex: 30,
        transform: `translateX(${scrollProgress * cloud.parallaxFactor * 800}px)`,
        transition: 'transform 0.15s linear'
      }"
    >
      <svg :width="cloud.w" :height="cloud.h" viewBox="0 0 200 80" fill="rgba(245,241,234,0.93)">
        <ellipse cx="60" cy="50" rx="50" ry="25"/>
        <ellipse cx="120" cy="42" rx="65" ry="32"/>
        <ellipse cx="90" cy="38" rx="40" ry="20"/>
      </svg>
    </div>

    <!-- 层3：S 型主路径 SVG -->
    <svg
      class="absolute inset-0 w-full pointer-events-none"
      :height="totalHeight"
      :viewBox="`0 0 800 ${viewBoxHeight}`"
      preserveAspectRatio="none"
      style="top:0;left:0;z-index:5"
    >
      <defs>
        <linearGradient id="pg3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(42,35,24,0.04)"/>
          <stop offset="45%" stop-color="rgba(42,35,24,0.10)"/>
          <stop offset="100%" stop-color="rgba(42,35,24,0.04)"/>
        </linearGradient>
        <filter id="ib3">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" result="d"/>
          <feGaussianBlur in="d" stdDeviation="1.2"/>
        </filter>
      </defs>
      <!-- 粗晕染 -->
      <path :d="svgPath" fill="none" stroke="url(#pg3)" stroke-width="32" stroke-linecap="round" filter="url(#ib3)"/>
      <!-- 墨水流动：已绘段 -->
      <path :d="svgPath" fill="none"
            stroke="rgba(42,35,24,0.15)" stroke-width="2.5" stroke-linecap="round"
            :stroke-dasharray="pathLength"
            :stroke-dashoffset="inkDashOffset"
            style="transition: stroke-dashoffset 0.35s ease-out"/>
      <!-- 未绘虚线 -->
      <path :d="svgPath" fill="none" stroke="rgba(42,35,24,0.05)" stroke-width="2" stroke-dasharray="5 9"/>
      <!-- 驿站红点 -->
      <circle v-for="(wp,i) in waypoints" :key="'wp'+i"
              :cx="wp.svgX" :cy="wp.svgY" r="7"
              fill="rgba(156,39,39,0.2)" stroke="rgba(156,39,39,0.35)" stroke-width="1"/>
    </svg>

    <!-- 层4：近松/怪石 -->
    <template v-for="(city, i) in cities" :key="'deco-' + i">
      <div class="absolute pointer-events-none transition-opacity duration-700"
           :class="visibleCities.has(i) ? 'opacity-[0.18]' : 'opacity-0'"
           :style="pineStoneDeco(i)" style="z-index:8">
        <svg v-if="i % 3 !== 2" width="44" height="72" viewBox="0 0 44 72" fill="none">
          <line x1="22" y1="72" x2="22" y2="28" stroke="#2A2318" stroke-width="2"/>
          <path d="M10 46 Q22 16 34 46Z" fill="rgba(42,35,24,0.65)"/>
          <path d="M13 58 Q22 30 31 58Z" fill="rgba(42,35,24,0.45)"/>
        </svg>
        <svg v-else width="56" height="48" viewBox="0 0 56 48" fill="none">
          <path d="M8 43 Q4 18 19 8 Q28 3 38 10 Q52 18 49 38 Q43 48 24 46Z"
                fill="rgba(42,35,24,0.10)" stroke="rgba(42,35,24,0.35)" stroke-width="1.5"/>
          <path d="M18 33 Q20 26 26 28" stroke="rgba(42,35,24,0.3)" stroke-width="1" fill="none"/>
        </svg>
      </div>
    </template>

    <!-- 层5：城市节点（可点击） -->
    <div
      v-for="(city, i) in cities" :key="'city-' + city.name"
      class="absolute flex items-center cursor-pointer group"
      style="z-index:20"
      :style="cityStyle(i)"
      :data-idx="i"
      :ref="el => { if(el) { cityRefs[i] = el; observeCity(el, i) } }"
      @click.stop="handleCityClick($event, city)"
    >
      <!-- 左侧 (偶数) -->
      <template v-if="i % 2 === 0">
        <div class="transition-all duration-700"
             :class="visibleCities.has(i) ? 'opacity-100' : 'opacity-20'"
             :style="{ writingMode:'vertical-rl', textOrientation:'upright',
               animation: visibleCities.has(i) ? 'swingHang 6s ease-in-out infinite' : 'none' }">
          <span class="font-serif tracking-[0.2em] transition-all duration-700 group-hover:text-china-red"
                :style="{ fontSize: visibleCities.has(i) ? '28px':'22px',
                          color: visibleCities.has(i) ? '#2A1F13':'rgba(42,31,19,0.3)' }">
            {{ city.name.replace('市','') }}
          </span>
        </div>
        <div class="ml-3 transition-all duration-700"
             :class="visibleCities.has(i) ? 'opacity-50':'opacity-0'">
          <div class="w-7 h-7 border border-[#9C2727]/50 flex items-center justify-center rotate-3 group-hover:border-[#9C2727]">
            <span class="font-serif text-[7px] leading-tight text-center" style="color:#9C2727">{{ sealChar(city) }}</span>
          </div>
        </div>
      </template>
      <!-- 右侧 (奇数) -->
      <template v-else>
        <div class="mr-3 transition-all duration-700"
             :class="visibleCities.has(i) ? 'opacity-50':'opacity-0'">
          <div class="w-7 h-7 border border-[#9C2727]/50 flex items-center justify-center -rotate-3 group-hover:border-[#9C2727]">
            <span class="font-serif text-[7px] leading-tight text-center" style="color:#9C2727">{{ sealChar(city) }}</span>
          </div>
        </div>
        <div class="transition-all duration-700"
             :class="visibleCities.has(i) ? 'opacity-100' : 'opacity-20'"
             :style="{ writingMode:'vertical-rl', textOrientation:'upright',
               animation: visibleCities.has(i) ? 'swingHang 5s ease-in-out infinite' : 'none' }">
          <span class="font-serif tracking-[0.2em] transition-all duration-700 group-hover:text-china-red"
                :style="{ fontSize: visibleCities.has(i) ? '28px':'22px',
                          color: visibleCities.has(i) ? '#2A1F13':'rgba(42,31,19,0.3)' }">
            {{ city.name.replace('市','') }}
          </span>
        </div>
      </template>
    </div>

    <!-- Slot -->
    <div class="relative" style="z-index:10"><slot /></div>

    <!-- 底部印章 -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-15 pointer-events-none" style="z-index:20">
      <div class="w-9 h-9 border-[1.5px] flex items-center justify-center rotate-3 mb-2" style="border-color:#9C2727">
        <span class="font-serif text-[9px] leading-tight text-center" style="color:#9C2727">山<br/>径</span>
      </div>
      <p class="font-serif text-[9px] tracking-[0.5em] uppercase" style="color:#2A2318">Winding Path</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  cities: { type: Array, default: () => [] }
})

const router = useRouter()
const containerRef = ref(null)
const cityRefs = ref([])
const visibleCities = ref(new Set())
const scrollY = ref(0)
const pathLength = ref(5000)

// ===== 墨迹晕染过场 =====
const splashing = ref(false)
const splashScale = ref(0)
const splashCityName = ref('')
let splashTimer = null

const handleCityClick = (event, city) => {
  // 获取点击坐标（相对视窗）
  const x = event.clientX
  const y = event.clientY

  splashCityName.value = city.name.replace('市', '')
  splashing.value = true
  splashScale.value = 0

  // 设置 CSS 变量控制晕染起点
  document.documentElement.style.setProperty('--ink-x', `${x}px`)
  document.documentElement.style.setProperty('--ink-y', `${y}px`)

  // 放大动画
  const animStart = performance.now()
  const animDuration = 700 // ms

  const step = (now) => {
    const progress = Math.min((now - animStart) / animDuration, 1)
    splashScale.value = progress * 3

    // 在 60% 时（墨最浓）执行路由跳转
    if (progress >= 0.6 && !splashTimer) {
      splashTimer = setTimeout(() => {
        router.push(`/city/${city.name}`)
      }, 0)
    }

    if (progress < 1) requestAnimationFrame(step)
    else {
      // 动画结束，清理
      setTimeout(() => {
        splashing.value = false
        splashScale.value = 0
        splashTimer = null
      }, 400)
    }
  }
  requestAnimationFrame(step)
}

// ===== 布局与动画 =====
const SPACING = 280
const PADDING_BOTTOM = 200

const totalHeight = computed(() => Math.max(props.cities.length, 5) * SPACING + PADDING_BOTTOM)
const viewBoxHeight = computed(() => totalHeight.value)

const scrollProgress = computed(() => {
  return Math.min(scrollY.value / Math.max(totalHeight.value - (typeof window !== 'undefined' ? window.innerHeight : 800), 1), 1)
})

const inkDashOffset = computed(() => {
  return pathLength.value * Math.max(0, 1 - scrollProgress.value * 1.15)
})

const svgPath = computed(() => {
  const count = Math.max(props.cities.length, 5)
  const h = viewBoxHeight.value
  const step = h / (count + 1)
  const pts = []
  for (let i = 0; i <= count + 1; i++) {
    const y = i * step
    const x = i % 2 === 0 ? 400 : (i % 4 === 1 ? 590 : 210)
    pts.push({ x, y })
  }
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], curr = pts[i]
    const mx = (prev.x + curr.x) / 2
    d += ` C ${mx} ${prev.y}, ${mx} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
})

const waypoints = computed(() => {
  const h = viewBoxHeight.value
  const step = h / (props.cities.length + 1)
  return props.cities.map((_, i) => ({
    svgX: i % 2 === 0 ? 590 : 210,
    svgY: (i + 1) * step
  }))
})

const cityStyle = (i) => {
  const count = Math.max(props.cities.length, 5)
  const h = totalHeight.value
  const step = h / (count + 1)
  const baseY = (i + 1) * step
  const isLeft = i % 2 === 0
  return {
    top: `${baseY - 65}px`,
    left: isLeft ? '8%' : 'auto',
    right: isLeft ? 'auto' : '8%',
    display: 'flex',
    alignItems: 'center'
  }
}

const pineStoneDeco = (i) => {
  const count = Math.max(props.cities.length, 5)
  const h = totalHeight.value
  const step = h / (count + 1)
  const baseY = (i + 1) * step
  const isLeft = i % 2 === 0
  return { top: `${baseY - 50}px`, left: isLeft ? '62%' : '28%' }
}

const sealChar = (city) => (city.ancient_name || city.name).slice(0, 2)

const clouds = [
  { top: '10%', x: '-4%', w: 280, h: 90, opacity: 0.88, parallaxFactor: -0.02 },
  { top: '36%', x: '55%', w: 220, h: 75, opacity: 0.84, parallaxFactor: 0.018 },
  { top: '62%', x: '8%',  w: 260, h: 85, opacity: 0.86, parallaxFactor: -0.015 },
  { top: '84%', x: '64%', w: 200, h: 70, opacity: 0.82, parallaxFactor: 0.025 },
]

// ===== 滚动 & IntersectionObserver =====
let observer = null

const onScroll = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    scrollY.value = Math.max(0, -rect.top)
  }
}

const observeCity = (el, i) => {
  if (el && observer) {
    el.dataset.idx = String(i)
    observer.observe(el)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = Number(entry.target.dataset.idx)
      if (!isNaN(idx)) {
        const next = new Set(visibleCities.value)
        entry.isIntersecting ? next.add(idx) : next.delete(idx)
        visibleCities.value = next
      }
    })
  }, { threshold: 0.25 })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer) observer.disconnect()
  if (splashTimer) clearTimeout(splashTimer)
})
</script>

<style scoped>
/* 墨迹晕染入场 */
.ink-splash-enter-active { transition: opacity 0.1s ease; }
.ink-splash-leave-active { transition: opacity 0.6s ease; }
.ink-splash-enter-from  { opacity: 0; }
.ink-splash-leave-to    { opacity: 0; }

@keyframes swingHang {
  0%,100% { transform: rotate(0deg); }
  25%      { transform: rotate(-1.5deg); }
  75%      { transform: rotate(1.5deg); }
}
</style>
