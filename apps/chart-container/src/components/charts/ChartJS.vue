<template>
  <v-data-table-virtual
    v-if="chartType === 'table'"
    :headers="headers"
    :items="option?.tableData"
    class="elevation-1"
    density="compact"
    item-key="name"
  >
    <template v-slot:item.chart="{ item }">
      <!-- <Bar
        :id="'chart' + item.index"
        :options="{ responsive: true, plugins: { legend: false } }"
        :data="{ labels: [item.selectable.name], datasets: [{ data: [item.selectable.value] }] }"
      /> -->
    </template>
  </v-data-table-virtual>
  <canvas
    v-if="chartType != 'table'"
    :id="'chart' + id"
    ref="canvas"
    class="mt-8"
    height="400"
  ></canvas>
</template>

<script>
// import { Bar } from 'vue-chartjs'
import Chart from 'chart.js/auto'
import { VDataTableVirtual } from 'vuetify/labs/VDataTable'
export default {
  name: 'ChartJS',
  components: {
    VDataTableVirtual
    // Bar
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
      aggregatedData: {},
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
      el.tableData.forEach((item) => {
        const { name, value } = item

        // If the name exists in the aggregatedData object, add the value to it
        if (this.aggregatedData[name]) {
          this.aggregatedData[name] += value
        } else {
          // If the name doesn't exist, create a new entry with the value
          this.aggregatedData[name] = value
        }
      })

      // Convert the aggregated data back to an array of objects
      this.option.tableData = Object.keys(this.aggregatedData).map((name) => ({
        name,
        value: this.aggregatedData[name]
      }))
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
