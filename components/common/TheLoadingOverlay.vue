<template>
  <v-overlay :value="loading">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TheLoadingOverlay',
  computed: {
    ...mapState({
      loading: (state) => state.user.loading,
    }),
  },
}
</script>
