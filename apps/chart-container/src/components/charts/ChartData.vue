<template>
  <EChart
    v-if="chartLib === 'eCharts'"
    :option="options"
    :id="chartId"
    :chartType="chartType"
    :datexFilter="datexFilter"
    :chartDatesSwitch="chartDatesSwitch"
  />
  <ApexCharts
    v-if="chartLib === 'apexCharts' && isDataReady === true"
    :option="apexOptions"
    :apexSeries="apexOptions.series"
    :id="chartId"
    :chartType="chartType"
    :datexFilter="datexFilter"
    :chartDatesSwitch="chartDatesSwitch"
  />
  <ChartJS
    v-if="chartLib === 'chartjs'"
    :id="chartId"
    :option="datacollection"
    :chartType="chartType"
    :datexFilter="datexFilter"
    :chartDatesSwitch="chartDatesSwitch"
  />
  <DateRange v-if="control === 'daterange'" :dateRange="dateRange" />
  <v-text-field
    v-if="control === 'text'"
    v-model="text"
    class="py-8"
    variant="plain"
    density="compact"
    @input="handleChangedText"
  ></v-text-field>
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
    widgets: Object,
    selectedWidgets: Array,
    chartData: Object,
    modifiedChart: String,
    selectedOrientation: String,
    datexFilter: Array,
    dateyFilter: Array,
    chartJson: Object,
    uploadedData: Object,
    selectedDimensions: Object,
    selectedMetrics: Object,
    serviceUrl: Object,
    bgColor: String,
    bgSwitch: Boolean,
    chartFont: String,
    chartFontSize: Number,
    chartFontColor: String,
    chartPlotTitle: String,
    chartPlotTitleSwitch: Boolean,
    chartPlotTitleFont: String,
    chartPlotTitleFontSize: Number,
    chartPlotTitleFontColor: String,
    chartTickLabelsSwitch: Boolean,
    chartTickMarkersSwitch: Boolean,
    chartLegendSwitch: Boolean,
    chartDatesSwitch: Boolean,
    dateRange: Array,
    textControlColor: String,
    textControlText: String
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
      dateControl: [],
      datemenu: false,
      modifiedType: null,
      numofseries: 1,
      color: '#1976D2FF',
      gridColor: null,
      fontType: null,
      titleFontType: null,
      titleFontSize: null,
      titlePosition: 'right',
      mainTitle: null,
      xAxisData: [],
      titleSwitch: null,
      tickLabelsSwitch: null,
      tickMarkersSwitch: null,
      gridLinesSwitch: null,
      legendSwitch: false,
      fontSize: null,
      labelColor: null,
      titleColor: null,
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
      chartOrientation: null,
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
      text: null,
      textColor: null
    }
  },
  watch: {
    selectedDates: [
      {
        handler: 'getDates'
      }
    ],
    modifiedChart: {
      handler(newOption) {
        if (newOption != null) {
          this.modifiedType = newOption
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    selectedOrientation: {
      handler(newOption) {
        if (newOption != null) {
          this.chartOrientation = newOption
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    datexFilter: {
      handler(newOption) {
        if (newOption != null) {
          this.dataUpload = newOption
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    dateyFilter: {
      handler(newOption) {
        if (newOption != null) {
          this.seriesUpload = newOption
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    chartJson: {
      handler(newOption) {
        if (newOption != null) {
          if (this.chartLib === 'eCharts') {
            this.options = newOption
            this.chartsConfig = newOption
          }
          if (this.chartLib === 'apexCharts') {
            this.apexOptions = newOption
            this.chartsConfig = newOption
          }
          if (this.chartLib === 'chartjs') {
            this.datacollection = newOption
            this.chartsConfig = newOption
          }
        }
      }
    },
    uploadedData: {
      handler(newOption) {
        if (newOption != null) {
          this.getUniqueValues(
            newOption.uploadFile,
            newOption.uploadedCategory,
            newOption.uploadedMetric
          )
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    selectedDimensions: {
      handler(newOption) {
        if (newOption != null) {
          this.getUniqueValues(
            newOption.uploadFile,
            newOption.uploadedCategory,
            newOption.uploadedMetric
          )
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    selectedMetrics: {
      handler(newOption) {
        if (newOption != null) {
          this.getUniqueValues(
            newOption.uploadFile,
            newOption.uploadedCategory,
            newOption.uploadedMetric
          )
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    serviceUrl: {
      handler(newOption) {
        if (newOption != null) {
          this.getUniqueValues(
            newOption.defaultFile,
            newOption.defaultCategory,
            newOption.defaultMetric
          )
          this.handleOptions()
          this.handleApexOptions()
          this.handleChartjsOptions()
        }
      }
    },
    bgColor: {
      handler(newOption) {
        this.gridColor = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    bgSwitch: {
      handler(newOption) {
        this.gridLinesSwitch = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartFont: {
      handler(newOption) {
        this.fontType = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartFontSize: {
      handler(newOption) {
        this.fontSize = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartFontColor: {
      handler(newOption) {
        this.labelColor = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartPlotTitle: {
      handler(newOption) {
        this.mainTitle = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartPlotTitleSwitch: {
      handler(newOption) {
        this.titleSwitch = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartPlotTitleFont: {
      handler(newOption) {
        this.titleFontType = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartPlotTitleFontSize: {
      handler(newOption) {
        this.titleFontSize = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartPlotTitleFontColor: {
      handler(newOption) {
        this.titleColor = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartTickLabelsSwitch: {
      handler(newOption) {
        this.tickLabelsSwitch = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartTickMarkersSwitch: {
      handler(newOption) {
        this.tickMarkersSwitch = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    chartLegendSwitch: {
      handler(newOption) {
        this.legendSwitch = newOption
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }
    },
    textControlColor: {
      handler(newOption) {
        this.textColor = newOption
        // store.getControlOptions(this.textColor)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.dispatchEvent(new Event('resize'))
    })
    if (this.chartData) {
      this.handleGetReportsById(this.chartData)
    } else {
      this.handleOptions()
      this.handleApexOptions()
      this.handleChartjsOptions()
      this.handleTextControl()
    }
  },
  methods: {
    handleTextControl() {
      this.text = this.textControlText
    },

    handleGetReportsById(data) {
      this.handleOptions(data)
      this.handleApexOptions(data)
      this.handleChartjsOptions(data)
    },

    handleChangedText(event) {
      this.text = event.target.value
      store.getControlOptions(this.text)
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
        legend: { show: this.legendSwitch === true ? true : false },
        xAxis: {
          type: this.chartOrientation === 'horizontal' ? 'value' : 'category',
          // boundaryGap: false,
          show: this.chartType === 'pie' ? false : true,
          data:
            this.chartType === 'pie'
              ? null
              : this.chartOrientation === 'horizontal'
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
          }
        },
        yAxis: {
          type: this.chartOrientation === 'horizontal' ? 'category' : 'value',
          show: this.chartType === 'pie' ? false : true,
          data:
            this.chartType === 'pie'
              ? null
              : this.chartOrientation === 'horizontal'
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
          }
        },
        series: [
          {
            name: 'Referer of a Website',
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
        ],
        tableData: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Direct' },
          { value: 300, name: 'Email' }
        ]
      }

      if (this.chartLib === 'eCharts') {
        this.chartsConfig = this.options
        this.handleChartUpdate(this.chartId, this.chartsConfig)
      }

      if (val) {
        this.options = val
        this.chartsConfig = this.options
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
        legend: {
          show: this.legendSwitch === true ? true : false,
          showForSingleSeries: this.legendSwitch === true ? true : false,
          position: 'top'
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
            horizontal: this.chartOrientation === 'horizontal' ? true : false
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
                  name: 'Referer of a Website',
                  data: this.seriesUpload ? this.seriesUpload : [10, 41, 35, 51, 49]
                }
              ],
        tableData: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Direct' },
          { value: 300, name: 'Email' }
        ]
      }

      if (this.chartLib === 'apexCharts') {
        this.chartsConfig = this.apexOptions
        this.handleChartUpdate(this.chartId, this.chartsConfig)
      }

      if (val) {
        this.apexOptions = val
        this.chartsConfig = this.apexOptions
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
              label: 'Referer of a Website',
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
          indexAxis: this.chartOrientation === 'horizontal' ? 'y' : 'x',
          responsive: true,
          maintainAspectRatio: false,
          lineTension: 1,
          plugins: {
            legend: {
              display: this.legendSwitch === true ? true : false
            },
            title: {
              display: this.titleSwitch === true ? true : false,
              text: this.mainTitle,
              color: this.titleColor,
              font: {
                size: this.titleFontSize,
                family: this.titleFontType
              }
            }
          }
        },
        tableData: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Direct' },
          { value: 300, name: 'Email' }
        ],
        plugins: [plugin]
      }

      if (this.chartLib === 'chartjs') {
        this.chartsConfig = this.datacollection
        this.handleChartUpdate(this.chartId, this.chartsConfig)
      }

      if (val) {
        this.datacollection = val
        this.chartsConfig = this.datacollection
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
    getUniqueValues(data, key, metric) {
      // this.getType(data, key, metric)
      if (data != undefined) {
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
      }
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

    getDates(e) {
      if (this.dataUpload) {
        let mappedData = this.dataUpload

        const randomNumbers = []

        let newDateFormat = e.map((x) => {
          return (x = moment(x).format('L'))
        })

        let res = newDateFormat.map((x) => mappedData.find((date) => date == x))

        this.dataUpload = res
        this.handleOptions()
        this.handleApexOptions()
        this.handleChartjsOptions()
      }

      if (this.apiData) {
        let mappedData = this.apiData.map((date) => {
          const newDateFormat = moment(date.createdAt).format('DD-MM-YYYY')
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
      }
    }
  }
}
</script>
