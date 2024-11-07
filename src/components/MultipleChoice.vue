<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      {{ question.title }}
      <span class="text-red-500">*</span>
    </label>
    <div class="space-y-2">
      <div
        v-for="option in question.options"
        :key="option"
        class="relative flex items-start"
      >
        <div class="flex items-center h-5">
          <input
            type="radio"
            :name="question._id.$oid"
            :value="option"
            :checked="value === option"
            :disabled="disabled"
            :data-question-id="question._id.$oid"
            @change="$emit('update:value', option)"
            @blur="$emit('blur')"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
          >
        </div>
        <div class="ml-3 text-sm">
          <label class="font-medium text-gray-700">{{ option }}</label>
        </div>
      </div>
    </div>
    <TransitionGroup name="fade">
      <p
        v-if="error && touched"
        key="error"
        class="mt-2 text-sm text-red-600"
      >
        {{ error }}
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
    default: null
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
