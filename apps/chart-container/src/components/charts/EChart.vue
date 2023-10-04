<template>
  <div v-if="chartDatesSwitch === true" class="selectedDates d-flex mt-2 ml-3 text-center">
    <v-icon class="mt-1" color="primary">mdi-calendar</v-icon>
    <v-chip v-for="item in datexFilter" class="ma-1" color="primary" size="small" label>
      {{ item }}
    </v-chip>
  </div>
  <v-data-table
    v-if="chartType === 'table'"
    :headers="headers"
    :items="option?.tableData"
    item-key="name"
    class="elevation-1"
    density="compact"
  >
    <template v-slot:item.chart="{ item }">
      <!-- <v-chart
        :id="'chart' + item.index"
        :option="{
          tooltip: {},
          legend: {},
          xAxis: {
            type: 'category',
            data: [item.selectable.name]
          },
          yAxis: {
            type: 'value'
          },
          series: [{ data: [item.selectable.value], type: 'bar' }]
        }"
        class="chart-container"
        autoresize
      ></v-chart> -->
    </template>
  </v-data-table>
  <v-chart v-if="chartType != 'table'" :id="'chart' + id" :option="option" autoresize />
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
export default {
  components: {
    VDataTable
  },
  props: {
    option: Object,
    id: Number,
    chartType: String,
    datexFilter: Object,
    chartDatesSwitch: Boolean
  },
  data: () => {
    return {
      aggregatedData: {},
      headers: [
        {
          title: 'Title',
          align: 'start',
          sortable: false,
          key: 'name'
        },
        { title: 'Value', align: 'start', key: 'value' }
        // { title: 'Chart', align: 'center', sortable: false, key: 'chart' }
      ]
    }
  },
  watch: {
    option: [
      {
        handler: 'aggregateTableValues'
      }
    ]
  },
  methods: {
    aggregateTableValues(e) {
      e.tableData.forEach((item) => {
        const { name, value } = item

        // If the name exists in the aggregatedData object, add the value to it
        if (this.aggregatedData[name]) {
          this.aggregatedData[name] += value
        } else {
          // If the name doesn't exist, create a new entry with the value
          this.aggregatedData[name] = value
        }
      })

      // Convert the aggregated data back to an array of objects
      this.option.tableData = Object.keys(this.aggregatedData).map((name) => ({
        name,
        value: this.aggregatedData[name]
      }))
    }
  }
}
</script>

<style>
.chart-container {
  height: 400px;
}
</style>
