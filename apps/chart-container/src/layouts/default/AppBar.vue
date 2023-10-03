<template>
  <v-app-bar color="rgba(233, 73, 93)" class="flex-grow-0" dark>
    <v-app-bar-title @click="$router.push({ path: '/' })" class="cursor">
      <v-icon icon="mdi-chart-box" color="white" />
      <span v-if="$route.params?.id" class="ml-2" style="color: #ffffff">Edit Report</span>
      <span v-else class="ml-2" style="color: #ffffff">Add Report</span>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <p v-if="mainTitle" style="color: white">
      {{ mainTitle }}
      <v-icon size="small" color="white">mdi-pencil</v-icon>
    </p>
    <v-spacer></v-spacer>
    <v-btn
      v-if="$route.params?.id"
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
      :disabled="widgets.length ? false : true"
      @click="previewDialog = !previewDialog"
      >Preview Changes</v-btn
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
            :model-value="`<chart-widget id='${$route.params?.id}'></chart-widget>`"
            id="tocopy"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyText"
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="previewDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-text>
          <v-toolbar height="20" color="white">
            <v-spacer></v-spacer>
            <v-icon class="mr-1" @click="handleDownloadChart">mdi-download</v-icon>
            <v-icon @click="previewDialog = !previewDialog">mdi-close</v-icon>
          </v-toolbar>
          <grid-layout
            id="to_save"
            :layout="widgets"
            :col-num="12"
            :is-draggable="false"
            :is-resizable="false"
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
                :preview="previewDialog"
                :chartTitle="mainTitle"
                :widgets="item"
                :selectedWidgets="widgets"
                :chartData="item.data"
              />
            </grid-item>
          </grid-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-btn
      variant="flat"
      size="small"
      color="primary"
      :disabled="widgets.length ? false : true"
      @click="handleSaveChanges"
      >Save Changes</v-btn
    >
  </v-app-bar>

  <v-app-bar color="gray" dark fixed>
    <v-menu transition="slide-x-transition" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="outlined" class="text-capitalize ma-3">
          <v-icon size="large" class="mx-1">mdi-chart-box-plus-outline</v-icon> Add a chart
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card width="300px">
          <v-card-text class="pa-6">
            <v-select
              v-model="selectedChartLibrary"
              :items="chartLibraries"
              label="Select Charting Libraries"
              variant="outlined"
              class="mt-3"
              item-title="type"
              item-value="value"
              density="compact"
            >
            </v-select>
            <div v-if="selectedChartLibrary" class="chartType">
              <v-row class="mb-6" no-gutters>
                <v-col cols="3" v-for="item in charts" class="mb-5 d-flex justify-center">
                  <img
                    :src="item.img"
                    style="width: 25px; height: 25px"
                    @click="selectedChart(item), (isActive.value = !isActive.value)"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-menu>

    <v-menu transition="slide-x-transition">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="outlined" class="text-capitalize ml-0">
          <v-icon size="large" class="mx-1">mdi-filter-variant-plus</v-icon> Add a control
        </v-btn>
      </template>

      <v-card width="250px">
        <v-card-text>
          <v-row v-for="i in controls" class="mt-0">
            <v-col>
              <v-card
                v-model="selectedControl"
                @click="controlSelected(i.value)"
                variant="outlined"
                class="py-2 px-2"
              >
                <v-icon>{{ i.icon }}</v-icon> {{ i.name }}
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>
  <v-main>
    <ChartContainer :widgets="widgets" />
  </v-main>
</template>

<script>
import ChartData from '../../components/charts/ChartData.vue'
import line from '@/assets/line.png'
import bar from '@/assets/bar.png'
import pie from '@/assets/pie.png'
import scatter from '@/assets/scatter.png'
import table from '@/assets/table.png'
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import { useSelectedChart } from '../../stores/fetchSelectedChart'
import { storeToRefs } from 'pinia'
const store = useSelectedChart()
const { fetchChartOptions, title } = storeToRefs(store)
const getChartOptions = fetchChartOptions
const getChartTitle = title
import { getReport, addReport, updateReport } from '../../../../dashboard/src/services/reports'
export default {
  name: 'AppBar',
  components: {
    ChartData
  },
  data: () => {
    return {
      drawer: false,
      controlsDrawer: false,
      tab: null,
      chartType: null,
      chartDataType: null,
      dialog: false,
      mainTitle: null,
      layout: [],
      index: 0,
      selectedChartLibrary: null,
      selectedControl: null,
      sideMenuItems: [
        {
          title: 'Chart & Data',
          value: 'chartData',
          icon: 'mdi-chart-box-outline'
        },
        {
          title: 'Controls',
          value: 'controls',
          icon: 'mdi-filter-variant-plus'
        },
        { title: 'Analytics', value: 'analytics', icon: 'mdi-chart-bar' }
      ],
      charts: [
        {
          type: 'Line Chart',
          value: 'line',
          img: line
        },
        {
          type: 'Bar Chart',
          value: 'bar',
          img: bar
        },
        {
          type: 'Pie Chart',
          value: 'pie',
          img: pie
        },
        {
          type: 'Scatter Chart',
          value: 'scatter',
          img: scatter
        },
        {
          type: 'Table Chart',
          value: 'table',
          img: table
        }
      ],
      chartData: [
        {
          dataType: 'Static Data',
          value: 'static'
        },
        {
          dataType: 'Remote Data(From a URL)',
          value: 'remote'
        }
      ],
      chartLibraries: [
        // {
        //   type: "JSCharting",
        //   value: "jsCharting",
        // },
        {
          type: 'ApexCharts',
          value: 'apexCharts'
        },
        // {
        //   type: "Google Charts",
        //   value: "googlecharts",
        // },
        {
          type: 'Apache ECharts',
          value: 'eCharts'
        },
        {
          type: 'Chart.js',
          value: 'chartjs'
        }
        // {
        //   type: "amCharts",
        //   value: "amCharts",
        // },
      ],
      controls: [
        {
          name: 'Date range control',
          value: 'daterange',
          icon: 'mdi-calendar-range'
        },
        {
          name: 'Text',
          value: 'text',
          icon: 'mdi-text-recognition'
        }
      ],
      previewDialog: false,
      widgets: [],
      options: getChartOptions,
      modifiedOptions: [],
      embedAll: false,
      title: getChartTitle,
      chartTitle: null
    }
  },
  watch: {
    options: [
      {
        handler: 'getOptions'
      }
    ],
    title: [
      {
        handler: 'handleChartTitle'
      }
    ]
  },
  mounted() {
    if (this.$route.params.id) {
      this.handleGetReportsById(this.$route.params.id)
    } else {
      const item = {
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        i: this.widgets.length,
        selectedControl: 'title'
      }
      this.widgets.push(item)
    }
  },
  methods: {
    handleChartTitle(data) {
      this.chartTitle = data
    },

    copyText() {
      const input = document.getElementById('tocopy')
      input.select()
      document.execCommand('copy')
    },

    getOptions(data) {
      this.modifiedOptions = data
    },

    onClickDrawer(val) {
      this.drawer = val === 0
      this.controlsDrawer = val === 1
    },

    controlSelected(e) {
      this.selectedControl = e
      const item = {
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        i: this.widgets.length,
        selectedControl: this.selectedControl
      }
      this.widgets.push(item)
    },

    selectedChart(val) {
      const item = {
        x: 0,
        y: 0,
        w: 6,
        h: 3,
        i: this.widgets.length,
        chart: val,
        selectedLib: this.selectedChartLibrary
      }
      this.widgets.push(item)
    },

    handleSaveChanges() {
      if (!this.$route.params.id) {
        addReport({
          name: this.chartTitle,
          widgetCount: this.widgets.length,
          widgets: this.widgets
        })
          .then((response) => {
            this.$router.push({ path: '/' })
          })
          .catch(() => {})
          .finally()
      } else {
        const indexToModify = this.widgets.findIndex((item) => item.i === this.modifiedOptions.i)
        if (indexToModify !== -1) {
          this.widgets[indexToModify] = this.modifiedOptions
        } else {
          console.log('Object with index not found in the array.')
        }
        updateReport(this.$route.params.id, {
          name: this.title,
          widgetCount: this.widgets.length,
          widgets: this.widgets
        })
          .then((response) => {
            this.$router.push({ path: '/' })
          })
          .catch(() => {})
          .finally()
      }
    },

    handleGetReportsById(id) {
      getReport(id)
        .then((response) => {
          this.widgets.push(...response.data.widgets)
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
    }
  }
}
</script>
<style scoped>
/* .layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  border: 1px solid black;
  padding: 65px 0 35px 0;
} */

.vue-grid-item.resizing {
  opacity: 0.9;
}

.cursor {
  cursor: pointer;
}
</style>
