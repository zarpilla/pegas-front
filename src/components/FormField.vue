<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  }
})

const labelClass = computed(() => props.label ? 'mb-2' : '')
</script>

<template>
  <div class="form-field">
    <label v-if="label" :class="labelClass">
      {{ label }}
    </label>
    <slot />
    <div v-if="help" class="help-text text-danger mt-1">
      {{ help }}
    </div>
  </div>
</template>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 500;
}

.help-text {
  font-size: 0.875rem;
}
</style>
