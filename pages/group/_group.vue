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
                <v-col cols="12" sm="4" class="pb-0 pb-sm-3">
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
                  sm="6"
                  class="
                    d-flex
                    flex-column flex-sm-row
                    align-center
                    text-body-2
                  "
                >
                  <div class="justify-date left">
                    <span class="font-weight-medium fix-date mr-1">Start:</span>
                    {{ assignment.start | date }}
                  </div>
                  <div class="left">
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
                    color="orange"
                    small
                  >
                    Scheduled
                    <font-awesome-icon
                      icon="fa-light fa-calendar-clock"
                      class="ml-2"
                    />
                  </v-chip>
                  <v-chip v-else-if="assignment.live" color="green" small>
                    Open
                    <font-awesome-icon
                      icon="fa-light fa-hourglass"
                      class="ml-2"
                    />
                  </v-chip>
                  <v-chip v-else small>
                    Past
                    <font-awesome-icon
                      icon="fa-light fa-hourglass-end"
                      class="ml-2"
                    />
                  </v-chip>
                </v-col>
              </v-row>
            </v-list-item-content>
            <!-- item-action mobile only -->
            <v-list-item-action v-if="$vuetify.breakpoint.name === 'xs'">
              <v-list-item-action-text>
                <template v-if="isHidden(assignment.start)">
                  Scheduled
                </template>
                <template v-else-if="assignment.live"> Open </template>
                <template v-else> Past </template>
              </v-list-item-action-text>
              <template v-if="isHidden(assignment.start)">
                <font-awesome-icon
                  icon="fa-light fa-calendar-clock"
                  class="ico-orange fa-lg"
                />
              </template>
              <template v-else-if="assignment.live">
                <font-awesome-icon
                  icon="fa-light fa-hourglass"
                  class="ico-green fa-lg"
                />
              </template>
              <template v-else>
                <font-awesome-icon
                  icon="fa-light fa-hourglass-end"
                  class="ico-grey fa-lg"
                />
              </template>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <!-- Empty state -->
        <template v-if="assignments.length === 0">
          <div class="pa-3">
            <v-img
              src="/no-assign.svg"
              contain
              :max-width="$vuetify.breakpoint.name === 'xs' ? '50%' : '20%'"
              alt="Books and pens illustrations"
              class="mx-auto"
            />
            <p class="text-center mt-2 black--text">No assignments yet</p>
            <div class="d-flex justify-center">
              <v-btn
                elevation="0"
                rounded
                color="primary"
                @click="createAssignment()"
              >
                <font-awesome-icon icon="fa-light fa-plus" class="mr-2" />
                Assignment
              </v-btn>
            </div>
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
import TheInviteDialog from '@/components/teacher/TheInviteDialog'

export default {
  components: {
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
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

/* Align Start/Due left in flex-columns */
@media only screen and (max-width: 600px) {
  .left {
    margin-right: auto;
  }
}
</style>
