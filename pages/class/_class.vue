<template>
  <div>
    <v-tabs
      v-model="tab"
      align-with-title
      background-color="transparent"
      style="border-bottom: 1px solid #d2d2d2 !important"
      color="secondary"
    >
      <v-tab style="text-transform: capitalize"> Assignments </v-tab>
      <v-tab style="text-transform: capitalize"> Revision </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :style="`background-color: ${bgColor}`">
        <!-- Assignments xx -->
        <v-container class="pt-10">
          <v-row class="justify-center">
            <v-col class="12" md="8">
              <!-- Skeletons xx -->
              <template v-if="$fetchState.pending">
                <assignment-card-loader v-for="i in 4" :key="i" />
              </template>
              <student-assignment-card
                v-for="(assignment, i) in assignments"
                v-else
                :key="i"
                :assignment="assignment"
                :course-name="group.course.name"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item :style="`background-color: ${bgColor}`">
        <v-container class="pt-10">
          <v-row class="justify-center">
            <v-col cols="12" md="10">
              <v-row>
                <v-col v-for="(topic, i) in topics" :key="i" cols="12" md="4">
                  <revision-topic-card :topic="topic" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <the-revision-mode-dialog />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import RevisionTopicCard from '~/components/student/RevisionTopicCard.vue'
import StudentAssignmentCard from '~/components/student/StudentAssignmentCard.vue'
import TheRevisionModeDialog from '~/components/student/TheRevisionModeDialog.vue'
import AssignmentCardLoader from '~/components/student/AssignmentCardLoader.vue'

export default {
  components: {
    StudentAssignmentCard,
    RevisionTopicCard,
    TheRevisionModeDialog,
    AssignmentCardLoader,
  },
  layout: 'app',
  async fetch() {
    console.debug(
      '%c' + 'Fetch',
      'padding:2px 4px;background-color:#ffe089;color:#765b00;border-radius:3px'
    )
    await this.$store.dispatch('group/getAssignments')
    await this.$store.dispatch('topics/getRevision')
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      assignments: (state) => state.group.assignments,
      topics: (state) => state.topics.topics,
    }),
    bgColor() {
      return this.$vuetify.theme.dark
        ? this.$vuetify.theme.themes.dark.background
        : this.$vuetify.theme.themes.light.background
    },
    // Remember tab
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
  },
  mounted() {
    this.$store.commit('app/setPageTitle', this.group.name)
  },
}
</script>
