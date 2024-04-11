<template>
  <div class="bg-background">
  <header class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
    <div class="container flex h-14 max-w-screen-2xl items-center navHeader">
      <div class="logo mr-4 md:mr-2 lg:mr-6 flex items-center lg:space-x1 xl:space-x-2">
        <!-- <img src="@/assets/icon.svg"></img> -->
        <logoSvg class="foreground h-[2rem] w-[2rem]"></logoSvg>
        <span class="font-bold"> UC.camero </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="text-sm font-medium">
            <Icon icon="radix-icons:moon" v-if="mode == 'dark'" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon icon="radix-icons:sun" v-else class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
    <router-view />
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
.foreground {
  fill: hsl(var(--foreground));
}
.contaniner {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 2rem;
  padding-left: 2rem;
}

.navHeader {
  .logo{
    svg{
    }
  }
}
</style>
