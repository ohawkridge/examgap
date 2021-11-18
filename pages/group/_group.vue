<template>
  <div>
    <v-tabs
      v-model="tab"
      centered
      background-color="transparent"
      style="border-bottom: 1px solid #d2d2d2 !important"
    >
      <v-tab> Assignments </v-tab>
      <v-tab> Students </v-tab>
      <v-tab> Grades </v-tab>
      <v-tab> Settings </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-container>
          <the-empty-assignments-state v-if="group.assignments.length === 0" />
          <v-row v-else class="justify-center">
            <v-col cols="12" md="10">
              <div
                v-if="!group.active"
                class="d-flex align-center justify-space-between"
              >
                <v-chip color="red" label class="mr-2">
                  <font-awesome-icon
                    icon="fa-light fa-box-archive"
                    class="mr-2 fa-lg"
                  />
                  Archived
                </v-chip>
                <the-restore-group-dialog :group-id="group.id" />
              </div>
              <div v-else class="d-flex justify-end align-center">
                <!-- <template #activator="{ on }"> -->
                <v-btn
                  color="primary"
                  elevation="0"
                  rounded
                  @click="addAssign()"
                >
                  <font-awesome-icon icon="fa-light fa-plus" class="mr-2" />
                  Assignment
                </v-btn>
                <span>Add assignment</span>
                <!-- </template> -->
              </div>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-col cols="12" md="10">
              <teacher-assignment-card
                v-for="assignment in group.assignments"
                :key="assignment.id"
                :assignment="assignment"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <the-students-table />
      </v-tab-item>
      <v-tab-item>
        <the-grades-table />
      </v-tab-item>
      <v-tab-item>
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
import TheEmptyAssignmentsState from '@/components/teacher/TheEmptyAssignmentsState'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'
import TheRestoreGroupDialog from '~/components/teacher/TheRestoreGroupDialog.vue'

export default {
  components: {
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
    TheInviteDialog,
    TheEmptyAssignmentsState,
    TeacherAssignmentCard,
    TheRestoreGroupDialog,
  },
  beforeRouteLeave(to, from, next) {
    // Clear store to avoid flash of old data next time
    this.$store.commit('group/setStudents', [])
    next()
  },
  layout: 'app',
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    // Store tab state so we can access it in app.vue
    tab: {
      get() {
        return this.$store.state.app.groupTab
      },
      set(value) {
        this.$store.commit('app/setGroupTab', value)
      },
    },
  },
  async mounted() {
    this.$store.commit('app/setPageTitle', this.group.name)
    if (this.group.count === 0) {
      this.tab = 1
    }
    // Pre-fetch most recent assignment
    try {
      console.log(
        '%c' + 'Prefetch',
        'color:#001f2a;background-color:#f4d06f;padding:4px;'
      )
      console.time('_report (latest)')
      await this.$store.dispatch('assignment/getReport', -1)
      console.timeEnd('_report (latest)')
      console.log(
        '%c' + 'Prefetch',
        'color:#001f2a;background-color:#f4d06f;padding:4px;'
      )
      console.time('_course')
      await this.$store.dispatch('topics/getTopics')
      console.timeEnd('_course')
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error pre-fetching data',
      })
    }
    // Onboard if nec.
    if (this.group.count === 0) {
      this.$store.commit('app/setOnboardStep', 2)
    }
    // (In case _report.vue crashes deactivate marking)
    this.$store.commit('assignment/setMarking', false)
  },
  methods: {
    addAssign() {
      this.$store.commit('topics/clearSelectedQuestions')
      this.$router.push(`/course/${this.group.course.id}`)
    },
    restore() {},
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
