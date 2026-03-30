<template>
  <Transition name="ink-fade">
    <div v-if="isVisible" class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div 
        class="relative px-12 py-8 min-w-[300px] flex flex-col items-center justify-center bg-paper-base shadow-2xl border border-ink-light/10 overflow-hidden"
        :class="[type === 'login' ? 'ink-toast-login' : 'ink-toast-logout']"
        id="ink-toast-container"
      >
        <!-- 宣纸纹理层 -->
        <div class="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply rice-paper-texture"></div>
        
        <!-- 毛边/水墨晕染边缘 (伪元素实现) -->
        <div class="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/10 to-transparent ink-smudge-top"></div>
        <div class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white/10 to-transparent ink-smudge-bottom"></div>

        <!-- 登录：红色印章动画 -->
        <div v-if="type === 'login'" class="seal-container">
          <div class="red-seal animate-seal-drop shadow-lg flex items-center justify-center">
            <span class="seal-text font-serif">已归</span>
          </div>
          <p class="mt-6 text-2xl font-serif text-ink-black tracking-[0.2em] animate-fade-in-up">
            {{ message || '山河久别，终得归来' }}
          </p>
        </div>

        <!-- 退出：暂别墨迹动画 -->
        <div v-else-if="type === 'logout'" class="logout-container flex flex-col items-center">
          <div class="ink-splash mb-4 opacity-0 animate-splash-fade">
             <img src="https://api.iconify.design/ri:ink-bottle-fill.svg?color=%231E1E1E" class="w-12 h-12" />
          </div>
          <p class="text-3xl font-serif text-ink-black tracking-[0.3em] font-bold animate-ink-vanish">
            {{ message || '暂别' }}
          </p>
          <div class="mt-4 h-0.5 w-0 bg-ink-black animate-line-expand"></div>
        </div>

        <!-- 普通成功/错误反馈 -->
        <div v-else class="flex items-center gap-4">
          <div :class="type === 'error' ? 'text-china-red' : 'text-ink-black'">
             <span v-if="type === 'error'" class="text-2xl">×</span>
             <span v-else class="text-2xl font-serif">印</span>
          </div>
          <p class="text-xl font-serif text-ink-black">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useToastStore } from '../store/toast'

const toastStore = useToastStore()
const { isVisible, message, type } = storeToRefs(toastStore)
</script>

<style scoped>
/* 宣纸纹理 */
.rice-paper-texture {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

/* 印章样式 */
.red-seal {
  width: 80px;
  height: 80px;
  background-color: #C83C23;
  border: 4px double rgba(255, 255, 255, 0.4);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.seal-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  color: #FAF9F6;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.1em;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
}

/* 核心动画：印章落下抖动 */
@keyframes sealDrop {
  0% { transform: scale(3) translateY(-100px) rotate(-15deg); opacity: 0; }
  60% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; }
  75% { transform: translateY(-8px) rotate(2deg); }
  85% { transform: translateY(4px) rotate(-2deg); }
  92% { transform: translateY(-2px) rotate(1deg); }
  100% { transform: translateY(0) rotate(0deg); }
}
.animate-seal-drop {
  animation: sealDrop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* 墨迹变淡消失动画 */
@keyframes inkVanish {
  0% { opacity: 0; filter: blur(10px); transform: scale(1.1); }
  20% { opacity: 1; filter: blur(0); transform: scale(1); }
  70% { opacity: 0.8; filter: blur(2px); transform: scale(1.02); }
  100% { opacity: 0; filter: blur(20px); transform: scale(1.2); }
}
.animate-ink-vanish {
  animation: inkVanish 3.5s ease-in-out forwards;
}

@keyframes splashFade {
  0% { transform: scale(0.5); opacity: 0; }
  30% { transform: scale(1.2); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0; }
}
.animate-splash-fade {
  animation: splashFade 1.5s ease-out forwards;
}

@keyframes lineExpand {
  0% { width: 0; opacity: 0; }
  50% { width: 100px; opacity: 0.8; }
  100% { width: 150px; opacity: 0; }
}
.animate-line-expand {
  animation: lineExpand 3s ease-out forwards;
}

@keyframes fadeInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s 0.6s ease-out both;
}

/* 毛边效果 (clip-path 模拟) */
#ink-toast-container {
  clip-path: polygon(
    0% 5%, 5% 0%, 95% 2%, 100% 8%, 98% 92%, 92% 100%, 8% 98%, 0% 90%
  );
  /* 稍微增加一些噪点感和粗糙边缘 */
  filter: drop-shadow(0 0 1px rgba(0,0,0,0.1));
}

/* 过渡动画 */
.ink-fade-enter-active,
.ink-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.ink-fade-enter-from,
.ink-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
