<template>
  <div class="relative w-screen h-screen overflow-hidden bg-[#E2DFD8]/50 flex items-center justify-center font-sans">
    
    <!-- 全屏水墨云朵背景 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <img src="https://api.iconify.design/ri:cloud-windy-fill.svg?color=%231A1C20" class="absolute top-[10%] -left-10 w-[500px] h-[500px] opacity-[0.04] animate-cloud-slow mix-blend-multiply blur-[3px]" />
      <img src="https://api.iconify.design/ri:cloud-windy-fill.svg?color=%231A1C20" class="absolute bottom-[10%] -right-20 w-[800px] h-[800px] opacity-[0.03] animate-cloud-slower mix-blend-multiply blur-[5px]" />
    </div>

    <!-- 巨大的印记 -->
    <div class="absolute top-12 left-12 z-10 pointer-events-none hidden md:flex items-start gap-4">
      <div class="flex flex-col items-center">
        <h1 class="font-serif text-6xl text-ink-base opacity-95 tracking-[0.2em] mb-4 drop-shadow-sm" style="writing-mode: vertical-rl; text-orientation: upright;">
          地道中国
        </h1>
        <div class="w-8 h-8 bg-[#9C2727] flex items-center justify-center border border-white/50 shadow-md relative rotate-3 mt-2">
          <span class="text-paper-base text-xs font-serif font-black" style="writing-mode: vertical-rl">入关</span>
        </div>
      </div>
    </div>

    <!-- 鉴权主面板 -->
    <div class="relative w-[480px] bg-paper-base shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm flex flex-col overflow-hidden transform border border-ink-light/20 z-20">
      
      <!-- 身份标签轴 -->
      <div class="flex border-b border-ink-black/10 bg-paper-light pt-8 px-10 gap-10 relative z-10 font-serif overflow-hidden">
        <button 
          @click="activeMode = 'tourist'" 
          class="pb-4 text-xl transition-all relative border-b-2"
          :class="activeMode === 'tourist' ? 'text-ink-black border-china-red' : 'text-ink-light hover:text-ink-black/70 border-transparent'"
        >
          游方 (Tourist)
        </button>
        
        <button 
          @click="activeMode = 'host'" 
          class="pb-4 text-xl transition-all relative border-b-2"
          :class="activeMode === 'host' ? 'text-ink-black border-china-red' : 'text-ink-light hover:text-ink-black/70 border-transparent'"
        >
          主家 (Host)
        </button>
      </div>

      <!-- 表单承载曲面 -->
      <div class="p-10 relative bg-paper-base">
        <h3 class="text-[34px] font-serif text-ink-black mb-1 flex items-center gap-3 tracking-[0.1em]">
          <span class="w-1.5 h-6 bg-china-red"></span>
          {{ isRegister ? '登册入志' : '奉印过关' }}
        </h3>
        <p class="text-xs text-ink-light mb-10 tracking-[0.2em]">
          {{ hintText }}
        </p>

        <form @submit.prevent="submitAuth" class="space-y-8">
          <div class="relative group">
            <input 
              v-model="form.username"
              type="text" 
              placeholder=" "
              class="block w-full px-1 py-3 bg-transparent border-0 border-b-2 border-ink-light/20 focus:ring-0 focus:border-china-red transition-colors text-ink-black outline-none peer text-lg font-serif tracking-widest" 
              required
            />
            <label class="absolute left-1 top-3 text-ink-light text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-china-red peer-valid:-top-4 peer-valid:text-xs tracking-widest font-serif pointer-events-none">
              阁下尊号 / USERNAME
            </label>
          </div>

          <div class="relative group">
            <input 
              v-model="form.password"
              type="password" 
              placeholder=" "
              class="block w-full px-1 py-3 bg-transparent border-0 border-b-2 border-ink-light/20 focus:ring-0 focus:border-china-red transition-colors text-ink-black outline-none peer text-lg font-mono tracking-widest" 
              required
            />
            <label class="absolute left-1 top-3 text-ink-light text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-china-red peer-valid:-top-4 peer-valid:text-xs tracking-widest font-serif pointer-events-none">
              通行信物 / PASSWORD
            </label>
          </div>

          <!-- 通关大印 (登录钮) -->
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full text-paper-light py-4 font-serif text-2xl tracking-[0.5em] transition-all duration-500 shadow-[0_5px_20px_-5px_rgba(0,0,0,0.5)] disabled:opacity-50 mt-4 rounded-sm bg-china-red hover:bg-[#A3311A]"
          >
            {{ isLoading ? '排查底卷...' : (isRegister ? '按手印登册' : '推门入关') }}
          </button>
        </form>

        <!-- 注册登录互转 -->
        <div class="mt-8 text-center flex flex-col gap-4">
          <button @click="isRegister = !isRegister" class="text-sm font-serif text-ink-light/70 hover:text-china-red transition-colors tracking-widest underline-offset-8 decoration-1" :style="{ textDecorationLine: 'underline' }">
            {{ isRegister ? '已有通关文牒？直接呈递过关' : '初涉江湖？取空白文牒登册' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToastStore } from '../store/toast'

const activeMode = ref('tourist') 
const isRegister = ref(false)
const isLoading = ref(false)
const form = ref({ username: '', password: '' })
const { setAuth } = useAuth()
const router = useRouter()
const toastStore = useToastStore()

const hintText = computed(() => {
  if (activeMode.value === 'tourist') return '山河广阔，行者无疆。'
  if (activeMode.value === 'host') return '开门迎客，广结良缘。'
  return ''
})

const submitAuth = async () => {
  isLoading.value = true
  const endpoint = isRegister.value ? '/api/v1/auth/register' : '/api/v1/auth/login'
  
  try {
    const payload = { 
      username: form.value.username, 
      password: form.value.password,
      role: activeMode.value, 
      role_context: activeMode.value 
    }
    
    const { data } = await axios.post(`http://localhost:3000${endpoint}`, payload)
    
    if (data.code === 200 || data.code === 201) {
      if (isRegister.value) {
         toastStore.showToast('success', '名籍印记已造！请重新输入过关')
         isRegister.value = false 
         form.value.password = '' 
      } else if (data.data.token) {
         setAuth(data.data.token, data.data.user)
         
         // 根据身份决定诗意文案
         const poeticMessage = data.data.user.role === 'host' 
            ? '府门开启，迎八方客' 
            : '踏遍山河，寻地道味'
            
         // 触发全屏水墨晕染
         toastStore.triggerSplash(poeticMessage)
         
         // 在墨迹最浓郁的 0.5 秒处执行跳转
         setTimeout(() => {
           if (data.data.user.role === 'host') {
              router.push('/host/dashboard')
           } else {
              router.push('/traveler/chronicle')
           }
         }, 500)
      }
    }
  } catch (error) {
    toastStore.showToast('error', error.response?.data?.message || '风雪阻路，通关印卷核查失败')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes floatSlow {
  0% { transform: translateY(0) translateX(0) scale(1); }
  50% { transform: translateY(-10px) translateX(10px) scale(1.02); }
  100% { transform: translateY(0) translateX(0) scale(1); }
}
@keyframes floatSlower {
  0% { transform: translateY(0) translateX(0) rotate(0deg); }
  50% { transform: translateY(-20px) translateX(-20px) rotate(2deg); }
  100% { transform: translateY(0) translateX(0) rotate(0deg); }
}
.animate-cloud-slow { animation: floatSlow 20s ease-in-out infinite; }
.animate-cloud-slower { animation: floatSlower 30s ease-in-out infinite; }
</style>
