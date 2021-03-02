<template>
  <div>
    <v-row v-if="teacher">
      <v-col id="div1" cols="12">
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
      <v-col v-if="tab">
        <v-card
          id="create-card"
          hover
          class="d-flex align-center justify-center"
          outlined
          height="172"
          @click="emitNew"
        >
          <v-btn color="primary" text>
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            Create class
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="!teacher">
      <v-col id="div1" cols="12">
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
          <v-card-title>
            Assignments ({{ group ? group.assignments.length : '-' }})
          </v-card-title>
          <v-card-text>
            <Assignments v-if="group" :assignments="group.assignments" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-row>
          <v-col cols="12">
            <Quote />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader :loading="$fetchState.pending" type="card">
              <v-card>
                <v-card-title>
                  Revision topics ({{ topics.length }})
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="(topic, i) in topics"
                      :key="i"
                      :title="`Revise ${topic.name}`"
                      class="rev-item"
                      :disabled="topic.count === 0"
                      @click="revise(topic)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ topic.name }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-chip
                          :color="topic.answered > 0 ? 'green-chip' : ''"
                          >{{ topic.answered }}</v-chip
                        >
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <RevisionDialog v-if="!teacher" />
  </div>
</template>

<script>
import { mdiPlus } from '@mdi/js'
import { mapState, mapGetters } from 'vuex'
import GroupCard from '../components/teacher/GroupCard'
import Assignments from '../components/student/Assignments'
import RevisionDialog from '../components/student/RevisionDialog'
import Quote from '../components/student/Quote'

export default {
  components: {
    GroupCard,
    Assignments,
    Quote,
    RevisionDialog,
  },
  layout: 'app',
  data() {
    return {
      forceFetch: false,
    }
  },
  async fetch() {
    // For students, fetch revision topics to store
    // (if not stored already)
    if (
      this.forceFetch ||
      (!this.teacher && this.topics.length === 0 && this.group)
    ) {
      await this.$store.dispatch(
        'groups/getRevisionTopics',
        this.group.course.id
      )
      this.forceFetch = false
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
      topics: (state) => state.groups.revisionTopics,
    }),
    // For students, we need the active group to display assignments
    // For teachers, we need active/archive groups depending on tab
    ...mapGetters({
      group: 'groups/activeGroup',
      groups: 'groups/activeGroups',
    }),
    // Remember which tab is active
    tab: {
      get() {
        return this.$store.state.groups.tab
      },
      set(value) {
        this.$store.commit('groups/setTab', value)
      },
    },
  },
  watch: {
    // Update revision topics if class is changed
    // (Except if currently logging out)
    group() {
      if (this.group !== undefined && Object.entries(this.group).length > 0) {
        this.forceFetch = true
        this.$fetch()
      }
    },
  },
  created() {
    this.$icons = { mdiPlus }
  },
  methods: {
    // Remember topic being revised
    revise(topic) {
      this.$store.commit('groups/setCurrentRevisionTopic', topic)
      // Event bus using Nuxt
      // https://aneesshameed.medium.com/event-bus-in-nuxt-7728315e81b6
      this.$nuxt.$emit('show-revise')
    },
    // Trigger event to show create class dialog
    emitNew() {
      this.$nuxt.$emit('show-create')
    },
  },
}
</script>

<style scoped>
/* style student revision counts */
span.v-chip.theme--light.green-chip {
  background-color: rgb(201, 237, 194) !important;
  color: rgb(18, 39, 14) !important;
}
</style>
