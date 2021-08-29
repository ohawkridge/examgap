<template>
  <v-dialog v-model="dialog" width="700">
    <template #activator="{ on }">
      <v-btn
        text
        rounded
        class="mr-2"
        @click="$store.commit('topics/clearSelectedQuestions')"
      >
        Clear
      </v-btn>
      <v-btn
        color="primary"
        :disabled="selected.length == 0"
        elevation="0"
        rounded
        v-on="on"
      >
        <v-icon left>{{ $icons.mdiPlus }}</v-icon>
        Assign ({{ selected.length }})</v-btn
      >
    </template>
    <!-- Select students -->
    <v-card v-if="step === 1">
      <v-card-title> Create assignment </v-card-title>
      <v-card-subtitle> Select students for this assignment. </v-card-subtitle>
      <v-card-text>
        <div class="d-flex">
          <v-alert text type="info" dense :icon="$icons.mdiInformationOutline">
            In exam mode, keywords and minimum word count are hidden.
          </v-alert>
        </div>
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
                <span>Exam mode {{ student.examMode ? 'on' : 'off' }}</span>
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
    <!-- Name & date -->
    <v-card v-if="step === 2">
      <v-card-title> Create assignment </v-card-title>
      <v-card-subtitle>
        Name the assignment and set a due date.
      </v-card-subtitle>
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
                  :append-icon="$icons.mdiCalendarStart"
                  placeholder="YYYY-MM-DD"
                  :rules="startDateRules"
                  outlined
                  class="mr-2"
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
                  :append-icon="$icons.mdiCalendarEnd"
                  placeholder="YYYY-MM-DD"
                  :rules="endDateRules"
                  class="ml-2"
                  v-on="on"
                ></v-text-field>
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
            <v-chip outlined class="mr-1 ml-1" @click="setStart(0)">
              Today
            </v-chip>
            <v-chip outlined class="mr-1" @click="setStart(7)"> 1 week </v-chip>
            <v-chip outlined @click="setStart(14)"> 2 weeks </v-chip>
          </div>
          <div class="d-flex justify-end mt-4">
            <v-btn text rounded class="mr-2" @click="step--"> Back </v-btn>
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
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiCalendarStart,
  mdiInformationOutline,
  mdiPlus,
  mdiCalendarEnd,
} from '@mdi/js'

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
  created() {
    this.$icons = {
      mdiCalendarStart,
      mdiInformationOutline,
      mdiPlus,
      mdiCalendarEnd,
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('show-assign')
  },
  mounted() {
    this.$nuxt.$on('show-assign', () => {
      this.allSelected = true // Select all by default
      this.dialog = true
    })
    // If group has no students, skip step 1
    if (this.group.count === 0) {
      this.step = 2
    }
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
          this.$router.push(`/report/${this.group.assignments[0].id}`)
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
