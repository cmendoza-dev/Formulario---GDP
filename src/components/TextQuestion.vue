<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      {{ question.title }}
      <span class="text-red-500">*</span>
    </label>
    <textarea
      :value="value"
      :disabled="disabled"
      :data-question-id="question._id.$oid"
      @input="$emit('update:value', $event.target.value)"
      @blur="$emit('blur')"
      rows="4"
      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:opacity-50 disabled:bg-gray-100 p-2"
      :class="{ 'border-red-500': error && touched }"
      placeholder="Escribe tu respuesta aquí..."
    ></textarea>
    <TransitionGroup name="fade">
      <p
        v-if="error && touched"
        key="error"
        class="mt-2 text-sm text-red-600"
      >
        {{ error }}
      </p>
      <p
        v-if="value"
        key="counter"
        class="mt-2 text-sm text-gray-500"
      >
        {{ value.length }}/500 caracteres
      </p>
    </TransitionGroup>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  touched: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:value', 'blur']);
</script>
