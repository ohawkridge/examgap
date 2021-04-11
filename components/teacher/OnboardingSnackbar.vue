<template>
  <v-snackbar v-model="snack" :vertical="true" timeout="-1">
    <span class="font-weight-bold">({{ n }}/8)</span>
    {{ stringsForSteps[n] }}
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
        1: `To get started, click + ${
          this.$vuetify.breakpoint.name !== 'xs' ? 'Create ' : ''
        } Class.`,
        2: 'Click on the class you created.',
        3: 'To add students, click Invite Students.',
        4: 'Click + Create Assignment to browse questions.',
        5: 'Change topic to see more questions.',
        6: 'Click + to select questions to assign.',
        7: "When you're ready, click + Assign.",
        8: 'Click on a self-mark to enter marking view.',
      },
    }
  },
  computed: {
    ...mapState({
      n: (state) => state.user.onboardStep,
      snack: (state) => state.user.onboard,
    }),
  },
  methods: {
    close() {
      this.$store.commit('user/setOnboard', false)
    },
  },
}
</script>
