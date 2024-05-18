import { RouteRecordRaw } from "vue-router";
import { headerMenuLayout } from "@/components/layout";

const routes: RouteRecordRaw[] = [
  {
    path: "/index",
    component: headerMenuLayout,
    meta: {
      title: "test",
    },
    children: [
      {
        path: "",
        component: () => import("@/views/index/index.vue"),
      },
    ],
  },
];
export default routes;
