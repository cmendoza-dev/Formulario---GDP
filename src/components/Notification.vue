<template>
  <TransitionRoot appear :show="show" as="template">
    <div
      class="fixed inset-0 z-50 pointer-events-none flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          enter="transform ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            v-if="isVisible"
            class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
            :class="{
              'bg-green-50': type === 'success',
              'bg-red-50': type === 'error',
              'bg-yellow-50': type === 'warning',
              'bg-blue-50': type === 'info',
            }"
          >
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <CheckCircleIcon
                    v-if="type === 'success'"
                    class="h-6 w-6 text-green-400"
                  />
                  <XCircleIcon
                    v-else-if="type === 'error'"
                    class="h-6 w-6 text-red-400"
                  />
                  <ExclamationCircleIcon
                    v-else-if="type === 'warning'"
                    class="h-6 w-6 text-yellow-400"
                  />
                  <InformationCircleIcon v-else class="h-6 w-6 text-blue-400" />
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p
                    class="text-sm font-medium"
                    :class="{
                      'text-green-800': type === 'success',
                      'text-red-800': type === 'error',
                      'text-yellow-800': type === 'warning',
                      'text-blue-800': type === 'info',
                    }"
                  >
                    {{ message }}
                  </p>
                </div>
                <div class="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    :class="{
                      'text-green-500 hover:text-green-600 focus:ring-green-500':
                        type === 'success',
                      'text-red-500 hover:text-red-600 focus:ring-red-500':
                        type === 'error',
                      'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500':
                        type === 'warning',
                      'text-blue-500 hover:text-blue-600 focus:ring-blue-500':
                        type === 'info',
                    }"
                    @click="$emit('close')"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Progress bar for auto-dismiss -->
            <div
              class="h-1 transition-all duration-300"
              :class="{
                'bg-green-400': type === 'success',
                'bg-red-400': type === 'error',
                'bg-yellow-400': type === 'warning',
                'bg-blue-400': type === 'info',
              }"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </Transition>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { TransitionRoot } from "@headlessui/vue";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
  },
  duration: {
    type: Number,
    default: 5000,
  },
});

const emit = defineEmits(["close"]);

const progress = ref(100);
let progressInterval;
let dismissTimeout;

onMounted(() => {
  if (props.duration > 0) {
    const startTime = Date.now();
    const endTime = startTime + props.duration;

    progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      progress.value = (remaining / props.duration) * 100;
    }, 10);

    dismissTimeout = setTimeout(() => {
      emit("close");
    }, props.duration);
  }
});

onUnmounted(() => {
  clearInterval(progressInterval);
  clearTimeout(dismissTimeout);
});

const isVisible = ref(false);
// Change `isVisible` to `true` or `false` to show or hide the notification

</script>
