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
      onboardSnack: true,
      stringsForSteps: {
        1: `To get started, click +${
          this.$vuetify.breakpoint.name !== 'xs' ? 'Create ' : ''
        } Class.`,
        2: 'Click on the class you created.',
        3: 'To add students, click Invite Students.',
        4: 'Step 4 message.',
        5: 'Step 5 message.',
        6: 'Step 6 message.',
        7: 'Step 7 message.',
      },
    }
  },
  computed: {
    ...mapState({
      n: (state) => state.user.onboardStep,
    }),
  },
  methods: {
    close() {
      this.onboardSnack = false
      // Emit event to turn off red outline
      $nuxt.$emit('close')
    },
  },
}
</script>
