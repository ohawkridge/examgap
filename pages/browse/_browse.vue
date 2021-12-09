<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <div>
          <v-btn text color="tertiary" rounded @click="selection = []">
            Clear
          </v-btn>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                color="primary"
                :disabled="selection.length == 0"
                elevation="0"
                rounded
                class="ml-2"
                v-on="on"
                @click="$nuxt.$emit('create-ass')"
              >
                Assign ({{ selection.length }})
              </v-btn>
            </template>
            <span
              >Assign {{ selection.length }} question{{
                selection.length | pluralize
              }}</span
            >
          </v-tooltip>
        </div>
        <v-btn
          elevation="0"
          rounded
          text
          color="primary"
          @click="newQuestion()"
        >
          <font-awesome-icon icon="fa-light fa-plus" class="mr-2" />
          New Question
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <!-- Topics xx -->
      <v-col cols="12" md="3">
        <v-list dense rounded class="bg-color">
          <v-list-item-group v-model="topicId" active-class="secondary--text">
            <v-list-item
              v-for="(topic, i) in topics"
              :key="i"
              :value="topic.id"
              color="primary"
              :title="topic.name"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ topic.name }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  {{ topic.count }}
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <!-- Questions xx -->
      <v-col cols="12" md="4">
        <v-list
          v-if="!$fetchState.pending"
          id="questions"
          class="bg-color"
          dense
          nav
        >
          <v-list-item-group
            v-model="selection"
            multiple
            active-class="green--text"
          >
            <v-list-item
              v-for="(q, i) in questions"
              :key="i"
              :value="q.id"
              @mouseover="preview(q.id)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ q.text | strip }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ q.maxMark }} mark{{ q.maxMark | pluralize }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-scroll-x-transition>
                  <font-awesome-icon
                    v-if="selection.includes(q.id)"
                    icon="fa-light fa-circle-check"
                    class="fa-lg"
                  />
                </v-scroll-x-transition>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <!-- Preview xx -->
      <v-col cols="12" md="5" class="pt-5">
        <template v-if="question">
          <div class="text-body-2" v-html="question.text"></div>
          <div class="d-flex justify-end mt-4">
            <v-chip outlined color="tertiary" small label>
              {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-chip>
          </div>
        </template>
        <div
          v-else
          id="hover"
          class="d-flex justify-center align-center text-body-2 grey--text"
        >
          Hover your pointer over a question to see a preview.
        </div>
      </v-col>
    </v-row>
    <the-create-assignment-dialog />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import debounce from 'lodash.debounce'
import TheCreateAssignmentDialog from '@/components/teacher/TheCreateAssignmentDialog'

export default {
  components: {
    TheCreateAssignmentDialog,
  },
  layout: 'app',
  data() {
    return {
      topicId: '',
      selection: [], // v-model for questions
      question: null,
      loading: false,
    }
  },
  async fetch() {
    // Dispatch action to get topics
    // (In turn dispatches topics/getQuestions)
    try {
      await this.$store.dispatch('topics/getTopics', this.$route.params.course)
      // Select first topic by default
      this.topicId = this.topics[0].id
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error loading topics',
      })
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      topics: (state) => state.topics.topics,
      questions: (state) => state.topics.questions,
      onboardStep: (state) => state.app.onboardStep,
    }),
  },
  watch: {
    // Get questions when topic is changed
    async topicId() {
      try {
        this.loading = true
        await this.$store.dispatch('topics/getQuestions', this.topicId)
      } catch (err) {
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error loading questions',
        })
      } finally {
        this.loading = false
        this.question = null
      }
    },
    selection() {
      if (this.onboardStep !== 0 && this.selection.length > 0) {
        this.$store.commit('app/setOnboardStep', 5)
      }
    },
  },
  mounted() {
    // Set page title
    const title = `${this.group.course.name} (${this.group.course.board})`
    this.$store.commit('app/setPageTitle', title)
    // Onboard if nec.
    const step = this.group.assignments.length === 0 ? 4 : 0
    this.$store.commit('app/setOnboardStep', step)
  },
  methods: {
    // Debounce mouseover events
    preview: debounce(function (id) {
      this.question = this.questions.find((q) => q.id === id)
    }, 300),
    // Redirect to /author + prepopulate topic
    newQuestion() {
      this.$store.commit('topics/setTopicId', this.topicId)
      this.$router.push(`/author`)
    },
  },
}
</script>

<style scoped>
#questions {
  max-height: 540px;
  overflow-y: scroll;
}

#hover {
  border: 2px dashed #e0e0e0;
  height: 100px;
  border-radius: 4px;
  padding: 12px;
}

.bg-color {
  background-color: #fbfcff;
}
</style>
