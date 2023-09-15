import { defineStore } from "pinia";

export const useSelectedChart = defineStore("selectedChart", {
  state: () => ({ fetchChartOptions: {}, selectedDates: [], title: '', desc: '', widgets: []}),
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
    getChartDesc(val: ''){
      this.desc = val
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
