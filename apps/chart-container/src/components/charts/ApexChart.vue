<template>
  <v-data-table-virtual
    v-if="chartType === 'table'"
    :headers="headers"
    :items="option?.tableData"
    hide-default-footer
    class="elevation-1"
    density="compact"
    item-key="name"
    height="318"
    item-value="name"
  >
    <template v-slot:item.chart="{ item }">
      <!-- <apexchart
        type="bar"
        :id="'chart' + item.index"
        :options="{
          chart: {
            toolbar: {
              show: false
            }
          },
          xaxis: { categories: [item.selectable.name] }
        }"
        :series="[{ data: [item.selectable.value] }]"
      ></apexchart> -->
    </template>
  </v-data-table-virtual>
  <apexchart
    v-if="chartType != 'table'"
    :id="'chart' + id"
    :key="apexSeries.length"
    :options="option"
    :series="apexSeries"
    height="100%"
  ></apexchart>
</template>

<script>
import { VDataTableVirtual } from 'vuetify/labs/VDataTable'
export default {
  components: {
    VDataTableVirtual
  },
  props: {
    option: Object,
    apexSeries: Array,
    id: Number,
    chartType: String
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
