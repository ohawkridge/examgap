<template>
  <v-snackbar :value="onboardStep > 0" multi-line timeout="-1">
    {{ stringsForSteps[onboardStep] }}
    <template #action>
      <v-btn color="accent" plain @click="close()">
        <span class="text-uppercase">Close</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      stringsForSteps: {
        1: `To get started, click '+ CLASS'.`,
        2: `To add students, click 'INVITE STUDENTS', or click Students → Add students.`,
        3: `Click '+ ASSIGNMENT' to browse questions.`,
        4: `Select questions for this assignment.`,
        5: `When you're ready, click '+ ASSIGN' at the top.`,
        6: `Click on self marks to open marking view.`,
      },
    }
  },
  computed: {
    ...mapState({
      onboardStep: (state) => state.app.onboardStep,
      // N.B. You can access this inside dictionary above
    }),
  },
  methods: {
    close() {
      this.$store.commit('app/setOnboardStep', 0)
    },
  },
}
</script>
