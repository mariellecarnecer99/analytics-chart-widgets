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
      <Bar
        :id="'chart' + item.index"
        :options="{ responsive: true, plugins: { legend: false } }"
        :data="{ labels: [item.selectable.name], datasets: [{ data: [item.selectable.value] }] }"
      />
    </template>
  </v-data-table>
  <canvas
    v-if="chartType != 'table'"
    :id="'chart' + id"
    ref="canvas"
    class="mt-8"
    height="400"
  ></canvas>
</template>

<script>
import { Bar } from 'vue-chartjs'
import Chart from 'chart.js/auto'
import { VDataTable } from 'vuetify/labs/VDataTable'
export default {
  name: 'ChartJS',
  components: {
    VDataTable,
    Bar
  },
  props: {
    id: Number,
    option: Object,
    chartType: String
  },
  watch: {
    option: [
      {
        handler: 'getOptions'
      }
    ]
  },
  data() {
    return {
      ctx: null,
      headers: [
        {
          title: 'Title',
          align: 'start',
          sortable: false,
          key: 'name'
        },
        { title: 'Value', align: 'start', key: 'value' },
        { title: 'Chart', align: 'center', sortable: false, key: 'chart' }
      ]
    }
  },
  methods: {
    getOptions(el) {
      // const ctx = document.getElementById("chart" + this.id);
      const canvas = this.$refs.canvas

      // var chartExist = Chart.getChart("chart" + this.id);
      if (this.ctx != undefined) {
        this.ctx.destroy()
        this.ctx = new Chart(canvas, el)
      } else {
        this.ctx = new Chart(canvas, el)
      }
    }
  }
}
</script>
