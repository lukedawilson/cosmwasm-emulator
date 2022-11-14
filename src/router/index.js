import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InstantiateView from '../views/InstantiateView.vue'
import ExecuteQueryView from '../views/ExecuteQueryView.vue'

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
      path: '/execute-query',
      name: 'executeQuery',
      component: ExecuteQueryView
    }
  ]
})

export default router
