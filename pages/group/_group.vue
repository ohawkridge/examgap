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
        <v-list class="py-0">
          <v-list-item
            v-for="(assignment, i) in assignments"
            :key="i"
            nuxt
            :to="`/report/${assignment.id}`"
            class="divide"
          >
            <v-list-item-content>
              <v-row>
                <v-col cols="12" sm="4" class="pb-0 pb-sm-3">
                  <span class="text-subtitle-1 font-weight-medium">{{
                    assignment.name
                  }}</span>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  class="d-flex align-center text-body-2 pb-0 pb-sm-3"
                >
                  <span class="font-weight-medium fix-date">Start:</span>
                  <v-icon small class="mx-1">{{
                    $icons.mdiCalendarStart
                  }}</v-icon>
                  {{ assignment.start | date }}
                </v-col>
                <v-col cols="12" sm="3" class="d-flex align-center text-body-2">
                  <span class="font-weight-medium fix-date">Due:</span>
                  <v-icon small class="mx-1">{{
                    $icons.mdiCalendarEnd
                  }}</v-icon>
                  {{ assignment.dateDue | date }}
                </v-col>
                <v-col
                  v-if="$vuetify.breakpoint.name !== 'xs'"
                  cols="2"
                  sm="2"
                  class="d-flex justify-center align-center"
                >
                  <v-chip v-if="assignment.live" label color="green" small>
                    Upcoming
                  </v-chip>
                  <v-chip v-else label color="red" small> Past </v-chip>
                </v-col>
              </v-row>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text
                v-if="$vuetify.breakpoint.name === 'xs'"
                class="mt-2"
              >
                <v-chip v-if="assignment.live" label color="green" small>
                  Upcoming
                </v-chip>
                <v-chip v-else label color="red" small> Past </v-chip>
              </v-list-item-action-text>
              <v-menu offset-y>
                <template #activator="{ on }">
                  <v-btn
                    icon
                    v-on="on"
                    @click.prevent
                    @mousedown.stop
                    @touchstart.native.stop
                  >
                    <v-icon>{{ $icons.mdiDotsVertical }}</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <the-delete-assignment-dialog
                    :assignment-id="assignment.id"
                  />
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <!-- Empty state -->
        <template v-if="assignments.length === 0">
          <div class="d-flex justify-center pa-3">
            <v-img
              src="/no-assign.svg"
              contain
              :max-width="$vuetify.breakpoint.name === 'xs' ? '50%' : '20%'"
              alt="Books and pens illustrations"
            />
          </div>
          <p class="text-center mt-2">No assignments yet.</p>
          <div class="d-flex justify-center">
            <v-btn
              elevation="0"
              rounded
              color="primary"
              @click="createAssignment()"
            >
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              Assignment
            </v-btn>
          </div>
        </template>
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
import TheDeleteAssignmentDialog from '@/components/teacher/TheDeleteAssignmentDialog'
import TheInviteDialog from '@/components/teacher/TheInviteDialog'
import {
  mdiDotsVertical,
  mdiInformationOutline,
  mdiPlus,
  mdiCheckCircleOutline,
  mdiCalendarStart,
  mdiCalendarEnd,
  mdiCircleOutline,
} from '@mdi/js'

export default {
  components: {
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
    TheDeleteAssignmentDialog,
    TheInviteDialog,
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
  created() {
    this.$icons = {
      mdiDotsVertical,
      mdiInformationOutline,
      mdiPlus,
      mdiCheckCircleOutline,
      mdiCalendarStart,
      mdiCalendarEnd,
      mdiCircleOutline,
    }
  },
  async mounted() {
    this.$store.commit('app/setPageTitle', this.group.name)
    if (this.group.count === 0) {
      this.tab = 1
    }
    // Pre-fetch most recent assignment
    try {
      await this.$store.dispatch('assignment/getReport', -1)
    } catch (err) {
      console.error(err)
    }
    // Onboard if nec.
    if (this.group.count === 0) {
      this.$store.commit('app/setOnboardStep', 2)
    }
    // (In case _report.vue crashes deactivate marking)
    this.$store.commit('assignment/setMarking', false)
  },
  methods: {
    createAssignment() {
      // Clear any previous selections
      this.$store.commit('topics/clearSelectedQuestions')
      // Continue onboarding if user hasn't set assignments
      this.$store.commit(
        'app/setOnboardStep',
        this.assignments.length < 3 ? 4 : 0
      )
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>
