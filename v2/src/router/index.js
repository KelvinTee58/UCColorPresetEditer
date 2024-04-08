import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import EditerView from "../views/Editer/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/editer",
    name: "editer",
    component: EditerView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
