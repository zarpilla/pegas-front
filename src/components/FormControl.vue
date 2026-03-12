<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  maxlength: {
    type: [String, Number],
    default: null
  },
  validationError: {
    type: Boolean,
    default: false
  },
  placeholderEffect: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'click'])

const inputClass = computed(() => ({
  'form-control': true,
  'is-invalid': props.validationError
}))

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    @input="updateValue"
    @click="handleClick"
    :placeholder="placeholder"
    :name="name"
    :autocomplete="autocomplete"
    :maxlength="maxlength"
    :class="inputClass"
  />
</template>

<style scoped>
.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  color: #212529;
  background-color: #fff;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>
