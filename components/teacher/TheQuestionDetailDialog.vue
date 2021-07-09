<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template #activator="{ on }">
      <v-btn :disabled="disabled" elevation="0" v-on="on"> View </v-btn>
    </template>
    <v-card :loading="$fetchState.pending">
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <p class="mb-0">Question</p>
          <p class="mb-0 text-subtitle-2">
            <nuxt-link
              nuxt
              :to="`/question/${questionId}`"
              class="text-decoration-none"
              >{{ questionId }}</nuxt-link
            >
          </p>
        </div>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              elevation="0"
              :color="included ? 'accent' : ''"
              @click="
                $store.commit('topics/updateSelectedQuestions', questionid)
              "
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
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { mdiPlus, mdiMinus } from '@mdi/js'

export default {
  name: 'QuestionDetailDialog',
  props: {
    // Be sure to provide a default prop
    // Will be undefined until fetch is complete
    questionId: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  async fetch() {
    // Fetch is called from parent (_course.vue)
    // questionId won't exist until questions loaded
    if (this.questionId !== '') {
      try {
        await this.$store.dispatch('topics/getQuestion', this.questionId)
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
      selected: (state) => state.topics.selected,
      question: (state) => state.topics.question,
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
}
</script>
