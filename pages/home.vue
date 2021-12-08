<template>
  <div>
    <!-- Teacher xx -->
    <template v-if="teacher">
      <v-container>
        <v-row class="justify-center">
          <v-col cols="12" md="10" class="pt-10">
            <p class="text-h5">
              <font-awesome-icon
                icon="fa-light fa-plus"
                class="mr-2"
                style="width: 24px"
              />
              Add assignment for&hellip;
            </p>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="10">
            <template v-for="(group, i) in groups">
              <v-tooltip :key="i" bottom>
                <template #activator="{ on }">
                  <v-btn
                    elevation="0"
                    large
                    rounded
                    outlined
                    :block="$vuetify.breakpoint.name === 'xs'"
                    color="primary darken-1"
                    class="mb-4"
                    :class="$vuetify.breakpoint.name !== 'xs' ? 'mr-4' : ''"
                    @click="addAssign(group)"
                    v-on="on"
                  >
                    {{ group.name }}
                  </v-btn>
                </template>
                <span>Add assignment</span>
              </v-tooltip>
            </template>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="10">
            <p class="text-h5">
              <font-awesome-icon
                icon="fa-light fa-clock-rotate-left"
                class="mr-2"
              />
              Recent assignments
            </p>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="9">
            <template v-for="(assignment, i) in recent">
              <teacher-assignment-card :key="i" :assignment="assignment" />
            </template>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <!-- Student xx -->
    <template v-else>
      <v-tabs
        v-model="tab"
        centered
        fixed-tabs
        background-color="transparent"
        style="border-bottom: 1px solid #d2d2d2 !important"
      >
        <v-tab>Assignments</v-tab>
        <v-tab>Revision</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <!-- Assignments xx -->
        <v-tab-item style="background-color: #fafafa">
          <v-container>
            <v-row class="justify-center">
              <v-col cols="12" md="10" :class="mobCenter">
                <v-btn-toggle v-model="upcoming" color="primary" mandatory>
                  <v-btn outlined> Upcoming </v-btn>
                  <v-btn outlined min-width="110"> Past </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row v-if="assignments.length > 0" class="justify-center">
              <v-col cols="12" md="10">
                <student-assignment-card
                  v-for="(assignment, i) in assignments"
                  :key="i"
                  :assignment="assignment"
                />
              </v-col>
            </v-row>
            <the-empty-assignments-state v-else />
          </v-container>
        </v-tab-item>
        <!-- Revision xx -->
        <v-tab-item style="background-color: #fafafa">
          <v-container>
            <v-row class="pt-3 md-pt-8">
              <revision-topic-card
                v-for="(topic, i) in topics"
                :key="i"
                :topic="topic"
              />
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
      <the-revision-mode-dialog />
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheRevisionModeDialog from '@/components/student/TheRevisionModeDialog'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'
import StudentAssignmentCard from '~/components/student/StudentAssignmentCard.vue'
import TheEmptyAssignmentsState from '~/components/common/TheEmptyAssignmentsState.vue'
import RevisionTopicCard from '~/components/student/RevisionTopicCard.vue'

export default {
  components: {
    TheRevisionModeDialog,
    TeacherAssignmentCard,
    StudentAssignmentCard,
    TheEmptyAssignmentsState,
    RevisionTopicCard,
  },
  layout: 'app',
  computed: {
    ...mapGetters({
      recent: 'user/recentAssignments',
      group: 'user/activeGroup',
    }),
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
      topics: (state) => state.topics.topics,
    }),
    assignments() {
      if (this.group === undefined) return []
      return this.group.assignments.filter((a) => a.live === !this.upcoming)
    },
    // Assignments/revision tab
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
    upcoming: {
      get() {
        return this.$store.state.app.upcoming
      },
      set(value) {
        this.$store.commit('app/setUpcoming', value)
      },
    },
    mobCenter() {
      return this.$vuetify.breakpoint.name === 'xs'
        ? 'd-flex justify-center'
        : ''
    },
  },
  mounted() {
    this.$store.commit('app/setLoading', false)
    const title = this.teacher ? 'Home' : this.group.name
    this.$store.commit('app/setPageTitle', title)
  },
  methods: {
    addAssign(group) {
      this.$store.commit('user/setActiveGroupId', group.id)
      this.$store.commit('topics/clearSelectedQuestions')
      this.$router.push(`/course/${group.course.id}`)
    },
    revise(topicId) {
      this.$store.commit('topics/setTopicId', topicId)
      this.$nuxt.$emit('show-revise')
    },
  },
}
</script>
