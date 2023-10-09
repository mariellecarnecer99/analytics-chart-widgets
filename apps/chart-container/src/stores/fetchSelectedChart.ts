import { defineStore } from "pinia";

export const useSelectedChart = defineStore("selectedChart", {
  state: () => ({ fetchChartOptions: {}, selectedDates: [], widgets: [], fetchControlOptions: ''}),
  getters: {
    
  },
  actions: {
    getChartOptions(val: {}){
      this.fetchChartOptions = val;
    },
    getSelectedDates(val: []) {
      this.selectedDates = val;
    },
    getWidgets(val: []) {
      this.widgets = val
    },
    getControlOptions(val: '') {
      this.fetchControlOptions = val
    }
  },
});

declare global {
  interface Window {
    useSelectedChart: typeof useSelectedChart;
  }
}
window.useSelectedChart = useSelectedChart;
