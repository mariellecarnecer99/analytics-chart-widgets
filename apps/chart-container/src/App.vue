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
        @click="handleSelectedChart(item)"
        class="active"
      >
        <ChartData
          :chartType="item.chart?.value"
          :chartLib="item.selectedLib"
          :chartId="item.i"
          :control="item.selectedControl"
          :textControlText="item.text"
          :selectedChartsLength="widgets.length"
          :widgets="item"
          :selectedWidgets="widgets"
          :chartData="item.data"
          :modifiedChart="item.i === specificItemId ? modifiedChart : null"
          :selectedOrientation="item.i === specificItemId ? selectedOrientation : null"
          :datexFilter="item.i === specificItemId ? xDates : null"
          :dateyFilter="item.i === specificItemId ? yRandom : null"
          :chartJson="item.i === specificItemId ? chartJson : null"
          :uploadedData="item.i === specificItemId ? uploadedData : null"
          :selectedDimensions="item.i === specificItemId ? selectedDimensions : null"
          :selectedMetrics="item.i === specificItemId ? selectedMetrics : null"
          :serviceUrl="item.i === specificItemId ? serviceUrl : null"
          :bgColor="item.i === specificItemId ? gridColor : null"
          :bgSwitch="item.i === specificItemId ? gridLinesSwitch : false"
          :chartFont="item.i === specificItemId ? fontType : null"
          :chartFontSize="item.i === specificItemId ? fontSize : null"
          :chartFontColor="item.i === specificItemId ? labelColor : null"
          :chartPlotTitle="item.i === specificItemId ? mainTitle : null"
          :chartPlotTitleSwitch="item.i === specificItemId ? titleSwitch : false"
          :chartPlotTitleFont="item.i === specificItemId ? titleFontType : null"
          :chartPlotTitleFontSize="item.i === specificItemId ? titleFontSize : null"
          :chartPlotTitleFontColor="item.i === specificItemId ? titleColor : null"
          :chartTickLabelsSwitch="item.i === specificItemId ? tickLabelsSwitch : null"
          :chartTickMarkersSwitch="item.i === specificItemId ? tickMarkersSwitch : null"
          :chartLegendSwitch="item.i === specificItemId ? legendSwitch : null"
          :chartDatesSwitch="item.i === specificItemId ? datesSwitch : null"
          :defaultDateControl="item.i === specificItemId ? dateControl : null"
          :dateRange="item.i === specificItemId ? defaultDateRange : null"
          :textControlColor="item.i === specificItemId ? textColor : null"
          :textControlFontSize="item.i === specificItemId ? textFontSize : null"
          :textControlFont="item.i === specificItemId ? textFont : null"
          :textControlFormat="item.i === specificItemId ? textFormats : []"
          :textControlAlignment="item.i === specificItemId ? textAlignments : null"
          :textControlBgColor="item.i === specificItemId ? textbgColor : null"
          :textControlBorderWeight="item.i === specificItemId ? textBorderWeight : null"
          :textControlBorder="item.i === specificItemId ? textBorder : null"
          :textControlBorderRadius="item.i === specificItemId ? textBorderRadius : null"
          :textControlBorderColor="item.i === specificItemId ? textborderColor : null"
        />
        <span class="remove deleteChart" @click="removeItem(item.i)"
          ><v-icon size="small">mdi-close</v-icon></span
        >
      </grid-item>
    </grid-layout>
  </div>

  <v-navigation-drawer v-if="dateConfig" app permanent location="right" :width="400">
    <v-list-item
      title="Date range control Properties"
      class="my-2"
      prepend-icon="mdi-calendar-range"
    ></v-list-item>

    <v-divider></v-divider>

    <v-tabs v-model="tab" fixed-tabs color="primary">
      <v-tab value="setup"> Setup </v-tab>
      <v-tab value="style"> Style </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="setup">
        <v-expansion-panels v-model="panel" variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title> Default date range </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-select
                v-model="selectedDateRange"
                :items="dateRange"
                variant="outlined"
                class="mt-3"
                item-title="type"
                item-value="value"
                density="compact"
                @update:model-value="handleSelectedDateRange"
              ></v-select>

              <VueDatePicker
                v-model="defaultDateRange"
                placeholder="Select Date"
                format="MM/dd/yyyy"
                range
                menu-class-name="dp-custom-menu"
                text-input
                position="left"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>

      <v-window-item value="style">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="i in dateRangeStyle" :key="i">
            <v-expansion-panel-title>
              {{ i.title }}
            </v-expansion-panel-title>
            <v-expansion-panel-text v-if="i.value === 'header'">
              <!-- <v-text-field
                v-model="daterangeColor"
                hide-details
                class="mt-5"
                variant="outlined"
                density="compact"
              >
                <template v-slot:append-inner>
                  <v-menu
                    v-model="menudaterangeColor"
                    location="end"
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        :style="{
                          backgroundColor: daterangeColor,
                          cursor: 'pointer',
                          width: '30px',
                          height: '30px',
                          borderRadius: menudaterangeColor ? '50%' : '4px',
                          transition: 'border-radius 200ms ease-in-out'
                        }"
                      ></div>
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker v-model="daterangeColor" flat></v-color-picker>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>

              <v-text-field
                v-model="dateFontSize"
                type="number"
                variant="outlined"
                density="compact"
                class="mt-5"
              ></v-text-field> -->
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>
    </v-window>
    <v-divider></v-divider>
  </v-navigation-drawer>

  <v-navigation-drawer v-if="textConfig" app permanent location="right" :width="400">
    <v-list-item
      title="Text Properties"
      class="my-2"
      prepend-icon="mdi-text-recognition"
    ></v-list-item>

    <v-divider></v-divider>

    <v-expansion-panels v-model="panel" variant="accordion">
      <v-expansion-panel v-for="i in textStyle" :key="i">
        <v-expansion-panel-title>
          {{ i.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="i.value === 'fontParagraph'">
          <v-row class="mt-3">
            <v-col>
              <v-text-field v-model="textColor" hide-details variant="outlined" density="compact">
                <template v-slot:append-inner>
                  <v-menu
                    v-model="menutextColor"
                    location="end"
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        :style="{
                          backgroundColor: textColor,
                          cursor: 'pointer',
                          width: '30px',
                          height: '30px',
                          borderRadius: menutextColor ? '50%' : '4px',
                          transition: 'border-radius 200ms ease-in-out'
                        }"
                      ></div>
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker v-model="textColor" flat></v-color-picker>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                v-model="textFontSize"
                type="number"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-select
                v-model="textFont"
                :items="fonts"
                label="Select ..."
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
          </v-row>

          <v-row class="mt-0 mb-2" no-gutters>
            <v-col v-for="(item, index) in textFormatItems" :key="index" class="text-center">
              <v-icon
                :class="{ selected: textFormats.includes(item) }"
                :style="textFormats.includes(item) ? { background: '#e0e0e0' } : {}"
                @click="toggleSelection(item)"
              >
                {{ item.icon }}
              </v-icon>
            </v-col>
          </v-row>

          <v-row class="alignItems mt-5 mb-4 py-2" no-gutters>
            <v-col v-for="(item, index) in textAlignmentItems" :key="index" class="text-center">
              <v-icon :class="alignmentIconClass(item.value)" @click="handleAlignments(item.value)">
                {{ item.icon }}
              </v-icon>
            </v-col>
          </v-row>
        </v-expansion-panel-text>

        <v-expansion-panel-text v-if="i.value === 'bgBorder'">
          <v-row class="mt-3">
            <v-col>
              <v-text-field v-model="textbgColor" hide-details variant="outlined" density="compact">
                <template v-slot:append-inner>
                  <v-menu
                    v-model="menutextbgColor"
                    location="end"
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        :style="{
                          backgroundColor: textbgColor,
                          cursor: 'pointer',
                          width: '30px',
                          height: '30px',
                          borderRadius: menutextbgColor ? '50%' : '4px',
                          transition: 'border-radius 200ms ease-in-out'
                        }"
                      ></div>
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker v-model="textbgColor" flat></v-color-picker>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                v-model="textBorderRadius"
                type="number"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-border-style"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-3">
            <v-col>
              <v-text-field
                v-model="textborderColor"
                hide-details
                variant="outlined"
                density="compact"
              >
                <template v-slot:append-inner>
                  <v-menu
                    v-model="menutextborderColor"
                    location="end"
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        :style="{
                          backgroundColor: textborderColor,
                          cursor: 'pointer',
                          width: '30px',
                          height: '30px',
                          borderRadius: menutextborderColor ? '50%' : '4px',
                          transition: 'border-radius 200ms ease-in-out'
                        }"
                      ></div>
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker v-model="textborderColor" flat></v-color-picker>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                v-model="textBorderWeight"
                type="number"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-border-top"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-select
                v-model="textBorder"
                :items="textBorderStyle"
                item-title="style"
                item-value="value"
                label="Border Style"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-table-border"
                @update:modelValue="getBorderStyle"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>

  <v-navigation-drawer v-if="chartConfig" app permanent location="right" :width="400">
    <v-list-item title="Chart" class="my-2" prepend-icon="mdi-chart-box-outline"></v-list-item>

    <v-divider></v-divider>

    <v-tabs v-model="tab" fixed-tabs color="primary">
      <v-tab value="setup"> Setup </v-tab>
      <v-tab value="style"> Style </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="setup">
        <v-expansion-panels v-model="panel" variant="accordion">
          <v-expansion-panel v-for="i in setupItems" :key="i">
            <v-expansion-panel-title>
              {{ i.title }}
            </v-expansion-panel-title>
            <v-expansion-panel-text v-if="i.value === 'dataSource'">
              <v-row class="my-0">
                <v-col>
                  <p class="mb-2">Data Source</p>
                  <v-row>
                    <v-col>
                      <v-btn
                        variant="outlined"
                        color="primary"
                        class="uploadData"
                        :loading="isLoading"
                        @click="handleUploadedFile"
                        ><v-icon>mdi-upload</v-icon> Upload Data</v-btn
                      >
                      <input
                        id="uploadedFile"
                        class="d-none"
                        type="file"
                        accept=".csv"
                        @change="onUploadChange"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="my-0">
                    <v-col class="pt-2 pb-0">
                      <v-btn
                        variant="text"
                        color="primary"
                        :loading="isSelecting"
                        @click="handleFileImport"
                        ><v-icon size="large">mdi-plus-circle-outline</v-icon>
                        <span class="ml-2">Blend Data</span></v-btn
                      >
                      <input
                        id="uploader"
                        class="d-none"
                        type="file"
                        accept=".csv"
                        @change="onFileChanged"
                      />
                    </v-col>
                  </v-row>

                  <div v-if="uploadFile.length != 0" class="concept-type">
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
                                <i v-if="newCatName" class="mt-0"
                                  >Source field: {{ defaultCategory }}</i
                                >
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
                                <i v-if="newMetricName" class="mt-0"
                                  >Source field: {{ defaultMetric }}</i
                                >

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

                  <v-row>
                    <v-col class="pt-2 pb-0">
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

                  <div v-if="selectedApi">
                    <v-checkbox v-model="authHeaders" label="Authorization Headers"></v-checkbox>
                    <div v-if="authHeaders === true">
                      <v-textarea v-model="accessToken" variant="outlined" clearable></v-textarea>
                      <v-btn
                        @click="makeApiRequest"
                        variant="outlined"
                        color="primary"
                        class="mx-auto mb-8 d-block"
                        >Submit</v-btn
                      >
                    </div>
                  </div>

                  <v-row v-if="selectedApi">
                    <v-col>
                      <p class="mb-2">API date control</p>
                      <VueDatePicker
                        v-model="apiDates"
                        placeholder="Select Date"
                        format="MM/dd/yyyy"
                        range
                        menu-class-name="dp-custom-menu"
                        text-input
                        position="left"
                        @update:model-value="handleDates"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
            <v-expansion-panel-text v-if="i.value === 'defaultDate'">
              <v-row class="my-0">
                <v-col>
                  <p class="mb-2">Default date control</p>
                  <VueDatePicker
                    v-model="dateControl"
                    placeholder="Select Date"
                    format="MM/dd/yyyy"
                    range
                    menu-class-name="dp-custom-menu"
                    position="left"
                    @update:model-value="handleDates"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
            <v-expansion-panel-text v-if="i.value === 'code'">
              <v-row class="my-0">
                <v-col>
                  <p class="mb-2">Insert code into website</p>
                  <v-textarea
                    :model-value="`<chart-widget id='${specificItemId}'></chart-widget>`"
                    id="tocopy"
                    variant="outlined"
                    density="compact"
                    auto-grow
                    append-inner-icon="mdi-content-copy"
                    @click:append-inner="copyText"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div>
                  <div v-if="chartImg">
                    <img :src="chartImg" style="width: 25px" />
                    <span class="ml-2">{{ chartName }}</span>
                  </div>

                  <div v-else>
                    <v-icon size="large">mdi-chart-box-outline</v-icon>
                    <span class="ml-2"> Chart</span>
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="text-h2 pa-4">
                  <v-row no-gutters>
                    <v-col v-for="item in charts" class="mr-5 d-flex justify-center">
                      <img
                        :src="item.img"
                        style="width: 25px; height: 25px"
                        @click="handleChartChange(item)"
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels> -->
      </v-window-item>

      <v-window-item value="style">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="i in styleItems" :key="i">
            <v-expansion-panel-title>
              {{ i.title }}
            </v-expansion-panel-title>
            <v-expansion-panel-text v-if="i.value === 'defaults'">
              <v-row class="my-0">
                <v-col cols="12">
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
                      density="comfortable"
                      @click="handleGetOrientation(item.value)"
                    >
                      {{ item.type }}
                    </v-tab>
                  </v-tabs>
                </v-col>
              </v-row>

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
            </v-expansion-panel-text>
            <v-expansion-panel-text v-if="i.value === 'title'">
              <v-row class="my-0">
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
            </v-expansion-panel-text>
            <v-expansion-panel-text v-if="i.value === 'visibility'">
              <v-switch
                v-model="titleSwitch"
                class="ma-0 pa-0"
                hint="This will display the default chart title of the selected chart."
                color="primary"
                persistent-hint
              >
                <template #label> Plot Title </template>
              </v-switch>

              <v-switch
                v-model="gridLinesSwitch"
                class="ma-0 pa-0"
                hint="This will allow you to customize the background color of the selected chart."
                color="primary"
                persistent-hint
              >
                <template #label> Grid Lines </template>
              </v-switch>

              <v-switch
                v-model="legendSwitch"
                class="ma-0 pa-0"
                hint="This will allow you to show/hide the legend of the selected chart"
                color="primary"
                persistent-hint
              >
                <template #label> Legend </template>
              </v-switch>

              <v-switch
                v-model="datesSwitch"
                class="ma-0 pa-0"
                hint="This will allow you to show/hide the dates(if there is) of the selected chart"
                color="primary"
                persistent-hint
              >
                <template #label> Dates </template>
              </v-switch>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>
    </v-window>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
import ChartData from './components/charts/ChartData.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { Vue3JsonEditor } from 'vue3-json-editor'
import line from './assets/line.png'
import bar from './assets/bar.png'
import pie from './assets/pie.png'
import scatter from './assets/scatter.png'
import table from './assets/table.png'
import moment from 'moment'
import axios from 'axios'
export default {
  components: {
    ChartData,
    VueDatePicker,
    Vue3JsonEditor
  },
  inject: ['eventBus'],
  data: () => {
    return {
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
      accessToken: '',
      isLoading: false,
      isSelecting: false,
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
      legendSwitch: false,
      tickLabelsSwitch: true,
      tickMarkersSwitch: false,
      datesSwitch: false,
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
      chartImg: null,
      chartName: null,
      modifiedChart: null,
      specificItemId: null,
      xDates: null,
      yRandom: null,
      chartJson: null,
      uploadFile: [],
      defaultCategory: null,
      defaultMetric: null,
      uploadedData: {},
      serviceUrl: {},
      selectedChartLib: null,
      dimensions: [],
      selectedDimensions: {},
      selectedMetrics: {},
      dimensionMenu: false,
      metricMenu: false,
      newCatName: null,
      newMetricName: null,
      dimensionsemanticType: null,
      semanticTypes: ['Text', 'Numeric'],
      aggregationType: true,
      metricsemanticType: null,
      setupItems: [
        {
          title: 'Data source',
          value: 'dataSource'
        },
        {
          title: 'Default date control',
          value: 'defaultDate'
        },
        {
          title: 'Code',
          value: 'code'
        }
      ],
      styleItems: [
        {
          title: 'Defaults',
          value: 'defaults'
        },
        {
          title: 'Title',
          value: 'title'
        },
        {
          title: 'Visibility',
          value: 'visibility'
        }
      ],
      apiDates: [],
      chartConfig: false,
      dateConfig: false,
      textConfig: false,
      selectedDateRange: 'fixed',
      dateRange: [
        {
          type: 'Fixed',
          value: 'fixed'
        },
        {
          type: 'Last 7 days',
          value: '7days'
        },
        {
          type: 'Last 14 days',
          value: '14days'
        },
        {
          type: 'Last 28 days',
          value: '28days'
        },
        {
          type: 'Last 30 days',
          value: '30days'
        },
        {
          type: 'Today',
          value: 'today'
        },
        {
          type: 'Yesterday',
          value: 'yesterday'
        },
        {
          type: 'This week(starts Sunday)',
          value: 'thisWeekSunday'
        },
        {
          type: 'This week to date(starts Sunday)',
          value: 'thisWeekToDateSunday'
        },
        {
          type: 'Last week(starts Sunday)',
          value: 'lastWeekSunday'
        },
        {
          type: 'This week(starts Monday)',
          value: 'thisWeekMonday'
        },
        {
          type: 'This week to date(starts Monday)',
          value: 'thisWeekToDateMonday'
        },
        {
          type: 'Last week(starts Monday)',
          value: 'lastWeekMonday'
        },
        {
          type: 'This month',
          value: 'thisMonth'
        },
        {
          type: 'This month to date',
          value: 'thisMonthToDate'
        },
        {
          type: 'Last month',
          value: 'lastMonth'
        },
        {
          type: 'This quarter',
          value: 'thisQuarter'
        },
        {
          type: 'This quarter to date',
          value: 'thisQuarterToDate'
        },
        {
          type: 'Last quarter',
          value: 'lastQuarter'
        },
        {
          type: 'This year',
          value: 'thisYear'
        },
        {
          type: 'This year to date',
          value: 'thisYearToDate'
        },
        {
          type: 'Last year',
          value: 'lastYear'
        }
      ],
      defaultDateRange: [],
      dateRangeStyle: [
        // {
        //   title: 'Date Range Picker',
        //   value: 'dateRangePicker'
        // },
        {
          title: 'Header',
          value: 'header'
        },
        // {
        //   title: 'Label',
        //   value: 'label'
        // },
        {
          title: 'Background and Border',
          value: 'bgBorder'
        }
        // {
        //   title: 'Padding',
        //   value: 'padding'
        // }
      ],
      textStyle: [
        {
          title: 'Font and Paragraph',
          value: 'fontParagraph'
        },
        {
          title: 'Background and Border',
          value: 'bgBorder'
        }
      ],
      daterangeColor: '#333',
      menudaterangeColor: false,
      textFontSize: 12,
      textColor: '#000',
      menutextColor: false,
      textbgColor: '#ccc',
      menutextbgColor: false,
      textborderColor: '#000',
      menutextborderColor: false,
      textFont: 'Arial',
      textFormatItems: [
        {
          icon: 'mdi-format-bold',
          value: 'bold'
        },
        {
          icon: 'mdi-format-italic',
          value: 'italic'
        },
        {
          icon: 'mdi-format-underline',
          value: 'underline'
        },
        {
          icon: 'mdi-format-strikethrough',
          value: 'strikethrough'
        }
      ],
      textFormats: [],
      textAlignmentItems: [
        {
          icon: 'mdi-format-align-left',
          value: 'left'
        },
        {
          icon: 'mdi-format-align-center',
          value: 'center'
        },
        {
          icon: 'mdi-format-align-right',
          value: 'right'
        },
        {
          icon: 'mdi-format-align-justify',
          value: 'justify'
        }
      ],
      textAlignments: 'left',
      panel: [0],
      textBorderRadius: 1,
      textBorderWeight: 2,
      textBorderStyle: [
        {
          style: 'Solid',
          value: 'solid'
        },
        {
          style: 'Dashed',
          value: 'dashed'
        },
        {
          style: 'Dotted',
          value: 'dotted'
        },
        {
          style: 'Double',
          value: 'double'
        }
      ],
      textBorder: 'solid',
      authHeaders: false
    }
  },
  props: {
    widgets: Array
  },
  computed: {
    getGridColor() {
      const { gridColor } = this
      return gridColor
    },
    alignmentIconClass() {
      return (alignmentOption) => {
        if (this.textAlignments === alignmentOption) {
          return 'icon-selected-color'
        } else {
          return 'icon-default-color'
        }
      }
    }
  },
  mounted() {
    this.handleSelectedDateRange(this.selectedDateRange)
    this.getBorderStyle(this.textBorder)
  },
  methods: {
    getBorderStyle(e) {
      this.textBorder = e
    },

    toggleSelection(item) {
      const index = this.textFormats.indexOf(item)
      if (index === -1) {
        this.textFormats.push(item)
      } else {
        this.textFormats.splice(index, 1)
      }
    },

    handleAlignments(align) {
      this.textAlignments = align
    },

    copyText() {
      const input = document.getElementById('tocopy')
      input.select()
      document.execCommand('copy')
    },

    handleSelectedDateRange(e) {
      if (e === '7days') {
        this.defaultDateRange = this.calculateDateRangeDays(7)
      } else if (e === '14days') {
        this.defaultDateRange = this.calculateDateRangeDays(14)
      } else if (e === '28days') {
        this.defaultDateRange = this.calculateDateRangeDays(28)
      } else if (e === '30days') {
        this.defaultDateRange = this.calculateDateRangeDays(30)
      } else if (e === 'today') {
        this.defaultDateRange = this.calculateDateRangeDays(0)
      } else if (e === 'yesterday') {
        this.defaultDateRange = this.calculateDateRangeDays(1)
      } else if (e === 'thisWeekSunday') {
        this.defaultDateRange = this.calculateDateRangeWeek('week')
      } else if (e === 'thisWeekToDateSunday') {
        this.defaultDateRange = this.calculateDateRangeWeekDays(1, 'isoWeek')
      } else if (e === 'lastWeekSunday') {
        this.defaultDateRange = this.calculateDateRangeWeekDays(1, 'week')
      } else if (e === 'thisWeekMonday') {
        this.defaultDateRange = this.calculateDateRangeWeek('isoWeek')
      } else if (e === 'thisWeekToDateMonday') {
        this.defaultDateRange = this.calculateDateRangeWeekDays(1, 'isoWeekMonday')
      } else if (e === 'lastWeekMonday') {
        this.defaultDateRange = this.calculateDateRangeWeekDays(1, 'isoWeekLastWeek')
      } else if (e === 'thisMonth') {
        this.defaultDateRange = this.calculateDateRangeWeek('month')
      } else if (e === 'thisMonthToDate') {
        this.defaultDateRange = this.calculateDateRangeMonth(1, 'month')
      } else if (e === 'lastMonth') {
        this.defaultDateRange = this.calculateDateRangeLastMonth(1, 'month')
      } else if (e === 'thisQuarter') {
        this.defaultDateRange = this.calculateDateRangeWeek('quarter')
      } else if (e === 'thisQuarterToDate') {
        this.defaultDateRange = this.calculateDateRangeQuarter()
      } else if (e === 'lastQuarter') {
        this.defaultDateRange = this.calculateDateRangeLastQuarter()
      } else if (e === 'thisYear') {
        this.defaultDateRange = this.calculateDateRangeWeek('year')
      } else if (e === 'thisYearToDate') {
        this.defaultDateRange = this.calculateDateRangeYear()
      } else if (e === 'lastYear') {
        this.defaultDateRange = this.calculateDateRangeLastYear()
      }
    },

    calculateDateRangeDays(days) {
      const currentDate = moment()
      const endDate =
        days === 0
          ? currentDate.format('YYYY-MM-DD')
          : currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD')
      const startDate = currentDate.clone().subtract(days, 'days').format('YYYY-MM-DD')
      return [startDate, endDate]
    },

    calculateDateRangeWeek(week) {
      const currentDate = moment()
      const endDate = currentDate.clone().endOf(week).format('YYYY-MM-DD')
      const startDate = currentDate.clone().startOf(week).format('YYYY-MM-DD')
      return [startDate, endDate]
    },

    calculateDateRangeWeekDays(days, week) {
      const currentDate = moment()
      const endDate =
        week === 'week'
          ? currentDate.clone().subtract(days, 'week').endOf(week).format('YYYY-MM-DD')
          : week === 'isoWeekLastWeek'
          ? currentDate.clone().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD')
          : currentDate.clone().subtract(days, 'days').format('YYYY-MM-DD')
      const startDate =
        week === 'week'
          ? currentDate.clone().subtract(days, 'week').startOf(week).format('YYYY-MM-DD')
          : week === 'isoWeekMonday'
          ? currentDate.clone().startOf('isoWeek').format('YYYY-MM-DD')
          : week === 'isoWeekLastWeek'
          ? currentDate.clone().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
          : currentDate.clone().startOf(week).subtract(days, 'days').format('YYYY-MM-DD')
      return [startDate, endDate]
    },

    calculateDateRangeMonth(days, month) {
      const currentDate = moment()
      const endDate = currentDate.subtract(days, 'days').format('YYYY-MM-DD')
      const startDate = currentDate.clone().startOf(month).format('YYYY-MM-DD')
      return [startDate, endDate]
    },

    calculateDateRangeLastMonth(days, month) {
      const currentDate = moment()
      const endDate = currentDate.clone().subtract(days, 'month').endOf(month).format('YYYY-MM-DD')
      const startDate = currentDate
        .clone()
        .subtract(days, 'month')
        .startOf(month)
        .format('YYYY-MM-DD')
      return [startDate, endDate]
    },

    calculateDateRangeQuarter() {
      const currentDate = moment()
      const thisQuarterStartDate = currentDate.clone().startOf('year').month(9).date(1)
      const thisQuarterToDateEndDate = currentDate.clone().subtract(1, 'day').format('YYYY-MM-DD')
      const thisQuarterToDateStartDate = thisQuarterStartDate.format('YYYY-MM-DD')
      return [thisQuarterToDateStartDate, thisQuarterToDateEndDate]
    },

    calculateDateRangeLastQuarter() {
      const currentDate = moment()
      const lastQuarterStartDate = currentDate
        .clone()
        .subtract(3, 'months')
        .startOf('quarter')
        .format('YYYY-MM-DD')

      const lastQuarterEndDate = currentDate
        .clone()
        .startOf('quarter')
        .subtract(1, 'day')
        .format('YYYY-MM-DD')

      return [lastQuarterStartDate, lastQuarterEndDate]
    },

    calculateDateRangeYear() {
      const currentDate = moment()
      const thisYearToDateStartDate = currentDate.clone().startOf('year').format('YYYY-MM-DD')
      const thisYearToDateEndDate = currentDate.clone().subtract(1, 'day').format('YYYY-MM-DD')
      return [thisYearToDateStartDate, thisYearToDateEndDate]
    },

    calculateDateRangeLastYear() {
      const currentDate = moment()
      const lastYearStartDate = currentDate
        .clone()
        .subtract(1, 'year')
        .startOf('year')
        .format('YYYY-MM-DD')
      const lastYearEndDate = currentDate
        .clone()
        .subtract(1, 'year')
        .endOf('year')
        .format('YYYY-MM-DD')
      return [lastYearStartDate, lastYearEndDate]
    },

    removeItem(i) {
      const index = this.widgets.map((item) => item.i).indexOf(i)
      this.widgets.splice(index, 1)
      this.widgets.forEach((item, index) => {
        item.i = index
      })
    },

    handleSelectedChart(item) {
      this.dateConfig = item.selectedControl === 'daterange'
      this.textConfig = item.selectedControl === 'text'
      this.chartConfig =
        item.chart && item.selectedControl !== 'daterange' && item.selectedControl !== 'text'

      this.specificItemId = item.i
      this.handleChartLib(item.i)
      const selectedChart = document.querySelectorAll('.active')

      for (let i = 0; i < selectedChart.length; i++) {
        selectedChart[i].style.border = `1px solid ${i === item.i ? '#463d6e' : 'transparent'}`
      }

      const deleteBtn = document.querySelectorAll('.deleteChart')

      for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].style.display = `${i === item.i ? 'block' : 'none'}`
      }
    },

    handleChartLib(id) {
      const targetObject = this.widgets.find((item) => item.i === id)
      this.selectedChartLib = targetObject?.selectedLib
    },

    handleChartChange(val) {
      this.chartImg = val.img
      this.chartName = val.type
      this.modifiedChart = val.value
    },

    handleGetOrientation(val) {
      this.selectedOrientation = val
    },

    handleDates(date) {
      if (date) {
        const dateMapped = date.map((item) => {
          return moment(item).format('L')
        })
        this.dateControl = dateMapped
        this.datesSwitch = true
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
        this.xDates = newDates
        randomNumbers.push(Math.round(Math.random() * 100))
        this.yRandom = randomNumbers
      }
      return newDates
    },

    onJsonChange(e) {
      this.chartJson = e
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

      let fileUpload = document.getElementById('uploadedFile')
      fileUpload.click()
    },

    onUploadChange(e) {
      this.uploadFile = e.target.files[0]
      try {
        var reader = new FileReader()
        reader.readAsBinaryString(this.uploadFile)
        reader.onload = (e) => {
          var jsonData = []
          var headers = []
          var rows = e.target.result.split('\r\n')
          for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].split(',')
            var rowData = {}
            for (var j = 0; j < cells.length; j++) {
              if (i == 0) {
                var headerName = cells[j].trim()
                headers.push(headerName)
              } else {
                var key = headers[j]
                if (key) {
                  rowData[key] = cells[j].trim()
                }
              }
            }
            //skip the first row (header) data
            if (i != 0) {
              jsonData.push(rowData)
            }
          }

          // Get dimensions
          const allKeys = new Set()
          for (const item of jsonData) {
            const keys = Object.keys(item)
            keys.forEach((key) => allKeys.add(key))
          }
          this.dimensions = Array.from(allKeys)
          const keyToFind = 'createdAt'
          const index = this.dimensions.indexOf(keyToFind)

          this.defaultCategory = this.dimensions[index]
          this.defaultMetric = this.dimensions[1]

          this.uploadedData = {
            uploadFile: jsonData,
            uploadedCategory: this.defaultCategory,
            uploadedMetric: this.defaultMetric
          }
        }
      } catch (e) {
        console.error(e)
      }
    },

    selectedDimension(e) {
      this.selectedDimensions = {
        uploadFile: this.uploadedData.uploadFile,
        uploadedCategory: e,
        uploadedMetric: this.defaultMetric
      }
    },

    selectedMetric(e) {
      this.selectedMetrics = {
        uploadFile: this.uploadedData.uploadFile,
        uploadedCategory: this.defaultCategory,
        uploadedMetric: e
      }
    },

    getSemanticType(e) {
      this.dimensionsemanticType = e.value
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

      let fileUpload = document.getElementById('uploader')
      fileUpload.click()
    },

    onFileChanged(e) {
      // this.selectedFile = e.target.files[0]
      // this.getRandomColor()
      // const reader = new FileReader()
      // reader.onload = (e) => {
      //   this.selectedFile = JSON.parse(e.target.result)
      //   this.apexOptions.xaxis.categories = this.selectedFile.map((row) => row['label'])
      //   this.options.xAxis.data = this.selectedFile.map((row) => row['label'])
      //   const blendData = {
      //     name: this.seriesName,
      //     color: '#' + this.randomColor,
      //     data: this.selectedFile,
      //     type: this.modifiedType ? this.modifiedType : this.chartType
      //   }
      //   this.options.series.push(blendData)
      //   this.apexOptions.series.push(blendData)
      // }
      // reader.readAsText(e.target.files[0])
    },

    async makeApiRequest() {
      try {
        let headers = {}
        if (this.authHeaders && this.accessToken) {
          headers['Authorization'] = `${this.accessToken}`
        }

        await axios
          .get(this.selectedApi, { headers })
          .then((response) => {
            const responseData = response.data
            this.apiData = responseData

            if (this.apiData) {
              let startDate = new Date(responseData[0].createdAt)
              let endDate = new Date(responseData[0].createdAt)

              responseData.forEach((item) => {
                const currentDate = new Date(item.createdAt)
                if (currentDate < startDate) {
                  startDate = currentDate
                }
                if (currentDate > endDate) {
                  endDate = currentDate
                }
              })

              const startDateLocaleDateString = startDate.toLocaleDateString()
              const endDateLocaleDateString = endDate.toLocaleDateString()

              this.apiDates.push(startDateLocaleDateString)
              this.apiDates.push(endDateLocaleDateString)
            }

            // Get dimensions
            const allKeys = new Set()
            for (const item of responseData) {
              const keys = Object.keys(item)
              keys.forEach((key) => allKeys.add(key))
            }
            const dimensions = Array.from(allKeys)
            const keyToFind = 'createdAt'
            const index = dimensions.indexOf(keyToFind)

            this.defaultCategory = dimensions[index]
            this.defaultMetric = dimensions[4]

            this.serviceUrl = {
              defaultFile: responseData,
              defaultCategory: this.defaultCategory,
              defaultMetric: this.defaultMetric
            }
          })
          .catch(() => {})
          .finally()
      } catch (error) {
        console.error(error)
      }
    },

    getApiData(api) {
      axios
        .get(api)
        .then((response) => {
          const responseData = response.data
          this.apiData = responseData

          if (this.apiData) {
            let startDate = new Date(responseData[0].createdAt)
            let endDate = new Date(responseData[0].createdAt)

            responseData.forEach((item) => {
              const currentDate = new Date(item.createdAt)
              if (currentDate < startDate) {
                startDate = currentDate
              }
              if (currentDate > endDate) {
                endDate = currentDate
              }
            })

            const startDateLocaleDateString = startDate.toLocaleDateString()
            const endDateLocaleDateString = endDate.toLocaleDateString()

            this.apiDates.push(startDateLocaleDateString)
            this.apiDates.push(endDateLocaleDateString)
          }

          // Get dimensions
          const allKeys = new Set()
          for (const item of responseData) {
            const keys = Object.keys(item)
            keys.forEach((key) => allKeys.add(key))
          }
          const dimensions = Array.from(allKeys)
          const keyToFind = 'createdAt'
          const index = dimensions.indexOf(keyToFind)

          this.defaultCategory = dimensions[index]
          this.defaultMetric = dimensions[4]

          this.serviceUrl = {
            defaultFile: responseData,
            defaultCategory: this.defaultCategory,
            defaultMetric: this.defaultMetric
          }
        })
        .catch(() => {})
        .finally()
    }
  }
}
</script>

<style scoped>
.vue-grid-item.resizing {
  opacity: 0.9;
}

.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
  display: none;
}

.uploadData {
  border: 1px dashed;
  width: inherit;
}

.alignItems {
  background-color: #e0e0e0;
}

.icon-selected-color {
  color: #000;
}

.icon-default-color {
  color: #a4a3a4;
}
</style>
