<template>
  <v-snackbar v-model="show" bottom left :timeout="timeout" :color="color">
    <!-- <span :class="$vuetify.theme.dark ? 'pb-text' : ''"> -->
    {{ message }}
    <!-- </span> -->
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
