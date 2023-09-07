import { defineStore } from "pinia";

export const useSelectedChart = defineStore("selectedChart", {
  state: () => ({ fetchChartOptions: {}, selectedDates: [], cDetails: {}}),
  getters: {
    
  },
  actions: {
    getChartOptions(val: {}){
      this.fetchChartOptions = val;
    },
    getSelectedDates(val: []) {
      this.selectedDates = val;
    },
    getChartDetails(val: {}){
      this.cDetails = val
    }
  },
});

declare global {
  interface Window {
    useSelectedChart: typeof useSelectedChart;
  }
}
window.useSelectedChart = useSelectedChart;
