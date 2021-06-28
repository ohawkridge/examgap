<template>
  <v-snackbar v-model="snack" :vertical="true" timeout="-1">
    <span class="font-weight-bold"
      >({{ obs }}/{{ Object.keys(stringsForSteps).length }})</span
    >
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
        2: 'To add students, click Invite Students.',
        3: 'Click + Create Assignment to browse questions.',
        4: 'Change topics to see more questions.',
        5: 'Click + to select questions to assign.',
        6: "When you're ready, click + Assign.",
        7: 'Click on a mark to open the marking view.',
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
      this.$store.commit('app/setOnboardStep', 0)
    },
  },
}
</script>
