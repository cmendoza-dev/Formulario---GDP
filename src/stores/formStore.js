import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useSurveyStore = defineStore('survey', () => {
  const answers = ref(new Map());
  const isSubmitting = ref(false);
  const errors = ref(new Map());
  const successMessage = ref('');

  const isFormValid = computed(() => {
    return errors.value.size === 0 && answers.value.size > 0;
  });

  const setAnswer = (questionId, value) => {
    answers.value.set(questionId, value);
    validateQuestion(questionId, value);
  };

  const validateQuestion = (questionId, value) => {
    if (!value || value.trim() === '') {
      errors.value.set(questionId, 'Este campo es requerido');
    } else {
      errors.value.delete(questionId);
    }
  };

  const submitSurvey = async () => {
    try {
      isSubmitting.value = true;
      // Simular un tiempo de procesamiento en el backend (1.5 segundos) para mostrar el mensaje de éxito
      await new Promise(resolve => setTimeout(resolve, 1500));

      const formData = Array.from(answers.value.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      console.log('Submitted data:', formData);
      successMessage.value = '¡Encuesta enviada con éxito!';

      // Limpiar el formulario
      answers.value.clear();
      return true;
    } catch (error) {
      console.error('Error submitting survey:', error);
      throw new Error('Error al enviar la encuesta');
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    answers,
    isSubmitting,
    errors,
    successMessage,
    isFormValid,
    setAnswer,
    submitSurvey
  };
});
