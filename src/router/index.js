import { createRouter, createWebHistory } from 'vue-router'
import newAds from '../views/ads/NewAds.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: newAds
    }
  ]
})

export default router