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
                        <delete-assignment :assignment-id="assignment.id" />
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-divider
                  v-if="i < assignments.length - 1"
                  :key="i + 999"
                  class="my-2 mx-0 mx-sm-3"
                />
              </template>
            </v-list>
            <!-- Empty state -->
            <div v-else>
              <div class="d-flex justify-center">
                <v-img
                  src="/no-assign.svg"
                  contain
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
import { mapGetters } from 'vuex'
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import DeleteAssignment from '@/components/teacher/DeleteAssignment'
import {
  mdiDotsVertical,
  mdiInformationOutline,
  mdiPlus,
  mdiTextBoxCheckOutline,
} from '@mdi/js'
import DividerRow from '~/components/common/DividerRow.vue'

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
    assignments() {
      return this.group.assignments
    },
  },
  created() {
    this.$icons = {
      mdiDotsVertical,
      mdiInformationOutline,
      mdiPlus,
      mdiTextBoxCheckOutline,
    }
  },
  async mounted() {
    // Pre-fetch most recent assignment
    try {
      await this.$store.dispatch('assignment/getReport', -1)
    } catch (err) {
      console.error(err)
    }
    if (this.group.num_students === 0) {
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
        this.group.assignments.length < 3 ? 4 : 0
      )
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>
