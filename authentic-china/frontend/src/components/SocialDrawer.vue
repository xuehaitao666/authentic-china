<template>
  <Transition name="ink-drawer">
    <div v-if="isOpen" class="fixed inset-0 z-[960] flex items-center justify-center p-6 sm:p-12 font-serif pointer-events-none">
      <!-- 遮罩 (Backdrop) -->
      <div 
        class="absolute inset-0 bg-ink-base/70 backdrop-blur-md transition-opacity pointer-events-auto" 
        @click="$emit('close')"
      ></div>

      <!-- 核心主体 (Main Modal) -->
      <div class="relative w-full max-w-5xl h-[85vh] max-h-[900px] bg-paper-base shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col border border-ink-light/20 rounded-2xl overflow-hidden pointer-events-auto">
        
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
           
           <!-- 顶栏：返回按钮或知音名字 (驿站门楣) -->
           <div class="h-24 shrink-0 border-b border-ink-light/15 bg-paper-light flex items-center px-8 gap-5 relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-10">
              <!-- 返回箭头 -->
              <button v-if="activeFriend || activeGroup" @click="activeFriend = null; activeGroup = null" class="w-11 h-11 flex items-center justify-center text-ink-light hover:text-china-red hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-ink-light/10">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div v-else class="w-11 h-11 flex items-center justify-center text-china-red bg-china-red/5 rounded-full border border-china-red/10">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                 </svg>
              </div>
              
              <div class="flex items-center gap-4 flex-1">
                <img v-if="activeFriend" :src="activeFriend.avatar_url" class="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" />
                <div v-else-if="activeGroup" class="w-14 h-14 rounded-xl bg-ink-base/10 flex items-center justify-center border border-ink-light/10 text-2xl overflow-hidden shadow-inner">
                   <img v-if="activeGroup.avatar" :src="activeGroup.avatar" class="w-full h-full object-cover" />
                   <span v-else>📜</span>
                </div>
                
                <div class="min-w-0">
                   <h2 class="text-2xl font-bold text-ink-black tracking-[0.2em] truncate">
                     {{ activeFriend ? activeFriend.username : (activeGroup ? activeGroup.name : '飞鸽驿站') }}
                   </h2>
                   <p class="text-[10px] text-ink-light tracking-[0.3em] font-sans mt-1 uppercase">
                     {{ activeFriend ? '万里传音中...' : (activeGroup ? '雅集共话中...' : 'CONNECTING HEARTS') }}
                   </p>
                </div>
              </div>

              <!-- 关闭整个弹窗 -->
              <button @click="$emit('close')" class="w-11 h-11 flex items-center justify-center text-ink-light hover:text-china-red transition-all hover:rotate-90">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>

           <!-- 列表与聊天视图的切换过渡 -->
           <Transition name="view-fade" mode="out-in">
             <!-- 1. 列表主视图 (名册/雅集) -->
             <div v-if="!activeFriend && !activeGroup" key="list" class="flex-1 flex flex-col overflow-hidden">
                 <!-- Tab 切换 -->
                 <div class="flex border-b border-ink-light/10 bg-paper-light/30 shrink-0">
                    <button 
                      @click="activeTab = 'friends'"
                      class="flex-1 py-5 text-sm tracking-[0.3em] font-bold transition-all relative"
                      :class="activeTab === 'friends' ? 'text-china-red' : 'text-ink-light/40'"
                    >
                       知音名册
                       <div v-if="activeTab === 'friends'" class="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-china-red animate-in fade-in zoom-in-50 duration-500"></div>
                    </button>
                    <button 
                      @click="activeTab = 'groups'"
                      class="flex-1 py-5 text-sm tracking-[0.3em] font-bold transition-all relative"
                      :class="activeTab === 'groups' ? 'text-china-red' : 'text-ink-light/40'"
                    >
                       雅集小聚
                       <div v-if="activeTab === 'groups'" class="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-china-red animate-in fade-in zoom-in-50 duration-500"></div>
                    </button>
                 </div>

                 <!-- 列表内容 scroll area -->
                 <div class="flex-1 overflow-y-auto no-scrollbar p-10 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
                    
                    <!-- 知音列表 Tab -->
                    <div v-if="activeTab === 'friends'" class="space-y-6 max-w-3xl mx-auto">
                        <div class="flex items-center justify-between mb-4">
                           <h3 class="text-sm font-bold tracking-widest text-ink-base flex items-center gap-3">
                              <span class="w-1.5 h-5 bg-china-red"></span>
                              {{ isSearching ? '寻路觅水 (寻人)' : '我的名册 (好友)' }}
                           </h3>
                           <button 
                             @click="toggleSearch" 
                             class="text-xs tracking-widest px-4 py-2 rounded-full border transition-all shadow-sm"
                             :class="isSearching ? 'border-ink-light/20 text-ink-light bg-white' : 'border-china-red text-china-red bg-white hover:bg-china-red hover:text-white'"
                           >
                             {{ isSearching ? '← 返回名册' : '结缘新知音' }}
                           </button>
                        </div>

                        <!-- 搜索面板 -->
                        <div v-if="isSearching" class="flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-500">
                           <div class="flex gap-3">
                             <input 
                               v-model="searchQuery"
                               @keyup.enter="doSearch"
                               type="text"
                               placeholder="输入名号 (如：李白)..."
                               class="flex-1 bg-white border border-ink-light/10 rounded-xl h-12 px-6 text-sm font-sans outline-none focus:border-china-red/50 shadow-inner"
                             />
                             <button @click="doSearch" class="h-12 px-6 bg-ink-base text-paper-light rounded-xl tracking-widest text-xs hover:bg-china-red transition-all shadow-md">飞鸽寻人</button>
                          </div>
                          <div v-for="resUser in searchResults" :key="resUser.id" class="flex items-center justify-between p-4 bg-white/70 border border-ink-light/10 rounded-xl shadow-sm hover:shadow-md transition-all">
                             <div class="flex items-center gap-4">
                               <img :src="resUser.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                               <div>
                                 <h4 class="text-md font-bold text-ink-base tracking-widest">{{ resUser.username }}</h4>
                                 <p class="text-[10px] text-ink-light opacity-60">ID: {{ resUser.id }}</p>
                               </div>
                             </div>
                             <button v-if="!isMyFriend(resUser.id) && resUser.id !== user?.id" @click="requestAddFriend(resUser)" class="text-[10px] tracking-widest px-4 py-2 border-2 border-china-red/30 text-china-red rounded-full hover:bg-china-red hover:text-white transition-all">呈递信物</button>
                          </div>
                        </div>

                        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-if="friends.length === 0" class="col-span-full text-center py-20 opacity-30 text-sm tracking-[0.5em]">人海茫茫，尚未结交知音。</div>
                            <div v-for="friend in friends" :key="friend.id" @click="openChat(friend)" class="flex items-center gap-5 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-ink-light/5 hover:border-china-red/40 hover:bg-white cursor-pointer transition-all shadow-sm hover:shadow-xl group">
                               <div class="relative">
                                 <img :src="friend.avatar_url" class="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white" />
                                 <div v-if="onlineUsers.includes(friend.id.toString())" class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                               </div>
                               <div class="flex-1 min-w-0">
                                  <h4 class="text-lg font-bold tracking-widest text-ink-base group-hover:text-china-red truncate transition-colors">{{ friend.username }}</h4>
                                  <p class="text-[11px] text-ink-light/50 truncate italic mt-1 leading-relaxed">"江山如画，一时多少豪杰..."</p>
                               </div>
                            </div>
                        </div>
                    </div>

                    <!-- 雅集列表 Tab -->
                    <div v-else-if="activeTab === 'groups'" class="space-y-6 max-w-4xl mx-auto">
                        <h3 class="text-sm font-bold tracking-widest text-ink-base flex items-center justify-between mb-4">
                           <div class="flex items-center gap-3"><span class="w-1.5 h-5 bg-china-red"></span>我的雅集</div>
                           <button @click="isCreatingGroup = true" class="text-[11px] px-5 py-2 bg-china-red text-white rounded-full tracking-[0.2em] shadow-lg hover:bg-ink-base transition-all font-bold">＋ 兴建雅集</button>
                        </h3>

                        <!-- 兴建雅集面板 -->
                        <div v-if="isCreatingGroup" class="bg-paper-light border-2 border-china-red/30 rounded-2xl p-6 mb-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-500">
                           <div class="flex justify-between items-center border-b border-ink-light/10 pb-3">
                              <span class="text-md font-bold text-ink-base tracking-widest">开坛聚贤 (创建新雅集)</span>
                              <button @click="isCreatingGroup = false" class="text-ink-light hover:text-china-red text-xl transition-transform hover:scale-110">✕</button>
                           </div>
                           <div class="space-y-4">
                             <div>
                               <label class="text-[10px] text-ink-light tracking-widest block mb-2 font-bold opacity-60">雅集名号</label>
                               <input v-model="newGroupName" type="text" placeholder="为您的雅集取个响亮的名号..." class="w-full bg-white border border-ink-light/10 rounded-xl h-12 px-6 text-sm outline-none focus:border-china-red/50 shadow-inner" />
                             </div>
                             <div>
                               <label class="text-[10px] text-ink-light tracking-widest block mb-2 font-bold opacity-60">邀约入席 (已选 {{ selectedFriendIds.length }} 位)</label>
                               <div class="max-h-48 overflow-y-auto no-scrollbar border border-ink-light/5 bg-white/70 rounded-xl p-4 grid grid-cols-2 gap-3">
                                  <div v-for="friend in friends" :key="friend.id" class="flex items-center gap-3 p-2 hover:bg-paper-light rounded-lg transition-colors group">
                                     <input type="checkbox" :id="'friend-'+friend.id" :value="friend.id" v-model="selectedFriendIds" class="w-4 h-4 accent-china-red cursor-pointer" />
                                     <label :for="'friend-'+friend.id" class="text-xs text-ink-base cursor-pointer flex items-center gap-2">
                                        <img :src="friend.avatar_url" class="w-6 h-6 rounded-full" />
                                        {{ friend.username }}
                                     </label>
                                  </div>
                               </div>
                             </div>
                           </div>
                           <button @click="doCreateGroup" :disabled="!newGroupName.trim() || selectedFriendIds.length === 0" class="w-full py-4 bg-ink-base text-paper-light rounded-xl text-sm tracking-[0.4em] font-bold disabled:opacity-20 shadow-xl hover:bg-china-red transition-all">开 坛 聚 贤</button>
                        </div>

                        <div v-if="groups.length === 0 && !isCreatingGroup" class="text-center py-24 opacity-30 text-sm tracking-[0.6em]">尚未加入任何雅集</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          <div v-for="group in groups" :key="group.id" @click="openGroupChat(group)" class="group p-5 bg-white/60 rounded-2xl border border-ink-light/5 hover:border-china-red/40 hover:bg-white hover:shadow-2xl cursor-pointer transition-all flex flex-col items-center text-center">
                             <div class="w-20 h-20 bg-ink-base/5 rounded-2xl overflow-hidden border border-ink-light/10 mb-4 shadow-inner">
                                <img v-if="group.avatar" :src="group.avatar" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                <div v-else class="w-full h-full flex items-center justify-center text-3xl">📜</div>
                             </div>
                             <h4 class="text-lg font-bold text-ink-black group-hover:text-china-red transition-colors truncate tracking-widest mb-2">{{ group.name }}</h4>
                             <p class="text-[11px] text-ink-light/60 line-clamp-2 leading-relaxed italic">"{{ group.description || '雅趣互赏，共话神州' }}"</p>
                          </div>
                        </div>
                    </div>
                 </div>
             </div>

             <!-- 2. 聊天视图层 (窗口开启后) -->
             <div v-else key="chat" class="flex-1 flex flex-col overflow-hidden relative">
                <!-- 群聊组件 -->
                <GroupChat v-if="activeGroup" :groupId="activeGroup.id" :groupName="activeGroup.name" :groupDescription="activeGroup.description" class="h-full" />
                
                <!-- 私信聊天视图 -->
                <div v-else-if="activeFriend" class="flex flex-col h-full bg-[#FBF9F6] relative">
                   <div ref="chatBox" class="flex-1 overflow-y-auto p-10 space-y-8 ink-scrollbar pb-40">
                      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center py-24 opacity-30">
                        <div class="text-4xl mb-4 grayscale">✉️</div>
                        <p class="text-xs tracking-[0.5em]">此地尚无片纸只言，请君赐笔。</p>
                      </div>
                      
                      <div v-for="msg in messages" :key="msg.id" class="flex gap-4 max-w-[85%]" :class="msg.sender_id === user.id ? 'ml-auto flex-row-reverse' : ''">
                         <img :src="msg.sender_id === user.id ? user.avatar : activeFriend.avatar_url" class="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover shrink-0 mt-1" />
                         <div class="flex flex-col gap-2" :class="msg.sender_id === user.id ? 'items-end' : 'items-start'">
                            <div class="px-5 py-3.5 rounded-2xl text-[16px] leading-relaxed font-sans shadow-md break-words" 
                                 :class="msg.sender_id === user.id ? 'bg-[#9C2727] text-white rounded-tr-none' : 'bg-white border border-ink-light/5 text-ink-base rounded-tl-none'">
                               {{ msg.content }}
                            </div>
                            <span class="text-[10px] text-ink-light/40 font-sans tracking-widest">{{ formatTime(msg.created_at) }}</span>
                         </div>
                      </div>
                   </div>

                   <!-- 输入框案台 -->
                   <div class="absolute bottom-8 left-10 right-10 bg-white/90 backdrop-blur-xl border border-ink-light/10 rounded-2xl p-4 flex items-center gap-4 z-20 shadow-2xl">
                      <input 
                        v-model="inputText" 
                        @keyup.enter="doSend" 
                        type="text" 
                        class="flex-1 bg-transparent border-none py-2 px-4 text-[16px] font-sans text-ink-base outline-none tracking-wide" 
                        placeholder="研墨留书，寄语知音..." 
                      />
                      <button 
                        @click="doSend" 
                        :disabled="!inputText.trim()" 
                        class="px-8 py-3 bg-ink-base text-paper-light rounded-xl text-sm tracking-[0.4em] font-bold shadow-lg hover:bg-china-red transition-all disabled:opacity-30"
                      >
                        呈送
                      </button>
                   </div>
                </div>
             </div>
           </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useChat } from '../composables/useChat'
import { useRouter } from 'vue-router'
import axios from 'axios'
import GroupChat from './GroupChat.vue'

const props = defineProps({
  isOpen: Boolean,
  pendingShare: Object 
})
const emit = defineEmits(['close', 'clear-share'])

const { isAuth, user } = useAuth()
const { onlineUsers, messages, loadHistory, sendMessage, currentChatFriendId } = useChat()
const router = useRouter()

const friends = ref([])
const groups = ref([])
const activeTab = ref('friends')
const activeFriend = ref(null)
const activeGroup = ref(null)
const inputText = ref('')
const chatBox = ref(null)

const isCreatingGroup = ref(false)
const newGroupName = ref('')
const selectedFriendIds = ref([])

const isSearching = ref(false)
const searchQuery = ref('')
const searchResults = ref([])

const toggleSearch = () => {
  isSearching.value = !isSearching.value
  if (!isSearching.value) {
    searchQuery.value = ''
    searchResults.value = []
  }
}

const doSearch = async () => {
  if (!searchQuery.value.trim()) return
  try {
    const res = await axios.get(`http://localhost:3000/api/v1/social/search?keyword=${encodeURIComponent(searchQuery.value.trim())}`)
    searchResults.value = res.data.data || []
  } catch(e) { console.error('搜索异常') }
}

const isMyFriend = (id) => friends.value.some(f => f.id === id)

const requestAddFriend = async (targetUser) => {
  try {
    const res = await axios.post(`http://localhost:3000/api/v1/social/friends`, {
      user_id: user.value.id,
      friend_id: targetUser.id
    })
    if (res.data.code === 200) {
      alert(`已成功与『${targetUser.username}』缔结契约！`)
      await fetchFriends()
      toggleSearch()
    }
  } catch(e) { alert(e.response?.data?.message || '结缘失败') }
}

const fetchFriends = async () => {
  if (!user.value?.id) return
  try {
    const res = await axios.get(`http://localhost:3000/api/v1/social/friends/${user.value.id}`)
    friends.value = res.data.data || []
  } catch(e) { console.error('获取名册失败') }
}

const fetchGroups = async () => {
  if (!user.value?.id) return
  try {
    const res = await axios.get(`http://localhost:3000/api/v1/social/groups/user/${user.value.id}`)
    groups.value = res.data.data || []
  } catch(e) { console.error('获取雅集失败') }
}

const doCreateGroup = async () => {
  if (!newGroupName.value.trim() || !user.value?.id) return
  try {
    const res = await axios.post(`http://localhost:3000/api/v1/social/groups`, {
      name: newGroupName.value.trim(),
      creator_id: user.value.id,
      memberIds: selectedFriendIds.value,
      description: '高山流水，知音雅聚'
    })
    if (res.data.success) {
      await fetchGroups()
      isCreatingGroup.value = false
      newGroupName.value = ''
      selectedFriendIds.value = []
      openGroupChat(res.data.data)
    }
  } catch(e) { alert(e.response?.data?.message || '兴建雅集失败') }
}

watch(() => props.isOpen, async (val) => {
  if (val && isAuth.value) {
    await fetchFriends()
    await fetchGroups()
  } else if (!val) {
    activeFriend.value = null
    activeGroup.value = null
    currentChatFriendId.value = null
  }
})

const openChat = async (friend) => {
  activeFriend.value = friend
  activeGroup.value = null
  await loadHistory(friend.id)
  scrollToBottom()
}

const openGroupChat = (group) => {
  activeGroup.value = group
  activeFriend.value = null
  scrollToBottom()
}

const doSend = () => {
  if (!inputText.value.trim()) return
  sendMessage(inputText.value.trim(), null)
  inputText.value = ''
  setTimeout(scrollToBottom, 50)
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight + 50
  }
}

watch(messages, () => scrollToBottom(), { deep: true })

const formatTime = (isoString) => {
  if(!isoString) return ''
  const d = new Date(isoString)
  return `${d.getMonth()+1}-${d.getDate()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}
</script>

<style scoped>
@keyframes inkFadeScaleIn {
  from { 
    opacity: 0; 
    filter: blur(15px); 
    transform: scale(0.92) translateY(20px); 
  }
  to { 
    opacity: 1; 
    filter: blur(0); 
    transform: scale(1) translateY(0); 
  }
}

.ink-drawer-enter-active {
  animation: inkFadeScaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.ink-drawer-leave-active {
  transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.ink-drawer-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.92) translateY(20px);
}

/* 内部视图切换过渡 */
.view-fade-enter-active, .view-fade-leave-active {
  transition: opacity 0.4s ease;
}
.view-fade-enter-from, .view-fade-leave-to {
  opacity: 0;
}
</style>
