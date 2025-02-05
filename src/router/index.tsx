import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { House, Calendar, Coin, VideoPlay, Edit, ChatLineSquare, ScaleToOriginal, DataLine, BottomRight, Notebook } from '@element-plus/icons-vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: '首页',
      icon: <House />
    }
  },
  {
    path: '/calendar',
    name: 'CalendarView',
    component: () => import('../views/CalendarView.vue'),
    meta: {
      title: '日历',
      icon: <Calendar />
    }
  },
  {
    path: '/httpCache',
    name: 'HttpCacheView',
    component: () => import('../views/HttpCache/HttpCacheView.vue'),
    meta: {
      title: '接口缓存',
      icon: <Coin />
    }
  },
  {
    path: '/tableRowSpan',
    name: 'TableRowSpan',
    component: () => import('../views/TableRowSpan.vue'),
    meta: {
      title: 'table 合并',
      iconfont: 'icon-table'
    }
  },
  {
    path: '/videoView',
    name: 'VideoView',
    component: () => import('../views/VideoView.vue'),
    meta: {
      title: '视频',
      icon: <VideoPlay />
    }
  },
  {
    path: '/contenteditableView',
    name: 'ContenteditableView',
    component: () => import('../views/ContenteditableView.vue'),
    meta: {
      title: '编辑输入框',
      icon: <Edit />,
      backgroundColor: '#f9f9f9'
    }
  },
  {
    path: '/resizeCardView',
    name: 'ResizeCardView',
    component: () => import('../views/ResizeCardView.vue'),
    meta: {
      title: '拖拽改变大小',
      icon: <BottomRight />
    }
  },
  {
    path: '/tooltip',
    name: 'TooltipView',
    component: () => import('../views/TooltipView.vue'),
    meta: {
      title: '是否需要提示',
      icon: <ChatLineSquare />
    }
  },
  {
    path: '/simpleSwiper',
    name: 'SimpleSwiperView',
    component: () => import('../views/SimpleSwiperView.vue'),
    meta: {
      title: '简单swiper',
      icon: <ScaleToOriginal />
    }
  },
  {
    path: '/echartsView',
    name: 'EchartsView',
    component: () => import('../views/EchartsView.vue'),
    meta: {
      title: 'Echarts',
      icon: <DataLine />
    }
  },
  {
    path: '/noticeBar',
    name: 'NoticeBarView',
    component: () => import('../views/NoticeBarView.vue'),
    meta: {
      title: '公告栏',
      iconfont: 'icon-notice'
    }
  },
  {
    path: '/fileView',
    name: 'FileView',
    component: () => import('../views/fileView/FileView.vue'),
    meta: {
      keepAlive: true,
      title: '文件预览',
      icon: <Notebook />,
      noPadding: true
    }
  },
  {
    path: '/codePage',
    name: 'CodePage',
    component: () => import('../views/CodePage.vue'),
    meta: {
      title: '代码编辑',
      iconfont: 'icon-code'
    }
  },
  {
    path: '/tabsScrollView',
    name: 'TabsScrollView',
    component: () => import('../views/TabsScrollView.vue'),
    meta: {
      title: 'tabs滚动'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
