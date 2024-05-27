<template>
  <ContextMenu>
    <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"> Right click here </ContextMenuTrigger>
    <ContextMenuContent class="w-64">
      <ContextMenuItem inset>
        Back
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset disabled>
        Forward
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset>
        Reload
        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger inset> More Tools </ContextMenuSubTrigger>
        <ContextMenuSubContent class="w-48">
          <ContextMenuItem>
            Save Page As...
            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>Create Shortcut...</ContextMenuItem>
          <ContextMenuItem>Name Window...</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Developer Tools</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem checked>
        Show Bookmarks Bar
        <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup model-value="pedro">
        <ContextMenuLabel inset> People </ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioItem value="pedro"> Pedro Duarte </ContextMenuRadioItem>
        <ContextMenuRadioItem value="colm"> Colm Tuite </ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuContent>
  </ContextMenu>
  <!-- <h1>test{{$store.test.useCounterStore().count}}</h1>
  <h1>test{{ count }}test</h1>
  <button @click="increment">add</button>
  <button @click="$store.test.useCounterStore().increment">add2</button>
  <button @click="testApi">testapi</button> -->
  <Button @click="updateData()">45</Button>
  <h1>UC.</h1>

  <!--使用方法与之前的一样-->
  <!-- <MyContextMenu v-model:show="show" :x="x" :y="y">
    <context-menu-item label="Simple item" @click="alertContextMenuItemClicked('Item1')" />
    <context-menu-item label="Item with a icon" icon="https://imengyu.top/assets/images/test/icon.png" @click="alertContextMenuItemClicked('Item2')" />
    <context-menu-group label="Menu with child">
      <context-menu-item label="Item1" @click="alertContextMenuItemClicked('Item1')" />
      <context-menu-item label="Item1" @click="alertContextMenuItemClicked('Item1')" />
    </context-menu-group>
    <div class="my-menu-sperator"></div>
    <context-menu-group label="Menu with child child child">
      <context-menu-item label="Item1" @click="alertContextMenuItemClicked('Item1')" />
      <context-menu-item label="Item2" @click="alertContextMenuItemClicked('Item2')" />
      <context-menu-group label="Child with v-for 50">
        <context-menu-item v-for="index of 50" :key="index" :label="'Item3-' + index" @click="alertContextMenuItemClicked('Item3' + index)" />
      </context-menu-group>
      <div class="my-menu-sperator"></div>
      <context-menu-group label="Childs">
        <context-menu-item label="Item1-1" @click="alertContextMenuItemClicked('Item1-1')" />
        <context-menu-item label="Item1-2" @click="alertContextMenuItemClicked('Item1-2')" />
        <div class="my-menu-sperator"></div>
        <context-menu-group label="Childs">
          <context-menu-item label="Item2-1" @click="alertContextMenuItemClicked('Item2-1')" />
          <context-menu-item label="Item2-2" @click="alertContextMenuItemClicked('Item2-2')" />
        </context-menu-group>
      </context-menu-group>
    </context-menu-group>
  </MyContextMenu> -->

  <h1>test</h1>
  <h1>test</h1>
</template>

<script setup>
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

// import MyContextMenu from "@/components/ui/context-menu-kz/index.vue"; //导入上面的组件
import { getCurrentInstance, ref } from "vue";
import { storeToRefs } from "pinia";
const { proxy } = getCurrentInstance();
let store = proxy.$store.test.useCounterStore();
// console.log("store", store);
let { count } = storeToRefs(store);
let { increment } = store;
async function testApi() {
  let res = ref(null);
  // console.log("api", proxy.$api.test1);
  res = proxy.$api.test1.time();
}
let x = ref(0);
let y = ref(0);
let show = ref(false);

function onContextMenu(e) {
  e.preventDefault();
  //Set the mouse position
  x.value = e.x;
  y.value = e.y;
  //Show menu
  show.value = true;
}

function alertContextMenuItemClicked(name) {
  alert(name);
}

const editerViewStore = proxy.$store.editerView.editerViewStore();

function updateData() {
  editerViewStore.editerModule();
}
</script>
<style lang="scss" scoped>
h1 {
  font-size: 100px;
}
//@import url(); 引入公共css类
</style>
