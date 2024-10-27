import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/instantiate',
      name: 'instantiate',
      component: () => import('../views/InstantiateView.vue')
    },
    {
      path: '/emulator',
      name: 'emulator',
      component: () => import('../views/EmulatorView.vue')
    },
    {
      path: "/:catchAll(.*)",
      name: "home",
      component: HomeView
    }
  ]
})

export default router
