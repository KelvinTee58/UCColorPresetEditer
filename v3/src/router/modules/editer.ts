import { RouteRecordRaw } from "vue-router";
import { dndHeaderMenuLayout } from "@/components/layout";

const routes: RouteRecordRaw[] = [
  {
    path: "/editer",
    component: dndHeaderMenuLayout,
    meta: {
      title: "editer",
    },
    children: [
      {
        path: "",
        component: () => import("@/views/editer/index.vue"),
      },
    ],
  },
];
export default routes;
