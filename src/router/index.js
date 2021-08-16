import { createRouter, createWebHistory } from 'vue-router'
import log from '../views/log.vue'
import roll from '../views/roll.vue'
import setting from '../views/setting.vue'

const routes = [
  {
    path: '/',
    name: 'setting',
    component: setting
  },
  {
    path: '/log',
    name: 'log',
    component: log
  },
  {
    path: '/roll',
    name: 'roll',
    component: roll
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
