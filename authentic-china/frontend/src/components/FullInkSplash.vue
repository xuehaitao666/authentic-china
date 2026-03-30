<template>
  <Transition name="splash-fade">
    <div v-if="isSplashActive" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/5 overflow-hidden pointer-events-none">
      
      <!-- 背景层：浓郁的水墨背景 -->
      <div class="absolute inset-0 bg-[#0A0A0A] ink-dark-overlay opacity-0 animate-splash-bg"></div>

      <!-- 核心墨迹：从中心爆炸式展开 -->
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- 核心重墨 -->
        <div class="absolute w-[200vmax] h-[200vmax] rounded-full bg-ink-black animate-ink-expand"></div>
        
        <!-- 飞溅的小墨滴 (粒子效果模拟) -->
        <div v-for="n in 8" :key="n" 
             class="absolute w-20 h-20 bg-ink-black rounded-full blur-xl opacity-0-to-80 animate-drop-scatter"
             :style="scatterStyle(n)">
        </div>

        <!-- 角色感应文案 -->
        <div class="relative z-10 text-center px-10">
          <h2 class="text-4xl md:text-6xl font-serif text-paper-base tracking-[0.5em] leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] opacity-0 animate-text-reveal">
            {{ splashMessage }}
          </h2>
          <div class="mt-8 h-[2px] w-0 bg-china-red/80 mx-auto animate-bar-reveal"></div>
        </div>
      </div>

      <!-- 辅助纹理：噪点与晕染边缘 -->
      <div class="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 rice-paper-noise"></div>
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useToastStore } from '../store/toast'

const toastStore = useToastStore()
const { isSplashActive, splashMessage } = storeToRefs(toastStore)

const scatterStyle = (n) => {
  const angle = (n * 45) + (Math.random() * 20)
  const delay = 0.1 + (Math.random() * 0.3)
  const dist = 100 + (Math.random() * 200)
  return {
    transform: `rotate(${angle}deg) translateY(-${dist}px)`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
/* 核心：墨迹扩散 */
@keyframes inkExpand {
  0% { transform: scale(0); opacity: 0; filter: blur(50px); }
  30% { transform: scale(0.1); opacity: 1; filter: blur(30px); }
  60% { transform: scale(1); opacity: 1; filter: blur(10px); }
  /* 在 50% 处接近 1.0 (0.5s 时刻，假设总时间快些) */
  100% { transform: scale(1.2); opacity: 1; filter: blur(0px); }
}
.animate-ink-expand {
  animation: inkExpand 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 文字显现 */
@keyframes textReveal {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(10px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
}
.animate-text-reveal {
  animation: textReveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.4s forwards;
}

/* 装饰条 */
@keyframes barReveal {
  0% { width: 0; }
  100% { width: 200px; }
}
.animate-bar-reveal {
  animation: barReveal 1s ease-out 0.8s forwards;
}

/* 背景浓烟感 */
@keyframes splashBg {
  0% { opacity: 0; }
  100% { opacity: 0.95; }
}
.animate-splash-bg {
  animation: splashBg 0.6s ease-out forwards;
}

/* 小墨滴飞散 */
@keyframes dropScatter {
  0% { transform: translate(0, 0) scale(0); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1.5); opacity: 0; filter: blur(20px); }
}
.animate-drop-scatter {
  animation: dropScatter 1s ease-out forwards;
}

/* 全屏渐隐过渡 */
.splash-fade-enter-active {
  transition: opacity 0.5s ease;
}
.splash-fade-leave-active {
  transition: opacity 1.5s cubic-bezier(0.55, 0, 0.1, 1), filter 1.5s ease;
}
.splash-fade-leave-to {
  opacity: 0;
  filter: blur(40px); /* 宣纸边缘晕染感：离场时增加模糊 */
  transform: scale(1.1);
}

.rice-paper-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
