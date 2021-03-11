<template>
  <v-footer :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-container class="grey--text text--darken-1 text-caption">
      Examgap&mdash;{{ new Date().getFullYear() }} | support@examgap.com |
      <v-icon small>{{ $icons.mdiArrowExpandHorizontal }}</v-icon>
      {{ $vuetify.breakpoint.name }}
    </v-container>
  </v-footer>
</template>

<script>
import { mdiArrowExpandHorizontal } from '@mdi/js'

export default {
  name: 'TheFooter',
  created() {
    this.$icons = { mdiArrowExpandHorizontal }
  },
}
</script>

<style scoped>
footer {
  border-top: 1px solid #e3dede !important;
  /* margin-top: 2em; */
}
</style>
