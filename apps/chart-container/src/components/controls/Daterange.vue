<template>
  <div class="datepicker py-8">
    <VueDatePicker
      v-model="dates"
      placeholder="Select Date"
      format="MM/dd/yyyy"
      range
      menu-class-name="dp-custom-menu"
      :teleport="true"
      @update:model-value="handleDates"
    />
  </div>
</template>
<script>
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
import { useSelectedChart } from '../../stores/fetchSelectedChart'
const storeForDates = useSelectedChart()

export default {
  components: {
    VueDatePicker
  },
  props: {
    dateRange: Array
  },
  data: () => {
    return {
      dates: [],
      datesSelected: []
    }
  },
  watch: {
    dateRange: {
      handler(newOption) {
        this.dates = newOption
      }
    }
  },
  methods: {
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
      const currDate = moment(resultObject.startDate).startOf('day')
      const lastDate = moment(resultObject.endDate).startOf('day')

      while (currDate.clone().isSameOrBefore(lastDate)) {
        newDates.push(currDate.format('YYYY-MM-DD'))
        currDate.add(1, 'days')
      }
      this.datesSelected = newDates
      storeForDates.getSelectedDates(newDates)
      return this.datesSelected
    }
  }
}
</script>
<style lang="scss">
.datepicker {
  z-index: 0 !important;
  padding: 0 10px;
}
.dp-custom-menu {
  box-shadow: 0 0 8px #463c6e;
  z-index: 0 !important;
  position: fixed;
}
</style>
