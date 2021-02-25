<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav :group-id="group.id" />
      </v-col>
      <v-col cols="12" md="9">
        <!-- n8 accounts for hidden bottom-nav -->
        <v-card class="mt-n6 mt-sm-0">
          <v-card-title class="d-flex justify-space-between">
            {{ data.name }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="d-flex justify-space-between">
                <DeleteAssignment
                  v-if="group"
                  :assignment-id="data.id"
                  :group-id="group.id"
                  type="btn"
                />
                <v-chip color="primary" outlined label>
                  Due {{ data.dateDue | date }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row>
              <v-col id="table" cols="12">
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
                          <v-card max-width="460">
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
                  </tbody>
                </table>
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
      <v-card>
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
          <v-row>
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
              <v-chip color="primary" outlined label class="mr-2">
                <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                <span v-if="marking" class="font-weight-black">{{
                  response.tm.length
                }}</span>
                <v-icon right>{{ $icons.mdiCheck }}</v-icon>
              </v-chip>
              <v-chip color="green darken-1" outlined label>
                <v-icon left>{{ $icons.mdiAccountOutline }}</v-icon>
                <span v-if="marking" class="font-weight-black">{{
                  response.sm.length
                }}</span>
                <v-icon right>{{ $icons.mdiCheck }}</v-icon>
              </v-chip>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <p class="text-subtitle-1 font-weight-medium">Question</p>
              <p v-if="marking" v-html="question.text"></p>
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
              <p v-if="marking" class="breaks" v-text="response.text"></p>
              <p class="text-subtitle-1 font-weight-medium">Feedback</p>
              <v-textarea
                v-model="feedback"
                outlined
                :append-icon="$icons.mdiCommentTextOutline"
                class="mb-n4"
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
              <p class="text-subtitle-1 font-weight-medium">Mark Scheme</p>
              <v-checkbox
                v-for="point in markScheme"
                :key="point[2].value.id"
                v-model="response.tm"
                :value="point[2].value.id"
                class="mt-0"
                @change="addRemoveMark(point[2].value.id)"
              >
                <template #label>
                  <span
                    v-if="response"
                    :class="
                      response.sm.includes(point[2].value.id)
                        ? 'green--text text--darken-3 font-weight-medium'
                        : ''
                    "
                  >
                    {{ point[1] }}</span
                  >
                </template>
              </v-checkbox>
              <div class="d-flex justify-end">
                <v-switch
                  v-model="smartSort"
                  inset
                  label="Sort"
                  @change="sortMarks()"
                ></v-switch>
              </div>
              <p class="text-subtitle-1 font-weight-medium">Marking guidance</p>
              <p>
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
  mdiCalendarRangeOutline,
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
  async asyncData({ store, params }) {
    const url = new URL(
      '/.netlify/functions/getReport',
      'http://localhost:8888'
    )
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        assignmentId: params.report,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching report ${response.status}`)
    }
    const data = await response.json()
    return { data }
  },
  data() {
    return {
      marking: false,
      feedbackStatus: '',
      bank: [],
      data: {},
      studentIndex: 0,
      questionIndex: 0,
      responseIndex: 0,
      smartSort: false,
      markScheme: [],
      unsorted: [],
    }
  },
  head() {
    return {
      title: this.data ? this.data.name : '',
    }
  },
  computed: {
    // Question is included in header data (for hover preview)
    question() {
      return this.data.headers[this.questionIndex + 1]
    },
    group() {
      return this.$store.state.groups.group
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
  created() {
    this.$icons = {
      mdiCalendarRangeOutline,
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
    sortMarks() {
      if (this.smartSort) {
        this.markScheme = this.question.markScheme.sort(this.selfSort)
      } else {
        this.markScheme = this.unsorted
      }
    },
    // If smartSort is on, resort mark scheme when changing response
    resort() {
      if (this.smartSort) {
        this.markScheme.sort(this.selfSort)
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
      this.bank = [...new Set(bank)] // Remove dupes
    },
    mark(obj) {
      console.log(`MARKING...(obj?)`)
      console.dir(obj)
      // Index into student responses data structure
      this.studentIndex = obj.studentIndex
      this.questionIndex = obj.questionIndex
      this.responseIndex = obj.responseIndex
      // Copy the unsorted mark scheme
      // so we can switch back later
      this.markScheme = this.question.markScheme
      // Watch out!! Don't just copy by reference
      // Otherwise, sorting one will sort both
      this.unsorted = cloneDeep(this.question.markScheme)
      this.marking = true
      // Must be *after* marking = true
      this.updateBank()
      // You could open a response and close it without clicking
      // next or previous, so set it as 'marked' on open
      this.marked(this.response.id)
    },
    flagColor(val) {
      return !val || this.response === undefined ? '' : 'secondary'
    },
    // Set response as 'marked'
    // async marked() {
    //   try {
    //     await setAsMarked(this.response.id)
    //     // Update local data structure
    //     this.response.marked = true
    //   } catch (e) {
    //     console.error(e)
    //     this.$snack.showMessage({
    //       type: 'error',
    //       msg: 'Error marking',
    //     })
    //   }
    // },
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
      this.resort()
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
      this.resort()
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
        // TODO
        // toggleMark(id, this.response.id)
      } else {
        // TODO
        // toggleMark(id, this.response.id, false)
      }
    },
    // async flag() {
    //   try {
    //     const { data } = await flagResponse(
    //       this.response.id,
    //       !this.response.flagged
    //     )
    //     // Update local data
    //     this.response.flagged = !this.response.flagged
    //     this.$snack.showMessage({
    //       type: '',
    //       msg: `${data.flagged ? 'Response flagged' : 'Flag removed'}`,
    //     })
    //   } catch (e) {
    //     console.error(e)
    //     this.$snack.showMessage({
    //       type: 'error',
    //       msg: 'An error occurred',
    //     })
    //   }
    // },
    // async boomerang() {
    //   try {
    //     const res = await repeatQuestion(
    //       this.response.id,
    //       !this.response.repeat
    //     )
    //     this.response.repeat = res.data.repeat // Update local data structure
    //     if (res.data.repeat) {
    //       this.$snack.showMessage({
    //         msg: `Reassigned to ${this.response.username}`,
    //         type: '',
    //       })
    //     }
    //   } catch (e) {
    //     console.error(e)
    //     this.$snack.showMessage({
    //       type: 'error',
    //       msg: 'Error reassigning question',
    //     })
    //   }
    // },
    // Debounce feedback area
    update: debounce(function () {
      this.save()
    }, 1500),
    save() {
      this.feedbackStatus = 'Saving...'
      // saveFeedback(this.response.id, this.feedback)
      //   .then(() => {
      //     this.feedbackStatus = 'Feedback saved'
      //     this.updateBank()
      //   })
      //   .catch((e) => {
      //     console.error(e)
      //     this.feedbackStatus = 'Error saving feedback'
      //   })
    },
    // Copy an existing comment onto response
    reuse(text) {
      this.response.feedback = text
      this.save() // Trigger save
    },
    // Comparison function so student self marks are first
    selfSort(m1, m2) {
      // Watch out!! Nexting over empty responses
      if (!this.response) return 0
      if (
        this.response.sm.includes(m1[2].value.id) ===
        this.response.sm.includes(m2[2].value.id)
      ) {
        return 0
      } else if (this.response.sm.includes(m1[2].value.id)) {
        return -1
      } else {
        return 1
      }
    },
  },
}
</script>

<style scoped>
/* TODO Weird artifact */
/* #table {
  overflow-x: scroll;
} */

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
</style>
