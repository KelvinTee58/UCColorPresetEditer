import { RouteRecordRaw } from "vue-router";
import { dndHeaderMenuLayout } from "@/components/layout";

const routes: RouteRecordRaw[] = [
  {
    path: "/test",
    redirect: "/test/header",
    component: dndHeaderMenuLayout,
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
      {
        path: "/test/tabs",
        meta: {
          title: "tab",
        },
        component: () => import("@/views/test/tabs.vue"),
      },
    ],
  },
];
export default routes;
