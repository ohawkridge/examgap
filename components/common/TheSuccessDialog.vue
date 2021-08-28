<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <svg
          height="92"
          width="92"
          viewBox="0 0 24 24"
          role="img"
          fill="#4caf50"
        >
          <path :d="$icons.mdiCheckCircleOutline"></path>
        </svg>
      </v-card-title>
      <v-card-text>
        <p class="text-h6 text-center">{{ title }}</p>
        <p class="text-center">{{ subtitle }}</p>
        <div class="d-flex justify-end">
          <v-btn color="primary" rounded elevation="0" @click="dialog = false">
            Close
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiCheckCircleOutline } from '@mdi/js'

export default {
  props: {
    title: {
      type: String,
      default: 'Success',
    },
    subtitle: {
      type: String,
      default: 'Action successful.',
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  created() {
    this.$icons = { mdiCheckCircleOutline }
  },
  mounted() {
    this.$nuxt.$on('show-success', () => {
      this.dialog = true
    })
  },
}
</script>
