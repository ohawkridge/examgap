<template>
  <v-row class="justify-center mt-md-10">
    <v-col cols="12" md="10">
      <v-card v-if="!marking" class="pa-md-4">
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
        <v-container class="pa-4">
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
                hide-details
                color="primary"
                auto-grow
                label="Your answer"
              ></v-textarea>
            </v-col>
            <v-col
              v-if="showHelp"
              cols="12"
              class="d-flex justify-space-between align-center pt-0"
            >
              <div class="d-flex align-center">
                <v-chip
                  v-for="(word, i) in question.keywords"
                  :key="i"
                  class="mr-2"
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
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading"
                elevation="0"
                @click="save()"
              >
                Mark
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <!-- Marking dialog -->
      <v-card v-if="marking">
        <v-card-title> Marking </v-card-title>
        <v-container class="pa-4">
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
              <div class="d-flex justify-end">
                <v-btn
                  color="primary"
                  :loading="loading"
                  elevation="0"
                  @click="done()"
                >
                  Done
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { mdiTextToSpeech, mdiPause } from '@mdi/js'

export default {
  // Cancel speaking on page exit
  beforeRouteLeave(to, from, next) {
    this.speaking = undefined
    this.synth.cancel()
    next()
  },
  layout: 'app',
  async asyncData({ store, params }) {
    const url = new URL(
      '/.netlify/functions/getQuestion',
      'http://localhost:8888'
    )
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
    console.dir(question)
    return { question }
  },
  data() {
    return {
      answer: ``,
      saved: {},
      marking: false,
      loading: false,
      marks: [],
      // Copy mode from store so it doesn't change
      // while the student is answering a question
      // (user doc is streamed in near real time!)
      examMode: this.$store.state.user.user.examMode,
      synth: null,
      voices: [],
      speakDisabled: false,
      prefVoice: false,
    }
  },
  computed: {
    ...mapState({
      assignmentId: (state) => state.user.assignmentId,
      questionId: (state) => state.user.questionId,
      revisionExamMode: (state) => state.user.revisionExamMode,
      currentTopic: (state) => state.user.currentTopic,
    }),
    // Revising or completing assignment?
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
        (this.revising && !this.revisionExamMode) ||
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
  },
  created() {
    this.$icons = {
      mdiTextToSpeech,
      mdiPause,
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
  },
  methods: {
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
      this.marking = false
      // If revising, go home otherwise back to assignment
      if (this.revising) {
        this.$router.push(`/home`)
      } else {
        this.$router.push(`/assignment/${this.assignmentId}`)
      }
    },
    toggleMark(id) {
      // Don't exceed max mark, but always allow unticking
      const checked = this.marks.includes(id)
      if (checked && this.marks.length > this.question.maxMark) {
        this.$snack.showMessage({
          msg: `Maximum mark is ${this.question.maxMark}`,
          type: 'error',
        })
        this.marks.splice(-1, 1) // Uncheck
      } else {
        try {
          console.log(`TODO send to function`, id)
          // await toggleMark(id, this.saved.ref.id, checked, 0)
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error saving mark',
          })
        }
      }
    },
    // Save on 'Mark' click to reduce chance of student losing answer
    // async save() {
    //   this.loading = true
    //   try {
    //     // Save response while we add self marks
    //     this.saved = await saveAnswer(
    //       this.assignmentId,
    //       this.questionId,
    //       this.answer,
    //       this.revising ? this.currentTopic.id : 0
    //     )
    //     // If revising, increment count for this topic
    //     if (this.revising) this.$store.commit('user/incrementTopic')
    //   } catch (e) {
    //     console.error(e)
    //     this.$snack.showMessage({
    //       msg: 'Error saving answer',
    //       type: 'error',
    //     })
    //   } finally {
    //     this.marking = true
    //     this.loading = false
    //     this.speaking = undefined
    //     this.synth.cancel()
    //     this.$snack.showMessage({
    //       msg: 'Mark yourself',
    //       type: '',
    //     })
    //   }
    // },
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
</style>
