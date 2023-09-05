<template>
  <apexchart
    :id="'chart' + id"
    :key="apexSeries.length"
    :options="option"
    :series="apexSeries"
    height="100%"
  ></apexchart>
</template>

<script setup>
const props = defineProps({
  option: Object,
  apexSeries: Array,
  id: Number,
});
</script>
