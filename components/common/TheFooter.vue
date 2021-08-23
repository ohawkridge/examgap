<template>
  <v-footer color="transparent" app inset absolute>
    <v-container>
      <v-row class="text-caption">
        <v-col cols="12" class="d-flex justify-space-between">
          support@examgap.com
          <div>
            <v-icon small>{{ $icons.mdiArrowExpandHorizontal }}</v-icon>
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
}
</script>
