<template>
  <v-container>
    <v-row class="justify-center">
      <v-col
        cols="12"
        class="flex-xs-column d-sm-flex justify-space-between align-center"
      >
        <v-menu offset-y open-on-hover>
          <template #activator="{ on }">
            <v-btn
              class="mr-2 mb-2 mb-sm-0 mr-2"
              elevation="0"
              :block="$vuetify.breakpoint.name === 'xs'"
              rounded
              color="#c1e8ff"
              v-on="on"
            >
              Actions
              <font-awesome-icon icon="fa-light fa-angle-down" class="ml-2" />
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              :disabled="selected.length === 0"
              @click="showReset('')"
            >
              <v-list-item-title>
                Reset password{{ selected.length | pluralize }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$nuxt.$emit('open-add')">
              <v-list-item-title>Add students</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="selected.length === 0"
              @click="$nuxt.$emit('open-remove')"
            >
              <v-list-item-title>
                Remove student{{ selected.length | pluralize }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="selected.length === 0"
              @click="$nuxt.$emit('open-copy')"
            >
              <v-list-item-title>
                Copy student{{ selected.length | pluralize }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$nuxt.$emit('open-copy')">
              <v-list-item-title> Print logins </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- <v-btn
          elevation="0"
          rounded
          :block="$vuetify.breakpoint.name === 'xs'"
          class="mb-2 mb-sm-0 mr-2"
          @click="$nuxt.$emit('show-invite')"
        >
          Invite Students
        </v-btn> -->
        <!-- <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              :to="`/logins/${group.id}`"
              class="mr-2 mb-2 mb-sm-0"
              :class="xsBtns"
              elevation="0"
              rounded
              :block="$vuetify.breakpoint.name === 'xs'"
              v-on="on"
            >
              Logins
            </v-btn>
          </template>
          <span>Print logins</span>
        </v-tooltip> -->
        <div>
          <span class="tertiary--text text-subtitle-2 font-weight-bold">
            {{ students.length }} Student{{ students.length | pluralize }}
          </span>
          <v-btn
            class="ml-3"
            rounded
            text
            color="primary"
            :block="$vuetify.breakpoint.name === 'xs'"
            @click="exportTableToCSV()"
          >
            <font-awesome-icon
              icon="fa-light fa-arrow-down-to-bracket"
              class="mr-2"
            />
            Download
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="students"
          checkbox-color="primary"
          item-key="id"
          hide-default-footer
          style="border: 1px solid #d2d2d2"
          disable-pagination
          show-select
          :loading="$fetchState.pending"
          loading-text="Loading students..."
        >
          <template #[`item.password`]="props">
            <v-btn
              rounded
              outlined
              small
              color="primary"
              @click="showReset(props.item.id)"
            >
              Reset
            </v-btn>
          </template>
          <template #no-data>
            <!-- Empty state -->
            <div style="height: 60vh" class="mt-10">
              <v-img
                src="/no-student.svg"
                contain
                height="180"
                width="180"
                alt="Mortar board illustration"
                class="mx-auto"
              />
              <p class="text-body-1 black--text mt-4">No students yet</p>
              <v-btn
                elevation="0"
                rounded
                outlined
                color="primary"
                :block="$vuetify.breakpoint.name === 'xs'"
                class="mb-2 mb-sm-0 mr-2"
                @click="$nuxt.$emit('show-invite')"
              >
                Invite Students
              </v-btn>
            </div>
          </template>
          <template #[`item.target`]="props">
            <v-edit-dialog>
              <!-- groupId is the key into target object -->
              <!-- Different targets for each group -->
              {{ props.item.target[`${group.id}`] }}
              <template #input>
                <div class="mt-4 text-h6">Target</div>
                <v-text-field
                  :value="props.item.target[`${group.id}`]"
                  :rules="targetRules"
                  single-line
                  label="Target"
                  placeholder="5"
                  class="mb-4"
                  @keyup.enter="save(props.item.id, $event.target.value)"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- Reset Pw xx -->
    <v-dialog v-model="dialog" max-width="440">
      <v-card class="modal">
        <v-card-title class="d-flex justify-center">
          Reset Password
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="password"
            :rules="rules"
            label="New password*"
            outlined
            autofocus
          ></v-text-field>
          <small>*Indicates required field</small>
          <div class="d-flex justify-end">
            <v-btn text rounded @click="dialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              elevation="0"
              :loading="loading"
              :disabled="loading"
              rounded
              class="ml-2"
              @click="reset()"
            >
              Reset password
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <the-add-students-dialog />
    <the-remove-dialog :selected="selected" />
    <the-copy-student-dialog :selected="selected" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheAddStudentsDialog from '@/components/teacher/TheAddStudentsDialog'
import TheRemoveDialog from '@/components/teacher/TheRemoveDialog'
import TheCopyStudentDialog from '@/components/teacher/TheCopyStudentDialog'

export default {
  name: 'TheStudentsTable',
  components: {
    TheAddStudentsDialog,
    TheRemoveDialog,
    TheCopyStudentDialog,
  },
  data() {
    return {
      selected: [],
      idToReset: '',
      targetRules: [(v) => v.length === 1 || 'Max. one character'],
      rules: [(v) => !!v || 'Password is required'],
      headers: [
        {
          text: 'Username',
          align: 'start',
          value: 'username',
        },
        {
          text: 'Password',
          align: 'center',
          value: 'password',
        },
        {
          text: 'Questions Assigned',
          align: 'center',
          value: 'data.assignment',
        },
        {
          text: 'Questions Completed',
          align: 'center',
          value: 'data.completed',
        },
        {
          text: 'Independent Questions',
          align: 'center',
          value: 'data.revision',
        },
        {
          text: 'Study Duration',
          align: 'center',
          value: 'data.time.formatted',
        },
        {
          text: 'Average (%)',
          align: 'center',
          value: 'data.average',
        },
        {
          text: 'Target',
          align: 'center',
          value: 'target',
        },
      ],
      csv: '',
      dialog: false,
      loading: false,
      password: '',
    }
  },
  async fetch() {
    try {
      await this.$store.dispatch('group/getStudents')
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
      students: (state) => state.group.students,
    }),
    // xsBtns() {
    //   return this.$vuetify.breakpoint.name === 'xs' ? 'mt-2' : ''
    // },
  },
  methods: {
    // Show password reset dialog (in table btn click)
    // Save id of student clicked
    showReset(id) {
      this.idToReset = id
      this.dialog = true
    },
    async save(studentId, target) {
      // For iMedia allow 2 characters
      // For everyone else, take first character only
      const len = this.group.course.id === '263317987221570048' ? 2 : 1
      try {
        await this.$store.dispatch('group/saveTarget', {
          target: target.substring(0, len),
          groupId: this.group.id,
          studentId,
        })
        this.$snack.showMessage({
          type: 'success',
          msg: 'Target saved',
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving target',
        })
      }
    },
    async reset() {
      try {
        const url = new URL(
          '/.netlify/functions/resetStudentPass',
          this.$config.baseURL
        )
        // Reset single student or bulk selection?
        // Transform 'selected' array of objects → array of ids
        const students =
          this.idToReset === ''
            ? this.selected.map((s) => s.id)
            : [this.idToReset]
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            students,
            password: this.password,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error resetting password ${response.status}`)
        }
        this.$snack.showMessage({
          type: 'success',
          msg: `${
            this.selected.length === 1 || this.idToReset !== ''
              ? 'Password'
              : 'Passwords'
          } reset`,
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error resetting password',
        })
      } finally {
        this.selected = []
        this.idToReset = ''
        this.password = ''
        this.dialog = false
        this.loading = false
      }
    },
    exportTableToCSV() {
      for (const obj of this.headers) {
        this.csv += obj.text + ','
      }
      this.csv += '\n'
      for (const obj of this.students) {
        this.csv += obj.username + ','
        for (const key in obj.data) {
          this.csv += obj.data[key] + ','
        }
        this.csv += obj.target[this.group.id]
        this.csv += '\n'
      }
      this.downloadCSV()
    },
    // https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/
    downloadCSV() {
      const csvFile = new Blob([this.csv], { type: 'text/csv' })
      const downloadLink = document.createElement('a')
      downloadLink.download = this.group.name.replace(/[/\\?%*:|"<>]/g, '-')
      downloadLink.href = window.URL.createObjectURL(csvFile)
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click()
    },
  },
}
</script>
