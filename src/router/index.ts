import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: {
      title: '日历'
    }
  },
  {
    path: '/httpCache',
    name: 'httpCache',
    component: () => import('../views/HttpCache/HttpCacheView.vue'),
    meta: {
      title: '接口缓存'
    }
  },
  {
    path: '/tableRowSpan',
    name: 'tableRowSpan',
    component: () => import('../views/TableRowSpan.vue'),
    meta: {
      title: 'table 合并'
    }
  },
  {
    path: '/videoView',
    name: 'videoView',
    component: () => import('../views/VideoView.vue'),
    meta: {
      title: '视频'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
