<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card>
      <v-card-title class="d-flex justify-center py-6">
        <font-awesome-icon
          icon="fa-light fa-circle-check"
          class="fa-4x ico-green"
        />
      </v-card-title>
      <v-card-text>
        <p class="text-h5 text-center">{{ title }}</p>
        <p class="text-center text-body-1">{{ subtitle }}</p>
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
  beforeDestroy() {
    this.$nuxt.$off('show-success')
  },
  mounted() {
    this.$nuxt.$on('show-success', () => {
      this.dialog = true
    })
  },
}
</script>
