<template>
  <v-snackbar v-model="onboardSnack" :vertical="true" timeout="-1">
    <span class="font-weight-bold">({{ n }}/7)</span>
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
      onboardSnack: false,
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
      },
    }
  },
  computed: {
    ...mapState({ n: (state) => state.user.onboardStep }),
  },
  mounted() {
    this.$nuxt.$on('onoarding', (val) => {
      console.log(`Received onboarding event`, val)
      this.onboardSnack = val
    })
  },
  methods: {
    close() {
      // Emit event to turn off red outline
      $nuxt.$emit('close')
      this.onboardSnack = false
    },
  },
}
</script>
