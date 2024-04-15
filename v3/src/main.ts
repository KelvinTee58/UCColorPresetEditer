import { createApp } from "vue";
import App from "./App.vue";

// 自定义样式
import "@/assets/index.css";
import "./style.css";

const app = createApp(App);

// 路由
import router from "@/router/index.ts";
app.use(router);

// pinia
import { createPinia } from "pinia";
const pinia = createPinia();
// pinia 插件 pinia-plugin-persistedstate 持久化数据
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
pinia.use(piniaPluginPersistedstate);
//  pinia 插件 pinia-plugin-persistedstate 全局持久化配置默认 到sessionStorage
// import { createPersistedState } from 'pinia-plugin-persistedstate'
// pinia.use(
//   createPersistedState({
//     storage: sessionStorage,
//   })
// )
import store from "@/store";
app.config.globalProperties.$store = store;
app.use(pinia);

// 配置全局api
import api from "@/api";
app.config.globalProperties.$api = api;

// 本地化

import { createI18n } from "vue-i18n";
import { en, zh } from "./locales/lang.json";
const i18n = createI18n({
  legacy: false,
  locale: "en", // 默认语言
  messages: { en, zh },
});
app.use(i18n);

// 拖拽组件
import VueDraggableResizable from "vue-draggable-resizable";
app.component("vue-draggable-resizable", VueDraggableResizable);

app.mount("#app");
