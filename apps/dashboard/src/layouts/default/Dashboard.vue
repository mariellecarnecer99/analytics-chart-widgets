<template>
  <v-app>
    <Header />
    <Reports />
  </v-app>
</template>

<script>
import Header from './Header.vue'
import Reports from '@/views/Reports.vue'
export default {
  components: {
    Header,
    Reports
  }
}
</script>
