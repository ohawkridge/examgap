<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-window v-model="step">
          <v-window-item :value="1" class="pa-1">
            <v-card class="rounded-xl">
              <!-- Skeletons -->
              <template v-if="$fetchState.pending">
                <v-skeleton-loader
                  type="list-item-avatar"
                  :loading="true"
                  class="mt-3"
                  width="48%"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="text"
                  :loading="true"
                  class="mt-8 ml-6"
                  width="22%"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="text"
                  :loading="true"
                  class="my-2 ml-6"
                  width="22%"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  v-if="true"
                  :types="{ table: 'table-thead, table-tbody@2' }"
                  type="table"
                  class="mt-8 px-6"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <v-card-title class="d-flex justify-space-between">
                  <div>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-btn
                          icon
                          class="mr-1"
                          @click="$router.go(-1)"
                          v-on="on"
                        >
                          <font-awesome-icon
                            icon="fa-light fa-arrow-left"
                            class="ico-btn"
                          />
                        </v-btn>
                      </template>
                      <span>Back</span>
                    </v-tooltip>
                    {{ assignment.name }}
                  </div>
                  <v-menu rounded="lg">
                    <template #activator="{ on }">
                      <v-btn icon v-on="on">
                        <font-awesome-icon
                          icon="fa-light fa-ellipsis-vertical"
                          class="ico-btn"
                        />
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="$fetch()">
                        <v-list-item-title> Refresh </v-list-item-title>
                      </v-list-item>
                      <v-list-item class="error--text" @click="delAss()">
                        <v-list-item-title> Delete </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row class="justify-center">
                      <v-col cols="12">
                        <p class="d-flex align-center mb-2">
                          <span class="font-weight-medium align-date"
                            >Start:</span
                          >
                          {{ assignment.start | date }}
                        </p>
                        <div class="d-flex align-center">
                          <span class="font-weight-medium align-date"
                            >Due:</span
                          >
                          {{ assignment.dateDue | date }}
                        </div>
                      </v-col>
                    </v-row>
                    <v-row class="justify-center">
                      <v-col cols="12">
                        <table id="table">
                          <thead>
                            <tr>
                              <th
                                v-for="(q, i) in assignment.headers"
                                :key="i"
                                :class="i === 0 ? 'text-left' : ''"
                              >
                                <span v-if="i === 0">Username</span>
                                <v-menu
                                  v-else
                                  offset-x
                                  open-on-hover
                                  rounded="lg"
                                >
                                  <template #activator="{ on }">
                                    <span v-on="on">{{
                                      `Q${i} [${q.maxMark}]`
                                    }}</span>
                                  </template>
                                  <v-card max-width="440" class="rounded-lg">
                                    <v-card-text class="text-body-2">
                                      <div
                                        v-html="assignment.headers[i].text"
                                      ></div>
                                      <div class="d-flex justify-end">
                                        <v-chip
                                          color="tertiary"
                                          outlined
                                          small
                                          label
                                        >
                                          {{ q.maxMark }} mark{{
                                            q.maxMark | pluralize
                                          }}
                                        </v-chip>
                                      </div>
                                    </v-card-text>
                                  </v-card>
                                </v-menu>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(student, i) in assignment.students"
                              :key="i"
                              height="57px"
                            >
                              <td>
                                {{ student.name }}
                              </td>
                              <td
                                v-for="j in assignment.numQuestions"
                                :key="j"
                                class="text-center"
                              >
                                <!-- (i, j) index into students[], responses[] -->
                                <!-- Not answered yet -->
                                <v-tooltip
                                  v-if="!student.responses[j - 1]"
                                  bottom
                                >
                                  <template #activator="{ on }">
                                    <span
                                      class="grey--text text--lighten-1"
                                      v-on="on"
                                    >
                                      <font-awesome-icon
                                        icon="fa-light fa-hourglass"
                                        class="fa-lg"
                                      />
                                    </span>
                                  </template>
                                  <span>Not answered yet</span>
                                </v-tooltip>
                                <!-- Teacher marked -->
                                <v-tooltip
                                  v-else-if="student.responses[j - 1].marked"
                                  bottom
                                >
                                  <template #activator="{ on }">
                                    <v-chip
                                      class="green"
                                      @click="mark(i, j)"
                                      v-on="on"
                                    >
                                      {{ student.responses[j - 1].tm.length }}
                                      <font-awesome-icon
                                        icon="fa-light fa-check-double"
                                        class="ml-2 fa-lg"
                                      />
                                    </v-chip>
                                    <span
                                      v-if="student.responses[j - 1].flagged"
                                      class="error--text"
                                    >
                                      <font-awesome-icon
                                        icon="fa-light fa-flag"
                                        class="fix-flag"
                                      />
                                    </span>
                                  </template>
                                  <span>Mark</span>
                                </v-tooltip>
                                <!-- Self marked -->
                                <v-tooltip v-else bottom>
                                  <template #activator="{ on }">
                                    <v-chip @click="mark(i, j)" v-on="on">
                                      {{ student.responses[j - 1].sm.length }}
                                      <font-awesome-icon
                                        icon="fa-light fa-check"
                                        class="ml-2 fa-lg"
                                      />
                                    </v-chip>
                                  </template>
                                  <span>Mark</span>
                                </v-tooltip>
                              </td>
                            </tr>
                            <tr v-if="assignment.students.length === 0">
                              <td
                                class="text-center"
                                :colspan="assignment.headers.length"
                              >
                                <p class="text-body-2 mt-4">No students yet</p>
                                <p>
                                  <v-btn
                                    color="primary"
                                    rounded
                                    elevation="0"
                                    @click="$nuxt.$emit('show-invite')"
                                  >
                                    Invite students</v-btn
                                  >
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div
                          class="d-flex justify-end align-center pa-4 text-body-2"
                        >
                          <font-awesome-icon
                            icon="fa-light fa-check"
                            class="fa-sm mr-1"
                          />
                          Self mark&nbsp;&nbsp;
                          <font-awesome-icon
                            icon="fa-light fa-check-double"
                            class="fa-sm mr-1"
                          />
                          Teacher mark&nbsp;&nbsp;
                          <font-awesome-icon
                            icon="fa-light fa-hourglass"
                            class="fa-sm mr-1"
                          />
                          Not answered yet
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </template>
            </v-card>
          </v-window-item>
          <!-- Marking xx -->
          <v-window-item :value="2" class="pa-1">
            <v-card class="rounded-xl">
              <v-card-title class="d-flex justify-space-between">
                <div>
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-btn icon class="mr-1" @click="close()" v-on="on">
                        <font-awesome-icon
                          icon="fa-light fa-arrow-left"
                          class="ico-btn"
                        />
                      </v-btn>
                    </template>
                    <span>Back</span>
                  </v-tooltip>
                  Marking
                </div>
                <div v-if="marking">
                  <!-- <font-awesome-icon
                    icon="fa-light fa-user-graduate"
                    class="mr-2"
                  />
                  <span class="text-body-1 font-weight-bold">{{
                    response.tm.length
                  }}</span>
                  <font-awesome-icon icon="fa-light fa-user" class="mr-2" />
                  <span class="text-body-1 font-weight-bold">{{
                    response.sm.length
                  }}</span> -->
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-btn
                        icon
                        class="mr-2"
                        :color="response.flagged ? 'red' : ''"
                        @click="flag()"
                        v-on="on"
                      >
                        <font-awesome-icon
                          icon="fa-light fa-flag"
                          class="fa-lg"
                        />
                      </v-btn>
                    </template>
                    <span>{{ response.flagged ? 'Remove flag' : 'Flag' }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-btn icon @click="next(-1)" v-on="on">
                        <font-awesome-icon
                          icon="fa-light fa-chevron-left"
                          class="fa-lg"
                        />
                      </v-btn>
                    </template>
                    <span>Previous</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-btn icon @click="next(1)" v-on="on">
                        <font-awesome-icon
                          icon="fa-light fa-chevron-right"
                          class="fa-lg"
                        />
                      </v-btn>
                    </template>
                    <span>Next</span>
                  </v-tooltip>
                </div>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="7">
                    <p class="text-subtitle-2">Question</p>
                    <template v-if="showMore">
                      <div v-html="question.text"></div>
                      <div class="d-flex justify-end">
                        <v-chip outlined small color="tertiary" label
                          >{{ question.maxMark }} mark{{
                            question.maxMark | pluralize
                          }}
                        </v-chip>
                      </div>
                    </template>
                    <div v-else v-text="preview"></div>
                    <div class="mt-3">
                      <v-btn
                        outlined
                        rounded
                        small
                        color="primary"
                        @click="xx()"
                      >
                        {{ showMore ? 'Hide question' : 'Show question' }}
                      </v-btn>
                    </div>
                    <div
                      id="answer"
                      class="breaks text-body-2"
                      v-text="response.text"
                    ></div>
                    <div id="xx" class="autocomplete">
                      <v-textarea
                        v-model="feedback"
                        auto-grow
                        outlined
                        clearable
                        hide-details
                        dense
                        rows="1"
                        placeholder="Feedback"
                        style="margin-bottom: 80px"
                        @mouseover="autocomplete()"
                      ></v-textarea>
                    </div>
                  </v-col>
                  <v-col cols="12" md="5">
                    <p class="text-subtitle-2">Mark scheme</p>
                    <v-checkbox
                      v-for="(m, i) in question.markScheme"
                      :key="i"
                      v-model="marks"
                      :value="m.id"
                      hide-details
                    >
                      <template #label>
                        <span class="text-body-2">
                          {{ m.text }}
                          <span class="green--text text--darken-2">
                            <font-awesome-icon
                              v-if="response.sm.includes(m.id)"
                              icon="fa-light fa-user-check"
                              class="ml-2"
                            />
                          </span>
                        </span>
                      </template>
                    </v-checkbox>
                    <p class="red--text mt-3">
                      Max. {{ question.maxMark }} mark{{
                        question.maxMark | pluralize
                      }}
                    </p>
                    <p class="text-subtitle-2">Guidance</p>
                    <p v-if="question.guidance" v-html="question.guidance"></p>
                    <p v-else>None</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  layout: 'app',
  data() {
    return {
      step: 1,
      bank: [],
      marks: [],
      showMore: false,
    }
  },
  async fetch() {
    try {
      const assignmentId = this.$route.params.report
      await this.$store.dispatch('assignment/getReport', assignmentId)
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching data',
      })
    }
  },
  head() {
    return {
      title: this.$fetchState.pending ? '' : this.assignment.name,
    }
  },
  computed: {
    ...mapGetters({
      response: 'assignment/response',
      question: 'assignment/question',
    }),
    ...mapState({
      onboardStep: (state) => state.app.onboardStep,
      assignment: (state) => state.assignment.assignment,
      assignments: (state) => state.group.assignments,
      studentIndex: (state) => state.assignment.studentIndex,
      questionIndex: (state) => state.assignment.questionIndex,
      marking: (state) => state.assignment.marking,
    }),
    feedback: {
      get() {
        if (this.response === undefined) return ''
        return this.response.feedback
      },
      set(feedback) {
        const response = this.response
        this.$store.commit('assignment/setFeedback', { response, feedback })
      },
    },
    // Show truncated question text by default
    preview() {
      if (this.marking) {
        let text = this.$root.$options.filters
          .strip(this.question.text)
          .slice(0, 80)
        while (!text.endsWith(' ')) {
          text = text.substring(0, text.length - 1)
        }
        return (text += '...')
      }
      return ''
    },
  },
  watch: {
    response() {
      // N.B. This fires on open *and* close
      // On close, response is just 'prototype' object
      if (this.marking && 'id' in this.response) {
        // Set response as marked if not already
        if (!this.response.marked) {
          this.$store.dispatch('assignment/setMarked')
        }
        // Copy teacher marks into v-model for checkboxes
        this.marks = [...this.response.tm]
        this.updateCommentBank()
      }
    },
    marking() {
      if (this.marking) {
        this.$snack.showMessage({
          msg: 'Press Win+. to use emoji in feedback',
        })
      }
    },
    // Don't exceed max. mark
    marks() {
      const max = this.question.maxMark
      if (this.marks.length > max) {
        this.$snack.showMessage({
          msg: `Max. ${max} mark${max !== '1' ? 's' : ''}`,
        })
        // Uncheck box
        this.marks.splice(-1, 1)
      }
    },
  },
  mounted() {
    // Onboard if nec.
    if (this.assignments.length === 1) {
      this.$store.commit('app/setOnboardStep', 6)
    }
    this.$store.commit('assignment/setMarking', false)
  },
  methods: {
    delAss() {
      $nuxt.$emit('show-delete', this.assignment.id, this.assignment.group.id)
    },
    color(n, max) {
      if (n / max <= 1 / 3) return 'red'
      if (n / max > 2 / 3) return 'green'
      return 'orange'
    },
    close() {
      this.step = 1
      this.$store.commit('assignment/setMarking', false)
      this.saveMarks()
      this.saveFeedback()
    },
    async saveMarks() {
      if (this.marks.length > 0) {
        try {
          await this.$store.dispatch('assignment/saveMarks', this.marks)
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error saving marks',
          })
        }
      }
    },
    // Build comment bank from feedback on responses
    // (Updated each time response changes)
    updateCommentBank() {
      const bank = []
      if (this.marking) {
        for (const obj of this.assignment.students) {
          const response = obj.responses[this.questionIndex - 1]
          // If student hasn't answered question, response is undefined
          if (response !== undefined) {
            if (response.feedback !== '') {
              bank.push(response.feedback)
            }
          }
        }
      }
      // Remove duplicate comments
      this.bank = [...new Set(bank)]
    },
    // Navigate forwards (1) or backwards (-1) through responses
    next(n) {
      // Save marks *before* moving on
      // Also save feedback (in case debounce is too slow)
      if (this.response !== undefined) {
        this.saveMarks()
        this.saveFeedback()
      }
      this.$store.commit('assignment/next', n)
      // Keep advancing/retreating until we find next response
      if (this.response === undefined) {
        this.next(n)
      }
    },
    // Keep store data in sync with database
    // https://medium.com/js-dojo/vuex-tip-error-handling-on-actions-ee286ed28df4
    async flag() {
      try {
        await this.$store.dispatch('assignment/flagResponse')
        this.$snack.showMessage({
          msg: this.response.flagged ? 'Response flagged' : 'Flag removed',
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error setting flag',
        })
      }
    },
    async saveFeedback() {
      try {
        await this.$store.dispatch('assignment/saveFeedback', this.feedback)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving feedback',
        })
      }
    },
    mark(i, j) {
      this.step = 2
      this.$store.commit('assignment/setMarking', true)
      // Commit mutations setting indices into data structure
      this.$store.commit('assignment/setStudentIndex', i)
      this.$store.commit('assignment/setQuestionIndex', j)
      // Onboarding complete
      if (this.onboardStep !== 0) {
        this.$store.commit('app/setOnboardStep', 0)
      }
      // N.B. Initialising autocomplete here doesn't work
      // Nothing works to select textarea input
    },
    autocomplete() {
      const arr = this.bank
      const inp = document.getElementsByTagName('textarea')[0]
      // Autocomplete takes two arguments: the text field element
      // and an array of possible autocompleted values
      // https://www.w3schools.com/howto/howto_js_autocomplete.asp
      let currentFocus
      // Execute a function when someone writes in the text field:
      inp.addEventListener('input', function () {
        let a = this.value
        let b = this.value
        let i = this.value
        const val = this.value
        // Close any already open lists of autocompleted values
        closeAllLists()
        if (!val) return false
        currentFocus = -1
        // Create a div that will contain the items
        a = document.createElement('DIV')
        a.setAttribute('id', this.id + 'autocomplete-list')
        a.setAttribute('class', 'autocomplete-items')
        // Append the DIV element as a child of the autocomplete container
        document.getElementById('xx').appendChild(a)
        // this.parentNode.appendChild(a)
        for (i = 0; i < arr.length; i++) {
          // Check if the item starts with the same letters as the text field value
          if (
            arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()
          ) {
            // Create a DIV element for each matching element
            b = document.createElement('DIV')
            // Make the matching letters bold
            b.innerHTML =
              '<strong>' + arr[i].substr(0, val.length) + '</strong>'
            b.innerHTML += arr[i].substr(val.length)
            // Insert an input field that will hold the current array item's value
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"
            // Execute a function when someone clicks on the item value (DIV element)
            b.addEventListener('click', function (e) {
              // Insert the value for the autocomplete text field
              inp.value = this.getElementsByTagName('input')[0].value
              // Close the list of autocompleted values
              closeAllLists()
            })
            a.appendChild(b)
          }
        }
      })
      // Cxecute a function presses a key on the keyboard
      inp.addEventListener('keydown', function (e) {
        let x = document.getElementById(this.id + 'autocomplete-list')
        if (x) x = x.getElementsByTagName('div')
        if (e.keyCode === 40) {
          currentFocus++
          addActive(x)
        } else if (e.keyCode === 38) {
          currentFocus--
          addActive(x)
        } else if (e.keyCode === 13) {
          e.preventDefault()
          if (currentFocus > -1) {
            if (x) x[currentFocus].click()
          }
        }
      })
      function addActive(x) {
        // Classify an item as "active"
        if (!x) return false
        // Start by removing the "active" class on all items
        removeActive(x)
        if (currentFocus >= x.length) currentFocus = 0
        if (currentFocus < 0) currentFocus = x.length - 1
        // /*add class "autocomplete-active":*/
        x[currentFocus].classList.add('autocomplete-active')
      }
      function removeActive(x) {
        // Remove the "active" class from all autocomplete items
        for (let i = 0; i < x.length; i++) {
          x[i].classList.remove('autocomplete-active')
        }
      }
      function closeAllLists(elmnt) {
        // Close all autocomplete lists in the document,
        // except the one passed as an argument
        const x = document.getElementsByClassName('autocomplete-items')
        for (let i = 0; i < x.length; i++) {
          if (elmnt !== x[i] && elmnt !== inp) {
            x[i].parentNode.removeChild(x[i])
          }
        }
      }
    },
  },
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  overflow-x: scroll;
  width: 100%;
}

td,
th {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
  padding: 12px;
}

/* no border on last row */
tr:last-child > td {
  border-bottom: none;
}

.v-textarea {
  font-size: 0.875rem !important;
  letter-spacing: 0.0178571429em !important;
}

textarea {
  line-height: 1.15em !important;
}

/* adjust flag to keep chips aligned */
.fix-flag {
  position: relative;
  top: 4px;
  margin-left: 8px;
  margin-right: -30px;
}

#answer {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin: 16px 0;
  padding: 12px;
}
</style>
