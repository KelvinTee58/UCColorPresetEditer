import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: "/index",
    component: () => import("@/views/index/index.vue"),
    meta: {
      title: "test",
    }
  },
];
export default routes;
