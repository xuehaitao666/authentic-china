<template>
  <div class="flex h-full w-full bg-paper-base font-serif overflow-hidden relative border-l border-ink-light/10">
    <!-- 左侧：雅集同袍 (居于侧边) -->
    <div class="w-20 sm:w-64 border-r border-ink-light/10 flex flex-col bg-paper-light">
      <div class="p-6 border-b border-ink-light/10">
        <h3 class="text-lg font-bold tracking-widest text-ink-black flex items-center gap-2">
          <span class="w-1.5 h-6 bg-china-red"></span>
          雅集同袍
        </h3>
        <p class="text-[10px] text-ink-light/60 mt-1 tracking-[0.2em] uppercase font-sans">Fellow Travelers</p>
      </div>
      
      <div class="flex-1 overflow-y-auto ink-scrollbar p-4 space-y-4">
        <div v-if="loadingMembers" class="text-center py-10 opacity-30">
          <div class="animate-pulse flex flex-col items-center gap-2">
            <div class="w-10 h-10 bg-ink-light rounded-full"></div>
            <div class="h-2 w-16 bg-ink-light rounded"></div>
          </div>
        </div>
        
        <div 
          v-for="member in members" 
          :key="member.id" 
          class="flex items-center gap-3 p-2 rounded-sm hover:bg-ink-light/5 transition-colors group relative"
        >
          <img :src="member.avatar_url" class="w-10 h-10 rounded-full object-cover border border-paper-base shadow-sm shrink-0" />
          <div class="hidden sm:block min-w-0">
            <p class="text-sm font-bold text-ink-base truncate group-hover:text-china-red transition-colors">{{ member.username }}</p>
            <p class="text-[10px] text-ink-light/50 tracking-wider">
               {{ member.role === 'host' ? '主理人' : '客官' }} 
               <span v-if="onlineUsers.includes(member.id.toString())" class="text-green-600 ml-1">● 在线</span>
            </p>
          </div>
          <!-- 身份标识印章 -->
          <div v-if="member.role === 'host'" class="absolute -top-1 -right-1 sm:right-2 sm:top-2">
             <div class="w-3 h-3 bg-china-red rotate-45 border border-white/20 shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：核心传笺区域 -->
    <div class="flex-1 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
      
      <!-- 雅集顶栏 -->
      <div class="h-20 border-b border-ink-light/10 flex items-center px-8 justify-between bg-white/50 backdrop-blur-md z-10">
        <div>
          <h2 class="text-2xl font-bold tracking-[0.3em] text-ink-black">{{ groupName || '雅集群聊' }}</h2>
          <p class="text-[11px] text-ink-light/50 mt-1 tracking-widest">{{ groupDescription || '正在共话神州，同游古今' }}</p>
        </div>
        <div class="flex items-center gap-4">
           <div class="px-4 py-1 border border-ink-light/20 rounded-full text-xs text-ink-light tracking-widest">
             在线：{{ activeOnlineCount }} / {{ members.length }}
           </div>
        </div>
      </div>

      <!-- 消息瀑布流 (宣纸卷轴) -->
      <div ref="scrollContainer" class="flex-1 overflow-y-auto p-10 space-y-8 ink-scrollbar pb-32">
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center py-20 opacity-30 text-ink-light">
          <div class="mb-6 scale-150 grayscale">🕊️</div>
          <p class="tracking-[0.5em] text-sm">虚位以待，请君赐墨</p>
        </div>

        <div 
          v-for="msg in messages" 
          :key="msg.id"
          class="flex gap-6 max-w-[85%]"
          :class="msg.sender_id === user.id ? 'ml-auto flex-row-reverse' : ''"
        >
          <img 
            :src="msg.sender?.avatar_url" 
            class="w-12 h-12 rounded-sm border border-paper-base shadow-[4px_4px_10px_rgba(0,0,0,0.05)] object-cover shrink-0 mt-1" 
          />
          
          <div class="flex flex-col gap-2 min-w-0" :class="msg.sender_id === user.id ? 'items-end' : 'items-start'">
            <div class="flex items-center gap-2 mb-1">
               <span class="text-[11px] font-bold tracking-widest text-ink-light/70">{{ msg.sender?.username }}</span>
               <span v-if="msg.sender?.role === 'host'" class="px-2 py-0.5 bg-china-red/5 border border-china-red/20 text-china-red text-[9px] tracking-tighter rounded-full">主理人</span>
            </div>

            <!-- 消息气泡：宣纸感 -->
            <div 
              class="relative px-6 py-4 rounded-sm shadow-paper text-[16px] tracking-wide leading-relaxed font-sans transition-all"
              :class="[
                msg.sender_id === user.id ? 'bg-[#9C2727] text-paper-light border-none' : 'bg-paper-light border border-ink-light/10 text-ink-base',
                msg.sender?.role === 'host' ? 'border-china-red/40' : ''
              ]"
            >
              <!-- 水墨滤镜图片 -->
              <div v-if="msg.type === 'image'" class="mb-2 -mx-2">
                 <img :src="msg.content" class="rounded-sm max-w-full max-h-96 object-contain ink-filter shadow-md" />
              </div>
              <p v-else class="whitespace-pre-wrap">{{ msg.content }}</p>
              
              <!-- 装饰性：宣纸边纹 (仅在普通消息显示) -->
              <div v-if="msg.sender_id !== user.id" class="absolute -left-[1px] top-4 w-[2px] h-4 bg-china-red"></div>
            </div>
            
            <span class="text-[10px] text-ink-light/30 tracking-wider font-sans">{{ formatTime(msg.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- 输入域 (研墨案台) -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl bg-white/90 backdrop-blur-xl border border-ink-light/15 rounded-md p-4 flex flex-col gap-3 shadow-ink z-20">
        <!-- 预览图区域 -->
        <div v-if="previewImage" class="relative w-24 h-24 mb-2 group">
           <img :src="previewImage" class="w-full h-full object-cover rounded shadow-md ink-filter" />
           <button @click="clearPreview" class="absolute -top-2 -right-2 w-6 h-6 bg-china-red text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">×</button>
        </div>

        <div class="flex items-center gap-4">
           <!-- 图片上传按钮 -->
           <label class="cursor-pointer p-3 hover:bg-ink-light/5 rounded-full transition-colors text-ink-light/60 hover:text-china-red relative">
             <input type="file" @change="handleImageUpload" accept="image/*" class="hidden" />
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                <div class="w-4 h-4 border-2 border-china-red border-t-transparent animate-spin rounded-full"></div>
             </div>
           </label>

           <input 
             v-model="inputText" 
             @keyup.enter="doSend"
             type="text" 
             class="flex-1 bg-transparent border-none py-2 text-[16px] font-sans text-ink-base outline-none tracking-wide"
             placeholder="研墨展卷，共话神州..."
           />
           
           <button 
             @click="doSend"
             :disabled="sending || (!inputText.trim() && !uploadedImageUrl)"
             class="px-8 py-3 bg-ink-base text-paper-light rounded-sm flex items-center justify-center hover:bg-china-red transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed tracking-[0.4em] text-sm shadow-md font-bold"
           >
             {{ sending ? '呈递中...' : '呈送' }}
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useChat } from '../composables/useChat'
import axios from 'axios'

const props = defineProps({
  groupId: {
    type: [String, Number],
    required: true
  },
  groupName: String,
  groupDescription: String
})

const { user } = useAuth()
const { messages, onlineUsers, joinGroup, sendGroupMessage } = useChat()

const scrollContainer = ref(null)
const inputText = ref('')
const sending = ref(false)
const previewImage = ref(null)
const uploadedImageUrl = ref(null)
const isUploading = ref(false)
const members = ref([])
const loadingMembers = ref(true)

const activeOnlineCount = computed(() => {
  return members.value.filter(m => onlineUsers.value.includes(m.id.toString())).length
})

onMounted(async () => {
  await fetchMembers()
  await joinGroup(props.groupId)
  scrollToBottom(true)
})

const fetchMembers = async () => {
  try {
    loadingMembers.value = true
    // 假设对应的成员列表接口（实际开发中需确保后端有此接口）
    const res = await axios.get(`http://localhost:3000/api/v1/social/groups/${props.groupId}/members`)
    members.value = res.data.data || []
  } catch (e) {
    console.error('获取同袍列表失败:', e)
  } finally {
    loadingMembers.value = false
  }
}

const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 预览
  const reader = new FileReader()
  reader.onload = (ev) => { previewImage.value = ev.target.result }
  reader.readAsDataURL(file)

  // 实际上传
  try {
    isUploading.value = true
    const formData = new FormData()
    formData.append('image', file)
    
    const res = await axios.post('http://localhost:3000/api/v1/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    uploadedImageUrl.value = res.data.url
  } catch (err) {
    alert('画轴传输受阻（上传失败）')
    previewImage.value = null
  } finally {
    isUploading.value = false
  }
}

const clearPreview = () => {
  previewImage.value = null
  uploadedImageUrl.value = null
}

const doSend = async () => {
  if (sending.value) return
  if (!inputText.value.trim() && !uploadedImageUrl.value) return

  try {
    sending.value = true
    
    if (uploadedImageUrl.value) {
      // 如果有图片，发送图片类型消息
      sendGroupMessage(props.groupId, uploadedImageUrl.value, 'image')
      clearPreview()
    }
    
    if (inputText.value.trim()) {
      // 发送文本消息
      sendGroupMessage(props.groupId, inputText.value.trim(), 'text')
    }
    
    inputText.value = ''
    setTimeout(() => scrollToBottom(false), 100)
  } finally {
    sending.value = false
  }
}

const scrollToBottom = async (immediate = false) => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: immediate ? 'auto' : 'smooth'
    })
  }
}

watch(messages, () => {
  scrollToBottom(false)
}, { deep: true })

const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const clearSearch = () => {
  // 仅占位
}

</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.messages-enter-active {
  animation: fadeIn 0.4s ease forwards;
}
</style>
