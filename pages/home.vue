<template>
  <div>
    <v-row v-if="teacher">
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
    <v-row v-if="teacher">
      <v-col v-for="(group, i) in groups" :key="i" cols="12" md="6" lg="4">
        <GroupCard :group="group" />
      </v-col>
    </v-row>
    <v-row v-if="!teacher">
      <v-col id="nav" cols="12">
        <div class="text-h6 font-weight-bold">
          {{ group.name }}
        </div>
        <div>{{ group.course.name }} ({{ group.course.board }})</div>
      </v-col>
    </v-row>
    <v-row v-if="!teacher" class="d-flex justify-center">
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title class="text-h6"> Assignments () </v-card-title>
          <v-card-subtitle> </v-card-subtitle>
          <v-card-text>
            <Assignments :group-id="group.id" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <Quote />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import EventBus from '@/plugins/eventBus.client'
import GroupCard from '@/components/teacher/GroupCard'
import { mdiPlus } from '@mdi/js'
import Quote from '@/components/student/quote.vue'

export default {
  components: {
    GroupCard,
    Quote,
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
    ...mapState({
      teacher: (state) => state.user.teacher,
    }),
    // For students, get the active group
    ...mapGetters({
      group: 'groups/activeGroup',
    }),
    // For teachers, get groups based on tab value
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
#nav {
  border-bottom: 1px solid #0078a0 !important;
}
</style>
