<script setup>
import { nextTick, ref } from "vue";
import ParallaxBlobs from "./components/ParallaxBlobs.vue";
import TopBar from "./components/TopBar.vue";
import Hero from "./components/Hero.vue";
import Gallery from "./components/Gallery.vue";
import Footer from "./components/Footer.vue";
import JobDetail from "./components/JobDetail.vue";

const selected = ref(null);
let trigger = null;

function openJob(job, event) {
  trigger = event?.currentTarget ?? null;
  selected.value = job;
}

function closeJob() {
  selected.value = null;
  nextTick(() => trigger?.focus());
}
</script>

<template>
  <ParallaxBlobs />
  <div class="relative z-10">
    <TopBar />
    <Hero />
    <Gallery @select="openJob" />
    <Footer />
  </div>
  <JobDetail :job="selected" @close="closeJob" />
</template>
