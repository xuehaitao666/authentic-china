<template>
  <div v-if="isOpen" class="fixed inset-0 z-[960] flex justify-end font-serif">
    <!-- 遮罩 -->
    <div class="absolute inset-0 bg-ink-base/70 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- 主体 -->
    <div class="relative w-full sm:w-[500px] h-full bg-paper-base shadow-2xl flex flex-col animate-slide-in-right border-l border-ink-light/20">
      
      <!-- 未登录状态拦截 -->
      <div v-if="!isAuth" class="flex-1 flex flex-col items-center justify-center p-10 text-center relative z-10">
         <div class="absolute inset-0 grayscale opacity-10 bg-[url('https://images.unsplash.com/photo-1574044158428-fbff7ce243ec?w=600')] bg-cover"></div>
         <div class="w-20 h-20 bg-china-red/10 text-china-red rounded-full flex items-center justify-center mb-6 z-10 border border-china-red/30">
           <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
         </div>
         <h3 class="text-2xl font-bold text-ink-base tracking-widest mb-4 z-10 font-serif">驿站大门紧闭</h3>
         <p class="text-sm text-ink-light leading-loose tracking-widest z-10">想要鸿雁传书、结识天下知音，<br/>还请客官先在页面首屏右上角【签押入关】。</p>
      </div>

      <!-- 已登录：知音列表与对话面板 -->
      <div v-else class="flex flex-col h-full w-full">
         
         <!-- 顶栏：返回按钮或知音名字 -->
         <div class="h-24 shrink-0 border-b border-ink-light/15 bg-paper-light flex items-center px-6 gap-4 relative shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10">
            <!-- 如果在聊天页，显示返回箭头 -->
            <button v-if="activeFriend" @click="activeFriend = null" class="w-10 h-10 flex items-center justify-center text-ink-light hover:text-china-red hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-ink-light/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div v-else class="w-10 h-10 flex items-center justify-center text-china-red bg-china-red/5 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
               </svg>
            </div>
            
            <img v-if="activeFriend" :src="activeFriend.avatar_url" class="w-12 h-12 rounded-full border border-black/10 object-cover shadow-sm" />
            
            <div class="flex-1">
               <h2 class="text-2xl text-ink-black tracking-[0.2em] font-bold">
                 {{ activeFriend ? activeFriend.username : '飞鸽驿站' }}
               </h2>
               <p class="text-[10px] text-ink-light tracking-[0.3em] font-sans mt-1">
                 {{ activeFriend ? '万里传音中...' : 'CONNECTING HEARTS' }}
               </p>
            </div>

            <!-- 关闭整个抽屉 -->
            <button @click="$emit('close')" class="w-10 h-10 flex items-center justify-center text-ink-light hover:text-china-red transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>

         <!-- 列表视图 -->
         <div v-if="!activeFriend" class="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 bg-paper-base/50 flex flex-col">
            
            <!-- 寻觅知音 Header -->
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-bold tracking-widest text-ink-base flex items-center gap-2">
                 <span class="w-1.5 h-4 bg-china-red"></span>
                 {{ isSearching ? '寻路觅水' : '我的名册' }}
              </h3>
              <button 
                @click="toggleSearch" 
                class="text-xs tracking-widest px-3 py-1.5 rounded-sm border transition-colors shadow-sm"
                :class="isSearching ? 'border-ink-light/20 text-ink-light bg-white hover:bg-paper-light' : 'border-china-red text-china-red bg-white hover:bg-china-red hover:text-white'"
              >
                {{ isSearching ? '← 返回名册' : '结缘新知音' }}
              </button>
            </div>

            <!-- 搜索面板 -->
            <div v-if="isSearching" class="flex flex-col gap-4">
               <div class="flex gap-2">
                 <input 
                   v-model="searchQuery"
                   @keyup.enter="doSearch"
                   type="text"
                   placeholder="输入名号 (如：李白)"
                   class="flex-1 bg-white border border-ink-light/20 rounded-sm h-10 px-4 text-sm font-sans outline-none focus:border-china-red/50 shadow-inner"
                 />
                 <button 
                   @click="doSearch"
                   class="h-10 px-4 bg-ink-base text-paper-light rounded-sm tracking-widest text-xs hover:bg-china-red transition-colors shadow-sm"
                 >
                   飞鸽寻人
                 </button>
               </div>

               <!-- 搜索结果空状态 -->
               <div v-if="hasSearched && searchResults.length === 0" class="text-center text-xs text-ink-light py-8 tracking-widest">
                  落花无情，未寻得此人。
               </div>
               
               <!-- 搜索结果列表 -->
               <div v-for="resUser in searchResults" :key="resUser.id" class="flex items-center justify-between p-3 bg-white border border-ink-light/10 rounded-sm shadow-sm group hover:border-china-red/20 transition-all">
                 <div class="flex items-center gap-3">
                   <img :src="resUser.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'" class="w-10 h-10 rounded-full object-cover border border-paper-base shadow-sm" />
                   <div>
                     <h4 class="text-sm font-bold text-ink-base tracking-widest">{{ resUser.username }}</h4>
                     <p class="text-[10px] text-ink-light tracking-wider font-sans mt-0.5">身份：{{ resUser.role === 'host' ? '神州地主' : '游子' }}</p>
                   </div>
                 </div>
                 <button 
                   v-if="!isMyFriend(resUser.id) && resUser.id !== user?.id"
                   @click="requestAddFriend(resUser)"
                   class="text-[10px] tracking-widest px-3 py-1.5 border border-china-red/30 bg-china-red/5 text-china-red rounded-sm hover:bg-china-red hover:text-white transition-colors"
                 >
                   呈递信物
                 </button>
                 <span v-else-if="resUser.id === user?.id" class="text-[10px] text-ink-light/50 tracking-widest border border-transparent px-3 py-1.5">本尊</span>
                 <span v-else class="text-[10px] text-ink-light/50 tracking-widest border border-transparent px-3 py-1.5">已在册</span>
               </div>
            </div>

            <!-- 好友列表空状态 -->
            <div v-else-if="friends.length === 0" class="text-center text-sm text-ink-light mt-16 tracking-widest leading-loose">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-ink-light/30 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              人海茫茫，尚未结交知音。<br/>点击上方【结缘新知音】吧。
            </div>
            
            <div 
              v-else
              v-for="friend in friends" 
              :key="friend.id"
              @click="openChat(friend)"
              class="flex items-center gap-5 p-4 bg-paper-light rounded-[4px] border border-ink-light/10 hover:border-china-red/30 hover:bg-white hover:shadow-lg cursor-pointer transition-all duration-300 group"
            >
              <div class="relative">
                 <img :src="friend.avatar_url" class="w-14 h-14 rounded-full object-cover shadow-sm border border-paper-base" />
                 <!-- 绿点表示在线 -->
                 <div v-if="onlineUsers.includes(friend.id.toString())" class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-paper-light rounded-full shadow-sm"></div>
              </div>
              <div class="flex-1 min-w-0">
                 <div class="flex justify-between items-center mb-1">
                   <h4 class="text-ink-base font-bold tracking-widest text-[17px] group-hover:text-china-red transition-colors truncate">{{ friend.username }}</h4>
                   <span class="text-[10px] text-ink-light/60 tracking-wider">闲居中</span>
                 </div>
                 <p class="text-[12px] text-ink-light truncate font-sans tracking-wide">
                   "江山代有才人出，各领风骚数百年"
                 </p>
              </div>
            </div>
         </div>

         <!-- 聊天视图 -->
         <div v-else class="flex flex-col flex-1 overflow-hidden bg-[#F6F4F0] relative">
            
            <!-- 聊天瀑布流 -->
            <div ref="chatBox" class="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
               <div v-if="messages.length === 0" class="flex flex-col items-center justify-center my-10">
                  <div class="bg-ink-light/5 text-ink-light/80 px-4 py-1.5 rounded-sm text-xs tracking-widest font-sans border border-ink-light/10 mb-4">
                     这是你们的命运相遇之始
                  </div>
                  <span class="text-[10px] tracking-widest text-ink-light/50">此乃一纸空笺，快破冰赐墨吧</span>
               </div>

               <div 
                 v-for="msg in messages" 
                 :key="msg.id"
                 class="flex gap-4 max-w-[85%]"
                 :class="msg.sender_id === user.id ? 'ml-auto flex-row-reverse' : ''"
               >
                 <img :src="msg.sender_id === user.id ? user.avatar : activeFriend.avatar_url" class="w-10 h-10 rounded-full border border-black/5 object-cover shrink-0 mt-1 shadow-sm" />
                 
                 <div class="flex flex-col gap-1.5 min-w-0" :class="msg.sender_id === user.id ? 'items-end' : 'items-start'">
                    <!-- 如果是普通文本 -->
                    <div v-if="msg.content" class="px-5 py-3 rounded-md shadow-sm text-[15px] tracking-wide leading-relaxed font-sans"
                         :class="msg.sender_id === user.id ? 'bg-[#9C2727] text-[#FAF8F5]' : 'bg-paper-light border border-ink-light/10 text-ink-base'">
                      {{ msg.content }}
                    </div>

                    <!-- 如果附带分享的名城画卷 -->
                    <div v-if="msg.shared_entity_type" class="mt-1 w-56 bg-white border border-[#9C2727]/20 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[4px] overflow-hidden flex flex-col group cursor-pointer transform hover:-translate-y-1 transition-all"
                         @click="handleShareClick(msg)">
                       <div class="relative w-full h-28">
                         <img :src="msg.shared_entity_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'" class="w-full h-full object-cover" />
                         <div class="absolute inset-0 bg-gradient-to-t from-ink-base/80 to-transparent"></div>
                         <div class="absolute bottom-2 left-3 right-3 flex items-center gap-1.5 text-paper-light">
                            <span class="w-1 h-3 bg-china-red"></span>
                            <span class="text-[10px] tracking-widest font-bold font-serif">{{ msg.shared_entity_type === 'city' ? '天下名城' : '地道画卷' }}</span>
                         </div>
                       </div>
                       <div class="p-3 bg-[#FAF8F5]">
                          <h4 class="text-[15px] font-bold text-ink-black truncate group-hover:text-china-red transition-colors font-serif tracking-widest">{{ msg.shared_entity_title }}</h4>
                          <p class="text-[10px] text-ink-light mt-1 tracking-widest flex items-center justify-between">
                            <span>阅历荐函</span>
                            <span class="text-china-red font-sans">点击启卷 →</span>
                          </p>
                       </div>
                    </div>
                    
                    <span class="text-[10px] text-ink-light/40 tracking-wider font-sans">{{ formatTime(msg.created_at) }}</span>
                 </div>
               </div>
            </div>

            <!-- 如果存在从别处传来的待分享画卷 (挂载阶段) -->
            <div v-if="pendingShare" class="absolute bottom-[80px] left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-china-red px-6 py-4 flex items-center justify-between shadow-[0_-5px_20px_rgba(156,39,39,0.15)] z-10 transition-all duration-500">
               <div class="flex items-center gap-4 min-w-0">
                  <div class="relative w-12 h-12 shrink-0">
                    <img :src="pendingShare.image" class="w-full h-full object-cover rounded shadow-md border border-ink-light/10" />
                    <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-china-red flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5"><path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.656 1.362 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1zm-1.294 7.445a.75.75 0 010-1.06l4-4a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0z" clip-rule="evenodd" /></svg>
                    </div>
                  </div>
                  <div class="truncate">
                    <p class="text-[10px] font-sans tracking-[0.2em] text-ink-light mb-0.5 uppercase">Pending Share</p>
                    <div class="text-sm tracking-widest text-ink-base font-bold truncate">的 {{ pendingShare.title }}</div>
                  </div>
               </div>
               <button @click="$emit('clear-share')" class="w-8 h-8 rounded-full bg-paper-base flex items-center justify-center text-ink-light hover:text-china-red hover:bg-white border border-ink-light/20 shadow-sm transition-all shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <!-- 底栏：输入域 -->
            <div class="absolute bottom-0 left-0 w-full min-h-[80px] bg-paper-light border-t border-ink-light/15 flex items-center px-6 py-4 gap-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
               <input 
                 v-model="inputText" 
                 @keyup.enter="doSend"
                 type="text" 
                 class="flex-1 bg-white border border-ink-light/20 rounded-[4px] h-12 px-5 text-[15px] font-sans text-ink-base outline-none focus:border-china-red/60 focus:ring-2 focus:ring-china-red/5 transition-all shadow-inner"
                 placeholder="研墨展卷，在此留书..."
               />
               <button 
                 @click="doSend"
                 :disabled="!inputText.trim() && !pendingShare"
                 class="h-12 px-6 bg-ink-base text-paper-light rounded-[4px] flex items-center justify-center hover:bg-china-red transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed tracking-widest text-[15px] shadow-lg disabled:shadow-none font-bold transform hover:-translate-y-0.5 disabled:transform-none"
               >
                 <span v-if="pendingShare" class="mr-2">传阅并</span>
                 呈送
               </button>
            </div>

         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useChat } from '../composables/useChat'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  isOpen: Boolean,
  pendingShare: Object 
})
const emit = defineEmits(['close', 'clear-share'])

const { isAuth, user } = useAuth()
const { onlineUsers, messages, loadHistory, sendMessage, currentChatFriendId } = useChat()
const router = useRouter()

const friends = ref([])
const activeFriend = ref(null)
const inputText = ref('')
const chatBox = ref(null)

const isSearching = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const hasSearched = ref(false)

const toggleSearch = () => {
  isSearching.value = !isSearching.value
  if (!isSearching.value) {
    searchQuery.value = ''
    searchResults.value = []
    hasSearched.value = false
  }
}

const doSearch = async () => {
  if (!searchQuery.value.trim()) return
  try {
    const res = await axios.get(`http://localhost:3000/api/v1/social/search?keyword=${encodeURIComponent(searchQuery.value.trim())}`)
    searchResults.value = res.data.data || []
    hasSearched.value = true
  } catch(e) { console.error('搜索异常') }
}

const isMyFriend = (id) => {
  return friends.value.some(f => f.id === id)
}

const requestAddFriend = async (targetUser) => {
  try {
    const res = await axios.post(`http://localhost:3000/api/v1/social/friends`, {
      user_id: user.value.id,
      friend_id: targetUser.id
    })
    if (res.data.code === 200) {
      alert(`已成功与『${targetUser.username}』缔结契约！`)
      await fetchFriends()
      toggleSearch() // 收起搜索面板，回到名册
    }
  } catch(e) {
    alert(e.response?.data?.message || '结缘失败')
  }
}

const fetchFriends = async () => {
  if (!user.value?.id) return
  try {
    const res = await axios.get(`http://localhost:3000/api/v1/social/friends/${user.value.id}`)
    friends.value = res.data.data || []
  } catch(e) { console.error('获取名册失败') }
}

watch(() => props.isOpen, async (val) => {
  if (val && isAuth.value) {
    await fetchFriends()
    // 若带着锦囊信件冲进来，自动找个好友打开聊天框
    if(props.pendingShare && !activeFriend.value && friends.value.length >= 1) {
       openChat(friends.value[0])
    }
  } else if (!val) {
    activeFriend.value = null
    currentChatFriendId.value = null
  }
})

const openChat = async (friend) => {
  activeFriend.value = friend
  await loadHistory(friend.id)
  scrollToBottom()
}

const doSend = () => {
  if (!inputText.value.trim() && !props.pendingShare) return
  
  sendMessage(inputText.value.trim(), props.pendingShare)
  
  inputText.value = ''
  emit('clear-share') // 投递后清除锦囊
  
  setTimeout(scrollToBottom, 50)
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight + 50
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const formatTime = (isoString) => {
  if(!isoString) return ''
  const d = new Date(isoString)
  return `${d.getMonth()+1}-${d.getDate()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const handleShareClick = (msg) => {
  if (msg.shared_entity_type === 'city') {
    emit('close')
    router.push(`/city/${msg.shared_entity_title}`)
  } else {
    alert(`这是好友『${msg.sender?.username || '发送者'}』向您特别举荐的一卷私房画卷：\n\n《 ${msg.shared_entity_title} 》\n\n（演示版提示：由于业务拆分，单帖画卷放大暂不实现，可通过前往对应城市寻找该画卷查翻阅。）`)
  }
}
</script>

<style scoped>
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
