<template>
  <div>
    <v-row class="pa-3">
      <v-col cols="12" sm="6" class="d-flex align-start pb-0">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn icon class="mr-2" nuxt :to="`/group/${group.id}`" v-on="on">
              <v-icon>{{ $icons.mdiArrowLeft }}</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
        <span class="text-h6">{{
          $fetchState.pending ? 'Loading...' : assignment.name
        }}</span>
      </v-col>
      <v-col cols="12" sm="6" class="pb-0">
        <div class="d-flex align-center">
          <span class="font-weight-medium fix-date">Start:</span>
          <v-icon small class="mr-1" color="grey">{{
            $icons.mdiCalendarStart
          }}</v-icon>
          {{ assignment.start | date }}
        </div>
        <div class="d-flex align-center">
          <span class="font-weight-medium fix-date">Due:</span>
          <v-icon small class="mr-1" color="grey">{{
            $icons.mdiCalendarEnd
          }}</v-icon>
          {{ assignment.dateDue | date }}
        </div>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <the-delete-assignment-dialog
          v-if="!$fetchState.pending && group"
          :assignment-id="assignment.id"
          :group-id="group.id"
          type="btn"
        />
        <v-btn elevation="0" text rounded class="ml-2" @click="refresh()">
          Refresh
        </v-btn>
      </v-col>
    </v-row>
    <v-skeleton-loader
      v-if="$fetchState.pending"
      :loading="true"
      type="table"
      :types="{ table: 'table-thead, table-tbody, table-tfoot' }"
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
          <td v-for="(item, j) in student.data" :key="j" class="text-center">
            <MarkChip :data="item" :student-index="i" :question-index="j" />
          </td>
        </tr>
        <tr v-if="assignment.students.length === 0">
          <td class="text-center" :colspan="assignment.headers.length">
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
    <div class="d-flex justify-end align-center pa-4 text-caption">
      N/A Not answered&nbsp;&nbsp;
      <v-icon small class="mr-1">{{ $icons.mdiCheck }}</v-icon>
      Self mark&nbsp;&nbsp;
      <v-icon small class="mr-1">{{ $icons.mdiCheckAll }}</v-icon>
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
            <v-icon>{{ $icons.mdiClose }}</v-icon>
          </v-btn>
          <v-toolbar-title>Marking</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn dark text @click="close()">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row id="div2">
            <v-col cols="12" class="d-flex align-center">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon @click="next(-1)" v-on="on">
                    <v-icon>{{ $icons.mdiArrowLeft }}</v-icon>
                  </v-btn>
                </template>
                <span>Previous</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn icon @click="next(1)" v-on="on">
                    <v-icon>{{ $icons.mdiArrowRight }}</v-icon>
                  </v-btn>
                </template>
                <span>Next</span>
              </v-tooltip>
              <v-tooltip v-if="marking" bottom>
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
                <span>{{
                  response.flagged ? 'Remove flag' : 'Flag response'
                }}</span>
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
              <the-info-dialog :response="response" />
              <v-spacer />
              <v-tooltip v-if="marking" bottom>
                <template #activator="{ on }">
                  <v-chip
                    label
                    :color="color(marks.length, question.maxMark)"
                    class="mr-2"
                    v-on="on"
                  >
                    <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                    {{ marks.length }}
                    <v-icon right>{{ $icons.mdiCheck }}</v-icon>
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
                    <v-icon left>{{ $icons.mdiAccountOutline }}</v-icon>
                    {{ response.sm.length }}
                    <v-icon right>{{ $icons.mdiCheck }}</v-icon>
                  </v-chip>
                </template>
                <span>Student</span>
              </v-tooltip>
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
                v-model="marks"
                :value="mp.id"
                hide-details
                @change="checkMax(mp.id)"
              >
                <template #label>
                  <span
                    :class="
                      response.sm.includes(mp.id) ? 'font-weight-bold' : ''
                    "
                  >
                    {{ mp.text }}
                  </span>
                </template>
              </v-checkbox>
              <div class="d-flex justify-end">
                <v-switch v-model="smartSort" inset hide-details>
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
  mdiRepeat,
  mdiContentCopy,
  mdiCloudCheckOutline,
  mdiCloudSyncOutline,
  mdiRefresh,
  mdiCalendarStart,
  mdiCalendarEnd,
} from '@mdi/js'
import { mapState, mapGetters } from 'vuex'
import { debounce } from 'lodash'
import MarkChip from '@/components/teacher/MarkChip'
import TheInfoDialog from '@/components/teacher/TheInfoDialog'
import TheDeleteAssignmentDialog from '@/components/teacher/TheDeleteAssignmentDialog'

export default {
  components: {
    TheDeleteAssignmentDialog,
    MarkChip,
    TheInfoDialog,
  },
  layout: 'app',
  data() {
    return {
      commentBank: [],
      feedback: '',
      savingFeedback: false,
      smartSort: false,
      markScheme: [], // Copied via question.markScheme
      marks: [], // v-model for checkboxes
      infoDialog: false,
      forceRefresh: false,
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
      mdiContentCopy,
      mdiCloudCheckOutline,
      mdiCloudSyncOutline,
      mdiRefresh,
      mdiCalendarStart,
      mdiCalendarEnd,
    }
  },
  mounted() {
    if (this.group.assignments.length < 3) {
      this.$store.commit('app/setOnboardStep', 6)
    }
  },
  methods: {
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
      if (this.response !== undefined) {
        this.saveMarks()
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
          msg: this.response.flagged ? 'Flagged' : 'Flag removed',
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
          msg: this.response.repeat ? 'Reassigned' : 'Cancelled',
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
      this.saveFeedback()
    }, 2000),
    async saveFeedback() {
      try {
        this.savingFeedback = true
        await this.$store.dispatch('assignment/saveFeedback', this.feedback)
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
