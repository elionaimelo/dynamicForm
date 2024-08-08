<template>
  <VForm @submit="handleSubmit">
    <VRow>
      <VCol
        v-for="{
          as,
          name,
          label,
          children,
          rules,
          columns,
          ...attrs
        } in schema.fields"
        :key="name"
        :cols="12 / (columns || 1)"
      >
        <template v-if="as === 'select' && children">
          <VSelect
            :items="children"
            :item-props="(item) => ({ title: item.text })"
            :label="label"
            v-model="formValues[name]"
            return-object
          ></VSelect>
        </template>

        <template v-else-if="as === 'checkbox' && children">
          <div v-if="children.length > 0">
            <VCheckbox
              v-for="(option, idx) in children"
              :key="idx"
              v-model="formValues[name]"
              hide-details
              :label="option.text"
              :value="option.value"
            />
          </div>
          <div v-else>
            <VCheckbox
              v-model="formValues[name]"
              color="red"
              :false-value="false"
              hide-details
              :label="label"
              :true-value="true"
            />
          </div>
        </template>

        <template v-else-if="as === 'radio' && children">
          <VRadioGroup v-model="formValues[name]">
            <template v-slot:label>
              <div>
                <strong>{{ label }}</strong>
              </div>
            </template>
            <VRadio
              v-for="({ text, value }, idx) in children"
              :key="idx"
              :label="text"
              :value="value"
            />
          </VRadioGroup>
        </template>

        <template v-else>
          <component
            :is="resolveComponent(as)"
            v-bind="attrs"
            v-model="formValues[name]"
            hide-details
            :label="label"
          />
        </template>

        <ErrorMessage :name="name" />
      </VCol>
    </VRow>

    <VBtn variant="flat" color="primary" type="submit">Enviar</VBtn>
  </VForm>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from "vue";
import { ErrorMessage, Form as VForm } from "vee-validate";
import {
  VBtn,
  VCheckbox,
  VRadioGroup,
  VSelect,
  VTextarea,
  VTextField,
  VRow,
  VCol,
} from "vuetify/components";

interface SchemaField {
  as: string;
  name: string;
  label: string;
  children?: Array<{
    text: string;
    value?: string;
    color?: string;
  }>;
  rules?: any;
  columns?: number; // Adicione esta linha para suportar colunas
  [key: string]: any;
}

interface Schema {
  fields: SchemaField[];
}

const props = defineProps<{ schema: Schema }>();

const { schema } = toRefs(props);

// Função para associar as tags aos componentes do Vuetify
const resolveComponent = (as: string) => {
  const map: Record<string, any> = {
    input: VTextField,
    textarea: VTextarea,
    select: VSelect,
    checkbox: VCheckbox,
    radio: VRadioGroup,
  };
  return map[as] || VTextField;
};

// Cria um objeto reativo para armazenar os valores do formulário com valores padrão
const formValues = reactive<Record<string, any>>(
  schema.value.fields.reduce((acc, field) => {
    acc[field.name] =
      field.default ?? (field.as === "checkbox" && field.children ? [] : "");
    return acc;
  }, {} as Record<string, any>)
);

// Função para manipular o envio do formulário
const handleSubmit = (values: Record<string, any>) => {
  console.log("Form Submitted:", values);
};
</script>
