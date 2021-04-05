<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav
          v-if="group && Object.keys(group).length > 0"
          :group="group"
        />
      </v-col>
      <v-col cols="12" md="9">
        <!-- mt-n6 accounts for bottom-nav space when hidden on desktop -->
        <v-card class="mt-n6 mt-sm-0">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="10">
                <p class="text-h6">
                  {{ data.name }}
                </p>
                <div class="text-subtitle-1">
                  <span class="fix-width font-weight-medium">Start:</span>
                  {{ data.start | date }}
                </div>
                <div class="text-subtitle-1">
                  <span class="fix-width font-weight-medium">Due:</span>
                  {{ data.dateDue | date }}
                </div>
              </v-col>
              <v-col cols="12" md="2" class="d-flex justify-end">
                <DeleteAssignment
                  v-if="group"
                  :assignment-id="data.id"
                  :group-id="group.id"
                  type="btn"
                />
                <v-btn color="primary" outlined class="ml-2" @click="refresh()">
                  Refresh
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col id="table" cols="12">
                <v-skeleton-loader :loading="loading" type="table">
                  <table>
                    <thead>
                      <tr>
                        <th
                          v-for="(q, i) in data.headers"
                          :key="i"
                          :class="i === 0 ? 'left' : ''"
                        >
                          <span v-if="i === 0">Username</span>
                          <v-menu v-else offset-x open-on-hover>
                            <template #activator="{ on, attrs }">
                              <span v-bind="attrs" v-on="on">{{
                                `Q${i} [${q.maxMark}]`
                              }}</span>
                            </template>
                            <v-card max-width="440">
                              <v-card-text class="text-body-2">
                                <div v-html="data.headers[i].text"></div>
                                <div class="font-weight-bold text-right">
                                  [{{ q.maxMark }}]
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-menu>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(student, i) in data.students" :key="i">
                        <td>
                          {{ student.name }}
                        </td>
                        <td
                          v-for="(item, j) in student.data"
                          :key="j"
                          class="text-center"
                        >
                          <MarkChip
                            :student-index="i"
                            :question-index="j"
                            :data="item"
                            @clicked="mark"
                          />
                        </td>
                      </tr>
                      <tr v-if="data.students.length === 0">
                        <td class="text-center" :colspan="data.headers.length">
                          <p class="text-body-2 mt-4">No students yet</p>
                          <p>col: {{ data.headers.length }}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
                <span class="mr-2"> N/A&mdash;Not answered </span>
                <v-icon>{{ $icons.mdiCheck }}</v-icon>
                <span class="mr-2"> &mdash;Self-marked </span>
                <v-icon>{{ $icons.mdiCheckAll }}</v-icon>
                &mdash;Teacher-marked
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Marking dialog -->
    <v-dialog
      v-model="marking"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar dark dense color="primary">
          <v-btn icon dark @click="marking = false">
            <v-icon>{{ $icons.mdiClose }}</v-icon>
          </v-btn>
          <v-toolbar-title>Marking</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn dark text @click="marking = false">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row id="div2">
            <v-col cols="12" class="d-flex align-center">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" @click="previous()" v-on="on">
                    <v-icon>{{ $icons.mdiArrowLeft }}</v-icon>
                  </v-btn>
                </template>
                <span>Previous</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" @click="next()" v-on="on">
                    <v-icon>{{ $icons.mdiArrowRight }}</v-icon>
                  </v-btn>
                </template>
                <span>Next</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    class="ml-2"
                    v-bind="attrs"
                    :color="flagColor(response.flagged)"
                    v-on="on"
                    @click="flag()"
                  >
                    <v-icon>{{ $icons.mdiFlagOutline }}</v-icon>
                  </v-btn>
                </template>
                <span v-if="response">{{
                  response.flagged ? 'Unflag' : 'Flag'
                }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    class="ml-2"
                    :color="flagColor(response.repeat)"
                    v-on="on"
                    @click="boomerang()"
                  >
                    <v-icon>{{ $icons.mdiBoomerang }}</v-icon>
                  </v-btn>
                </template>
                <span>Reassign</span>
              </v-tooltip>
              <v-spacer />
              <v-chip color="primary" outlined class="mr-2">
                <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                <span v-if="marking" class="font-weight-black">{{
                  response.tm.length
                }}</span>
                <v-icon right>{{ $icons.mdiCheck }}</v-icon>
              </v-chip>
              <v-chip color="green darken-2" outlined>
                <v-icon left color="green darken-2">{{
                  $icons.mdiAccountOutline
                }}</v-icon>
                <span
                  v-if="marking"
                  class="green--text text--darken-2 font-weight-black"
                  >{{ response.sm.length }}</span
                >
                <v-icon right color="green darken-2">{{
                  $icons.mdiCheck
                }}</v-icon>
              </v-chip>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <p class="text-subtitle-1">Question</p>
              <p v-if="marking" class="text-body-2" v-html="question.text"></p>
              <div class="d-flex justify-end">
                <v-chip outlined
                  >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <p v-if="marking" class="text-subtitle-1 font-weight-medium">
                {{ response.username }}
              </p>
              <p
                v-if="marking"
                class="breaks text-body-2"
                v-text="response.text"
              ></p>
              <p class="text-subtitle-1">Feedback</p>
              <v-textarea
                v-model="feedback"
                outlined
                :append-icon="$icons.mdiCommentTextOutline"
                rows="4"
                auto-grow
                :messages="feedbackStatus"
                @input="update()"
              ></v-textarea>
              <v-list dense>
                <v-list-item
                  v-for="(comment, i) in bank"
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
              <!-- N.B. We need v-model + value for this to work -->
              <v-checkbox
                v-for="mp in markScheme"
                :key="mp.id"
                v-model="response.tm"
                :value="mp.id"
                hide-details
                @change="addRemoveMark(mp.id)"
              >
                <template #label>
                  <span
                    v-if="response"
                    :class="
                      response.sm.includes(mp.id)
                        ? 'green--text text--darken-2'
                        : ''
                    "
                  >
                    {{ mp.text }}</span
                  >
                </template>
              </v-checkbox>
              <div class="d-flex justify-end">
                <v-switch v-model="smartSort" inset hide-details>
                  <template #label>
                    <v-tooltip bottom>
                      <template #activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">Smart sort</span>
                      </template>
                      <span>Self-marks first</span>
                    </v-tooltip>
                  </template>
                </v-switch>
              </div>
              <p class="text-subtitle-1">Guidance</p>
              <p class="text-body-2">
                {{ question.guidance ? question.guidance : 'None' }}
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mdiCheck,
  mdiCheckAll,
  mdiArrowRight,
  mdiFlagOutline,
  mdiAccountOutline,
  mdiSchoolOutline,
  mdiClose,
  mdiArrowLeft,
  mdiBoomerang,
  mdiCommentTextOutline,
} from '@mdi/js'
import { mapGetters } from 'vuex'
import { debounce, cloneDeep } from 'lodash'
import DeleteAssignment from '@/components/teacher/DeleteAssignment'
import GroupHeader from '@/components/teacher/GroupHeader'
import GroupNav from '@/components/teacher/GroupNav'
import MarkChip from '@/components/teacher/MarkChip'

export default {
  components: {
    DeleteAssignment,
    GroupHeader,
    GroupNav,
    MarkChip,
  },
  layout: 'app',
  async asyncData({ store, params, $config: { baseURL } }) {
    const url = new URL('/.netlify/functions/getReport', baseURL)
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        assignmentId: params.report,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching assignment data ${response.status}`)
    }
    const data = await response.json()
    // console.log(JSON.stringify(data, null, 2))
    return { data }
  },
  data() {
    return {
      studentIndex: 0, // These 3 values let us index into data structure
      questionIndex: 0,
      responseIndex: 0,
      marking: false,
      bank: [],
      feedbackStatus: '',
      smartSort: false,
      markScheme: [],
      loading: false,
    }
  },
  head() {
    return {
      title: this.data.name,
    }
  },
  computed: {
    ...mapGetters({ group: 'groups/activeGroup' }),
    // Question is included in header data (for hover preview)
    question() {
      return this.data.headers[this.questionIndex + 1]
    },
    response() {
      // data is the object we get back from getAssignmentDetails
      // Its two main keys are: headers (contains questions and
      // mark schemes) and students (all answers, self marks and
      // teacher marks)
      // studentIndex gets us horizontally into the student array
      // as they appear in the alphabetical list of usernames
      // Each student object has two main keys: name and data
      // Data is an array of objects—one for each question
      // Within data, the array of student's answers (if the
      // question has been reassigned) lives under a key—the
      // question id. I think this is because there is no guarantee
      // the database will return responses in the same order
      // This finally gives you an array of objects where each
      // object is one complete student response including marks
      if (this.marking) {
        return this.data.students[this.studentIndex].data[this.questionIndex][
          this.data.headers[this.questionIndex + 1].value
        ][this.responseIndex]
      } else {
        return {}
      }
    },
    feedback: {
      get() {
        return this.marking ? this.response.feedback : ''
      },
      set(fb) {
        this.response.feedback = fb
      },
    },
  },
  watch: {
    // If smartSort is on, re-sort mark scheme when response changes
    response() {
      if (this.smartSort) this.markScheme.sort(this.selfMarksFirst)
    },
    smartSort() {
      if (this.smartSort) {
        // Turn on smartSort by calling sorting function
        this.markScheme.sort(this.selfMarksFirst)
      } else {
        // When smartSort is turned off, restore normal mark scheme
        this.markScheme = cloneDeep(this.question.markScheme)
      }
    },
  },
  created() {
    this.$icons = {
      mdiCheck,
      mdiCheckAll,
      mdiArrowRight,
      mdiFlagOutline,
      mdiAccountOutline,
      mdiSchoolOutline,
      mdiClose,
      mdiArrowLeft,
      mdiBoomerang,
      mdiCommentTextOutline,
    }
  },
  methods: {
    async refresh() {
      try {
        this.loading = true
        const url = new URL(
          '/.netlify/functions/getReport',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            assignmentId: this.$route.params.report,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error refreshing data ${response.status}`)
        }
        this.data = await response.json()
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error refreshing data',
        })
      } finally {
        this.loading = false
      }
    },
    // Build comment bank from existing responses
    updateBank() {
      const bank = []
      if (this.marking) {
        for (const obj of this.data.students) {
          const responses =
            obj.data[this.questionIndex][
              this.data.headers[this.questionIndex + 1].value
            ]
          // Inner loop to handle reassigned questions
          for (const response of responses) {
            if (response && response.feedback !== '') {
              bank.push(response.feedback)
            }
          }
        }
      }
      // Remove duplicates
      this.bank = [...new Set(bank)]
    },
    mark(obj) {
      // Index into student responses data structure
      this.studentIndex = obj.studentIndex
      this.questionIndex = obj.questionIndex
      this.responseIndex = obj.responseIndex
      this.marking = true
      // *Actually copy* (not just reference) original mark scheme
      this.markScheme = cloneDeep(this.question.markScheme)
      // Must be *after* marking = true
      this.updateBank()
      // You could open a response and close it without clicking
      // next or previous, so set it as 'marked' on open
      this.marked(this.response.id)
    },
    flagColor(val) {
      return !val || this.response === undefined ? '' : 'accent'
    },
    // Set response as 'marked'
    async marked() {
      if (!this.response.marked) {
        try {
          const url = new URL(
            '/.netlify/functions/setAsMarked',
            this.$config.baseURL
          )
          const response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              responseId: this.response.id,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error setting as 'marked' ${response.status}`)
          }
          // Set as marked in local data structure
          this.response.marked = true
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error marking',
          })
        }
      }
    },
    next() {
      this.updateBank()
      // Loop back to start
      if (this.studentIndex >= this.data.students.length - 1) {
        this.studentIndex = 0
      } else {
        this.studentIndex += 1
      }
      // Keep advancing if no response is found
      if (this.response === undefined) {
        this.next()
      } else {
        // Set response as marked as soon as it's been seen
        this.marked(this.response.id)
      }
    },
    previous() {
      this.updateBank()
      // Loop back to end
      if (this.studentIndex === 0) {
        this.studentIndex = this.data.students.length - 1
      } else {
        this.studentIndex -= 1
      }
      // Keep retreating if no response is found
      if (this.response === undefined) {
        this.previous()
      } else {
        // Set response as marked as soon as it's been seen
        this.marked(this.response.id)
      }
    },
    addRemoveMark(id) {
      // Don't exceed max mark
      if (this.response.tm.length > this.question.maxMark) {
        this.$snack.showMessage({
          msg: `Maximum mark is ${this.question.maxMark}`,
          type: '',
        })
        // Untick checkbox by splicing id out of v-model data
        for (let i = 0; i < this.response.tm.length; i++) {
          if (this.response.tm[i] === id) {
            this.response.tm.splice(i, 1)
          }
        }
      } else if (this.response.tm.find((x) => x === id)) {
        // Adding mark
        this.toggleMark(id, true)
      } else {
        // Removing mark
        this.toggleMark(id, false)
      }
    },
    // Actually write mark to database
    async toggleMark(markId, addOrRemove) {
      try {
        const url = new URL(
          '/.netlify/functions/toggleMark',
          this.$config.baseURL
        )
        let response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            responseId: this.response.id,
            markId,
            add: addOrRemove,
            teacher: true,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error saving mark ${response.status}`)
        }
        response = await response.json()
        console.log(response)
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving mark',
        })
      }
    },
    async flag() {
      try {
        const url = new URL(
          '/.netlify/functions/flagResponse',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            responseId: this.response.id,
            flagged: !this.response.flagged,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error setting flag ${response.status}`)
        }
        const state = await response.json()
        // Update local data
        this.response.flagged = !this.response.flagged
        this.$snack.showMessage({
          type: '',
          msg: `${state.data.flagged ? 'Response flagged' : 'Flag removed'}`,
        })
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'An error occurred',
        })
      }
    },
    async boomerang() {
      try {
        const url = new URL(
          '/.netlify/functions/reassignQuestion',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            repeat: !this.response.repeat,
            responseId: this.response.id,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error reassigning question ${response.status}`)
        }
        const state = await response.json()
        // Update local data structure
        this.response.repeat = state.data.repeat
        if (state.data.repeat) {
          this.$snack.showMessage({
            msg: `Reassigned to ${this.response.username}`,
            type: '',
          })
        } else {
          this.$snack.showMessage({
            msg: `Assignment cancelled`,
            type: '',
          })
        }
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error reassigning question',
        })
      }
    },
    // Debounce feedback area
    update: debounce(function () {
      this.save()
    }, 1500),
    async save() {
      this.feedbackStatus = 'Saving...'
      try {
        const url = new URL(
          '/.netlify/functions/saveFeedback',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            responseId: this.response.id,
            feedback: this.feedback,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error saving feedback ${response.status}`)
        }
        this.feedbackStatus = `Saved ✓`
      } catch (e) {
        console.error(e)
        this.feedbackStatus = 'Error saving'
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving feedback',
        })
      }
    },
    // Reuse an existing comment
    reuse(text) {
      this.response.feedback = text
      this.save() // Trigger save
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

.left {
  text-align: left !important;
}

/* thin divider under app-bar */
#div2 {
  border-bottom: 1px solid #e3dede !important;
}

.fix-width {
  display: inline-block;
  width: 60px;
}
</style>
