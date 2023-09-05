import { createApp, defineAsyncComponent } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { registerPlugins } from '@/plugins'
import VueGridLayout from 'vue-grid-layout'

import mitt from 'mitt';

const app = createApp(App)

const eventBus = mitt();
app.provide('eventBus',eventBus);

registerPlugins(app)

// const PluggableWidget = defineAsyncComponent(() => import("../../charts-widget/src/App.vue"));
const ChartContainer = defineAsyncComponent(() => import("../../chart-container/src/App.vue"));

// app.component("PluggableWidget", PluggableWidget);
app.component("ChartContainer", ChartContainer);

app.use(createPinia()).use(VueGridLayout)

app.mount('#app')
