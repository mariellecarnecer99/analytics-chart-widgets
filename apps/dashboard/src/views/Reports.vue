<template>
  <div class="mt-5 pt-15 px-10">
    <v-list density="compact" lines="one">
      <v-list-subheader v-if="reports.length" color="primary" class="pa-0"
        >REPORTS</v-list-subheader
      >

      <v-list-item
        v-for="(item, i) in reports"
        :key="i"
        :value="item"
        :title="item.name"
        prepend-icon="mdi-file"
        color="primary"
        class="reportsList"
      >
        <template v-slot:append>
          <v-btn
            size="small"
            color="primary"
            icon="mdi-pencil"
            variant="text"
            @click="handleEditReport(item.id)"
          ></v-btn>
          <v-dialog transition="dialog-bottom-transition" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn
                size="small"
                variant="text"
                color="primary"
                icon="mdi-delete"
                v-bind="props"
              ></v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card class="text-center">
                <v-icon size="80" color="red" class="iconDelete">mdi-close-circle-outline</v-icon>
                <v-card-title class="text-h5"> Are you sure? </v-card-title>
                <v-card-text
                  >Do you really want to delete this report? This process cannot be undone.
                </v-card-text>
                <v-card-actions class="d-block mb-5">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="text-grey-darken-2"
                    variant="outlined"
                    @click="isActive.value = !isActive.value"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="red"
                    variant="outlined"
                    @click="(isActive.value = !isActive.value), handleDeleteItem(item.id)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { getAllReports, deleteReport } from '../services/reports'
export default {
  data: () => {
    return {
      reports: [],
      index: 0
    }
  },
  mounted() {
    this.getReports()
  },
  methods: {
    getReports() {
      getAllReports()
        .then((response) => {
          const responseData = response.data
          this.reports = responseData
        })
        .catch(() => {})
        .finally()
    },

    handleEditReport(e) {
      this.$router.push({ path: '/report', query: { id: e } })
    },

    handleDeleteItem(id) {
      deleteReport(id)
        .then(() => {
          this.getReports()
        })
        .catch(() => {})
        .finally()
    }
  }
}
</script>

<style scoped>
.iconDelete {
  display: block;
  margin: 20px auto;
}
.reportsList {
  border-bottom: 1px solid #463c6e;
  padding: 10px !important;
}
</style>
