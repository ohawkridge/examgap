<template>
  <v-snackbar v-model="show" bottom left :timeout="timeout" :color="color">
    <span :class="cssColor">
      {{ message }}
    </span>
  </v-snackbar>
</template>

<script>
export default {
  name: 'TheSnackbar',
  data() {
    return {
      show: false,
      message: '',
      color: '',
      timeout: 5000,
    }
  },
  computed: {
    // Css classes to handle dark mode
    cssColor() {
      if (this.$vuetify.theme.dark) {
        if (this.color === 'error') return 'error-text'
        // Can extend if success color is changed
      }
      return ''
    },
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showSnack') {
        this.message = state.snackbar.msg
        this.color = state.snackbar.type
        this.show = true
      }
    })
  },
}
</script>

<style scoped>
.error-text {
  color: #680003;
}
</style>
