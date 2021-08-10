<template>
  <v-row>
    <v-col cols="12">
      <v-tabs v-model="tab" grow background-color="transparent">
        <v-tab>Assignments</v-tab>
        <v-tab> Students </v-tab>
        <v-tab> Grades </v-tab>
        <v-tab> Settings </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-list v-for="(assignment, i) in assignments" :key="i">
            <v-list-item :key="i" nuxt :to="`/report/${assignment.id}`">
              <v-list-item-content>
                <div class="d-flex">
                  <div
                    class="col1 font-weight-medium text-decoration-underline"
                  >
                    {{ assignment.name }}
                  </div>
                  <div class="col2">Start: {{ assignment.start | date }}</div>
                  <div>Due: {{ assignment.dateDue | date }}</div>
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
                    <delete-assignment :assignment-id="assignment.id" />
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
                max-width="200"
                alt="Books and pens illustrations"
              />
            </div>
            <p class="text-body-2 text-center mt-4" style="color: #000000de">
              No assignments yet
            </p>
            <div class="d-flex justify-center">
              <v-btn elevation="0" color="primary" @click="createAssignment()">
                <v-icon left>{{ $icons.mdiPlus }}</v-icon>
                Create assignment
              </v-btn>
            </div>
          </div>
          <!-- </v-card-text>
              </v-card> -->
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
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import DeleteAssignment from '@/components/teacher/DeleteAssignment'
import TheStudentsTable from '@/components/teacher/TheStudentsTable'
import TheGradesTable from '@/components/teacher/TheGradesTable'
import TheGroupSettings from '@/components/teacher/TheGroupSettings'
import { mdiDotsVertical, mdiInformationOutline, mdiPlus } from '@mdi/js'

export default {
  components: {
    DeleteAssignment,
    TheStudentsTable,
    TheGradesTable,
    TheGroupSettings,
  },
  layout: 'app',
  data() {
    return {
      tab: null,
    }
  },
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
    }
  },
  async mounted() {
    // Set page title
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
        this.group.assignments.length < 3 ? 4 : 0
      )
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>

<style scoped>
.col1 {
  width: 300px;
}

.col2 {
  width: 160px;
}
</style>
