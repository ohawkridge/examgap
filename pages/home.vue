<template>
  <div>
    <v-row>
      <v-col id="nav" cols="12">
        <div class="d-flex justify-space-between align-center">
          <v-btn-toggle v-model="tab" color="primary" group mandatory>
            <v-btn :value="true" class="rounded"> Classes </v-btn>
            <v-btn :value="false" class="rounded"> Archive </v-btn>
          </v-btn-toggle>
          <v-btn color="primary" text @click="emitNew">
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            {{ $vuetify.breakpoint.name == 'xs' ? 'Class' : 'Create Class' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(group, i) in groups" :key="i" cols="12" md="6" lg="4">
        <GroupCard :group="group" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.client'
import GroupCard from '@/components/teacher/GroupCard'
import { mdiPlus } from '@mdi/js'

export default {
  components: {
    GroupCard,
  },
  layout: 'app',
  // Call an action on the store to fetch user's groups
  async fetch({ store }) {
    await store.dispatch('groups/getGroups')
  },
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    // Get active/archive groups from store
    groups() {
      return this.$store.getters['groups/activeGroups'](this.tab)
    },
    // Remember which tab is active
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
  },
  created() {
    this.$icons = { mdiPlus }
  },
  methods: {
    emitNew() {
      EventBus.$emit('new-class')
    },
  },
}
</script>

<style scoped>
div #nav {
  border-bottom: 1px solid #0078a0 !important;
}
</style>
