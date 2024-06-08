import { defineStore } from "pinia";
import { ref } from "vue";
import { reject, findIndex } from "lodash";
import { FontFamily } from "@/data/structure/uuc_interface";
import { toast } from "@/components/ui/toast";
// import { UucBlock } from "@/data/structure/uuc";

export const uucDataStore = defineStore(
  "uucData",
  () => {
    //当前选中的module的id
    const fontFamilyNameList = ref<FontFamily[]>([]);

    function resetFontFamilyNameList() {
      fontFamilyNameList.value = [];
    }

    function mountedLink(url: string) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.charset = "UTF-8";
      link.href = url + ":wght@400;500";
      document.head.appendChild(link);
    }

    function mountedFontLink() {
      for (let index = 0; index < fontFamilyNameList.value.length; index++) {
        const item = fontFamilyNameList.value[index];
        if (item.url) {
          mountedLink(item.url);
        }
      }
    }

    function pushFontFamilyNameList(value: FontFamily) {
      let index = findIndex(fontFamilyNameList.value, function (item) {
        return item.name == value.name;
      });
      if (index == -1) {
        fontFamilyNameList.value.push(value);
        if (value.url) {
          mountedLink(value.url);
        }
      } else {
        toast({
          title: "This font already exists",
        });
      }
    }

    function deleteFontFamilyNameList(name: string) {
      // let familyIndex = fontFamilyNameList.value.findIndex((item) => item.name === name);
      fontFamilyNameList.value = reject(fontFamilyNameList.value, { name });
    }

    return { fontFamilyNameList, resetFontFamilyNameList, pushFontFamilyNameList, deleteFontFamilyNameList, mountedFontLink };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: true,
  }
);
