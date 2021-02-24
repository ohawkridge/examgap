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
        <div v-if="group" class="text-h6 font-weight-bold">
          {{ group.name }}
        </div>
        <div v-if="group">
          {{ group.course.name }} ({{ group.course.board }})
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!teacher" class="d-flex justify-center">
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title class="text-h6">
            Assignments ({{
              group.assignments ? group.assignments.length : '-'
            }})
          </v-card-title>
          <v-card-text>
            <Assignments
              v-if="group.assignments"
              :assignments="group.assignments"
            />
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
import Assignments from '@/components/student/assignments'
import Quote from '@/components/student/quote'
import { mdiPlus } from '@mdi/js'

export default {
  components: {
    GroupCard,
    Assignments,
    Quote,
  },
  layout: 'app',
  // Call fetch (must be at page level) to dispatch
  // a store action to get all data for the page
  // Only needed for teachers (student groups are
  // part of getUser.js data structure
  async fetch() {
    if (this.teacher) {
      await this.$store.dispatch('groups/getGroups')
    }
  },
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
      assignments: (state) => state.assignments.assignments,
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
  border-bottom: 2px solid #0078a0 !important;
}
</style>
