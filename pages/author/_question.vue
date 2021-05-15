<template>
  <v-row class="d-flex justify-center mt-md-3">
    <v-col cols="12" md="10" lg="9">
      <v-skeleton-loader :loading="$fetchState.pending" type="card">
        <v-card class="pa-md-3">
          <v-card-title>
            {{ $route.params.question ? 'Edit' : 'Create' }} question
          </v-card-title>
          <v-card-text>
            <p class="text-subtitle-1 font-weight-bold">Question</p>
            <TextEditor ref="question" :initial="question.text" class="mb-6" />
            <v-text-field
              v-model="question.maxMark"
              :suffix="question.maxMark == 1 ? 'mark' : 'marks'"
              type="number"
              outlined
              min="1"
              :rules="rules.maxMark"
              persistent-hint
              hint="Maximum mark"
              class="num-field mb-6"
              required
            ></v-text-field>
            <p class="text-subtitle-1 font-weight-bold">Model answer</p>
            <TextEditor
              ref="model"
              :initial="question.modelAnswer"
              class="mb-6"
            />
            <p class="text-subtitle-1 font-weight-bold">Keywords</p>
            <v-text-field
              v-model="question.keywords"
              outlined
              hint="Separate words with commas"
              persistent-hint
              placeholder="E.g. RAM, instructions, processor"
            ></v-text-field>
            <div v-if="!$fetchState.pending && question.marks">
              <p class="text-subtitle-1 font-weight-bold">Mark scheme</p>
              <v-text-field
                v-for="i in question.marks.length"
                :key="i"
                v-model="question.marks[i - 1].text"
                outlined
                placeholder="One mark for..."
              >
                <template #append>
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        class="mr-1"
                        :disabled="question.marks.length === 13"
                        v-on="on"
                        @click="question.marks.push({ id: '', text: '' })"
                        >{{ $icons.mdiPlus }}</v-icon
                      >
                    </template>
                    <span>Add mark</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        :disabled="question.marks.length === 1"
                        v-on="on"
                        @click="remove(question.marks[i - 1].id)"
                        >{{ $icons.mdiMinus }}</v-icon
                      >
                    </template>
                    <span>Remove mark</span>
                  </v-tooltip>
                </template>
              </v-text-field>
              <p class="red--text">{{ question.marks }}</p>
            </div>
            <p class="text-subtitle-1 font-weight-bold">Marking guidance</p>
            <TextEditor
              ref="guidance"
              :initial="question.guidance"
              class="mb-6"
            />
            <p class="text-subtitle-1 font-weight-bold">Topics</p>
            <v-autocomplete
              v-model="question.selectedTopics"
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
            <div class="d-flex justify-end">
              <v-btn text class="mr-2" @click="$router.go(-1)"> Cancel </v-btn>
              <v-btn
                color="primary"
                :disabled="loading"
                :loading="loading"
                elevation="0"
                @click="save()"
              >
                Save question
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import TextEditor from '@/components/teacher/TextEditor'
import { mdiPlus, mdiMinus } from '@mdi/js'

export default {
  components: {
    TextEditor,
  },
  layout: 'app',
  data() {
    return {
      loading: false,
      topics: [],
      rules: {
        maxMark: [(v) => (v && v < 13) || 'Max. 12 marks'],
      },
      // Default values for new question
      question: {
        id: '',
        text: '',
        maxMark: 1,
        modelAnswer: '',
        guidance: '',
        keywords: '',
        marks: [{ id: '', text: '' }],
        selectedTopics: [],
      },
    }
  },
  async fetch() {
    // Get all topics for all courses for autocomplete
    try {
      const url = new URL(
        '/.netlify/functions/getAllTopics',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching topics ${response.status}`)
      }
      this.topics = await response.json()
    } catch (e) {
      console.error(e)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching topics',
      })
    }
    // For existing questions, get the question
    if (this.editing) {
      try {
        const url = new URL(
          '/.netlify/functions/getQuestion',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.secret,
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
          msg: 'Error fetching question',
        })
      }
    }
  },
  head() {
    return {
      title: this.editing ? 'Edit Question' : 'Create Question',
    }
  },
  computed: {
    editing() {
      return this.$route.params.question !== undefined
    },
    ...mapState({
      secret: (state) => state.user.secret,
    }),
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiMinus,
    }
  },
  methods: {
    // Remove mark from mark scheme
    remove(id) {
      // For new questions, remove the last mark added, otherwise
      // find the mark to remove by searching for its ID
      if (id === '') {
        this.question.marks.pop()
      } else {
        for (let i = 0; i < this.question.marks.length; i++) {
          if (this.question.marks[i].id === id) {
            this.question.marks.splice(i, 1)
          }
        }
      }
    },
    async save() {
      this.loading = true
      // Get HTML from editors
      this.question.text = this.$refs.question.content
      this.question.modelAnswer = this.$refs.model.content
      this.question.guidance = this.$refs.guidance.content
      try {
        const url = new URL(
          '/.netlify/functions/saveQuestion',
          this.$config.baseURL
        )
        let response = await fetch(url, {
          body: JSON.stringify({
            secret: this.secret,
            edit: this.editing,
            question: this.question,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error saving question ${response.status}`)
        }
        response = await response.json()
        // console.log(
        //   '%c' + 'Question',
        //   'padding:2px 4px;background-color:#0078a0;color:white;border-radius:3px'
        // )
        // console.log(response)
        this.$snack.showMessage({
          type: 'success',
          msg: `Question ${this.editing ? 'saved' : 'created'}`,
        })
        this.$router.push(`/question/${response.id}`)
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving question',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* reduce max. mark field width */
.num-field {
  width: 34%;
}
@media only screen and (min-width: 960px) {
  .num-field {
    width: 18%;
  }
}

/* round editor corners */
.tiptap-vuetify-editor {
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-top-left-radius: 4px !important;
  border-top-right-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}
</style>
