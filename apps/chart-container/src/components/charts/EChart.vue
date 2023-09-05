<template>
  <v-chart :id="'chart' + id" :option="option" autoresize />
</template>

<script setup>
const props = defineProps({
  option: Object,
  id: Number,
});
</script>
