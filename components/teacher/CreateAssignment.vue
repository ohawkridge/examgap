<template>
  <div>
    <v-dialog v-model="dialog" width="700" transition="scroll-x-transition">
      <v-card class="pa-md-3">
        <v-card-title> Create assignment </v-card-title>
        <v-card-subtitle> {{ subtitle }} </v-card-subtitle>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-row v-if="students.length > 0">
                <v-col cols="12" class="d-flex">
                  <v-checkbox v-model="allSelected" class="mt-0" hide-details>
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
                  md="6"
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
                        <template #activator="{ on }">
                          <a
                            :class="`on ${student.examMode ? '' : 'off'}`"
                            href="#"
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
                    dense
                    :icon="$icons.mdiInformationOutline"
                  >
                    Turn off exam mode to show keywords and a minimum word count
                    when answering questions.
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="2">
            <v-card-text>
              <v-form ref="form">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="name"
                      label="Assignment name*"
                      required
                      :rules="nameRules"
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
                          :append-icon="$icons.mdiCalendarOutline"
                          placeholder="YYYY-MM-DD"
                          :rules="startDateRules"
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
                          :append-icon="$icons.mdiCalendarOutline"
                          placeholder="YYYY-MM-DD"
                          :rules="endDateRules"
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
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-space-between align-center"
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
              </v-form>
            </v-card-text>
          </v-window-item>
        </v-window>
        <v-card-actions>
          <v-btn v-if="step === 1" text @click="dialog = false"> Cancel </v-btn>
          <v-btn v-if="step === 2" text @click="step--"> Back </v-btn>
          <v-spacer />
          <v-btn
            v-if="step === 1"
            elevation="0"
            color="primary"
            @click="step++"
          >
            Next
          </v-btn>
          <v-btn
            v-if="step === 2"
            elevation="0"
            :loading="loading"
            :disabled="loading"
            color="primary"
            @click="create()"
          >
            Create assignment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiCalendarOutline,
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
      step: 1,
      dialog: false,
      valid: true,
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
          'End date cannot be in the past',
        (d) => d >= this.startDate || 'End date must be after start date',
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
    ...mapState({ secret: (state) => state.user.secret }),
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
    subtitle() {
      return this.step === 1
        ? 'Select students for this assignment.'
        : 'Name the assignment and set start/end dates.'
    },
  },
  created() {
    this.$icons = {
      mdiCalendarOutline,
      mdiInformationOutline,
      mdiArrowRight,
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
    if (this.group.num_students === 0) {
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
    next() {
      this.dialog = false
      this.dialog2 = true
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
          const url = new URL(
            '/.netlify/functions/createAssignment',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.secret,
              name: this.name,
              start: this.startDate,
              end: this.endDate,
              group: this.group.id,
              students: this.selectedStudents,
              questions: this.questions,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error creating assignment ${response.status}`)
          }
          response = await response.json()
          // Clear any previously selected questions
          this.$store.commit('topics/clearSelectedQuestions')
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
</style>
