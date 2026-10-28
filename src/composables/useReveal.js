import { onMounted, onUnmounted, ref } from "vue";

export function useReveal() {
  const el = ref(null);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visible = ref(reduce);
  let observer;
  let frame = 0;

  onMounted(() => {
    if (reduce || !el.value) return;
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        visible.value = true;
        observer?.disconnect();
      },
      {
        // Fire as the element enters, not after a large share of it is already on screen.
        threshold: 0,
        rootMargin: "0px 0px 12% 0px",
      },
    );
    // Paint the hidden state first so the transition can run.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (el.value) observer?.observe(el.value);
      });
    });
  });

  onUnmounted(() => {
    if (frame) cancelAnimationFrame(frame);
    observer?.disconnect();
  });

  return { el, visible };
}
