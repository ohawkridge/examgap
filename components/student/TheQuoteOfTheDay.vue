<template>
  <v-row class="justify-center text-center">
    <v-col cols="7">
      <p class="text-h5 font-weight-light mt-12">
        {{ $store.state.user.quote }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TheQuoteOfTheDay',
  async fetch() {
    await this.$store.dispatch('user/getQuote')
  },
}
</script>
