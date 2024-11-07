<template>
  <div class="relative pt-1">
    <div class="flex mb-2 items-center justify-between">
      <div>
        <span
          class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
          :class="{
            'text-green-600 bg-green-200': progress >= 100,
            'text-blue-600 bg-blue-200': progress < 100
          }"
        >
          {{ progress >= 100 ? 'Completado' : 'En progreso' }}
        </span>
      </div>
      <div class="text-right">
        <span class="text-xs font-semibold inline-block text-gray-600">
          {{ Math.round(progress) }}%
        </span>
      </div>
    </div>
    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
      <div
        class="transition-all duration-300 ease-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
        :class="{
          'bg-green-500': progress >= 100,
          'bg-blue-500': progress < 100
        }"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  }
});
</script>
