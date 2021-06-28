<template>
  <div>
    <v-card>
      <v-card-title> Revision topics ({{ topics.length }}) </v-card-title>
      <v-card-text>
        <template v-if="fetching" elevation="2" class="pa-4">
          <v-skeleton-loader
            v-bind="attrs"
            :loading="fetching"
            width="200%"
            type="heading"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            v-for="n in 8"
            :key="n"
            :loading="fetching"
            type="text"
            v-bind="attrs"
          >
          </v-skeleton-loader>
        </template>
        <v-list v-else>
          <v-list-item
            v-for="(topic, i) in topics"
            :key="i"
            :title="`Revise ${topic.name}`"
            class="px-0 px-md-3"
            :disabled="topic.count === 0"
            @click="revise(topic.id)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ topic.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-chip :color="topic.answered > 0 ? 'green' : ''">{{
                topic.answered
              }}</v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <!-- Revision mode dialog -->
    <v-dialog v-model="dialog" width="440">
      <v-card class="modal">
        <v-card-title class="d-flex justify-center">
          Revision mode
        </v-card-title>
        <v-card-text>
          <p>You will now see a practise exam question. Remember&hellip;</p>
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
              class="mt-0"
              color="primary"
              hide-details
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
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false"> Cancel </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            :disabled="loading"
            :loading="loading"
            @click="start()"
          >
            Start
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiTimerOutline, mdiBullseyeArrow } from '@mdi/js'

export default {
  name: 'TheRevisionCard',
  props: {
    // $fetchState from home.vue
    fetching: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      attrs: {
        class: 'mb-8',
      },
    }
  },
  computed: {
    ...mapState({
      topics: (state) => state.topics.topics,
    }),
    // N.B. This is only tracked locally
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
  methods: {
    revise(topicId) {
      // Remember topic id so we can increment
      // the count of questions later
      this.$store.commit('topics/setTopicId', topicId)
      this.dialog = true
    },
    async start() {
      try {
        this.loading = true
        const url = new URL(
          '/.netlify/functions/getRevisionQuestionId',
          this.$config.baseURL
        )
        let response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            topicId: this.$store.state.topics.topicId,
            answered: this.$store.getters['topics/topicCount'],
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error getting questionId ${response.status}`)
        }
        response = await response.json()
        // Store question info for later
        this.$store.commit('assignment/setAnswerData', {
          assignmentId: 0,
          questionId: response,
        })
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
