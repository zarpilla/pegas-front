import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivitiesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/session/:sessionId',
      name: 'activity-session-id',
      component: () => import('../views/SessionView.vue')
    },
    {
      path: '/assistance/:sessionId',
      name: 'assistance-session-id',
      component: () => import('../views/AssistanceView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  }
  // Check if route is for guests only (like login page)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'activities' })
  }
  else {
    next()
  }
})

export default router
