<script setup>
import { nextTick, ref, watch } from "vue";

const props = defineProps({
  job: { type: Object, default: null },
});

const emit = defineEmits(["close"]);
const dialog = ref(null);
const shown = ref(null);

watch(
  () => props.job,
  async (job) => {
    if (job) shown.value = job;
    await nextTick();
    const dialogEl = dialog.value;
    if (!dialogEl) return;
    if (job && !dialogEl.open) dialogEl.showModal();
    else if (!job && dialogEl.open) dialogEl.close();
  },
);

function requestClose() {
  emit("close");
}

function onDialogClose() {
  emit("close");
}

function onBackdropClick(event) {
  if (event.target === dialog.value) requestClose();
}
</script>

<template>
  <dialog
    ref="dialog"
    class="job-detail"
    aria-labelledby="job-detail-title"
    @close="onDialogClose"
    @click="onBackdropClick"
  >
    <article v-if="shown" class="grid md:grid-cols-2">
      <div class="relative min-h-48 border-b-4 border-blue md:border-r-4 md:border-b-0">
        <img
          v-if="shown.image"
          :src="shown.image"
          :alt="shown.title"
          class="h-full w-full object-cover"
        />
        <div v-else class="h-full min-h-48 w-full" :style="{ backgroundColor: shown.swatch }" />
      </div>
      <div class="flex flex-col gap-4 p-5 sm:p-6">
        <div class="flex items-start justify-between gap-4">
          <p class="text-xs font-bold tracking-widest uppercase">{{ shown.client }}</p>
          <button
            type="button"
            class="font-display shrink-0 border-4 border-blue px-3 py-1 text-lg leading-none text-blue focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue"
            @click="requestClose"
          >
            Close
          </button>
        </div>
        <h2 id="job-detail-title" class="font-display text-4xl leading-none sm:text-5xl">
          {{ shown.title }}
        </h2>
        <p class="text-sm">{{ shown.year }}</p>
        <dl class="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-2 text-sm">
          <dt class="font-bold tracking-wide uppercase">Role</dt>
          <dd>{{ shown.role }}</dd>
          <dt class="font-bold tracking-wide uppercase">Deliverable</dt>
          <dd>{{ shown.deliverable }}</dd>
        </dl>
        <p class="text-base leading-relaxed">{{ shown.summary }}</p>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="tag in shown.tags"
            :key="tag"
            class="border-4 border-blue px-2 py-1 text-xs font-bold tracking-wide uppercase"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
    </article>
  </dialog>
</template>
