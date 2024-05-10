/// <reference types="vite/client" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const vueComponent: DefineComponent<{}, {}, any>;
  export default vueComponent;
}

// 全局filters 报错解决
export {};
declare module "vue" {
  interface ComponentCustomProperties {
    $filters: any;
  }
}
