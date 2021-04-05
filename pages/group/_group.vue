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
            <v-btn elevation="0" color="primary" @click="createAssignment()">
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
                <v-list-item :key="i" nuxt :to="`/report/${assignment.id}`">
                  <v-list-item-content>
                    <v-list-item-title>{{ assignment.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Due {{ assignment.dateDue | date }}
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
                  :max-width="$vuetify.breakpoint.name === 'xs' ? 120 : 200"
                />
              </div>
              <p class="text-body-1 font-weight-bold text-center mb-0">
                No assignments yet
              </p>
              <p class="text-subtitle text-center">
                Click '+ Create Assignment' to browse questions
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
    <onboarding-snackbar
      n="3"
      text="Click '+ Create assignment' to browse questions."
      evt="create-ass"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
  data() {
    return {
      onboard: true,
    }
  },
  head() {
    return {
      title: this.group ? this.group.name : `Group`,
    }
  },
  computed: {
    ...mapGetters({ group: 'groups/activeGroup' }),
    assignments() {
      if (this.group && 'assignments' in this.group) {
        return this.group.assignments
      } else {
        return []
      }
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
    this.$nuxt.$on('create-ass', () => {
      this.createAssignment()
    })
  },
  methods: {
    createAssignment() {
      // Clear any previously selected questions
      this.$store.commit('assignments/clearSelectedQuestions')
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
