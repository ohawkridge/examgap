<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <div class="text-h6">Create assignment</div>
        <div v-if="group && 'course' in group" class="text-subtitle-1">
          {{ group.name }}
          <v-icon small class="pb-1">{{ $icons.mdiArrowRight }}</v-icon>
          {{ group.course.name }} ({{ group.course.board }})
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center">
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
          <span>Clear selection</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              :disabled="selected.length == 0"
              v-bind="attrs"
              elevation="0"
              :class="`${obs === 7 ? 'red-out' : ''}`"
              @click="assign()"
              v-on="on"
            >
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              Assign ({{ selected.length }})</v-btn
            >
          </template>
          <span
            >Create assignment with {{ selected.length }} question{{
              selected.length | pluralize
            }}
          </span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="eg-card">
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
                        :class="i === 1 && obs === 5 ? 'red-out' : ''"
                        color="primary"
                        :title="`${topic.name} (${topic.count})`"
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
                                  :class="`${
                                    obs === 6 && i === 0 ? 'red-out' : ''
                                  }`"
                                  v-bind="attrs"
                                  v-on="on"
                                  @click.stop="
                                    $store.commit(
                                      'assignments/updateSelectedQuestions',
                                      q.id
                                    )
                                  "
                                >
                                  <v-icon
                                    :color="
                                      selected.includes(q.id) ? 'accent' : ''
                                    "
                                    >{{
                                      selected.includes(q.id)
                                        ? $icons.mdiMinus
                                        : $icons.mdiPlus
                                    }}</v-icon
                                  >
                                </v-btn>
                              </template>
                              <span>
                                {{ selected.includes(q.id) ? 'Remove' : 'Add' }}
                              </span>
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
                          No questions yet
                        </v-list-item-title>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-skeleton-loader>
              </v-col>
              <v-col cols="12" md="4">
                <div class="d-flex justify-space-between">
                  <p class="text-h6">Preview</p>
                  <QuestionDetailDialog
                    :question-id="questionId"
                    :disabled="questions.length === 0"
                  />
                </div>
                <div
                  v-if="preview"
                  class="pt-2 text-body-2"
                  v-html="preview.text"
                ></div>
                <div v-if="preview" class="d-flex justify-end">
                  <v-chip outlined
                    >{{ preview.maxMark }} mark{{ preview.maxMark | pluralize }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <CreateAssignment :questions="selected" />
        </v-card>
      </v-col>
    </v-row>
    <onboarding-snackbar />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiPlus,
  mdiMinus,
  mdiArrowRight,
  mdiInformationOutline,
} from '@mdi/js'
import CreateAssignment from '@/components/teacher/CreateAssignment'
import QuestionDetailDialog from '@/components/teacher/QuestionDetailDialog'
import OnboardingSnackbar from '@/components/teacher/OnboardingSnackbar'

export default {
  components: {
    CreateAssignment,
    QuestionDetailDialog,
    OnboardingSnackbar,
  },
  layout: 'app',
  data() {
    return {
      topics: [],
      questions: [],
      question: {},
      selectedQuestion: 0, // questions list v-model
      loading: false,
      outline: true,
    }
  },
  async fetch() {
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
    // Now we have the course's topics, get the questions
    this.loadQuestions()
  },
  head() {
    return {
      title: `Create assignment`,
    }
  },
  computed: {
    ...mapState({
      selected: (state) => state.assignments.selected,
      obs: (state) => state.user.onboardStep,
    }),
    ...mapGetters({ group: 'groups/activeGroup' }),
    // Since selectedQuestion is only an index of v-list of questions
    // Get the actual id of the currently selected question
    questionId() {
      return this.$fetchState.pending || this.questions.length === 0
        ? ''
        : this.questions[this.selectedQuestion].id
    },
    preview() {
      return this.questions[this.selectedQuestion]
    },
    // Remember which topic we were on last
    currentTopic: {
      get() {
        // In some circumstances, currentTopic may become undefined?
        const ct = this.$store.state.assignments.currentTopic
        // Since we only remember currentTopicIndex, it's possible
        // for currentTopicIndex to exceed the number of topics
        // if you go from a course with more topics to one with less
        return ct === undefined || ct > this.topics.length ? 0 : ct
      },
      set(value) {
        this.$store.commit('assignments/setCurrentTopic', value)
      },
    },
  },
  watch: {
    // Load questions when topic changes
    // TODO Can cause errors on logout?
    currentTopic() {
      if (this.group) {
        this.loadQuestions()
        // Select first question of topic by default
        this.selectedQuestion = 0
      }
      // Advance onboarding
      this.$store.commit('user/setOnboardStep', 6)
    },
    selected() {
      // Advance onboarding
      if (this.selected.length > 0) {
        this.$store.commit('user/setOnboardStep', 7)
      }
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
    // Get questions for topic
    async loadQuestions() {
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
            groupId: this.group.id,
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
    assign() {
      this.$nuxt.$emit('show-assign')
      // Onboarding complete
      this.$store.commit('user/setOnboardStep', 0)
    },
  },
}
</script>
