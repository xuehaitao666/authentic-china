<template>
  <transition name="fade-modal">
    <div v-if="isOpen" class="fixed inset-0 z-[1000] flex items-center justify-center font-sans">
      <!-- 极宽容的阴影与高斯模糊遮盖满屏，暗示与世界隔离 -->
      <div 
        class="absolute inset-0 bg-ink-black/80 backdrop-blur-md" 
        @click.self="closeModal"
      ></div>

      <!-- 主屏风/折扇交互面板 -->
      <div class="relative w-[480px] bg-paper-base shadow-2xl rounded-sm flex flex-col overflow-hidden transform border border-ink-light/20 scale-100">
        
        <!-- 关城门按钮 -->
        <button @click="closeModal" class="absolute top-5 right-6 text-ink-light hover:text-china-red transition-colors z-20">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <!-- 印泥风的身份切换标签轴（包含游客与地主，Admin 隐藏在角落） -->
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
            安家 (Host)
          </button>
          
          <button 
            v-if="isAdminVisible"
            @click="activeMode = 'admin'" 
            class="pb-4 text-xl transition-all relative border-b-2"
            :class="activeMode === 'admin' ? 'text-china-red border-china-red font-bold' : 'text-ink-light hover:text-china-red border-transparent'"
          >
            司局 (Admin)
          </button>
        </div>

        <!-- 表单承载曲面 -->
        <div class="p-10 relative bg-paper-base">
          <h3 class="text-[34px] font-serif text-ink-black mb-1 flex items-center gap-3 tracking-[0.1em]">
            <span class="w-1.5 h-6" :class="activeMode==='admin' ? 'bg-ink-black' : 'bg-china-red'"></span>
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
              class="w-full text-paper-light py-4 font-serif text-2xl tracking-[0.5em] transition-all duration-500 shadow-[0_5px_20px_-5px_rgba(0,0,0,0.5)] disabled:opacity-50 mt-4 rounded-sm"
               :class="activeMode==='admin' ? 'bg-ink-black hover:bg-ink-light' : 'bg-china-red hover:bg-[#A3311A]'"
            >
              {{ isLoading ? '研墨查验...' : (isRegister ? '刻印登册' : '盖大印') }}
            </button>
          </form>

          <!-- 注册登录互转机关 -->
          <div class="mt-8 text-center" v-show="activeMode !== 'admin'">
            <button @click="isRegister = !isRegister" class="text-sm font-serif text-ink-light/70 hover:text-china-red transition-colors tracking-widest underline-offset-8 decoration-1" :style="{ textDecorationLine: 'underline' }">
              {{ isRegister ? '已录神州志？请直接过关' : '初探神州？依此登册入志' }}
            </button>
          </div>
        </div>

        <!-- 终极隐秘：司局入口暗花 (点击浮现 Admin Tab) -->
        <div 
          v-if="!isAdminVisible"
          class="absolute bottom-2 right-4 w-6 h-6 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer group flex items-center justify-center border border-china-red"
          title="司局秘库"
          @click="activateAdmin"
        >
          <span class="text-[8px] text-china-red font-serif font-bold group-hover:scale-110 transition-transform">司</span>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['close'])

const activeMode = ref('tourist') // 'tourist' | 'host' | 'admin'
const isAdminVisible = ref(false)
const isRegister = ref(false)
const isLoading = ref(false)
const form = ref({ username: '', password: '' })
const { setAuth } = useAuth()

const hintText = computed(() => {
  if (activeMode.value === 'tourist') return '天地广阔，总有一城等您落脚。'
  if (activeMode.value === 'host') return '此间烟火，由您烧热。'
  return '中枢机要，非掌印督统不得擅入。'
})

watch(() => props.isOpen, (val) => {
  if (val) {
    if(!isAdminVisible.value) activeMode.value = 'tourist'
    isRegister.value = false
    form.value = { username: '', password: '' }
  }
})

const closeModal = () => {
  if (!isLoading.value) emit('close')
}

const activateAdmin = () => {
  isAdminVisible.value = true
  activeMode.value = 'admin'
  isRegister.value = false
  form.value.username = 'admin'
}

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
    
    // 彻底切断假路，直连您本机的真机 Node.js ！
    const { data } = await axios.post(`http://localhost:3000${endpoint}`, payload);
    
    if (data.code === 200 || data.code === 201) {
      if (isRegister.value) {
         alert('名籍印记已下达！请阁下重新盖大印过关。');
         isRegister.value = false; // 注册成功强行切回登录
         form.value.password = ''; // 强迫重验密码
      } else if (data.data.token) {
         setAuth(data.data.token, data.data.user)
         closeModal()
      }
    }
  } catch (error) {
    alert(error.response?.data?.message || '风雪阻路，核查失败（请确认您的后端环境正常奔跑）');
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.4s ease;
}
.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}
</style>
