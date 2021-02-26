<template>
  <div>
    <v-row v-if="teacher">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <v-btn-toggle v-model="tab" color="primary" group mandatory>
            <v-btn :value="true" class="rounded"> Classes </v-btn>
            <v-btn :value="false" class="rounded"> Archive </v-btn>
          </v-btn-toggle>
          <v-btn color="primary" outlined @click="emitNew">
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
            <div>
              <v-btn text @click="$fetch">Fetch</v-btn>
            </div>
            <v-card>
              <v-card-title> Revise {{ group.course.name }} </v-card-title>
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
                      <v-chip :color="topic.answered > 0 ? 'green-chip' : ''">{{
                        topic.answered
                      }}</v-chip>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
  async fetch() {
    // For students, fetch revision topics to store
    if (!this.teacher) {
      console.log(`getRevisionTopics...`)
      await this.$store.dispatch(
        'groups/getRevisionTopics',
        this.group.course.id
      )
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
    // For students, just get the active group
    ...mapGetters({
      group: 'groups/activeGroup',
    }),
    // For teachers, get all groups based on tab value
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
  watch: {
    // Update topics if class is changed (except on logout)
    group() {
      if (Object.entries(this.user).length > 0) {
        this.$fetch()
      }
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
/* style student revision counts */
span.v-chip.theme--light.green-chip {
  background-color: rgb(201, 237, 194) !important;
  color: rgb(18, 39, 14) !important;
}
</style>
