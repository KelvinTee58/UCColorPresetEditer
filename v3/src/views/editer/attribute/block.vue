<script setup lang="ts">
import * as z from "zod";
import { h, reactive, ref, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { DependencyType } from "../ui/auto-form/interface";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { Config } from "@/components/ui/auto-form";
import { AutoForm, AutoFormField } from "@/components/ui/auto-form";
import Label from "@/components/ui/label/Label.vue";

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
});

// enum Sports {
//   Football = "Football/Soccer",
//   Basketball = "Basketball",
//   Baseball = "Baseball",
//   Hockey = "Hockey (Ice)",
//   None = "I don't like sports",
// }

enum borderStyle {
  none = "none",
  hidden = "hidden",
  dotted = "dotted",
  dashed = "dashed",
  solid = "solid",
  double = "double",
}

const schema2 = z.object({
  basic: z.object({
    id: z
      .string({
        message: "id is required.",
      })
      .optional(),
    type: z
      .string({
        message: "type is required.",
      })
      .optional(),
    label: z
      .string({
        message: "Username is required.",
      })
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .optional(),
    level: z
      .number()
      .min(0, {
        message: "Favourite number must be at least 0.",
      })
      .default(0),
  }),
  axis: z.object({
    x_axis: z.number().default(0),
    y_axis: z.number().default(0),
  }),
  size: z.object({
    width: z.number().default(0),
    height: z.number().default(0),
  }),
  style: z.object({
    round: z
      .number()
      .min(0, {
        message: "Favourite number must be at least 0.",
      })
      .default(0),
    background: z.string(),
    border: z.object({
      width: z.number().default(0),
      color: z.string(),
      style: z.nativeEnum(borderStyle).describe("What is your favourite sport?"),
    }),
    padding: z.object({
      top: z
        .number()
        .min(0, {
          message: "number must be at least 0.",
        })
        .default(0),
      bottom: z
        .number()
        .min(0, {
          message: "number must be at least 0.",
        })
        .default(0),
      left: z
        .number()
        .min(0, {
          message: "number must be at least 0.",
        })
        .default(0),
      right: z
        .number()
        .min(0, {
          message: "number must be at least 0.",
        })
        .default(0),
    }),
  }),
});

const form = useForm({
  validationSchema: toTypedSchema(schema2),
});

form.setValues({
  basic: {
    id: "foo",
  },
});

console.log("schema2", form);

// const schema = z.object({
//   username: z
//     .string({
//       required_error: "Username is required.",
//     })
//     .min(2, {
//       message: "Username must be at least 2 characters.",
//     }),

//   password: z
//     .string({
//       required_error: "Password is required.",
//     })
//     .min(8, {
//       message: "Password must be at least 8 characters.",
//     }),

//   favouriteNumber: z.coerce
//     .number({
//       invalid_type_error: "Favourite number must be a number.",
//     })
//     .min(1, {
//       message: "Favourite number must be at least 1.",
//     })
//     .max(10, {
//       message: "Favourite number must be at most 10.",
//     })
//     .default(1)
//     .optional(),

//   acceptTerms: z.boolean().refine((value) => value, {
//     message: "You must accept the terms and conditions.",
//     path: ["acceptTerms"],
//   }),

//   sendMeMails: z.boolean().optional(),

//   birthday: z.coerce.date().optional(),

//   color: z.enum(["red", "green", "blue"]).optional(),

//   // Another enum example
//   marshmallows: z.enum(["not many", "a few", "a lot", "too many"]),

//   // Native enum example
//   sports: z.nativeEnum(Sports).describe("What is your favourite sport?"),

//   bio: z
//     .string()
//     .min(10, {
//       message: "Bio must be at least 10 characters.",
//     })
//     .max(160, {
//       message: "Bio must not be longer than 30 characters.",
//     })
//     .optional(),

//   customParent: z.string().optional(),

//   file: z.string().optional(),
// });

function onSubmit(values: Record<string, any>) {
  toast({
    title: "You submitted the following values:",
    description: h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" }, h("code", { class: "text-white" }, JSON.stringify(values, null, 2))),
  });
}
</script>

<template>
  <AutoForm
    :form="form"
    class="w-full space-y-6 p-3 text-left"
    :schema="schema2"
    :field-config="{
      style: {
        background: {
          component: 'color',
        },
        border: {
          color: {
            component: 'color',
          },
        },
      },
    }"
    @submit="onSubmit"
  >
    <!-- <template #acceptTerms="slotProps">
      <AutoFormField v-bind="slotProps" />
      <div class="!mt-2 text-sm">I agree to the <button class="text-primary underline">terms and conditions</button>.</div>
    </template>

    <template #customParent="slotProps">
      <div class="flex items-end space-x-2">
        <AutoFormField v-bind="slotProps" class="w-full" />
        <Button type="button"> Check </Button>
      </div>
    </template> -->
    <Button type="submit"> Submit </Button>
  </AutoForm>
</template>
