import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

// svg
import svgSprites from "rollup-plugin-svg-sprites";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 获取`.env`环境配置文件
  const env = loadEnv(mode, process.cwd());

  console.log(">>>>>>>>> start " + env.VITE_ENV + " env <<<<<<<<<");
  return {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    plugins: [
      vue(),
      svgSprites({
        exclude: ["node_modules/**"],
        vueComponent: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // 反向代理解决跨域问题
    server: {
      // host: 'localhost', // 只能本地访问
      host: "0.0.0.0", // 局域网别人也可访问
      port: Number(env.VITE_PORT),
      // 运行时自动打开浏览器
      // open: env.VITE_OPEN,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_SERVICE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
        },
      },
    },
  };
});
