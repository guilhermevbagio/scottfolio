import { onMounted, onUnmounted, ref } from "vue";

export function useReveal(threshold = 0.2) {
  const el = ref(null);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visible = ref(reduce);
  let observer;

  onMounted(() => {
    if (reduce || !el.value) return;
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        visible.value = true;
        observer?.disconnect();
      },
      { threshold },
    );
    observer.observe(el.value);
  });

  onUnmounted(() => observer?.disconnect());

  return { el, visible };
}
