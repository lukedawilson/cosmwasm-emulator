import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InstantiateView from '../views/InstantiateView.vue'
import EmulatorView from '../views/EmulatorView.vue'

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
      component: InstantiateView
    },
    {
      path: '/emulator',
      name: 'emulator',
      component: EmulatorView
    }
  ]
})

export default router
