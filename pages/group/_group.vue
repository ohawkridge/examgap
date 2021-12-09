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
                    @click="addAssign()"
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
            <v-col class="12" md="10">
              <teacher-assignment-card
                v-for="(assignment, i) in group.assignments"
                :key="i"
                :assignment="assignment"
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
import { mapGetters } from 'vuex'
import TheStudentsTable from '@/components/teacher/TheStudentsTable'
import TheGradesTable from '@/components/teacher/TheGradesTable'
import TheGroupSettings from '@/components/teacher/TheGroupSettings'
import TheInviteDialog from '@/components/teacher/TheInviteDialog'
// import TheEmptyAssignmentsState from '@/components/common/TheEmptyAssignmentsState'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'

export default {
  components: {
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
    TheInviteDialog,
    // TheEmptyAssignmentsState,
    TeacherAssignmentCard,
  },
  beforeRouteLeave(to, from, next) {
    // Clear store to avoid flash of old data next time
    this.$store.commit('group/setStudents', [])
    next()
  },
  layout: 'app',
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    revOnMob() {
      return this.$vuetify.breakpoint.name === 'xs'
        ? 'flex-column flex-column-reverse'
        : ''
    },
    // Remember tab state for group
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
    // On 'ASSIGNMENTS' tab, remember upcoming/past
    upcoming: {
      get() {
        return this.$store.state.app.upcoming
      },
      set(value) {
        this.$store.commit('app/setUpcoming', value)
      },
    },
  },
  watch: {
    tab() {
      // Show student onboarding message
      if (this.group.count === 0 && this.tab === 1) {
        this.$store.commit('app/setOnboardStep', 2)
      }
    },
  },
  mounted() {
    // N.B. Don't pre-fetch. Not worth it.
    this.$store.commit('app/setPageTitle', this.group.name)
    // In case _report.vue crashes deactivate marking
    this.$store.commit('assignment/setMarking', false)
    // If archived
    if (!this.group.active) {
      this.$snack.showMessage({
        msg: `Class archived. Click 'SETTINGS' to restore.`,
      })
    }
  },
  methods: {
    addAssign() {
      this.$store.commit('topics/clearSelectedQuestions')
      this.$router.push(`/browse/${this.group.course.id}`)
    },
  },
}
</script>

<style scoped>
@media only screen and (min-width: 600px) {
  .justify-date {
    width: 190px;
  }
}

/* Align Start/Due left in flex-columns */
@media only screen and (max-width: 600px) {
  .left {
    margin-right: auto;
  }
}
</style>
