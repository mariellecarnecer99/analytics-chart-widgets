<template>
  <EChart v-if="chartLib === 'eCharts'" :option="options" :id="chartId" />
  <ApexCharts
    v-if="chartLib === 'apexCharts' && isDataReady === true"
    :option="apexOptions"
    :apexSeries="apexOptions.series"
    :id="chartId"
  />
  <ChartJS v-if="chartLib === 'chartjs'" :id="chartId" :option="datacollection" />
  <DateRange v-if="control === 'daterange'" />
  <v-text-field
    v-if="control === 'title'"
    v-model="title"
    class="px-5"
    label="Chart Title"
    variant="outlined"
    density="compact"
    @input="handleChangedTitle"
  ></v-text-field>
  <v-text-field
    v-if="control === 'description'"
    v-model="description"
    class="px-5"
    label="Chart Description"
    variant="outlined"
    density="compact"
    @input="handleChangedDesc"
  ></v-text-field>
  <div v-if="!control && !preview" class="custom-toolbox">
    <v-icon color="#676767" @click="editDialog = !editDialog">mdi-pencil-outline</v-icon>
    <v-icon color="#676767" @click="jsonConfigDialog = !jsonConfigDialog">mdi-code-json</v-icon>
    <v-icon color="#676767" @click="appearanceDialog = !appearanceDialog">mdi-palette</v-icon>
    <v-icon color="#676767" @click="handleChartDom(chartId)">mdi-download-outline</v-icon>
    <v-icon color="#676767" @click="embedDialog = !embedDialog">mdi-import</v-icon>
    <v-icon color="#676767" @click="previewDialog = !previewDialog">mdi-eye</v-icon>
  </div>
  <div class="toolbox-dialog">
    <v-dialog v-model="editDialog" width="750px" style="z-index: 0">
      <v-card>
        <v-card-text>
          <v-row justify="space-between">
            <v-col>
              <v-sheet class="my-2"><h3>Structure</h3></v-sheet>
            </v-col>
            <v-col cols="1">
              <v-sheet class="my-2 ml-4"
                ><v-icon @click="editDialog = !editDialog">mdi-close</v-icon></v-sheet
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-container>
            <v-row>
              <v-col cols="4">
                <p class="mb-3">Type</p>
                <v-dialog transition="dialog-bottom-transition" width="auto">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="modifiedType"
                      placeholder="Select Chart"
                      hide-details
                      class="ma-0 pa-0"
                      variant="outlined"
                      density="compact"
                      v-bind="props"
                    ></v-text-field>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card>
                      <v-toolbar color="primary" title="Select Chart Type">
                        <v-spacer></v-spacer>
                        <v-icon class="mr-3" @click="isActive.value = !isActive.value"
                          >mdi-close</v-icon
                        >
                      </v-toolbar>
                      <v-card-text>
                        <div class="text-h2 pa-4">
                          <v-row no-gutters>
                            <v-col
                              v-for="item in charts"
                              class="mr-5 d-flex justify-center"
                              @click="isActive.value = !isActive.value"
                            >
                              <img
                                :src="item.img"
                                style="width: 40px; height: 40px"
                                @click="handleSelectedChart(item.value)"
                              />
                            </v-col>
                          </v-row>
                        </div>
                      </v-card-text>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>

              <v-col cols="5" v-if="chartType != 'pie' || modifiedType != 'pie'">
                <p class="mb-3">Orientation</p>
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
                    @click="handleGetOrientation(item.value)"
                  >
                    {{ item.type }}
                  </v-tab>
                </v-tabs>
              </v-col>

              <!-- <v-col cols="4">
                <p class="mb-3">X</p>
                <v-select
                  v-model="xAxisData"
                  :items="xCategories"
                  label="Choose data..."
                  variant="outlined"
                  density="compact"
                  @update:modelValue="selectedXaxisData"
                ></v-select>
              </v-col>

              <v-col cols="4">
                <p class="mb-3">Y</p>
                <v-select
                  v-model="yAxisData"
                  :items="yCategories"
                  label="Choose data..."
                  variant="outlined"
                  density="compact"
                  @update:modelValue="selectedYaxisData"
                ></v-select>
              </v-col> -->
            </v-row>

            <p class="mt-5 mb-3">Data source</p>
            <v-row justify="end">
              <v-col>
                <v-btn
                  class="mr-3"
                  color="primary"
                  size="large"
                  :loading="isLoading"
                  @click="handleUploadedFile"
                  ><v-icon>mdi-upload</v-icon> Upload Data</v-btn
                >

                <!-- Create a File Input that will be hidden but triggered with JavaScript -->
                <input
                  ref="uploadedFile"
                  class="d-none"
                  type="file"
                  accept="application/json,.csv"
                  @change="onUploadChange"
                />
                <!-- <v-btn
                  class="mr-3"
                  color="primary"
                  @click="handleNumberOfSeries"
                  ><v-icon>mdi-plus</v-icon> Add Series</v-btn
                > -->
                <v-btn color="primary" size="large" :loading="isSelecting" @click="handleFileImport"
                  ><v-icon>mdi-plus</v-icon> Blend Data</v-btn
                >

                <!-- Create a File Input that will be hidden but triggered with JavaScript -->
                <input
                  ref="uploader"
                  class="d-none"
                  type="file"
                  accept="application/json,.csv"
                  @change="onFileChanged"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="selectedApi"
                  label="Service URL"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:modelValue="getApiData"
                ></v-text-field>
              </v-col>
            </v-row>

            <div v-if="uploadedFile" class="concept-type">
              <v-divider class="mt-5"></v-divider>
              <div class="mt-4">
                <p class="mb-3">Dimension</p>
                <v-select
                  v-model="defaultCategory"
                  :items="dimensions"
                  item-title="type"
                  item-value="value"
                  return-object
                  density="compact"
                  variant="outlined"
                  @update:modelValue="selectedDimension"
                >
                  <template v-slot:prepend>
                    <v-icon v-on:click="dimensionMenu = !dimensionMenu">mdi-pencil</v-icon>
                    <v-dialog
                      v-model="dimensionMenu"
                      transition="dialog-bottom-transition"
                      width="450px"
                      style="z-index: 0"
                    >
                      <v-card>
                        <v-toolbar
                          color="primary"
                          :title="newCatName ? newCatName : defaultCategory"
                        ></v-toolbar>
                        <v-card-text>
                          <v-text-field
                            v-model="newCatName"
                            label="Name"
                            variant="outlined"
                            density="compact"
                            class="mt-3"
                          ></v-text-field>
                          <i v-if="newCatName" class="mt-0">Source field: {{ defaultCategory }}</i>
                          <v-select
                            v-model="dimensionsemanticType"
                            :items="semanticTypes"
                            item-title="type"
                            item-value="value"
                            return-object
                            label="Type"
                            density="compact"
                            variant="outlined"
                            @update:modelValue="getSemanticType"
                          >
                          </v-select>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </template>
                </v-select>
              </div>

              <v-divider class="mt-5"></v-divider>
              <div class="mt-4">
                <p class="mb-3">Metric</p>
                <v-select
                  v-model="defaultMetric"
                  :items="dimensions"
                  item-title="type"
                  item-value="value"
                  return-object
                  density="compact"
                  variant="outlined"
                  @update:modelValue="selectedMetric"
                >
                  <template v-slot:prepend>
                    <v-icon v-on:click="metricMenu = !metricMenu">mdi-pencil</v-icon>
                    <v-dialog
                      v-model="metricMenu"
                      transition="dialog-bottom-transition"
                      width="450px"
                      style="z-index: 0"
                    >
                      <v-card>
                        <v-toolbar
                          color="primary"
                          :title="newMetricName ? newMetricName : defaultMetric"
                        ></v-toolbar>
                        <v-card-text>
                          <v-text-field
                            v-model="newMetricName"
                            label="Name"
                            variant="outlined"
                            density="compact"
                            class="mt-3"
                          ></v-text-field>
                          <i v-if="newMetricName" class="mt-0">Source field: {{ defaultMetric }}</i>

                          <p>Aggregation</p>
                          <v-checkbox v-model="aggregationType" label="Count"></v-checkbox>

                          <v-select
                            v-model="metricsemanticType"
                            :items="semanticTypes"
                            item-title="type"
                            item-value="value"
                            return-object
                            label="Type"
                            density="compact"
                            variant="outlined"
                            @update:modelValue="getSemanticType"
                          >
                          </v-select>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </template>
                </v-select>
              </div>
            </div>

            <!-- <v-table
              v-if="this.options.series.length != 0"
              fixed-header
              height="250px"
              class="mt-5"
            >
              <thead>
                <tr>
                  <th class="text-left">Series</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="this.options.series"
                  v-for="(item, index) in this.options.series"
                  :key="item"
                >
                  <td>
                    <v-row>
                      <v-col cols="8" class="mt-3">
                        <v-text-field
                          v-model="item.name"
                          :placeholder="'Series ' + (index + 1)"
                          variant="outlined"
                          density="compact"
                        >
                          <template v-slot:append-inner>
                            <v-menu
                              v-model="item.menu"
                              location="end"
                              nudge-bottom="105"
                              nudge-left="16"
                              :close-on-content-click="false"
                            >
                              <template v-slot:activator="{ props }">
                                <div
                                  v-bind="props"
                                  :style="{
                                    backgroundColor: item.color,
                                    cursor: 'pointer',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: item.menu ? '50%' : '4px',
                                    transition:
                                      'border-radius 200ms ease-in-out',
                                  }"
                                ></div>
                              </template>
                              <v-card>
                                <v-card-text class="pa-0">
                                  <v-color-picker
                                    v-model="item.color"
                                    flat
                                  ></v-color-picker>
                                </v-card-text>
                              </v-card>
                            </v-menu>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </td>
                  <td>
                    <v-dialog
                      transition="dialog-bottom-transition"
                      width="400px"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">mdi-pencil</v-icon>
                      </template>
                      <template v-slot:default="{ isActive }">
                        <v-card>
                          <v-toolbar color="primary" title="Chart Data">
                            <v-spacer></v-spacer>
                            <v-icon
                              class="mr-3"
                              @click="isActive.value = !isActive.value"
                              >mdi-close</v-icon
                            >
                          </v-toolbar>
                          <v-card-text>
                            <div v-for="(s, idx) in item.data">
                              <v-text-field
                                v-model="s.value"
                                variant="outlined"
                                density="compact"
                              >
                              </v-text-field>
                            </div>
                          </v-card-text>
                        </v-card>
                      </template>
                    </v-dialog>
                    <v-icon @click="deleteSeries(index)">mdi-delete</v-icon>
                  </td>
                </tr>
                <tr
                  v-if="this.apexSeries"
                  v-for="(item, index) in this.apexSeries"
                  :key="item"
                >
                  <td>
                    <v-row>
                      <v-col cols="8" class="mt-3">
                        <v-text-field
                          v-model="item.name"
                          :placeholder="'Series ' + (index + 1)"
                          variant="outlined"
                          density="compact"
                        >
                          <template v-slot:append-inner>
                            <v-menu
                              v-model="item.menu"
                              location="end"
                              nudge-bottom="105"
                              nudge-left="16"
                              :close-on-content-click="false"
                            >
                              <template v-slot:activator="{ props }">
                                <div
                                  v-bind="props"
                                  :style="{
                                    backgroundColor: item.color,
                                    cursor: 'pointer',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: item.menu ? '50%' : '4px',
                                    transition:
                                      'border-radius 200ms ease-in-out',
                                  }"
                                ></div>
                              </template>
                              <v-card>
                                <v-card-text class="pa-0">
                                  <v-color-picker
                                    v-model="item.color"
                                    flat
                                  ></v-color-picker>
                                </v-card-text>
                              </v-card>
                            </v-menu>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </td>
                  <td>
                    <v-dialog
                      transition="dialog-bottom-transition"
                      width="400px"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">mdi-pencil</v-icon>
                      </template>
                      <template v-slot:default="{ isActive }">
                        <v-card>
                          <v-toolbar color="primary" title="Chart Data">
                            <v-spacer></v-spacer>
                            <v-icon
                              class="mr-3"
                              @click="isActive.value = !isActive.value"
                              >mdi-close</v-icon
                            >
                          </v-toolbar>
                          <v-card-text>
                            <div v-for="(s, idx) in item.data">
                              <v-text-field
                                v-model="s[idx]"
                                variant="outlined"
                                density="compact"
                              >
                              </v-text-field>
                            </div>
                          </v-card-text>
                        </v-card>
                      </template>
                    </v-dialog>
                    <v-icon @click="deleteSeries(index)">mdi-delete</v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table> -->
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="jsonConfigDialog" width="750px" style="z-index: 0">
      <v-card>
        <v-card-text>
          <v-row justify="space-between">
            <v-col>
              <v-sheet class="my-2"><h3>JSON Editor</h3></v-sheet>
            </v-col>
            <v-col cols="1">
              <v-sheet class="my-2 ml-4"
                ><v-icon @click="jsonConfigDialog = !jsonConfigDialog">mdi-close</v-icon></v-sheet
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-container>
            <Vue3JsonEditor
              v-model="chartsConfig"
              :show-btns="true"
              :expandedOnStart="true"
              mode="code"
              @json-save="onJsonSave"
            />
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="appearanceDialog" width="750px" style="z-index: 0">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col>
              <v-sheet class="my-2"><h3>Style</h3></v-sheet>
            </v-col>
            <v-col cols="1">
              <v-sheet class="my-2 ml-3"
                ><v-icon @click="appearanceDialog = !appearanceDialog">mdi-close</v-icon></v-sheet
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-container>
            <h4 class="my-5">Defaults</h4>
            <v-row justify="start">
              <v-col cols="3">
                <p class="pa-3">Plot Background</p>
              </v-col>
              <v-col cols="3">
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

              <v-col cols="3">
                <p class="pa-3 ml-10">Font Type</p>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="fontType"
                  :items="fonts"
                  label="Select ..."
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <p class="pa-3">Font Size</p>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="fontSize"
                  type="number"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <p class="pa-3 ml-10">Font Color</p>
              </v-col>
              <v-col cols="3">
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

            <h4 class="my-5">Title</h4>
            <v-row justify="start">
              <v-col cols="3">
                <p class="pa-3">Plot Title</p>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="mainTitle"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <p class="pa-3 ml-10">Font Type</p>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="titleFontType"
                  :items="fonts"
                  label="Select ..."
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <p class="pa-3">Font Size</p>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="titleFontSize"
                  type="number"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <p class="pa-3 ml-10">Font Color</p>
              </v-col>
              <v-col cols="3">
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

            <h4 class="my-5">Visibility</h4>
            <v-row column>
              <v-col cols="">
                <p class="pa-3">Plot Title</p>
              </v-col>
              <v-col>
                <v-switch v-model="titleSwitch"></v-switch>
              </v-col>

              <v-col>
                <p class="pa-3">Grid Lines</p>
              </v-col>
              <v-col>
                <v-switch v-model="gridLinesSwitch"></v-switch>
              </v-col>

              <v-col cols="">
                <p class="pa-3">Tick Labels</p>
              </v-col>
              <v-col>
                <v-switch v-model="tickLabelsSwitch"></v-switch>
              </v-col>

              <v-col cols="">
                <p class="pa-3">Tick Markers</p>
              </v-col>
              <v-col>
                <v-switch v-model="tickMarkersSwitch"></v-switch>
              </v-col>

              <!-- <v-col>
                <p class="pa-3">Tooltips</p>
              </v-col>
              <v-col>
                <v-switch v-model="toogleSwitch"></v-switch>
              </v-col>
              <v-col>
                <p class="pa-3">Legend</p>
              </v-col>
              <v-col>
                <v-switch v-model="toogleSwitch"></v-switch>
              </v-col> -->
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="embedDialog" width="500px" style="z-index: 0">
      <v-card>
        <v-card-text>
          <v-row justify="space-between">
            <v-col cols="8">
              <v-sheet class="my-2"><h3>Add widget to your website</h3> </v-sheet>
            </v-col>
            <v-col cols="1">
              <v-sheet class="my-2"
                ><v-icon @click="embedDialog = !embedDialog">mdi-close</v-icon></v-sheet
              >
            </v-col>
          </v-row>
          <v-textarea
            :model-value="`<chart-widget id='${chartId}'></chart-widget>`"
            id="tocopy"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyText"
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="previewDialog" width="750px" style="z-index: 0">
      <v-card>
        <v-card-text>
          <v-row justify="space-between">
            <v-col>
              <v-sheet class="my-2"><h3>Preview</h3> </v-sheet>
            </v-col>
            <v-col cols="1">
              <v-sheet class="my-2 ml-4"
                ><v-icon @click="previewDialog = !previewDialog">mdi-close</v-icon></v-sheet
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <PluggableWidget :chartLib="chartLib" :option="chartsConfig" :id="chartId" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EChart from './EChart.vue'
import ApexCharts from './ApexChart.vue'
import ChartJS from './ChartJS.vue'
import DateRange from '../controls/Daterange.vue'
import { useSelectedChart } from '../../stores/fetchSelectedChart'
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
import line from '@/assets/line.png'
import bar from '@/assets/bar.png'
import pie from '@/assets/pie.png'
import scatter from '@/assets/scatter.png'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
import axios from 'axios'
import { Vue3JsonEditor } from 'vue3-json-editor'
import { storeToRefs } from 'pinia'

const store = useSelectedChart()
const { selectedDates } = storeToRefs(store)
const datesSelected = selectedDates

export default {
  components: {
    EChart,
    ApexCharts,
    ChartJS,
    DateRange,
    VDatePicker,
    VueDatePicker,
    Vue3JsonEditor
  },
  props: {
    chartType: String,
    chartLib: String,
    chartId: Number,
    control: String,
    selectedChartsLength: Number,
    preview: Boolean,
    chartTitle: String,
    desc: String,
    widgets: Object,
    selectedWidgets: Array,
    chartData: Object
  },
  data: () => {
    return {
      options: null,
      apexOptions: null,
      apexSeries: [],
      datacollection: {},
      editDialog: false,
      embedDialog: false,
      appearanceDialog: false,
      jsonConfigDialog: false,
      previewDialog: false,
      menu: false,
      gridColorMenu: false,
      menuLabelColor: false,
      menuTitleColor: false,
      dateValue: null,
      datemenu: false,
      modifiedType: null,
      numofseries: 1,
      color: '#1976D2FF',
      gridColor: '#ccc',
      fontType: 'sans-serif',
      titleFontType: 'sans-serif',
      titleFontSize: 18,
      titlePosition: 'right',
      mainTitle: 'My Chart',
      xAxisData: [],
      titleSwitch: false,
      tickLabelsSwitch: true,
      tickMarkersSwitch: false,
      gridLinesSwitch: false,
      fontSize: 12,
      labelColor: '#333',
      titleColor: '#333',
      xCategories: ['Days', 'Number', 'Category', 'Time'],
      yAxisData: [],
      yCategories: ['Default', 'Days', 'Precipitation', 'Temperature', 'Category'],
      fonts: ['sans-serif', 'serif', 'monospace', 'Arial', 'Courier New', 'Helvetica'],
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
      start: null,
      end: null,
      seriesData: [],
      randomColor: null,
      seriesName: null,
      isSelecting: false,
      isLoading: false,
      selectedFile: null,
      uploadedFile: null,
      dataUpload: null,
      seriesUpload: null,
      selectedOrientation: null,
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
      isDataReady: false,
      dimensions: [],
      defaultCategory: null,
      defaultMetric: null,
      dimensionMenu: false,
      metricMenu: false,
      newCatName: null,
      newMetricName: null,
      // semanticTypes: [
      //   {
      //     type: "Numeric",
      //     value: "numeric",
      //   },
      //   {
      //     type: "Text",
      //     value: "text",
      //   },
      //   {
      //     type: "Date & Time",
      //     value: "datetime",
      //   },
      //   {
      //     type: "Boolean",
      //     value: "boolean",
      //   },
      //   {
      //     type: "Geo",
      //     value: "geo",
      //   },
      //   {
      //     type: "Currency",
      //     value: "currency",
      //   },
      //   {
      //     type: "URL",
      //     value: "url",
      //   },
      // ],
      semanticTypes: ['Text', 'Numeric'],
      uniqueValues: [],
      dimensionsemanticType: null,
      metricsemanticType: null,
      aggregationType: true,
      dates: [],
      datepickerModal: false,
      selectedDates: datesSelected,
      apiData: null,
      chartsConfig: null,
      selectedApi: null,
      title: null,
      description: null
    }
  },
  computed: {
    getGridColor() {
      const { gridColor } = this
      this.handleOptions()
      this.handleApexOptions()
      return gridColor
    }
  },
  watch: {
    selectedDates: [
      {
        handler: 'getDates'
      }
    ],
    chartTitle: {
      handler(newOption) {
        this.title = newOption
      }
    },
    desc: {
      handler(newOption) {
        this.description = newOption
      }
    }
  },
  mounted() {
    this.title = this.chartTitle
    this.description = this.desc
    // this.handleOptions()
    // this.handleApexOptions()
    // this.handleChartjsOptions()
    this.$nextTick(() => {
      window.dispatchEvent(new Event('resize'))
    })
    if (this.chartData) {
      this.handleGetReportsById(this.chartData)
    } else {
      this.handleOptions()
      this.handleApexOptions()
      this.handleChartjsOptions()
    }
  },
  methods: {
    handleGetReportsById(data) {
      this.handleOptions(data)
      this.handleApexOptions(data)
      this.handleChartjsOptions(data)
    },

    handleChangedTitle(event) {
      store.getChartTitle(event.target.value)
    },

    handleChangedDesc(event) {
      store.getChartDesc(event.target.value)
    },

    handleSelectedChart(val) {
      this.modifiedType = val
      this.handleOptions()
      this.handleApexOptions()
      this.handleChartjsOptions()
    },

    handleGetOrientation(val) {
      this.selectedOrientation = val
      this.handleOptions()
      this.handleApexOptions()
      this.handleChartjsOptions()
    },

    handleOptions(val) {
      this.options = {
        title: {
          text: this.titleSwitch === true ? this.mainTitle : null,
          left: 'center',
          textStyle: {
            fontSize: this.titleFontSize,
            fontFamily: this.titleFontType,
            color: this.titleColor
          }
        },
        grid: {
          backgroundColor: this.gridColor,
          show: this.gridLinesSwitch
        },
        tooltip: {},
        legend: {},
        xAxis: {
          type: this.selectedOrientation === 'horizontal' ? 'value' : 'category',
          // boundaryGap: false,
          show: this.chartType === 'pie' ? this.tickLabelsSwitch === false : this.tickLabelsSwitch,
          data:
            this.chartType === 'pie'
              ? null
              : this.selectedOrientation === 'horizontal'
              ? ''
              : this.dataUpload
              ? this.dataUpload
              : [
                  { value: 'Direct', label: 'Direct' },
                  { value: 'Email', label: 'Email' },
                  { value: 'Ad Networks', label: 'Ad Networks' },
                  { value: 'Video Ads', label: 'Video Ads' },
                  { value: 'Search Engines', label: 'Search Engines' }
                ],
          axisLabel: {
            fontSize: this.fontSize,
            color: this.labelColor,
            fontFamily: this.fontType,
            interval: 0,
            rotate: 25 //If the label names are too long you can manage this by rotating the label.
          },
          axisTick: {
            show: this.tickMarkersSwitch
          }
        },
        yAxis: {
          type: this.selectedOrientation === 'horizontal' ? 'category' : 'value',
          show: this.chartType === 'pie' ? this.tickLabelsSwitch === false : this.tickLabelsSwitch,
          data:
            this.chartType === 'pie'
              ? null
              : this.selectedOrientation === 'horizontal'
              ? this.dataUpload
                ? this.dataUpload
                : [
                    { value: 'Direct', label: 'Direct' },
                    { value: 'Email', label: 'Email' },
                    { value: 'Ad Networks', label: 'Ad Networks' },
                    { value: 'Video Ads', label: 'Video Ads' },
                    { value: 'Search Engines', label: 'Search Engines' }
                  ]
              : '',
          axisLabel: {
            fontSize: this.fontSize,
            color: this.labelColor,
            fontFamily: this.fontType
          },
          axisTick: {
            show: this.tickMarkersSwitch
          }
        },
        series: [
          {
            name: this.seriesName,
            color: this.chartType === 'pie' ? null : this.color,
            data:
              this.chartType === 'pie'
                ? [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                  ]
                : this.seriesUpload
                ? this.seriesUpload
                : [{ value: 120 }, { value: 200 }, { value: 150 }, { value: 80 }, { value: 70 }],
            type: this.modifiedType ? this.modifiedType : this.chartType
            // areaStyle: {}
          }
        ]
      }

      if (this.chartLib === 'eCharts') {
        this.chartsConfig = this.options
        this.handleChartUpdate(this.chartId, this.chartsConfig)
      }

      if (val) {
        this.options = val
        // this.options.series = val
      } else {
        return this.options
      }
    },

    handleApexOptions(val) {
      this.isDataReady = true
      this.apexOptions = {
        title: {
          text: this.titleSwitch === true ? this.mainTitle : null,
          align: 'center',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: this.titleFontSize,
            fontFamily: this.titleFontType,
            color: this.titleColor
          }
        },
        chart: {
          type: this.modifiedType ? this.modifiedType : this.chartType,
          background: this.gridLinesSwitch === true ? this.gridColor : '',
          // fontFamily: this.fontFamily,
          toolbar: {
            show: false
          }
        },
        noData: {
          text: 'No data to display',
          align: 'center',
          verticalAlign: 'middle',
          style: {
            color: '#000',
            fontSize: '22px',
            fontFamily: 'Arial'
          }
        },
        plotOptions: {
          bar: {
            horizontal: this.selectedOrientation === 'horizontal' ? true : false
          }
        },
        stroke: {
          curve: 'straight'
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: this.titleSwitch === true ? this.mainTitle : '',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.dataUpload
            ? this.dataUpload
            : ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
          labels: {
            style: {
              colors: this.labelColor,
              fontSize: this.fontSize
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: this.labelColor,
              fontSize: this.fontSize
            }
          }
        },
        labels: this.dataUpload
          ? this.dataUpload
          : ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
        series:
          this.chartType === 'pie'
            ? this.seriesUpload
              ? this.seriesUpload
              : [10, 41, 35, 51, 49]
            : [
                {
                  data: this.seriesUpload ? this.seriesUpload : [10, 41, 35, 51, 49]
                }
              ]
      }

      if (this.chartLib === 'apexCharts') {
        this.chartsConfig = this.apexOptions
        this.handleChartUpdate(this.chartId, this.chartsConfig)
      }

      if (val) {
        this.apexOptions = val
      } else {
        return this.apexOptions
      }
    },

    handleChartjsOptions(val) {
      // Note: changes to the plugin code is not reflected to the chart, because the plugin is loaded at chart construction time and editor changes only trigger an chart.update().
      const plugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
          if (chart.data.datasets[0].data.length === 0) {
            const { ctx } = chart
            ctx.save()
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = '22px Arial'
            ctx.fillStyle = 'gray'
            ctx.fillText('No data to display', chart.width / 2, chart.height / 2)
            ctx.globalCompositeOperation = 'destination-over'
            ctx.fillStyle = this.gridLinesSwitch === true ? this.gridColor : '#fff'
            ctx.fillRect(0, 0, chart.width, chart.height)
            ctx.restore()
          }
        }
      }
      this.datacollection = {
        type: this.modifiedType ? this.modifiedType : this.chartType,
        data: {
          labels: this.dataUpload
            ? this.dataUpload
            : ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
          datasets: [
            {
              label: this.titleSwitch === true ? this.mainTitle : null,
              backgroundColor: this.color,
              borderColor: this.color,
              borderWidth: 3,
              data: this.seriesUpload
                ? this.seriesUpload
                : [70, 20, 12, 39, 100, 40, 95, 80, 80, 20, 12, 101]
            }
          ]
        },
        options: {
          indexAxis: this.selectedOrientation === 'horizontal' ? 'y' : 'x',
          responsive: true,
          maintainAspectRatio: false,
          lineTension: 1,
          plugins: {
            legend: this.chartType === 'pie' ? true : false,
            title: {
              display: false,
              text: this.mainTitle,
              color: this.titleColor,
              font: {
                size: this.titleFontSize,
                family: this.titleFontType
              }
            }
          }
        },
        plugins: [plugin]
      }

      if (this.chartLib === 'chartjs') {
        this.chartsConfig = this.datacollection
        this.handleChartUpdate(this.chartId, this.chartsConfig)
      }

      if (val) {
        this.datacollection = val
      } else {
        return this.datacollection
      }
    },

    handleChartUpdate(id, data) {
      const targetObject = this.selectedWidgets.find((item) => item.i === id)

      if (targetObject) {
        const chartUpdate = {
          data
        }
        for (const key in chartUpdate) {
          if (chartUpdate.hasOwnProperty(key)) {
            targetObject[key] = chartUpdate[key]
          }
        }
        store.getChartOptions(targetObject)
      } else {
        console.log('No object with index found')
      }
    },

    handleChartDom(id) {
      domtoimage.toBlob(document.getElementById('chart' + id)).then(function (blob) {
        window.saveAs(blob, 'my-chart.png')
      })
    },

    copyText() {
      const input = document.getElementById('tocopy')
      input.select()
      document.execCommand('copy')
    },

    // selectedXaxisData(x) {
    //   if (x === "Days") {
    //     const daysItem = {
    //       categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //       values: {
    //         data: [60, 35, 110, 80, 95, 140, 185],
    //       },
    //     };
    //     this.options.xAxis.data = daysItem.categories;
    //     this.options.series = daysItem.values;
    //   } else if (x === "Number") {
    //     const numberItem = {
    //       categories: [1, 2, 3, 4, 5],
    //       values: {
    //         data: [50, 100, 150, 200, 250],
    //       },
    //     };
    //     this.options.xAxis.data = numberItem.categories;
    //     this.options.series = numberItem.values;
    //   } else if (x === "Category") {
    //     const categoryItem = [
    //       "Direct",
    //       "Email",
    //       "Ad Networks",
    //       "Video Ads",
    //       "Search Engines",
    //     ];
    //     this.options.xAxis.data = categoryItem;
    //   } else if (x === "Time") {
    //     const timeItem = {
    //       categories: [10, 40, 70, 100, 130],
    //       values: {
    //         data: [55, 75, 95, 115, 135],
    //       },
    //     };
    //     this.options.xAxis.data = timeItem.categories;
    //     this.options.series = timeItem.values;
    //   }
    // },

    // selectedYaxisData(y) {
    //   if (y === "Default") {
    //     const defaultItem = {
    //       type: "value",
    //       min: 0,
    //       max: 200,
    //       interval: 50,
    //       axisLabel: {
    //         formatter: "{value}",
    //       },
    //     };
    //     this.options.yAxis = defaultItem;
    //   } else if (y === "Days") {
    //     const daysItem = {
    //       type: "category",
    //       data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //     };
    //     this.options.yAxis = daysItem;
    //   } else if (y === "Precipitation") {
    //     const precipitationItem = {
    //       type: "value",
    //       name: "Precipitation",
    //       min: 0,
    //       max: 250,
    //       interval: 50,
    //       axisLabel: {
    //         formatter: "{value} ml",
    //       },
    //     };
    //     this.options.yAxis = precipitationItem;
    //   } else if (y === "Temperature") {
    //     const tempItem = {
    //       type: "value",
    //       name: "Temperature",
    //       min: 0,
    //       max: 25,
    //       interval: 5,
    //       axisLabel: {
    //         formatter: "{value} °C",
    //       },
    //     };
    //     this.options.yAxis = tempItem;
    //   } else if (y === "Category") {
    //     const categoryItem = {
    //       type: "category",
    //       data: [
    //         "Direct",
    //         "Email",
    //         "Ad Networks",
    //         "Video Ads",
    //         "Search Engines",
    //       ],
    //     };
    //     this.options.yAxis = categoryItem;
    //   }
    // },

    getRandomColor() {
      this.randomColor = Math.floor(Math.random() * 16777215).toString(16)
    },

    // handleNumberOfSeries() {
    //   this.getRandomColor();
    //   const seriesData = {
    //     name: this.seriesName,
    //     color: "#" + this.randomColor,
    //     data: [
    //       { value: 30 },
    //       { value: 67 },
    //       { value: 96 },
    //       { value: 85 },
    //       { value: 105 },
    //     ],
    //     type: this.modifiedType ? this.modifiedType : this.chartType,
    //   };
    //   this.options.series.push(seriesData);

    //   const apexSeriesData = {
    //     data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    //   };
    //   this.apexSeries.push(apexSeriesData);

    //   const chartDatasets = {
    //     label: this.titleSwitch === true ? this.mainTitle : null,
    //     backgroundColor: "#" + this.randomColor,
    //     borderColor: "#" + this.randomColor,
    //     borderWidth: 3,
    //     data: [90, 10, 78, 44, 150, 98, 56, 23, 12, 76, 15, 111],
    //   };
    //   this.datacollection.datasets.push(chartDatasets);
    // },

    deleteSeries(val) {
      const index = this.options.series.map((item, index) => index).indexOf(val)
      this.options.series.splice(index, 1)
      this.handleOptions(this.options.series)
    },

    handleFileImport() {
      this.isSelecting = true

      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false
        },
        { once: true }
      )

      this.$refs.uploader.click()
    },

    onFileChanged(e) {
      this.selectedFile = e.target.files[0]
      this.getRandomColor()
      const reader = new FileReader()
      reader.onload = (e) => {
        this.selectedFile = JSON.parse(e.target.result)
        this.apexOptions.xaxis.categories = this.selectedFile.map((row) => row['label'])
        this.options.xAxis.data = this.selectedFile.map((row) => row['label'])

        const blendData = {
          name: this.seriesName,
          color: '#' + this.randomColor,
          data: this.selectedFile,
          type: this.modifiedType ? this.modifiedType : this.chartType
        }
        this.options.series.push(blendData)
        this.apexOptions.series.push(blendData)
      }
      reader.readAsText(e.target.files[0])
      this.editDialog = false
    },

    handleUploadedFile() {
      this.isLoading = true

      window.addEventListener(
        'focus',
        () => {
          this.isLoading = false
        },
        { once: true }
      )

      this.$refs.uploadedFile.click()
    },

    onUploadChange(e) {
      this.uploadedFile = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedFile = JSON.parse(e.target.result)

        // Get dimensions
        const allKeys = new Set()
        for (const item of this.uploadedFile) {
          const keys = Object.keys(item)
          keys.forEach((key) => allKeys.add(key))
        }
        this.dimensions = Array.from(allKeys)
        this.defaultCategory = this.dimensions[0]
        this.defaultMetric = this.dimensions[1]

        this.getUniqueValues(this.uploadedFile, this.defaultCategory, this.defaultMetric)

        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
      reader.readAsText(e.target.files[0])
      this.editDialog = false
    },

    getUniqueValues(data, key, metric) {
      this.getType(data, key, metric)
      // Get data from selected dimension
      const uniqueValuesSet = new Set()
      for (const item of data) {
        uniqueValuesSet.add(item[key])
      }
      this.dataUpload = Array.from(uniqueValuesSet)

      // Get unique values
      const uniqueValuesMap = new Map()

      for (const item of data) {
        const keyValue = item[key]
        if (!uniqueValuesMap.has(keyValue)) {
          uniqueValuesMap.set(keyValue, { ...item })
        } else {
          const existingItem = uniqueValuesMap.get(keyValue)
          if (metric in item) {
            existingItem[metric] += item[metric]
          }
        }
      }

      this.uniqueValues = Array.from(uniqueValuesMap.values())

      this.seriesUpload = this.uniqueValues.map((item) => {
        return item[metric]
      })
    },

    getType(data, key, metric) {
      for (const record of data) {
        const type = typeof record[key]
        const metricType = typeof record[metric]
        if (type === 'string') {
          this.dimensionsemanticType = 'Text'
        }
        if (metricType === 'string') {
          this.metricsemanticType = 'Text'
        }
        if (type === 'number') {
          this.dimensionsemanticType = 'Numeric'
        }
        if (metricType === 'number') {
          this.metricsemanticType = 'Numeric'
        }
      }
    },

    getSemanticType(e) {
      this.dimensionsemanticType = e.value
    },

    selectedDimension(e) {
      this.getUniqueValues(this.uploadedFile, e, this.defaultMetric)
      this.handleOptions()
      this.handleApexOptions()
      this.handleChartjsOptions()
    },

    selectedMetric(e) {
      this.getUniqueValues(this.uploadedFile, this.defaultCategory, e)
      this.handleOptions()
      this.handleApexOptions()
      this.handleChartjsOptions()
    },

    handleDates(date) {
      if (date) {
        const dateMapped = date.map((item) => {
          return moment(item).format('L')
        })
        this.getDaysBetweenDates(dateMapped)
      }
    },

    getDaysBetweenDates(dates) {
      const resultObject = {
        startDate: dates[0],
        endDate: dates[1]
      }

      const newDates = []
      const randomNumbers = []
      const currDate = moment(resultObject.startDate).startOf('day')
      const lastDate = moment(resultObject.endDate).startOf('day')

      while (currDate.clone().isSameOrBefore(lastDate)) {
        newDates.push(currDate.format('L'))
        currDate.add(1, 'days')
        this.editDialog = false
        this.dataUpload = newDates
        randomNumbers.push(Math.round(Math.random() * 100))
        this.seriesUpload = randomNumbers
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
      return newDates
    },

    getApiData(api) {
      axios
        .get(api)
        .then((response) => {
          const responseData = response.data
          this.apiData = responseData

          // Get dimensions
          const allKeys = new Set()
          for (const item of responseData) {
            const keys = Object.keys(item)
            keys.forEach((key) => allKeys.add(key))
          }
          this.dimensions = Array.from(allKeys)
          const keyToFind = 'createdAt'
          const index = this.dimensions.indexOf(keyToFind)

          this.defaultCategory = this.dimensions[index]
          this.defaultMetric = this.dimensions[4]

          this.getUniqueValues(responseData, this.defaultCategory, this.defaultMetric)

          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        })
        .catch(() => {})
        .finally()
    },

    getDates(e) {
      axios
        .get(
          `https://retoolapi.dev/NuWQVD/data?createdAt_gte=${e[0]}&createdAt_lte=${e[e.length - 1]}`
        )
        .then((response) => {
          let mappedData = this.apiData.map((date) => {
            const newDateFormat = moment(date.createdAt).format('YYYY-MM-DD')
            return {
              ...date,
              newFormat: newDateFormat
            }
          })

          let res = e.map((x) => mappedData.find((date) => date.newFormat == x))

          const filteredData = res.filter((item) => item !== undefined)

          // Get dimensions
          const allKeys = new Set()
          for (const item of filteredData) {
            const keys = Object.keys(item)
            keys.forEach((key) => allKeys.add(key))
          }
          this.dimensions = Array.from(allKeys)
          const keyToFind = 'createdAt'
          const index = this.dimensions.indexOf(keyToFind)

          this.defaultCategory = this.dimensions[index]
          this.defaultMetric = this.dimensions[4]

          this.getUniqueValues(filteredData, this.defaultCategory, this.defaultMetric)

          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        })
        .catch(() => {})
        .finally()
    },

    onJsonSave(e) {
      if (this.chartLib === 'eCharts') {
        this.options = e
        this.chartsConfig = e
      }
      if (this.chartLib === 'apexCharts') {
        this.apexOptions = e
        this.chartsConfig = e
      }
      if (this.chartLib === 'chartjs') {
        this.datacollection = e
        this.chartsConfig = e
      }
      this.jsonConfigDialog = false
    }
  }
}
</script>

<style scoped>
.custom-toolbox {
  position: absolute;
  right: 2px;
  top: 30px;
  cursor: pointer;
}
</style>
