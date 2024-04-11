import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: "/test",
    redirect: "/test/header",
    meta: {
      title: "test",
    },
    children: [
      {
        path: "/test/header",
        meta: {
          title: "test",
        },
        component: () => import("@/views/test/index.vue"),
      },
    ],
  },
];
export default routes;
