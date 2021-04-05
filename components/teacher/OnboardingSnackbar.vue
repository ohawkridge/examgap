<template>
  <v-snackbar v-model="snack" :vertical="true" timeout="-1">
    <span class="font-weight-bold">({{ n }}/6)</span> {{ text }}
    <template #action="{ attrs }">
      <v-btn
        color="accent"
        plain
        v-bind="attrs"
        @click="
          $nuxt.$emit('close')
          snack = false
        "
      >
        <span class="text-uppercase">Close</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    n: {
      type: String,
      default: '1',
    },
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      snack: true,
    }
  },
}
</script>
