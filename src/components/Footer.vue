<script setup>
import { contact } from "../data/contact";
import { useReveal } from "../composables/useReveal";

const { el, visible } = useReveal();
</script>

<template>
  <footer id="contact" class="contact-footer scroll-mt-20 px-5 pt-12 pb-16 sm:px-8">
    <div ref="el" class="reveal" :class="{ 'is-visible': visible }">
      <h2 class="font-display text-5xl leading-none text-ice sm:text-6xl">Contact</h2>
      <p class="mt-4 max-w-md text-lg leading-snug text-ice">{{ contact.line }}</p>
      <a
        class="contact-mail font-display mt-6 inline-block text-3xl leading-none text-ice underline decoration-4 underline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ice sm:text-4xl"
        :href="`mailto:${contact.email}`"
      >
        {{ contact.email }}
      </a>
      <ul class="mt-8 flex flex-wrap gap-3">
        <li v-for="social in contact.socials" :key="social.label">
          <a
            class="contact-social inline-block border-4 border-ice px-3 py-2 font-display text-xl leading-none text-ice focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ice"
            :href="social.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ social.label }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.contact-footer {
  background-color: rgb(248 252 255 / 0.2);
  border-top: 1px solid rgb(248 252 255 / 0.45);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
}

.contact-mail,
.contact-social {
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.contact-mail:hover,
.contact-social:hover,
.contact-mail:focus-visible,
.contact-social:focus-visible {
  background-color: var(--color-ice);
  color: var(--color-blue);
}

@media (prefers-reduced-motion: reduce) {
  .contact-mail,
  .contact-social {
    transition: none;
  }
}
</style>
