import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import HostDashboardView from '../views/HostDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/tourist/map',
      name: 'home',
      component: HomeView
    },
    {
      path: '/host/dashboard',
      name: 'hostDashboard',
      component: HostDashboardView
    },
    {
      path: '/city/:id',
      name: 'city',
      component: () => import('../views/CityDetailView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  let user = null
  try {
    user = JSON.parse(localStorage.getItem('auth_user'))
  } catch (e) {}

  if (to.path === '/' && token && user) {
     if (user.role === 'host') next('/host/dashboard')
     else next('/tourist/map')
  } else if (to.path !== '/' && !token) {
     next('/')
  } else if (to.path.startsWith('/host') && user?.role !== 'host') {
     next('/tourist/map')
  } else {
     next()
  }
})

export default router
