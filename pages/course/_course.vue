<template>
  <div>
    <v-row class="pa-3">
      <v-col cols="12" class="d-flex justify-end align-center">
        <create-assignment />
      </v-col>
    </v-row>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="3">
          <v-skeleton-loader
            v-if="$fetchState.pending"
            :loading="true"
            type="list"
            :types="{ list: 'list-item-two-line@6' }"
          >
          </v-skeleton-loader>
          <v-list v-else nav>
            <v-list-item-group v-model="currentTopicIndex" color="primary">
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
              <v-list-item v-if="$fetchState.error" color="error">
                <v-list-item-content>
                  <v-list-item-title>Error loading topics</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="12" md="5">
          <v-skeleton-loader
            v-if="$fetchState.pending || loading"
            :loading="true"
            type="list"
            :types="{ list: 'list-item-two-line@8' }"
          >
          </v-skeleton-loader>
          <v-list v-else>
            <v-list-item-group v-model="selectedQuestion">
              <template v-for="(q, i) in questions">
                <v-list-item :key="i" :value="i">
                  <v-list-item-content>
                    <v-list-item-title>{{ q.text | strip }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ q.maxMark }} mark{{ q.maxMark | pluralize }}
                      <v-chip
                        v-for="(assignment, j) in q.previous"
                        :key="j"
                        small
                        label
                        outlined
                        class="ml-2"
                      >
                        <v-tooltip bottom>
                          <template #activator="{ on }">
                            <span v-on="on"> {{ assignment.date | date }}</span>
                          </template>
                          <span>{{ assignment.name }}</span>
                        </v-tooltip></v-chip
                      >
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-btn icon v-on="on" @click.stop="add(q.id)">
                          <font-awesome-icon
                            v-if="selected.includes(q.id)"
                            icon="fa-light fa-minus"
                            class="fa-xl ico-red"
                            @click="question.marks.push({ id: '', text: '' })"
                          />
                          <font-awesome-icon
                            v-else
                            icon="fa-light fa-plus"
                            class="fa-xl"
                          />
                        </v-btn>
                      </template>
                      <span>
                        {{ selected.includes(q.id) ? 'Remove' : 'Add' }}
                      </span>
                    </v-tooltip>
                  </v-list-item-action>
                </v-list-item>
              </template>
              <v-list-item v-if="noQuestions">
                <v-list-item-icon>
                  <font-awesome-icon icon="fa-light fa-circle-info" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> No questions yet </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="12" md="4">
          <!-- Skeletons -->
          <template v-if="$fetchState.pending || loading">
            <v-skeleton-loader
              :loading="true"
              type="question"
              :types="{ question: 'paragraph' }"
              class="pa-5"
            >
            </v-skeleton-loader>
            <v-skeleton-loader
              :loading="true"
              type="question"
              :types="{ question: 'paragraph' }"
              class="px-5 mb-4"
            >
            </v-skeleton-loader>
            <v-skeleton-loader
              :loading="true"
              type="chip"
              class="px-5 d-flex justify-end"
            >
            </v-skeleton-loader>
          </template>
          <div v-else class="pa-3">
            <p>
              <nuxt-link
                v-if="question !== undefined"
                :to="`/question/${question.id}`"
              >
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <span v-on="on">{{ question.id }}</span>
                  </template>
                  <span>View</span>
                </v-tooltip>
              </nuxt-link>
            </p>
            <div v-html="question.text"></div>
            <div
              v-if="Object.keys(question).length !== 0"
              class="d-flex justify-end mt-4"
            >
              <v-chip outlined small label
                >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CreateAssignment from '@/components/teacher/CreateAssignment'

export default {
  components: { CreateAssignment },
  layout: 'app',
  data() {
    return {
      selectedQuestion: 0, // v-model for questions v-list
      loading: false,
    }
  },
  async fetch() {
    // Dispatch store action to get topics
    // N.B. This also fetches the first topic's questions
    await this.$store.dispatch('topics/getTopics', this.$route.params.course)
  },
  computed: {
    ...mapState({
      topics: (state) => state.topics.topics,
      questions: (state) => state.topics.questions,
      selected: (state) => state.topics.selected,
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
    async currentTopicIndex() {
      try {
        this.loading = true
        await this.$store.dispatch('topics/getQuestions')
      } catch (err) {
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error loading questions',
        })
      } finally {
        this.loading = false
      }
    },
    selected() {
      if (this.onboardStep !== 0 && this.selected.length > 0) {
        this.$store.commit('app/setOnboardStep', 5)
      }
    },
  },
  mounted() {
    this.$store.commit(
      'app/setPageTitle',
      `${this.group.course.name} (${this.group.course.board})`
    )
  },
  methods: {
    // Add/remove questions from assignment
    add(id) {
      this.$store.commit('topics/updateSelected', id)
    },
  },
}
</script>
