<script setup lang="ts">
import * as z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const schema = z.object({
  username: z.string(),
});
const form = useForm({
  validationSchema: toTypedSchema(schema),
});

form.setValues({
  username: "foo",
});
</script>

<template>
  <AutoForm :form="form" :schema="schema" />
</template>
