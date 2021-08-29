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
        1: `To get started, click the '+ Class' button.`,
        2: `To add students, click 'Invite Students', or use the 'Students ⌄' menu.`,
        3: `Click '+ Assignment' to browse questions.`,
        4: 'Click + to select questions to assign.',
        5: `When your selection is complete, click '+ Assign'.`,
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
