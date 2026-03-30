import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref('success') // 'login', 'logout', 'success', 'error'
  const timeoutId = ref(null)

  // Full Ink Splash Transition State
  const isSplashActive = ref(false)
  const splashMessage = ref('')

  // Logout Roll-up Sequence State
  const isLogoutActive = ref(false)

  const triggerSplash = (msg) => {
    splashMessage.value = msg
    isSplashActive.value = true
    
    // Auto-reset after animation completes (approx 2s)
    setTimeout(() => {
      isSplashActive.value = false
    }, 2500)
  }

  const startLogoutSequence = () => {
    isLogoutActive.value = true
    // Sequence will be managed by App.vue timing, 
    // but we auto-reset after a safe duration for next entry
    setTimeout(() => {
      isLogoutActive.value = false
    }, 3000)
  }

  const showToast = (toastType, toastMessage = '') => {
    // Clear existing timeout if any
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }

    type.value = toastType
    message.value = toastMessage
    isVisible.value = true

    // Auto hide after 3 seconds for regular toasts, 
    // maybe longer for animations
    const duration = toastType === 'login' || toastType === 'logout' ? 4000 : 3000
    
    timeoutId.value = setTimeout(() => {
      isVisible.value = false
    }, duration)
  }

  const hideToast = () => {
    isVisible.value = false
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
  }

  return {
    isVisible,
    message,
    type,
    isSplashActive,
    splashMessage,
    isLogoutActive,
    showToast,
    hideToast,
    triggerSplash,
    startLogoutSequence
  }
})
