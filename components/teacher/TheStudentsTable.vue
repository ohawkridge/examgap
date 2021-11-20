<template>
  <v-container>
    <div class="flex-xs-column d-sm-flex justify-space-between align-center">
      <v-menu offset-y open-on-hover>
        <template #activator="{ on }">
          <v-btn
            class="mr-2 mb-2 mb-sm-0"
            elevation="0"
            :block="$vuetify.breakpoint.name === 'xs'"
            rounded
            v-on="on"
          >
            Actions
            <font-awesome-icon icon="fa-light fa-angle-down" class="ml-2" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item :disabled="selected.length === 0" @click="reset()">
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
        </v-list>
      </v-menu>
      <div>
        <v-btn
          elevation="0"
          rounded
          :block="$vuetify.breakpoint.name === 'xs'"
          class="mb-2 mb-sm-0 mr-2"
          @click="$nuxt.$emit('show-invite')"
        >
          Invite Students
        </v-btn>
        <v-tooltip bottom>
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
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              elevation="0"
              class="mr-2 mb-2 mb-sm-0"
              :class="xsBtns"
              :block="$vuetify.breakpoint.name === 'xs'"
              rounded
              @click="exportTableToCSV()"
              v-on="on"
            >
              Csv
              <font-awesome-icon
                icon="fa-light fa-arrow-down-to-line"
                class="ml-2"
              />
            </v-btn>
          </template>
          <span>Download csv</span>
        </v-tooltip>
        <v-btn
          elevation="0"
          :block="$vuetify.breakpoint.name === 'xs'"
          :class="xsBtns"
          rounded
          @click="$fetch()"
        >
          Refresh
        </v-btn>
      </div>
    </div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="students"
      checkbox-color="primary"
      item-key="id"
      hide-default-footer
      disable-pagination
      show-select
      :loading="$fetchState.pending"
      loading-text="Loading students..."
    >
      <template #no-data>
        <!-- Empty state -->
        <div style="height: 60vh" class="mt-10">
          <v-img
            src="/no-student.svg"
            contain
            max-width="200"
            alt="Mortar board illustration"
            class="mx-auto"
          />
          <p class="text-h6 mt-8">No students yet</p>
          <p>
            Click 'INVITE STUDENTS', or Actions → Add students to get started.
          </p>
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
    <v-chip v-if="students.length > 0" label outlined small class="ma-4">
      {{ students.length }} Student{{ students.length | pluralize }}
    </v-chip>
    <!-- Action components -->
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
      targetRules: [(v) => v.length === 1 || 'Max. one character'],
      headers: [
        {
          text: 'Username',
          align: 'start',
          value: 'username',
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
    xsBtns() {
      return this.$vuetify.breakpoint.name === 'xs' ? 'mt-2' : ''
    },
  },
  methods: {
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
        const response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            students: this.selected,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error resetting passwords ${response.status}`)
        }
        this.$snack.showMessage({
          type: 'success',
          msg: `${
            this.selected.length === 1 ? 'Password' : 'Passwords'
          } reset to 'password'`,
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          msg: 'Error resetting passwords',
          type: 'error',
        })
      } finally {
        this.selected = []
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
