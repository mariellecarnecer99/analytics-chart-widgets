import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { registerPlugins } from '@/plugins'

import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout'
import ECharts from 'vue-echarts'
import { use } from "echarts/core"
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
    BarChart, LineChart, PieChart, ScatterChart
} from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    ToolboxComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
])

const app = createApp(App)

const eventBus = mitt();
app.provide('eventBus',eventBus);

registerPlugins(app)

// register globally (or you can do it locally)
app.component('v-chart', ECharts)

app.use(createPinia()).use(VueGridLayout)

app.mount('#app')
