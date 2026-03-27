<template>
  <div class="h-full overflow-y-auto">
    <div class="flex h-full">
      
      <!-- 左侧卷轴：表单配置 -->
      <div class="w-full lg:w-1/2 overflow-y-auto px-12 xl:px-16 py-12 border-r border-ink-light/10 relative">
        <div class="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20 mix-blend-multiply"></div>
        
        <div class="max-w-xl mx-auto relative z-10">
          <div class="mb-10">
            <h2 class="text-4xl font-serif text-ink-base mb-2 tracking-[0.2em] relative inline-flex items-center gap-3">
              <span class="w-1 h-8 bg-china-red"></span>
              地道秘籍挂牌
            </h2>
            <p class="text-ink-light font-serif tracking-widest text-sm mt-3">在此修书造册，将您的宅院挂入神州图志。</p>
          </div>

          <form @submit.prevent="submitProfile" class="space-y-10">
            
            <!-- 城池选择 -->
            <div class="space-y-4">
              <label class="block text-ink-base font-bold tracking-widest text-sm">选择挂名城池</label>
              <div class="flex gap-3">
                <button 
                  type="button"
                  v-for="city in availableCities" :key="city"
                  @click="form.cityName = city"
                  class="flex-1 py-3 text-center border transition-all rounded-sm tracking-widest text-sm font-serif shadow-sm"
                  :class="form.cityName === city ? 'bg-china-red border-china-red text-white shadow-china-red/20' : 'bg-white border-ink-light/20 text-ink-light hover:border-china-red/50 hover:text-china-red'"
                >
                  {{ city }}
                </button>
              </div>
              <p v-if="!form.cityName" class="text-xs text-china-red/80 tracking-widest">必选：请挑一座名城开张</p>
            </div>

            <!-- 迎客招牌 -->
            <div class="relative group">
              <input 
                v-model="form.specialtyFood"
                type="text" 
                placeholder=" "
                class="block w-full px-1 py-3 bg-transparent border-0 border-b-2 border-ink-light/20 focus:ring-0 focus:border-china-red transition-colors text-ink-black outline-none peer text-lg font-serif tracking-widest" 
              />
              <label class="absolute left-1 top-3 text-ink-light text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-china-red peer-valid:-top-4 peer-valid:text-xs tracking-widest font-serif pointer-events-none">
                迎客招牌 (如：金陵盐水鸭首绝)
              </label>
            </div>

            <!-- 待客之道 -->
            <div class="relative group">
              <textarea 
                v-model="form.bio"
                rows="4"
                placeholder=" "
                class="block w-full px-1 py-3 bg-transparent border-0 border-b-2 border-ink-light/20 focus:ring-0 focus:border-china-red transition-colors text-ink-black outline-none peer text-[15px] font-serif tracking-widest leading-loose resize-none" 
              ></textarea>
              <label class="absolute left-1 top-3 text-ink-light text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-china-red peer-valid:-top-4 peer-valid:text-xs tracking-widest font-serif pointer-events-none">
                待客之道 (介绍您的客房与绝活)
              </label>
            </div>

            <!-- 封面图本地上传 -->
            <div class="space-y-3">
              <label class="block text-ink-base font-bold tracking-widest text-sm">客栈图册 (本地上传)</label>
              <label 
                for="coverImageInput"
                class="group relative block w-full h-44 border-2 border-dashed border-ink-light/30 rounded-sm cursor-pointer bg-white hover:border-china-red/50 hover:bg-china-red/5 transition-all overflow-hidden"
              >
                <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all" :class="imagePreview ? 'bg-ink-base/40 opacity-0 hover:opacity-100' : ''">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" :class="imagePreview ? 'text-white' : 'text-ink-light/40'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm tracking-widest font-serif" :class="imagePreview ? 'text-white' : 'text-ink-light/50'">
                    {{ imagePreview ? '点击更换图片' : '点击或拖拽上传图片' }}
                  </span>
                  <span v-if="!imagePreview" class="text-xs text-ink-light/30 font-sans">支持 JPG / PNG / GIF，最大 10MB</span>
                </div>
                <input id="coverImageInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
              </label>

              <div v-if="isUploading" class="flex items-center gap-3 text-sm text-ink-light">
                <svg class="animate-spin w-4 h-4 text-china-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="tracking-widest font-serif">墨宝传输中...</span>
              </div>
              <p v-if="form.coverImage && !isUploading" class="text-xs text-green-600 tracking-widest font-sans">✓ 图册已收录，装裱即可挂牌</p>
            </div>

            <div class="flex items-center gap-3 pt-4">
              <input type="checkbox" id="canHostInfo2" v-model="form.canHostStay" class="w-5 h-5 accent-china-red cursor-pointer" />
              <label for="canHostInfo2" class="tracking-widest text-sm text-ink-base font-bold font-serif cursor-pointer select-none">提供住宿床铺 (接人落脚)</label>
            </div>

            <button 
              type="submit"
              :disabled="isLoading || !form.cityName"
              class="w-full mt-8 bg-ink-base text-paper-light py-5 text-xl font-serif tracking-[0.5em] rounded-sm shadow-xl transition-all hover:bg-china-red disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0"
            >
              {{ isLoading ? '正在打制铭牌...' : '装裱挂牌' }}
            </button>
          </form>
        </div>
      </div>

      <!-- 右侧画卷：实时预览 -->
      <div class="hidden lg:flex w-1/2 bg-[#E2DFD8] relative items-center justify-center flex-col overflow-hidden">
        <div class="absolute inset-0 grayscale opacity-20 mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=1500')] bg-cover"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-ink-base/40 to-transparent"></div>
        
        <h3 class="absolute top-12 font-serif text-ink-base/60 text-sm tracking-[0.5em] z-10">铭牌展示预览</h3>

        <div class="relative z-10 scale-[1.05] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transform -rotate-2 hover:rotate-0 transition-transform duration-700">
          <HostCard :host="previewHostData" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import HostCard from '../HostCard.vue'

const props = defineProps({ user: Object, token: String })
const isLoading = ref(false)
const isUploading = ref(false)
const imagePreview = ref('')
const availableCities = ['南京', '成都', '西安']

const form = ref({ cityName: '', specialtyFood: '', bio: '', coverImage: '', canHostStay: true })

const fetchMyProfile = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/v1/host/profile', { headers: { Authorization: `Bearer ${props.token}` } })
    if (data.data && data.data.length > 0) {
      const profile = data.data[0]
      form.value.cityName = profile.city?.name || ''
      form.value.specialtyFood = profile.specialty_food || ''
      form.value.bio = profile.bio || ''
      form.value.canHostStay = profile.can_host_stay
      const savedCover = props.user?.avatar || ''
      form.value.coverImage = savedCover
      if (savedCover) imagePreview.value = savedCover
    }
  } catch(e) {}
}

onMounted(() => { fetchMyProfile() })

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  imagePreview.value = URL.createObjectURL(file)
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await axios.post('http://localhost:3000/api/v1/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${props.token}` }
    })
    if (data.code === 200) form.value.coverImage = data.data.url
  } catch(e) {
    alert('图片上传失败: ' + (e.response?.data?.message || e.message))
    imagePreview.value = ''
  } finally {
    isUploading.value = false
  }
}

const previewHostData = computed(() => ({
  name: props.user?.username || '佚名东家',
  avatar: imagePreview.value || props.user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=100',
  photos: imagePreview.value ? [imagePreview.value] : ['https://images.unsplash.com/photo-1574044158428-fbff7ce243ec?w=600'],
  reputationScore: 100,
  tags: [form.value.cityName ? `${form.value.cityName}地主` : '云游四海', form.value.canHostStay ? '可借宿' : '仅宴请/游玩', form.value.specialtyFood || '拿手绝活'].filter(Boolean),
  bio: form.value.bio || '在此题写您的迎客之道，以琴棋书画会天下知音...',
  dailyPrice: 0
}))

const submitProfile = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.put('http://localhost:3000/api/v1/host/profile', form.value, { headers: { Authorization: `Bearer ${props.token}` } })
    if (data.code === 200) alert('恭贺东家！您的客栈图册已悬挂至城墙总局。')
  } catch(e) {
    alert(e.response?.data?.message || '网络衙门阻塞，请稍后再试。')
  } finally {
    isLoading.value = false
  }
}
</script>
