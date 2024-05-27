<script setup lang="ts">
// This css import is for getting tailwind css
// import "../styles/styles.css";
import { onMounted, onUnmounted, provide, watch, ref, computed, ComponentPublicInstance, Ref } from "vue";
import { useElementVisibility } from "@vueuse/core";

interface Props {
  themeColor?: string;
  dropdownPosition?: Array<String>;
  delayDuration: number;
}
// TODO: extract to a separate file
interface Tab {
  id: string;
  value: string;
  disabled?: boolean;
  computedTabId?: string;
  icon?: any;
}

interface TabVisibility {
  [key: string]: Ref<boolean>;
}

const props = withDefaults(defineProps<Props>(), {
  themeColor: "#3b82f6",
  delayDuration: 700,
  // dropdownPosition: [],
  // dropdownPosition: ["top", "left"],
  // dropdownPosition: ["top", "right"],
  // dropdownPosition: ["bottom", "left"],
  // dropdownPosition: ["bottom", "right"],
});

const emit = defineEmits<{
  (e: "change", tab: Tab): void;
}>();

const tabsContainerRef = ref<HTMLDivElement | null>(null);
const tabs = ref<Tab[]>([]);
const activeTab = ref<Tab>({ id: "", value: "" });
const activeTabValueVModel = defineModel({ default: "" });
const tabElems = ref<(ComponentPublicInstance | null | Element)[]>([]);
const tabsVisibility = ref<TabVisibility>({});
// const isShowDropdown = ref(false);

const dropdownStyle = ref({ transform: "", visibility: "hidden" });

const watchTabsVisibility = () => {
  for (let index in tabElems.value) {
    const isVisible = useElementVisibility(tabElems.value[index] as HTMLElement);
    tabsVisibility.value[tabs.value[index].id] = isVisible;
  }
};

const dropwDownList = computed(() => {
  return tabs.value.filter((tab: Tab) => !tabsVisibility.value[tab.id]);
});

const underlineMarkerStyle = computed(() => {
  const activeTabIndex = tabs.value.findIndex((tab) => tab.id === activeTab.value.id);
  const elem = tabElems.value[activeTabIndex] as HTMLElement;
  if (!elem) return { width: "0px", left: "0px" };
  const style = { width: elem?.parentElement?.offsetWidth + "px", left: elem?.parentElement?.offsetLeft + "px" };
  return style;
});

const addTabs = (tab: Tab) => {
  tabs.value.push(tab);
};

provide("addTabs", addTabs);
provide("activeTab", activeTab);

watch(tabElems.value, watchTabsVisibility);

const scrollHorizontally = function (e: WheelEvent) {
  if (e.deltaY == 0 || !tabsContainerRef.value) return;
  e.preventDefault();
  tabsContainerRef.value.scrollLeft += e.deltaY;
};

const selectTab = ({ tab, tabValue }: { tab?: Tab; tabValue?: any }) => {
  if (!tab && tabValue) {
    tab = tabs.value.find((tab) => tab.value === tabValue);
  }
  if (!tab) return;
  dropdownStyle.value.visibility = "hidden";
  const id = tab.id;
  const tabIndex = tabs.value.findIndex((tab) => tab.id === id);
  const elem: HTMLDivElement = tabElems.value[tabIndex] as HTMLDivElement;
  if (elem) {
    elem?.parentElement?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  activeTab.value = tab;
  activeTabValueVModel.value = tab.value;
  emit("change", tab);
};

// 位置计算
let dropdown = ref(null);
let dropdownIcon = ref(null);

function showDropdown(isShow: string) {
  if (dropdownStyle.value.visibility == isShow) {
    return;
  }
  dropdownStyle.value.visibility = isShow;
  let defaultPosition = props.dropdownPosition;
  let drop_dom = dropdown.value.getBoundingClientRect();
  if (isShow && defaultPosition.length == 0) {
    let dropIcon_dom = dropdownIcon.value.getBoundingClientRect();

    let di_top = dropIcon_dom.top;
    let di_left = dropIcon_dom.left;
    let di_bottom = window.innerHeight - dropIcon_dom.bottom;
    let di_right = window.innerWidth - dropIcon_dom.right;

    defaultPosition[0] = di_top > di_bottom ? "top" : "bottom";
    defaultPosition[1] = di_left > di_right ? "left" : "right";
  }
  if (isShow && (defaultPosition[0] == "top" || defaultPosition[1] == "left")) {
    dropdownStyle.value.transform = "";

    let d_w = parseInt(drop_dom.width - 20);
    let d_h = parseInt(drop_dom.height);
    // defaultPosition[0] == "top"?dropdownStyle.value.transform
    let ts = [];
    ts.push(defaultPosition[0] == "top" ? `translateY(calc(-${d_h}px - 1.2rem))` : "");
    ts.push(defaultPosition[1] == "left" ? `translateX(-${d_w}px)` : "");
    dropdownStyle.value.transform = ts.join(" ");
  }
  // console.log("dropdownStyle.value.transform  :>> ", defaultPosition, dropdownStyle.value.transform);
}

const timeoutId = ref(null);

const handleMouseOver = (isShow: string) => {
  // 设置定时器，延迟执行操作
  timeoutId.value = setTimeout(() => {
    // 这里是你想要执行的操作
    // console.log("操作执行了！");
    showDropdown(isShow);
  }, props.delayDuration); // 延迟2000毫秒
};

const clearTimeout = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
};

onMounted(() => {
  tabsContainerRef.value?.addEventListener("wheel", scrollHorizontally);
  if (!tabs.value.length) return;
  if (activeTabValueVModel.value) return selectTab({ tabValue: activeTabValueVModel.value });
  selectTab({ tab: tabs.value[0] });
  showDropdown("visible");
  showDropdown("hidden");
});

onUnmounted(() => {
  tabsContainerRef.value?.removeEventListener("wheel", scrollHorizontally);
  clearTimeout();
});
</script>

<template>
  <div class="super-vue3-tabs">
    <div class="flex gap-2">
      <!-- Tabs list -->
      <div class="flex gap-3 select-none relative overflow-x-auto tabs" ref="tabsContainerRef">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :id="tab.id"
          class="relative flex items-center px-3 py-2 rounded-sm cursor-pointer min-w-max text-inherit"
          :class="{
            'opacity-50 !cursor-default': tab.disabled,
            tabActive: activeTab.id === tab.id,
          }"
          @click="tab.disabled ? '' : selectTab({ tab })"
        >
          <div
            class="absolute left-0 right-0 w-1 h-1 m-auto tracker-element"
            :ref="
              (el) => {
                tabElems[index] = el;
              }
            "
          ></div>
          <component v-if="tab.icon" v-for="(node, index) in tab.icon()" :key="index" :is="node" />
          {{ tab.value }}
        </div>
        <div
          class="underline-marker absolute bottom-0 left-0 h-1 rounded origin-left duration-300 ease-in-out transition-[left] hover:tabActive active:tabActive"
          :style="{
            width: underlineMarkerStyle.width,
            left: underlineMarkerStyle.left,
            backgroundColor: 'hsl(var(--foreground))',
          }"
        ></div>
      </div>

      <!-- Dropdown -->
      <div v-if="dropwDownList.length">
        <button class="w-6 h-full" @mouseover="handleMouseOver('visible')" @click="showDropdown('visible')" ref="dropdownIcon">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div class="dropdown absolute min-w-36 max-h-80 overflow-auto shadow-md rounded border" :style="dropdownStyle" ref="dropdown">
          <!-- <div class="dropdown"> -->
          <div v-for="tab in dropwDownList" :key="tab.id" @click="selectTab({ tab })" class="cursor-pointer flex items-center p-1 no-underline hover:rounded text-center">
            <component v-if="tab.icon" v-for="(node, index) in tab.icon()" :key="index" :is="node" />
            {{ tab.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Content -->
    <div class="content h-full w-full">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
// make tabs scroll horizontally
.super-vue3-tabs {
  .tabs {
    color: hsl(var(--muted-foreground));
    &::-webkit-scrollbar {
      display: none;
    }
    .underline-marker {
      // transition: left 0.3s ease;
    }
    .tabActive {
      color: hsl(var(--foreground));
    }
  }

  .dropdown {
    background-color: hsl(var(--popover));
    // position: absolute;
    // // background-color: #f8f8f8;
    // min-width: 140px;
    // max-height: 300px;
    // left: 300px;
    // transform: translateX(-140px);
    // overflow: auto;
    // box-shadow: 0px 4px 20px -2px rgba(0, 0, 0, 0.1);
    color: hsl(var(--foreground));
    z-index: 1;
    // border-radius: 8px;
    div {
      // padding: 8px 12px;
      // margin: 4px;
      // text-decoration: none;
      // display: block;
      &:hover {
        // background-color: #f1f1f1;
        // border-radius: 8px;
      }
    }
  }
}
</style>
