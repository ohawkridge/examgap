<template>
  <div>
    <v-row>
      <v-col
        id="div1"
        cols="12"
        class="d-md-flex justify-space-between align-center"
      >
        <div>
          <div class="text-h6">Create assignment</div>
          <v-skeleton-loader :loading="$fetchState.pending" type="text">
            <div v-if="group.course" class="text-subtitle-1">
              {{ group.name }}
              <v-icon small class="pb-1">{{ $icons.mdiArrowRight }}</v-icon>
              {{ group.course.name }} ({{ group.course.board }})
            </div>
          </v-skeleton-loader>
        </div>
        <div class="d-flex justify-end">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                button
                text
                v-bind="attrs"
                class="mr-2"
                v-on="on"
                @click="$store.commit('assignments/clearSelectedQuestions')"
              >
                Clear
              </v-btn>
            </template>
            <span>Clear selected questions</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                color="primary"
                :disabled="selectedQuestions.length == 0"
                v-bind="attrs"
                elevation="0"
                @click="assign()"
                v-on="on"
              >
                <v-icon left>{{ $icons.mdiPlus }}</v-icon>
                Assign ({{ selectedQuestions.length }})</v-btn
              >
            </template>
            <span
              >Create assignment with {{ selectedQuestions.length }} question{{
                selectedQuestions.length | pluralize
              }}
            </span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="12" md="3">
                <p class="text-h6">Topics ({{ topics.length }})</p>
                <v-list nav class="px-0">
                  <v-skeleton-loader
                    :loading="$fetchState.pending"
                    type="list"
                    :types="{ list: 'list-item-two-line@6' }"
                  >
                    <v-list-item-group v-model="currentTopic" color="primary">
                      <v-list-item
                        v-for="(topic, i) in topics"
                        :key="i"
                        color="primary"
                        :title="`${topic.name} (${topic.count})`"
                        @click="loadQuestions(topic.id)"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ topic.name }}
                            <span class="grey--text text--lighten-1">{{
                              topic.count
                            }}</span>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-skeleton-loader>
                </v-list>
              </v-col>
              <v-col cols="12" md="5">
                <p class="text-h6">Questions ({{ questions.length }})</p>
                <v-skeleton-loader
                  :loading="loading"
                  type="list"
                  :types="{ list: 'list-item-two-line@6' }"
                >
                  <v-list>
                    <v-list-item-group v-model="selectedQuestion">
                      <template v-for="(q, i) in questions">
                        <v-list-item :key="i" :value="i">
                          <v-list-item-content>
                            <v-list-item-title>{{
                              q.text | strip
                            }}</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ q.maxMark }} mark{{ q.maxMark | pluralize }}
                              <v-chip
                                v-for="(assignment, j) in q.previous"
                                :key="j"
                                small
                                outlined
                                label
                                class="ml-2"
                              >
                                <v-tooltip bottom>
                                  <template #activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                      {{ assignment.date | date }}</span
                                    >
                                  </template>
                                  <span>{{ assignment.name }}</span>
                                </v-tooltip></v-chip
                              >
                            </v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-tooltip bottom>
                              <template #activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click.stop="select(q.id)"
                                >
                                  <v-icon
                                    :color="
                                      selectedQuestions.includes(q.id)
                                        ? 'accent'
                                        : ''
                                    "
                                    >{{
                                      selectedQuestions.includes(q.id)
                                        ? $icons.mdiMinus
                                        : $icons.mdiPlus
                                    }}</v-icon
                                  >
                                </v-btn>
                              </template>
                              <span
                                >Click to
                                {{
                                  selectedQuestions.includes(q.id)
                                    ? 'remove'
                                    : 'add'
                                }}</span
                              >
                            </v-tooltip>
                          </v-list-item-action>
                        </v-list-item>
                      </template>
                      <v-list-item
                        v-if="!$fetchState.pending && questions.length === 0"
                        disabled
                      >
                        <v-list-item-icon>
                          <v-icon>{{ $icons.mdiInformationOutline }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          No {{ topics[currentTopic].name }} questions yet
                        </v-list-item-title>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-skeleton-loader>
              </v-col>
              <v-col cols="12" md="4">
                <div class="d-flex justify-space-between">
                  <p class="text-h6">Preview</p>
                  <QuestionDetailDialog :question-id="questionId" />
                </div>
                <div v-if="preview" class="pt-2" v-html="preview.text"></div>
                <div v-if="preview" class="d-flex justify-end">
                  <v-chip outlined
                    >{{ preview.maxMark }} mark{{ preview.maxMark | pluralize }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <CreateAssignment :questions="selectedQuestions" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiPlus,
  mdiMinus,
  mdiArrowRight,
  mdiInformationOutline,
} from '@mdi/js'
import CreateAssignment from '@/components/teacher/CreateAssignment'
import QuestionDetailDialog from '@/components/teacher/QuestionDetailDialog'

export default {
  components: {
    CreateAssignment,
    QuestionDetailDialog,
  },
  layout: 'app',
  data() {
    return {
      topics: [],
      selectedQuestion: 0,
      questions: [],
      loading: false,
      question: {},
    }
  },
  async fetch() {
    // First get course topics
    try {
      const url = new URL('/.netlify/functions/getTopics', this.$config.baseURL)
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.$store.state.user.secret,
          courseId: this.$route.params.course,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching topics ${response.status}`)
      }
      this.topics = await response.json()
    } catch (e) {
      console.error(e)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching topics',
      })
    }
    // Separate function as needed when topic is changed
    this.loadQuestions()
  },
  head() {
    return {
      title: `Create assignment`,
    }
  },
  computed: {
    ...mapState({
      groupId: (state) => state.assignments.groupId,
      selectedQuestions: (state) => state.assignments.selectedQuestions,
    }),
    // Get the id of the current question
    questionId() {
      return this.$fetchState.loading || this.questions.length === 0
        ? ''
        : this.questions[this.selectedQuestion].id
    },
    preview() {
      return this.questions[this.selectedQuestion]
    },
    // Use the group id stored when 'Create Assignment'
    // was clicked to get the full group object
    group() {
      return this.$store.getters['groups/groupById'](this.groupId)
    },
    // Remember which topic we were on last
    currentTopic: {
      get() {
        return this.$store.state.assignments.currentTopic
      },
      set(value) {
        this.$store.commit('assignments/setCurrentTopic', value)
      },
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiMinus,
      mdiArrowRight,
      mdiInformationOutline,
    }
  },
  methods: {
    async loadQuestions(topicId) {
      // Now get questions for current topic
      try {
        this.loading = true
        const url = new URL(
          '/.netlify/functions/getQuestions',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            topicId: this.topics[this.currentTopic].id,
            groupId: this.groupId,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error fetching questions ${response.status}`)
        }
        this.questions = await response.json()
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error fetching questions',
        })
      } finally {
        this.loading = false
      }
    },
    // Add/remove questions from selection
    select(questionid) {
      this.$store.commit('assignments/updateSelectedQuestions', questionid)
    },
    // Show create assignment dialog
    assign() {
      this.$nuxt.$emit('show-assign')
    },
  },
}
</script>
