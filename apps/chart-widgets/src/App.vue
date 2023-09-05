<template>
  <div id="app">
    <v-chart
      v-if="chartLib === 'eCharts'"
      :id="'chart' + id"
      :option="option"
      autoresize
      style="height: 400px"
    />

    <apexchart
      v-if="chartLib === 'apexCharts'"
      :id="'chart' + id"
      :key="option.length"
      :options="option"
      :series="option.series"
    ></apexchart>

    <canvas v-if="chartLib === 'chartjs'" :id="'chart' + id" ref="canvas" height="400"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
export default {
  props: {
    id: Number,
    chartLib: String,
    option: Object
  },
  watch: {
    option: {
      handler(newOption) {
        if (this.ctx) {
          this.ctx.data = newOption.data
          this.ctx.options = newOption.options
          this.ctx.update()
        }
      }
    }
  },
  data() {
    return {
      ctx: null
    }
  },
  mounted() {
    this.initializeChart()
  },
  methods: {
    initializeChart() {
      const canvas = this.$refs.canvas
      if (this.chartLib === 'chartjs') {
        this.ctx = new Chart(canvas, this.option)
      }
    }
  }
}
</script>
