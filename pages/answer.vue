<template>
  <v-row class="justify-center">
    <v-col cols="12" md="10">
      <v-card v-if="!marking" class="pa-md-3 mt-sm-3">
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
                :counter="showHelp ? question.minWords : ''"
                color="primary"
                auto-grow
                :append-icon="
                  saving
                    ? $icons.mdiCloudSyncOutline
                    : $icons.mdiCloudCheckOutline
                "
                label="Your answer"
                :counter-value="counterVal"
                @input="update()"
              >
              </v-textarea>
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
              <!-- <v-tooltip bottom>
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
                <span>Word count</span>
              </v-tooltip> -->
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn color="primary" elevation="0" @click="selfMark()">
                Self mark
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!-- Marking dialog -->
      <v-card v-if="marking" class="pa-md-3">
        <v-card-title> Self Marking </v-card-title>
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
                @change="checkMax()"
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
      <!-- Confirm dialog -->
      <v-dialog v-model="confirmDialog" width="420">
        <v-card class="modal">
          <v-card-title class="d-flex justify-center"> Self mark </v-card-title>
          <v-card-text>
            Are you sure? Once you've seen the mark scheme, you can't go back.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="confirmDialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              elevation="0"
              @click="
                marking = true
                confirmDialog = false
              "
            >
              Self mark</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { debounce } from 'lodash'
import {
  mdiTextToSpeech,
  mdiPause,
  mdiCloudCheckOutline,
  mdiCloudSyncOutline,
} from '@mdi/js'

export default {
  beforeRouteLeave(to, from, next) {
    // Cancel speaking
    this.speaking = undefined
    this.synth.cancel()
    // Reset responseId
    // (otherwise new responses will continue to use old id)
    this.$store.commit('assignment/setResponseId', '')
    // Save self marks
    if (this.marking || confirm(`Really leave without marking?`)) {
      // Increment count for topic
      if (this.responseId !== '' && this.revising) {
        this.$store.commit('topics/incrementTopicCount')
      }
      this.saveMarks()
      next()
    }
  },
  layout: 'app',
  // Remember, asyncData has no access to 'this'
  async asyncData({ store, $config: { baseURL } }) {
    const url = new URL('/.netlify/functions/getQuestion', baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        questionId: store.state.assignment.questionId,
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
      marks: [],
      examMode: false,
      synth: null,
      voices: [],
      speakDisabled: false,
      prefVoice: false,
      saving: false,
      finishClicked: false,
      confirmDialog: false,
    }
  },
  computed: {
    ...mapState({
      assignmentId: (state) => state.assignment.assignmentId,
      reviseExamMode: (state) => state.user.reviseExamMode,
    }),
    ...mapGetters({ group: 'user/activeGroup' }),
    // Set assignment or independent revision?
    revising() {
      return this.assignmentId === 0
    },
    wordCount() {
      return this.parse(this.answer).split(' ').length - 1
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
      mdiCloudCheckOutline,
      mdiCloudSyncOutline,
    }
  },
  mounted() {
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
    // N.B. counter-value must be a function
    counterVal() {
      if (!this.showHelp) return ''
      return this.parse(this.answer)
        .split(' ')
        .filter((w) => w !== '').length
    },
    // Ask for confirmation if answer is blank or very short
    selfMark() {
      if (this.wordCount === 0 || this.wordCount < this.question.minWords / 3) {
        this.confirmDialog = true
      } else {
        this.marking = true
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
    // Save self marks to db
    async saveMarks() {
      try {
        const payload = {
          responseId: this.responseId,
          markIds: this.marks,
        }
        await this.$store.dispatch('assignment/saveSelfMarks', payload)
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving marks',
        })
      }
    },
    // Save student's response
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
