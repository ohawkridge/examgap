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
    <v-container>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <!-- <the-empty-assignments-state v-if="ssignments.length === 0" /> -->
          <the-empty-assignments-state v-if="true" />
          <template v-else> </template>
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
    </v-container>
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

export default {
  components: {
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
    TheInviteDialog,
    TheEmptyAssignmentsState,
  },
  beforeRouteLeave(to, from, next) {
    // Clear store to avoid flash of old data next time
    this.$store.commit('group/setStudents', [])
    next()
  },
  layout: 'app',
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    assignments() {
      return this.group.assignments
    },
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
      console.time('Last assignment')
      await this.$store.dispatch('assignment/getReport', -1)
      console.timeEnd('Fetch last assignment')
      console.log(
        '%c' + 'Prefetch',
        'color:#001f2a;background-color:#f4d06f;padding:4px;'
      )
      console.time('_course data')
      await this.$store.dispatch('topics/getTopics')
      console.timeEnd('_course data')
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
