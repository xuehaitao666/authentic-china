<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-xl mx-auto px-10 py-12">
      <div class="mb-10">
        <h2 class="font-serif text-3xl tracking-[0.3em] mb-3" style="color: #2A2318">墨印章台</h2>
        <p class="text-sm tracking-widest font-serif" style="color: #9A8B78">修缮行纪，刻出属于自己的旅者印章。</p>
      </div>

      <div class="rounded-sm overflow-hidden" style="border: 1px solid rgba(90,80,65,0.1); background: #FFFDF9">
        <!-- 头像区 -->
        <div class="p-8 flex gap-6 items-center" style="border-bottom: 1px solid rgba(90,80,65,0.08)">
          <div class="relative">
            <img :src="user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=200'" class="w-20 h-20 rounded-full object-cover" style="border: 2px solid rgba(156,39,39,0.2)" />
          </div>
          <div>
            <h3 class="font-serif text-xl tracking-widest" style="color: #2A2318">{{ user?.username }}</h3>
            <p class="text-xs mt-1 font-sans tracking-widest" style="color: #9A8B78">游方客 · 神州行旅者</p>
          </div>
        </div>

        <!-- 信息列表 -->
        <div class="divide-y" style="border-color: rgba(90,80,65,0.06)">
          <div v-for="item in infoRows" :key="item.label" class="flex items-center justify-between px-8 py-5">
            <span class="text-xs tracking-[0.3em] font-sans" style="color: #9A8B78">{{ item.label }}</span>
            <span class="text-sm font-serif tracking-widest" style="color: #2A2318">{{ item.value }}</span>
          </div>
        </div>

        <!-- 退出按钮 -->
        <div class="p-8 pt-4">
          <button
            @click="doLogout"
            class="w-full py-4 font-serif tracking-[0.4em] text-sm transition-all rounded-sm"
            style="border: 1px solid rgba(156,39,39,0.2); color: #9C2727; background: rgba(156,39,39,0.04)"
            onmouseenter="this.style.background='rgba(156,39,39,0.08)'"
            onmouseleave="this.style.background='rgba(156,39,39,0.04)'"
          >
            卸甲退朝
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useFootprints } from '../../composables/useFootprints'

const props = defineProps({ user: Object, token: String })
const { clearAuth } = useAuth()
const { history, favorites } = useFootprints()
const router = useRouter()

const infoRows = computed(() => [
  { label: '身份印章', value: '游方客 (Tourist)' },
  { label: '游历名城', value: `${history.value.length} 座` },
  { label: '珍藏画卷', value: `${favorites.value.length} 卷` },
])

const doLogout = () => {
  if (confirm('阁下确定要收起行囊，退离这神州大地么？')) {
    clearAuth()
    router.replace('/')
  }
}
</script>
