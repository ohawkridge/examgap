<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn outlined rounded color="primary" nuxt to="/author">
          <font-awesome-icon icon="fa-light fa-plus" class="mr-2" />
          New Question
        </v-btn>
        <div>
          <v-btn
            rounded
            text
            color="primary"
            :disabled="!hoverPreview"
            class="mr-2"
            nuxt
            :to="hoverPreview ? `/question/${hoverPreview.id}` : ''"
          >
            View question
          </v-btn>
          <v-btn outlined rounded color="primary" @click="selection = []">
            Clear
          </v-btn>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                color="primary"
                :disabled="selection.length == 0"
                rounded
                class="ml-2"
                v-on="on"
                @click="assign()"
              >
                <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
                  Assign ({{ selection.length }})
                </span>
              </v-btn>
            </template>
            <span
              >Assign {{ selection.length }} question{{
                selection.length | pluralize
              }}</span
            >
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <!-- Topics xx -->
      <v-col cols="12" md="3">
        <v-list dense rounded color="transparent">
          <v-subheader> TOPICS </v-subheader>
          <v-list-item-group v-model="topicId" active-class="secondary--text">
            <v-list-item
              v-for="(topic, i) in topics"
              :key="i"
              :value="topic.id"
              color="primary"
              :title="topic.name"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ topic.name }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  {{ topic.count }}
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <!-- Questions xx -->
      <v-col cols="12" md="4">
        <v-list
          v-if="!$fetchState.pending"
          id="questions"
          class="overflow-y-auto"
          nav
          dense
          color="transparent"
        >
          <v-subheader> QUESTIONS </v-subheader>
          <v-list-item-group
            v-model="selection"
            multiple
            active-class="green--text"
          >
            <v-list-item
              v-for="(q, i) in questions"
              :key="i"
              :value="q.id"
              @mouseover="preview(q.id)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ q.text | strip }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ q.maxMark }} mark{{ q.maxMark | pluralize }}
                  <v-chip
                    v-for="(assignment, j) in q.previous"
                    :key="j"
                    x-small
                    label
                    color="tertiary"
                    class="ml-2"
                  >
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <span
                          :class="$vuetify.theme.dark ? 'd' : 'l'"
                          v-on="on"
                        >
                          {{ assignment.date | date }}</span
                        >
                      </template>
                      <span>{{ assignment.name }}</span>
                    </v-tooltip>
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-scroll-x-transition>
                  <font-awesome-icon
                    v-if="selection.includes(q.id)"
                    icon="fa-light fa-circle-check"
                    class="fa-lg"
                  />
                </v-scroll-x-transition>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <!-- Preview xx -->
      <v-col cols="12" md="5" class="text-body-2" style="padding-top: 40px">
        <template v-if="hoverPreview">
          <div v-html="hoverPreview.text"></div>
          <div class="d-flex justify-end mt-3">
            <v-chip outlined color="tertiary" small label>
              {{ hoverPreview.maxMark }} mark{{
                hoverPreview.maxMark | pluralize
              }}
            </v-chip>
          </div>
        </template>
        <div
          v-else
          id="hover"
          class="d-flex justify-center align-center grey--text"
        >
          Hover your pointer over a question to see a preview.
        </div>
      </v-col>
    </v-row>
    <!-- Create assignment xx -->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary" :dark="!$vuetify.theme.dark">
          <v-btn icon @click="cancel">
            <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
              <font-awesome-icon icon="fa-light fa-xmark" class="ico-btn" />
            </span>
          </v-btn>
          <v-toolbar-title>
            <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
              Create Assignment
            </span>
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn text @click="create()">
              <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
                CREATE
              </span>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text style="margin-top: 40px">
          <v-form ref="form" class="mt-6">
            <v-row>
              <v-col cols="12" offset-md="1" md="6" lg="5">
                <p class="text-subtitle-2">Assignment details</p>
                <p class="text-caption">
                  Name your assignment and set start/due dates.
                </p>
                <v-text-field
                  v-model="name"
                  label="Assignment name*"
                  required
                  :rules="nameRules"
                  outlined
                  @focus="$event.target.select()"
                ></v-text-field>
                <div class="d-flex justify-space-between">
                  <v-menu
                    v-model="menu"
                    min-width="290px"
                    offset-y
                    transition="scale-transition"
                    rounded="lg"
                  >
                    <template #activator="{ on }">
                      <v-text-field
                        v-model="startDate"
                        label="Start date*"
                        placeholder="YYYY-MM-DD"
                        :rules="startDateRules"
                        outlined
                        readonly
                        class="mr-2"
                        v-on="on"
                      >
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="startDate"
                      color="primary"
                      :min="new Date().toISOString().substr(0, 10)"
                      no-title
                    ></v-date-picker>
                  </v-menu>
                  <v-menu
                    v-model="menu2"
                    min-width="290px"
                    offset-y
                    transition="scale-transition"
                    rounded="lg"
                  >
                    <template #activator="{ on }">
                      <v-text-field
                        v-model="endDate"
                        label="Due date*"
                        outlined
                        placeholder="YYYY-MM-DD"
                        :rules="endDateRules"
                        class="ml-2"
                        readonly
                        v-on="on"
                      >
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="endDate"
                      color="primary"
                      :min="startDate"
                      no-title
                    ></v-date-picker>
                  </v-menu>
                </div>
                <div class="d-flex justify-end">
                  <v-chip-group active-class="secondary--text">
                    <v-chip outlined @click="setStart(0)">
                      <font-awesome-icon
                        icon="fa-light fa-calendar-day"
                        class="fa-lg mr-2"
                      />
                      Due today
                    </v-chip>
                    <v-chip outlined @click="setStart(7)">
                      <font-awesome-icon
                        icon="fa-light fa-calendar-week"
                        class="fa-lg mr-2"
                      />
                      Due in 1 week
                    </v-chip>
                    <v-chip outlined @click="setStart(14)">
                      <font-awesome-icon
                        icon="fa-light fa-calendar-week"
                        class="fa-lg mr-2"
                      />
                      Due in 2 weeks
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                offset-md="1"
                md="8"
                lg="7"
                style="margin-bottom: 80px"
              >
                <p class="text-subtitle-2 mt-8">Choose students</p>
                <p class="text-caption">
                  Choose students for this assignment and whether they should be
                  in exam mode.
                </p>
                <v-checkbox v-model="allSelected">
                  <template #label>
                    <div class="mr-6">
                      <strong>Select all</strong>
                    </div>
                    <v-menu offset-y open-on-hover class="ml-2" rounded="lg">
                      <template #activator="{ on }">
                        <div class="primary--text text-body-2" v-on="on">
                          Exam?
                          <font-awesome-icon
                            icon="fa-light fa-circle-info"
                            class="fa-lg ml-1"
                          />
                        </div>
                      </template>
                      <v-card max-width="280">
                        <v-card-text>
                          When exam mode is on, keywords and minimum word count
                          are hidden when answering questions.
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-checkbox>
                <div id="students">
                  <div
                    v-for="(student, i) in students"
                    :key="i"
                    class="d-flex align-center"
                  >
                    <v-checkbox
                      v-model="selectedStudents"
                      :value="student.id"
                      hide-details
                      multiple
                      class="mt-0 py-3"
                    >
                      <template #label>
                        {{ student.username | name }}
                      </template>
                    </v-checkbox>
                    <exam-mode-chip :student="student" />
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Unsaved changes dialog xx -->
    <v-dialog v-model="discardDialog" max-width="440">
      <v-card class="rounded-xl">
        <v-card-title
          class="d-flex justify-center text-h5 secondary--text pt-5"
        >
          <font-awesome-icon icon="fa-light fa-trash-can-xmark" class="fa-sm" />
        </v-card-title>
        <v-card-text>
          <p class="text-h5 text-center">Discard assignment?</p>
          <div class="d-flex justify-end">
            <v-btn text rounded @click="discardDialog = false">Cancel</v-btn>
            <v-btn
              color="error"
              :loading="loading"
              :disabled="loading"
              text
              rounded
              class="ml-2"
              @click="discard()"
            >
              Discard
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import debounce from 'lodash.debounce'
import ExamModeChip from '~/components/teacher/ExamModeChip.vue'

export default {
  name: 'Questions',
  components: { ExamModeChip },
  layout: 'app',
  data() {
    return {
      selection: [], // Selected questions
      hoverPreview: null,
      loading: false,
      dialog: false,
      discardDialog: false,
      selectedStudents: [],
      name: this.defaultName(),
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      menu: null,
      menu2: false,
      nameRules: [(v) => !!v || 'Assignment name is required'],
      startDateRules: [
        (d) =>
          d >= new Date().toISOString().substr(0, 10) ||
          'Start date cannot be in the past',
      ],
      endDateRules: [
        (d) => !!d || 'Date is required',
        (d) =>
          d >= new Date().toISOString().substr(0, 10) ||
          'Due date cannot be in the past',
        (d) => d >= this.startDate || 'Due date must be after start date',
      ],
    }
  },
  async fetch() {
    try {
      // Fetch course topics
      const id = this.$route.params.questions
      await this.$store.dispatch('topics/getTopics', id)
      // Select first topic by default
      this.topicId = this.topics[0].id
      // Now fetch questions for topic
      await this.$store.dispatch('topics/getQuestions', this.topicId)
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error loading topics',
      })
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    ...mapState({
      topics: (state) => state.topics.topics,
      questions: (state) => state.topics.questions,
      onboardStep: (state) => state.app.onboardStep,
      students: (state) => state.assignment.students,
    }),
    topicId: {
      get() {
        return this.$store.state.topics.topicId
      },
      set(id) {
        this.$store.commit('topics/setTopicId', id)
      },
    },
    allSelected: {
      get() {
        return this.selectedStudents.length === this.students.length
      },
      set(allSelected) {
        if (allSelected) {
          this.selectedStudents = []
          for (const student of this.students) {
            this.selectedStudents.push(student.id)
          }
        } else {
          this.selectedStudents = []
        }
      },
    },
  },
  watch: {
    async topicId() {
      // Update questions when topic changes
      try {
        this.loading = true
        await this.$store.dispatch('topics/getQuestions', this.topicId)
      } catch (err) {
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error loading questions',
        })
      } finally {
        this.hoverPreview = null // Clear preview
        this.loading = false
      }
    },
    selection() {
      if (this.onboardStep !== 0 && this.selection.length > 0) {
        this.$store.commit('app/setOnboardStep', 5)
      }
    },
  },
  mounted() {
    const title = `${this.group.course.name} (${this.group.course.board})`
    this.$store.commit('app/setPageTitle', title)
  },
  methods: {
    // Check for unsaved changes
    unsavedChanges() {
      if (this.name !== this.defaultName()) return true
      const d = new Date().toISOString().substr(0, 10)
      if (this.startDate !== d || this.endDate !== d) return true
      if (this.selectedStudents) return true
      return false
    },
    // Debounce mouseover events
    preview: debounce(function (id) {
      this.hoverPreview = this.questions.find((q) => q.id === id)
    }, 300),
    async getQuestion() {
      try {
        this.loading = true
        await this.$store.dispatch('topics/getQuestion', this.preview.id)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error loading question`,
        })
      } finally {
        this.loading = false
      }
    },
    assign() {
      this.dialog = true
      this.getStudents()
    },
    // Load students when assign is clicked
    async getStudents() {
      try {
        await this.$store.dispatch('assignment/getStudents')
        this.allSelected = true // Select all by default
      } catch (err) {
        console.error(err)
      }
    },
    // Default assignment name—"Week X Assignment"
    defaultName() {
      // https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
      let dObj = new Date()
      dObj = new Date(
        Date.UTC(dObj.getFullYear(), dObj.getMonth(), dObj.getDate())
      )
      dObj.setUTCDate(dObj.getUTCDate() + 4 - (dObj.getUTCDay() || 7))
      const yearStart = new Date(Date.UTC(dObj.getUTCFullYear(), 0, 1))
      const weekNo = Math.ceil(((dObj - yearStart) / 86400000 + 1) / 7)
      return `Week ${[dObj.getUTCFullYear(), weekNo][1]} Assignment`
    },
    // startDate shortcut chips
    setStart(n) {
      const sd = new Date(this.startDate) // Copy start date
      this.endDate = new Date(sd.setDate(sd.getDate() + n))
        .toISOString()
        .substr(0, 10)
    },
    async create() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const payload = {
            name: this.name,
            start: this.startDate,
            end: this.endDate,
            groupId: this.group.id,
            students: this.selectedStudents,
            questions: this.selection,
          }
          await this.$store.dispatch('assignment/createAssignment', payload)
          this.$router.push(`/group/${this.group.id}`)
          this.$snack.showMessage({
            type: 'success',
            msg: 'Assignment created',
          })
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error creating assignment',
          })
        } finally {
          this.loading = false
        }
      }
    },
    // Reset assignment data values
    discard() {
      this.name = this.defaultName()
      this.startDate = new Date().toISOString().substr(0, 10)
      this.endDate = new Date().toISOString().substr(0, 10)
      this.selectedStudents = []
      this.discardDialog = false
      this.dialog = false
    },
    // Check for unsaved changes before closing dialog
    cancel() {
      if (this.unsavedChanges) {
        this.discardDialog = true
      } else {
        this.dialog = false
      }
    },
  },
}
</script>

<style scoped>
#questions {
  height: 550px;
}

#hover {
  border: 2px dashed #e0e0e0;
  height: 100px;
  border-radius: 4px;
  padding: 12px;
}

.d {
  color: #241a00;
}

.l {
  color: #fbfcff;
}

header {
  border-radius: 0 !important;
}

/* arrange checkboxes into columns */
/* 2 on desktop; 1 on mobile */
#students {
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;
}
@media only screen and (max-width: 600px) {
  #students {
    -webkit-column-count: 1;
    -moz-column-count: 1;
    column-count: 1;
  }
}
</style>
