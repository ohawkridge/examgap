<template>
  <div>
    <v-dialog v-model="dialog" width="800" transition="scroll-x-transition">
      <v-card>
        <v-card-title class="d-flex justify-center">
          Create assignment
        </v-card-title>
        <v-card-text>
          <v-row v-if="students.length > 0">
            <v-col cols="12">
              <p class="text-body-1">Select students for this assignment</p>
              <v-checkbox v-model="selectAll" class="mb-n3">
                <template #label>
                  <strong>Select all</strong>
                </template>
              </v-checkbox>
            </v-col>
            <v-col
              v-for="(student, i) in students"
              :key="i"
              class="py-0"
              cols="12"
              md="4"
            >
              <v-checkbox
                v-model="selectedStudents"
                :value="student.id"
                class="mb-n2"
                multiple
              >
                <template #label>
                  {{ student.username }}&nbsp;
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <a
                        :class="`exam-chip ${
                          student.examMode ? '' : 'disabled-chip'
                        }`"
                        href="#"
                        v-bind="attrs"
                        v-on="on"
                        @click.stop="toggleMode(student)"
                        >EXAM</a
                      >
                    </template>
                    <span
                      >Turn exam mode
                      {{ student.examMode ? 'off' : 'on' }}</span
                    >
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-alert
                border="left"
                text
                type="info"
                :icon="$icons.mdiInformationOutline"
              >
                Turn exam mode off to show keywords and a minimum word count for
                students when answering questions
              </v-alert>
            </v-col>
          </v-row>
          <!-- No students -->
          <v-row v-else>
            <v-col cols="12">
              <v-alert
                border="left"
                text
                class="mb-0"
                type="info"
                :icon="$icons.mdiInformationOutline"
              >
                <p class="mb-0">
                  No students added yet. Go to the '<nuxt-link
                    :to="`/students/${groupId}`"
                    ><b>Students</b></nuxt-link
                  >'' screen and click 'Actions'
                  <v-icon small color="primary">{{
                    $icons.mdiArrowRight
                  }}</v-icon>
                  'Add students'.
                </p>
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn text @click="dialog = false">Cancel</v-btn>
              <v-btn
                color="primary"
                :disabled="students.length === 0"
                elevation="0"
                class="ml-2"
                width="80"
                @click="next()"
                >Next</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Assignment name & date -->
    <v-dialog v-model="dialog2" width="800" transition="scroll-x-transition">
      <v-card>
        <v-card-title class="d-flex justify-center">
          Create assignment
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <p class="text-body-1">
                  Name your assignment and set start/end dates
                </p>
                <v-text-field
                  v-model="name"
                  label="Assignment name*"
                  required
                  :rules="[rules.required]"
                  outlined
                  @focus="$event.target.select()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="pb-0">
                <v-menu
                  v-model="menu"
                  min-width="290px"
                  offset-y
                  transition="scale-transition"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="startDate"
                      label="Start date*"
                      :append-icon="$icons.mdiCalendarMonthOutline"
                      placeholder="YYYY-MM-DD"
                      :rules="[rules.required]"
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    color="primary"
                    :min="new Date().toISOString().substr(0, 10)"
                    no-title
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-menu
                  v-model="menu2"
                  min-width="290px"
                  offset-y
                  transition="scale-transition"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="endDate"
                      label="End date*"
                      outlined
                      :append-icon="$icons.mdiCalendarMonthOutline"
                      placeholder="YYYY-MM-DD"
                      :rules="[rules.required, rules.date]"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    color="primary"
                    :min="new Date().toISOString().substr(0, 10)"
                    no-title
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                class="d-flex justify-space-between align-center pt-0"
              >
                <small>*Indicates required field</small>
                <div>
                  <v-chip outlined class="mr-1 ml-1" @click="setStart(0)">
                    Today
                  </v-chip>
                  <v-chip outlined class="mr-1" @click="setStart(7)">
                    1 week
                  </v-chip>
                  <v-chip outlined @click="setStart(14)"> 2 weeks </v-chip>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  text
                  @click="
                    dialog2 = false
                    dialog = true
                  "
                  >Back</v-btn
                >
                <v-btn
                  color="primary"
                  elevation="0"
                  class="ml-2"
                  :loading="loading"
                  :disabled="loading"
                  @click="create()"
                  >Create assignment</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiCalendarMonthOutline,
  mdiInformationOutline,
  mdiArrowRight,
} from '@mdi/js'

export default {
  props: {
    questions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
      dialog2: false,
      valid: true,
      loading: false,
      students: [],
      selectedStudents: [],
      name: this.defaultName(),
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      menu: null,
      menu2: false,
      rules: {
        required: (value) => !!value || 'This field is required.',
        date: (date) =>
          !(date < new Date().toISOString().substr(0, 10)) ||
          'End date cannot be in the past.',
      },
    }
  },
  async fetch() {
    // Get students for this group
    try {
      const url = new URL(
        '/.netlify/functions/getStudents',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.$store.state.user.secret,
          groupId: this.groupId,
          namesOnly: true,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching students ${response.status}`)
      }
      this.students = await response.json()
    } catch (e) {
      console.error(e)
    }
  },
  computed: {
    ...mapState({
      groupId: (state) => state.assignments.groupId,
    }),
    selectAll: {
      get() {
        return (
          this.students && this.selectedStudents.length === this.students.length
        )
      },
      set(allSelected) {
        if (allSelected) {
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
    // If fetch hasn't loaded students (e.g. page refreshed) try and load them
    dialog() {
      if (this.dialog && this.students.length === 0) {
        this.$fetch()
      }
    },
  },
  created() {
    this.$icons = {
      mdiCalendarMonthOutline,
      mdiInformationOutline,
      mdiArrowRight,
    }
  },
  mounted() {
    this.$nuxt.$on('show-assign', () => {
      this.selectAll = true // Select all by default
      this.dialog = true
    })
  },
  methods: {
    // Default assignment name like "Week X Assignment"
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
    next() {
      this.dialog = false
      this.dialog2 = true
    },
    async toggleMode(student) {
      try {
        const url = new URL(
          '/.netlify/functions/updateExamMode',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            studentId: student.id,
            examMode: !student.examMode,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error updating examMode ${response.status}`)
        }
        // Update local data if call succeeds
        student.examMode = !student.examMode
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error updating mode',
        })
      }
    },
    async create() {
      if (this.$refs.form.validate() && this.selectedStudents.length > 0) {
        try {
          this.loading = true
          const url = new URL(
            '/.netlify/functions/createAssignment',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              name: this.name,
              start: this.startDate,
              end: this.endDate,
              group: this.groupId, // From store
              students: this.selectedStudents,
              questions: this.questions,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error creating assignment ${response.status}`)
          }
          response = await response.json()
          // console.dir(response)
          // Clear any previously selected questions
          this.$store.commit('assignments/clearSelectedQuestions')
          // Update local data
          this.$store.commit('groups/addAssignment', response)
          this.$router.push(`/report/${response.ref['@ref'].id}`)
          this.$snack.showMessage({
            type: 'success',
            msg: 'Assignment created',
          })
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    },
  },
}
</script>

<style scoped>
.exam-chip {
  position: relative;
  background-color: #e0e0e0;
  border-radius: 4px !important;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 1px;
  padding-bottom: 1px;
  font-size: 12px;
  text-decoration: none;
  color: #000000de;
}

.disabled-chip {
  opacity: 0.4;
}

.disabled-chip:before {
  position: absolute;
  content: '';
  left: 0;
  top: 50%;
  right: 0;
  border-top: 2px solid;
  border-color: #f44336;

  -webkit-transform: rotate(-15deg);
  -moz-transform: rotate(-15deg);
  -ms-transform: rotate(-15deg);
  -o-transform: rotate(-15deg);
  transform: rotate(-15deg);
}
</style>
