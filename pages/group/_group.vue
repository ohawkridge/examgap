<template>
  <div>
    <group-header />
    <divider-row />
    <v-row>
      <group-nav />
      <v-col cols="12" md="9">
        <v-card class="mt-n6 mt-sm-0">
          <v-card-title>
            <v-icon class="mr-2">{{ $icons.mdiTextBoxCheckOutline }}</v-icon>
            Assignment{{ assignments.length | pluralize }} ({{
              assignments.length
            }})
          </v-card-title>
          <!-- <v-divider /> -->
          <v-card-text>
            <v-list v-if="assignments.length > 0">
              <template v-for="(assignment, i) in assignments">
                <v-list-item
                  :key="i"
                  class="px-0 px-md-3 my-1"
                  nuxt
                  :to="`/report/${assignment.id}`"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ assignment.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="align-date">
                        <span class="font-weight-bold">Start:</span>
                        {{ assignment.start | date }}
                      </div>
                      <div class="align-date">
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
                <v-divider :key="i + 1000" class="my-1 mx-3" />
              </template>
            </v-list>
            <!-- Empty state -->
            <div v-else>
              <div class="d-flex justify-center">
                <v-img
                  src="/no-assign.svg"
                  max-width="200"
                  alt="Books and pens illustrations"
                />
              </div>
              <p class="text-body-2 text-center mt-4" style="color: #000000de">
                No assignments yet
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { isEmpty, find } from 'lodash'
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import DeleteAssignment from '@/components/teacher/DeleteAssignment'
import DividerRow from '@/components/teacher/DividerRow.vue'
import {
  mdiDotsVertical,
  mdiInformationOutline,
  mdiPlus,
  mdiTextBoxCheckOutline,
} from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
    DeleteAssignment,
    DividerRow,
  },
  layout: 'app',
  head() {
    return {
      title: this.group ? this.group.name : `Group`,
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      // The last assignment data for _report.vue
      // Used to check whether to pre-fetch again
      assignment: (state) => state.assignment.assignment,
    }),
    assignments() {
      return this.group.assignments
    },
  },
  async created() {
    this.$icons = {
      mdiDotsVertical,
      mdiInformationOutline,
      mdiPlus,
      mdiTextBoxCheckOutline,
    }
    // Pre-fetch most recent assignment for group if store
    // is empty or stored assignment not for this group
    const notSame = !find(this.assignments, ['id', this.assignment.id])
    if ((isEmpty(this.assignment) || notSame) && this.assignments.length > 0) {
      try {
        console.log(
          '%c' + 'Prefetch',
          'padding:2px 4px;background-color:#464646;color:white;border-radius:3px'
        )
        await this.$store.dispatch('assignment/getReport', -1)
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted() {
    if (this.group.num_students === 0) {
      this.$store.commit('app/setOnboardStep', 2)
    }
  },
  methods: {
    createAssignment() {
      // Clear any previous selections
      this.$store.commit('topics/clearSelectedQuestions')
      // Continue onboarding if user hasn't set assignments
      this.$store.commit(
        'app/setOnboardStep',
        this.group.assignments.length < 3 ? 4 : 0
      )
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>
