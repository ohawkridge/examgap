<template>
  <v-container>
    <!-- Teacher xx -->
    <template v-if="teacher">
      <v-row class="justify-center">
        <v-col cols="12" md="10" class="pt-10">
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
                  color="#ffd9dc"
                  class="mb-4"
                  :class="$vuetify.breakpoint.name !== 'xs' ? 'mr-4' : ''"
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
          <template v-for="(assignment, i) in recent">
            <teacher-assignment-card :key="i" :assignment="assignment" />
          </template>
        </v-col>
      </v-row>
    </template>
    <!-- Student xx -->
    <template v-else>
      <v-row class="justify-center">
        <v-col cols="12" md="8" class="pt-10">
          <p class="text-h5">
            <font-awesome-icon icon="fa-light fa-quote-left" class="fw" />
            {{ quote.quote }}&mdash;{{ quote.author }}
          </p>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="8">
          <p class="text-h5">
            <font-awesome-icon icon="fa-light fa-head-side-brain" class="fw" />
            Revise
          </p>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="8">
          <template v-for="(course, i) in courses">
            <v-btn
              :key="i"
              elevation="0"
              large
              rounded
              :block="$vuetify.breakpoint.name === 'xs'"
              color="#ffd9dc"
              class="mb-4"
              :class="$vuetify.breakpoint.name !== 'xs' ? 'mr-4' : ''"
            >
              {{ course.name }}
            </v-btn>
          </template>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="8">
          <p class="text-h5">
            <font-awesome-icon icon="fa-light fa-calendar-star" class="fw" />
            Upcoming assignments
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8">
          <p class="red--text">{{ recent }}</p>
          <!-- <student-assignment-card
                  v-for="(assignment, i) in group.assignments"
                  :key="i"
                  :assignment="assignment"
                /> -->
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import TheRevisionModeDialog from '@/components/student/TheRevisionModeDialog'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'
// import StudentAssignmentCard from '~/components/student/StudentAssignmentCard.vue'
// import TheEmptyAssignmentsState from '~/components/common/TheEmptyAssignmentsState.vue'
// import RevisionTopicCard from '~/components/student/RevisionTopicCard.vue'

export default {
  components: {
    // TheRevisionModeDialog,
    TeacherAssignmentCard,
    // StudentAssignmentCard,
    // TheEmptyAssignmentsState,
    // RevisionTopicCard,
  },
  layout: 'app',
  async fetch() {
    await this.$store.dispatch('user/getQuote')
  },
  computed: {
    ...mapGetters({
      recent: 'user/recentAssignments',
      group: 'user/activeGroup',
      courses: 'user/courses',
    }),
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
      quote: (state) => state.user.quote,
    }),
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Home')
  },
  methods: {
    newAssignment(group) {
      this.$store.commit('user/setActiveGroupId', group.id)
      this.$router.push(`/browse/${group.course.id}`)
    },
  },
}
</script>

<style scoped>
.fw {
  width: 24px;
  margin-right: 16px;
}
</style>
