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
        <v-card class="eg-card mt-n6 mt-sm-0">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="10">
                <p class="text-h6">
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-btn icon @click="$router.go(-1)" v-on="on">
                        <v-icon>{{ $icons.mdiChevronLeft }}</v-icon>
                      </v-btn>
                    </template>
                    <span>Back</span>
                  </v-tooltip>
                  {{ $fetchState.pending ? 'Loading...' : assignment.name }}
                </p>
                <div class="text-subtitle-1">
                  <span class="fix-width font-weight-medium">Start:</span>
                  {{
                    $fetchState.pending ? '2021-00-00' : assignment.start | date
                  }}
                </div>
                <div class="text-subtitle-1">
                  <span class="fix-width font-weight-medium">Due:</span>
                  {{
                    $fetchState.pending
                      ? '2021-00-00'
                      : assignment.dateDue | date
                  }}
                </div>
              </v-col>
              <v-col cols="12" md="2" class="d-flex justify-end">
                <DeleteAssignment
                  v-if="!$fetchState.pending && group"
                  :assignment-id="assignment.id"
                  :group-id="group.id"
                  type="btn"
                />
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-btn
                      elevation="0"
                      class="ml-2"
                      @click="refresh()"
                      v-on="on"
                    >
                      Refresh
                    </v-btn>
                  </template>
                  <span>Refresh data</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col id="table" cols="12">
                <v-skeleton-loader :loading="$fetchState.pending" type="table">
                  <table>
                    <thead>
                      <tr v-if="!$fetchState.pending">
                        <th
                          v-for="(q, i) in assignment.headers"
                          :key="i"
                          :class="i === 0 ? 'text-left' : ''"
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
                        <td
                          v-for="(item, j) in student.data"
                          :key="j"
                          class="text-center"
                        >
                          <MarkChip
                            :class="`${
                              obs === 7 && i === 0 && j === 0 ? 'red-out' : ''
                            }`"
                            :student-index="i"
                            :question-index="j"
                            :data="item"
                            @clicked="mark"
                          />
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
                              elevation="0"
                              @click="$nuxt.$emit('open-invite')"
                            >
                              Invite students</v-btn
                            >
                          </p>
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
                <span class="mr-2"> &mdash;Self mark </span>
                <v-icon>{{ $icons.mdiCheckAll }}</v-icon>
                &mdash;Teacher mark
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
                <template #activator="{ on }">
                  <v-btn icon @click="previous()" v-on="on">
                    <v-icon>{{ $icons.mdiArrowLeft }}</v-icon>
                  </v-btn>
                </template>
                <span>Previous</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon @click="next()" v-on="on">
                    <v-icon>{{ $icons.mdiArrowRight }}</v-icon>
                  </v-btn>
                </template>
                <span>Next</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    icon
                    class="ml-2"
                    :color="response.flagged ? 'accent' : ''"
                    @click="flag()"
                    v-on="on"
                  >
                    <v-icon>{{ $icons.mdiFlagOutline }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ response.flagged ? 'Unflag' : 'Flag' }} response</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    icon
                    class="ml-2"
                    :color="response.repeat ? 'accent' : ''"
                    @click="reassign()"
                    v-on="on"
                  >
                    <v-icon>{{ $icons.mdiRepeat }}</v-icon>
                  </v-btn>
                </template>
                <span>Reassign question</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon class="ml-2" v-on="on" @click="infoDialog = true">
                    <v-icon>{{ $icons.mdiInformationOutline }}</v-icon>
                  </v-btn>
                </template>
                <span>More information</span>
              </v-tooltip>
              <v-spacer />
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-chip color="primary" outlined class="mr-2" v-on="on">
                    <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                    <span v-if="marking" class="font-weight-black">{{
                      response.tm.length
                    }}</span>
                    <v-icon right>{{ $icons.mdiCheck }}</v-icon>
                  </v-chip>
                </template>
                <span>Teacher mark</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-chip color="green darken-2" outlined v-on="on">
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
                </template>
                <span>Self mark</span>
              </v-tooltip>
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
              <!-- N.B. update is debounced method -->
              <v-textarea
                v-model="feedback"
                outlined
                rows="4"
                auto-grow
                :append-icon="
                  savingFeedback
                    ? $icons.mdiCloudSyncOutline
                    : $icons.mdiCloudCheckOutline
                "
                @input="update()"
              ></v-textarea>
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
                v-model="teacherMarks"
                :value="mp.id"
                hide-details
                @change="toggleMark(mp.id)"
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
                <v-switch v-model="smartSort" hide-details>
                  <template #label>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <span v-on="on">Smart sort</span>
                      </template>
                      <span>Self marks first</span>
                    </v-tooltip>
                  </template>
                </v-switch>
              </div>
              <p class="text-subtitle-1">Guidance</p>
              <p
                v-if="question.guidance"
                class="text-body-2"
                v-html="question.guidance"
              ></p>
              <p v-else class="text-body-2">None</p>
            </v-col>
          </v-row>
          <!-- More info dialog -->
          <v-dialog v-if="marking" v-model="infoDialog" width="400">
            <v-card class="modal">
              <v-card-title class="d-flex justify-center">
                More information
              </v-card-title>
              <v-card-text>
                <ul>
                  <li>
                    Response id: <code>{{ response.id }}</code>
                    <v-btn icon small @click="copyId()">
                      <v-icon small>
                        {{ $icons.mdiContentCopy }}
                      </v-icon>
                    </v-btn>
                  </li>
                  <li>Time taken: {{ timeTaken }}</li>
                </ul>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  elevation="0"
                  @click="infoDialog = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-card>
    </v-dialog>
    <onboarding-snackbar />
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
  mdiRepeat,
  mdiInformationOutline,
  mdiChevronLeft,
  mdiContentCopy,
  mdiCloudCheckOutline,
  mdiCloudSyncOutline,
} from '@mdi/js'
import { mapState, mapGetters } from 'vuex'
import { debounce, cloneDeep } from 'lodash'
import DeleteAssignment from '@/components/teacher/DeleteAssignment'
import GroupHeader from '@/components/teacher/GroupHeader'
import GroupNav from '@/components/teacher/GroupNav'
import MarkChip from '@/components/teacher/MarkChip'
import OnboardingSnackbar from '@/components/teacher/OnboardingSnackbar'

export default {
  components: {
    DeleteAssignment,
    GroupHeader,
    GroupNav,
    MarkChip,
    OnboardingSnackbar,
  },
  layout: 'app',
  data() {
    return {
      studentIndex: 0,
      questionIndex: 0,
      responseIndex: 0,
      // These 3 ^^^ values let us index into data structure
      marking: false,
      commentBank: [],
      feedback: '',
      savingFeedback: '',
      smartSort: false,
      markScheme: [],
      teacherMarks: [],
      infoDialog: false,
    }
  },
  async fetch() {
    // Dispatch store action to get data (render from store)
    // Don't fetch if assignment already in store
    if (
      this.$store.state.assignments.assignment.id !== this.$route.params.report
    ) {
      try {
        await this.$store.dispatch(
          'assignments/getReport',
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
  },
  head() {
    return {
      title: this.$fetchState.pending ? '' : this.assignment.name,
    }
  },
  computed: {
    ...mapGetters({ group: 'groups/activeGroup' }),
    ...mapState({
      obs: (state) => state.user.onboardStep,
      assignment: (state) => state.assignments.assignment,
    }),
    // Questions included in assignment -> headers (for hover preview)
    // +1 because index 0 contains Vuetify table metadata
    question() {
      return this.$fetchState.pending
        ? {}
        : this.assignment.headers[this.questionIndex + 1]
    },
    // Current question id as a String
    qIdStr() {
      return this.assignment.headers[this.questionIndex + 1].value
    },
    // Format time taken as mm:ss
    timeTaken() {
      const t = this.response.time
      return `${Math.floor(t / 60)}:${String(
        t - Math.floor(t / 60) * 60
      ).padStart(2, '0')}`
    },
    response() {
      // this.assignment is the massive data structure we get back
      // from getReport (see sample at Examgap/json).
      // Its two main keys are: headers and students.
      // studentIndex gets us horizontally into the student array
      // Each student object has two main keys: name and data
      // data is an array of objects (one for each question).
      // Within these objects is an array of the student's answers.
      // If the question has been reassigned, they could have more
      // than one response. Finally, we have the response object.
      return this.assignment.students[this.studentIndex].data[
        this.questionIndex
      ][this.qIdStr][this.responseIndex]
    },
  },
  watch: {
    response() {
      this.updateBank()
      // If smartSort is on, re-sort mark scheme when response changes
      if (this.smartSort) this.markScheme.sort(this.selfMarksFirst)
      this.feedback = this.response.feedback
    },
    smartSort() {
      if (!this.$fetchState.pending && this.smartSort) {
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
      mdiRepeat,
      mdiInformationOutline,
      mdiChevronLeft,
      mdiContentCopy,
      mdiCloudCheckOutline,
      mdiCloudSyncOutline,
    }
  },
  mounted() {
    if (this.group.assignments.length < 3) {
      this.$store.commit('user/setOnboardStep', 7)
    }
  },
  methods: {
    // Copy response id to clipboard
    async copyId() {
      await navigator.clipboard.writeText(this.response.id)
      this.$snack.showMessage({
        type: '',
        msg: 'Copied to clipboard',
      })
    },
    refresh() {
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
    mark(obj) {
      // Index into big data structure
      this.studentIndex = obj.studentIndex
      this.questionIndex = obj.questionIndex
      this.responseIndex = obj.responseIndex
      this.marking = true
      // Copy original (unsorted) mark scheme
      // N.B. Don't just copy by reference!
      this.markScheme = cloneDeep(this.question.markScheme)
      // Done onboarding
      this.$store.commit('user/setOnboardStep', 0)
      // Set as 'marked' as soon as response opened
      this.marked(this.response.id)
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
      // Loop back to start
      if (this.studentIndex >= this.assignment.students.length - 1) {
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
      // Loop back to end
      if (this.studentIndex === 0) {
        this.studentIndex = this.assignment.students.length - 1
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
    async toggleMark(markId) {
      // Don't exceed max mark
      if (this.teacherMarks.length > this.question.maxMark) {
        this.$snack.showMessage({
          msg: `Max. ${this.question.maxMark} mark${
            this.question.maxMark !== '1' ? 's' : ''
          }`,
        })
        // Untick checkbox by splicing id out of v-model
        for (let i = 0; i < this.teacherMarks.length; i++) {
          if (this.teacherMarks[i] === markId) {
            this.teacherMarks.splice(i, 1)
          }
        }
      } else {
        try {
          const url = new URL(
            '/.netlify/functions/toggleMark',
            this.$config.baseURL
          )
          const response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              responseId: this.response.id,
              markId,
              add: !!this.teacherMarks.find((x) => x === markId),
              teacher: true,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error saving mark ${response.status}`)
          }
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error saving mark',
          })
        }
      }
    },
    async flag() {
      // Dispatch a store action to update the db
      // This action also mutates local data
      // https://medium.com/js-dojo/vuex-tip-error-handling-on-actions-ee286ed28df4
      try {
        await this.$store.dispatch('assignments/flagResponse', {
          responseId: this.response.id,
          flag: !this.response.flagged,
          studentIndex: this.studentIndex,
          questionIndex: this.questionIndex,
          qIdStr: this.qIdStr,
          responseIndex: this.responseIndex,
        })
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
        await this.$store.dispatch('assignments/reassign', {
          responseId: this.response.id,
          repeat: !this.response.repeat,
          studentIndex: this.studentIndex,
          questionIndex: this.questionIndex,
          qIdStr: this.qIdStr,
          responseIndex: this.responseIndex,
        })
        this.$snack.showMessage({
          msg: this.response.repeat ? 'Reassigned' : 'Reassignment removed',
        })
      } catch (err) {
        console.error(err)
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
      try {
        this.savingFeedback = true
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
      } catch (e) {
        console.error(e)
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

/* thin divider under app-bar */
#div2 {
  border-bottom: 1px solid #e3dede !important;
}

.fix-width {
  display: inline-block;
  width: 60px;
}
</style>
