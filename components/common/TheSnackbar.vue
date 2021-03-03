<template>
  <v-snackbar v-model="show" bottom left :timeout="timeout" :color="color">
    {{ message }}
    <template #action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="show = false">
        Close
      </v-btn>
    </template>
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
      timeout: 6000,
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
