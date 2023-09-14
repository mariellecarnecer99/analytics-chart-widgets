<template>
  <div>
    <v-app-bar color="rgba(233, 73, 93)" class="flex-grow-0" dark>
      <v-app-bar-title>
        <v-icon icon="mdi-file-chart-outline" color="white" />
        <span class="ml-3" style="color: white">Analytics Chart Widgets</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="mr-5" variant="flat" size="small" color="primary" @click="handleAddReport"
        >Add report</v-btn
      >
    </v-app-bar>
  </div>
</template>

<script>
export default {
  methods: {
    handleAddReport() {
      this.$router.push({ name: 'Add Report' })
    }
  }
}
</script>
