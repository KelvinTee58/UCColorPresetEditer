import { computed } from "vue";
import { get } from "lodash";
import store from "@/store";

const editerViewStore = store.editerView.editerViewStore();
const editerListStore = store.editerList.editerListStore();

class propsOption {
  returnType: string;
  propsDefault?: any;
  setModuleItemDescription?: Object;
  getFunction?: Function;
  setFunction?: Function;

  constructor() {
    this.returnType = "any"; // 在构造函数中赋值
  }
}

function propsComputed(propsKey: string, option: propsOption) {
  let setModuleItemDescription = option.setModuleItemDescription ? option.setModuleItemDescription : { type: "style", description: `${propsKey}-修改` };
  let getPropsKey = ["activeModule", propsKey];
  let r_propsKey = getPropsKey.join(".").replace(/\.$/, "");

  let gFunction = option.getFunction
    ? option.getFunction()
    : () => {
        return get(editerViewStore, r_propsKey, option.propsDefault ? option.propsDefault : "");
      };
  let sFunction = option.setFunction
    ? option.setFunction()
    : (val: any) => {
        let id = get(editerViewStore, "activeModule.id", "");
        if (id) {
          let modifyArray: any = {
            id,
          };
          modifyArray[propsKey] = val;
          editerListStore.setModuleItem(modifyArray, setModuleItemDescription);
        }
      };
  return computed<propsOption["returnType"]>({
    get: gFunction,
    set: sFunction,
  });
}

export default propsComputed;
