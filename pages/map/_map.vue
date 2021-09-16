<template>
  <div class="pa-4 mt-8">
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="questionId"
          outlined
          label="Question Id"
          clearable
          @blur="getQuestion(questionId)"
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
      </v-col>
      <v-col cols="6">
        <div v-html="question">
          <p class="text-h6">Preview</p>
        </div>
      </v-col>
    </v-row>
    <v-btn color="primary" rounded elevation="0" class="mt-4" @click="save()">
      Save
    </v-btn>
  </div>
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
      }),
      method: 'POST',
    })
    if (!topics.ok) {
      throw new Error(`Error fetching topics ${topics.status}`)
    }
    this.topics = await topics.json()
    this.getQuestion()
  },
  mounted() {
    this.questionId = this.$route.params.map
    this.$store.commit('app/setPageTitle', 'Topics')
  },
  methods: {
    async getQuestion(questionId = this.$route.params.map) {
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
          msg: 'Changes saved',
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
