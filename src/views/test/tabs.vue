<template>
  <div class="app">
    <div class="scrollTab">
      <Tabs ref="scrollTab" @getActiveTab="getActiveTab" :tabs="labelList" :value="activeId" :showArrow="true">
        <!-- <tab-item class="item" v-for="(item, index) in tabs" :key="index" :index="index" :data="{ id: index }">
          <div class="tabBox">
            <div class="tab" :class="{ active: activeId === index }">tab {{ index }}</div>
          </div>
        </tab-item> -->
        <template v-slot="{ activeTab }">
          {{ activeTab }}
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { Tabs } from "@/components/ui/AA_kz_scrollTabs";
// import scrollTab from "./components/Tabs.vue";
// import tabItem from "./components/Tabitem.vue";
export default {
  name: "App",
  components: {
    Tabs,
    // tabItem,
  },
  data() {
    return {
      activeId: "Style10",
      tabs: new Array(20),
      labelList: [
        { id: "Style1", name: "Style", icon: "radix-icons:transparency-grid" },
        { id: "Style2", name: "Text", icon: "radix-icons:text", disabled: true },
        { id: "Style3", name: "ArrangeArrangeArrange", icon: "radix-icons:group" },
        { id: "Style4", name: "Arrange" },
        { id: "Style5", name: "Arrange", disabled: true },
        { id: "Style6", name: "Arrange", icon: "radix-icons:group", disabled: true },
        { id: "Style7", name: "Arrange", icon: "radix-icons:group" },
        { id: "Style8", name: "Arrange", icon: "radix-icons:group" },
        { id: "Style9", name: "Arrange", icon: "radix-icons:group" },
        { id: "Style10", name: "ArrangeAr@@@rangeArrange", icon: "radix-icons:group" },
        { id: "Style11", name: "Arrange", icon: "radix-icons:group" },
        { id: "Style12", name: "Arrange", icon: "radix-icons:group" },
        { id: "Style13", name: "Arrange", icon: "radix-icons:group" },
        { id: "Style14", name: "Arrange", icon: "radix-icons:group" },
        { id: "Style15", name: "Arrange", icon: "radix-icons:group" },
      ],
    };
  },
  methods: {
    getActiveTab(data) {
      console.log(data);
      // this.activeId = data.id || 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  padding-top: 200px;
  .scrollTab {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
