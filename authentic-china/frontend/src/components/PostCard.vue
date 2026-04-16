<template>
  <div 
    class="group relative bg-[#FFFDF9] border border-ink-light/10 p-8 rounded-sm hover:shadow-xl transition-all duration-700"
    style="box-shadow: 0 4px 20px rgba(0,0,0,0.02)"
  >
    <!-- 精选印章 -->
    <div v-if="post.is_featured" class="absolute -top-2 -right-2 z-10">
      <div class="w-12 h-12 flex items-center justify-center rounded-full border-2 border-china-red/40 text-china-red font-serif text-[10px] tracking-tighter rotate-12 bg-paper-base/80 backdrop-blur-sm">
        精选
      </div>
    </div>

    <!-- 作者信息与发布时间 -->
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-ink-light/5">
      <div class="flex items-center gap-3">
        <img 
          :src="post.author?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=80'" 
          class="w-10 h-10 rounded-full object-cover border-2 border-paper-base" 
        />
        <div>
          <p class="text-sm font-serif tracking-widest" style="color: #2A2318">{{ post.author?.username }}</p>
          <div class="flex items-center gap-2">
            <p class="text-[10px] tracking-widest font-sans" style="color: #9A8B78">{{ formatDate(post.createdAt) }}</p>
            <span v-if="post.city" class="text-[10px] font-serif px-1.5 py-0.5 bg-china-red/5 text-china-red rounded-sm">{{ post.city.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 更多操作 (删除) -->
      <button 
        v-if="isOwner" 
        @click="$emit('delete', post.id)"
        class="text-ink-light/30 hover:text-china-red transition-colors p-2"
        title="焚毁锦囊"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- 内容主体 -->
    <div class="space-y-6">
      <p class="text-[17px] font-serif leading-loose tracking-widest whitespace-pre-wrap" style="color: #2A2318">{{ post.content }}</p>
      
      <div v-if="post.image_url" class="relative rounded-sm overflow-hidden group/img" style="max-height: 500px">
        <img :src="post.image_url" class="w-full h-full object-top transition-transform duration-1000 group-hover/img:scale-105" style="object-fit: contain" />
      </div>
    </div>

    <!-- 互动栏 -->
    <div class="mt-8 pt-6 border-t border-ink-light/5 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <!-- 点赞 -->
        <button 
          @click="handleLike"
          class="flex items-center gap-2 transition-all active:scale-90"
          :class="post.is_liked ? 'text-china-red' : 'text-ink-light hover:text-china-red/60'"
        >
          <svg class="w-5 h-5" :fill="post.is_liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-xs font-serif tracking-widest">{{ post.likes_count || 0 }}</span>
        </button>

        <!-- 评论开关 -->
        <button 
          @click="showComments = !showComments"
          class="flex items-center gap-2 text-ink-light hover:text-ink-base transition-all"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="text-xs font-serif tracking-widest">{{ post.comments_count || 0 }}</span>
        </button>
      </div>

      <div class="px-4 py-1 text-[10px] font-sans tracking-[0.3em] opacity-30 select-none" style="color: #9A8B78">
        AC · CHRONICLE
      </div>
    </div>

    <!-- 评论区 -->
    <transition name="fade-slide">
      <div v-if="showComments" class="mt-6 space-y-6 bg-paper-base/30 p-6 rounded-sm border-t border-ink-light/5">
        <!-- 评论输入 -->
        <div class="flex gap-3">
          <img :src="currentUser?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80'" class="w-8 h-8 rounded-full object-cover" />
          <div class="flex-1 flex gap-2">
            <input 
              v-model="commentText"
              type="text" 
              :placeholder="replyTo ? `回复 ${replyTo.author.username}...` : '留下汝之高见...'"
              @keyup.enter="handleComment"
              class="flex-1 bg-transparent border-0 border-b border-ink-light/10 focus:ring-0 focus:border-china-red/40 transition-all text-sm font-serif tracking-widest"
            />
            <button 
              @click="handleComment"
              :disabled="!commentText.trim() || isSubmitting"
              class="text-xs font-serif tracking-widest text-china-red disabled:opacity-30"
            >
              发表
            </button>
            <button v-if="replyTo" @click="replyTo = null" class="text-xs font-serif text-ink-light/40">取消回复</button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div v-if="isLoadingComments" class="py-4 text-center">
          <div class="animate-spin inline-block w-4 h-4 rounded-full border-2 border-china-red/20 border-t-china-red"></div>
        </div>
        <div v-else class="space-y-4">
          <div v-if="comments.length === 0" class="text-center py-4 text-[10px] font-serif text-ink-light/30">
            暂无高见，虚位以待
          </div>
          <CommentItem 
            v-for="comment in comments" 
            :key="comment.id" 
            :comment="comment" 
            :post-id="post.id"
            :current-user="currentUser"
            @reply="setReply"
            @delete="handleDeleteComment"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { toggleLike, getComments, addComment, deleteComment } from '../api/social'

const props = defineProps({
  post: { type: Object, required: true },
  currentUser: { type: Object },
  token: { type: String }
})

const emit = defineEmits(['delete', 'update'])

const showComments = ref(false)
const isLoadingComments = ref(false)
const isSubmitting = ref(false)
const comments = ref([])
const commentText = ref('')
const replyTo = ref(null)

const isOwner = props.currentUser && props.currentUser.id === props.post.user_id

watch(showComments, (newVal) => {
  if (newVal && comments.value.length === 0) {
    fetchComments()
  }
})

const fetchComments = async () => {
  isLoadingComments.value = true
  try {
    const res = await getComments(props.post.id, props.token)
    if (res.code === 200) {
      comments.value = res.data
    }
  } catch (e) {
    console.error('获取评论失败:', e)
  } finally {
    isLoadingComments.value = false
  }
}

const handleLike = async () => {
  if (!props.token) return alert('身份未验，请先入关')
  try {
    const res = await toggleLike(props.post.id, props.token)
    if (res.code === 200) {
      emit('update', { 
        ...props.post, 
        is_liked: res.data.liked,
        likes_count: res.data.liked ? props.post.likes_count + 1 : props.post.likes_count - 1
      })
    }
  } catch (e) {
    console.error('点赞失败:', e)
  }
}

const setReply = (comment) => {
  replyTo.value = comment
  // 滚动到输入框或聚焦
}

const handleComment = async () => {
  if (!props.token) return alert('身份未验，请先入关')
  if (!commentText.value.trim()) return
  
  isSubmitting.value = true
  try {
    const res = await addComment({
      post_id: props.post.id,
      content: commentText.value,
      parent_id: replyTo.value?.id
    }, props.token)
    
    if (res.code === 200) {
      commentText.value = ''
      replyTo.value = null
      await fetchComments()
      emit('update', { ...props.post, comments_count: props.post.comments_count + 1 })
    }
  } catch (e) {
    alert('走笔受阻，由于: ' + (e.response?.data?.message || e.message))
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteComment = async (id) => {
  if (!confirm('确定撤回此番高见？')) return
  try {
    const res = await deleteComment(id, props.token)
    if (res.code === 200) {
      await fetchComments()
      emit('update', { ...props.post, comments_count: props.post.comments_count - 1 })
    }
  } catch (e) {
    console.error('删除评论失败:', e)
  }
}

const formatDate = (iso) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>

<script>
// 这里定义递归子组件 CommentItem
import { h, defineComponent } from 'vue'

const CommentItem = defineComponent({
  name: 'CommentItem',
  props: ['comment', 'postId', 'currentUser'],
  emits: ['reply', 'delete'],
  setup(props, { emit }) {
    return () => {
      const { comment, currentUser } = props
      const isAuthor = currentUser && currentUser.id === comment.user_id

      return h('div', { class: 'space-y-4' }, [
        h('div', { class: 'flex gap-3 group/comment' }, [
          h('img', { 
            src: comment.author?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80',
            class: 'w-7 h-7 rounded-full object-cover shrink-0'
          }),
          h('div', { class: 'flex-1' }, [
            h('div', { class: 'flex items-center justify-between mb-1' }, [
              h('span', { class: 'text-[11px] font-serif tracking-widest text-ink-base' }, comment.author?.username),
              h('div', { class: 'flex items-center gap-3 opacity-0 group-hover/comment:opacity-100 transition-opacity' }, [
                h('button', { 
                  class: 'text-[10px] font-serif text-ink-light hover:text-china-red',
                  onClick: () => emit('reply', comment)
                }, '回复'),
                isAuthor ? h('button', { 
                  class: 'text-[10px] font-serif text-ink-light/40 hover:text-china-red',
                  onClick: () => emit('delete', comment.id)
                }, '删除') : null
              ])
            ]),
            h('p', { class: 'text-xs font-serif leading-relaxed text-ink-light' }, comment.content),
          ])
        ]),
        // 递归渲染子评论
        comment.replies && comment.replies.length > 0 ? h('div', { class: 'pl-10 space-y-4 border-l border-ink-light/5' }, 
          comment.replies.map(reply => h(CommentItem, { 
            comment: reply, 
            postId: props.postId,
            currentUser: props.currentUser,
            onReply: (c) => emit('reply', c),
            onDelete: (id) => emit('delete', id)
          }))
        ) : null
      ])
    }
  }
})
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
