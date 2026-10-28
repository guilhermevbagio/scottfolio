<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const reduce =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const shift = ref(0);
let frame = 0;

function onScroll() {
  if (reduce || frame) return;
  frame = requestAnimationFrame(() => {
    shift.value = Math.min(window.scrollY * 0.08, 16);
    frame = 0;
  });
}

onMounted(() => {
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
    id="top"
    class="flex min-h-[calc(100dvh-5rem)] flex-col justify-center px-5 pb-16 sm:px-8"
  >
    <div :style="reduce ? undefined : { transform: `translate3d(0, ${shift}px, 0)` }">
      <h1 class="font-display leading-[0.82] tracking-tight text-ice">
        <span class="block text-[clamp(3.75rem,16vw,9.5rem)]">HELLO</span>
        <span class="block text-[clamp(3.75rem,16vw,9.5rem)]">SCOTT</span>
      </h1>
      <p class="mt-6 max-w-md text-lg leading-snug text-ice sm:text-xl">
        Illustration, lettering, and pictures for hire.
      </p>
    </div>
  </section>
</template>
