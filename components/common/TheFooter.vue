<template>
  <v-footer color="transparent" app inset absolute>
    <v-container>
      <v-row class="text-caption grey--text text--darken-2">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          support@examgap.com
          <div class="d-flex align-center">
            <div id="headway"></div>
            <v-icon small class="mr-1">{{
              $icons.mdiArrowExpandHorizontal
            }}</v-icon>
            {{ $vuetify.breakpoint.name }}
          </div>
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
  mounted() {
    const config = {
      selector: '#headway',
      account: 'yE6G2x',
    }
    // eslint-disable-next-line no-undef
    Headway.init(config)
  },
}
</script>
