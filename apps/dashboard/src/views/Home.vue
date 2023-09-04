<template>
  <div class="my-5 text-center">
    <h2>{{ title }}</h2>
    <p>{{ desc }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  desc: String,
});
</script>
