<template>
  <v-container>
    <DynamicForm :schema="formSchemaObject" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DynamicForm from "./components/DynamicForm.vue";
import { formSchema } from "./formSchema";
import { Schema } from "./types";

const formSchemaObject = ref<Schema>({
  fields: [
    {
      label: "Nome",
      name: "name",
      as: "input",
      type: "text",
      rules: formSchema.shape.name,
      columns: 4,
    },
    {
      label: "Email",
      name: "email",
      as: "input",
      type: "email",
      rules: formSchema.shape.email,
      columns: 4,
    },
    {
      label: "Senha",
      name: "password",
      as: "input",
      type: "password",
      rules: formSchema.shape.password,
      columns: 4,
    },
    {
      label: "País",
      name: "country",
      as: "select",
      rules: formSchema.shape.country,
      children: [
        { text: "Brasil", value: "br" },
        { text: "Estados unidos", value: "us" },
        { text: "Canada", value: "ca" },
      ],
      columns: 4,
    },
    {
      label: "Deseja prosseguir?",
      name: "prosseguir",
      as: "radio",
      rules: formSchema.shape.prosseguir,
      children: [
        { text: "Sim", value: "sim" },
        { text: "Não", value: "nao" },
      ],
      columns: 4,
    },
    {
      label: "Biografia",
      name: "bio",
      as: "textarea",
      rules: formSchema.shape.bio,
      columns: 4,
    },
    {
      label: "Deseja assinar a Newsletter?",
      name: "newsletter",
      as: "checkbox",
      rules: formSchema.shape.newsletter,
      default: true,
      columns: 12,
    },
    {
      label: "Selecione suas habilidades",
      name: "skills",
      as: "checkbox",
      rules: formSchema.shape.skills,
      children: [
        { text: "Vue.js", value: "vue" },
        { text: "React", value: "react" },
        { text: "Angular", value: "angular" },
      ],
      columns: 6,
    },
    {
      label: "Telefone",
      name: "phone",
      as: "phone",
      rules: formSchema.shape.phone,
      columns: 4,
      mask: "(##) #####-####",
    },
    {
      label: "Data de nascimento",
      name: "birthDate",
      as: "date",
      rules: formSchema.shape.birthDate,
      columns: 4,
    },
    {
      label: "Valor monetário",
      name: "money",
      as: "money",
      rules: formSchema.shape.money,
      columns: 4,
    },
    {
      label: "Ações",
      name: "actions",
      as: "button",
      children: [
        {
          text: "Enviar",
          type: "submit",
          color: "primary",
          tailwindClasses: "mr-2",
          position: "right",
          action: "handleSubmit",
        },
        {
          text: "Cancelar",
          type: "button",
          color: "secondary",
          tailwindClasses: "ml-2",
          position: "right",
          action: "handleCancel",
        },
      ],
      columns: 12,
    },
  ],
});
</script>
