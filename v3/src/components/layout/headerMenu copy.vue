<template>
  <div class="bg-background">
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <div class="logo">
        <!-- <img src="@/assets/icon.svg"></img> -->
        <logoSvg :style="{ fill: '#ffffff' }"></logoSvg>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            <Icon v-if="mode == 'dark'" icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon v-if="mode == 'light'" icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <!-- <span class="sr-only">Toggle theme</span> -->
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
import logoSvg from "@/assets/icon.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mode = useColorMode();
</script>

<style lang="scss" scoped>
.bg-background {
  background-color: hsl(var(--background));
}
.contaniner {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 2rem;
  padding-left: 2rem;
}
</style>
