import { defineStore } from "pinia";
import { ref } from "vue";
import { UucBlock, UucImage, UucFont } from "@/data/structure/uuc";
import { MyObject, Axis, FontStyle } from "@/data/structure/uuc_interface";
import { v4 as uuidv4 } from "uuid";
import { forIn, get, has, set } from "lodash";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

interface editerRecords {
  r_id: string;
  recordArray: Array<MyObject>;
  modifyArray: Array<MyObject>;
  modifyType: MyObject;
}

export const editerListStore = defineStore(
  "editerList",
  () => {
    // 数据列表
    const editerList: any = ref([]);
    // 操作记录
    const editerListRecords = ref<editerRecords[]>([]);

    function pushList(value: any) {
      editerList.value.push(value);
    }
    function getList() {
      return editerList.value;
    }
    function setList(value: Array<UucBlock>) {
      editerList.value = [...value];
    }
    function resetList() {
      editerList.value = [];
    }

    /**
     * 添加编辑列表的一项
     * @param value
     */
    function addModuleItem(value: any, axis: Axis = { x: 10, y: 10 }) {
      // 默认初始到页面上的位置
      let classContent = value.content;
      const level = editerList.value.length;
      let newItem: UucBlock | undefined = undefined;
      const labelName = classContent.label ? classContent.label : level + value.name;
      if (classContent.type == "block") {
        newItem = new UucBlock({
          ...classContent,
          level,
          axis,
          label: labelName,
        });
      } else if (classContent.type == "image") {
        newItem = new UucImage({
          ...classContent,
          level,
          axis,
          label: labelName,
          src: "666",
        });
      } else if (classContent.type == "font") {
        const defaultFont: FontStyle = {
          size: 10,
          color: "#000000",
          family: "",
          familyName: "黑体",
          style: "normal",
          weight: "normal",
        };
        newItem = new UucFont({
          ...classContent,
          level,
          axis,
          label: labelName,
          font: defaultFont,
        });
      }
      if (newItem && newItem.type) {
        pushList(newItem);
        let el = JSON.parse(JSON.stringify(newItem));

        // 当前的操作逻辑是创建（create）逻辑
        pushRecord([], [el], { type: "create", description: "创建" });
      }
      // console.log(editerList.list);
    }

    function removeModuleItem(id_list: Array<string> | string, modifyType: any) {
      let c_id_list = Array.isArray(id_list) ? id_list : [id_list];
      let el = JSON.parse(JSON.stringify(editerList.value));
      let recordArray: Array<MyObject> = [];
      for (const idItem of c_id_list) {
        for (let index = 0; index < el.length; index++) {
          // 匹配到id对应的
          if (el[index].id === idItem) {
            recordArray.push(el[index]);
            // 记录当前的操作逻辑是删除（delete）逻辑
            editerList.value.splice(index, 1);
          }
        }
      }
      if (recordArray.length > 0) {
        toast({
          title: "Remove Objects",
          description: "Remove Objects >> id:" + id_list,
        });
        pushRecord(recordArray, [], modifyType);
      }
    }

    /**
     * 根据指定的id和key，设置value
     * @param id 修改对应的信息的id
     * @param modifyObject 修改信息
     * @param modifyType 记录的详细内容
     */
    function setModuleItem(modifyArray: Array<MyObject> | MyObject, modifyType: any) {
      // console.log("setModuleItem :>> ");
      let cModifyArray = Array.isArray(modifyArray) ? modifyArray : [modifyArray];

      let el = JSON.parse(JSON.stringify(editerList.value));
      let recordArray: Array<MyObject> = [];
      let newArray: Array<MyObject> = [];
      for (const modifyItem of cModifyArray) {
        let modifyItem_id = get(modifyItem, "id", undefined);
        if (modifyItem_id) {
          let recordObject: MyObject = { id: modifyItem_id };
          let newObject: MyObject = { id: modifyItem_id };

          // let recordItem = filter(el, { id: modifyItem_id });
          for (let index = 0; index < el.length; index++) {
            if (el[index].id === modifyItem_id) {
              forIn(modifyItem, function (value: any, key) {
                let recordValue = get(el[index], key, value);
                if (has(el[index], key) && recordValue !== value && key != "id") {
                  recordObject[key] = recordValue;
                  newObject[key] = value;
                  set(editerList.value[index], key, value);
                }
                // // 追加内部方法逻辑；
                // if (has(el[index], key) && key != "id") {
                //   // 内置对象计算
                //   if (typeof value === "function") {
                //     console.log("recordValue2 :>> ", recordValue, value, value(recordValue));
                //     recordObject[key] = recordValue;
                //     newObject[key] = value(recordValue);
                //     set(editerList.value[index], key, value);
                //   } else if (recordValue !== value) {
                //     recordObject[key] = recordValue;
                //     newObject[key] = value;
                //     set(editerList.value[index], key, value);
                //   }
                //   console.log("recordValue :>> ", recordObject, newObject, typeof value === "function");
                // }
              });
            }
          }
          // console.log("recordObject :>> ", recordObject);
          if (Object.getOwnPropertyNames(recordObject).length >= 2) {
            recordArray.push(recordObject);
            newArray.push(newObject);
          }
        }
      }
      if (recordArray.length > 0) {
        pushRecord(recordArray, newArray, modifyType);
      }
    }

    /**
     * 记录一条操作记录
     * @param recordArray 旧数据数组
     * @param modifyArray 新数据数组
     * @param modifyType 修改记录的类型
     */
    function pushRecord(recordArray: Array<MyObject>, modifyArray: Array<MyObject>, modifyType: MyObject) {
      let record: editerRecords = {
        r_id: uuidv4(),
        recordArray,
        modifyArray,
        modifyType,
      };
      editerListRecords.value.push(record);
      console.log("editerListRecords :>> ", editerListRecords.value, editerList.value);
    }

    /**
     * 后退一个记录逻辑
     */
    function cancelRecord() {}

    return { editerList, resetList, setList, getList, addModuleItem, removeModuleItem, setModuleItem, cancelRecord };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: true,
  }
);
