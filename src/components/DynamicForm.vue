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
              v-model="formValues[name]"
              return-object
              variant="underlined"
              :items="children"
              :item-props="(item) => ({ title: item.text })"
              :label="label"
              :rules="[rules]"
              :error-messages="errors[name] ? [errors[name]] : []"
            />
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
                hide-details
                variant="outlined"
                color="red"
                :false-value="false"
                :label="label"
                :true-value="true"
              />
            </div>
          </template>

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

          <template v-else-if="as === 'birthDate' && children">
            <v-date-picker elevation="24"></v-date-picker>
          </template>

          <template v-else-if="as === 'phone'">
            <v-text-field
              v-model="formValues[name]"
              variant="underlined"
              :label="label"
              :rules="[rules]"
              :error-messages="errors[name] ? [errors[name]] : []"
              v-maska="'(##) #####-####'"
            />
          </template>

          <template v-else-if="as === 'money'">
            <VCurrencyField v-model="formValues[name]" />
          </template>

          <template v-else>
            <component
              v-model="formValues[name]"
              v-bind="attrs"
              variant="underlined"
              :is="resolveComponent(as)"
              :name="name"
              :label="label"
              :rules="[rules]"
              :error-messages="errors[name] ? [errors[name]] : []"
            />
          </template>

          <div v-if="errors[name]" class="text-red-500 mt-1">
            {{ errors[name] }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useForm } from "vee-validate";
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
import { Schema } from "../types";
import { vMaska } from "maska/vue";
import { useCurrencyInput } from "vue-currency-input";

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
const { handleSubmit } = useForm({
  validationSchema,
});

// Mapeamento de regras do Zod para Vee-Validate
const mapZodToVeeValidate = (
  zodSchema: zod.ZodType<any>
): ((value: any) => boolean | string) => {
  return (value: any) => {
    const result = zodSchema.safeParse(value);
    if (result.success) {
      return true;
    }
    // Retorna a primeira mensagem de erro ou uma mensagem genérica se não houver
    return result.error.errors[0]?.message || "Valor inválido";
  };
};

schema.value.fields.forEach((field) => {
  const rule = formSchema.shape[field.name as keyof typeof formSchema.shape];
  if (rule) {
    field.rules = mapZodToVeeValidate(rule);
  } else {
    // Regra padrão para evitar retorno undefined
    field.rules = () => true;
  }
});

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
