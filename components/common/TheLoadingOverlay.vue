<template>
  <v-overlay :value="$store.state.app.loading">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'TheLoadingOverlay',
}
</script>
