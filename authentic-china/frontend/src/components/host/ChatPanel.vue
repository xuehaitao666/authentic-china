<template>
  <div class="h-full flex flex-col overflow-hidden">
    
    <div v-if="!activeFriend" class="flex flex-col h-full">
      <!-- 好友列表顶部 -->
      <div class="px-8 py-6 border-b border-ink-light/10 bg-white/50 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold tracking-widest text-ink-base">知音名册</h3>
          <p class="text-xs text-ink-light mt-1 tracking-widest">{{ friends.length }} 位知音</p>
        </div>
        <button @click="isSearching = !isSearching" class="text-xs tracking-widest px-4 py-2 rounded-sm border border-china-red text-china-red hover:bg-china-red hover:text-white transition-colors font-serif">
          {{ isSearching ? '× 关闭' : '结缘新知音' }}
        </button>
      </div>

      <!-- 搜索框 -->
      <div v-if="isSearching" class="px-8 py-4 bg-paper-base/80 border-b border-ink-light/10">
        <div class="flex gap-2">
          <input v-model="searchQuery" @keyup.enter="doSearch" type="text" placeholder="输入名号搜索..." class="flex-1 bg-white border border-ink-light/20 rounded-sm h-10 px-4 text-sm outline-none focus:border-china-red/60 font-sans" />
          <button @click="doSearch" class="h-10 px-4 bg-ink-base text-white text-xs rounded-sm hover:bg-china-red transition-colors tracking-widest">寻人</button>
        </div>
        <div v-if="searchResults.length" class="mt-3 space-y-2">
          <div v-for="u in searchResults" :key="u.id" class="flex items-center justify-between p-3 bg-white rounded-sm border border-ink-light/10">
            <div class="flex items-center gap-3">
              <img :src="u.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80'" class="w-9 h-9 rounded-full object-cover" />
              <span class="text-sm font-bold tracking-widest text-ink-base">{{ u.username }}</span>
            </div>
            <button v-if="!isMyFriend(u.id) && u.id !== props.user?.id" @click="addFriend(u)" class="text-xs px-3 py-1.5 border border-china-red/30 text-china-red rounded-sm hover:bg-china-red hover:text-white transition-colors">呈递信物</button>
            <span v-else class="text-xs text-ink-light/50">{{ u.id === props.user?.id ? '本尊' : '已在册' }}</span>
          </div>
        </div>
      </div>

      <!-- 好友列表 -->
      <div class="flex-1 overflow-y-auto p-6 space-y-3">
        <div v-if="friends.length === 0" class="text-center text-sm text-ink-light mt-20 tracking-widest">
          <p>人海茫茫，尚无知音</p>
          <p class="text-xs mt-2 text-ink-light/50">点击上方【结缘新知音】</p>
        </div>
        <div v-for="friend in friends" :key="friend.id" @click="openChat(friend)" class="flex items-center gap-4 p-4 bg-white rounded-sm border border-ink-light/10 hover:border-china-red/30 hover:shadow-md cursor-pointer transition-all group">
          <img :src="friend.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80'" class="w-12 h-12 rounded-full object-cover border border-paper-base shadow-sm" />
          <div class="flex-1">
            <h4 class="text-sm font-bold tracking-widest text-ink-base group-hover:text-china-red transition-colors">{{ friend.username }}</h4>
            <p class="text-xs text-ink-light mt-0.5 tracking-wider">点击开始畅聊</p>
          </div>
          <svg class="w-4 h-4 text-ink-light/40 group-hover:text-china-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div v-else class="flex flex-col h-full">
      <!-- 对话顶栏 -->
      <div class="px-8 py-5 border-b border-ink-light/10 bg-white/60 flex items-center gap-4">
        <button @click="activeFriend = null" class="w-9 h-9 flex items-center justify-center text-ink-light hover:text-china-red rounded-full hover:bg-paper-base transition-all">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <img :src="activeFriend.avatar_url" class="w-10 h-10 rounded-full object-cover border border-ink-light/20" />
        <div>
          <h4 class="text-sm font-bold tracking-widest text-ink-base">{{ activeFriend.username }}</h4>
          <p class="text-[10px] text-ink-light tracking-widest">万里传音中…</p>
        </div>
      </div>

      <!-- 聊天气泡 -->
      <div ref="chatBox" class="flex-1 overflow-y-auto p-6 space-y-5">
        <div v-if="messages.length === 0" class="text-center text-xs text-ink-light/50 mt-16 tracking-widest">此乃一纸空笺，快破冰赐墨吧</div>
        <div v-for="msg in messages" :key="msg.id" class="flex gap-3" :class="msg.sender_id === props.user?.id ? 'flex-row-reverse' : ''">
          <img :src="msg.sender_id === props.user?.id ? (props.user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80') : activeFriend.avatar_url" class="w-9 h-9 rounded-full object-cover shrink-0 border border-ink-light/20" />
          <div class="px-4 py-2.5 rounded-md text-sm font-sans max-w-[70%] shadow-sm" :class="msg.sender_id === props.user?.id ? 'bg-china-red text-white' : 'bg-white border border-ink-light/10 text-ink-base'">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="px-6 py-4 bg-white border-t border-ink-light/10 flex gap-3">
        <input v-model="inputText" @keyup.enter="doSend" type="text" placeholder="在此留书..." class="flex-1 bg-paper-base border border-ink-light/20 rounded-sm h-11 px-4 text-sm outline-none focus:border-china-red/60 font-sans" />
        <button @click="doSend" :disabled="!inputText.trim()" class="h-11 px-5 bg-ink-base text-white rounded-sm text-sm hover:bg-china-red transition-colors disabled:opacity-40 tracking-widest font-serif">呈送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import axios from 'axios'
import { useChat } from '../../composables/useChat'

const props = defineProps({ user: Object, token: String })
const { messages, loadHistory, sendMessage, currentChatFriendId } = useChat()

const friends = ref([])
const activeFriend = ref(null)
const inputText = ref('')
const chatBox = ref(null)
const isSearching = ref(false)
const searchQuery = ref('')
const searchResults = ref([])

const fetchFriends = async () => {
  if (!props.user?.id) return
  try {
    const res = await axios.get(`http://localhost:3000/api/v1/social/friends/${props.user.id}`, {
      headers: { Authorization: `Bearer ${props.token}` }
    })
    friends.value = res.data.data || []
  } catch(e) {}
}

onMounted(() => fetchFriends())

const openChat = async (friend) => {
  activeFriend.value = friend
  await loadHistory(friend.id)
  await nextTick()
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
}

const doSend = () => {
  if (!inputText.value.trim()) return
  sendMessage(inputText.value.trim(), null)
  inputText.value = ''
  nextTick(() => { if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight })
}

watch(messages, () => {
  nextTick(() => { if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight })
}, { deep: true })

const doSearch = async () => {
  if (!searchQuery.value.trim()) return
  try {
    const res = await axios.get(`http://localhost:3000/api/v1/social/search?keyword=${encodeURIComponent(searchQuery.value)}`, {
      headers: { Authorization: `Bearer ${props.token}` }
    })
    searchResults.value = res.data.data || []
  } catch(e) {}
}

const isMyFriend = (id) => friends.value.some(f => f.id === id)

const addFriend = async (targetUser) => {
  try {
    await axios.post('http://localhost:3000/api/v1/social/friends', { user_id: props.user.id, friend_id: targetUser.id }, {
      headers: { Authorization: `Bearer ${props.token}` }
    })
    await fetchFriends()
    isSearching.value = false
    searchResults.value = []
  } catch(e) { alert('结缘失败') }
}
</script>
