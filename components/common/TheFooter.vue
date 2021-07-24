<template>
  <v-footer
    :style="{ background: $vuetify.theme.themes['light'].background }"
    class="mt-md-6"
  >
    <v-container>
      <v-row class="grey--text text--darken-1 text-caption">
        <v-col cols="8"
          ><v-icon small>{{ $icons.mdiHelpCircleOutline }}</v-icon>
          support@examgap.com</v-col
        >
        <v-col cols="4" class="text-right">
          <v-icon small>{{ $icons.mdiArrowExpandHorizontal }}</v-icon>
          {{ $vuetify.breakpoint.name }} |
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon small v-on="on">{{
                $store.state.app.database === 'dev'
                  ? $icons.mdiAlphaDCircleOutline
                  : $icons.mdiAlphaPCircleOutline
              }}</v-icon>
            </template>
            <span>{{ database }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import {
  mdiArrowExpandHorizontal,
  mdiAlphaDCircleOutline,
  mdiAlphaPCircleOutline,
  mdiHelpCircleOutline,
} from '@mdi/js'

export default {
  name: 'TheFooter',
  computed: {
    database() {
      return this.$store.state.app.database === 'dev'
        ? 'Development'
        : 'Production'
    },
  },
  created() {
    this.$icons = {
      mdiArrowExpandHorizontal,
      mdiAlphaDCircleOutline,
      mdiAlphaPCircleOutline,
      mdiHelpCircleOutline,
    }
  },
}
</script>
