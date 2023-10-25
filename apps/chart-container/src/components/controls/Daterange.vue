<template>
  <div class="datepicker py-8">
    <VueDatePicker
      v-model="dates"
      placeholder="Select Date"
      format="MM/dd/yyyy"
      range
      menu-class-name="dp-custom-menu"
      :teleport="true"
      :preset-dates="presetDates"
      @update:model-value="handleDates"
    >
      <template #preset-date-range-button="{ label, value, presetDate }">
        <span
          role="button"
          :tabindex="0"
          @click="presetDate(value)"
          @keyup.enter.prevent="presetDate(value)"
          @keyup.space.prevent="presetDate(value)"
        >
          {{ label }}
        </span>
      </template>
    </VueDatePicker>
  </div>
</template>
<script>
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subDays,
  subQuarters,
  subYears,
  startOfWeek,
  endOfWeek
} from 'date-fns'
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
      datesSelected: [],
      presetDates: [
        {
          label: 'Last 7 days',
          value: [subDays(new Date(), 7), new Date()]
        },
        {
          label: 'Last 14 days',
          value: [subDays(new Date(), 14), new Date()]
        },
        {
          label: 'Last 28 days',
          value: [subDays(new Date(), 28), new Date()]
        },
        {
          label: 'Last 30 days',
          value: [subDays(new Date(), 30), new Date()]
        },
        { label: 'Today', value: [new Date(), new Date()] },
        {
          label: 'Yesterday',
          value: [subDays(new Date(), 1), subDays(new Date(), 1)]
        },
        {
          label: 'This week',
          value: [startOfWeek(new Date()), endOfWeek(new Date())]
        },
        {
          label: 'Last week',
          value: [startOfWeek(subDays(new Date(), 7)), endOfWeek(subDays(new Date(), 7))]
        },
        { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
        {
          label: 'Last month',
          value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))]
        },
        {
          label: 'This quarter',
          value: [startOfMonth(subQuarters(new Date(), 0)), endOfMonth(subQuarters(new Date(), 0))]
        },
        {
          label: 'Last quarter',
          value: [startOfMonth(subQuarters(new Date(), 1)), endOfMonth(subQuarters(new Date(), 1))]
        },
        { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] },
        {
          label: 'Last year',
          value: [startOfYear(subYears(new Date(), 1)), endOfYear(subYears(new Date(), 1))]
        }
      ]
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
      storeForDates.getSelectedDates(this.datesSelected)
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
