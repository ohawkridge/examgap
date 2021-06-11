<template>
  <v-snackbar v-model="snack" :vertical="true" timeout="-1">
    <span class="font-weight-bold">({{ obs }}/8)</span>
    {{ stringsForSteps[obs] }}
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
        2: 'Click the class you just created.',
        3: 'To add students, click Invite Students.',
        4: 'Click + Create Assignment to browse questions.',
        5: 'Change topics to see more questions.',
        6: 'Click + to select questions to assign.',
        7: "When you're ready, click + Assign.",
        8: 'Click on a self mark to enter marking view.',
      },
    }
  },
  computed: {
    ...mapState({
      obs: (state) => state.user.onboardStep,
    }),
    snack() {
      return this.obs > 0
    },
  },
  methods: {
    close() {
      this.$store.commit('user/setOnboardStep', 0)
    },
  },
}
</script>
