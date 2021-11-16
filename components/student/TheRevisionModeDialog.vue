<template>
  <v-dialog v-model="dialog" width="440">
    <v-card>
      <v-card-title class="d-flex justify-center"> Revision mode </v-card-title>
      <v-card-text>
        <p>You will now see a practise exam question. Remember&hellip;</p>
        <ul class="no-bullet">
          <li class="mb-2">
            <font-awesome-icon icon="fa-light fa-timer" />
            Take your time
          </li>
          <li>
            <font-awesome-icon icon="fa-light fa-bullseye-arrow" />
            Mark yourself accurately
          </li>
        </ul>
        <div class="d-flex justify-space-between align-center mt-4">
          <v-switch
            v-model="revisionExamMode"
            color="primary"
            hide-details
            inset
            class="mt-0"
          >
            <template #label>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <span v-on="on">Exam mode</span>
                </template>
                <span>Hide keywords and word count</span>
              </v-tooltip>
            </template>
          </v-switch>
          <div>
            <v-btn
              color="primary"
              elevation="0"
              rounded
              :disabled="loading"
              :loading="loading"
              @click="start()"
            >
              Start
            </v-btn>
          </div>
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
    // Computed setter for store
    revisionExamMode: {
      get() {
        return this.$store.state.user.reviseExamMode
      },
      set(val) {
        this.$store.commit('user/setRevisionExamMode', val)
        this.$snack.showMessage({
          msg: `Exam mode ${val ? 'ON' : 'OFF'}`,
        })
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
        await this.$store.dispatch('assignment/revise')
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
