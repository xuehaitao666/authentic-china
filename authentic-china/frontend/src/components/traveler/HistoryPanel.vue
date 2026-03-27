<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-3xl mx-auto px-10 py-12">
      <div class="mb-10">
        <h2 class="font-serif text-3xl tracking-[0.3em] mb-3" style="color: #2A2318">寻山访水</h2>
        <p class="text-sm tracking-widest font-serif" style="color: #9A8B78">您曾踏足过的每一处山川，皆留有印记。</p>
      </div>

      <!-- 空态 -->
      <div v-if="allHistory.length === 0 && allFavorites.length === 0" class="rounded-sm py-32 flex flex-col items-center gap-5" style="border: 2px dashed rgba(90,80,65,0.15); background: rgba(245,241,234,0.4)">
        <div class="text-6xl opacity-50">🧭</div>
        <p class="font-serif text-sm tracking-[0.4em]" style="color: #9A8B78">行程空白如宣纸</p>
        <p class="text-xs font-sans tracking-widest" style="color: #B0A090">前往神州大图，踏足一座城池，这里便有了第一笔印记</p>
        <button @click="$router.push('/tourist/map')" class="mt-2 text-xs tracking-widest px-5 py-2.5 rounded-sm font-serif" style="background: rgba(156,39,39,0.08); color: #9C2727; border: 1px solid rgba(156,39,39,0.2)">
          前行入图
        </button>
      </div>

      <div v-else class="space-y-10">
        <!-- 浏览历史 -->
        <section v-if="allHistory.length">
          <h3 class="font-serif text-sm tracking-widest mb-5 flex items-center gap-3" style="color: #2A2318">
            <span class="w-0.5 h-4 inline-block rounded-full" style="background: #9C2727"></span>
            过眼烟云（浏览足迹）
          </h3>
          <div class="space-y-3">
            <div v-for="(item, i) in allHistory" :key="item.id || i"
                 @click="$router.push(`/city/${item.title}`)"
                 class="flex items-center gap-5 p-5 rounded-sm cursor-pointer group transition-all"
                 style="background: #FFFDF9; border: 1px solid rgba(90,80,65,0.1)"
                 onmouseenter="this.style.borderColor='rgba(156,39,39,0.25)'; this.style.transform='translateX(4px)'"
                 onmouseleave="this.style.borderColor='rgba(90,80,65,0.1)'; this.style.transform='translateX(0)'">
              <div class="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 font-serif text-lg font-bold" style="background: rgba(156,39,39,0.08); color: #9C2727">
                {{ i + 1 }}
              </div>
              <img v-if="item.image" :src="item.image" class="w-16 h-12 object-cover rounded-sm shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-serif text-sm tracking-widest truncate" style="color: #2A2318">{{ item.title }}</p>
                <p class="text-[11px] mt-1 font-sans" style="color: #9A8B78">{{ formatDate(item.visitedAt) }}</p>
              </div>
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" style="color: #9A8B78" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </section>

        <!-- 收藏 -->
        <section v-if="allFavorites.length">
          <h3 class="font-serif text-sm tracking-widest mb-5 flex items-center gap-3" style="color: #2A2318">
            <span class="w-0.5 h-4 inline-block rounded-full" style="background: #D4856A"></span>
            珍藏名录（心仪画卷）
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(item, i) in allFavorites" :key="item.id || i"
                 class="overflow-hidden rounded-sm cursor-pointer group transition-all"
                 style="border: 1px solid rgba(90,80,65,0.1); background: #FFFDF9"
                 onmouseenter="this.style.boxShadow='0 8px 24px rgba(90,80,65,0.12)'; this.style.borderColor='rgba(156,39,39,0.25)'"
                 onmouseleave="this.style.boxShadow='none'; this.style.borderColor='rgba(90,80,65,0.1)'">
              <div class="relative h-32 overflow-hidden">
                <img :src="item.image || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(42,35,24,0.6) 0%, transparent 60%)"></div>
              </div>
              <div class="p-4">
                <p class="font-serif text-sm tracking-widest truncate" style="color: #2A2318">{{ item.title }}</p>
                <p class="text-[10px] mt-1 font-sans" style="color: #9A8B78">{{ item.type === 'city' ? '名城' : '画卷' }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFootprints } from '../../composables/useFootprints'

defineProps({ user: Object })

const { history, favorites } = useFootprints()
const allHistory = computed(() => history.value)
const allFavorites = computed(() => favorites.value)

const formatDate = (iso) => {
  if (!iso) return '未知时间'
  const d = new Date(iso)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
</script>
