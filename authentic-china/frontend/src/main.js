import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import router from './router'

// 每次刷新/打开页面，强制清除上次的登录状态，要求重新签押入关
localStorage.removeItem('auth_token')
localStorage.removeItem('auth_user')

const app = createApp(App)
app.use(router)
app.mount('#app')
