import Vue from 'vue'
import i18n from '@/locale'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

/* Router Modules */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/work-order-sharing',
    component: () => import('@/views/share/work-order-sharing'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index'),
        name: 'index',
        meta: { title:i18n.t('sys_m016'), icon: 'el-icon-odometer', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        hidden: true,
        path: '/user-info',
        component: () => import('@/views/user/user-info'),
        name: 'user-info',
        meta: { title:i18n.t('sys_m020'), icon: 'dashboard' }
      },
      {
        hidden: true,
        path: '/change-password',
        component: () => import('@/views/user/change-password'),
        name: 'change-password',
        meta: { title:i18n.t('sys_m021'), icon: 'dashboard' }
      }
    ]
  }
]
export const asyncRoutes = [
  {
    path: '/storeroom',
    component: Layout,
    name: 'storeroom',
    meta: { title:i18n.t('sys_m017'),icon: 'el-icon-user' },
    children: [
      {
        path: '/warehouse',
        component: () => import('@/views/storeroom/warehouse'),
        name: 'warehouse',
        meta: {
          title:i18n.t('sys_m018'),
        }
      },
      {
        path: '/whats-app-list',
        component: () => import('@/views/storeroom/whats-app-list'),
        name: 'whats-app-list',
        meta: {
          title:i18n.t('sys_m019'),
        }
      },
      {
        hidden: true,
        path: '/shunt-link-list',
        component: () => import('@/views/storeroom/shunt-link-list'),
        name: 'shunt-link-list',
        meta: {
          title: '分流链接列表',
        }
      },
      {
        hidden: true,
        path: '/share-link-manage',
        component: () => import('@/views/storeroom/link_manage'),
        name: 'share-link-manage',
        meta: {
          title: '分享链接管理',
        }
      },
      {
        hidden: true,
        path: '/shunt-link-detail',
        component: () => import('@/views/storeroom/shunt-link-detail'),
        name: 'shunt-link-detail',
        meta: {
          title: '分流链接详情',
        }
      },
      {
        hidden: true,
        path: '/shunt-allocation-details',
        component: () => import('@/views/storeroom/shunt-allocation-details'),
        name: 'shunt-allocation-details',
        meta: {
          title: '分配详情',
        }
      },
      {
        hidden: true,
        path: '/shunt-link-fans-detail',
        component: () => import('@/views/storeroom/shunt-link-fans-detail'),
        name: 'shunt-link-fans-detail',
        meta: {
          title: '进粉详情',
        }
      },
      {
        hidden: true,
        path: '/modify-wa-profile',
        component: () => import('@/views/storeroom/modify-wa-profile'),
        name: 'modify-wa-profile',
        meta: {
          title: '修改WS资料',
        }
      },
      {
        hidden: true,
        path: '/modify-wa-logs',
        component: () => import('@/views/storeroom/modify-wa-logs'),
        name: 'modify-wa-logs',
        meta: {
          title: '修改WS资料日志',
        }
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    name: 'staff',
    meta: { title:i18n.t('sys_m022'),icon: 'el-icon-service' },
    children: [
      {
        path: '/list',
        component: () => import('@/views/staff/list'),
        name: 'list',
        meta: {
          title:i18n.t('sys_m023'),
        }
      },
      {
        path: '/staff-data',
        component: () => import('@/views/staff/staff-data'),
        name: 'staff-data',
        meta: {
          title:i18n.t('sys_m024'),
        }
      },
      {
        hidden: true,
        path: '/chatroom',
        component: () => import('@/views/staff/chatroom'),
        name: 'chatroom',
        meta: {
          title:i18n.t('sys_m025'),
        }
      }
    ]
  },
  {
    path: '/counterWorkOrder',
    component: Layout,
    name: 'counterWorkOrder',
    meta: { title:i18n.t('sys_m026'),icon: 'el-icon-setting' },
    children: [
      {
        path: '/counter-list',
        component: () => import('@/views/counterWorkOrder/counter-list'),
        name: 'counter-list',
        meta: {
          title:i18n.t('sys_m027'),
        }
      },
      {
        hidden: true,
        path: '/counter-account-allocation',
        component: () => import('@/views/counterWorkOrder/counter-account-allocation'),
        name: 'counter-account-allocation',
        meta: {
          title:i18n.t('sys_m028'),
        }
      },
      {
        hidden: true,
        path: '/fanDetails',
        component: () => import('@/views/counterWorkOrder/fanDetails'),
        name: 'fanDetails',
        meta: {
          title:i18n.t('sys_m029'),
        }
      },
      {
        hidden: true,
        path: '/ticket-details',
        component: () => import('@/views/counterWorkOrder/ticket-details'),
        name: 'ticket-details',
        meta: {
          title:i18n.t('sys_m030'),
        }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    name: 'task',
    meta: { title:i18n.t('sys_m031'),icon: 'el-icon-s-order' },
    children: [
      {
        path: '/whats-haveno-list',
        component: () => import('@/views/task/whats-haveno-list'),
        name: 'whats-haveno-list',
        meta: {
          title:i18n.t('sys_m032'),
        }
      },
      {
        path: '/whats-group-list',
        component: () => import('@/views/task/whats-group-list'),
        name: 'whats-group-list',
        meta: {
          title:i18n.t('sys_m033'),
        }
      },
      {
        hidden: true,
        path: '/create-was-task',
        component: () => import('@/views/task/create-was-task'),
        name: 'create-was-task',
        meta: {
          title:i18n.t('sys_g123'),
        }
      },
      {
        hidden: true,
        path: '/task-detail',
        component: () => import('@/views/task/task-detail'),
        name: 'task-detail',
        meta: {
          title:i18n.t('sys_m035'),
        }
      },
      {
        hidden: true,
        path: '/create-was-haveno',
        component: () => import('@/views/task/create-rais-task'),
        name: 'create-was-haveno',
        meta: {
          title:i18n.t('sys_m036'),
        }
      },
      {
        path: '/wa-pull-group',
        component: () => import('@/views/task/wa-pull-group'),
        name: 'wa-pull-group',
        meta: {
          title:i18n.t('sys_m037')+i18n.t('sys_q126')
        }
      },
      {
        hidden: true,
        path: '/wa-saute-group',
        component: () => import('@/views/task/wa-saute-group'),
        name: 'wa-saute-group',
        meta: {
          title:i18n.t('sys_g143')
        }
      },
      {
        hidden: true,
        path: '/saute-task-detail',
        component: () => import('@/views/task/saute-task-detail'),
        name: 'saute-task-detail',
        meta: {
          title:i18n.t('sys_m061')+i18n.t('sys_c078')
        }
      },
      {
        hidden: true,
        path: '/wa-add-group',
        component: () => import('@/views/task/wa-add-group'),
        name: 'wa-add-group',
        meta: {
          title: i18n.t('sys_m038')
        }
      },
      {
        hidden: true,
        path: '/wa-group-detail',
        component: () => import('@/views/task/wa-group-detail'),
        name: 'wa-group-detail',
        meta: {
          title: i18n.t('sys_m039'),
        }
      },
      // {
      //   path: '/ws-group-task',
      //   component: () => import('@/views/task/ws-group-task'),
      //   name: 'ws-group-task',
      //   meta: {
      //     title: i18n.t('sys_m040'),
      //   }
      // },
      {
        hidden: true,
        path: '/ws-add-group',
        component: () => import('@/views/task/ws-add-group'),
        name: 'ws-add-group',
        meta: {
          title:i18n.t('sys_m038')
        }
      },
      {
        hidden: true,
        path: '/ws-group-detail',
        component: () => import('@/views/task/ws-group-detail'),
        name: 'ws-group-detail',
        meta: {
          title:i18n.t('sys_m035')
        }
      },
      {
        hidden: true,
        path: '/ws-creat-group',
        component: () => import('@/views/task/ws-add-b-group'),
        name: 'ws-creat-group',
        meta: {
          title:i18n.t('sys_m038')
        }
      },
      {
        path: '/pullGroup',
        component: () => import('@/views/task/pullGroup'),
        name: 'pullGroup',
        meta: {
          title:i18n.t('sys_m037')+i18n.t('sys_q127')
        }
      },
      {
        path: '/whats-saute-group',
        component: () => import('@/views/task/whats-saute-group'),
        name: 'whats-saute-group',
        meta: {
          title:i18n.t('sys_m061')+i18n.t('sys_q126'),
        }
      },
      {
        // hidden: true,
        path: '/super-channel',
        component: () => import('@/views/task/super-channel'),
        name: 'super-channel',
        meta: {
          title:i18n.t('sys_rai127')
        }
      },
      {
        hidden: true,
        path: '/create-super-task',
        component: () => import('@/views/task/create-super-task'),
        name: 'create-super-task',
        meta: {
          title:i18n.t('sys_m035')
        }
      },
      {
        // hidden: true,
        path: '/super-task-detail',
        component: () => import('@/views/task/super-task-detail'),
        name: 'super-task-detail',
        meta: {
          title:i18n.t('sys_rai127')
        }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    name: 'data',
    meta: { title:i18n.t('sys_m041'),icon: 'el-icon-s-data' },
    children: [
      {
        path: '/wa-list',
        component: () => import('@/views/data/wa-list'),
        name: 'wa-list',
        meta: {
          title:i18n.t('sys_m042'),
        }
      }
    ]
  },
  {
    path: '/ipList',
    component: Layout,
    redirect: '/ipManage/ipList',
    name: 'ipList',
    meta: { title:i18n.t('sys_m043'),icon: 'el-icon-cpu' },
    children: [
      {
        path: '/ipList',
        component: () => import('@/views/ipManage/ipList'),
        name: 'ipManage',
        meta: {
          title:i18n.t('sys_m044'),
        }
      }
      // {
      //   path: '/quickReply',
      //   component: () => import('@/views/content/quickReply'),
      //   name: 'quickReply',
      //   meta: {
      //     title: '话术管理',
      //   }
      // }
    ]
  },
  {
    path: '/content',
    component: Layout,
    name: 'content',
    meta: { title: i18n.t('sys_m045'),icon: 'el-icon-folder-opened'},
    children: [
      {
        path: '/material',
        component: () => import('@/views/content/material'),
        name: 'material',
        meta: {
          title: i18n.t('sys_m046'),
        }
      },
      {
        path: '/quick-reply',
        component: () => import('@/views/content/quick-reply'),
        name: 'quick-reply',
        meta: {
          title: i18n.t('sys_m047'),
        }
      },
      {
        hidden: true,
        path: '/add',
        component: () => import('@/views/content/add'),
        name: 'add',
        meta: {
          title: i18n.t('sys_m048')
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: {
      title: i18n.t('sys_m049'),
      icon: 'lock',
    },
    children: [
      {
        path: '/userManage',
        component: () => import('@/views/permission/userManage'),
        name: 'userManage',
        meta: {
          title: i18n.t('sys_m050'),
        }
      },
      {
        path: '/roleManage',
        component: () => import('@/views/permission/roleManage'),
        name: 'roleManage',
        meta: {
          title: i18n.t('sys_m051'),
        }
      },
      {
        path: '/menuManage',
        component: () => import('@/views/permission/menuManage'),
        name: 'menuManage',
        meta: {
          title: i18n.t('sys_m052')
        }
      },
      // {
      //   path: '/logManage',
      //   component: () => import('@/views/permission/logManage'),
      //   name: 'logManage',
      //   meta: {
      //     title: '日志管理'
      //   }
      // },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
