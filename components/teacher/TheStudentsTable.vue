<template>
  <div>
    <div class="d-flex justify-space-between align-center pa-4">
      <v-chip label outlined small> {{ students.length }} Students </v-chip>
      <div>
        <v-menu offset-y open-on-hover>
          <template #activator="{ on }">
            <v-btn
              class="mr-2"
              elevation="0"
              :block="$vuetify.breakpoint.name === 'xs'"
              text
              rounded
              v-on="on"
              >Students<v-icon right>{{ $icons.mdiChevronDown }}</v-icon>
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
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              nuxt
              :to="`/logins/${group.id}`"
              class="mr-2"
              :class="xsBtns"
              elevation="0"
              text
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
              class="mr-2"
              :class="xsBtns"
              :block="$vuetify.breakpoint.name === 'xs'"
              text
              rounded
              @click="exportTableToCSV()"
              v-on="on"
            >
              Csv
              <v-icon right>{{ $icons.mdiDownloadOutline }}</v-icon>
            </v-btn>
          </template>
          <span>Download csv</span>
        </v-tooltip>
        <v-btn
          elevation="0"
          :block="$vuetify.breakpoint.name === 'xs'"
          :class="xsBtns"
          text
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
      show-select
      disable-pagination
      :loading="$fetchState.pending"
      loading-text="Loading students..."
    >
      <template #no-data>
        <!-- Empty state -->
        <div class="pa-3">
          <v-img
            src="/no-student.svg"
            contain
            :max-width="$vuetify.breakpoint.name === 'xs' ? '50%' : '20%'"
            alt="Graduation gap illustration"
            class="mx-auto"
          />
          <p class="text-center mt-2 black--text">No students yet.</p>
          <div class="d-flex justify-center">
            <v-btn
              elevation="0"
              rounded
              color="primary"
              @click="$nuxt.$emit('open-invite')"
            >
              Invite students
            </v-btn>
          </div>
        </div>
      </template>
      <template #[`item.target`]="props">
        <v-edit-dialog>
          <!-- groupId is the key into target object -->
          <!-- Different targets for each group -->
          {{ props.item.target[`${group.id}`] }}
          <template #input>
            <v-text-field
              :value="props.item.target[`${group.id}`]"
              :rules="targetRules"
              placeholder="E.g., 7"
              :loading="loading"
              label="Set target"
              @keyup.enter="save(props.item.id, $event.target.value)"
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
    <!-- Action components -->
    <the-add-students-dialog :group-id="group.id" />
    <the-remove-dialog :selected="selected" :group-id="group.id" />
    <the-copy-student-dialog :selected="selected" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiChevronDown,
  mdiDownloadOutline,
  mdiAccountGroupOutline,
  mdiTextBoxOutline,
  mdiRefresh,
} from '@mdi/js'
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
          text: 'Assignment Questions',
          align: 'center',
          value: 'data.assignment',
        },
        { text: 'Revision Questions', align: 'center', value: 'data.revision' },
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
      loading: false,
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
  created() {
    this.$icons = {
      mdiChevronDown,
      mdiDownloadOutline,
      mdiAccountGroupOutline,
      mdiTextBoxOutline,
      mdiRefresh,
    }
  },
  methods: {
    async save(studentId, target) {
      // For iMedia allow 2 characters, for everyone else just
      // take the first character even if the input is longer
      const len = this.group.course.id === '263317987221570048' ? 2 : 1
      target = target.substring(0, len)
      try {
        this.loading = true
        await this.$store.dispatch('students/saveTarget', {
          target,
          groupId: this.group.id,
          studentId,
        })
        this.$snack.showMessage({
          msg: 'Target saved',
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error saving target',
        })
      } finally {
        this.loading = false
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
