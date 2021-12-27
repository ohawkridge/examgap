<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn outlined rounded color="primary" nuxt to="/author">
          <font-awesome-icon icon="fa-light fa-plus" class="mr-2" />
          New Question
        </v-btn>
        <div>
          <v-btn
            rounded
            text
            color="primary"
            :disabled="!hoverPreview"
            class="mr-2"
            nuxt
            :to="hoverPreview ? `/question/${hoverPreview.id}` : ''"
          >
            View question
          </v-btn>
          <v-btn outlined rounded color="primary" @click="selection = []">
            Clear
          </v-btn>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                color="primary"
                :disabled="selection.length == 0"
                rounded
                class="ml-2"
                v-on="on"
                @click="$nuxt.$emit('create-ass')"
              >
                <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
                  Assign ({{ selection.length }})
                </span>
              </v-btn>
            </template>
            <span
              >Assign {{ selection.length }} question{{
                selection.length | pluralize
              }}</span
            >
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <!-- Topics xx -->
      <v-col cols="12" md="3">
        <v-list dense rounded color="transparent">
          <v-subheader> TOPICS </v-subheader>
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
          class="overflow-y-auto"
          nav
          dense
          color="transparent"
        >
          <v-subheader> QUESTIONS </v-subheader>
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
                  <v-chip
                    v-for="(assignment, j) in q.previous"
                    :key="j"
                    x-small
                    label
                    color="tertiary"
                    class="ml-2"
                  >
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <span :class="$vuetify.theme.dark ? 'd' : ''" v-on="on">
                          {{ assignment.date | date }}</span
                        >
                      </template>
                      <span>{{ assignment.name }}</span>
                    </v-tooltip>
                  </v-chip>
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
      <v-col cols="12" md="5" class="text-body-2" style="padding-top: 40px">
        <template v-if="hoverPreview">
          <div v-html="hoverPreview.text"></div>
          <div class="d-flex justify-end mt-3">
            <v-chip outlined color="tertiary" small label>
              {{ hoverPreview.maxMark }} mark{{
                hoverPreview.maxMark | pluralize
              }}
            </v-chip>
          </div>
        </template>
        <div
          v-else
          id="hover"
          class="d-flex justify-center align-center grey--text"
        >
          Hover your pointer over a question to see a preview.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import debounce from 'lodash.debounce'

export default {
  name: 'Questions',
  layout: 'app',
  data() {
    return {
      selection: [],
      hoverPreview: null,
      loading: false,
    }
  },
  async fetch() {
    try {
      // Fetch course topics
      const id = this.$route.params.questions
      await this.$store.dispatch('topics/getTopics', id)
      // Select first topic by default
      this.topicId = this.topics[0].id
      // Now fetch questions for topic
      await this.$store.dispatch('topics/getQuestions', this.topicId)
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error loading topics',
      })
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    ...mapState({
      topics: (state) => state.topics.topics,
      questions: (state) => state.topics.questions,
      onboardStep: (state) => state.app.onboardStep,
    }),
    topicId: {
      get() {
        return this.$store.state.topics.topicId
      },
      set(id) {
        this.$store.commit('topics/setTopicId', id)
      },
    },
  },
  watch: {
    async topicId() {
      // Update questions when topic changes
      try {
        this.loading = true
        await this.$store.dispatch('topics/getQuestions', this.topicId)
      } catch (err) {
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error loading questions',
        })
      } finally {
        this.hoverPreview = null // Clear preview
        this.loading = false
      }
    },
    selection() {
      if (this.onboardStep !== 0 && this.selection.length > 0) {
        this.$store.commit('app/setOnboardStep', 5)
      }
    },
  },
  mounted() {
    const title = `${this.group.course.name} (${this.group.course.board})`
    this.$store.commit('app/setPageTitle', title)
  },
  methods: {
    // Debounce mouseover events
    preview: debounce(function (id) {
      this.hoverPreview = this.questions.find((q) => q.id === id)
    }, 300),
    async getQuestion() {
      try {
        this.loading = true
        await this.$store.dispatch('topics/getQuestion', this.preview.id)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error loading question`,
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
#questions {
  height: 550px;
}

#hover {
  border: 2px dashed #e0e0e0;
  height: 100px;
  border-radius: 4px;
  padding: 12px;
}

.d {
  color: #241a00;
}
</style>
