<template>
  <v-snackbar v-model="onboard" :vertical="true" timeout="-1">
    <span class="font-weight-bold">({{ n }}/X)</span> {{ text }}
    <template #action="{ attrs }">
      <v-btn
        color="accent"
        plain
        class="mr-2"
        v-bind="attrs"
        @click="onboard = false"
      >
        <span class="text-uppercase">Close</span>
      </v-btn>
      <v-btn color="accent" plain v-bind="attrs" @click="$nuxt.$emit(evt)">
        <span class="text-uppercase">Show me how</span>
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
    evt: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      onboard: true,
    }
  },
}
</script>
