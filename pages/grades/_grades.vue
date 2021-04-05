<template>
  <div>
    <GroupHeader v-if="group && Object.keys(group).length > 0" :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <v-row>
          <v-col>
            <GroupNav
              v-if="group && Object.keys(group).length > 0"
              :group="group"
            />
          </v-col>
          <v-col class="d-none d-sm-flex">
            <v-card class="pa-3 flex-grow-1">
              <v-simple-table dense>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left text-center">Grade</th>
                      <th class="text-left text-center">
                        <v-tooltip bottom>
                          <template #activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">Boundary (%)</span>
                          </template>
                          <span>Highest boundary across series</span>
                        </v-tooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="group.course.rag">
                    <tr v-for="(row, i) in group.course.rag" :key="i">
                      <td class="text-center">{{ row[0] }}</td>
                      <td class="text-center">
                        {{ Math.round(row[1] * 100, 0) }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-n6 mt-sm-0">
          <v-card-title class="d-flex justify-space-between">
            Grade book
            <div class="d-flex">
              <v-btn
                color="primary"
                elevation="0"
                outlined
                class="ml-2"
                @click="exportTableToCSV()"
              >
                <v-icon left>{{ $icons.mdiDownloadOutline }}</v-icon>
                Csv
              </v-btn>
              <v-btn
                class="d-none d-sm-flex ml-2"
                color="primary"
                outlined
                @mouseover="scroll"
                @mouseleave="stop"
                @mouseup="stop"
              >
                Scroll
                <v-icon right>
                  {{ $icons.mdiArrowRight }}
                </v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="data.headers"
                  :items="data.data"
                  :loading="$fetchState.pending"
                  loading-text="Loading grades..."
                  hide-default-footer
                  disable-pagination
                  sort-by="username"
                >
                  <template v-for="(obj, i) in assIds" #[gk(obj)]="{ item }">
                    <span v-if="item[obj] === 'N/A'" :key="i">N/A</span>
                    <v-chip
                      v-else
                      :key="i"
                      class="font-weight-black"
                      :color="
                        ragX(item[obj], data.headers[i + 2].max, item.target)
                      "
                    >
                      {{ item[obj] }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-center justify-md-start">
                <v-chip color="green" class="mr-2">On target</v-chip>
                <v-chip color="orange" class="mr-2">Within 10%</v-chip>
                <v-chip color="red">&gt;10% below</v-chip>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex">
                <v-alert
                  :icon="$icons.mdiInformationOutline"
                  border="left"
                  dense
                  type="info"
                  text
                >
                  To enable colour-coding, enter targets on the
                  <nuxt-link :to="`/students/${group ? group.id : ''}`">
                    Students</nuxt-link
                  >
                  screen.
                </v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import {
  mdiArrowRight,
  mdiDownloadOutline,
  mdiInformationOutline,
} from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
  },
  beforeRouteLeave(to, from, next) {
    this.stop() // Stop scrolling
    next()
  },
  layout: 'app',
  data() {
    return {
      data: [],
      interval: false, // Scroll right
      csv: [],
    }
  },
  async fetch() {
    const url = new URL('/.netlify/functions/getGrades', this.$config.baseURL)
    let data = await fetch(url, {
      body: JSON.stringify({
        secret: this.$store.state.user.secret,
        groupId: this.$route.params.grades,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching grades ${data.status}`)
    }
    data = await data.json()
    // console.log(JSON.stringify(data, null, '\t'))
    this.data = data
  },
  head() {
    return {
      title: this.group ? `${this.group.name} grade book` : ``,
    }
  },
  computed: {
    ...mapGetters({ group: 'groups/activeGroup' }),
    // Convert 2d array from db: [["A*", 0.90], ["A", 0.82], ..]]
    // into an object so we can look up target grades
    rag() {
      const out = {}
      for (const arr of this.group.course.rag) {
        out[arr[0]] = arr[1]
      }
      return out
    },
    // Create an array containing just assignment IDs
    // These IDs are used in dynamic slot names
    assIds() {
      if (this.$fetchState.pending) return []
      return this.data.headers.map((o) => o.value).slice(2)
    },
  },
  created() {
    this.$icons = {
      mdiArrowRight,
      mdiDownloadOutline,
      mdiInformationOutline,
    }
  },
  methods: {
    // Helper function due to dynamic argument expression constraints
    // https://vuejs.org/v2/guide/syntax.html#Dynamic-Argument-Expression-Constraints
    gk(val) {
      return `item.${val}`
    },
    createAssignment() {
      // Remember group when creating assignments
      this.$store.commit('assignments/setGroup', this.group.id)
      // Clear any questions selected for a previous group
      this.$store.commit('assignments/clearSelectedQuestions')
      this.$router.push(`/course/${this.group.course.id}`)
    },
    // Scroll right https://jsfiddle.net/Herteby/x53494ef/
    scroll() {
      if (!this.interval) {
        this.interval = setInterval(
          () =>
            (document.getElementsByClassName(
              'v-data-table__wrapper'
            )[0].scrollLeft += 8),
          30
        )
      }
    },
    // Stop scroll
    stop() {
      clearInterval(this.interval)
      this.interval = false
    },
    ragX(mark, assMax, t) {
      // console.log(`Got ${mark} out of ${assMax}. Target ${this.rag[t]}`)
      // Can't rag if target not set or not found in lookup table
      if (t === '-' || !(t in this.rag)) return ''
      return mark / assMax >= this.rag[t]
        ? 'green'
        : mark / assMax < this.rag[t] - 0.1
        ? 'red'
        : 'orange'
    },
    exportTableToCSV() {
      for (const obj of this.data.headers) {
        this.csv += obj.text + ','
      }
      this.csv += '\n'
      for (const obj of this.data.data) {
        this.csv += obj.username + ',' // Username
        for (let i = 1; i < Object.keys(this.data.headers).length; i++) {
          this.csv += obj[this.data.headers[i].value] + ','
        }
        this.csv += '\n'
      }
      this.downloadCSV()
    },
    downloadCSV() {
      const csvFile = new Blob([this.csv], { type: 'text/csv' })
      const downloadLink = document.createElement('a')
      downloadLink.download =
        this.group.name.replace(/[/\\?%*:|"<>]/g, '-') + '-gradebook'
      downloadLink.href = window.URL.createObjectURL(csvFile)
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click()
    },
  },
}
</script>

<style scoped>
/* mobile row style */
@media only screen and (max-width: 600px) {
  td {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  /* only show divider between students */
  /* not between individual assignments */
  td:not(:last-child) {
    border-bottom: 0 !important;
  }
}

/* center all cells except username */
td:not(:first-child) {
  text-align: center;
}
</style>
