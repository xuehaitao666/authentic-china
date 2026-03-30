<template>
  <Transition name="fade">
    <div v-if="isLogoutActive" class="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-none">
      <div class="text-center px-6">
        <p class="poetic-text text-3xl md:text-4xl text-ink-black tracking-[0.4em] opacity-0 animate-poetic-fade">
          此去经年，应是良辰好景。
        </p>
        <div class="mt-6 h-[1px] w-0 bg-ink-light/30 mx-auto animate-line-slide"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useToastStore } from '../store/toast'

const toastStore = useToastStore()
const { isLogoutActive } = storeToRefs(toastStore)
</script>

<style scoped>
.poetic-text {
  /* 楷体或等线宋体 fallback */
  font-family: "STKaiti", "Kaiti", "BiauKai", "楷体", serif;
  font-weight: 300;
}

@keyframes poeticFade {
  0% { opacity: 0; transform: translateY(10px); filter: blur(5px); }
  30% { opacity: 1; transform: translateY(0); filter: blur(0); }
  80% { opacity: 1; filter: blur(0); }
  100% { opacity: 0; filter: blur(10px); }
}

.animate-poetic-fade {
  animation: poeticFade 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes lineSlide {
  0% { width: 0; opacity: 0; }
  20% { width: 100px; opacity: 0.5; }
  80% { width: 100px; opacity: 0.5; }
  100% { width: 150px; opacity: 0; }
}

.animate-line-slide {
  animation: lineSlide 2.5s ease-out forwards;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
