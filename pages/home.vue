<template>
  <div>
    <h1>Home page</h1>
    <p class="red--text">secret: {{ $store.state.user.secret }}</p>
  </div>
</template>

<script>
// import EventBus from '@/plugins/eventBus.client'
// import EgGroupCard from '@/components/EgGroupCard'
// import { mdiPlus, mdiAccountGroupOutline } from '@mdi/js'

export default {
  components: {
    // EgGroupCard,
  },
  layout: 'app',
  head() {
    return {
      title: 'Home',
    }
  },
  created() {
    this.$store.dispatch('user/getUser')
  },
}
</script>
