<template>
  <div>
    <h1>Home page</h1>
    <p>Store:</p>
    <ul id="v-for-object" class="demo">
      <li v-for="(value, i) in $store.state.user" :key="i">
        {{ value }}
      </li>
    </ul>
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
}
</script>
