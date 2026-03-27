<template>
  <div class="h-full overflow-y-auto p-10">
    <div class="max-w-5xl mx-auto space-y-8">
      
      <!-- 欢迎横幅 -->
      <div class="relative rounded-sm overflow-hidden bg-[#1A1C20] text-white p-10 shadow-2xl">
        <div class="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200')] bg-cover bg-center mix-blend-overlay"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-ink-base to-transparent"></div>
        <div class="relative z-10 flex items-center gap-6">
          <!-- 动态头像上传区域 -->
          <div class="relative group cursor-pointer" @click="triggerAvatarUpload">
            <img :src="user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=200'" class="w-20 h-20 rounded-full border-2 border-china-red object-cover shadow-xl transition-all group-hover:brightness-75" />
            
            <!-- 水墨风悬浮遮罩 -->
            <div class="absolute inset-0 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white backdrop-blur-[1px]">
              <svg class="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-[9px] font-serif tracking-widest">易容改面</span>
            </div>
            
            <!-- 隐藏的文件选择器 -->
            <input 
              type="file" 
              ref="avatarInput" 
              class="hidden" 
              accept="image/*" 
              @change="onAvatarFileSelected"
            />
          </div>

          <div>
            <p class="text-white/60 tracking-[0.4em] text-xs font-sans mb-1">欢迎归来，东家</p>
            <h2 class="text-4xl font-serif tracking-[0.2em] mb-2">{{ user?.username }}<span class="ml-3 text-china-red">·</span>主家</h2>
            <p class="text-white/50 text-sm font-sans tracking-widest">神州大地等待您的烟火气息</p>
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-sm p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-ink-light/10 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5">
          <div class="flex items-start justify-between mb-5">
            <div class="w-10 h-10 rounded-sm flex items-center justify-center" :class="stat.bgClass">
              <svg class="w-5 h-5" :class="stat.iconClass" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-html="stat.icon"></svg>
            </div>
            <span class="text-[10px] tracking-widest text-ink-light/50 font-sans">{{ stat.trend }}</span>
          </div>
          <p class="text-4xl font-serif font-bold text-ink-base mb-1">{{ stat.value }}</p>
          <p class="text-xs text-ink-light tracking-widest">{{ stat.label }}</p>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="bg-white rounded-sm p-8 border border-ink-light/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <h3 class="text-sm font-bold tracking-widest text-ink-base mb-6 flex items-center gap-2">
          <span class="w-1 h-4 bg-china-red"></span> 快捷启程
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <button @click="$emit('navigate', 'listing')" class="flex items-center gap-4 p-4 bg-paper-base rounded-sm border border-ink-light/10 hover:border-china-red/30 hover:bg-white transition-all group">
            <div class="w-10 h-10 bg-china-red/10 rounded-sm flex items-center justify-center text-china-red group-hover:bg-china-red group-hover:text-white transition-all">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-ink-base tracking-widest">更新挂牌</p>
              <p class="text-xs text-ink-light mt-0.5">修缮宅院，广招四方宾客</p>
            </div>
          </button>
          <button @click="$emit('navigate', 'chat')" class="flex items-center gap-4 p-4 bg-paper-base rounded-sm border border-ink-light/10 hover:border-china-red/30 hover:bg-white transition-all group">
            <div class="w-10 h-10 bg-ink-base/5 rounded-sm flex items-center justify-center text-ink-base group-hover:bg-ink-base group-hover:text-white transition-all">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-ink-base tracking-widest">联络知音</p>
              <p class="text-xs text-ink-light mt-0.5">与旅人一叙山河情谊</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuth } from '../../composables/useAuth'

const props = defineProps({ user: Object, token: String })
const emit = defineEmits(['navigate'])

const { updateUser } = useAuth()
const avatarInput = ref(null)
const isUploading = ref(false)

// 触发文件选择
const triggerAvatarUpload = () => {
  if (!isUploading.value) {
    avatarInput.value?.click()
  }
}

// 处理文件选择后的动作 (上传+更新)
const onAvatarFileSelected = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 1. 上传图片
  const formData = new FormData()
  formData.append('image', file)
  
  isUploading.value = true
  try {
    // 上传到服务端
    const uploadRes = await axios.post('http://localhost:3000/api/v1/upload/image', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${props.token}`
      }
    })

    if (uploadRes.data.code === 200) {
      const newAvatarUrl = uploadRes.data.data.url
      
      // 2. 更新个人资料
      await axios.patch('http://localhost:3000/api/v1/auth/profile', 
        { avatar: newAvatarUrl }, 
        { headers: { 'Authorization': `Bearer ${props.token}` } }
      )

      // 3. 更新本地状态 (全局响应式)
      updateUser({ avatar: newAvatarUrl })
      alert('容貌修缮成功！')
    }
  } catch (error) {
    console.error('Avatar upload failed:', error)
    alert('官家提示：名册修缮失败，请稍后再试。')
  } finally {
    isUploading.value = false
    e.target.value = '' // 清除 input 状态以便下次选择
  }
}

const stats = ref([
  {
    label: '已发布挂牌',
    value: '—',
    trend: '城市布点',
    bgClass: 'bg-china-red/10',
    iconClass: 'text-china-red',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />'
  },
  {
    label: '知音好友数',
    value: '—',
    trend: '即时通联',
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-400',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />'
  },
  {
    label: '信用温度值',
    value: '100°',
    trend: '信用良好',
    bgClass: 'bg-amber-50',
    iconClass: 'text-amber-400',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />'
  }
])

onMounted(async () => {
  try {
    const [profileRes, friendRes] = await Promise.allSettled([
      axios.get('http://localhost:3000/api/v1/host/profile', { headers: { Authorization: `Bearer ${props.token}` } }),
      axios.get(`http://localhost:3000/api/v1/social/friends/${props.user?.id}`, { headers: { Authorization: `Bearer ${props.token}` } })
    ])
    if (profileRes.status === 'fulfilled') {
      stats.value[0].value = `${profileRes.value.data.data?.length || 0} 处`
    }
    if (friendRes.status === 'fulfilled') {
      stats.value[1].value = `${friendRes.value.data.data?.length || 0} 位`
    }
  } catch(e) {}
})
</script>
