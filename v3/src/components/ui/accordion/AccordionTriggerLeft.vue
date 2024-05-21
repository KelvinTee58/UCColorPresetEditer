<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  AccordionHeader,
  AccordionTrigger,
  type AccordionTriggerProps,
} from 'radix-vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      v-bind="delegatedProps"
      :class="
        cn(
          'flex flex-1 items-center justify-left py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-0',
          props.class,
        )
      "
    >
      <slot name="icon">
        <ChevronDown
          class="h-4 w-4 shrink-0 mr-2 transition-transform duration-200  -rotate-90"
        />
      </slot>
      <slot />
      
    </AccordionTrigger>
  </AccordionHeader>
</template>
