import { createRouter, createWebHashHistory } from "vue-router";

//制定路由规则

const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/views/Main.vue"),
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "user",
        name: "user",
        component: () => import("@/views/User.vue"),
      },
      //  下面三个是新添加的路由
      {
        path: 'mall',
        name: 'mall',
         component: () => import('@/views/Mall.vue')
      },
      {
          path: 'page1',
          name: 'page1',
          component: () => import('@/views/Page1.vue')
      },
      {
          path: 'page2',
          name: 'page2',
          component: () => import('@/views/Page2.vue')
      }
    ],
  },
];

const router = createRouter({
  //设置路由模式
  history: createWebHashHistory(),
  routes,
});

export default router;
