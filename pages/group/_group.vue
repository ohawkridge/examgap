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
                      <div class="fix-width">
                        <span class="font-weight-bold">Start:</span>
                        {{ assignment.start | date }}
                      </div>
                      <div class="fix-width">
                        <span class="font-weight-bold">Due:</span>
                        {{ assignment.dateDue | date }}
                      </div>
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
              <div class="d-flex justify-center">
                <v-img
                  src="/no-assign.svg"
                  alt="Books and pens illustrations"
                  :max-width="$vuetify.breakpoint.name === 'xs' ? 120 : 200"
                />
              </div>
              <p class="text-body-2 text-center mt-4">No assignments yet</p>
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
  head() {
    return {
      title: this.group ? this.group.name : `Group`,
    }
  },
  computed: {
    ...mapGetters({ group: 'groups/activeGroup' }),
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
}
</script>

<style scoped>
.fix-width {
  display: inline-block;
  width: 130px;
}
</style>
