<template>
  <div 
    ref="cardRef"
    @click="handleView"
    class="flex flex-col group cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
    :class="[
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
    ]"
  >
    <!-- 图片封面 (利用 lazy-load 与 hover 缩放) -->
    <div class="relative w-full aspect-[4/5] overflow-hidden rounded-[4px] bg-ink-light/5 shadow-sm">
      <!-- 骨架屏占位 -->
      <div v-if="isLoading" class="absolute inset-0 bg-ink-light/10 animate-pulse"></div>
      
      <img 
        :src="experience.imageUrl" 
        :alt="experience.title"
        loading="lazy"
        @load="isLoading = false"
        class="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
      />
      
      <!-- 发帖人身份标签 -->
      <div 
        class="absolute top-3 right-3 px-2 py-1 bg-ink-base/80 backdrop-blur-sm text-paper-light text-xs tracking-widest font-serif rounded-sm shadow-md"
        v-if="experience.authorGroup === 'official_host'"
      >
        <span>地主推荐</span>
      </div>

      <!-- 收藏印记 (Heart) -->
      <button 
        @click.stop="handleFavorite"
        class="absolute top-3 left-3 w-8 h-8 rounded-full bg-paper-base/50 backdrop-blur-md flex items-center justify-center transition-all hover:bg-paper-light hover:scale-110 shadow-sm"
        title="收起画卷"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-colors" :class="isFav ? 'text-china-red fill-current' : 'text-ink-light/80'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- 标题与导语排版区 -->
    <div class="pt-5 pb-2">
      <h3 class="font-serif text-2xl text-ink-base group-hover:text-accent-red transition-colors duration-300">
        {{ experience.title }}
      </h3>
      <p class="text-ink-light/80 mt-3 text-sm leading-relaxed line-clamp-3">
        {{ experience.description }}
      </p>
    </div>
    
    <!-- 底部辅助区 -->
    <div class="mt-auto pt-4 border-t border-ink-light/10 flex justify-between items-center text-xs text-ink-light font-serif tracking-widest">
      <span>{{ categoryText }}</span>
      <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent-red">阅卷 →</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useFootprints } from '../composables/useFootprints'

const props = defineProps({
  experience: {
    type: Object,
    required: true
  }
})

const { addHistory, isFavorite, toggleFavorite } = useFootprints()

// 计算当前画卷是否已被藏书阁收录
const isFav = computed(() => isFavorite(props.experience.id, 'experience'))

// 拦截红心按键的盖印
const handleFavorite = () => {
  toggleFavorite({
    id: props.experience.id,
    type: 'experience',
    title: props.experience.title,
    image: props.experience.imageUrl || '',
    subtitle: props.experience.authorName || '佚名居士'
  })
}

// 整个画卷被拆阅时，顺手写入过眼烟云（历史记录）
const handleView = () => {
  addHistory({
    id: props.experience.id,
    type: 'experience',
    title: props.experience.title,
    image: props.experience.imageUrl || '',
    subtitle: props.experience.authorName || '佚名居士'
  })
  alert(`卷宗『${props.experience.title}』已被翻开（这假装是一次路由跳转观卷）\n同时也已成功录入了您的“过眼史册”！`)
}

const isLoading = ref(true)
const cardRef = ref(null)
const isVisible = ref(false)

// 触发入场动效一次即可
useIntersectionObserver(
  cardRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.1 }
)

const categoryText = computed(() => {
  const map = {
    sightseeing: '【寻景】',
    food: '【觅食】',
    story: '【听故】'
  }
  return map[props.experience.type] || '记录'
})
</script>
