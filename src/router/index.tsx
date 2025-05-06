import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { House, Calendar, Coin, VideoPlay, Edit, ChatLineSquare, ScaleToOriginal, DataLine, BottomRight } from '@element-plus/icons-vue'

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
    path: '/date',
    name: 'DateView',
    redirect: '/date/calendar',
    meta: {
      title: '日历',
      icon: <Calendar />
    },
    children: [
      {
        path: '/date/calendar',
        name: 'CalendarView',
        component: () => import('../views/date/CalendarView.vue'),
        meta: {
          title: '年日历'
        }
      },
      {
        path: '/date/monthCalendar',
        name: 'MonthCalendar',
        component: () => import('../views/date/MonthCalendarView.vue'),
        meta: {
          title: '月日历'
        }
      }
    ]
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
  // {
  //   path: '/fileView',
  //   name: 'FileView',
  //   component: () => import('../views/fileView/FileView.vue'),
  //   meta: {
  //     keepAlive: true,
  //     title: '类vscode实现',
  //     iconfont: 'icon-vscode',
  //     noPadding: true
  //   }
  // },
  {
    path: '/terminalView',
    name: 'TerminalView',
    component: () => import('../views/terminal/TerminalView.vue'),
    meta: {
      keepAlive: true,
      title: '终端',
      iconfont: 'icon-terminal'
    }
  },
  {
    path: '/previewView',
    name: 'PreviewView',
    component: () => import('../views/PreviewView.vue'),
    meta: {
      title: '预览',
      hideInAside: true,
      noLayout: true,
      noPadding: true
    }
  },
  {
    path: '/codeEditor',
    name: 'CodeEditor',
    redirect: '/codeEditor/codePage',
    meta: {
      title: '代码编辑',
      iconfont: 'icon-code'
    },
    children: [
      {
        path: '/codeEditor/codePage',
        name: 'CodePage',
        component: () => import('../views/codeEditor/CodePage.vue'),
        meta: {
          title: '代码编辑'
        }
      },
      // {
      //   path: '/codeEditor/monaco-editor-page',
      //   name: 'MonacoEditorPage',
      //   component: () => import('../views/codeEditor/MonacoEditorPage.vue'),
      //   meta: {
      //     title: 'monaco-editor'
      //   }
      // }
    ]
  },
  {
    path: '/tabsScrollView',
    name: 'TabsScrollView',
    component: () => import('../views/TabsScrollView.vue'),
    meta: {
      title: 'tabs滚动',
      iconfont: 'icon-tabsScroll'
    }
  },
  {
    path: '/tesseractView',
    name: 'TesseractView',
    component: () => import('../views/tesseract/TesseractView.vue'),
    meta: {
      title: '文字识别',
      iconfont: 'icon-tesseract'
    }
  },
  {
    path: '/zoomAndDragView',
    name: 'ZoomAndDragView',
    component: () => import('../views/ZoomAndDragView.vue'),
    meta: {
      title: '拖拽缩放'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
