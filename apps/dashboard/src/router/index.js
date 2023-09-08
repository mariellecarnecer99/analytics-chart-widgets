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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Reports.vue'),
      },
    ],
  },
  {
    path: '/report',
    name: 'Add Report',
    component: () => import('../../../chart-container/src/layouts/default/Default.vue'),
    // children: [
    //   { 
    //     path: '/report',
    //     name: 'Report',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    //   },
    // ],
  },
  { 
    path: '/report/:id',
    name: 'Edit Report',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../../../chart-container/src/layouts/default/Default.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
