<template>
  <v-container>
    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="questionId"
          outlined
          label="Question Id"
          clearable
          @input="getQuestion(questionId)"
        ></v-text-field>
        <v-autocomplete
          v-model="selectedTopics"
          :loading="$fetchState.pending"
          :items="topics"
          item-value="id"
          item-text="name"
          outlined
          chips
          small-chips
          deletable-chips
          hint="Select topics for question"
          persistent-hint
          multiple
        >
        </v-autocomplete>
        <v-checkbox
          v-model="allCourses"
          label="Show developing courses"
          hide-details
        >
        </v-checkbox>
        <v-btn
          color="primary"
          rounded
          elevation="0"
          class="mt-4"
          @click="save()"
        >
          Save
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <div v-html="question">
          <p class="text-h6">Preview</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      questionId: '',
      topics: [],
      question: '',
      selectedTopics: [],
      allCourses: false,
    }
  },
  async fetch() {
    const url = new URL(
      '/.netlify/functions/getAllTopics',
      this.$config.baseURL
    )
    const topics = await fetch(url, {
      body: JSON.stringify({
        secret: this.$store.state.user.secret,
        allCourses: this.allCourses,
      }),
      method: 'POST',
    })
    if (!topics.ok) {
      throw new Error(`Error fetching topics ${topics.status}`)
    }
    this.topics = await topics.json()
    this.getQuestion()
  },
  watch: {
    allCourses() {
      this.$fetch()
    },
  },
  mounted() {
    this.questionId = this.$route.params.map
    this.$store.commit('app/setPageTitle', 'Question topics')
  },
  methods: {
    async getQuestion(questionId = this.$route.params.map) {
      if (questionId !== null && questionId !== '') {
        // In case you paste with extra whitespace
        questionId = questionId.trim()
        try {
          const url = new URL(
            '/.netlify/functions/getQuestion',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              questionId,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error getting question ${response.status}`)
          }
          response = await response.json()
          this.question = response.text
          this.selectedTopics = response.selectedTopics
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error getting question',
          })
        }
      }
    },
    async save() {
      try {
        const url = new URL(
          '/.netlify/functions/updateMap',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            topics: this.selectedTopics,
            questionId: this.questionId,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error saving topics ${response.status}`)
        }
        this.$snack.showMessage({
          type: 'success',
          msg: 'Topics saved',
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving',
        })
      }
    },
  },
}
</script>
