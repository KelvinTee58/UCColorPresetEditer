import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: "/editer",
    component: () => import("@/views/editer/index.vue"),
    meta: {
      title: "test",
    }
  },
];
export default routes;
