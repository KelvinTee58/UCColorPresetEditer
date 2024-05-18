import { createRouter, createWebHashHistory } from "vue-router";
// import { headerMenuLayout, dndHeaderMenuLayout, defaultLayout } from "@/components/layout";
import { defaultLayout } from "@/components/layout";
import testRouter from "./modules/test.ts";
import indexRouter from "./modules/index.ts";
import editerRouter from "./modules/editer.ts";

// 本地静态路由
export const constantRoutes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    // path: '/404',
    path: "/:pathMatch(.*)*", // 防止浏览器刷新时路由未找到警告提示: vue-router.mjs:35 [Vue Router warn]: No match found for location with path "/xxx"
    component: defaultLayout,
    children: [
      {
        path: "",
        component: () => import("@/views/error-page/404.vue"),
      },
    ],
  },

  ...testRouter,
  ...editerRouter,
  ...indexRouter,
];
// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;
