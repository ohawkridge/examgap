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
        <v-list v-if="assignments.length > 0" class="py-0">
          <v-list-item
            v-for="(assignment, i) in assignments"
            :key="i"
            nuxt
            :to="`/report/${assignment.id}`"
            class="divide"
          >
            <v-list-item-content>
              <v-row>
                <v-col cols="12" sm="5" class="pb-0 pb-sm-3">
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ assignment.name }}
                  </div>
                  <div class="text-body-2 grey--text text--darken-2">
                    {{ assignment.num_questions }} Question{{
                      assignment.num_questions | pluralize
                    }}
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  sm="5"
                  class="
                    d-flex
                    flex-column flex-sm-row
                    align-center
                    text-body-2
                  "
                >
                  <div class="justify-date" style="margin-right: auto">
                    <span class="font-weight-medium fix-date mr-1">Start:</span>
                    {{ assignment.start | date }}
                  </div>
                  <div style="margin-right: auto">
                    <span class="font-weight-medium fix-date mr-1">Due:</span>
                    {{ assignment.dateDue | date }}
                  </div>
                </v-col>
                <v-col
                  v-if="$vuetify.breakpoint.name !== 'xs'"
                  cols="2"
                  sm="2"
                  class="d-flex justify-center align-center"
                >
                  <v-chip
                    v-if="isHidden(assignment.start)"
                    label
                    color="orange"
                    small
                  >
                    Hidden
                  </v-chip>
                  <v-chip v-else-if="assignment.live" label color="green" small>
                    Open
                  </v-chip>
                  <v-chip v-else label color="red" small> Past </v-chip>
                </v-col>
              </v-row>
            </v-list-item-content>
            <v-list-item-action>
              <!-- On mobile, chip moves into item-action (less space) -->
              <v-list-item-action-text
                v-if="$vuetify.breakpoint.name === 'xs'"
                class="mt-2"
              >
                <v-chip
                  v-if="isHidden(assignment.start)"
                  label
                  color="orange"
                  small
                >
                  Hidden
                </v-chip>
                <v-chip v-else-if="assignment.live" label color="green" small>
                  Open
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
                    <i class="fa-regular fa-ellipsis-vertical"></i>
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
              <i class="fa-regular fa-plus"></i>
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
    isHidden(startDate) {
      return new Date(startDate) > new Date()
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
</style>
