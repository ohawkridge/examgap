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
        4: `Click '+' next to the questions you want.`,
        5: `When you're ready, click '+ ASSIGN' to continue.`,
        6: `Once answered, click self marks to open marking view.`,
      },
    }
  },
  computed: {
    ...mapState({
      onboardStep: (state) => state.app.onboardStep,
    }),
  },
  methods: {
    close() {
      this.$store.commit('app/setOnboardStep', 0)
    },
  },
}
</script>
