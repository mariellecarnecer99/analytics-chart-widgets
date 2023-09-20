<template>
  <div>
    <grid-layout
      :layout="widgets"
      :col-num="12"
      :row-height="100"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :auto-size="true"
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
        @click="handleSelectedChart(item.i)"
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
  <v-navigation-drawer v-model="drawer" temporary location="right" :width="500">
    <v-list-item
      prepend-icon="mdi-database-outline"
      title="Data & Properties"
      class="my-2"
    ></v-list-item>

    <v-divider></v-divider>

    <v-tabs v-model="tab" fixed-tabs color="primary">
      <v-tab value="setup"> Setup </v-tab>
      <v-tab value="style"> Style </v-tab>
    </v-tabs>

    <v-container fluid>
      <v-window v-model="tab">
        <v-window-item value="setup">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div>
                  <v-icon color="primary" size="large">mdi-chart-box-outline</v-icon>
                  <span class="ml-2">Chart</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-row>
            <v-col>
              <p class="mt-5 mb-2">Orientation</p>
              <v-tabs
                v-model="selectedOrientation"
                fixed-tabs
                active-class="active-tab white--text"
              >
                <v-tab
                  v-for="item in chartOrientation"
                  :key="item.value"
                  :value="item.value"
                  :border="true"
                  color="primary"
                  density="comfortable"
                >
                  {{ item.type }}
                </v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col>
              <p class="mb-2">Date control filter</p>
              <VueDatePicker
                v-model="dateControl"
                placeholder="Select Date"
                format="MM/dd/yyyy"
                range
                menu-class-name="dp-custom-menu"
                teleport-center
              />
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col>
              <p class="mb-2">Data Source</p>
              <v-row>
                <v-col>
                  <v-btn variant="outlined" color="primary" class="uploadData" :loading="isLoading"
                    ><v-icon>mdi-upload</v-icon> Upload Data</v-btn
                  >
                  <input ref="uploadedFile" class="d-none" type="file" accept=".csv" />
                </v-col>
              </v-row>
              <v-row class="my-0">
                <v-col class="pt-2 pb-0">
                  <v-btn variant="text" color="primary" :loading="isSelecting"
                    ><v-icon size="large">mdi-plus-circle-outline</v-icon>
                    <span class="ml-2">Blend Data</span></v-btn
                  >
                  <input ref="uploader" class="d-none" type="file" accept=".csv" />
                </v-col>
              </v-row>
              <v-row class="my-0">
                <v-col class="pt-2 pb-0">
                  <v-text-field
                    v-model="selectedApi"
                    label="Service URL"
                    variant="outlined"
                    density="compact"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="my-0">
                <v-col class="pt-2 pb-0">
                  <p class="mb-2">JSON Editor</p>
                  <Vue3JsonEditor v-model="chartsConfig" :expandedOnStart="true" mode="code" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col>
              <p class="mb-2">
                Preview Chart
                <span
                  ><v-btn class="ml-3" size="small" color="primary"
                    ><v-icon class="mr-1">mdi-download-outline</v-icon>Download</v-btn
                  >
                </span>
              </p>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col>
              <p class="mb-2">Insert code into website</p>
              <v-textarea
                model-value="<chart-widget id='${chartId}'></chart-widget>"
                id="tocopy"
                variant="outlined"
                density="compact"
                auto-grow
                append-inner-icon="mdi-content-copy"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="style">
          <v-row>
            <v-col>
              <h4 class="mb-3">Defaults</h4>
              <v-row justify="start">
                <v-col cols="6">
                  <p class="pb-3">Plot Background</p>
                  <v-text-field
                    v-model="gridColor"
                    hide-details
                    class="ma-0 pa-0"
                    variant="outlined"
                    density="compact"
                  >
                    <template v-slot:append-inner>
                      <v-menu
                        v-model="gridColorMenu"
                        location="end"
                        nudge-bottom="105"
                        nudge-left="16"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ props }">
                          <div
                            v-bind="props"
                            :style="{
                              backgroundColor: getGridColor,
                              cursor: 'pointer',
                              width: '30px',
                              height: '30px',
                              borderRadius: gridColorMenu ? '50%' : '4px',
                              transition: 'border-radius 200ms ease-in-out'
                            }"
                          ></div>
                        </template>
                        <v-card>
                          <v-card-text class="pa-0">
                            <v-color-picker v-model="gridColor" flat></v-color-picker>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="6">
                  <p class="pb-3">Font Type</p>
                  <v-select
                    v-model="fontType"
                    :items="fonts"
                    label="Select ..."
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row class="my-0">
                <v-col cols="6">
                  <p class="pb-3">Font Size</p>
                  <v-text-field
                    v-model="fontSize"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <p class="pb-3">Font Color</p>
                  <v-text-field
                    v-model="labelColor"
                    hide-details
                    class="ma-0 pa-0"
                    variant="outlined"
                    density="compact"
                  >
                    <template v-slot:append-inner>
                      <v-menu
                        v-model="menuLabelColor"
                        location="end"
                        nudge-bottom="105"
                        nudge-left="16"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ props }">
                          <div
                            v-bind="props"
                            :style="{
                              backgroundColor: labelColor,
                              cursor: 'pointer',
                              width: '30px',
                              height: '30px',
                              borderRadius: menuLabelColor ? '50%' : '4px',
                              transition: 'border-radius 200ms ease-in-out'
                            }"
                          ></div>
                        </template>
                        <v-card>
                          <v-card-text class="pa-0">
                            <v-color-picker v-model="labelColor" flat></v-color-picker>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <h4 class="mb-3">Title</h4>
              <v-row justify="start">
                <v-col cols="6">
                  <p class="pb-3">Plot Title</p>
                  <v-text-field
                    v-model="mainTitle"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <p class="pb-3">Font Type</p>
                  <v-select
                    v-model="titleFontType"
                    :items="fonts"
                    label="Select ..."
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row class="my-0">
                <v-col cols="6">
                  <p class="pb-3">Font Size</p>
                  <v-text-field
                    v-model="titleFontSize"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <p class="pb-3">Font Color</p>
                  <v-text-field
                    v-model="titleColor"
                    hide-details
                    class="ma-0 pa-0"
                    variant="outlined"
                    density="compact"
                  >
                    <template v-slot:append-inner>
                      <v-menu
                        v-model="menuTitleColor"
                        location="end"
                        nudge-bottom="105"
                        nudge-left="16"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ props }">
                          <div
                            v-bind="props"
                            :style="{
                              backgroundColor: titleColor,
                              cursor: 'pointer',
                              width: '30px',
                              height: '30px',
                              borderRadius: menuTitleColor ? '50%' : '4px',
                              transition: 'border-radius 200ms ease-in-out'
                            }"
                          ></div>
                        </template>
                        <v-card>
                          <v-card-text class="pa-0">
                            <v-color-picker v-model="titleColor" flat></v-color-picker>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <h4 class="mb-3">Visibility</h4>
              <v-row column>
                <v-col cols="3">
                  <p class="py-4">Plot Title</p>
                </v-col>
                <v-col cols="3">
                  <v-switch v-model="titleSwitch"></v-switch>
                </v-col>

                <v-col cols="3">
                  <p class="py-4">Grid Lines</p>
                </v-col>
                <v-col cols="3">
                  <v-switch v-model="gridLinesSwitch"></v-switch>
                </v-col>

                <v-col cols="3">
                  <p class="py-4">Tick Labels</p>
                </v-col>
                <v-col>
                  <v-switch v-model="tickLabelsSwitch"></v-switch>
                </v-col>

                <v-col cols="3">
                  <p class="py-4">Tick Markers</p>
                </v-col>
                <v-col>
                  <v-switch v-model="tickMarkersSwitch"></v-switch>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import ChartData from './components/charts/ChartData.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { getReport } from '../../dashboard/src/services/reports'
import { Vue3JsonEditor } from 'vue3-json-editor'
export default {
  components: {
    ChartData,
    VueDatePicker,
    Vue3JsonEditor
  },
  inject: ['eventBus'],
  data: () => {
    return {
      title: null,
      description: null,
      drawer: false,
      tab: null,
      chartOrientation: [
        {
          type: 'Vertical',
          value: 'vertical'
        },
        {
          type: 'Horizontal',
          value: 'horizontal'
        }
      ],
      selectedOrientation: null,
      dateControl: [],
      selectedApi: null,
      isLoading: false,
      isSelecting: false,
      chartsConfig: null,
      gridColor: '#ccc',
      gridColorMenu: false,
      fonts: ['sans-serif', 'serif', 'monospace', 'Arial', 'Courier New', 'Helvetica'],
      fontType: 'sans-serif',
      fontSize: 12,
      labelColor: '#333',
      menuLabelColor: false,
      mainTitle: 'My Chart',
      titleFontType: 'sans-serif',
      titleFontSize: 18,
      titleColor: '#333',
      menuTitleColor: false,
      titleSwitch: false,
      gridLinesSwitch: false,
      tickLabelsSwitch: true,
      tickMarkersSwitch: false
    }
  },
  props: {
    widgets: Array
  },
  computed: {
    getGridColor() {
      const { gridColor } = this
      return gridColor
    }
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
      getReport(e)
        .then((response) => {
          this.title = response.data.name
          this.description = response.data.description
        })
        .catch(() => {})
        .finally()
    },

    handleSelectedChart(id) {
      if (id) {
        this.drawer = true
      }
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

.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
}

.uploadData {
  border: 1px dashed;
  width: inherit;
}
</style>
