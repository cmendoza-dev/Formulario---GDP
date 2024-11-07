<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <Notification
        v-if="notification.show"
        :message="notification.message"
        :type="notification.type"
        @close="notification.show = false"
      />

      <div class="bg-white shadow sm:rounded-lg">
        <!-- Header -->
        <div class="px-4 py-5 sm:px-6">
          <TransitionGroup
            name="fade"
            tag="div"
            class="flex justify-center items-center mb-4"
          >
            <img
              key="logo"
               src="@/assets/img/gdp-logo.png"
              alt="GDP Logo"
              class="w-40 transition-all duration-300 hover:scale-105"
            >
          </TransitionGroup>
          <h2 class="text-4xl font-bold text- text-center pt-10">
            {{ survey.title }}
          </h2>
        </div>

        <!-- Form -->
        <form
          ref="formRef"
          @submit.prevent="handleSubmit"
          class="px-4 py-5 sm:p-6 space-y-6"
        >
          <ProgressBar :progress="completionProgress" />

          <TransitionGroup
            name="list"
            tag="div"
            class="space-y-6"
          >
            <template v-for="(question) in survey.questions" :key="question._id.$oid">
              <div
                class="transition-all duration-300"
                :class="{'opacity-50': isSubmitting}"
              >
                <MultipleChoice
                  v-if="question.type === 'MULTIPLE_CHOICE'"
                  :question="question"
                  :value="answers.get(question._id.$oid)"
                  :error="errors.get(question._id.$oid)"
                  :touched="isTouched(question._id.$oid)"
                  :disabled="isSubmitting"
                  @update:value="(val) => setAnswer(question._id.$oid, val)"
                  @blur="markAsTouched(question._id.$oid)"
                />
                <TextQuestion
                  v-else-if="question.type === 'TEXT'"
                  :question="question"
                  :value="answers.get(question._id.$oid)"
                  :error="errors.get(question._id.$oid)"
                  :touched="isTouched(question._id.$oid)"
                  :disabled="isSubmitting"
                  @update:value="(val) => setAnswer(question._id.$oid, val)"
                  @blur="markAsTouched(question._id.$oid)"
                />
              </div>
            </template>
          </TransitionGroup>

          <div class="mt-6">
            <button
              type="submit"
              :disabled="!isFormValid || isSubmitting"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Spinner v-if="isSubmitting" class="mr-2" />
              <!-- <IconSave class="my-auto mr-2" /> -->
              {{ isSubmitting ? 'Enviando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSurveyStore } from '@/stores/formStore';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import MultipleChoice from "@/components/MultipleChoice.vue";
import TextQuestion from "@/components/TextQuestion.vue";
import Notification from '@/components/Notification.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import Spinner from '@/components/Spinner.vue';
// import IconSave from '@/components/icons/IconSave.vue';

const store = useSurveyStore();
const { answers, isSubmitting, errors, isFormValid } = storeToRefs(store);
const { setAnswer, submitSurvey } = store;

const { notification, showNotification } = useNotification();
const {formRef, markAsTouched, isTouched } = useFormValidation();

const survey = ref({
title: "ENCUESTA DE SATISFACCIÓN \n 2024 - EDU. FÍSICA",
  questions: [
    {
      type: "MULTIPLE_CHOICE",
      title: "¿Cómo calificaría la calidad del curso actual?",
      options: ["Bueno", "Regular", "Malo"],
      _id: { $oid: "672058f1f76e8c7681b78a06" },
    },
    {
      type: "MULTIPLE_CHOICE",
      title:
        "¿Considera que el curso le está proporcionando conocimientos y habilidades aplicables en su área laboral?",
      options: ["De acuerdo", "En desacuerdo"],
      _id: { $oid: "672058f1f76e8c7681b78a07" },
    },
    {
      type: "MULTIPLE_CHOICE",
      title: "¿Cómo calificarías al ponente o ponentes del curso actual?",
      options: ["Bueno", "Regular", "Malo"],
      _id: { $oid: "672058f1f76e8c7681b78a08" },
    },
    {
      type: "MULTIPLE_CHOICE",
      title: "¿El temario del programa estaba bien organizado y estructurado?",
      options: ["Si", "No"],
      _id: { $oid: "672058f1f76e8c7681b78a09" },
    },
    {
      type: "TEXT",
      title:
        "Proporcione una recomendación o sugerencia adicional que pueda ayudarnos a mejorar el programa actual:",
      options: [],
      _id: { $oid: "672058f1f76e8c7681b78a0a" },
    },
    {
      type: "MULTIPLE_CHOICE",
      title:
        "¿Le gustaría capacitarse en otros programas con nosotros en el futuro?",
      options: ["Si", "No"],
      _id: { $oid: "672058f1f76e8c7681b78a0b" },
    },
    {
      type: "TEXT",
      title:
        "¿Qué diplomado o especialización les gustaría que se aperture para potenciar su expediente profesional?. Déjanos en los comentarios.",
      options: [],
      _id: { $oid: "672058f1f76e8c7681b78a0c" },
    },
  ],

});

const completionProgress = computed(() => {
  const totalQuestions = survey.value.questions.length;
  const answeredQuestions = answers.value.size;
  return (answeredQuestions / totalQuestions) * 100;
});

const handleSubmit = async () => {
  try {
    // Marcar todos los campos como tocados
    survey.value.questions.forEach(q => markAsTouched(q._id.$oid));

    if (!isFormValid.value) {
      showNotification('Por favor, complete todos los campos requeridos', 'error');
      return;
    }

    await submitSurvey();
    showNotification('¡Encuesta enviada con éxito!', 'success');
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

onMounted(() => {
  // Restaurar datos del formulario si existen en localStorage
  const savedData = localStorage.getItem('surveyAnswers');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    Object.entries(parsed).forEach(([key, value]) => {
      setAnswer(key, value);
    });
  }
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
