<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-md-flex justify-space-between align-center">
        <div>
          <p
            v-if="group.name !== undefined"
            class="text-h6 font-weight-bold mb-0"
          >
            {{ group.name }} ({{ group.num_students }})
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
                :class="$store.state.user.onboardStep === 4 ? 'red-out' : ''"
                elevation="0"
                :block="$vuetify.breakpoint.name === 'xs'"
                color="primary"
                @click="create()"
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
    assignments() {
      return this.group && 'assignments' in this.group
        ? this.group.assignments
        : []
    },
  },
  created() {
    this.$icons = { mdiPlus }
  },
  mounted() {
    // Onboard no students
    if (this.group.num_students === 0) {
      console.log('But Im not 0!')
      this.$store.commit('user/setOnboardStep', 3)
    }
    // Onboard few assignments
    if (this.group.num_students > 0 && this.assignments.length < 3) {
      this.$store.commit('user/setOnboardStep', 4)
    }
  },
  methods: {
    create() {
      // Clear previously selection
      this.$store.commit('assignments/clearSelectedQuestions')
      // Advance onboarding
      this.$store.commit('user/setOnboardStep', 5)
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>
