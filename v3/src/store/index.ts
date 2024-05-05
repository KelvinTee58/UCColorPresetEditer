const modulesFiles = import.meta.glob("./modules/*.*", { eager: true });

interface FileModule {
  [key: string]: any; // 字段扩展声明
}

const modules: FileModule = {};
for (const key in modulesFiles) {
  const moduleName: string = key.replace(/(.*\/)*([^.]+).*/gi, "$2");
  const value: any = modulesFiles[key];
  modules[moduleName] = value;
}
// console.log('modules',modules)

export default modules;
