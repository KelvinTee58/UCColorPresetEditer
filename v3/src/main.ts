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
import { createPinia } from 'pinia'
const pinia = createPinia()
// pinia 插件 pinia-plugin-persistedstate 持久化数据
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)
//  pinia 插件 pinia-plugin-persistedstate 全局持久化配置默认 到sessionStorage
// import { createPersistedState } from 'pinia-plugin-persistedstate'
// pinia.use(
//   createPersistedState({
//     storage: sessionStorage,
//   })
// )
import store from "@/store"
app.config.globalProperties.$store = store
app.use(pinia)

// 配置全局api
import api from '@/api';
app.config.globalProperties.$api = api;

app.mount("#app");
