<template>
  <v-dialog v-model="dialog" width="660">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          Select students
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">
          Choose name and due date
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card>
            <v-card-text>
              <v-checkbox v-model="allSelected" class="mt-0">
                <template #label>
                  <strong>Select all</strong>
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
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <a
                          class="ml-2"
                          :class="`on ${student.examMode ? '' : 'off'}`"
                          href="#"
                          v-on="on"
                          @click.stop="toggleMode(student)"
                          >EXAM</a
                        >
                      </template>
                      <span>Exam mode</span>
                    </v-tooltip>
                  </template>
                </v-checkbox>
              </div>
              <div class="d-flex justify-end">
                <v-btn text rounded class="mr-2" @click="dialog = false">
                  Cancel
                </v-btn>
                <v-btn elevation="0" rounded color="primary" @click="step++">
                  Next
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card>
            <v-card-text>
              <v-form ref="form">
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
                          icon="fa-light fa-calendar-days"
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
                          icon="fa-light fa-calendar-days"
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
                  <v-btn text rounded small class="mr-1" @click="setStart(0)">
                    Today
                  </v-btn>
                  <v-btn text rounded small class="mr-1" @click="setStart(7)">
                    1 week
                  </v-btn>
                  <v-btn text rounded small @click="setStart(14)">
                    2 weeks
                  </v-btn>
                </div>
                <div class="d-flex justify-end mt-4">
                  <v-btn text rounded class="mr-2" @click="step--">
                    Back
                  </v-btn>
                  <v-btn
                    elevation="0"
                    rounded
                    :loading="loading"
                    :disabled="loading"
                    color="primary"
                    @click="create()"
                  >
                    Create assignment
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
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
.on {
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

.off {
  opacity: 0.4;
}

.off:before {
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
</style>
