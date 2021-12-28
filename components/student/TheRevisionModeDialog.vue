<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="rounded-xl">
      <v-card-title class="d-flex justify-center text-h5 secondary--text pt-5">
        <font-awesome-icon icon="fa-light fa-head-side-brain" class="fa-sm" />
      </v-card-title>
      <v-card-text>
        <p class="text-h5 text-center">Revision mode</p>
        <p>
          You will now see a practise
          <strong>{{ $store.state.topics.topicName }}</strong> question. Take
          your time and try to mark yourself accurately.
        </p>
        <div class="d-flex align-center">
          <v-checkbox v-model="examMode" color="primary" label="Show keywords">
          </v-checkbox>
        </div>
        <div class="d-flex justify-end">
          <v-btn text rounded class="mr-2" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            rounded
            :disabled="loading"
            :loading="loading"
            @click="start()"
          >
            Revise
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TheRevisionModeDialog',
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  computed: {
    // Computed setter for examMode while revising
    examMode: {
      get() {
        return this.$store.state.user.reviseExamMode
      },
      set(val) {
        this.$store.commit('user/setexamMode', val)
      },
    },
  },
  beforeDestroy() {
    this.$nuxt.$off('show-revise')
  },
  mounted() {
    this.$nuxt.$on('show-revise', () => {
      this.dialog = true
    })
  },
  methods: {
    async start() {
      try {
        this.loading = true
        await this.$store.dispatch('assignment/getRevisionQuestion')
        this.$router.push(`/answer`)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error starting revision',
        })
      } finally {
        this.loading = false
        this.dialog = false
      }
    },
  },
}
</script>
