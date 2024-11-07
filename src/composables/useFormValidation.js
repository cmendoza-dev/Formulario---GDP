import { ref, onMounted, onUnmounted } from 'vue';

export function useFormValidation() {
  const touched = ref(new Set());
  const formRef = ref(null);

  const markAsTouched = (fieldId) => {
    touched.value.add(fieldId);
  };

  const isTouched = (fieldId) => touched.value.has(fieldId);

  const handleBlur = (event) => {
    const element = event.target;
    if (element.dataset.questionId) {
      markAsTouched(element.dataset.questionId);
    }
  };

  onMounted(() => {
    if (formRef.value) {
      formRef.value.addEventListener('blur', handleBlur, true);
    }
  });

  onUnmounted(() => {
    if (formRef.value) {
      formRef.value.removeEventListener('blur', handleBlur, true);
    }
  });

  return {
    touched,
    formRef,
    markAsTouched,
    isTouched
  };
}
