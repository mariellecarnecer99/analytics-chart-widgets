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
        @click="embedAll = !embedAll"
        >Embed</v-btn
      >
      <v-btn
        class="mr-3"
        variant="outlined"
        size="small"
        color="primary"
        @click="handleDownloadChart"
        >Download Report</v-btn
      >
      <v-btn
        class="mr-3"
        variant="outlined"
        size="small"
        color="primary"
        @click="$router.push({ path: '/report', query: { id: $route.query?.id } })"
        >Edit</v-btn
      >
      <v-dialog v-model="embedAll" width="500px">
        <v-card>
          <v-card-text>
            <v-row justify="space-between">
              <v-col cols="8">
                <v-sheet class="my-2"><h3>Add report to your website</h3> </v-sheet>
              </v-col>
              <v-col cols="1">
                <v-sheet class="my-2"
                  ><v-icon @click="embedAll = !embedAll">mdi-close</v-icon></v-sheet
                >
              </v-col>
            </v-row>
            <v-textarea
              :model-value="`<chart-widget id='${$route.query?.id}'></chart-widget>`"
              id="tocopy"
              variant="outlined"
              density="compact"
              append-inner-icon="mdi-content-copy"
              @click:append-inner="copyText"
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-dialog>
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
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
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
      mainTitle: null,
      embedAll: false
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
    },

    handleDownloadChart() {
      html2canvas(document.querySelector('#to_save')).then((canvas) => {
        canvas.toBlob(function (blob) {
          window.saveAs(blob, 'my-report.jpg')
        })
      })
    },

    copyText() {
      const input = document.getElementById('tocopy')
      input.select()
      document.execCommand('copy')
    }
  }
}
</script>
