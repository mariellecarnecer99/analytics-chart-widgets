// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Dashboard.vue'),
    children: [
      {
        path: '/',
        name: 'Reports',
        component: () => import('@/views/Reports.vue'),
      },
    ],
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../../../chart-container/src/layouts/default/Default.vue'),
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('../../../chart-container/src/components/Preview.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
