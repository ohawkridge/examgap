<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" offset-md="1">
        <v-form ref="form">
          <p class="text-subtitle-2">Question text</p>
          <text-editor ref="question" :initial="question.text" class="mb-6" />
          <v-text-field
            v-if="question !== undefined"
            v-model="question.maxMark"
            :suffix="question.maxMark == 1 ? 'mark' : 'marks'"
            type="number"
            background-color="white"
            outlined
            min="1"
            :rules="rules.max"
            persistent-hint
            hint="Max. mark"
            class="num-field mb-6"
            required
          ></v-text-field>
          <p class="text-subtitle-2">Model answer</p>
          <text-editor
            ref="model"
            :initial="question.modelAnswer"
            class="mb-6"
          />
          <p class="text-subtitle-2">
            Keywords
            <v-menu offset-y open-on-hover rounded="lg">
              <template #activator="{ on }">
                <font-awesome-icon
                  icon="fa-light fa-circle-info"
                  class="ml-2 fa-lg"
                  v-on="on"
                />
              </template>
              <v-card max-width="280">
                <v-card-text>
                  Shown to students when <b>not</b> in exam mode.
                </v-card-text>
              </v-card>
            </v-menu>
          </p>
          <v-text-field
            v-model="question.keywords"
            outlined
            background-color="white"
            hint="Separate words with commas"
            persistent-hint
            placeholder="E.g. RAM, instructions, processor"
          ></v-text-field>
          <p class="text-subtitle-2 mt-3">
            Mark scheme
            <v-menu offset-y open-on-hover rounded="lg">
              <template #activator="{ on }">
                <font-awesome-icon
                  icon="fa-light fa-circle-info"
                  class="ml-2 fa-lg"
                  v-on="on"
                />
              </template>
              <v-card max-width="280">
                <v-card-text>
                  Add each mark scheme point in a new field. These will become
                  checkboxes when students answer the question.
                </v-card-text>
              </v-card>
            </v-menu>
          </p>
          <v-text-field
            v-for="(mark, i) in question.marks"
            :key="i"
            v-model="mark.text"
            :append-icon="question.marks.length > 1 ? '$minus' : ''"
            outlined
            background-color="white"
            hide-details
            class="mb-3"
            placeholder="One mark for..."
            @click:append="question.marks.splice(i, 1)"
          >
          </v-text-field>
          <div class="d-flex justify-end">
            <v-btn
              v-if="question.marks.length <= 20"
              rounded
              outlined
              color="primary"
              class="mt-2"
              @click="question.marks.push({ id: '', text: '' })"
            >
              Add mark
            </v-btn>
          </div>
          <p class="text-subtitle-2">Marking guidance</p>
          <text-editor
            ref="guidance"
            :initial="question.guidance"
            class="mb-6"
          />
          <p class="text-subtitle-2">
            Topics
            <v-menu offset-y open-on-hover rounded="lg">
              <template #activator="{ on }">
                <font-awesome-icon
                  icon="fa-light fa-circle-info"
                  class="ml-2 fa-lg"
                  v-on="on"
                />
              </template>
              <v-card max-width="280">
                <v-card-text>
                  (Optional) Map this question to topics in other courses.
                </v-card-text>
              </v-card>
            </v-menu>
          </p>
          <v-autocomplete
            v-model="question.selectedTopics"
            :items="topics"
            item-value="id"
            item-text="name"
            :loading="$fetchState.pending || loading"
            outlined
            :rules="rules.topics"
            chips
            small-chips
            deletable-chips
            hint="Select all that apply"
            background-color="white"
            persistent-hint
            multiple
          >
          </v-autocomplete>
          <v-checkbox v-model="showAll" label="Show developing courses">
          </v-checkbox>
          <v-alert
            v-if="showAlert"
            type="error"
            text
            border="left"
            class="mt-3"
            dense
          >
            Question text and model answer required
          </v-alert>
          <div class="d-flex justify-end">
            <v-btn text rounded class="mr-2" @click="$router.go(-1)">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="loading"
              :loading="loading"
              rounded
              @click="save()"
            >
              {{ editing ? 'Save' : 'Create' }} question
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import TextEditor from '@/components/teacher/TextEditor'

export default {
  components: {
    TextEditor,
  },
  layout: 'app',
  data() {
    return {
      loading: false,
      rules: {
        max: [(v) => (v && v < 13) || 'Max. 20 marks'],
        topics: [(v) => v.length > 0 || 'At least one topic required'],
      },
      showAlert: false,
      showAll: false,
      question: {
        id: '',
        text: '',
        maxMark: 1,
        modelAnswer: '',
        guidance: '',
        keywords: '',
        marks: [{ id: '', text: '' }], // Create first empty mark
        selectedTopics: [],
      },
    }
  },
  async fetch() {
    try {
      // Get topics for autocomplete
      await this.$store.dispatch('topics/getAllTopics', this.showAll)
      // Get existing question if editing
      if (this.editing) {
        const url = new URL(
          '/.netlify/functions/getQuestion',
          this.$config.baseURL
        )
        let question = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            questionId: this.$route.params.question,
          }),
          method: 'POST',
        })
        if (!question.ok) {
          throw new Error(`Error fetching question ${question.status}`)
        }
        question = await question.json()
        this.question = { ...question }
      }
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching topics',
      })
    }
  },
  head() {
    return {
      title: `${this.editing ? 'Edit' : 'Create'} Question`,
    }
  },
  computed: {
    editing() {
      return this.$route.params.question !== undefined
    },
    ...mapState({
      topics: (state) => state.topics.topics,
      topicId: (state) => state.topics.topicId,
    }),
  },
  watch: {
    async showAll() {
      try {
        this.loading = true
        await this.$store.dispatch('topics/getAllTopics', this.showAll)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    const x = this.editing ? 'Edit' : 'Create'
    this.$store.commit('app/setPageTitle', `${x} Question`)
    // On _course.vue, if 'New question' was clicked—prepoplate topic
    if (this.topicId !== '') {
      this.question.selectedTopics.push(this.topicId)
    }
  },
  methods: {
    getEditorText() {
      this.question.text = this.$refs.question.content.trim()
      this.question.modelAnswer = this.$refs.model.content.trim()
      this.question.guidance = this.$refs.guidance.content.trim()
    },
    // Make sure question text and model answer aren't blank
    validateEditors() {
      if (this.question.text === '' || this.question.modelAnswer === '') {
        this.showAlert = true
        return false
      }
      return true
    },
    // Mark scheme must contain at least as many points max. mark
    validateMarks() {
      if (this.question.marks.length >= this.question.maxMark) {
        // TODO Check all marks aren't empty
        if (this.question.marks[0].text !== '') {
          return true
        }
      }
      return false
    },
    async save() {
      // Get HTML from editors
      this.getEditorText()
      // Validate as much of the form as possible
      if (
        this.$refs.form.validate() &&
        this.validateEditors() &&
        this.validateMarks()
      ) {
        try {
          this.loading = true
          const payload = {
            edit: this.editing,
            question: this.question,
          }
          const res = await this.$store.dispatch('topics/saveQuestion', payload)
          console.debug(res)
          this.$snack.showMessage({
            type: 'success',
            msg: `Question ${this.editing ? 'saved' : 'created'}`,
          })
          // this.$router.push(`/question/${response.id}`) WHERE?
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error saving question',
          })
        } finally {
          this.loading = false
          this.showAlert = false
        }
      }
    },
  },
}
</script>

<style scoped>
/* reduce max. mark field width */
.num-field {
  width: 30%;
}
@media only screen and (min-width: 960px) {
  .num-field {
    width: 18%;
  }
}

/* round Editor corners */
.tiptap-vuetify-editor {
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px !important;
}
</style>
