import axios from "axios";
import store from "@/store";
// import { localStorage } from '@/lib/storage';
import { h } from 'vue';
import { useToast } from "@/components/ui/toast/use-toast";
import { ToastAction } from '@/components/ui/toast'
const { toast } = useToast();

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000, // 请求超时时间：50s
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }
    // const { isLogin, tokenObj } = toRefs(store.user.useUserStore());

    // if (isLogin.value) {
    // // 授权认证
    // config.headers[tokenObj.value.tokenName] = tokenObj.value.tokenValue;
    // // 租户ID
    // config.headers['TENANT_ID'] = '1';
    // // 微信公众号appId
    // config.headers['appId'] = localStorage.get('appId');
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    const { code, msg } = res;
    if (code === 200) {
      return res;
    } else {
      // token过期
      if (code === -1) {
        handleError();
      } else {
        toast({
          title: "请求错误",
          description: msg || "系统出错",
          variant: "destructive",
        });
      }
      return Promise.reject(new Error(msg || "Error"));
    }
  },
  (error) => {
    console.log("请求异常：", error);
    if(error.response){
      // 请求成功，服务器错误
      const { msg } = error.response.data || {};
      // 未认证
      if (error.response.status === 401) {
        handleError();
      } else {
        toast({
          title: "请求异常",
          description:"网络异常，请稍后再试!",
          variant: "destructive",
        });
        return Promise.reject(new Error(msg || "Error"));
      }
    }else if(error.request){
      // 请求已发送，没有收到响应
      toast({
        title: "请求异常",
        description:"请求未响应，请稍后再试!",
        variant: "destructive",
      });
      return Promise.reject(new Error("Error"));
    }else{
      // 其他错误
      toast({
        title: "请求异常",
        description:"其他错误，请稍后再试!",
        variant: "destructive",
      });
      return Promise.reject(new Error("Error"));
    }
  }
);

// 统一处理请求响应异常
function handleError() {
  const { isLogin, logout } = store.user.useUserStore();
  if (isLogin) {
    toast({
      title: '请求错误',
      description: '您的登录账号已失效，请重新登录',
      variant: 'destructive',
      action: h(ToastAction, {
        altText: '再次登录',
      }, {
        default: logout(),
      }),
    });
  }
}

// 导出实例
export default service;
