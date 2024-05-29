import { computed } from "vue";
import { get } from "lodash";
import store from "@/store";

const editerViewStore = store.editerView.editerViewStore();
const editerListStore = store.editerList.editerListStore();

class propsOption<T> {
  returnType: string;
  propsDefault?: T;
  setModuleItemDescription?: Object;
  getFunction?: () => T;
  setFunction?: (val: T) => void;

  constructor(object: Partial<propsOption<T>>) {
    this.returnType = object.returnType ?? "any";
    this.propsDefault = object.propsDefault;
    this.setModuleItemDescription = object.setModuleItemDescription;
    this.getFunction = object.getFunction;
    this.setFunction = object.setFunction;
  }
}

function propsComputed<T>(propsKey: string, option: Partial<propsOption<T>>) {
  let setModuleItemDescription = option.setModuleItemDescription ?? { type: "style", description: `${propsKey}-修改` };
  let getPropsKey = ["activeModule", propsKey];
  let r_propsKey = getPropsKey.join(".").replace(/\.$/, "");
  const t_option = new propsOption<T>(option);
  // console.log("t_option :>> ", t_option.returnType);

  let gFunction = t_option.getFunction ? t_option.getFunction : () => get(editerViewStore, r_propsKey, t_option.propsDefault ?? "");

  let sFunction = t_option.setFunction
    ? t_option.setFunction
    : (val: T) => {
        let id = get(editerViewStore, "activeModule.id", "");
        if (id) {
          let modifyArray: any = { id };
          modifyArray[propsKey] = val;
          editerListStore.setModuleItem(modifyArray, setModuleItemDescription);
        }
      };

  return computed<T>({
    get: gFunction,
    set: sFunction,
  });
}

export default propsComputed;
