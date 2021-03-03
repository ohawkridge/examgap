<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav :group-id="group.id" />
      </v-col>
      <v-col cols="12" md="9">
        <v-card v-if="group.course" rounded="lg" class="mt-n8 mt-sm-0">
          <v-card-title class="d-flex justify-space-between">
            Student{{ students.length | pluralize }} ({{ students.length }})
            <div>
              <v-menu offset-y open-on-hover>
                <template #activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="primary"
                    class="mr-2"
                    elevation="0"
                    v-bind="attrs"
                    v-on="on"
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
                  <v-list-item @click="send('open-add')">
                    <v-list-item-title>Add students</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :disabled="selected.length === 0"
                    @click="send('open-copy')"
                  >
                    <v-list-item-title
                      >Copy student{{
                        selected.length !== 1 ? 's' : ''
                      }}</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    :disabled="selected.length === 0"
                    @click="send('open-remove')"
                  >
                    <v-list-item-title
                      >Remove student{{
                        selected.length !== 1 ? 's' : ''
                      }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
              <AddStudents :group-id="group.id" />
              <CopyStudents :selected="selected" />
              <RemoveStudents :selected="selected" :group-id="group.id" />
              <v-btn
                color="primary"
                nuxt
                :to="`/students/logins/${group.id}`"
                class="mr-2"
                elevation="0"
                outlined
              >
                Logins
              </v-btn>
              <v-btn
                outlined
                color="primary"
                elevation="0"
                @click="exportTableToCSV()"
              >
                <v-icon left>{{ $icons.mdiDownloadOutline }}</v-icon>
                Csv
              </v-btn>
            </div>
          </v-card-title>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  ref="table"
                  v-model="selected"
                  :headers="headers"
                  :items="students"
                  item-key="id"
                  hide-default-footer
                  show-select
                  disable-pagination
                  :loading="$fetchState.pending"
                  loading-text="Fetching student data..."
                >
                  <template #no-data>
                    <p class="text-body-1 font-weight-medium mt-4">
                      {{ `No students in ${group.name}` }}
                    </p>
                    <p>
                      <v-btn
                        color="primary"
                        elevation="0"
                        @click="send('open-add')"
                      >
                        <v-icon left>{{ $icons.mdiPlus }}</v-icon>
                        Add student(s)</v-btn
                      >
                    </p>
                  </template>
                  <template #[`item.target`]="props">
                    <v-edit-dialog
                      :return-value.sync="props.item.target[`${group.id}`]"
                      large
                      @save="save(props.item)"
                    >
                      <!-- groupId is the key into target object -->
                      {{ props.item.target[`${group.id}`] }}
                      <template #input>
                        <v-text-field
                          v-model="props.item.target[`${group.id}`]"
                          :rules="[max1char]"
                          label="Edit target"
                          single-line
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
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import AddStudents from '@/components/teacher/AddStudents'
import CopyStudents from '@/components/teacher/CopyStudents'
import RemoveStudents from '@/components/teacher/RemoveStudents'
import { mdiChevronDown, mdiDownloadOutline, mdiPlus } from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
    AddStudents,
    CopyStudents,
    RemoveStudents,
  },
  layout: 'app',
  data() {
    return {
      csv: '',
      students: [],
      selected: [],
      removeModal: false,
      max1char: (v) => v.length === 1 || 'Target must be one character',
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
          text: 'Average Score (%)',
          align: 'center',
          value: 'data.average',
        },
        {
          text: 'Target',
          align: 'center',
          value: 'target',
        },
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
          secret: this.$store.state.user.secret,
          groupId: this.group.id,
          namesOnly: false,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching student data ${response.status}`)
      }
      this.students = await response.json()
    } catch (e) {
      console.error(e)
    }
  },
  head() {
    return {
      title: this.group ? `${this.group.name} students` : 'Students',
    }
  },
  computed: {
    group() {
      return this.$store.getters['groups/groupById'](
        this.$route.params.students
      )
    },
  },
  mounted() {
    // Re-fetch data when students added
    this.$nuxt.$on('user-added', () => this.$fetch())
  },
  created() {
    this.$icons = {
      mdiChevronDown,
      mdiDownloadOutline,
      mdiPlus,
    }
  },
  methods: {
    // Save change to target grade
    // (row is the full v-data-table object)
    save(row) {
      console.log(`Save row`, row)
      // For iMedia allow 2 characters, for everyone else just
      // take the first character even if input is longer
      // row.target[`${this.group.id}`] = row.target[`${this.group.id}`].substring(
      //   0,
      //   this.group.course.id === '263317987221570048' ? 2 : 1
      // )
      // try {
      //   // TODO
      //   // await updateTarget(row)
      //   this.$snack.showMessage({
      //     type: 'success',
      //     msg: 'Success. Target saved',
      //   })
      // } catch (e) {
      //   console.error(e)
      //   this.$snack.showMessage({
      //     type: 'error',
      //     msg: 'Error saving target',
      //   })
      // }
    },
    // Send an event to open a dialog
    send(evtStr) {
      this.$nuxt.$emit(evtStr)
    },
    reset() {
      for (const student of this.selected) {
        // TODO
        // const res = await updatePass(student.id, 'pw')
        console.log(`Reset pw`, student)
        this.$snack.showMessage({
          type: 'success',
          msg: `Success. ${
            this.selected.length > 1 ? 'Passwords' : 'Password'
          } reset to 'pw'`,
        })
      }
      this.selected = []
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
