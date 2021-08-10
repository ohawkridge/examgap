<template>
  <v-footer color="transparent" fixed>
    <v-container>
      <v-row class="text-caption">
        <v-col cols="12" class="d-flex justify-end align-center">
          support@examgap.com
          <v-icon small class="ml-2 mr-1">{{
            $icons.mdiArrowExpandHorizontal
          }}</v-icon>
          {{ $vuetify.breakpoint.name }} | {{ $route.name }}
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { mdiArrowExpandHorizontal } from '@mdi/js'

export default {
  name: 'TheFooter',
  created() {
    this.$icons = {
      mdiArrowExpandHorizontal,
    }
  },
}
</script>
