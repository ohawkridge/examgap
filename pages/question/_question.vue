<template>
  <v-row class="justify-center mt-md-3">
    <v-col cols="12" md="10">
      <v-skeleton-loader :loading="$fetchState.pending" type="card">
        <v-card class="pa-md-4">
          <v-card-title class="d-flex justify-space-between">
            Question
            <v-btn text nuxt :to="`/author/${question.id}`">
              Edit Question
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            {{ question.id }}
          </v-card-subtitle>
          <v-card-text>
            <div class="mt-4" v-html="question.text"></div>
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
            <p class="text-subtitle-1 font-weight-medium mt-4">Keywords</p>
            <p>{{ keywords }}</p>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      question: {},
    }
  },
  async fetch() {
    try {
      const url = new URL(
        '/.netlify/functions/getQuestion',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.$store.state.user.secret,
          questionId: this.$route.params.question,
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
  },
  computed: {
    keywords() {
      if (!this.$fetchState.pending && this.question.keywords) {
        return this.question.keywords.join(', ')
      } else {
        return ''
      }
    },
  },
}
</script>
