// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../../../dashboard/src/layouts/default/Default.vue'),
    children: [
      {
        path: '/',
        name: 'Reports',
        component: () => import(/* webpackChunkName: "home" */ '../../../dashboard/src/views/Reports.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
