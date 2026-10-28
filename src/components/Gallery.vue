<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { jobs } from "../data/jobs";
import { useReveal } from "../composables/useReveal";
import JobCard from "./JobCard.vue";

const emit = defineEmits(["select"]);
const { el, visible } = useReveal();

const reduce =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const section = ref(null);
const offset = ref(0);
const scrollY = ref(0);
let frame = 0;

const shapes = [
  {
    fill: "#e7f4f8",
    top: "6%",
    left: "-12%",
    size: "clamp(200px, 36vw, 460px)",
    speed: 0.05,
    drift: 0.02,
    d: "M48 18c22-14 36 8 58 4 24-6 48 10 52 34 6 28 22 36 16 62-8 28-36 24-58 40-26 16-58 28-78 8-22-20-14-48-28-70C-2 70 8 36 28 28c12-6 8-16 20-10z",
  },
  {
    fill: "#d5ebf4",
    top: "38%",
    left: "68%",
    size: "clamp(170px, 30vw, 400px)",
    speed: 0.1,
    drift: -0.025,
    d: "M36 40c20-28 62-20 84-6 18 12 48 4 62 28 12 22 8 40 2 58-8 24-6 52-32 62-30 12-46-10-72-8-28 2-58 18-74-8-14-22-4-42-8-64-4-20 10-36 38-62z",
  },
  {
    fill: "#eef6f8",
    top: "68%",
    left: "8%",
    size: "clamp(150px, 26vw, 340px)",
    speed: 0.07,
    drift: 0.015,
    d: "M40 28c26-18 44 6 70 2 22-4 46 8 58 30 14 24 28 28 24 54-4 28-22 36-28 58-8 24-40 36-66 28-30-8-36 10-62-2-22-12-28-40-24-64 4-26-12-40-4-64 8-22 14-28 32-42z",
  },
];

function update() {
  scrollY.value = window.scrollY;
  if (window.scrollY <= 0) {
    offset.value = 0;
    frame = 0;
    return;
  }
  const top = section.value?.getBoundingClientRect().top ?? 0;
  const entered = Math.max(0, window.innerHeight - top);
  const distanceToBar = Math.max(0, top - 80);
  const enterLead = Math.min(120, entered * 0.4);
  const settle = Math.min(1, distanceToBar / 360);
  offset.value = -enterLead * settle;
  frame = 0;
}

function onScroll() {
  if (reduce || frame) return;
  frame = requestAnimationFrame(update);
}

function shapeStyle(shape) {
  const shift = reduce
    ? "none"
    : `translate3d(${scrollY.value * shape.drift}px, ${scrollY.value * shape.speed}px, 0)`;
  return {
    top: shape.top,
    left: shape.left,
    width: shape.size,
    height: shape.size,
    transform: shift,
  };
}

onMounted(() => {
  update();
  if (reduce) return;
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  if (frame) cancelAnimationFrame(frame);
});
</script>

<template>
  <section
    id="gallery"
    ref="section"
    class="relative scroll-mt-20 overflow-x-clip px-5 pt-10 pb-20 text-blue sm:px-8"
    aria-labelledby="gallery-heading"
  >
    <div
      class="paper pointer-events-none absolute inset-x-0 bottom-0 bg-paper"
      :style="{ top: reduce ? '0px' : `${offset}px` }"
      aria-hidden="true"
    >
      <svg
        v-for="(shape, index) in shapes"
        :key="index"
        viewBox="0 0 200 200"
        class="absolute"
        :style="shapeStyle(shape)"
      >
        <path :fill="shape.fill" :d="shape.d" />
      </svg>
    </div>
    <div ref="el" class="reveal relative mb-8" :class="{ 'is-visible': visible }">
      <h2 id="gallery-heading" class="font-display text-5xl leading-none sm:text-6xl">
        Work
      </h2>
    </div>
    <ul class="relative grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
      <JobCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        @select="(job, event) => emit('select', job, event)"
      />
    </ul>
  </section>
</template>
