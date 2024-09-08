import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { House, Calendar, Coin, VideoPlay, Edit } from '@element-plus/icons-vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: '首页',
      icon: <House />
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: {
      title: '日历',
      icon: <Calendar />
    }
  },
  {
    path: '/httpCache',
    name: 'httpCache',
    component: () => import('../views/HttpCache/HttpCacheView.vue'),
    meta: {
      title: '接口缓存',
      icon: <Coin />
    }
  },
  {
    path: '/tableRowSpan',
    name: 'tableRowSpan',
    component: () => import('../views/TableRowSpan.vue'),
    meta: {
      title: 'table 合并',
      iconfont: 'icon-table'
    }
  },
  {
    path: '/videoView',
    name: 'videoView',
    component: () => import('../views/VideoView.vue'),
    meta: {
      title: '视频',
      icon: <VideoPlay />
    }
  },
  {
    path: '/contenteditableView',
    name: 'contenteditableView',
    component: () => import('../views/ContenteditableView.vue'),
    meta: {
      title: '编辑输入框',
      icon: <Edit />
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
