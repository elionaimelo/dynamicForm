<template>
  <v-form v-slot="{ errors }" @submit="handleSubmit">
    <v-container>
      <v-row>
        <v-col
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
          :cols="columns"
        >
          <template v-if="as === 'select' && children">
            <v-select
              :items="children"
              :item-props="(item) => ({ title: item.text })"
              :label="label"
              v-model="formValues[name]"
              return-object
              :rules="[rules]"
              :error-messages="errors[name] ? [errors[name]] : []"
            ></v-select>
          </template>

          <template v-else-if="as === 'radio' && children">
            <v-radio-group v-model="formValues[name]" :rules="[rules]">
              <template v-slot:label>
                <div>
                  <strong>{{ label }}</strong>
                </div>
              </template>
              <v-radio
                v-for="({ text, value }, idx) in children"
                :key="idx"
                :label="text"
                :value="value"
              />
            </v-radio-group>
          </template>

          <template v-else-if="as === 'checkbox' && children">
            <div v-if="children.length > 0">
              <div>
                <strong>{{ label }}</strong>
              </div>
              <v-checkbox
                v-for="(option, idx) in children"
                :key="idx"
                v-model="formValues[name]"
                hide-details
                :label="option.text"
                :value="option.value"
              />
            </div>
            <div v-else>
              <div>
                <strong>{{ label }}</strong>
              </div>
              <v-checkbox
                v-model="formValues[name]"
                color="red"
                :false-value="false"
                hide-details
                :label="label"
                :true-value="true"
              />
            </div>
          </template>

          <!-- Adiciona template para botões -->
          <template v-else-if="as === 'button' && children">
            <div :class="getButtonContainerClass(children)">
              <v-btn
                v-for="(
                  { text, type, color, tailwindClasses, action }, idx
                ) in children"
                :key="idx"
                :type="type"
                :color="color"
                @click="
                  action === 'handleSubmit'
                    ? handleSubmit()
                    : action === 'handleCancel'
                    ? handleCancel()
                    : null
                "
                :class="tailwindClasses"
              >
                {{ text }}
              </v-btn>
            </div>
          </template>

          <template v-else>
            <component
              :is="resolveComponent(as)"
              v-model="formValues[name]"
              :name="name"
              :label="label"
              v-bind="attrs"
              :rules="[rules]"
              :error-messages="errors[name] ? [errors[name]] : []"
            />
          </template>

          <!-- Exibe mensagens de erro para cada campo -->
          <div v-if="errors[name]" class="text-red-500 mt-1">
            {{ errors[name] }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { useForm, useField } from "vee-validate";
import {
  VTextField,
  VTextarea,
  VSelect,
  VCheckbox,
  VRadioGroup,
  VRadio,
  VBtn,
  VCol,
  VRow,
  VContainer,
} from "vuetify/components";
import { formSchema } from "../formSchema";

interface SchemaField {
  as: string;
  name: string;
  label: string;
  children?: Array<{
    text: string;
    value?: string;
    type?: string;
    color?: string;
    tailwindClasses?: string;
    position?: "left" | "center" | "right";
    action?: () => void;
  }>;
  rules?: (value: any) => boolean | string;
  columns: number;
  [key: string]: any;
}

interface Schema {
  fields: SchemaField[];
}

const props = defineProps<{ schema: Schema }>();

const { schema } = toRefs(props);

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: "This is required" })
      .email({ message: "Must be a valid email" }),
    password: zod
      .string()
      .min(1, { message: "This is required" })
      .min(8, { message: "Too short" }),
  })
);
const { handleSubmit, errors } = useForm({
  validationSchema,
});

// Mapeamento de regras do Zod para Vee-Validate
const mapZodToVeeValidate = (
  zodSchema: z.ZodType<any>
): ((value: any) => boolean | string) => {
  return (value: any) => {
    const result = zodSchema.safeParse(value);
    if (result.success) {
      return true;
    }
    return result.error.errors[0]?.message || "Valor inválido";
  };
};

// Atualizar regras do esquema para usar funções de validação
schema.value.fields.forEach((field) => {
  field.rules = mapZodToVeeValidate(
    formSchema.shape[field.name as keyof typeof formSchema.shape]
  );
});

// Verifica se `schema.fields` está definido e é um array
const formValues = reactive<Record<string, any>>(
  (schema.value.fields || []).reduce((acc, field) => {
    acc[field.name] = field.default || (field.as === "checkbox" ? [] : "");
    return acc;
  }, {} as Record<string, any>)
);

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

// Função para manipular o clique no botão Cancelar
const handleCancel = () => {
  console.log("Formulário cancelado");
};

// Função para obter a classe de contêiner dos botões com base na posição
const getButtonContainerClass = (
  buttons: Array<{ position?: "left" | "center" | "right" }>
) => {
  const position = buttons[0]?.position || "center";
  return {
    "flex justify-start": position === "left",
    "flex justify-center": position === "center",
    "flex justify-end": position === "right",
  };
};
</script>
