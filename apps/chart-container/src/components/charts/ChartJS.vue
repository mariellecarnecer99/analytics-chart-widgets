<template>
  <canvas :id="'chart' + id" ref="canvas" class="mt-8"></canvas>
</template>

<script>
import Chart from 'chart.js/auto'
export default {
  name: 'ChartJS',
  props: {
    id: Number,
    option: Object
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
      ctx: null
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
