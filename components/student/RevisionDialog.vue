<template>
  <v-dialog v-model="dialog" width="440">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Revision mode </v-card-title>
      <v-card-text>
        <p>
          You will now see a practise
          <span class="font-weight-bold">{{ topic.name }}</span>
          question. Remember&hellip;
        </p>
        <ul class="no-bullet">
          <li class="mb-2">
            <v-icon class="mr-2 mb-1">{{ $icons.mdiTimerOutline }}</v-icon
            >Take your time
          </li>
          <li>
            <v-icon class="mr-2 mb-1">{{ $icons.mdiBullseyeArrow }}</v-icon
            >Mark yourself accurately
          </li>
        </ul>
        <div class="d-flex justify-space-between align-center mt-4">
          <v-switch
            v-model="revisionExamMode"
            inset
            class="mt-0"
            color="primary"
            hide-details
          >
            <template #label>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">Exam mode</span>
                </template>
                <span>Hide keywords and word count</span>
              </v-tooltip>
            </template>
          </v-switch>
          <v-btn
            color="primary"
            elevation="0"
            :disabled="loading"
            :loading="loading"
            @click="start()"
          >
            Start
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { mdiTimerOutline, mdiBullseyeArrow } from '@mdi/js'

export default {
  name: 'RevisionDialog',
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  computed: {
    ...mapState({
      topic: (state) => state.groups.currentRevisionTopic,
    }),
    // Store revisionExamMode locally
    revisionExamMode: {
      get() {
        return this.$store.state.user.reviseExamMode
      },
      set(val) {
        this.$store.commit('user/setRevisionExamMode', val)
        this.$snack.showMessage({
          type: '',
          msg: `Exam mode ${val ? 'ON' : 'OFF'}`,
        })
      },
    },
  },
  created() {
    this.$icons = {
      mdiTimerOutline,
      mdiBullseyeArrow,
    }
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
      this.loading = true
      try {
        const response = await fetch(
          '/.netlify/functions/getRandomQuestionId',
          {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              topicId: this.$store.state.groups.currentRevisionTopic.id,
              answered: this.$store.state.groups.currentRevisionTopic.answered,
            }),
            method: 'POST',
          }
        )
        if (!response.ok) {
          throw new Error(`Error getting random question ${response.status}`)
        }
        const questionId = await response.json()
        if (questionId !== '') {
          this.$store.commit('assignments/setAnswerData', {
            assignmentId: 0,
            questionId,
          })
          this.$router.push(`/answer`)
        }
        // Shouldn't get here (no questions for topic)
        // Fails silently
      } catch (e) {
        console.error(e)
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
