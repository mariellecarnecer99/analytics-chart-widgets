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
    name: 'Add Report',
    component: () => import('../../../chart-container/src/layouts/default/Default.vue'),
  },
  { 
    path: '/report/:id',
    name: 'Edit Report',
    component: () => import('../../../chart-container/src/layouts/default/Default.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
