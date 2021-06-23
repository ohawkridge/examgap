<template>
  <v-row class="justify-center mt-sm-3">
    <v-col cols="12" md="10">
      <v-skeleton-loader :loading="$fetchState.pending" type="card">
        <v-card class="eg-card pa-sm-8">
          <v-card-title class="d-flex justify-space-between">
            Question
            <div>
              <v-btn
                elevation="0"
                nuxt
                :to="`/map/${question.id}`"
                class="mr-2"
              >
                Map
              </v-btn>
              <v-btn elevation="0" nuxt :to="`/author/${question.id}`">
                Edit
              </v-btn>
            </div>
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
            <p v-if="question.keywords !== ''">{{ question.keywords }}</p>
            <p v-else>None</p>
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
      overlay: false,
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
  mounted() {
    // Extract secret from local storage during hard refresh
    if (this.$store.state.user.secret === '') {
      const localObj = JSON.parse(window.localStorage.getItem('examgap'))
      this.$store.commit('user/setSecret', localObj.user.secret)
      this.$fetch()
    }
  },
}
</script>
