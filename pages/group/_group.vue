<template>
  <div>
    <v-tabs
      v-model="tab"
      align-with-title
      :background-color="$vuetify.theme.themes.light.background"
      style="border-bottom: 1px solid #d2d2d2 !important"
      color="secondary"
    >
      <v-tab style="text-transform: capitalize"> Assignments </v-tab>
      <v-tab style="text-transform: capitalize"> Students </v-tab>
      <v-tab style="text-transform: capitalize"> Grades </v-tab>
      <v-tab style="text-transform: capitalize"> Settings </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item style="background-color: #fbfcff">
        <!-- ASSIGNMENTS xx -->
        <v-container>
          <v-row class="justify-center">
            <v-col cols="12" md="10" class="d-flex justify-end">
              <v-tooltip v-if="group.active" bottom>
                <template #activator="{ on }">
                  <v-btn
                    color="primary"
                    elevation="0"
                    rounded
                    :block="$vuetify.breakpoint.name === 'xs'"
                    :class="$vuetify.breakpoint.name === 'xs' ? 'mb-3' : ''"
                    nuxt
                    :to="`/browse/${group.course.id}`"
                    v-on="on"
                  >
                    <font-awesome-icon
                      icon="fa-light fa-plus"
                      class="mr-2 fa-lg"
                    />
                    Assignment
                  </v-btn>
                </template>
                <span>New assignment</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-col class="12" md="8">
              <teacher-assignment-card
                v-for="(assignment, i) in assignments"
                :key="i"
                :assignment="assignment"
                :course-name="group.course.name"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item style="background-color: #fbfcff">
        <the-students-table />
      </v-tab-item>
      <v-tab-item style="background-color: #fbfcff">
        <the-grades-table />
      </v-tab-item>
      <v-tab-item style="background-color: #fbfcff">
        <the-group-settings />
      </v-tab-item>
    </v-tabs-items>
    <the-invite-dialog :group="group" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheStudentsTable from '@/components/teacher/TheStudentsTable'
import TheGradesTable from '@/components/teacher/TheGradesTable'
import TheGroupSettings from '@/components/teacher/TheGroupSettings'
import TheInviteDialog from '@/components/teacher/TheInviteDialog'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'

export default {
  components: {
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
    TheInviteDialog,
    TeacherAssignmentCard,
  },
  beforeRouteLeave(to, from, next) {
    // Clear store to avoid flash of old data next time
    this.$store.commit('group/setStudents', [])
    this.$store.commit('group/setGrades', [])
    // Stop highlighting navbar
    this.$store.commit('app/setNav', null)
    next()
  },
  layout: 'app',
  async fetch() {
    console.log(
      '%c' + 'Fetch',
      'padding:2px 4px;background-color:#ffe089;color:#765b00;border-radius:3px'
    )
    await this.$store.dispatch('group/getAssignments')
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      assignments: (state) => state.group.assignments,
    }),
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
  watch: {
    tab() {
      // Onboarding if nec.
      if (this.group.numStudents === 0 && this.tab === 1) {
        this.$store.commit('app/setOnboardStep', 2)
      }
    },
  },
  mounted() {
    this.$store.commit('app/setPageTitle', this.group.name)
    // In case _report.vue crashes, stop marking
    this.$store.commit('assignment/setMarking', false)
    // Group is archived
    if (!this.group.active) {
      this.$snack.showMessage({
        msg: `Class archived. Click 'Settings' to restore.`,
      })
    }
  },
}
</script>
