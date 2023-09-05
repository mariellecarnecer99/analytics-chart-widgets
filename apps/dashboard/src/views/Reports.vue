<template>
  <div class="mt-5 pt-15 px-10">
    <!-- <div class="mt-7">
      <v-row justify="space-between" no-gutters>
        <v-col cols="2">
          <v-icon>mdi-tune</v-icon> <span class="filter">Filters</span></v-col
        >
        <v-col cols="2">
          Assigned: <span class="filter">Everyone can edit</span>
        </v-col>
      </v-row>
    </div> -->
    <v-list density="compact" lines="one">
      <v-list-subheader color="primary" class="pa-0" v-if="reports.length"
        >REPORTS</v-list-subheader
      >

      <v-list-item
        v-for="(item, i) in reports"
        :key="i"
        :value="item"
        :title="item.name"
        :subtitle="item.description"
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
          <v-btn size="small" color="primary" icon="mdi-content-copy" variant="text"></v-btn>
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
import axios from 'axios'
export default {
  data: () => {
    return {
      reports: [],
      index: 0,
      actionItems: [{ title: 'Clone' }, { title: 'Delete' }]
    }
  },
  mounted() {
    this.getReports()
  },
  methods: {
    getReports() {
      axios
        .get('https://retoolapi.dev/4RV8By/reports')
        .then((response) => {
          const responseData = response.data
          this.reports = responseData
        })
        .catch((error) => {
          console.log(error)
        })
        .finally()
    },

    handleEditReport(e) {
      this.$router.push({ name: 'Edit Report', params: { id: e } })
    },

    handleDeleteItem(id) {
      axios
        .delete(`https://retoolapi.dev/4RV8By/reports/${id}`)
        .then((response) => {
          this.getReports()
        })
        .catch((error) => {
          console.log(error)
        })
        .finally()
    }
  }
}
</script>

<style scoped>
.filter {
  color: #463c6e;
}
.iconDelete {
  display: block;
  margin: 20px auto;
}
.reportsList {
  border-bottom: 1px solid #463c6e;
  padding: 10px !important;
}
</style>
