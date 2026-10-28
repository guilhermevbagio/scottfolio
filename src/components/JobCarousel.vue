<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  job: { type: Object, required: true },
});

const index = ref(0);

const slides = computed(() => {
  if (props.job.images?.length) return props.job.images;
  return [{ src: props.job.image || "", swatch: props.job.swatch, label: props.job.title }];
});

const many = computed(() => slides.value.length > 1);

watch(
  () => props.job.id,
  () => {
    index.value = 0;
  },
);

function go(next) {
  const count = slides.value.length;
  if (count < 2) return;
  index.value = (next + count) % count;
}

function prev() {
  go(index.value - 1);
}

function next() {
  go(index.value + 1);
}

function onKey(event) {
  const dialog = document.querySelector("dialog.job-detail");
  if (!dialog?.open || !dialog.contains(document.activeElement)) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    next();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    prev();
  }
}

let startX = 0;

function onPointerDown(event) {
  if (event.target.closest("button")) return;
  startX = event.clientX;
}

function onPointerUp(event) {
  if (event.target.closest("button")) return;
  const dx = event.clientX - startX;
  if (dx > 48) prev();
  else if (dx < -48) next();
}

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <div
    class="carousel relative h-full min-h-[42vh] overflow-hidden md:min-h-0"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
  >
    <div class="track" :style="{ transform: `translateX(-${index * 100}%)` }">
      <div v-for="(slide, i) in slides" :key="`${job.id}-${i}`" class="slide">
        <img
          v-if="slide.src"
          :src="slide.src"
          :alt="slide.label || job.title"
          class="h-full w-full object-cover"
        />
        <div v-else class="h-full w-full" :style="{ backgroundColor: slide.swatch || job.swatch }" />
      </div>
    </div>

    <p class="pointer-events-none absolute bottom-5 left-5 z-10 border-4 border-blue bg-blue text-ice" aria-hidden="true">
      <span class="font-display block px-3 py-2 text-4xl leading-none sm:text-5xl">
        {{ slides[index].label }}
      </span>
    </p>

    <p
      v-if="many"
      class="pointer-events-none absolute top-5 left-5 z-10 border-4 border-blue bg-blue px-3 py-2 font-display text-2xl leading-none text-ice"
    >
      {{ String(index + 1).padStart(2, "0") }}
      <span class="opacity-80"> / {{ String(slides.length).padStart(2, "0") }}</span>
    </p>

    <template v-if="many">
      <button
        type="button"
        class="carousel-arrow left-4"
        aria-label="Previous image"
        @click="prev"
      >
        Prev
      </button>
      <button
        type="button"
        class="carousel-arrow right-4"
        aria-label="Next image"
        @click="next"
      >
        Next
      </button>
      <div class="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        <button
          v-for="(slide, i) in slides"
          :key="`${job.id}-dot-${i}`"
          type="button"
          class="carousel-dot"
          :class="{ 'is-on': i === index }"
          :aria-label="`Show ${slide.label || 'image ' + (i + 1)}`"
          :aria-current="i === index ? 'true' : undefined"
          @click="go(i)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.track {
  display: flex;
  height: 100%;
  min-height: 42vh;
  transition: transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.slide {
  height: 100%;
  min-width: 100%;
  flex: 0 0 100%;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  z-index: 5;
  border: 4px solid var(--color-ice);
  background: var(--color-blue);
  color: var(--color-ice);
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1;
  padding: 0.7rem 0.85rem;
  transform: translateY(-50%);
  transition: transform 180ms ease;
}

.carousel-arrow:hover,
.carousel-arrow:focus-visible {
  transform: translateY(-50%) scale(1.08) rotate(-3deg);
}

.carousel-arrow:focus-visible {
  outline: 4px solid var(--color-ice);
  outline-offset: 3px;
}

.carousel-dot {
  width: 0.8rem;
  height: 0.8rem;
  border: 3px solid var(--color-ice);
  background: transparent;
  transition: transform 280ms ease, background-color 280ms ease;
}

.carousel-dot:hover,
.carousel-dot:focus-visible {
  background: var(--color-ice);
}

.carousel-dot.is-on {
  background: var(--color-ice);
  transform: scale(1.35);
}

@media (prefers-reduced-motion: reduce) {
  .track,
  .carousel-arrow,
  .carousel-dot {
    transition: none;
  }

  .carousel-arrow {
    transform: translateY(-50%);
  }

  .carousel-dot.is-on {
    transform: none;
  }
}
</style>
