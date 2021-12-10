<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card class="rounded-xl pa-4" color="#fbfcff">
          <v-card-text>
            <p class="text-h5 mb-0">Create assignment</p>
            <p class="text-subtitle-1">Choose students for this assignment.</p>
            <v-checkbox v-model="allSelected">
              <template #label>
                <div class="mr-6">
                  <strong>Select all</strong>
                </div>
                <v-menu offset-y open-on-hover class="ml-2">
                  <template #activator="{ on }">
                    <div class="primary--text text-body-2" v-on="on">
                      Exam
                      <font-awesome-icon
                        icon="fa-light fa-circle-info"
                        class="fa-lg ml-1"
                      />
                    </div>
                  </template>
                  <v-card max-width="280">
                    <v-card-text>
                      In exam mode, keywords and minimum word count are hidden
                      when answering questions.
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </v-checkbox>
            <div id="students" class="mb-4">
              <v-checkbox
                v-for="(student, i) in students"
                :key="i"
                v-model="selectedStudents"
                :value="student.id"
                hide-details
                multiple
                class="mt-0 mb-6"
              >
                <template #label>
                  {{ student.username | name }}
                  <v-chip
                    :color="student.examMode ? 'green' : ''"
                    :outlined="!student.examMode"
                    small
                    class="ml-3"
                  >
                    <v-avatar left>
                      <font-awesome-icon
                        v-if="student.examMode"
                        icon="fa-light fa-check"
                        class="chip-icon"
                      />
                      <font-awesome-icon
                        v-else
                        icon="fa-light fa-xmark"
                        class="chip-icon"
                      />
                    </v-avatar>
                    <a
                      href="#"
                      :class="student.examMode ? 'xx' : ''"
                      @click.stop="toggleMode(student)"
                      >Exam</a
                    >
                  </v-chip>
                </template>
              </v-checkbox>
            </div>
            <div class="d-flex justify-end">
              <v-btn text rounded class="mr-2" @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn text rounded color="primary" @click="step++"> Next </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card class="rounded-xl pa-4" color="#fbfcff">
          <v-card-text>
            <p class="text-h5 mb-0">Create assignment</p>
            <p class="text-subtitle-1">
              Name your assignment and set start/due dates.
            </p>
            <v-form ref="form" class="mt-6">
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
                      <font-awesome-icon
                        slot="append"
                        icon="fa-light fa-calendar"
                        class="fa-lg"
                      />
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
                      <font-awesome-icon
                        slot="append"
                        icon="fa-light fa-calendar"
                        class="fa-lg"
                      />
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
                  <v-chip @click="setStart(0)"> Today </v-chip>
                  <v-chip @click="setStart(7)"> 1 Week </v-chip>
                  <v-chip @click="setStart(14)"> 2 Weeks </v-chip>
                </v-chip-group>
              </div>
              <div class="d-flex justify-end mt-4">
                <v-btn text rounded class="mr-2" @click="step--"> Back </v-btn>
                <v-btn
                  rounded
                  text
                  :loading="loading"
                  :disabled="loading"
                  color="primary"
                  @click="create()"
                >
                  Create
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      step: 1,
      dialog: false,
      loading: false,
      students: [],
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
      const url = new URL(
        '/.netlify/functions/getStudents',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.secret,
          groupId: this.group.id,
          namesOnly: true,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching students ${response.status}`)
      }
      this.students = await response.json()
      this.allSelected = true // Select all by default
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching students',
      })
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      secret: (state) => state.user.secret,
      selected: (state) => state.topics.selected, // Selected questions
    }),
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
    // Hide onboarding
    // Snackbar overlaps can overlap dialog
    dialog() {
      this.$store.commit('app/setOnboardStep', 0)
    },
  },
  mounted() {
    // If group has no students, skip step 1
    if (this.group.count === 0) {
      this.step = 2
    }
    this.$nuxt.$on('create-ass', () => {
      this.dialog = true
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('create-ass')
  },
  methods: {
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
    async toggleMode(student) {
      try {
        // Update local data first because of latency
        student.examMode = !student.examMode
        const url = new URL(
          '/.netlify/functions/updateExamMode',
          this.$config.baseURL
        )
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.secret,
            studentId: student.id,
            examMode: student.examMode,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error updating mode ${response.status}`)
        }
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error updating mode',
        })
        // Reverse change to local data
        student.examMode = !student.examMode
      }
    },
    async create() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$store.dispatch('user/createAssignment', {
            secret: this.secret,
            name: this.name,
            start: this.startDate,
            end: this.endDate,
            group: this.group.id,
            students: this.selectedStudents,
            questions: this.selected,
          })
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
  },
}
</script>

<style scoped>
/* Expand clickable area of 'Exam' */
a {
  color: #424242;
  display: inline-block;
  position: relative;
  padding: 2em;
  margin: -2em;
}

/* Change link color */
a.xx {
  color: #1d4715;
}

/* Arrange checkboxes into columns */
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

.chip-icon {
  height: 14px;
  width: 14px;
}
</style>
