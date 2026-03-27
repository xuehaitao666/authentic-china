import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('auth_token') || '')
const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))

export function useAuth() {
  const isAuth = computed(() => !!token.value)
  const currentRole = computed(() => user.value?.role || 'tourist')

  const setAuth = (newToken, userData) => {
    token.value = newToken
    user.value = userData
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const updateUser = (updatedData) => {
    user.value = { ...user.value, ...updatedData }
    localStorage.setItem('auth_user', JSON.stringify(user.value))
  }

  const roleTextMap = {
    'tourist': '神游',
    'host': '主家',
    'admin': '司局长'
  }

  const myRoleText = computed(() => roleTextMap[user.value?.role] || '游方')

  return {
    token,
    user,
    isAuth,
    currentRole,
    myRoleText,
    setAuth,
    clearAuth,
    updateUser
  }
}
