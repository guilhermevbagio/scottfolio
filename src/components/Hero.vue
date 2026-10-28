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
    class="relative flex min-h-[calc(100dvh-5rem)] flex-col justify-center px-5 pb-16 sm:px-8"
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
    <a href="#gallery" class="scroll-cue">
      Work
      <span class="scroll-cue-mark" aria-hidden="true"></span>
    </a>
  </section>
</template>

<style scoped>
.scroll-cue {
  position: absolute;
  bottom: 1.5rem;
  left: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-ice);
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1;
}

.scroll-cue-mark {
  width: 0.5rem;
  height: 0.5rem;
  border-right: 3px solid currentColor;
  border-bottom: 3px solid currentColor;
  transform: rotate(45deg) translateY(-2px);
  transition: transform 180ms ease;
}

.scroll-cue:hover .scroll-cue-mark,
.scroll-cue:focus-visible .scroll-cue-mark {
  transform: rotate(45deg) translateY(2px);
}

.scroll-cue:focus-visible {
  outline: 4px solid var(--color-ice);
  outline-offset: 4px;
}

@media (min-width: 640px) {
  .scroll-cue {
    left: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue-mark,
  .scroll-cue:hover .scroll-cue-mark,
  .scroll-cue:focus-visible .scroll-cue-mark {
    transition: none;
    transform: rotate(45deg) translateY(-2px);
  }
}
</style>
