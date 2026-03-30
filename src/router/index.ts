import { createRouter, createWebHistory } from 'vue-router'
import DzikirPagi from '@/pages/DzikirPagi.vue'
import DzikirPetang from '@/pages/DzikirPetang.vue'
import SharePage from '@/pages/SharePage.vue'
import SettingPage from '@/pages/SettingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/pagi' },
    { path: '/pagi', component: DzikirPagi },
    { path: '/petang', component: DzikirPetang },
    { path: '/share', component: SharePage },
    { path: '/setting', component: SettingPage },
  ]
})

export default router
