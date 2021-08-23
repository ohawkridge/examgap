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
              <div class="d-flex align-center">
                <div class="col1">
                  <span class="text-subtitle-1 font-weight-medium">
                    {{ assignment.name }}</span
                  >
                  <div class="text-caption">
                    {{ assignment.num_questions }} Question{{
                      assignment.num_questions | pluralize
                    }}
                  </div>
                </div>
                <div class="col2 d-flex align-center text-body-2">
                  <v-icon class="mr-1">{{
                    $icons.mdiCalendarRangeOutline
                  }}</v-icon>
                  <span class="font-weight-medium mr-1">Start:</span>
                  {{ assignment.start | date }}
                </div>
                <div class="col2 d-flex align-center text-body-2">
                  <span class="font-weight-medium mr-1 ml-3">Due:</span>
                  {{ assignment.dateDue | date }}
                </div>
                <div class="col3 ml-auto d-flex justify-center">
                  <v-chip v-if="assignment.live" label color="green" small>
                    Upcoming
                  </v-chip>
                  <v-chip v-else label color="red" small> Past </v-chip>
                </div>
              </div>
            </v-list-item-content>
            <v-list-item-action>
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
        <div v-if="assignments.length === 0">
          <div class="d-flex justify-center">
            <v-img
              src="/no-assign.svg"
              contain
              max-width="250"
              alt="Books and pens illustrations"
            />
          </div>
          <p class="text-body-2 text-center" style="color: #000000de">
            No assignments yet
          </p>
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
        </div>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TheStudentsTable from '@/components/teacher/TheStudentsTable'
import TheGradesTable from '@/components/teacher/TheGradesTable'
import TheGroupSettings from '@/components/teacher/TheGroupSettings'
import {
  mdiDotsVertical,
  mdiInformationOutline,
  mdiPlus,
  mdiCheckCircleOutline,
  mdiCalendarRangeOutline,
  mdiCircleOutline,
} from '@mdi/js'
import TheDeleteAssignmentDialog from '~/components/teacher/TheDeleteAssignmentDialog.vue'

export default {
  components: {
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
    TheDeleteAssignmentDialog,
  },
  beforeRouteLeave(to, from, next) {
    // Clear store to avoid flash of old data next time
    this.$store.commit('students/setStudents', [])
    next()
  },
  layout: 'app',
  data() {
    return {
      tab: null,
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    assignments() {
      return this.group.assignments
    },
  },
  created() {
    this.$icons = {
      mdiDotsVertical,
      mdiInformationOutline,
      mdiPlus,
      mdiCheckCircleOutline,
      mdiCalendarRangeOutline,
      mdiCircleOutline,
    }
  },
  async mounted() {
    this.$store.commit('app/setPageTitle', this.group.name)
    // Pre-fetch most recent assignment
    try {
      await this.$store.dispatch('assignment/getReport', -1)
    } catch (err) {
      console.error(err)
    }
    if (this.group.count === 0) {
      this.$store.commit('app/setOnboardStep', 2)
    }
    // In case _report.vue crashes deactivate marking
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

<style scoped>
/* Assignment name */
.col1 {
  width: 300px;
}

/* Start/Due */
.col2 {
  width: 190px;
}

/* Open/closed */
.col3 {
  width: 80px;
}
</style>
