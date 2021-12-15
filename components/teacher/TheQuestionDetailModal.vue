<template>
  <v-dialog v-model="dialog" scrollable max-width="740">
    <template #activator="{ on }">
      <v-btn
        rounded
        text
        :disabled="questionId === ''"
        color="primary"
        class="mr-2"
        v-on="on"
      >
        View Question
      </v-btn>
    </template>
    <v-card
      class="rounded-xl"
      loader-height="4"
      :loading="loading"
      color="#fbfcff"
    >
      <v-card-title> </v-card-title>
      <v-card-text class="modal-text text-body-2" style="max-height: 600px">
        <p class="text-subtitle-1 font-weight-bold">Question</p>
        <div v-html="question.text"></div>
        <div class="d-flex justify-end mt-4">
          <v-chip outlined color="tertiary" small label>
            {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
          </v-chip>
        </div>
        <p class="text-subtitle-1 font-weight-bold">Mark scheme</p>
        <ul class="mb-4">
          <li v-for="(mark, i) in question.marks" :key="i">
            {{ mark.text }}
          </li>
        </ul>
        <p class="text-subtitle-1 font-weight-bold">Guidance</p>
        <div v-if="question.guidance" v-html="question.guidance"></div>
        <p class="text-subtitle-1 font-weight-bold">Model answer</p>
        <div v-html="question.modelAnswer"></div>
        <p class="text-subtitle-1 font-weight-bold">Keywords</p>
        <p v-if="question.keywords !== ''">{{ question.keywords }}</p>
        <p v-else>None</p>
        <div class="d-flex justify-end">
          <v-btn color="primary" text rounded @click="dialog = false">
            Close
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    questionId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  computed: {
    ...mapState({
      question: (state) => state.topics.question,
    }),
  },
  watch: {
    dialog() {
      if (this.dialog) {
        this.load()
      }
    },
  },
  methods: {
    async load() {
      try {
        this.loading = 'primary'
        await this.$store.dispatch('topics/getQuestion', this.questionId)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error loading question`,
        })
        this.dialog = false
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
