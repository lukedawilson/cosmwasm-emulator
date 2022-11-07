import { createRouter, createWebHistory } from 'vue-router'
import UploadView from '../views/UploadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UploadView
    },
    {
      path: '/instantiate',
      name: 'instantiate',
      component: () => import('../views/InstantiateView.vue')
    }
  ]
})

export default router
