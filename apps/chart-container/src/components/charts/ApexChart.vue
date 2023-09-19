<template>
  <v-data-table
    v-if="chartType === 'table'"
    :headers="headers"
    :items="option?.tableData"
    class="elevation-1"
    density="compact"
    item-key="name"
  >
    <template v-slot:item.chart="{ item }">
      <apexchart
        type="bar"
        :id="'chart' + item.index"
        :options="{
          chart: {
            toolbar: {
              show: false
            }
          },
          xaxis: { categories: [item.selectable.name] }
        }"
        :series="[{ data: [item.selectable.value] }]"
      ></apexchart>
    </template>
  </v-data-table>
  <apexchart
    v-if="chartType != 'table'"
    :id="'chart' + id"
    :key="apexSeries.length"
    :options="option"
    :series="apexSeries"
    height="100%"
  ></apexchart>
</template>

<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
const props = defineProps({
  option: Object,
  apexSeries: Array,
  id: Number,
  chartType: String
})

const headers = [
  {
    title: 'Title',
    align: 'start',
    sortable: false,
    key: 'name'
  },
  { title: 'Value', align: 'start', key: 'value' },
  { title: 'Chart', align: 'center', sortable: false, key: 'chart' }
]
</script>
