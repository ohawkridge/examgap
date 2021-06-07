<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-md-flex justify-space-between align-center">
        <div>
          <p
            v-if="group.name !== undefined"
            class="text-h6 font-weight-bold mb-0"
          >
            {{ group.name }}
          </p>
          <p v-if="group.course.name !== undefined">
            {{ group.course.name }} ({{ group.course.board }})
          </p>
        </div>
        <div>
          <the-invite-dialog :group="group" />
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mt-2 mt-md-0"
                :class="clss"
                elevation="0"
                :block="$vuetify.breakpoint.name === 'xs'"
                color="primary"
                @click="createAssignment()"
                v-on="on"
              >
                <v-icon left>{{ $icons.mdiPlus }}</v-icon>
                Create assignment
              </v-btn>
            </template>
            <span>Create assignment</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiPlus } from '@mdi/js'
import TheInviteDialog from '@/components/teacher/TheInviteDialog'

export default {
  components: {
    TheInviteDialog,
  },
  props: {
    group: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      n: (state) => state.user.onboardStep,
      onboard: (state) => state.user.onboard,
    }),
    assignments() {
      return this.group && 'assignments' in this.group
        ? this.group.assignments
        : []
    },
    clss() {
      return this.onboard && this.n === 4 ? 'red-out' : ''
    },
  },
  created() {
    this.$icons = { mdiPlus }
  },
  mounted() {
    if (this.group !== undefined) {
      // No students? Onboard @step 3
      if (this.group.num_students === 0) {
        this.$store.commit('user/setOnboardStep', 3)
      }
      // No assignments? Onboard @step 4
      if (this.group.num_students > 0 && this.assignments.length < 2) {
        this.$store.commit('user/setOnboardStep', 4)
      }
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
