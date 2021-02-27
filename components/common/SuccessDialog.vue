<template>
  <v-dialog v-model="dialog" width="400">
    <v-card class="modal">
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
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" elevation="0" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
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
    this.$icons = {
      mdiCheckCircleOutline,
    }
  },
  mounted() {
    this.$nuxt.$on('show-modal', () => {
      this.dialog = true
    })
  },
}
</script>
