<template>
  <v-row>
    <v-col cols="12">
      <div
        v-if="group.name !== undefined"
        class="text-h6 font-weight-bold d-flex justify-space-between"
      >
        {{ group.name }}
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              color="primary"
              text
              v-on="on"
              @click="overlay = !overlay"
            >
              {{ code }}
              <v-icon right>{{ $icons.mdiFullscreen }}</v-icon>
            </v-btn>
          </template>
          <span>Fullscreen code</span>
        </v-tooltip>
      </div>
      <div v-if="group.course.name !== undefined">
        {{ group.course.name }} ({{ group.course.board }})
      </div>
      <v-divider class="primary" />
      <v-overlay
        opacity="0.86"
        :value="overlay"
        @click.native="overlay = !overlay"
      >
        <div class="font-weight-bold white--text vbig">{{ code }}</div>
      </v-overlay>
    </v-col>
  </v-row>
</template>

<script>
import { mdiFullscreen } from '@mdi/js'

export default {
  props: {
    group: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      overlay: false,
    }
  },
  computed: {
    // Format code like 123-456
    code() {
      return `${this.group.code.substring(0, 3)}-${this.group.code.substring(
        3,
        6
      )}`
    },
  },
  created() {
    this.$icons = {
      mdiFullscreen,
    }
  },
}
</script>

<style scoped>
.vbig {
  font-size: 20vw;
}
</style>
