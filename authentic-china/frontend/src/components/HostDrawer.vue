<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex justify-end font-sans">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-ink-base/60 backdrop-blur-[2px] transition-opacity" @click="closeDrawer"></div>
    
    <!-- 抽屉本体 -->
    <div class="relative w-full sm:w-[500px] h-full bg-paper-base shadow-2xl flex flex-col animate-slide-in-right overflow-hidden border-l border-ink-light/20">
      
      <!-- 滚动相册与返回按钮 -->
      <div class="relative h-72 shrink-0 overflow-hidden group">
        <img :src="host.photos[0] || host.avatar" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-ink-base/90 to-transparent"></div>
        
        <button @click="closeDrawer" class="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-colors shadow-lg z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <!-- 详细大图轮流区 -->
        <div class="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto no-scrollbar snap-x">
          <img v-for="(img, idx) in host.photos.slice(1)" :key="idx" :src="img" class="w-32 h-24 object-cover rounded-sm border-2 border-paper-light shadow-lg shrink-0 snap-start" />
        </div>
      </div>

      <!-- 可滚动的内容区 -->
      <div class="flex-1 overflow-y-auto no-scrollbar">
        <!-- 个人资料面板 -->
        <div class="p-8 pb-10 bg-paper-base relative z-10">
          <div class="flex justify-between items-start mb-6">
             <div class="flex items-center gap-5">
                <img :src="host.avatar" class="w-20 h-20 rounded-full border-2 border-accent-red/20 object-cover shadow-md" />
                <div>
                   <h2 class="text-4xl font-serif text-ink-base tracking-widest">{{ host.name }}</h2>
                   <div class="flex items-center gap-2 mt-2">
                     <span class="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                     <span class="text-sm text-ink-light tracking-widest">在地守候</span>
                   </div>
                </div>
             </div>
             <div class="text-center">
               <div class="text-3xl font-serif text-accent-red">{{ host.reputationScore }}</div>
               <div class="text-[10px] text-ink-light tracking-widest">温度值</div>
             </div>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-8">
             <span v-for="tag in host.tags" :key="tag" class="text-xs bg-ink-light text-paper-base px-3 py-1.5 rounded-sm font-serif shadow-sm">
               # {{ tag }}
             </span>
          </div>

          <div class="relative">
            <span class="absolute -top-3 -left-3 text-4xl text-ink-light/20 font-serif">"</span>
            <p class="text-ink-base font-serif text-lg leading-loose tracking-wide indent-8 text-justify">
              {{ host.bio }}
            </p>
          </div>
        </div>

        <!-- 极简预约表单区 -->
        <div class="p-8 bg-paper-light border-t border-ink-light/10 mt-auto min-h-[350px]">
          <h3 class="text-2xl font-serif text-ink-base mb-8 tracking-wide flex items-center gap-3">
             <span class="w-1.5 h-6 bg-accent-red"></span> 发起拜谒邀约
          </h3>
          
          <div class="space-y-6">
             <div class="flex gap-4">
               <div class="w-1/2">
                 <label class="block text-xs text-ink-light mb-2 tracking-widest">初见吉日</label>
                 <input v-model="form.start_date" type="date" class="w-full bg-white border border-ink-light/20 rounded-sm p-4 outline-none focus:border-accent-red/80 font-mono text-ink-base shadow-sm transition-colors" />
               </div>
               <div class="w-1/2">
                 <label class="block text-xs text-ink-light mb-2 tracking-widest">辞别日期</label>
                 <input v-model="form.end_date" type="date" class="w-full bg-white border border-ink-light/20 rounded-sm p-4 outline-none focus:border-accent-red/80 font-mono text-ink-base shadow-sm transition-colors" />
               </div>
             </div>
             
             <div class="flex gap-4">
               <div class="w-1/3">
                 <label class="block text-xs text-ink-light mb-2 tracking-widest">同行数</label>
                 <input v-model="form.guest_count" type="number" min="1" class="w-full bg-white border border-ink-light/20 rounded-sm p-4 outline-none focus:border-accent-red/80 text-center text-ink-base shadow-sm" />
               </div>
               <div class="w-2/3">
                 <label class="block text-xs text-ink-light mb-2 tracking-widest">投递私信</label>
                 <textarea v-model="form.message" rows="1" placeholder="留几句想对主家说的话..." class="w-full bg-white border border-ink-light/20 rounded-sm p-4 outline-none focus:border-accent-red/80 resize-none text-ink-base shadow-sm h-[58px]"></textarea>
               </div>
             </div>
          </div>

          <div class="mt-12 flex items-center justify-between pt-6 border-t border-ink-light/10">
             <div>
                <p class="text-xs text-ink-light tracking-widest mb-1">预计盘缠</p>
                <p class="text-3xl font-serif text-ink-base font-bold tracking-wider">¥ <span class="text-4xl">{{ totalPrice }}</span></p>
             </div>
             
             <button @click="submitReq" :disabled="isLoading" class="bg-ink-base text-paper-base px-10 py-4 rounded-sm font-serif text-lg tracking-[0.2em] hover:bg-accent-red transition-all shadow-xl disabled:opacity-50 disabled:grayscale transform hover:-translate-y-1">
                 {{ isLoading ? '研墨遣使中' : '呈递拜帖' }}
             </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { submitOrder } from '../api/city'

const props = defineProps({
  isOpen: Boolean,
  host: Object,
  cityId: Number
})
const emit = defineEmits(['close'])

const closeDrawer = () => {
  if (!isLoading.value) emit('close')
}

const form = ref({
  start_date: '',
  end_date: '',
  guest_count: 1,
  message: ''
})

const isLoading = ref(false)

const totalPrice = computed(() => {
  if (!form.value.start_date || !form.value.end_date) return props.host?.dailyPrice || 0
  const start = new Date(form.value.start_date)
  const end = new Date(form.value.end_date)
  const diffTime = end - start
  if (diffTime < 0) return props.host?.dailyPrice || 0
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return (diffDays > 0 ? diffDays : 1) * (props.host?.dailyPrice || 0)
})

const submitReq = async () => {
  if (!form.value.start_date) {
    alert("请定好相见的日期再呈递拜帖！");
    return;
  }
  
  isLoading.value = true
  const orderData = {
    host_id: props.host.userId,
    city_id: props.cityId,
    start_date: form.value.start_date,
    end_date: form.value.end_date || form.value.start_date,
    guest_count: form.value.guest_count,
    message: form.value.message,
    total_price: totalPrice.value
  }
  
  const res = await submitOrder(orderData)
  isLoading.value = false
  
  if (res && res.code === 201) {
    alert("🚀 拜帖已乘风送达，主家『" + props.host.name + "』将会尽快给您回信！")
    closeDrawer()
  } else {
    alert("山高路远信使延误，请检查网络或后端后重试。")
  }
}
</script>

<style scoped>
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slideInRight 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
