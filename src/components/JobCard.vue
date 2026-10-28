<script setup>
import { useReveal } from "../composables/useReveal";

defineProps({
  job: { type: Object, required: true },
});

const emit = defineEmits(["select"]);
const { el, visible } = useReveal();
</script>

<template>
  <li ref="el" class="reveal" :class="{ 'is-visible': visible }">
    <button
      type="button"
      class="job-card flex aspect-square w-full flex-col border-4 border-blue text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue"
      @click="emit('select', job, $event)"
    >
      <span class="relative block min-h-0 flex-1 overflow-hidden">
        <img
          v-if="job.image"
          :src="job.image"
          :alt="job.title"
          class="h-full w-full object-cover"
        />
        <span v-else class="block h-full w-full" :style="{ backgroundColor: job.swatch }" />
      </span>
      <span class="job-card-caption bg-ice px-3 py-3 text-blue">
        <span class="block text-[0.7rem] font-bold tracking-widest uppercase">{{ job.client }}</span>
        <span class="font-display mt-1 block text-xl leading-none sm:text-2xl">{{ job.title }}</span>
        <span class="mt-1 block text-sm">{{ job.year }}</span>
      </span>
    </button>
  </li>
</template>

<style scoped>
.job-card {
  transition: transform 200ms ease;
}

.job-card-caption {
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.job-card:hover,
.job-card:focus-visible {
  transform: translateY(-6px);
}

.job-card:hover .job-card-caption,
.job-card:focus-visible .job-card-caption {
  background-color: var(--color-blue);
  color: var(--color-ice);
}

@media (prefers-reduced-motion: reduce) {
  .job-card,
  .job-card-caption {
    transition: none;
  }

  .job-card:hover,
  .job-card:focus-visible {
    transform: none;
  }
}
</style>
