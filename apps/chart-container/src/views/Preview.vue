<template>
  <grid-layout
    :layout="chartsData"
    :col-num="12"
    :is-draggable="false"
    :is-resizable="false"
    :vertical-compact="true"
    :use-css-transforms="true"
  >
    <grid-item
      v-for="item in chartsData"
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
        :selectedChartsLength="chartsData.length"
        :widgets="item"
        :selectedWidgets="chartsData"
        :chartData="item.data"
      />
    </grid-item>
  </grid-layout>
</template>

<script>
import ChartData from '../components/charts/ChartData.vue'
import { useSelectedChart } from '../stores/fetchSelectedChart'
import { storeToRefs } from 'pinia'
const store = useSelectedChart()
const { title, desc, widgets } = storeToRefs(store)
const getWidgets = widgets
// const getTitle = title
// const getDesc = desc
export default {
  components: {
    ChartData
  },
  data: () => {
    return {
      chartsData: getWidgets,
      // chartTitle: getTitle,
      // chartDesc: getDesc,
      disabled: false
    }
  }
}
</script>
