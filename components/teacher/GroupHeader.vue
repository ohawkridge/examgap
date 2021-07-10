<template>
  <div>
    <v-row>
      <!-- No flex on xs—just stack -->
      <v-col cols="12" class="d-sm-flex justify-space-between align-center">
        <div>
          <div class="text-h6 font-weight-bold mb-0">
            {{ group.name === undefined ? 'Loading...' : group.name }}
          </div>
          <div v-if="group.course.name !== undefined" class="mb-3 mb-sm-0">
            {{ group.course.name }} ({{ group.course.board }})
          </div>
        </div>
        <div>
          <the-invite-dialog :group="group" />
          <v-btn
            class="mt-2 mt-sm-0"
            elevation="0"
            outlined
            :block="$vuetify.breakpoint.name === 'xs'"
            color="primary"
            @click="createAssignment()"
          >
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            Create assignment
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="div mb-3"></div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiPlus } from '@mdi/js'
import TheInviteDialog from '@/components/teacher/TheInviteDialog'

export default {
  components: {
    TheInviteDialog,
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
  },
  created() {
    this.$icons = { mdiPlus }
  },
  mounted() {
    // Onboard -> no students
    if (this.group.num_students === 0) {
      this.$store.commit('app/setOnboardStep', 2)
    }
    // Onboard -> few assignments
    if (this.group.num_students > 0 && this.group.assignments.length < 3) {
      this.$store.commit('app/setOnboardStep', 3)
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

<style scoped>
.div {
  /* border-bottom: 1px solid #e3dede; */
  border-bottom: 1px solid #cccccc;
}
</style>
