<template>
  <v-container class="pt-3 pt-md-10">
    <!-- Teacher xx -->
    <template v-if="teacher">
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <p class="text-h5">
            <font-awesome-icon
              icon="fa-light fa-plus"
              class="mr-2"
              style="width: 24px"
            />
            New assignment for&hellip;
          </p>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="9" class="d-flex justify-space-around">
          <template v-for="(group, i) in groups">
            <v-tooltip :key="i" bottom>
              <template #activator="{ on }">
                <v-btn
                  elevation="0"
                  large
                  rounded
                  :block="$vuetify.breakpoint.name === 'xs'"
                  :color="$vuetify.theme.dark ? '#620d1e' : '#ffd9dc'"
                  class="mb-4"
                  @click="newAssignment(group)"
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
        <v-col cols="12" md="8">
          <template v-for="(assignment, i) in assignments">
            <teacher-assignment-card :key="i" :assignment="assignment" />
          </template>
        </v-col>
      </v-row>
    </template>
    <!-- Student xx -->
    <template v-else>
      <v-row class="justify-center">
        <v-col cols="12" md="8" class="d-flex">
          <font-awesome-icon
            icon="fa-light fa-quote-left"
            class="section-icon"
          />
          <p class="text-subtitle-1 pl-2">
            {{ quote.quote }}&mdash;<span class="font-weight-light">{{
              quote.author
            }}</span>
          </p>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="8">
          <p class="text-h5">
            <font-awesome-icon
              icon="fa-light fa-calendar-star"
              class="section-icon"
            />
            Upcoming assignments
          </p>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="8">
          <template v-if="$fetchState.pending">
            <assignment-card-loader v-for="i in 1" :key="i" />
          </template>
          <student-assignment-card
            v-for="(assignment, i) in assignments"
            v-else-if="!$fetchState.pending && assignments.length > 0"
            :key="i"
            :assignment="assignment"
          />
          <!-- Empty state xx -->
          <template v-else>
            <v-img
              src="/no-task.svg"
              width="180"
              height="130"
              contain
              class="mx-auto"
              alt="Books and pens illustrations"
            />
            <p class="text-center mt-4">No upcoming assignments</p>
          </template>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="8">
          <p class="text-h5">
            <font-awesome-icon
              icon="fa-light fa-head-side-brain"
              class="section-icon"
            />
            Revise
          </p>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="8">
          <template v-for="(group, i) in groups">
            <v-btn
              :key="i"
              elevation="0"
              large
              rounded
              :block="$vuetify.breakpoint.name === 'xs'"
              :color="$vuetify.theme.dark ? '#620d1e' : '#ffd9dc'"
              class="mb-4 mr-4"
              @click="revise(group.id)"
            >
              {{ group.course.name }}
            </v-btn>
          </template>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'
import StudentAssignmentCard from '~/components/student/StudentAssignmentCard.vue'
import AssignmentCardLoader from '~/components/student/AssignmentCardLoader.vue'

export default {
  components: {
    TeacherAssignmentCard,
    StudentAssignmentCard,
    AssignmentCardLoader,
  },
  layout: 'app',
  async fetch() {
    console.debug(
      '%c' + 'Fetch',
      'padding:2px 4px;background-color:#ffe089;color:#765b00;border-radius:3px'
    )
    await this.$store.dispatch('user/getQuote')
    await this.$store.dispatch('group/getUpcoming')
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
      quote: (state) => state.user.quote,
      assignments: (state) => state.group.assignments,
    }),
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Home')
  },
  methods: {
    newAssignment(group) {
      this.$store.commit('user/setActiveGroupId', group.id)
      this.$router.push(`/questions/${group.course.id}`)
    },
    revise(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$store.commit('app/setTab', 1)
      this.$router.push(`/class/${groupId}`)
    },
  },
}
</script>

<style scoped>
/* align section icons */
.section-icon {
  width: 24px;
  height: 24px;
  margin-right: 16px;
}
</style>
