<template>
  <div class="z-[40] rounded-lg border bg-card text-card-foreground shadow-sm border-border h-full w-full relative">
    <div class="vst-container relative overflow-hidden h-full">
      <div ref="scroller" class="scrollTab v-full overflow-x-scroll overflow-y-hidden block">
        <div :style="{ width: `${wrapWidth}px` }" class="flex flex-row select-none items-center mx-auto" ref="tabContainer">
          <!-- <div :style="{ width: `${wrapWidth}px` }" class="flex flex-row select-none items-center" ref="tabContainer"> -->
          <div class="item select-none text-center" v-for="(item, index) in c_tabs" :key="index" :index="index" :data="{ id: item.id }" @click="item.disabled ? '' : activeTabMove(item)">
            <!-- <div class="tabBox"> -->
            <div
              class="tabBox relative flex items-center mx-3 my-2 rounded-sm cursor-pointer min-w-max text-inherit tabActive h-8 leading-8"
              :class="{
                'opacity-50 !cursor-default': item.disabled,
              }"
            >
              <Icon :icon="item.icon" v-show="item.icon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 pr-1" />
              <div class="tab" :class="{ active: activeTab === item.id }">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div
          :style="{
            width: underlineMarkerStyle.width,
            left: underlineMarkerStyle.left,
          }"
          class="underline-marker absolute bottom-0 w-full left-0 top-[-2] h-0.5 rounded origin-left duration-2500 foregroundBg ease-in-out transition-[left] hover:tabActive active:tabActive bg-black"
        ></div>
        <div class="absolute top-0 left-0 arrowBg left-background pr-3 py-2 flex items-center h-12" @click="clickArrow('left')" v-show="showArrow && isArrow.left">
          <Icon icon="radix-icons:chevron-left" class="h-4 w-4" />
        </div>

        <div class="absolute top-0 right-0 arrowBg right-background pl-3 py-2 flex items-center h-12" @click="clickArrow('right')" v-show="showArrow && isArrow.right">
          <Icon icon="radix-icons:chevron-right" class="h-4 w-4" />
        </div>
      </div>
    </div>
    <div class="content h-full w-full">
      <!-- Tabs Content -->
      <slot :activeTab="activeTab"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { Icon } from "@iconify/vue";

interface Tab {
  id?: number | string;
  name: string;
  disabled?: boolean;
  computedTabId?: string;
  icon?: any;
  left?: number;
  width?: number;
  index?: number;
}

const props = defineProps<{
  tabs?: Array<Tab>;
  value: string;
  disabled?: boolean;
  showArrow: boolean;
}>();

const activeTab = ref<any>(null);
// const tabHeight = ref(0);
const wrapWidth = ref(100000);
const c_tabs = ref<Tab[]>([]);
const scrolling = ref(false);
const tabMarightLeft = ref(0);
const underlineMarkerStyle = ref({
  left: "0px",
  width: "0px",
});
const isArrow = ref({
  left: false,
  right: false,
});

const emits = defineEmits<{
  (e: "getActiveTab", payload: any): void;
}>();

const scroller = ref<HTMLDivElement | null>(null);
const tabContainer = ref<HTMLDivElement | null>(null);

watch(
  () => props.tabs,
  (value: any) => {
    init(value);
  },
  { deep: true }
);
watch(
  () => props.value,
  (value: any) => {
    activeTab.value = value;
  },
  { immediate: true, deep: true }
);
function init(tabs: any) {
  calcWidth(tabs);
  setTimeout(() => {
    if (tabContainer.value) {
      const style = window.getComputedStyle(tabContainer.value);
      tabMarightLeft.value = parseInt(style.marginLeft, 10);
    }
    let findItem = c_tabs.value.find((tab) => tab.id === activeTab.value);
    if (findItem?.id) {
      setArrow(findItem.index);
      activeTabMove(findItem);
    } else {
      let firstTabs = c_tabs.value[0];
      setArrow(firstTabs.index);
      activeTabMove(firstTabs);
    }
  }, 20);
}
function clickArrow(side: string) {
  let findItem = c_tabs.value.find((tab) => tab.id === activeTab.value);
  if (findItem && "index" in findItem) {
    let tempIndex = findItem.index || 0;
    if (side == "left") {
      for (let index = tempIndex; index >= 0; index--) {
        const c_item = c_tabs.value[index];
        if (!c_item.disabled && c_item.index !== tempIndex) {
          activeTabMove(c_item);
          break;
        }
      }
    } else {
      for (let index = tempIndex; index < c_tabs.value.length; index++) {
        const c_item = c_tabs.value[index];
        if (!c_item.disabled && c_item.index !== tempIndex) {
          activeTabMove(c_item);
          break;
        }
      }
    }
  }
}

function setArrow(index: number) {
  if (index === 0) {
    isArrow.value.left = false;
  } else {
    isArrow.value.left = true;
  }

  if (index === c_tabs.value.length - 1) {
    isArrow.value.right = false;
  } else {
    isArrow.value.right = true;
  }
}

function activeTabMove(item: any) {
  activeTab.value = item.id;
  if (scroller.value) {
    // console.log("item :>> ", item);
    setArrow(item.index);
    const left = item.left + item.width / 2 - scroller.value.offsetWidth / 2;
    // underlineMarkerStyle.value.left = item.left - scroller.value.scrollLeft + "px";
    smoothScroll(left, item);
  }
  emits("getActiveTab", item);
}

function calcWidth(value: any) {
  c_tabs.value = value;
  nextTick(() => {
    if (value.length == 0) {
      return false;
    }
    let tempWidth = 0;
    let _tabs: any[] = [];
    if (tabContainer.value) {
      // console.log("tabContainer :>> ", tabContainer.value.children);
      Array.from(tabContainer.value.children).forEach((elm: any, index) => {
        const rect = elm.getBoundingClientRect();
        let temp = {
          left: tempWidth,
          width: rect.width,
          id: index + value[index].name,
          ...value[index],
          index,
        };
        // tabHeight.value = rect.height;
        _tabs.push(temp);
        tempWidth += rect.width;
        // console.log("index :>> ", index, temp.id, activeTab.value);
        if (temp.id == activeTab.value) {
          underlineMarkerStyle.value = {
            left: temp.left + "px",
            width: temp.width + "px",
          };
        }
      });
      c_tabs.value = _tabs;
      wrapWidth.value = tempWidth;
    }
  });
}

function smoothScroll(to: any, acitveItem: any) {
  // const scroller = this.$refs.scrollTab;
  if (scroller.value) {
    let from = scroller.value.scrollLeft;
    const direction = to - from > 0 ? "bottom" : "top";
    scrolling.value = true;
    const intervalId = setInterval(() => {
      if (Math.abs(from - to) <= 20) {
        scrolling.value = false;
        clearInterval(intervalId);
        if (scroller.value) {
          scroller.value.scrollLeft = to;
          underlineMarkerStyle.value.left = tabMarightLeft.value + acitveItem.left - scroller.value.scrollLeft + "px";
          underlineMarkerStyle.value.width = acitveItem.width + "px";
        }
      } else {
        let r = (to - from) / 3;
        r = Math.abs(r) > 20 ? r : direction === "bottom" ? 20 : -20;
        from += r;
        if (scroller.value) {
          scroller.value.scrollLeft = from;
          underlineMarkerStyle.value.left = tabMarightLeft.value + acitveItem.left - scroller.value.scrollLeft + "px";
          underlineMarkerStyle.value.width = acitveItem.width + "px";
        }
      }
    }, 16.7);
  }
}

onMounted(() => {
  init(props.tabs);
});
</script>

<style lang="scss" scoped>
.vst-container {
  .scrollTab {
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .foregroundBg {
    background-color: hsl(var(--foreground));
  }
  // .arrowBg {
  //   background-color: hsla(var(--background075));
  // }

  .left-background {
    background: linear-gradient(to left, rgba(0, 0, 0, 0) 0%, hsla(var(--background075)) 20%, hsl(var(--background)) 100%);
  }
  .right-background {
    background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, hsla(var(--background075)) 20%, hsl(var(--background)) 100%);
  }
}
</style>
