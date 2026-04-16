<template>
  <div class="h-full overflow-y-auto" style="background: #F5F1EA">
    <div class="max-w-3xl mx-auto px-6 py-12 space-y-12">
      
      <!-- ======== 锦囊题头 ======== -->
      <div class="mb-8">
        <h2 class="font-serif text-3xl tracking-[0.3em] mb-3" style="color: #2A2318">锦囊故事</h2>
        <p class="text-sm tracking-widest font-serif" style="color: #9A8B78">将山河间的灵光一现，收藏成一只只随身的锦囊。</p>
      </div>

      <!-- ======== 宣纸发布表单 ======== -->
      <div class="relative p-10 shadow-xl overflow-hidden rounded-sm" 
           style="background: #FFFDF9; border: 1px solid rgba(90,80,65,0.15); box-shadow: 0 10px 40px rgba(90,80,65,0.08)">
        <!-- 宣纸底纹 -->
        <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper-2.png')"></div>
        
        <form @submit.prevent="handlePublish" class="relative z-10 space-y-8">
          <!-- 文字区：行记二三事 -->
          <div class="relative group">
            <textarea 
              v-model="postForm.content"
              rows="5"
              placeholder="行记二三事..."
              class="w-full bg-transparent border-0 border-b border-ink-light/10 focus:ring-0 focus:border-china-red/40 transition-all text-lg font-serif tracking-widest leading-loose resize-none placeholder:text-ink-light/30"
              style="color: #2A2318"
            ></textarea>
            <div class="absolute bottom-0 right-0 py-2 text-[10px] tracking-widest font-sans" style="color: #B0A090">
              笔下乾坤，意在画外
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- 图片区：图册锦囊 -->
            <div class="space-y-3">
              <label class="block text-xs tracking-[0.3em] font-serif" style="color: #7A6E62">图册锦囊</label>
              <label 
                for="postImageInput"
                class="relative block w-full h-32 border border-dashed border-ink-light/20 rounded-sm cursor-pointer bg-paper-base/30 hover:bg-paper-base/60 transition-all overflow-hidden"
              >
                <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-2" :class="imagePreview ? 'opacity-0 hover:opacity-100 bg-ink-base/40 transition-opacity' : ''">
                  <svg class="w-6 h-6" :class="imagePreview ? 'text-white' : 'text-ink-light/40'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-[10px] tracking-widest font-serif" :class="imagePreview ? 'text-white' : 'text-ink-light/50'">{{ imagePreview ? '更换画卷' : '添加照片' }}</span>
                </div>
                <input id="postImageInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
              </label>
              <div v-if="isUploading" class="text-[10px] tracking-widest text-china-red animate-pulse font-serif">墨屏待干...</div>
            </div>

            <!-- 打卡城池 (下拉选择) -->
            <div class="space-y-3">
              <label class="block text-xs tracking-[0.3em] font-serif" style="color: #7A6E62">打卡城池</label>
              <div class="relative">
                <select 
                  v-model="postForm.city_id"
                  class="w-full bg-transparent border-0 border-b border-ink-light/10 focus:ring-0 focus:border-china-red/40 transition-all text-sm font-serif tracking-widest py-3 appearance-none cursor-pointer"
                  style="color: #2A2318"
                >
                  <option :value="null" style="color: #9A8B78">选择打卡城池...</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }} ({{ city.province }})</option>
                </select>
                <svg class="absolute right-0 top-4 w-3 h-3 text-ink-light/30 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
              <!-- 自定义地点补充 -->
              <input 
                v-model="postForm.location"
                type="text" 
                placeholder="具体地点 (可选)"
                class="w-full bg-transparent border-0 border-b border-ink-light/5 focus:ring-0 focus:border-china-red/20 transition-all text-[11px] font-serif tracking-widest py-1"
                style="color: #9A8B78"
              />
            </div>
          </div>

          <!-- 提交按钮：墨印成书 -->
          <div class="pt-4 flex justify-end">
            <button 
              type="submit"
              :disabled="isPublishing || !postForm.content"
              class="px-10 py-3 rounded-full font-serif tracking-[0.4em] text-sm shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:scale-100"
              style="background: #2A2318; color: #FAF8F5"
              onmouseenter="this.style.background='#9C2727'"
              onmouseleave="this.style.background='#2A2318'"
            >
              {{ isPublishing ? '刻印中...' : '墨印成书' }}
            </button>
          </div>
        </form>
      </div>

      <!-- ======== 动态流：书页展现 ======== -->
      <div class="space-y-12 pb-20">
        <div v-if="isLoading" class="text-center py-20">
          <div class="animate-spin inline-block w-8 h-8 rounded-full border-2 border-china-red/20 border-t-china-red"></div>
          <p class="mt-4 text-xs tracking-widest text-ink-light/50 font-serif">翻阅卷轴中...</p>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-20 space-y-4">
          <div class="text-5xl opacity-20">📭</div>
          <p class="font-serif text-sm tracking-[0.4em]" style="color: #B0A090">暂无锦囊，等候您的第一笔行记</p>
        </div>

        <div v-else class="space-y-12">
          <PostCard 
            v-for="post in posts" 
            :key="post.id" 
            :post="post" 
            :current-user="user"
            :token="token"
            @delete="handleDeletePost"
            @update="handlePostUpdate"
          />
          
          <!-- 加载更多 -->
          <div v-if="hasMore" class="flex justify-center pt-8">
            <button 
              @click="loadMore"
              :disabled="isLoadingMore"
              class="text-xs font-serif tracking-[0.3em] text-ink-light hover:text-china-red transition-colors flex items-center gap-2"
            >
              <span v-if="isLoadingMore" class="animate-spin inline-block w-3 h-3 rounded-full border border-current border-t-transparent"></span>
              {{ isLoadingMore ? '加载中' : '展开更多画卷' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuth } from '../../composables/useAuth'
import PostCard from '../PostCard.vue'
import { getCities } from '../../api/city'
import { createPost, getPosts, deletePost } from '../../api/social'

const props = defineProps({ user: Object })
const { token } = useAuth()

const posts = ref([])
const cities = ref([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const isPublishing = ref(false)
const isUploading = ref(false)
const imagePreview = ref('')
const page = ref(1)
const hasMore = ref(true)

const postForm = ref({
  content: '',
  image_url: '',
  location: '',
  city_id: null
})

const fetchCities = async () => {
  try {
    const res = await getCities()
    if (res.code === 200) {
      cities.value = res.data
    }
  } catch (e) {
    console.error('获取城市列表失败:', e)
  }
}

const fetchPosts = async (reset = false) => {
  if (reset) {
    page.value = 1
    posts.value = []
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const res = await getPosts({ 
      userId: props.user?.id, 
      page: page.value, 
      limit: 10 
    }, token.value)
    
    if (res.code === 200) {
      const newList = res.data.list
      posts.value = [...posts.value, ...newList]
      hasMore.value = posts.value.length < res.data.total
    }
  } catch (e) {
    console.error('获取锦囊失败:', e)
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const loadMore = () => {
  page.value++
  fetchPosts()
}

onMounted(() => {
  fetchCities()
  fetchPosts(true)
})

const handlePostUpdate = (updatedPost) => {
  const index = posts.value.findIndex(p => p.id === updatedPost.id)
  if (index !== -1) {
    posts.value[index] = updatedPost
  }
}

const handleDeletePost = async (id) => {
  if (!confirm('确定要焚毁此锦囊？此举不可撤回。')) return
  try {
    const res = await deletePost(id, token.value)
    if (res.code === 200) {
      posts.value = posts.value.filter(p => p.id !== id)
    }
  } catch (e) {
    alert('焚毁失败:' + (e.response?.data?.message || e.message))
  }
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  imagePreview.value = URL.createObjectURL(file)
  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const { data } = await axios.post('http://localhost:3000/api/v1/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token.value}`
      }
    })
    
    if (data.code === 200) {
      postForm.value.image_url = data.data.url
    }
  } catch (e) {
    alert('画轴受潮，上传失败')
    imagePreview.value = ''
  } finally {
    isUploading.value = false
  }
}

const handlePublish = async () => {
  if (!postForm.value.content.trim()) return
  
  isPublishing.value = true
  try {
    const res = await createPost(postForm.value, token.value)
    
    if (res.code === 200) {
      postForm.value = { content: '', image_url: '', location: '', city_id: null }
      imagePreview.value = ''
      await fetchPosts(true)
    }
  } catch (e) {
    alert('刻印失败，请稍后重试')
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
textarea::placeholder {
  font-family: serif;
  opacity: 0.5;
}
select {
  outline: none;
}
</style>
