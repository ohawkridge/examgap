<template>
  <v-row class="justify-center mt-md-3">
    <v-col cols="12" md="10">
      <v-card v-if="!marking" class="pa-md-3">
        <v-card-title class="d-flex justify-space-between">
          Question
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                :disabled="speakDisabled"
                @click="speak()"
                v-on="on"
              >
                <v-icon>{{ $icons.mdiTextToSpeech }}</v-icon>
              </v-btn>
            </template>
            <span>Speak question</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div v-html="question.text"></div>
              <div class="d-flex justify-end">
                <v-chip outlined>
                  {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="answer"
                outlined
                color="primary"
                auto-grow
                :messages="saveStatus"
                label="Your answer"
                @input="update()"
              ></v-textarea>
            </v-col>
            <v-col
              v-if="showHelp"
              cols="12"
              class="d-flex justify-space-between pt-0"
            >
              <div class="pr-2">
                <v-chip
                  v-for="(word, i) in keywords"
                  :key="i"
                  class="mr-2 mb-2"
                  :color="used(word) ? 'green' : 'red'"
                >
                  {{ word }}
                </v-chip>
              </div>
              <v-progress-circular :value="progress" :color="color" size="32">
                {{ count }}
              </v-progress-circular>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn color="primary" elevation="0" @click="marking = true">
                <v-icon left>{{ $icons.mdiCheckboxMarkedOutline }}</v-icon>
                Self-mark
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!-- Marking dialog -->
      <v-card v-if="marking" class="pa-md-3">
        <v-card-title> Self-marking </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div id="ans" class="pa-4 breaks" v-text="answer"></div>
              <v-checkbox
                v-for="(m, i) in question.marks"
                :key="i"
                v-model="marks"
                color="success"
                :label="m.text"
                :value="m.id"
                @change="toggleMark(m.id)"
              >
              </v-checkbox>
              <p class="font-weight-bold">Max. {{ question.maxMark }}</p>
              <p class="text-subtitle-1 font-weight-medium">Marking guidance</p>
              <div
                v-if="question.guidance !== ''"
                v-html="question.guidance"
              ></div>
              <p v-else>None</p>
              <div class="d-flex justify-end">
                <v-btn color="primary" elevation="0" @click="done()">
                  Finish
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { debounce } from 'lodash'
import { mdiTextToSpeech, mdiPause, mdiCheckboxMarkedOutline } from '@mdi/js'

export default {
  beforeRouteLeave(to, from, next) {
    // Cancel speaking on page exit
    this.speaking = undefined
    this.synth.cancel()
    // Warn if not yet marked
    if (!this.marking) {
      if (confirm(`Really leave without marking?`)) next()
    }
    next()
  },
  layout: 'app',
  async asyncData({ $config: { baseURL }, store }) {
    const url = new URL('/.netlify/functions/getQuestion', baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        questionId: store.state.assignments.questionId,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching question ${response.status}`)
    }
    const question = await response.json()
    return { question }
  },
  data() {
    return {
      answer: ``,
      saved: {},
      marking: false,
      loading: false,
      marks: [],
      examMode: false,
      synth: null,
      voices: [],
      speakDisabled: false,
      prefVoice: false,
      saveStatus: '',
      responseId: '',
    }
  },
  computed: {
    ...mapState({
      assignmentId: (state) => state.assignments.assignmentId,
      questionId: (state) => state.assignments.questionId,
      reviseExamMode: (state) => state.user.reviseExamMode,
    }),
    ...mapGetters({ group: 'groups/activeGroup' }),
    commands() {
      return this.group.course.commands
    },
    // Set assignment or independent revision?
    revising() {
      return this.assignmentId === 0
    },
    // Count words in answer
    count() {
      return this.parse(this.answer).split(' ').length - 1
    },
    // Calculate % of word count
    progress() {
      return (this.count / this.question.minWords) * 100
    },
    // Show keywords & min. word count?
    showHelp() {
      return (
        (this.revising && !this.reviseExamMode) ||
        (!this.revising && !this.examMode)
      )
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
  created() {
    this.$icons = {
      mdiTextToSpeech,
      mdiPause,
      mdiCheckboxMarkedOutline,
    }
  },
  mounted() {
    this.synth = window.speechSynthesis
    // Call getVoices twice so it's ready when needed
    // https://stackoverflow.com/questions/22812303/why-is-my-speech-synthesis-api-voice-changing-when-function-run-more-than-1-time
    this.synth.onvoiceschanged = function () {
      // Call two
      this.voices = window.speechSynthesis.getVoices()
    }
    // Call one
    this.synth.getVoices()
    // Copy mode from store so it doesn't change
    // while the student is answering a question
    this.examMode = this.$store.state.user.examMode
    if (this.commands !== '') {
      this.addTooltips()
    }
  },
  methods: {
    // Add tooltips to command words
    addTooltips() {
      const els = document.querySelectorAll('strong, b')
      // Loop through <strong> or <b> elements looking for command words
      for (const el of els) {
        const word = el.innerHTML.toLowerCase()
        // If found, set data-text attribute
        if (word in this.commands) {
          el.classList.add('command')
          el.setAttribute('data-text', this.commands[word])
        }
      }
    },
    // Debounce answer area
    // N.B. If the first call to saveAnswer doesn't complete
    // within 1700ms you may get duplicate responses
    update: debounce(function () {
      this.save()
    }, 1700),
    // Get SpeechSynthesisVoice objects if supported
    // https://wicg.github.io/speech-api/#utterance-attributes
    getVoices() {
      // Third time's the charm!
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
      if (this.revising) {
        // Increment count of questions answered
        this.$store.commit('groups/incrementTopicCount')
        // Go home
        this.$router.push(`/home`)
      } else {
        // Go to assignment
        this.$router.push(`/assignment/${this.assignmentId}`)
      }
    },
    async toggleMark(id) {
      // Don't exceed max mark, but always allow unticking
      const checked = this.marks.includes(id)
      if (checked && this.marks.length > this.question.maxMark) {
        this.$snack.showMessage({
          msg: `Max. mark is ${this.question.maxMark}`,
          type: 'error',
        })
        this.marks.splice(-1, 1) // Uncheck
      } else {
        try {
          const url = new URL(
            '/.netlify/functions/toggleMark',
            this.$config.baseURL
          )
          const response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              responseId: this.responseId,
              markId: id,
              add: checked,
              teacher: false,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error marking ${response.status}`)
          }
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error marking',
          })
        }
      }
    },
    // Kids don't save shit, so save automatically
    async save() {
      try {
        this.saveStatus = `Saving...`
        const url = new URL(
          '/.netlify/functions/saveAnswer',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            assignmentId: this.$store.state.assignments.assignmentId,
            questionId: this.$store.state.assignments.questionId,
            text: this.answer,
            topicId: this.$store.state.assignments.topicId,
            responseId: this.responseId,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error saving answer ${response.status}`)
        }
        const docId = await response.json()
        // console.log(
        //   '%c' + 'Response',
        //   'padding:2px 4px;background-color:#0078a0;color:white;border-radius:3px'
        // )
        // console.log(docId)
        // Save response id to update just response text
        this.responseId = docId
        this.saveStatus = `Changes saved`
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          msg: 'Error saving answer',
          type: 'error',
        })
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
div.v-card__text >>> .command {
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
</style>
