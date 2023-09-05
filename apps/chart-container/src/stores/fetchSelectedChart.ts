import { defineStore } from "pinia";

export const useSelectedChart = defineStore("selectedChart", {
  state: () => ({ fetchChartOptions: {}, selectedDates: []}),
  getters: {
    
  },
  actions: {
    getChartOptions(val: {}){
      this.fetchChartOptions = val;
    },
    getSelectedDates(val: []) {
      this.selectedDates = val;
    }
  },
});

declare global {
  interface Window {
    useSelectedChart: typeof useSelectedChart;
  }
}
window.useSelectedChart = useSelectedChart;
