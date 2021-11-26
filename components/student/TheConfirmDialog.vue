<template>
  <v-dialog v-model="dialog" width="440">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Are you sure? </v-card-title>
      <v-card-text>
        <p>Once you've seen the mark scheme, you can't go back.</p>
        <div class="d-flex justify-end">
          <v-btn text rounded class="mr-2" @click="dialog = false">Back</v-btn>
          <v-btn color="primary" rounded elevation="0" @click="selfMark()">
            Mark
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    }
  },
  beforeDestroy() {
    // Destroy event listeners to prevent memory leaks
    this.$nuxt.$off('show-confirm')
  },
  mounted() {
    this.$nuxt.$on('show-confirm', () => {
      this.dialog = true
    })
  },
  methods: {
    selfMark() {
      this.$store.commit('assignment/setMarking', false)
      this.$store.commit('app/setPageTitle', 'Marking')
      this.dialog = false
    },
  },
}
</script>
