<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { jobs } from "../data/jobs";
import JobCarousel from "./JobCarousel.vue";

const props = defineProps({
  job: { type: Object, default: null },
});

const emit = defineEmits(["close"]);
const dialog = ref(null);
const stack = ref([]);
const direction = ref(1);
const reduce =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let busy = false;
let acc = 0;
let settleTimer = 0;
let token = 0;
let startY = 0;
let tracking = false;

watch(
  () => props.job,
  async (job) => {
    if (job) {
      token += 1;
      busy = false;
      acc = 0;
      stack.value = [{ job, phase: "rest", key: `${job.id}-${token}` }];
    }
    await nextTick();
    const dialogEl = dialog.value;
    if (!dialogEl) return;
    if (job && !dialogEl.open) dialogEl.showModal();
    else if (!job && dialogEl.open) dialogEl.close();
  },
  { immediate: true },
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

function currentPane() {
  return stack.value.find((pane) => pane.phase !== "leave");
}

const jobIndex = computed(() => jobs.findIndex((job) => job.id === currentPane()?.job.id));
const prevJob = computed(() => (jobIndex.value > 0 ? jobs[jobIndex.value - 1] : null));
const nextJob = computed(() =>
  jobIndex.value >= 0 && jobIndex.value < jobs.length - 1 ? jobs[jobIndex.value + 1] : null,
);

function go(dir) {
  if (busy) return;
  const current = currentPane();
  if (!current) return;
  const index = jobs.findIndex((job) => job.id === current.job.id);
  const next = jobs[index + dir];
  if (!next) return;

  if (reduce) {
    token += 1;
    stack.value = [{ job: next, phase: "rest", key: `${next.id}-${token}` }];
    return;
  }

  direction.value = dir;
  busy = true;
  token += 1;
  current.phase = "leave";
  stack.value = [
    ...stack.value,
    { job: next, phase: "enter", key: `${next.id}-${token}` },
  ];
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    stack.value = stack.value
      .filter((pane) => pane.phase !== "leave")
      .map((pane) => ({ ...pane, phase: "rest" }));
    busy = false;
  }, 480);
}

function onWheel(event) {
  const dialogEl = dialog.value;
  if (!dialogEl?.open) return;
  event.preventDefault();
  if (busy) {
    acc = 0;
    return;
  }
  const delta =
    event.deltaMode === 1
      ? event.deltaY * 16
      : event.deltaMode === 2
        ? event.deltaY * window.innerHeight
        : event.deltaY;
  if (Math.abs(delta) < Math.abs(event.deltaX)) return;
  acc += delta;
  if (Math.abs(acc) < 60) return;
  const dir = acc > 0 ? 1 : -1;
  acc = 0;
  go(dir);
}

function onKey(event) {
  const dialogEl = dialog.value;
  if (!dialogEl?.open || !dialogEl.contains(document.activeElement)) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    go(1);
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    go(-1);
  }
}

function onPointerDown(event) {
  if (event.pointerType === "mouse" || event.target.closest("button")) return;
  tracking = true;
  startY = event.clientY;
}

function onPointerUp(event) {
  if (!tracking) return;
  tracking = false;
  const dy = event.clientY - startY;
  if (Math.abs(dy) < 56) return;
  go(dy < 0 ? 1 : -1);
}

onMounted(() => {
  dialog.value?.addEventListener("wheel", onWheel, { passive: false, capture: true });
  window.addEventListener("keydown", onKey);
});

onUnmounted(() => {
  clearTimeout(settleTimer);
  dialog.value?.removeEventListener("wheel", onWheel, { capture: true });
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <dialog
    ref="dialog"
    class="job-detail"
    aria-labelledby="job-detail-title"
    @close="onDialogClose"
    @click="onBackdropClick"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
  >
    <div class="job-stage" :style="{ '--dir': direction }">
      <article
        v-for="pane in stack"
        :key="pane.key"
        class="job-pane grid h-full md:grid-cols-2"
        :class="{
          'is-enter': pane.phase === 'enter',
          'is-leave': pane.phase === 'leave',
        }"
      >
        <div class="relative min-h-[42vh] border-b-4 border-blue md:min-h-0 md:border-r-4 md:border-b-0">
          <JobCarousel :job="pane.job" />
        </div>
        <div class="job-copy flex min-w-0 flex-col justify-center gap-6 overflow-auto p-6 sm:p-10 lg:p-14">
          <div class="flex items-start justify-between gap-4">
            <p class="job-line text-sm font-bold tracking-widest uppercase" style="--i: 0">{{ pane.job.client }}</p>
            <button
              type="button"
              class="job-close font-display shrink-0 border-4 border-blue px-4 py-2 text-2xl leading-none text-blue focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue"
              @click="requestClose"
            >
              Close
            </button>
          </div>
          <h2
            :id="pane.phase === 'leave' ? undefined : 'job-detail-title'"
            class="job-line font-display text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.85] break-words"
            style="--i: 1"
          >
            {{ pane.job.title }}
          </h2>
          <p class="job-line text-lg" style="--i: 2">{{ pane.job.year }}</p>
          <dl class="job-line grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-3 text-lg" style="--i: 3">
            <dt class="font-bold tracking-wide uppercase">Role</dt>
            <dd>{{ pane.job.role }}</dd>
            <dt class="font-bold tracking-wide uppercase">Deliverable</dt>
            <dd>{{ pane.job.deliverable }}</dd>
          </dl>
          <p class="job-line max-w-xl text-xl leading-relaxed" style="--i: 4">{{ pane.job.summary }}</p>
          <ul class="flex flex-wrap gap-3">
            <li
              v-for="(tag, i) in pane.job.tags"
              :key="tag"
              class="job-line border-4 border-blue px-3 py-2 font-display text-lg leading-none"
              :style="{ '--i': 5 + i }"
            >
              {{ tag }}
            </li>
          </ul>
        </div>
      </article>
    </div>
    <button
      v-if="prevJob"
      type="button"
      class="work-scroll is-up"
      :aria-label="`Previous work, ${prevJob.title}`"
      @click="go(-1)"
    >
      <span class="work-scroll-mark" aria-hidden="true"></span>
      {{ prevJob.title }}
    </button>
    <button
      v-if="nextJob"
      type="button"
      class="work-scroll is-down"
      :aria-label="`Next work, ${nextJob.title}`"
      @click="go(1)"
    >
      {{ nextJob.title }}
      <span class="work-scroll-mark" aria-hidden="true"></span>
    </button>
  </dialog>
</template>

<style scoped>
.job-stage {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.job-pane {
  position: absolute;
  inset: 0;
  background: var(--color-ice);
}

.job-pane.is-enter {
  z-index: 2;
  animation: job-slide-in 460ms cubic-bezier(0.2, 0, 0, 1) both;
}

.job-pane.is-leave {
  z-index: 1;
  animation: job-slide-out 460ms cubic-bezier(0.2, 0, 0, 1) both;
}

@keyframes job-slide-in {
  from {
    transform: translate3d(0, calc(var(--dir) * 100%), 0);
  }
  to {
    transform: none;
  }
}

@keyframes job-slide-out {
  from {
    transform: none;
  }
  to {
    transform: translate3d(0, calc(var(--dir) * -100%), 0);
  }
}

.job-close {
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.job-close:hover,
.job-close:focus-visible {
  background: var(--color-blue);
  color: var(--color-ice);
}

.work-scroll {
  position: absolute;
  left: 50%;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transform: translateX(-50%);
  border: 3px solid var(--color-blue);
  background: var(--color-ice);
  color: var(--color-blue);
  font-family: var(--font-display);
  font-size: 1rem;
  line-height: 1;
  padding: 0.4rem 0.65rem;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.work-scroll.is-up {
  top: 0.85rem;
}

.work-scroll.is-down {
  bottom: 0.85rem;
}

.work-scroll:hover,
.work-scroll:focus-visible {
  background: var(--color-blue);
  color: var(--color-ice);
}

.work-scroll:focus-visible {
  outline: 4px solid var(--color-blue);
  outline-offset: 3px;
}

.work-scroll-mark {
  width: 0.4rem;
  height: 0.4rem;
  border-right: 3px solid currentColor;
  border-bottom: 3px solid currentColor;
}

.work-scroll.is-up .work-scroll-mark {
  transform: rotate(-135deg) translateY(-1px);
}

.work-scroll.is-down .work-scroll-mark {
  transform: rotate(45deg) translateY(-1px);
}

.job-line {
  animation: job-line 420ms cubic-bezier(0.2, 0, 0, 1) both;
  animation-delay: calc(80ms + var(--i) * 50ms);
}

@keyframes job-line {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .job-pane.is-enter,
  .job-pane.is-leave,
  .job-line {
    animation: none;
  }

  .job-close,
  .work-scroll {
    transition: none;
  }
}
</style>
