<template>
  <div
    class="text-caption text-right grey--text text--darken-1"
    style="width: 34%"
  >
    {{ $store.state.user.quote.quote }}—{{ $store.state.user.quote.author }}
  </div>
</template>

<script>
export default {
  name: 'TheQuoteOfTheDay',
  async fetch() {
    await this.$store.dispatch('user/getQuote')
  },
}
</script>
