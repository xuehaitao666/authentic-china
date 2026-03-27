<template>
  <div class="h-full flex flex-col bg-paper-light overflow-hidden rounded-[8px] border border-ink-light/10 shadow-sm group hover:shadow-2xl transition-all duration-500 cursor-pointer w-[320px] shrink-0 transform hover:-translate-y-2">
    
    <div class="relative w-full h-[320px] overflow-hidden">
      <!-- 主图 (取第一张照片或头像) -->
      <img :src="host.photos[0] || host.avatar" class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
      
      <!-- 渐变阴影 -->
      <div class="absolute inset-0 bg-gradient-to-t from-ink-base/90 via-ink-base/20 to-transparent"></div>
      
      <!-- 头像和温度值 -->
      <div class="absolute bottom-4 left-4 flex items-center gap-3">
        <img :src="host.avatar" class="w-14 h-14 rounded-full border border-paper-light object-cover shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
        <div>
          <h4 class="text-paper-light font-serif text-xl tracking-[0.1em]">{{ host.name }}</h4>
          <span class="text-accent-red text-xs px-2 py-0.5 bg-paper-base/90 backdrop-blur-sm rounded-sm font-semibold tracking-wide">
             温度值: {{ host.reputationScore }}
          </span>
        </div>
      </div>
    </div>

    <div class="p-6 flex flex-col flex-grow">
      <!-- 服务标签 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in host.tags" :key="tag" class="text-xs text-ink-base bg-paper-base px-2 py-1 border border-ink-light/20 rounded-sm font-serif shadow-sm">
          {{ tag }}
        </span>
      </div>
      
      <p class="text-[15px] font-serif text-ink-base/80 leading-relaxed line-clamp-3 mb-4 flex-grow tracking-wide border-l-2 border-accent-red/30 pl-3">
        "{{ host.bio }}"
      </p>

      <div class="flex justify-between items-center text-sm pt-4 border-t border-ink-light/20 mt-auto">
        <span class="text-ink-light tracking-widest text-xs">结伴同行</span>
        <span class="text-ink-base font-bold font-serif text-lg">¥{{ host.dailyPrice }}<span class="text-xs font-normal"> /日</span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  host: {
    type: Object,
    required: true
  }
})
</script>
