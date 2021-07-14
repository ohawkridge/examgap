<template>
  <div>
    <group-header />
    <divider-row />
    <v-row>
      <group-nav />
      <v-col cols="12" md="9">
        <v-card class="mt-n6 mt-sm-0">
          <v-card-title class="d-flex justify-space-between">
            <div>
              <v-icon class="mr-2">
                {{ $icons.mdiAccountGroupOutline }}
              </v-icon>
              Student{{ students.length | pluralize }} ({{ students.length }})
            </div>
            <div>
              <v-menu offset-y open-on-hover>
                <template #activator="{ on, attrs }">
                  <v-btn class="mr-2" elevation="0" v-bind="attrs" v-on="on"
                    >Students<v-icon right>{{
                      $icons.mdiChevronDown
                    }}</v-icon></v-btn
                  >
                </template>
                <v-list>
                  <v-list-item
                    :disabled="selected.length === 0"
                    @click="reset()"
                  >
                    <v-list-item-title
                      >Reset password{{
                        selected.length !== 1 ? 's' : ''
                      }}</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item @click="$nuxt.$emit('open-add')">
                    <v-list-item-title>Add students</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :disabled="selected.length === 0"
                    @click="$nuxt.$emit('open-copy')"
                  >
                    <v-list-item-title
                      >Copy student{{
                        selected.length !== 1 ? 's' : ''
                      }}</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    :disabled="selected.length === 0"
                    @click="$nuxt.$emit('open-remove')"
                  >
                    <v-list-item-title
                      >Remove student{{
                        selected.length !== 1 ? 's' : ''
                      }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
              <add-students :group-id="group.id" />
              <the-copy-student-dialog :selected="selected" />
              <remove-students :selected="selected" :group-id="group.id" />
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    nuxt
                    :to="`/students/logins/${group.id}`"
                    class="mr-2"
                    elevation="0"
                    v-on="on"
                  >
                    Logins
                  </v-btn>
                </template>
                <span>Print logins</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn elevation="0" @click="exportTableToCSV()" v-on="on">
                    Csv
                    <v-icon right>{{ $icons.mdiDownloadOutline }}</v-icon>
                  </v-btn>
                </template>
                <span>Download as csv</span>
              </v-tooltip>
            </div>
          </v-card-title>
          <v-container>
            <v-row>
              <v-col cols="12">
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
                  loading-text="Fetching student data..."
                >
                  <template #no-data>
                    <div class="mt-4">
                      <v-img
                        max-width="200"
                        src="/no-student.svg"
                        alt="Graduation gap illustration"
                        class="mx-auto"
                      />
                      <p class="text-body-2 mt-4" style="color: #000000de">
                        No students yet
                      </p>
                      <v-btn
                        color="primary"
                        elevation="0"
                        @click="$nuxt.$emit('open-invite')"
                      >
                        Invite students
                      </v-btn>
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
                          @keyup.enter="
                            save(props.item.id, $event.target.value)
                          "
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  mdiChevronDown,
  mdiDownloadOutline,
  mdiAccountGroupOutline,
} from '@mdi/js'
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import AddStudents from '@/components/teacher/AddStudents'
import RemoveStudents from '@/components/teacher/RemoveStudents'
import TheCopyStudentDialog from '@/components/teacher/TheCopyStudentDialog.vue'
import DividerRow from '~/components/common/DividerRow.vue'

export default {
  components: {
    GroupNav,
    GroupHeader,
    AddStudents,
    RemoveStudents,
    TheCopyStudentDialog,
    DividerRow,
  },
  layout: 'app',
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
    // Always re-fetch on page view
    try {
      await this.$store.dispatch('students/getStudents')
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching students',
      })
    }
  },
  head() {
    return {
      title: `${this.group.name} students`,
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    ...mapState({
      students: (state) => state.students.students,
    }),
  },
  created() {
    this.$icons = {
      mdiChevronDown,
      mdiDownloadOutline,
      mdiAccountGroupOutline,
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
