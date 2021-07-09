<template>
  <v-snackbar :value="onboardStep > 0" :vertical="true" timeout="-1">
    <span class="font-weight-bold">({{ onboardStep }}/{{ numSteps }})</span>
    {{ stringsForSteps[onboardStep] }}
    <template #action="{ attrs }">
      <v-btn color="secondary" plain v-bind="attrs" @click="close()">
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
        1: `To get started, click + ${this.mobile ? '' : 'Create'} Class.`,
        2: 'To add students, click Invite Students.',
        3: 'Click + Create Assignment to browse questions.',
        4: 'Click + to select questions to assign.',
        5: "When you're ready, click + Assign.",
        6: 'Click on a mark to open the marking view.',
      },
    }
  },
  computed: {
    ...mapState({
      onboardStep: (state) => state.app.onboardStep,
    }),
    mobile() {
      return this.$vuetify.breakpoint.name === 'xs'
    },
    numSteps() {
      return Object.keys(this.stringsForSteps).length
    },
  },
  methods: {
    close() {
      this.$store.commit('app/setOnboardStep', 0)
    },
  },
}
</script>
