<template>
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
        <v-list v-else id="topics" nav>
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
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="12" md="4">
        <v-skeleton-loader
          v-if="$fetchState.pending || loading"
          :loading="true"
          type="list"
          :types="{ list: 'list-item-two-line@8' }"
        >
        </v-skeleton-loader>
        <v-list v-else id="questions">
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
                  <v-scroll-x-transition>
                    <font-awesome-icon
                      v-if="selected.includes(q.id)"
                      icon="fa-light fa-circle-check"
                      class="fa-xl ico-green"
                    />
                  </v-scroll-x-transition>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-list-item v-if="noQuestions">
              <v-list-item-icon>
                <font-awesome-icon icon="fa-light fa-circle-info" class="xx" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> No questions yet </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="12" md="5">
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
          <div class="d-flex justify-space-between mb-3">
            <div
              v-if="question !== undefined && Object.keys(question).length > 0"
            >
              <v-btn
                nuxt
                :to="`/question/${question.id}`"
                rounded
                text
                elevation="0"
                small
                class="mr-2"
              >
                View question
              </v-btn>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    rounded
                    elevation="0"
                    small
                    :text="selected.includes(question.id) ? false : true"
                    :color="selected.includes(question.id) ? 'green' : ''"
                    :dark="selected.includes(question.id) ? true : false"
                    v-on="on"
                    @click="add()"
                  >
                    {{ selected.includes(question.id) ? 'Added' : 'Add' }}
                    <font-awesome-icon icon="fa-light fa-check" class="ml-2" />
                  </v-btn>
                </template>
                <span>
                  {{ selected.includes(question.id) ? 'Remove' : 'Add' }}
                </span>
              </v-tooltip>
            </div>
            <div>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    icon
                    small
                    v-on="on"
                    @click="$store.commit('topics/clearSelectedQuestions')"
                  >
                    <font-awesome-icon
                      icon="fa-light fa-trash-can-xmark"
                      class="xx"
                    />
                  </v-btn>
                </template>
                <span> Clear </span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    color="primary"
                    :disabled="selected.length == 0"
                    elevation="0"
                    rounded
                    class="ml-2"
                    small
                    v-on="on"
                    @click="$nuxt.$emit('create-ass')"
                  >
                    <!-- <font-awesome-icon icon="fa-light fa-plus" class="mr-2" /> -->
                    Assign ({{ selected.length }})
                  </v-btn>
                </template>
                <span
                  >Assign {{ selected.length }} question{{
                    selected.length | pluralize
                  }}</span
                >
              </v-tooltip>
            </div>
          </div>
          <div v-html="question.text"></div>
          <div
            v-if="Object.keys(question).length > 0"
            class="d-flex justify-end mt-4"
          >
            <v-chip outlined small label
              >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-chip>
          </div>
        </div>
      </v-col>
    </v-row>
    <the-create-assignment-dialog />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheCreateAssignmentDialog from '@/components/teacher/TheCreateAssignmentDialog'

export default {
  components: { TheCreateAssignmentDialog },
  layout: 'app',
  data() {
    return {
      selectedQuestion: 0, // v-model for questions v-list
      loading: false,
    }
  },
  async fetch() {
    // Dispatch store action to get topics
    // N.B. This action dispatches topics/getQuestions
    try {
      // TODO Experiment with pre-fetching this
      // Is too slow otherwise !
      if (this.topics.length === 0) {
        await this.$store.dispatch(
          'topics/getTopics',
          this.$route.params.course
        )
      }
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error loading topics',
      })
    }
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
        this.selectedQuestion = 0
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
    const title = `${this.group.course.name} (${this.group.course.board})`
    this.$store.commit('app/setPageTitle', title)
    // Onboard if never set an assignment
    const step = this.group.assignments.length === 0 ? 4 : 0
    this.$store.commit('app/setOnboardStep', step)
  },
  methods: {
    // Add/remove questions from assignment
    add() {
      this.$store.commit('topics/updateSelected', this.question.id)
    },
  },
}
</script>

<style scoped>
#topics {
  background-color: #fafafa;
}

#questions {
  background-color: #fafafa;
  max-height: 700px;
  overflow-y: scroll;
}

.xx {
  height: 18px;
  width: 18px;
}
</style>
