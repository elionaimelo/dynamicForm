<script setup lang="ts">
import { useCurrencyInput } from "vue-currency-input";
import { watch } from "vue";

const props = defineProps({ modelValue: Number });

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: "EUR",
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 0,
  valueRange: { min: 0 },
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  }
);
</script>

<template>
  <VTextField
    v-model="formattedValue"
    density="compact"
    variant="solo"
    ref="inputRef"
  >
    <template #prepend>
      <VBtn size="x-small" icon @click="setValue(--numberValue)">➖</VBtn>
    </template>
    <template #append>
      <VBtn size="x-small" icon @click="setValue(++numberValue)">➕</VBtn>
    </template>
  </VTextField>
</template>
