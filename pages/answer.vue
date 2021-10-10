<template>
  <div>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" md="10" lg="8" class="mt-sm-6">
          <div v-if="!marking">
            <!-- Skeletons -->
            <div v-if="$fetchState.pending">
              <v-skeleton-loader type="paragraph" :loading="true">
              </v-skeleton-loader>
              <v-skeleton-loader type="paragraph" class="mt-4" :loading="true">
              </v-skeleton-loader>
              <v-skeleton-loader
                type="chip"
                class="float-right"
                :loading="true"
              >
              </v-skeleton-loader>
              <v-skeleton-loader
                type="image"
                :loading="true"
                class="clear-right pt-4"
              >
              </v-skeleton-loader>
              <v-skeleton-loader
                type="chip"
                :loading="true"
                class="float-right pt-4"
              >
              </v-skeleton-loader>
            </div>
            <div v-else>
              <div id="question" v-html="question.text"></div>
              <div class="d-flex justify-space-between mb-4">
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-btn
                      icon
                      :disabled="speakDisabled"
                      class="mr-2"
                      @click="speak()"
                      v-on="on"
                    >
                      <font-awesome-icon icon="fa-light fa-ear-listen" />
                    </v-btn>
                  </template>
                  <span>Speak question</span>
                </v-tooltip>
                <v-chip small outlined>
                  {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
                </v-chip>
              </div>
              <v-textarea
                v-model="answer"
                outlined
                color="primary"
                auto-grow
                label="Your answer"
                hide-details
                :append-icon="
                  saving
                    ? 'fa-light fa-cloud-arrow-up'
                    : 'fa-light fa-cloud-check'
                "
                class="mb-2"
                @input="update()"
              >
              </v-textarea>
              <div v-if="showHelp" class="d-flex justify-space-between">
                <div>
                  <v-chip
                    v-for="(word, i) in keywords"
                    :key="i"
                    class="mr-2 mb-2"
                    :color="used(word) ? 'green' : 'red'"
                    small
                  >
                    {{ word }}
                    <font-awesome-icon
                      v-if="used(word)"
                      icon="fa-light fa-check"
                      class="ml-2"
                    />
                  </v-chip>
                </div>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-progress-circular
                      :value="progress"
                      :color="color"
                      size="32"
                      v-on="on"
                    >
                      {{ wordCount }}
                    </v-progress-circular>
                  </template>
                  <span>Words</span>
                </v-tooltip>
              </div>
              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="primary"
                  rounded
                  elevation="0"
                  @click="selfMark()"
                >
                  Mark
                </v-btn>
              </div>
            </div>
          </div>
          <!-- **MARKING** -->
          <div v-else>
            <div>
              <p class="text-subtitle-1 font-weight-medium mb-4">Your answer</p>
              <p class="breaks" v-text="answer"></p>
            </div>
            <p class="text-subtitle-1 font-weight-medium mb-4">Mark scheme</p>
            <v-checkbox
              v-for="(m, i) in question.marks"
              :key="i"
              v-model="marks"
              color="success"
              hide-details
              :label="m.text"
              :value="m.id"
              @change="checkMax()"
            >
            </v-checkbox>
            <p class="mt-2 accent--text">
              Max. {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </p>
            <p class="text-subtitle-1 font-weight-medium my-4">
              Marking guidance
            </p>
            <div
              v-if="question.guidance !== ''"
              v-html="question.guidance"
            ></div>
            <p v-else>None</p>
            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                rounded
                elevation="0"
                :loading="loading"
                :disabled="loading"
                @click="done()"
              >
                Done
              </v-btn>
            </div>
          </div>
          <!-- Confirm dialog -->
          <v-dialog v-model="confirmDialog" width="440">
            <v-card>
              <v-card-title class="d-flex justify-center">
                Are you sure?
              </v-card-title>
              <v-card-text>
                <p>Once you've seen the mark scheme, you can't go back.</p>
                <div class="d-flex justify-end">
                  <v-btn
                    text
                    rounded
                    class="mr-2"
                    @click="confirmDialog = false"
                    >Go back</v-btn
                  >
                  <v-btn
                    color="primary"
                    rounded
                    elevation="0"
                    @click="confirm()"
                  >
                    Mark</v-btn
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  async beforeRouteLeave(to, from, next) {
    // Cancel speaking
    this.speaking = undefined
    this.synth.cancel()
    // Save self marks
    if (this.marking || confirm(`Really leave without marking?`)) {
      // If revising, increment count for topic
      if (this.responseId !== '' && this.revising) {
        this.$store.commit('topics/incrementTopicCount')
      }
      await this.$store.dispatch('assignment/saveSelfMarks', this.marks)
      // Clear responseId
      // (otherwise new responses will continue to use old id)
      this.$store.commit('assignment/setResponseId', '')
      next()
    }
  },
  layout: 'app',
  data() {
    return {
      answer: ``,
      saved: {},
      marking: false,
      marks: [],
      examMode: false,
      synth: null,
      voices: [],
      speakDisabled: false,
      prefVoice: false,
      saving: false,
      confirmDialog: false,
      loading: false,
    }
  },
  async fetch() {
    try {
      await this.$store.dispatch('assignment/getQuestion')
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching question',
      })
    }
  },
  computed: {
    ...mapState({
      question: (state) => state.assignment.question,
      assignmentId: (state) => state.assignment.assignmentId,
      responseId: (state) => state.assignment.responseId,
      reviseExamMode: (state) => state.user.reviseExamMode,
    }),
    ...mapGetters({ group: 'user/activeGroup' }),
    // Set assignment or independent revision?
    revising() {
      return this.assignmentId === ''
    },
    wordCount() {
      let words = this.parse(this.answer).split(' ')
      words = words.filter((w) => w !== '')
      return words.length
    },
    // Show keywords & min. word count?
    showHelp() {
      return (
        (this.revising && !this.reviseExamMode) ||
        (!this.revising && !this.examMode)
      )
    },
    // Value % for v-circular-progress
    progress() {
      return (this.wordCount / this.question.minWords) * 100
    },
    color() {
      if (this.progress < 40) {
        return 'red'
      } else if (this.progress > 80) {
        return 'green'
      } else {
        return 'orange'
      }
    },
    // Separate keywords String into individual words
    keywords() {
      if (this.question.keywords === '') return ''
      return this.question.keywords.split(',').map((kw) => kw.trim())
    },
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Question')
    this.synth = window.speechSynthesis
    // Call getVoices twice so it's ready when needed
    // https://stackoverflow.com/questions/22812303/why-is-my-speech-synthesis-api-voice-changing-when-function-run-more-than-1-time
    this.synth.onvoiceschanged = function () {
      this.voices = window.speechSynthesis.getVoices()
    }
    this.synth.getVoices()
    // Copy mode from store so it doesn't change
    // while the student is answering a question
    this.examMode = this.$store.state.user.examMode
    // Add tooltips for command words
    const commandWords = this.group.course.commands
    if (commandWords !== '') {
      for (const el of document.querySelectorAll('strong, b')) {
        const word = el.innerHTML.toLowerCase()
        // Set data-text attribute and css class
        if (word in commandWords) {
          el.classList.add('command')
          el.setAttribute('data-text', commandWords[word])
        }
      }
    }
  },
  methods: {
    // Confirm enter self-marking
    // (even if answer isn't great)
    confirm() {
      this.marking = true
      this.confirmDialog = false
      this.$store.commit('app/setPageTitle', 'Marking')
    },
    // Ask for confirmation if answer is blank or very short
    selfMark() {
      if (this.wordCount === 0 || this.wordCount < this.question.minWords / 3) {
        this.confirmDialog = true
      } else {
        this.marking = true
        this.$store.commit('app/setPageTitle', 'Marking')
      }
    },
    // Debounce answer area
    // N.B. If the first call to saveAnswer doesn't complete
    // within 1800ms you may get duplicate responses
    update: debounce(function () {
      this.save()
    }, 1800),
    // Get SpeechSynthesisVoice objects if supported
    // https://wicg.github.io/speech-api/#utterance-attributes
    getVoices() {
      this.voices = []
      const voices = this.synth.getVoices()
      for (const voice of voices) {
        // console.log(`${voice.name} (${voice.lang})`);
        this.voices.push(voice)
        if (voice.name === 'Daniel') {
          this.prefVoice = voice
        }
      }
    },
    // https://codepen.io/richardengle/pen/KKNzKXg?editors=0010
    speak() {
      if (this.voices.length === 0) this.getVoices()
      if (this.voices.length > 0) {
        this.speakDisabled = true
        const words = this.$options.filters.strip(this.question.text)
        const toSpeak = new SpeechSynthesisUtterance(words)
        this.synth.speak(toSpeak)
        this.speaking = 1
        toSpeak.addEventListener('end', () => {
          this.speakDisabled = false
        })
      } else {
        this.$snack.showMessage({
          type: 'error',
          msg: 'Not supported by browser',
        })
      }
    },
    done() {
      // Just change the route
      // beforeRouteLeave handles saving marks etc.
      this.loading = true
      const route = this.revising ? `/home` : `/assignment/${this.assignmentId}`
      this.$router.push(route)
    },
    // Don't exceed max. mark
    checkMax() {
      if (this.marks.length > this.question.maxMark) {
        this.$snack.showMessage({
          msg: `Max. mark is ${this.question.maxMark}`,
        })
        this.marks.splice(-1, 1) // Uncheck box
      }
    },
    // Save response
    async save() {
      try {
        this.saving = true
        await this.$store.dispatch('assignment/saveAnswer', this.answer)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          msg: 'Error saving answer',
          type: 'error',
        })
      } finally {
        this.saving = false
      }
    },
    // Check if keyword used in answer
    used(word) {
      return this.parse(this.answer).split(' ').includes(word.toLowerCase())
    },
    // Enforce spaces after fullstops; strip punctuation
    parse(text) {
      text = text.toLowerCase()
      text = text.replace(/[.,/#!$%^&*;:{}=_`~()]/g, ' ')
      text = text.replace(/\s{2,}/g, ' ')
      text = text.replace(/\r?\n|\r/g, ' ')
      text = text.trim()
      return text
    },
  },
}
</script>

<style scoped>
span.v-chip.theme--light.red {
  background-color: rgb(254, 216, 216) !important;
  color: rgb(95, 28, 30) !important;
}

span.v-chip.theme--light.green {
  background-color: rgb(201, 237, 194) !important;
  color: rgb(18, 39, 14) !important;
}

/* Needs 'deep' selecting */
/* https://stackoverflow.com/questions/52310060/how-to-override-vuetify-styles */
.command {
  border-bottom: 1px dashed #0078a0;
  cursor: pointer !important;
  position: relative;
}

div.v-card__text >>> .command:before {
  content: attr(data-text);
  position: absolute;
  /* vertically center */
  /* top: 50%; */
  /* transform: translateY(-50%); */
  margin-left: -120px;
  top: 110%;
  left: 50%;
  width: 240px;
  padding: 6px;
  border-radius: 4px;
  background: rgb(126, 126, 126);
  color: #fff;
  text-align: center;
  display: none;
}

/* show on hover */
div.v-card__text >>> .command:hover:before {
  display: block;
  font-weight: normal;
}

.clear-right {
  clear: right;
}
</style>
