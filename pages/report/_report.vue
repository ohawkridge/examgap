<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <div class="d-flex justify-space-between">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn text rounded @click="$router.go(-1)" v-on="on">
                <font-awesome-icon
                  icon="fa-light fa-arrow-left"
                  class="ico-btn mr-2"
                />
                Back
              </v-btn>
            </template>
            <span>Back</span>
          </v-tooltip>
          <div>
            <!-- Full buttons on desktop -->
            <div v-if="$vuetify.breakpoint.name !== 'xs'">
              <v-btn
                rounded
                text
                color="red"
                @click="$nuxt.$emit('show-delete', assignment.id, group.id)"
              >
                Delete
              </v-btn>
              <v-btn rounded text class="ml-2" @click="$fetch()">
                Refresh
              </v-btn>
            </div>
            <!-- Ellipsis on mobile -->
            <v-menu v-else>
              <template #activator="{ on }">
                <v-btn icon v-on="on">
                  <font-awesome-icon
                    icon="fa-light fa-ellipsis-vertical"
                    class="ico-btn"
                  />
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title @click="$fetch()">
                    Refresh
                  </v-list-item-title>
                </v-list-item>
                <delete-assignment-dialog
                  v-if="!$fetchState.pending"
                  :assignment-id="assignment.id"
                  :group-id="group.id"
                  type="list"
                />
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <div class="d-flex align-center">
          <span class="font-weight-medium fix-width">Start:</span>
          {{ assignment.start | date }}
        </div>
        <div class="d-flex align-center">
          <span class="font-weight-medium fix-width">Due:</span>
          {{ assignment.dateDue | date }}
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <v-skeleton-loader
          v-if="$fetchState.pending"
          :types="{ table: 'table-thead, table-tbody@2' }"
          type="table"
          class="outlined"
        ></v-skeleton-loader>
        <table v-else id="table" class="outlined">
          <thead>
            <tr>
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
                v-for="(data, j) in student.data"
                :key="j"
                class="text-center"
              >
                <!-- Formerly MarkChip.vue components -->
                <!-- Nested values as props not working reliably -->
                <div
                  v-if="data[Object.keys(data)[0]].length > 0"
                  :class="flex(data)"
                >
                  <!-- *** NOT ANSWERED *** -->
                  <!-- <div v-if="data[Object.keys(data)[0]].length === 0">N/A</div> -->
                  <!-- Loop through responses (see note below) -->
                  <template v-for="(response, k) in data[Object.keys(data)[0]]">
                    <!-- *** SELF MARKED *** -->
                    <v-tooltip v-if="!response.marked" :key="k" bottom>
                      <template #activator="{ on }">
                        <v-chip @click="startMarking(i, j, k)" v-on="on">
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
                          @click="startMarking(i, j, k)"
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
          <font-awesome-icon icon="fa-light fa-check" class="fa-sm mr-1" />
          Self mark&nbsp;&nbsp;
          <font-awesome-icon
            icon="fa-light fa-check-double"
            class="fa-sm mr-1"
          />
          Teacher mark&nbsp;&nbsp;
          <font-awesome-icon
            icon="fa-light fa-arrows-repeat"
            class="fa-sm mr-1"
          />
          Reassigned
        </div>
      </v-col>
    </v-row>
    <!-- Marking dialog xx -->
    <v-dialog
      v-model="marking"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar dark dense color="primary">
          <v-btn icon dark @click="close()">
            <font-awesome-icon icon="fa-light fa-xmark" class="ico-btn" />
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
                        class="ico-btn"
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
                        class="ico-btn"
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
                        class="ico-btn"
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
                        class="ico-btn"
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
                        v-if="$vuetify.breakpoint.name !== 'xs'"
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
                        v-if="$vuetify.breakpoint.name !== 'xs'"
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
              <p class="text-subtitle-1 font-weight-bold">Question</p>
              <p v-if="marking" class="text-body-2" v-html="question.text"></p>
              <div class="d-flex justify-end">
                <v-chip v-if="marking" outlined
                  >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <p v-if="marking" class="text-subtitle-1 font-weight-bold">
                {{ response.username | name }}
              </p>
              <p
                v-if="marking"
                class="breaks text-body-2"
                v-text="response.text"
              ></p>
              <v-textarea
                v-if="marking"
                id="feedback"
                v-model="feedback"
                outlined
                rows="4"
                hide-details
                auto-grow
              >
              </v-textarea>
              <v-list dense>
                <v-list-item
                  v-for="(comment, i) in bank"
                  :key="i"
                  title="Click to reuse"
                  @click="feedback = comment"
                >
                  <v-list-item-content>
                    <v-list-item-subtitle>{{ comment }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col v-if="marking" cols="12" md="4">
              <p class="text-subtitle-1 font-weight-bold">Mark scheme</p>
              <v-checkbox
                v-for="(mark, i) in markScheme"
                :key="i"
                v-model="marks"
                :value="mark.id"
                hide-details
              >
                <template #label>
                  <span class="text-body-2" :class="awardSm(mark.id)">
                    {{ mark.text }}
                  </span>
                </template>
              </v-checkbox>
              <p class="text-subtitle-1 font-weight-bold mt-3">Guidance</p>
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
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheInfoDialog from '@/components/teacher/TheInfoDialog'

export default {
  components: {
    TheInfoDialog,
  },
  layout: 'app',
  data() {
    return {
      bank: [],
      markScheme: [],
      marks: [], // v-model for checkboxes
      infoDialog: false,
    }
  },
  async fetch() {
    try {
      const assId = this.$route.params.report
      await this.$store.dispatch('assignment/getReport', assId)
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
        if (this.response.feedback === undefined) return ''
        return this.response.feedback
      },
      set(val) {
        this.$store.commit('assignment/setFeedback', {
          response: this.response,
          feedback: val,
        })
      },
    },
    // Get question from assignment header (hover preview)
    // +1 because index 0 contains v-table metadata
    question() {
      return this.assignment.headers[this.questionIndex + 1]
    },
  },
  watch: {
    response() {
      // N.B. watch fires on open and close
      // On close, it's just a 'prototype' object
      if ('id' in this.response) {
        // Set response as marked if not already
        if (!this.response.marked) {
          this.$store.dispatch('assignment/setMarked')
        }
        // *ES6 copy* teacher marks
        // These become the v-model for checkboxes
        this.marks = [...this.response.tm]
      }
      // Update feedback for current response
      this.feedback = this.response.feedback
      this.updateBank()
    },
    marks() {
      const max = this.question.maxMark
      // Don't exceed max. mark
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
    if (this.group.assignments.length === 1) {
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
    // CSS class for self marks awarded
    awardSm(markId) {
      return this.response.sm.includes(markId) ? 'font-weight-bold' : ''
    },
    close() {
      this.saveMarks()
      this.saveFeedback()
      this.$store.commit('assignment/setMarking', false)
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
    // Build comment bank from feedback on existing responses
    updateBank() {
      const bank = []
      if (this.marking) {
        for (const stuRespObj of this.assignment.students) {
          // Array of response objects for this question
          const rs = stuRespObj.data[this.questionIndex][this.question.value]
          for (const response of rs) {
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
        await this.$store.dispatch('assignment/saveFeedback', this.feedback)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving feedback',
        })
      }
    },
    startMarking(i, j, k) {
      // Commit mutations setting indices into big data structure
      this.$store.commit('assignment/setStudentIndex', i)
      this.$store.commit('assignment/setQuestionIndex', j)
      this.$store.commit('assignment/setResponseIndex', k)
      // Copy original mark scheme from question object
      this.copyMarkScheme()
      this.$store.commit('assignment/setMarking', true)
      // Onboarding complete✓
      this.$store.commit('app/setOnboardStep', 0)
    },
    // Add margin bottom to reassigned responses (except last)
    marginBottom(responses, i) {
      return responses.length > 1 && i < responses.length - 1 ? 'mb-2' : ''
    },
    // Use flex columns if >1 response for question
    flex(data) {
      return data[Object.keys(data)[0]].length > 1
        ? 'd-flex flex-column align-center'
        : ''
    },
  },
}
</script>

<style scoped>
table {
  background-color: #fff;
  border: 1px solid #d2d2d2 !important;
  border-radius: 4px;
  border-collapse: collapse;
  overflow-x: scroll;
  width: 100%;
}

.outlined {
  border: 1px solid #d2d2d2 !important;
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

/* adjust flags to keep chips aligned */
.fix-flag {
  position: relative;
  top: 4px;
  margin-left: 8px;
  margin-right: -30px;
}

.fix-width {
  width: 56px;
}

.ico-btn {
  height: 24px;
  width: 24px;
}
</style>
