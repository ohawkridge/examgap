<template>
  <v-row class="justify-center">
    <v-col cols="12" md="10">
      <v-card class="pa-md-3 mt-md-3">
        <v-card-title>Map question</v-card-title>
        <v-card-text>
          <v-row class="justify-center">
            <v-col cols="6">
              <v-text-field
                v-model="id"
                outlined
                label="Question id"
                clearable
                @blur="getQuestion()"
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
                hint="Map to course topics"
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
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" elevation="0" class="ml-2" @click="save()">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      id: '',
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
  },
  // Since we don't have a router link to this page
  // Disable server-side fetching when rendering
  fetchOnServer: false,
  head() {
    return {
      title: 'Map question',
    }
  },
  methods: {
    async getQuestion() {
      if (this.id !== '') {
        console.log(`getQuestion`, this.id)
        try {
          const url = new URL(
            '/.netlify/functions/getQuestion',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              questionId: this.id,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error getting question ${response.status}`)
          }
          response = await response.json()
          this.question = response.text
          this.selectedTopics = response.selectedTopics
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error getting question',
          })
        }
      }
    },
    save() {
      console.log('Saving topics..')
    },
  },
}
</script>
