<template>
  <v-app>
    <v-app-bar color="rgba(233, 73, 93)" class="flex-grow-0" dark>
      <p class="ml-3">{{ mainTitle }}</p>
      <v-spacer></v-spacer>
      <v-btn
        class="mr-3"
        variant="outlined"
        size="small"
        color="primary"
        @click="$router.push({ path: '/report', query: { id: $route.query?.id } })"
        >Edit</v-btn
      >
    </v-app-bar>
    <v-main>
      <grid-layout
        id="to_save"
        :layout="chartWidgets"
        :col-num="12"
        :is-draggable="false"
        :is-resizable="false"
        :vertical-compact="true"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="item in chartWidgets"
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
            :selectedChartsLength="chartWidgets.length"
            :widgets="item"
            :selectedWidgets="chartWidgets"
            :chartData="item.data"
          />
        </grid-item>
      </grid-layout>
    </v-main>
  </v-app>
</template>

<script>
import { getReport } from '../../../dashboard/src/services/reports'
import ChartData from './charts/ChartData.vue'
import { useSelectedChart } from '../stores/fetchSelectedChart'
import { storeToRefs } from 'pinia'

const store = useSelectedChart()
const { widgets } = storeToRefs(store)
const getWidgets = widgets
export default {
  components: {
    ChartData
  },
  data: () => {
    return {
      chartWidgets: getWidgets,
      mainTitle: null
    }
  },
  mounted() {
    this.handleGetReportsById(this.$route.query.id)
  },
  methods: {
    handleGetReportsById(id) {
      getReport(id)
        .then((response) => {
          //   this.widgets.push(...response.data.widgets)
          this.mainTitle = response.data.name
        })
        .catch(() => {})
        .finally()
    }
  }
}
</script>
