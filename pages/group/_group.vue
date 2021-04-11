<template>
  <div>
    <GroupHeader v-if="group && Object.keys(group).length > 0" :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav
          v-if="group && Object.keys(group).length > 0"
          :group="group"
        />
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-n6 mt-sm-0">
          <v-card-title class="d-flex justify-space-between">
            Assignment{{ assignments.length | pluralize }} ({{
              assignments.length
            }})
            <v-btn
              :class="onboard && n === 4 ? 'red-out' : ''"
              elevation="0"
              color="primary"
              @click="createAssignment()"
            >
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              {{
                $vuetify.breakpoint.name == 'xs'
                  ? 'Create'
                  : 'Create Assignment'
              }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list v-if="assignments.length > 0">
              <template v-for="(assignment, i) in assignments">
                <v-list-item
                  :key="i"
                  class="px-0 px-md-3"
                  nuxt
                  :to="`/report/${assignment.id}`"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ assignment.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <span class="font-weight-medium">Start:</span>
                      {{ assignment.start | date }}&nbsp;&nbsp;&nbsp;<span
                        class="font-weight-medium"
                        >Due:</span
                      >
                      {{ assignment.dateDue | date }}
                    </v-list-item-subtitle>
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
                        <DeleteAssignment
                          v-if="group"
                          :assignment-id="assignment.id"
                          :group-id="group.id"
                        />
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-divider
                  v-if="i < assignments.length - 1"
                  :key="assignment.id"
                />
              </template>
            </v-list>
            <!-- Empty state -->
            <div v-else>
              <div id="empty" class="d-flex justify-center">
                <v-img
                  src="/no-assign.svg"
                  :max-width="$vuetify.breakpoint.name === 'xs' ? 100 : 160"
                />
              </div>
              <p class="text-body-2 text-center mb-2">No assignments yet</p>
              <p class="text-subtitle text-center">
                {{
                  `Click + Create ${
                    $vuetify.breakpoint.name !== 'xs' ? 'Assignment' : ''
                  } to browse questions.`
                }}
              </p>
              <div class="d-flex justify-center">
                <v-btn
                  elevation="0"
                  color="primary"
                  @click="createAssignment()"
                >
                  <v-icon left>{{ $icons.mdiPlus }}</v-icon>
                  Create assignment
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <onboarding-snackbar />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import DeleteAssignment from '@/components/teacher/DeleteAssignment'
import OnboardingSnackbar from '@/components/teacher/OnboardingSnackbar'
import {
  mdiDotsVertical,
  mdiInformationOutline,
  mdiPlus,
  mdiBookOpenOutline,
} from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
    DeleteAssignment,
    OnboardingSnackbar,
  },
  layout: 'app',
  head() {
    return {
      title: this.group ? this.group.name : `Group`,
    }
  },
  computed: {
    ...mapGetters({ group: 'groups/activeGroup' }),
    ...mapState({
      n: (state) => state.user.onboardStep,
      onboard: (state) => state.user.onboard,
    }),
    // Defend against logout, refresh etc.
    assignments() {
      return this.group && 'assignments' in this.group
        ? this.group.assignments
        : []
    },
  },
  created() {
    this.$icons = {
      mdiDotsVertical,
      mdiInformationOutline,
      mdiPlus,
      mdiBookOpenOutline,
    }
  },
  mounted() {
    // No students? Onboard @step 3
    if (this.group.num_students === 0) {
      this.$store.commit('user/setOnboardStep', 3)
      this.$store.commit('user/setOnboard', true)
    }
    // No assignments? Onboard @step 4
    if (this.group.num_students > 0 && this.assignments.length < 3) {
      this.$store.commit('user/setOnboardStep', 4)
      this.$store.commit('user/setOnboard', true)
    }
  },
  methods: {
    createAssignment() {
      // Clear any previously selected questions
      this.$store.commit('assignments/clearSelectedQuestions')
      // Advance onboarding
      this.$store.commit('user/setOnboardStep', 5)
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>

<style scoped>
@media only screen and (min-width: 600px) {
  #empty {
    padding-top: 1.5em;
    padding-bottom: 1.5em;
  }
}
</style>
