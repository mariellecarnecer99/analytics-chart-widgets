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
      <v-chart
        :id="'chart' + item.index"
        :option="{
          tooltip: {},
          legend: {},
          xAxis: {
            type: 'category',
            data: [item.selectable.name]
          },
          yAxis: {
            type: 'value'
          },
          series: [{ data: [item.selectable.value], type: 'bar' }]
        }"
        class="chart-container"
      ></v-chart>
    </template>
  </v-data-table>
  <v-chart v-if="chartType != 'table'" :id="'chart' + id" :option="option" autoresize />
</template>

<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
const props = defineProps({
  option: Object,
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
<style>
.chart-container {
  height: 400px;
}
</style>
