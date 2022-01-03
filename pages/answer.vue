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
              <div class="d-flex justify-space-between align-center mb-4">
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-btn
                      icon
                      :disabled="speakDisabled"
                      @click="speak()"
                      v-on="on"
                    >
                      <font-awesome-icon
                        icon="fa-light fa-ear-listen"
                        class="fa-lg ico-btn"
                      />
                    </v-btn>
                  </template>
                  <span>Hear question</span>
                </v-tooltip>
                <v-chip small outlined label color="tertiary">
                  {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
                </v-chip>
              </div>
              <v-textarea
                v-model.trim="answer"
                outlined
                color="primary"
                auto-grow
                label="Your answer"
                hide-details
                class="mb-2"
              >
                <font-awesome-icon slot="append" :icon="icon" class="fa-lg" />
              </v-textarea>
              <div
                v-if="showHelp"
                class="d-flex justify-space-between align-center"
              >
                <div>
                  <span class="text-subtitle-2">Keywords:&nbsp;</span>
                  <v-chip
                    v-for="(word, i) in keywordArray"
                    :key="i"
                    class="mr-2"
                    :color="isUsed(word) ? 'green' : ''"
                    small
                  >
                    {{ word }}
                    <v-scroll-x-transition>
                      <font-awesome-icon
                        v-if="isUsed(word)"
                        icon="fa-light fa-check"
                        class="ml-2"
                      />
                    </v-scroll-x-transition>
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
                <v-btn color="primary" rounded @click="showMarking()">
                  <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
                    <font-awesome-icon
                      icon="fa-light fa-square-check"
                      class="fa-lg mr-2"
                    />
                    Mark
                  </span>
                </v-btn>
              </div>
            </div>
          </div>
          <!-- Self marking xx -->
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
            >
            </v-checkbox>
            <p class="mt-2 red--text">
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
          <!-- Confirm XX -->
          <v-dialog v-model="dialog" width="400">
            <v-card>
              <v-card-title class="flex-column pt-5 pb-4">
                <span class="secondary--text">
                  <font-awesome-icon icon="fa-light fa-square-check" />
                </span>
                <div class="text-h5 text-center">Really mark?</div>
              </v-card-title>
              <v-card-text>
                <p>Once you've seen the mark scheme, you can't go back.</p>
                <div class="d-flex justify-end">
                  <v-btn text rounded class="mr-2" @click="dialog = false">
                    Go Back
                  </v-btn>
                  <v-btn color="primary" rounded text @click="selfMark()">
                    Mark
                  </v-btn>
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
import debounce from 'lodash.debounce'

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
      debouncedAnswer: '',
      timeout: null,
      saved: {},
      marks: [],
      synth: null,
      voices: [],
      speakDisabled: false,
      prefVoice: false,
      saving: false,
      loading: false,
      dialog: false,
      marking: false,
      answer: '',
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
      examMode: (state) => state.user.examMode,
    }),
    // Saving response icon
    icon() {
      return `fa-light fa-cloud-${this.saving ? 'arrow-up' : 'check'}`
    },
    ...mapGetters({ group: 'user/activeGroup' }),
    // Set assignment or independent revision?
    revising() {
      return this.assignmentId === ''
    },
    // Get word count of student's answer
    wordCount() {
      const words = this.parse(this.answer).split(' ')
      return words.filter((w) => w !== '').length
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
      if (this.progress < 40) return 'red'
      if (this.progress > 80) return 'green'
      return 'orange'
    },
    // In the db, keywords are stored as a comma separated string
    keywordArray() {
      if (this.question.keywords === '') return ''
      return this.question.keywords.split(',').map((kw) => kw.trim())
    },
  },
  watch: {
    // Don't exceed max. mark
    marks() {
      if (this.marks.length > this.question.maxMark) {
        this.$snack.showMessage({
          type: 'error',
          msg: `Max. mark is ${this.question.maxMark}`,
        })
        this.marks.splice(-1, 1) // Uncheck box
      }
    },
    // Watch answer textarea in 'real time'
    // (but debounce save function)
    answer() {
      this.save()
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
    // Has the student made little/no attempt?
    noAttempt() {
      return this.wordCount === 0 || this.wordCount < this.question.minWords / 3
    },
    showMarking() {
      // Ask for confirmation if answer blank or very short
      if (this.noAttempt()) {
        this.dialog = true
      } else {
        this.selfMark()
      }
    },
    selfMark() {
      this.dialog = false
      this.marking = true
      this.$store.commit('app/setPageTitle', 'Marking')
    },
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
      this.loading = true // Prevent double save
      const route = this.revising ? `/home` : `/assignment/${this.assignmentId}`
      this.$router.push(route)
    },
    // Debounce save function (rather than answer v-model)
    // Otherwise, keywords and word count update on debounce
    save: debounce(async function () {
      // Don't attempt to save if another save is pending
      // If latency to the db exceeds debounce interval
      // then duplicate responses are possible
      if (!this.saving) {
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
      }
    }, 1500),
    // Check if keyword is used in answer
    isUsed(word) {
      return this.parse(this.answer).split(' ').includes(word.toLowerCase())
    },
    // Prepare text for wordCount
    // (remove extra spaces, add spaces after '.')
    parse(text) {
      return text.replace(/\s{2,}|[\r\n]|[-.]/g, ' ').toLowerCase()
    },
  },
}
</script>

<style scoped>
/* Command word tooltips */
.command {
  border-bottom: 1px dashed #0078a0;
  cursor: pointer !important;
  position: relative;
}

/* 'deep' select */
/* https://stackoverflow.com/questions/52310060/how-to-override-vuetify-styles */
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

div.v-card__text >>> .command:hover:before {
  display: block;
  font-weight: normal;
}

.clear-right {
  clear: right;
}
</style>
