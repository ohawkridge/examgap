<template>
  <v-dialog v-model="dialog" max-width="840px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" :disabled="disabled" elevation="0" v-on="on">
        View question
      </v-btn>
    </template>
    <v-card class="pa-md-3">
      <v-skeleton-loader :loading="$fetchState.pending" type="card">
        <v-card-title class="d-flex justify-space-between align-start">
          <div>
            <p class="mb-0">Question</p>
            <p class="mb-0 text-subtitle-2">
              <nuxt-link nuxt :to="`/question/${questionId}`">{{
                questionId
              }}</nuxt-link>
            </p>
          </div>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                elevation="0"
                :color="included ? 'accent' : ''"
                @click="select(questionId)"
                v-on="on"
              >
                <v-icon left>{{
                  included ? $icons.mdiMinus : $icons.mdiPlus
                }}</v-icon>
                {{ included ? 'Remove' : 'Add' }}
              </v-btn>
            </template>
            <span>{{ included ? 'Remove from' : 'Add to' }} assignment</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text class="text-body-2">
          <div v-html="question.text"></div>
          <div class="d-flex justify-end">
            <v-chip outlined
              >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-chip>
          </div>
          <p class="text-subtitle-1 font-weight-medium">Mark Scheme</p>
          <ul class="mb-4">
            <li v-for="(mark, i) in question.marks" :key="i">
              {{ mark.text }}
            </li>
          </ul>
          <p class="text-subtitle-1 font-weight-medium">Guidance</p>
          <div v-if="question.guidance" v-html="question.guidance"></div>
          <p v-else>None</p>
          <p class="text-subtitle-1 font-weight-medium mt-4">Model Answer</p>
          <div v-html="question.modelAnswer"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            class="ml-2"
            elevation="0"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-skeleton-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { mdiPlus, mdiMinus } from '@mdi/js'

export default {
  name: 'QuestionDetailDialog',
  props: {
    questionId: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      question: {},
    }
  },
  async fetch() {
    // Think fetch here is called from parent so questionId won't
    // exist until questions have finished fetching in _course.vue
    if (this.questionId !== '') {
      try {
        const url = new URL(
          '/.netlify/functions/getQuestion',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            questionId: this.questionId,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error fetching question ${response.status}`)
        }
        this.question = await response.json()
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error loading question',
        })
      }
    }
  },
  computed: {
    ...mapState({
      selected: (state) => state.assignment.selected,
    }),
    included() {
      return this.selected.includes(this.questionId)
    },
  },
  watch: {
    dialog() {
      this.$fetch()
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiMinus,
    }
  },
  methods: {
    select(questionid) {
      this.$store.commit('assignments/updateSelectedQuestions', questionid)
    },
  },
}
</script>
