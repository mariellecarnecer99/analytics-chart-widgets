import { createApp, defineCustomElement } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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

// register
customElements.define('chart-widget', defineCustomElement(App))

const app = createApp(App)

registerPlugins(app)

// register globally (or you can do it locally)
app.component('v-chart', ECharts)

app.use(createPinia())

app.mount('#app')
