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
            <v-btn icon dark @click="previewDialog = !previewDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <grid-layout
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
                :desc="description"
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

  <v-navigation-drawer color="rgba(71,181,155)" class="bg-grey-lighten-2" rail app>
    <v-list color="rgba(70,60,110)" dense nav>
      <v-list-item
        v-for="(item, index) in sideMenuItems"
        :key="index"
        @click="onClickDrawer(index)"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.value"
      >
        <v-tooltip activator="parent" location="right">
          {{ item.title }}
        </v-tooltip>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer v-model="drawer" color="rgba(211,220,230,1)" app width="300">
    <div id="sidebar">
      <div class="d-flex justify-end sidebar-toggle mx-4 mt-3">
        <div class="" @click="drawer = !drawer" id="btn-toggle">
          <v-icon id="btn-toggle-icon" x-large>mdi-close</v-icon>
        </div>
      </div>
      <div class="sidebar-body">
        <div class="chartType">
          <h3 class="chartType-title mb-4 ml-6">Charts</h3>
          <v-select
            v-model="selectedChartLibrary"
            :items="chartLibraries"
            label="Select Charting Libraries"
            variant="outlined"
            class="mx-6"
            item-title="type"
            item-value="value"
            density="compact"
          >
          </v-select>
          <div v-if="selectedChartLibrary" class="chartType">
            <!-- <h4 class="mb-4 ml-6">Simple</h4> -->
            <v-row class="mb-6" no-gutters>
              <v-col cols="3" v-for="item in charts" class="mb-5 d-flex justify-center">
                <img
                  :src="item.img"
                  style="width: 25px; height: 25px"
                  @click="selectedChart(item)"
                />
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>

  <v-navigation-drawer v-model="controlsDrawer" color="rgba(211,220,230,1)" app width="300">
    <div id="sidebar">
      <div class="d-flex justify-end sidebar-toggle mx-4 mt-3">
        <div class="mb-2" @click="controlsDrawer = !controlsDrawer" id="btn-toggle">
          <v-icon id="btn-toggle-icon" x-large>mdi-close</v-icon>
        </div>
      </div>
      <div class="sidebar-body">
        <div class="data mx-5 mb-4">
          <h3 class="data-title mb-3">Controls</h3>
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
        </div>
      </div>
    </div>
  </v-navigation-drawer>

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
import { useSelectedChart } from '../../stores/fetchSelectedChart'
import { storeToRefs } from 'pinia'
const store = useSelectedChart()
const { fetchChartOptions, title, desc } = storeToRefs(store)
const getChartOptions = fetchChartOptions
const getChartTitle = title
const getChartDesc = desc
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
      description: null,
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
          name: 'Chart Title',
          value: 'title',
          icon: 'mdi-text-recognition'
        },
        {
          name: 'Chart Description',
          value: 'description',
          icon: 'mdi-text-recognition'
        }
      ],
      previewDialog: false,
      widgets: [],
      options: getChartOptions,
      modifiedOptions: [],
      embedAll: false,
      title: getChartTitle,
      desc: getChartDesc,
      chartTitle: null,
      chartDesc: null
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
    ],
    desc: [
      {
        handler: 'handleChartDesc'
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

    handleChartDesc(data) {
      this.chartDesc = data
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
        w: this.selectedControl === 'daterange' ? 2 : 2,
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
          description: this.chartDesc,
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
          description: this.desc,
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
          this.description = response.data.description
        })
        .catch(() => {})
        .finally()
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
