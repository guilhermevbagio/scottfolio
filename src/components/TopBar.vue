<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const glass = ref(false);
const onPaper = ref(false);
let frame = 0;

function update() {
  const hero = document.getElementById("top");
  const gallery = document.getElementById("gallery");
  if (!hero) {
    glass.value = window.scrollY > 0;
  } else {
    const traveled = hero.offsetTop - hero.getBoundingClientRect().top;
    glass.value = traveled > 32;
  }
  const paper = gallery?.querySelector(".paper");
  const edge = paper ?? gallery;
  onPaper.value = edge ? edge.getBoundingClientRect().top <= 80 : false;
  frame = 0;
}

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(update);
}

onMounted(() => {
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  if (frame) cancelAnimationFrame(frame);
});
</script>

<template>
  <header
    class="topbar sticky top-0 z-30 flex h-20 items-center justify-between border-b px-5 sm:px-8"
    :class="{ 'is-glass': glass, 'is-on-paper': onPaper }"
  >
    <a href="#top" class="font-display text-2xl leading-none">Scott</a>
    <nav class="flex items-center gap-6">
      <a href="#gallery" class="font-display text-2xl leading-none">Work</a>
      <a href="#contact" class="font-display text-2xl leading-none">Contact</a>
    </nav>
  </header>
</template>

<style scoped>
.topbar {
  color: var(--color-ice);
  background-color: transparent;
  border-bottom-color: transparent;
  backdrop-filter: blur(0);
  -webkit-backdrop-filter: blur(0);
  transition:
    color 500ms ease,
    background-color 500ms ease,
    border-color 500ms ease,
    backdrop-filter 500ms ease,
    -webkit-backdrop-filter 500ms ease;
}

.topbar a {
  color: inherit;
}

.topbar a:focus-visible {
  outline: 4px solid currentColor;
  outline-offset: 4px;
}

.topbar.is-glass {
  background-color: rgb(248 252 255 / 0.2);
  border-bottom-color: rgb(248 252 255 / 0.45);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
}

.topbar.is-on-paper {
  color: var(--color-blue);
}

.topbar.is-glass.is-on-paper {
  background-color: rgb(253 253 253 / 0.72);
  border-bottom-color: rgb(92 143 184 / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .topbar {
    transition: none;
  }
}
</style>
