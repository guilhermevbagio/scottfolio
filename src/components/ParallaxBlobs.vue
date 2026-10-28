<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const blobs = [
  {
    fill: "#6ec8cf",
    top: "-8%",
    left: "-14%",
    size: "clamp(200px, 42vw, 520px)",
    speed: 0.05,
    drift: 0.02,
    d: "M48 18c22-14 36 8 58 4 24-6 48 10 52 34 6 28 22 36 16 62-8 28-36 24-58 40-26 16-58 28-78 8-22-20-14-48-28-70C-2 70 8 36 28 28c12-6 8-16 20-10z",
  },
  {
    fill: "#87c3e6",
    top: "8%",
    left: "68%",
    size: "clamp(180px, 36vw, 460px)",
    speed: 0.1,
    drift: -0.03,
    d: "M36 40c20-28 62-20 84-6 18 12 48 4 62 28 12 22 8 40 2 58-8 24-6 52-32 62-30 12-46-10-72-8-28 2-58 18-74-8-14-22-4-42-8-64-4-20 10-36 38-62z",
  },
  {
    fill: "#4fa7a9",
    top: "46%",
    left: "-16%",
    size: "clamp(190px, 38vw, 480px)",
    speed: 0.07,
    drift: 0.025,
    d: "M62 16c28-8 40 14 66 16 28 2 52 18 50 46-2 26 10 40-4 62-16 24-46 20-70 34-28 14-66 8-80-20-16-28-6-46-16-70-8-22 8-36 24-52 10-8 16-12 30-16z",
  },
  {
    fill: "#d7eef8",
    top: "62%",
    left: "64%",
    size: "clamp(170px, 32vw, 420px)",
    speed: 0.12,
    drift: -0.02,
    d: "M40 28c26-18 44 6 70 2 22-4 46 8 58 30 14 24 28 28 24 54-4 28-22 36-28 58-8 24-40 36-66 28-30-8-36 10-62-2-22-12-28-40-24-64 4-26-12-40-4-64 8-22 14-28 32-42z",
  },
  {
    fill: "#7eb6d4",
    top: "78%",
    left: "22%",
    size: "clamp(140px, 24vw, 300px)",
    speed: 0.04,
    drift: 0.015,
    d: "M54 20c24-12 34 12 56 10 20-2 40 14 44 36 4 24 18 32 10 54-8 22-32 24-48 40-20 18-52 14-70-2-20-16-16-40-28-58-12-18 2-34 4-52 2-16 8-20 32-28z",
  },
];

const reduce = ref(
  typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
);
const scrollY = ref(0);
let frame = 0;

function onScroll() {
  if (reduce.value || frame) return;
  frame = requestAnimationFrame(() => {
    scrollY.value = window.scrollY;
    frame = 0;
  });
}

onMounted(() => {
  if (reduce.value) return;
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  if (frame) cancelAnimationFrame(frame);
});

function blobStyle(blob) {
  const shift = reduce.value
    ? "none"
    : `translate3d(${scrollY.value * blob.drift}px, ${scrollY.value * blob.speed}px, 0)`;
  return {
    top: blob.top,
    left: blob.left,
    width: blob.size,
    height: blob.size,
    transform: shift,
  };
}
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <svg
      v-for="(blob, index) in blobs"
      :key="index"
      viewBox="0 0 200 200"
      class="absolute"
      :style="blobStyle(blob)"
    >
      <path :fill="blob.fill" :d="blob.d" />
    </svg>
  </div>
</template>
