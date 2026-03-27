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
          <div class="relative group cursor-pointer" @click="triggerAvatarUpload">
            <img :src="user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=200'" class="w-20 h-20 rounded-full object-cover transition-all group-hover:brightness-75 shadow-lg" style="border: 2px solid rgba(156,39,39,0.2)" />
            
            <!-- 悬浮提示 -->
            <div class="absolute inset-0 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white backdrop-blur-[1px]">
              <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-[8px] font-serif tracking-widest text-center">易容改面</span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '../../composables/useAuth'
import { useFootprints } from '../../composables/useFootprints'

const props = defineProps({ user: Object, token: String })
const { clearAuth, updateUser } = useAuth()
const { history, favorites } = useFootprints()
const router = useRouter()

const avatarInput = ref(null)
const isUploading = ref(false)

// 触发文件选择器
const triggerAvatarUpload = () => {
  if (!isUploading.value) {
    avatarInput.value?.click()
  }
}

// 选择并上传头像
const onAvatarFileSelected = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  isUploading.value = true
  try {
    // 1. 发起上传请求
    const uploadRes = await axios.post('http://localhost:3000/api/v1/upload/image', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${props.token}`
      }
    })

    if (uploadRes.data.code === 200) {
      const newAvatarUrl = uploadRes.data.data.url

      // 2. 同步更新个人档案
      await axios.patch('http://localhost:3000/api/v1/auth/profile', 
        { avatar: newAvatarUrl }, 
        { headers: { 'Authorization': `Bearer ${props.token}` } }
      )

      // 3. 刷新前端状态
      updateUser({ avatar: newAvatarUrl })
      alert('官家提示：您已易容成功，名籍已更新。')
    }
  } catch (error) {
    console.error('Avatar update error:', error)
    alert('官家提示：修缮印章失败，请稍后再试。')
  } finally {
    isUploading.value = false
    e.target.value = ''
  }
}

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
