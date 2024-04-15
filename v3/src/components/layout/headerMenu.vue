<template>
  <div class="bg-background">
    <header class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
      <div class="container flex h-14 max-w-screen-2xl items-center justify-between navHeader">
        <div class="left-nav flex items-center">
          <div class="logo mr-4 md:mr-2 lg:mr-6 flex items-center lg:space-x1 xl:space-x-2" @click="toHomePage">
            <logoSvg class="foreground h-[2rem] w-[2rem]"></logoSvg>
            <span class="font-bold"> UC.camero </span>
          </div>
          <div class="navigation_menu">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#/editer" class="transition-colors hover:text-foreground/80 text-foreground/60"> editer </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div class="right-nav">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="text-sm font-medium">
                <Icon icon="radix-icons:globe" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="changeLocalLanguage('en')"> {{ $t("components.layout.headerMenu.en") }} </DropdownMenuItem>
              <DropdownMenuItem @click="changeLocalLanguage('zh')"> {{ $t("components.layout.headerMenu.zh") }} </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="text-sm font-medium">
                <Icon icon="radix-icons:moon" v-if="mode == 'dark'" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Icon icon="radix-icons:sun" v-else class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="mode = 'light'"> {{ $t("components.layout.headerMenu.Light") }} </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'dark'"> {{ $t("components.layout.headerMenu.Dark") }} </DropdownMenuItem>
              <DropdownMenuItem @click="mode = 'auto'"> {{ $t("components.layout.headerMenu.System") }} </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    <div class="routerview">
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
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu";

const mode = useColorMode();

import { useRouter } from "vue-router";
const router = useRouter();

// 返回主页
function toHomePage() {
  router.replace("/");
}

import { useI18n } from "vue-i18n";

const { locale } = useI18n();
function changeLocalLanguage(type: string) {
  locale.value = type;
}
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
  // .logo {
  // }
}
</style>
