<template>
  <div class="h-full overflow-y-auto" style="background: #F5F1EA">
    <div class="max-w-5xl mx-auto px-8 py-12 space-y-12">

      <!-- 卷轴题头·欢迎帖 -->
      <div class="relative overflow-hidden rounded-sm" style="background: linear-gradient(135deg, #2A2318 0%, #1A1510 100%); padding: 3rem;">
        <div class="absolute inset-0 opacity-10" style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper-2.png')"></div>
        <div class="absolute top-0 right-0 w-48 h-48 opacity-5" style="background: radial-gradient(circle, #9C2727 0%, transparent 70%)"></div>
        <div class="relative z-10">
          <p class="text-[11px] tracking-[0.5em] font-sans mb-3" style="color: rgba(255,255,255,0.4)">{{ today }} · 行纪第 {{ travelDayCount }} 日</p>
          <h2 class="font-serif text-4xl tracking-[0.3em] mb-4 flex items-center gap-6" style="color: #FAF8F5">
            <div class="relative group">
              <img :src="props.user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=150'" 
                   class="w-20 h-20 rounded-full object-cover border-2 border-china-red/30 shadow-2xl transition-transform group-hover:scale-105" />
              <!-- 修改头像按钮 (墨影图标) -->
              <button @click="triggerFileUpload" 
                      class="absolute -bottom-1 -right-1 w-7 h-7 bg-ink-base rounded-full flex items-center justify-center border border-paper-base shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      title="修缮名籍头像">
                <svg class="w-3.5 h-3.5 text-paper-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleAvatarUpload" />
            </div>
            <div>
              {{ greeting }}，<span style="color: #D4856A">{{ props.user?.username }}</span>
            </div>
          </h2>
          <p class="font-serif text-base tracking-widest leading-loose" style="color: rgba(250,248,245,0.5)">
            无论晴雨，总有一城在等候你的脚步。
          </p>
        </div>
      </div>

      <!-- 三格概览 -->
      <div class="grid grid-cols-3 gap-6">
        <div 
          v-for="card in overviewCards" :key="card.label"
          class="rounded-sm p-7 border cursor-pointer group transition-all hover:-translate-y-1"
          style="background: #FFFDF9; border-color: rgba(90,80,65,0.1); box-shadow: 0 2px 15px rgba(90,80,65,0.05)"
          @click="$emit('navigate', card.target)"
          onmouseenter="this.style.borderColor='rgba(156,39,39,0.2)'"
          onmouseleave="this.style.borderColor='rgba(90,80,65,0.1)'"
        >
          <div class="text-2xl mb-4 group-hover:scale-110 transition-transform">{{ card.icon }}</div>
          <p class="text-3xl font-serif mb-1" style="color: #2A2318">{{ card.value }}</p>
          <p class="text-xs tracking-widest font-sans uppercase" style="color: #9A8B78">{{ card.label }}</p>
        </div>
      </div>

      <!-- ======== 双列叙事布局：历史与收藏 ======== -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <!-- 左列：寻山访水历史 -->
        <section class="space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-ink-light/10">
            <h3 class="font-serif text-lg tracking-[0.2em] flex items-center gap-3" style="color: #2A2318">
              <span class="w-1.5 h-1.5 rounded-full" style="background: #9C2727"></span>
              寻山访水历史
            </h3>
            <span class="text-[10px] tracking-widest font-sans opacity-40 uppercase">Footprints</span>
          </div>

          <div v-if="history.length === 0" class="py-20 text-center border border-dashed border-ink-light/10 rounded-sm bg-paper-base/20">
            <p class="font-serif text-sm tracking-widest" style="color: #B0A090">行囊尚空，静待启程</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in history" :key="item.id + item.timestamp"
                 @click="$router.push(`/city/${item.title}`)"
                 class="relative overflow-hidden group p-5 rounded-sm cursor-pointer transition-all hover:translate-x-1"
                 style="background: #FFFDF9; border: 1px solid rgba(90,80,65,0.08); box-shadow: 0 4px 15px rgba(0,0,0,0.02)">
              
              <!-- 山水背景纹理 (叙事细节) -->
              <div class="absolute inset-x-0 bottom-0 h-1/2 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10" 
                   style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper-2.png'); mask-image: linear-gradient(to top, black, transparent)"></div>
              
              <div class="relative z-10 flex gap-5">
                <div class="w-16 h-16 shrink-0 rounded-sm overflow-hidden border border-ink-light/10">
                  <img :src="item.image || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=200'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 class="font-serif text-base tracking-widest mb-1 group-hover:text-china-red transition-colors" style="color: #2A2318">{{ item.title }}</h4>
                  <p class="text-[10px] tracking-widest font-sans flex items-center gap-2" style="color: #9A8B78">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ formatDate(item.visitedAt || item.timestamp) }}
                  </p>
                </div>
                <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-4 h-4 text-china-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右列：山海收藏录 -->
        <section class="space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-ink-light/10">
            <h3 class="font-serif text-lg tracking-[0.2em] flex items-center gap-3" style="color: #2A2318">
              <span class="w-1.5 h-1.5 rounded-full" style="background: #D4856A"></span>
              山海收藏录
            </h3>
            <span class="text-[10px] tracking-widest font-sans opacity-40 uppercase">Treasures</span>
          </div>

          <div v-if="favorites.length === 0" class="py-20 text-center border border-dashed border-ink-light/10 rounded-sm bg-paper-base/20">
            <p class="font-serif text-sm tracking-widest" style="color: #B0A090">未曾珍藏，画卷未启</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="item in favorites" :key="item.id + item.timestamp"
                 class="group relative overflow-hidden rounded-sm cursor-pointer transition-all hover:-translate-y-1"
                 style="background: #FFFDF9; border: 1px solid rgba(90,80,65,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.03)"
                 @click="$router.push(`/city/${item.title}`)">
              
              <!-- 极小的水墨质感“墨点”图标 (右上角) -->
              <div class="absolute top-2 right-2 z-20 w-3 h-3 rounded-full opacity-60 transition-transform group-hover:scale-125" 
                   style="background: radial-gradient(circle, #2A2318 0%, transparent 80%); filter: blur(0.5px)"></div>

              <div class="h-32 overflow-hidden relative">
                <img :src="item.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=400'" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div class="absolute bottom-3 left-3">
                  <span class="px-2 py-0.5 rounded-sm text-[9px] tracking-widest font-serif text-white bg-china-red/80 uppercase">{{ item.type === 'city' ? '名城' : '画卷' }}</span>
                </div>
              </div>
              
              <div class="p-4">
                <h4 class="font-serif text-sm tracking-widest truncate group-hover:text-china-red transition-colors" style="color: #2A2318">{{ item.title }}</h4>
                <p class="text-[10px] mt-1 font-sans opacity-40 uppercase tracking-widest">Marked at {{ formatDateShort(item.timestamp) }}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useFootprints } from '../../composables/useFootprints'
import { useAuth } from '../../composables/useAuth'

const props = defineProps({ user: Object })
const emit = defineEmits(['navigate'])

const { history, favorites } = useFootprints()
const { token, updateUser } = useAuth()

const fileInput = ref(null)
const isUpdating = ref(false)

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  isUpdating.value = true
  try {
    // 1. 先上传到服务器
    const formData = new FormData()
    formData.append('image', file)
    
    const { data: uploadRes } = await axios.post('http://localhost:3000/api/v1/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token.value}`
      }
    })

    if (uploadRes.code === 200) {
      const newAvatarUrl = uploadRes.data.url
      
      // 2. 更新个人名籍
      const { data: profileRes } = await axios.patch('http://localhost:3000/api/v1/auth/profile', 
        { avatar: newAvatarUrl },
        { headers: { Authorization: `Bearer ${token.value}` } }
      )

      if (profileRes.code === 200) {
        // 3. 同步本地状态
        updateUser({ avatar: newAvatarUrl })
        alert('名籍头像重刻成功！')
      }
    }
  } catch (e) {
    console.error('更新头像失败:', e)
    alert('此地云雾迷蒙，头像修缮未成')
  } finally {
    isUpdating.value = false
  }
}

const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })

const greetings = ['山河长安', '行者无疆', '望尽天涯路']
const greeting = greetings[Math.floor(Math.random() * greetings.length)]

const travelDayCount = computed(() => {
  return Math.max(history.value.length + favorites.value.length, 1)
})

const overviewCards = computed(() => [
  { icon: '🗺', label: '游历名城', value: `${history.value.length} 座`, target: 'history' },
  { icon: '🪷', label: '珍藏画卷', value: `${favorites.value.length} 卷`, target: 'history' },
  { icon: '✦', label: '此生足迹', value: `${history.value.length + favorites.value.length} 处`, target: 'history' }
])

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}月${d.getDate()}日 到访`
}

const formatDateShort = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}
</script>

<style scoped>
/* 叙事卡片微调 */
section h3::after {
  content: '';
  display: block;
  width: 20px;
  height: 1px;
  background: currentColor;
  margin-top: 4px;
  opacity: 0.2;
}
</style>
