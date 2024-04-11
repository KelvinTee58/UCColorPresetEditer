import { createRouter, createWebHashHistory} from "vue-router";
import testRouter from "./modules/test.ts";

// 本地静态路由
export const constantRoutes = [
  {
    path: "/",
    redirect: "/test"
  },
  {
    // path: '/404',
    path: "/:pathMatch(.*)*", // 防止浏览器刷新时路由未找到警告提示: vue-router.mjs:35 [Vue Router warn]: No match found for location with path "/xxx"
    component: () => import("@/views/error-page/404.vue"),
  },
  ...testRouter
];
// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;


// // 循环动态导入待修复import.meta.glob 逻辑
// import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// // 导入模块文件
// const routeModules = import.meta.glob('./modules/*.ts', { eager: true });

// // 初始化路由数组
// const routes: RouteRecordRaw[] = [];

// // 遍历模块文件
// for (const path in routeModules) {
//   const module = routeModules[path];
//   routes.push(...routeModules[path].default);
// }

// // 创建路由实例
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;