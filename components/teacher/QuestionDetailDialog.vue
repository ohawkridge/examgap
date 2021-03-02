<template>
  <v-dialog v-model="dialog" max-width="900px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" outlined color="primary" v-on="on">
        Show Question
      </v-btn>
    </template>
    <v-card class="text-body-2 pa-md-4 modal">
      <v-skeleton-loader :loading="$fetchState.pending" type="card">
        <v-card-title> Question </v-card-title>
        <v-card-subtitle>
          {{ questionId }}
        </v-card-subtitle>
        <v-card-text class="text-body-1">
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
          <v-btn text nuxt :to="`/author/${question.id}`">
            Edit Question
          </v-btn>
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
export default {
  name: 'QuestionDetailDialog',
  props: {
    questionId: {
      type: String,
      required: true,
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
        const response = await fetch('/.netlify/functions/getQuestion', {
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
  watch: {
    dialog() {
      this.$fetch()
    },
  },
}
</script>
