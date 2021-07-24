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
              @click="$store.commit('topics/clearSelectedQuestions')"
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
                    <v-list-item-group
                      v-model="currentTopicIndex"
                      color="primary"
                    >
                      <v-list-item
                        v-for="(topic, i) in topics"
                        :key="i"
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
                <p v-if="$fetchState.error" class="red--text">
                  Error loading topics
                </p>
              </v-col>
              <v-col cols="12" md="5">
                <p class="text-h6">Questions ({{ questions.length }})</p>
                <v-skeleton-loader
                  :loading="loading || $fetchState.loading"
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
                                class="ml-2"
                              >
                                <v-tooltip bottom>
                                  <template #activator="{ on }">
                                    <span v-on="on">
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
                              <template #activator="{ on }">
                                <v-btn
                                  icon
                                  v-on="on"
                                  @click.stop="
                                    $store.commit(
                                      'topics/updateSelectedQuestions',
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
                                {{
                                  selected.includes(q.id)
                                    ? 'Remove from'
                                    : 'Add to'
                                }}
                                assignment
                              </span>
                            </v-tooltip>
                          </v-list-item-action>
                        </v-list-item>
                      </template>
                      <v-list-item v-if="noQuestions" disabled>
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
                  <the-question-detail-dialog
                    v-if="question"
                    :question-id="question.id"
                    :disabled="questions.length === 0"
                  />
                </div>
                <div
                  v-if="question"
                  class="pt-2 text-body-2"
                  v-html="question.text"
                ></div>
                <div v-if="question" class="d-flex justify-end">
                  <v-chip outlined
                    >{{ question.maxMark }} mark{{
                      question.maxMark | pluralize
                    }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <CreateAssignment :questions="selected" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mdiPlus, mdiMinus, mdiArrowRight } from '@mdi/js'
import CreateAssignment from '@/components/teacher/CreateAssignment'
import TheQuestionDetailDialog from '@/components/teacher/TheQuestionDetailDialog'

export default {
  components: {
    CreateAssignment,
    TheQuestionDetailDialog,
  },
  layout: 'app',
  data() {
    return {
      selectedQuestion: 0, // v-model for questions v-list
    }
  },
  async fetch() {
    // Dispatch store action to get topics
    // N.B. This also fetches the first topic's questions
    await this.$store.dispatch('topics/getTopics', this.$route.params.course)
  },
  head() {
    return {
      title: `Create assignment`,
    }
  },
  computed: {
    ...mapState({
      topics: (state) => state.topics.topics,
      questions: (state) => state.topics.questions,
      selected: (state) => state.topics.selected,
      loading: (state) => state.topics.loading,
      onboardStep: (state) => state.app.onboardStep,
    }),
    ...mapGetters({ group: 'user/activeGroup' }),
    currentTopicIndex: {
      get() {
        return this.$store.state.topics.currentTopicIndex
      },
      set(i) {
        this.$store.commit('topics/setCurrentTopicIndex', i)
      },
    },
    question() {
      return this.questions.length === 0
        ? {}
        : this.questions[this.selectedQuestion]
    },
    noQuestions() {
      return (
        !this.$fetchState.pending &&
        this.questions.length === 0 &&
        !this.$fetchState.error
      )
    },
  },
  watch: {
    // Load questions when topic changes
    currentTopicIndex() {
      this.$store.dispatch('topics/getQuestions')
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiMinus,
      mdiArrowRight,
    }
  },
  methods: {
    assign() {
      this.$nuxt.$emit('show-assign')
      this.$store.commit('app/setOnboardStep', 6)
    },
  },
}
</script>
