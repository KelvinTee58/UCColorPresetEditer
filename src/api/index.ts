// 拿到所有api
const modulesFiles = import.meta.glob('./*/*.*', { eager: true });

interface FileModule {
  [key: string]: any; // 字段扩展声明
}

const modules:FileModule = {};
for (const key in modulesFiles) {
  const moduleName = key.replace(/(.*\/)*([^.]+).*/gi, '$2');
  const value:any = modulesFiles[key];
  if (value.default) {
    // 兼容js
    modules[moduleName] = value.default;
  } else {
    // 兼容ts
    modules[moduleName] = value;
  }
}
// console.log('api modules', modules);
export default modules;
