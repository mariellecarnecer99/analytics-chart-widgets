<template>
  <div>
    <grid-layout
      :layout="widgets"
      :col-num="12"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in widgets"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <ChartData
          :chartType="item.chart?.value"
          :chartLib="item.selectedLib"
          :chartId="item.i"
          :control="item.selectedControl"
          :selectedChartsLength="widgets.length"
          :chartTitle="title"
          :desc="description"
          :widgets="item"
          :selectedWidgets="widgets"
          :chartData="item.data"
        />
        <span class="remove" @click="removeItem(item.i)"
          ><v-icon size="small">mdi-close</v-icon></span
        >
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import ChartData from './components/charts/ChartData.vue'
import axios from 'axios'
export default {
  components: {
    ChartData
  },
  inject: ['eventBus'],
  data: () => {
    return {
      title: null,
      description: null
    }
  },
  props: {
    widgets: Array
  },
  mounted() {
    if (this.$route.params.id) {
      this.handleGetReportsById(this.$route.params.id)
    }
  },
  methods: {
    removeItem(i) {
      const index = this.widgets.map((item) => item.i).indexOf(i)
      this.widgets.splice(index, 1)
      this.widgets.forEach((item, index) => {
        item.i = index
      })
    },

    handleGetReportsById(e) {
      axios
        .get(`https://retoolapi.dev/4RV8By/reports/${e}`)
        .then((response) => {
          this.title = response.data.name
          this.description = response.data.description
        })
        .catch(() => {})
        .finally()
    }
  }
}
</script>

<style scoped>
.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  /* background: #ccc; */
  border: 1px solid black;
  padding: 65px 0 35px 0;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
}
</style>
