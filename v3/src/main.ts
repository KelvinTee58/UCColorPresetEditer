import { createApp } from "vue";
import App from "./App.vue";

// 自定义样式
import "@/assets/styles/index.scss";
import "./style.css";

const app = createApp(App);

// 路由
import router from "@/router/index.ts";
app.use(router);

app.mount("#app");
