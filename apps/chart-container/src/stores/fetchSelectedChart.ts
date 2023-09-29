import { defineStore } from "pinia";

export const useSelectedChart = defineStore("selectedChart", {
  state: () => ({ fetchChartOptions: {}, selectedDates: [], title: '', widgets: []}),
  getters: {
    
  },
  actions: {
    getChartOptions(val: {}){
      this.fetchChartOptions = val;
    },
    getSelectedDates(val: []) {
      this.selectedDates = val;
    },
    getChartTitle(val: ''){
      this.title = val
    },
    getWidgets(val: []) {
      this.widgets = val
    }
  },
});

declare global {
  interface Window {
    useSelectedChart: typeof useSelectedChart;
  }
}
window.useSelectedChart = useSelectedChart;
