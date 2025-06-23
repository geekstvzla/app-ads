import { createRouter, createWebHistory } from 'vue-router';
import newAds from '../views/ads/NewAds.vue';
import userList from '../views/users/UserList.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: newAds
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: userList
    }
  ]
})

export default router