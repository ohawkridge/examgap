<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card>
      <v-card-title class="d-flex justify-center py-8">
        <i class="fa-regular fa-circle-check fa-4x ico-green"></i>
      </v-card-title>
      <v-card-text>
        <p class="text-h6 text-center">{{ title }}</p>
        <p class="text-center">{{ subtitle }}</p>
        <div class="d-flex justify-end">
          <v-btn color="primary" rounded elevation="0" @click="dialog = false">
            <span class="heading--text">Close</span>
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
  mounted() {
    this.$nuxt.$on('show-success', () => {
      this.dialog = true
    })
  },
}
</script>
