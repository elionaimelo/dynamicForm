<template>
  <v-container>
    <DynamicForm :schema="formSchemaObject" />
  </v-container>
</template>

<script setup lang="ts">
import DynamicForm from "./components/DynamicForm.vue";
import { formSchemaObject } from "./formSchema";
</script>
