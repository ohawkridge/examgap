<template>
  <div>
    <v-row class="pa-3">
      <v-col cols="12">
        <div class="d-flex justify-space-between">
          <div class="d-flex align-center">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-btn
                  icon
                  class="mr-2"
                  nuxt
                  :to="`/group/${group.id}`"
                  v-on="on"
                >
                  <font-awesome-icon
                    icon="fa-light fa-arrow-left"
                    class="fa-lg"
                  />
                </v-btn>
              </template>
              <span>Back</span>
            </v-tooltip>
            <span class="text-h6">{{
              $fetchState.pending ? 'Loading...' : assignment.name
            }}</span>
          </div>
          <div>
            <div v-if="$vuetify.breakpoint.name !== 'xs'">
              <the-delete-assignment-dialog
                v-if="!$fetchState.pending && group"
                :assignment-id="assignment.id"
                :group-id="group.id"
                type="btn"
              />
              <v-btn elevation="0" text rounded class="ml-2" @click="refresh()">
                Refresh
              </v-btn>
            </div>
            <v-menu v-else>
              <template #activator="{ on }">
                <v-btn icon v-on="on">
                  <font-awesome-icon icon="fa-light fa-ellipsis-vertical" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title @click="refresh()"
                    >Refresh</v-list-item-title
                  >
                </v-list-item>
                <the-delete-assignment-dialog
                  v-if="!$fetchState.pending && group"
                  :assignment-id="assignment.id"
                  :group-id="group.id"
                />
              </v-list>
            </v-menu>
          </div>
        </div>
        <div class="mt-4 ml-11">
          <div class="d-flex mb-2">
            <span class="font-weight-medium fix-date-always">Start:</span>
            {{ assignment.start | date }}
          </div>
          <div class="d-flex">
            <span class="font-weight-medium fix-date-always">Due:</span>
            {{ assignment.dateDue | date }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-skeleton-loader
      v-if="$fetchState.pending"
      :loading="true"
      type="table"
      :types="{ table: 'table-thead, table-tbody' }"
      class="pa-4"
    >
    </v-skeleton-loader>
    <table v-else id="table">
      <thead>
        <tr v-if="!$fetchState.pending">
          <th
            v-for="(q, i) in assignment.headers"
            :key="i"
            :class="i === 0 ? 'text-left' : ''"
          >
            <span v-if="i === 0">Username</span>
            <v-menu v-else offset-x open-on-hover>
              <template #activator="{ on }">
                <span v-on="on">{{ `Q${i} [${q.maxMark}]` }}</span>
              </template>
              <v-card max-width="440">
                <v-card-text class="text-body-2">
                  <div v-html="assignment.headers[i].text"></div>
                  <div class="font-weight-bold text-right">
                    [{{ q.maxMark }}]
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </th>
        </tr>
      </thead>
      <tbody v-if="!$fetchState.pending">
        <tr v-for="(student, i) in assignment.students" :key="i">
          <td>
            {{ student.name }}
          </td>
          <td v-for="(data, j) in student.data" :key="j" class="text-center">
            <!-- Formerly MarkChip.vue components -->
            <!-- Nested values as props not working reliably -->
            <div :class="flex(data)">
              <!-- *** NOT ANSWERED *** -->
              <div v-if="data[Object.keys(data)[0]].length === 0">N/A</div>
              <!-- Loop through responses (see note below) -->
              <template
                v-for="(response, k) in data[Object.keys(data)[0]]"
                v-else
              >
                <!-- *** SELF MARKED *** -->
                <v-tooltip v-if="!response.marked" :key="k" bottom>
                  <template #activator="{ on }">
                    <v-chip outlined @click="mark(i, j, k)" v-on="on">
                      {{ response.sm.length }}
                      <font-awesome-icon
                        icon="fa-light fa-check"
                        class="ml-2"
                      />
                    </v-chip>
                  </template>
                  <span>Mark</span>
                </v-tooltip>
                <!-- *** TEACHER MARKED *** -->
                <v-tooltip v-else :key="k" bottom>
                  <template #activator="{ on }">
                    <v-chip
                      :class="marginBottom(data[Object.keys(data)[0]], k)"
                      class="green"
                      @click="mark(i, j, k)"
                      v-on="on"
                    >
                      {{ response.tm.length }}
                      <font-awesome-icon
                        v-if="response.repeat"
                        icon="fa-light fa-repeat"
                        class="ml-2"
                      />
                      <font-awesome-icon
                        v-else
                        icon="fa-light fa-check-double"
                        class="ml-2"
                      />
                    </v-chip>
                    <font-awesome-icon
                      v-if="response.flagged"
                      icon="fa-light fa-flag"
                      class="ico-red fix-flag fa-lg"
                    />
                  </template>
                  <span>Mark</span>
                </v-tooltip>
              </template>
            </div>
          </td>
        </tr>
        <tr v-if="assignment.students.length === 0">
          <td class="text-center" :colspan="assignment.headers.length">
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
    <div class="d-flex justify-end align-center pa-4 text-caption">
      N/A Not answered&nbsp;&nbsp;
      <font-awesome-icon icon="fa-light fa-check" class="fa-sm mr-1" />
      Self mark&nbsp;&nbsp;
      <font-awesome-icon icon="fa-light fa-check-double" class="fa-sm mr-1" />
      Teacher mark
    </div>
    <!-- Marking dialog -->
    <v-dialog
      v-model="marking"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar dark dense color="primary">
          <v-btn icon dark @click="close()">
            <font-awesome-icon icon="fa-light fa-xmark" class="fa-xl" />
          </v-btn>
          <v-toolbar-title>Marking</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn dark text @click="close()">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row id="div2">
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-btn icon @click="next(-1)" v-on="on">
                      <font-awesome-icon
                        icon="fa-light fa-arrow-left"
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
                        icon="fa-light fa-arrow-right"
                        class="fa-lg"
                      />
                    </v-btn>
                  </template>
                  <span>Next</span>
                </v-tooltip>
                <v-tooltip v-if="marking" bottom>
                  <template #activator="{ on }">
                    <v-btn
                      icon
                      class="ml-2"
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
                    <v-btn
                      icon
                      class="ml-2"
                      :color="response.repeat ? 'red' : ''"
                      @click="reassign()"
                      v-on="on"
                    >
                      <font-awesome-icon
                        icon="fa-light fa-repeat"
                        class="fa-lg"
                      />
                    </v-btn>
                  </template>
                  <span>Reassign</span>
                </v-tooltip>
                <the-info-dialog :response="response" />
              </div>
              <div>
                <v-tooltip v-if="marking" bottom>
                  <template #activator="{ on }">
                    <v-chip
                      label
                      :color="color(marks.length, question.maxMark)"
                      class="mr-2"
                      v-on="on"
                    >
                      <font-awesome-icon
                        icon="fa-light fa-user-graduate"
                        class="mr-2"
                      />
                      {{ marks.length }}
                      <font-awesome-icon
                        icon="fa-light fa-check"
                        class="ml-2"
                      />
                    </v-chip>
                  </template>
                  <span>You</span>
                </v-tooltip>
                <v-tooltip v-if="marking" bottom>
                  <template #activator="{ on }">
                    <v-chip
                      label
                      :color="color(response.sm.length, question.maxMark)"
                      v-on="on"
                    >
                      <font-awesome-icon icon="fa-light fa-user" class="mr-2" />
                      {{ response.sm.length }}
                      <font-awesome-icon
                        icon="fa-light fa-check"
                        class="ml-2"
                      />
                    </v-chip>
                  </template>
                  <span>Student</span>
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <p class="text-subtitle-1">Question</p>
              <p v-if="marking" class="text-body-2" v-html="question.text"></p>
              <div class="d-flex justify-end">
                <v-chip v-if="marking" outlined
                  >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <p v-if="marking" class="text-subtitle-1">
                {{ response.username }}
              </p>
              <p
                v-if="marking"
                class="breaks text-body-2"
                v-text="response.text"
              ></p>
              <p
                class="
                  text-subtitle-1
                  d-flex
                  justify-space-between
                  align-center
                "
              >
                Feedback
                <v-menu open-on-hover offset-y>
                  <template #activator="{ on }">
                    <v-btn icon v-on="on">
                      <font-awesome-icon
                        icon="fa-light fa-comment-smile"
                        class="fa-lg"
                      />
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="insert('😀')">
                      <v-list-item-content>
                        <v-list-item-title> 😀 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="insert('😕')">
                      <v-list-item-content>
                        <v-list-item-title> 😕 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="insert('🤔')">
                      <v-list-item-content>
                        <v-list-item-title> 🤔 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="insert('👍')">
                      <v-list-item-content>
                        <v-list-item-title> 👍 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="insert('🎉')">
                      <v-list-item-content>
                        <v-list-item-title> 🎉 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="insert('👀')">
                      <v-list-item-content>
                        <v-list-item-title> 👀 </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </p>
              <!-- N.B. update is debounced method -->
              <v-textarea
                id="feedback"
                ref="fbArea"
                v-model="feedback"
                outlined
                rows="4"
                hide-details
                auto-grow
              >
                <font-awesome-icon slot="append" :icon="icon()" class="fa-lg" />
              </v-textarea>
              <v-list dense>
                <v-list-item
                  v-for="(comment, i) in commentBank"
                  :key="i"
                  title="Click to reuse"
                  @click="reuse(comment)"
                >
                  <v-list-item-content>
                    <v-list-item-subtitle>{{ comment }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col v-if="marking" cols="12" md="4">
              <p class="text-subtitle-1">Mark Scheme</p>
              <v-checkbox
                v-for="mp in markScheme"
                :key="mp.id"
                v-model="marks"
                :value="mp.id"
                hide-details
                @change="checkMax(mp.id)"
              >
                <template #label>
                  <span
                    class="text-body-2"
                    :class="
                      response.sm.includes(mp.id) ? 'font-weight-bold' : ''
                    "
                  >
                    {{ mp.text }}
                  </span>
                </template>
              </v-checkbox>
              <v-switch v-model="smartSort" inset>
                <template #label> Self marks first </template>
              </v-switch>
              <p class="text-subtitle-1">Guidance</p>
              <p
                v-if="question.guidance"
                class="text-body-2"
                v-html="question.guidance"
              ></p>
              <p v-else class="text-body-2">None</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheInfoDialog from '@/components/teacher/TheInfoDialog'
import TheDeleteAssignmentDialog from '@/components/teacher/TheDeleteAssignmentDialog'

export default {
  components: {
    TheDeleteAssignmentDialog,
    TheInfoDialog,
  },
  layout: 'app',
  data() {
    return {
      commentBank: [],
      debouncedFeedback: '',
      savingFeedback: false,
      smartSort: false,
      markScheme: [], // Copied via question.markScheme
      marks: [], // v-model for checkboxes
      infoDialog: false,
      forceRefresh: false,
      pStart: { x: 0, y: 0 }, // Pull to refresh
      pStop: { x: 0, y: 0 },
      timeout: null,
    }
  },
  async fetch() {
    // Dispatch action to get data if not already in store
    const reportId = this.$store.state.assignment.assignment.id
    const paramId = this.$route.params.report
    if (this.forceRefresh || reportId !== paramId) {
      try {
        await this.$store.dispatch(
          'assignment/getReport',
          this.$route.params.report
        )
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error fetching data',
        })
      }
    }
    this.forceRefresh = false
  },
  head() {
    return {
      title: this.$fetchState.pending ? '' : this.assignment.name,
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
      response: 'assignment/response',
    }),
    ...mapState({
      onboardStep: (state) => state.app.onboardStep,
      assignment: (state) => state.assignment.assignment,
      studentIndex: (state) => state.assignment.studentIndex,
      questionIndex: (state) => state.assignment.questionIndex,
      responseIndex: (state) => state.assignment.responseIndex,
      marking: (state) => state.assignment.marking,
    }),
    feedback: {
      get() {
        return this.debouncedFeedback
      },
      set(val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.debouncedFeedback = val
          this.saveFeedback()
        }, 1500)
      },
    },
    // Questions included in assignment headers (for hover preview)
    // +1 because index 0 contains Vuetify table metadata
    question() {
      return this.assignment.headers[this.questionIndex + 1]
    },
    // Current question id as a String
    qIdStr() {
      return this.assignment.headers[this.questionIndex + 1].value
    },
  },
  watch: {
    response() {
      // Set response as marked
      // N.B. This watch fires on close. At that point response
      // exists, but only as a 'prototype' object
      if ('id' in this.response && !this.response.marked) {
        this.$store.dispatch('assignment/setMarked')
      }
      // Copy existing teacher marks to be v-model
      this.marks = this.response.tm
      // Update feedback for current response
      this.feedback = this.response.feedback
      this.updateBank()
      // If smartSort is on, re-sort when response changes
      if (this.smartSort) {
        this.markScheme.sort(this.selfMarksFirst)
      }
    },
    marking() {
      // Copy original mark scheme from question object
      // (This becomes v-for for checkboxes)
      if (this.marking) {
        this.copyMarkScheme()
      }
    },
    smartSort() {
      if (this.marking && this.smartSort) {
        // Turn on smart sort by calling sorting function
        this.markScheme.sort(this.selfMarksFirst)
      } else {
        // Turn off smart sort by re-copying original
        this.copyMarkScheme()
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener('touchstart', this.swipeStart())
    document.removeEventListener('touchend', this.swipeEnd())
  },
  mounted() {
    this.$store.commit('app/setPageTitle', this.group.name)
    if (this.group.assignments.length < 3) {
      this.$store.commit('app/setOnboardStep', 6)
    }
    document.addEventListener(
      'touchstart',
      (e) => {
        this.swipeStart(e)
      },
      false
    )
    document.addEventListener(
      'touchend',
      (e) => {
        this.swipeEnd(e)
      },
      false
    )
  },
  methods: {
    icon() {
      return this.savingFeedback
        ? 'fa-light fa-cloud-arrow-up'
        : 'fa-light fa-cloud-check'
    },
    // Insert emoji into feedback
    // https://codepen.io/1da2/pen/RwWbROE
    insert(char) {
      const textarea = this.$refs.fbArea.$refs.input
      const sentence = textarea.value
      const len = sentence.length
      let pos = textarea.selectionStart
      if (pos === undefined) {
        pos = 0
      }
      const before = sentence.substr(0, pos)
      const after = sentence.substr(pos, len)
      this.feedback = before + char + after
      this.$nextTick().then(() => {
        textarea.selectionStart = pos + char.length
      })
      this.saveFeedback()
    },
    swipeStart(e) {
      if (e !== undefined) {
        if (typeof e.targetTouches !== 'undefined') {
          const touch = e.targetTouches[0]
          this.pStart.x = touch.screenX
          this.pStart.y = touch.screenY
        } else {
          this.pStart.x = e.screenX
          this.pStart.y = e.screenY
        }
      }
    },
    swipeEnd(e) {
      if (e !== undefined) {
        if (typeof e.changedTouches !== 'undefined') {
          const touch = e.changedTouches[0]
          this.pStop.x = touch.screenX
          this.pStop.y = touch.screenY
        } else {
          this.pStop.x = e.screenX
          this.pStop.y = e.screenY
        }
        this.swipeCheck()
      }
    },
    swipeCheck() {
      const changeY = this.pStart.y - this.pStop.y
      const changeX = this.pStart.x - this.pStop.x
      if (this.isPullDown(changeY, changeX)) {
        this.refresh()
      }
    },
    isPullDown(dY, dX) {
      // methods of checking slope, length, direction of line created by swipe action
      return (
        dY < 0 &&
        ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) ||
          (Math.abs(dX) / Math.abs(dY) <= 0.3 && dY >= 60))
      )
    },
    color(n, max) {
      if (n / max <= 1 / 3) return 'red'
      if (n / max > 2 / 3) return 'green'
      return 'orange'
    },
    copyMarkScheme() {
      this.markScheme = [...this.question.markScheme]
    },
    // Don't exceed max. mark
    checkMax(markId) {
      if (this.marks.length > this.question.maxMark) {
        this.$snack.showMessage({
          msg: `Max. ${this.question.maxMark} mark${
            this.question.maxMark !== '1' ? 's' : ''
          }`,
        })
        // Untick checkbox by splicing id out of v-model
        for (let i = 0; i < this.marks.length; i++) {
          if (this.marks[i] === markId) {
            this.marks.splice(i, 1)
          }
        }
      }
    },
    close() {
      this.saveMarks()
      this.$store.commit('assignment/setMarking', false)
    },
    async saveMarks() {
      if (this.marks.length > 0) {
        await this.$store.dispatch('assignment/saveMarks', this.marks)
      }
    },
    // Fetch fresh data
    refresh() {
      this.forceRefresh = true
      this.$fetch()
    },
    // Build comment bank from feedback on existing responses
    updateBank() {
      const commentBank = []
      if (this.marking && !this.$fetchState.pending) {
        for (const stuRespObj of this.assignment.students) {
          // Array of response objects for this question
          const rs = stuRespObj.data[this.questionIndex][this.qIdStr]
          for (const response of rs) {
            if (response.feedback !== '') {
              commentBank.push(response.feedback)
            }
          }
        }
      }
      // Remove duplicate comments
      this.commentBank = [...new Set(commentBank)]
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
    async reassign() {
      try {
        await this.$store.dispatch('assignment/reassign')
        this.$snack.showMessage({
          msg: this.response.repeat
            ? 'Question reassigned'
            : 'Reassignment cancelled',
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error reassigning question',
        })
      }
    },
    async saveFeedback() {
      try {
        this.savingFeedback = true
        await this.$store.dispatch('assignment/saveFeedback', this.feedback)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving feedback',
        })
      } finally {
        this.savingFeedback = false
      }
    },
    // Reuse an existing comment
    reuse(text) {
      this.feedback = text
      this.saveFeedback() // Trigger save
    },
    // Comparison function so student self marks are first
    selfMarksFirst(m1, m2) {
      // Watch out nexting over empty responses
      if (!this.response || !('sm' in this.response)) return 0
      if (
        this.response.sm.includes(m1.id) === this.response.sm.includes(m2.id)
      ) {
        return 0
      } else if (this.response.sm.includes(m1.id)) {
        return -1
      } else {
        return 1
      }
    },
    // Commit mutations setting indices
    // into _report.vue data structure
    mark(i, j, k) {
      this.$store.commit('assignment/setStudentIndex', i)
      this.$store.commit('assignment/setQuestionIndex', j)
      this.$store.commit('assignment/setResponseIndex', k)
      this.$store.commit('assignment/setMarking', true)
      // Onboarding complete ✓
      this.$store.commit('app/setOnboardStep', 0)
    },
    // Add margin bottom to reassigned responses
    // (except for last one)
    marginBottom(responses, i) {
      return responses.length > 1 && i < responses.length - 1 ? 'mb-2' : ''
    },
    // Use flex columns if >1 response
    flex(data) {
      return data[Object.keys(data)[0]].length > 1
        ? 'd-flex flex-column align-center'
        : ''
    },
  },
}
</script>

<style scoped>
/* hey dipshit, you showing scrollbars? */
#table {
  overflow-x: scroll;
}

table {
  border-collapse: collapse;
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

/* scroll comment bank */
div.v-list {
  max-height: 240px;
  overflow-y: scroll;
}

/* thin divider under app-bar */
#div2 {
  border-bottom: 1px solid #e3dede !important;
}

.v-textarea {
  font-size: 0.875rem !important;
  letter-spacing: 0.0178571429em !important;
  line-height: 1.25rem !important;
}

/* Adjust flags to keep chips aligned */
.fix-flag {
  position: relative;
  top: 4px;
  margin-left: 8px;
  margin-right: -30px;
}
</style>
