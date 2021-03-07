<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav :group-id="group.id" />
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-n8 mt-sm-0">
          <v-card-title class="d-flex justify-space-between">
            Grade book
            <div>
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
            </div>
          </v-card-title>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                class="d-flex justify-center justify-md-space-between align-center"
              >
                <div>
                  <v-btn-toggle
                    v-model="toggle"
                    color="primary"
                    group
                    mandatory
                  >
                    <v-btn value="green" class="rounded"> Secure </v-btn>
                    <v-btn value="yellow" class="rounded"> Middle </v-btn>
                    <v-btn value="red" class="rounded"> Vulnerable </v-btn>
                  </v-btn-toggle>
                </div>
                <v-btn
                  class="d-none d-sm-flex"
                  text
                  @mouseover="scroll"
                  @mouseleave="stop"
                  @mouseup="stop"
                >
                  Scroll right
                  <v-icon right>
                    {{ $icons.mdiArrowRight }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-skeleton-loader :loading="$fetchState.pending" type="table">
                  <v-data-table
                    :headers="data.headers"
                    :items="data.data"
                    hide-default-footer
                    disable-pagination
                    sort-by="username"
                  >
                    <template #body="{ items }">
                      <tbody>
                        <!-- No data -->
                        <tr
                          v-if="items.length === 0"
                          class="v-data-table__empty-wrapper"
                        >
                          <td :colspan="data.headers.length">
                            {{ `No data for ${group.name}` }}
                          </td>
                        </tr>
                        <!-- Iterate over rows -->
                        <!-- 'item' is one 'grades' object or one table row -->
                        <tr v-for="(row, i) in items" v-else :key="i">
                          <!-- Within a row iterate over cells -->
                          <td v-for="(field, j) in Object.keys(row)" :key="j">
                            <!-- Student can have more than one group, so target is an object -->
                            <span v-if="j === 0">
                              {{ row['username'] }}
                            </span>
                            <span v-else-if="j === 1">
                              {{ row['target'] }}
                            </span>
                            <!-- Use header value as key into data object -->
                            <div v-else>
                              <span v-if="row[data.headers[j].value] === 'n/a'"
                                >N/A</span
                              >
                              <v-chip
                                v-else
                                :color="
                                  rag(
                                    row[data.headers[j].value],
                                    data.headers[j].max,
                                    row['target']
                                  )
                                "
                                >{{ row[data.headers[j].value] }}</v-chip
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-skeleton-loader>
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
  mdiMenuUp,
  mdiMenuDown,
  mdiMenuSwap,
  mdiDownloadOutline,
} from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
  },
  layout: 'app',
  data() {
    return {
      data: [],
      toggle: 'yellow',
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
    boundaries() {
      return this.group.course.boundaries
    },
  },
  created() {
    this.$icons = {
      mdiArrowRight,
      mdiMenuDown,
      mdiMenuUp,
      mdiMenuSwap,
      mdiDownloadOutline,
    }
  },
  methods: {
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
    rag(n, max, target) {
      // Don't RAG username
      if (typeof n !== 'number') return ''
      const z = n / max
      if (target === '-') {
        // Target not set ∴ RAG with percentages
        if (this.toggle === 'red') {
          if (z <= this.boundaries.rag[0]) {
            return 'red'
          }
        }
        if (this.toggle === 'yellow') {
          if (z > this.boundaries.rag[0] && z < this.boundaries.rag[1]) {
            return 'orange'
          }
        }
        if (this.toggle === 'green') {
          if (z >= this.boundaries.rag[1]) {
            return 'green'
          }
        }
      } else {
        // RAG against target grades
        if (this.toggle === 'red') {
          if (z < this.boundaries.actual[target] - 0.15) {
            return 'red'
          }
        }
        if (this.toggle === 'yellow') {
          if (
            z >= this.boundaries.actual[target] - 0.15 &&
            z < this.boundaries.actual[target]
          ) {
            return 'orange'
          }
        }
        if (this.toggle === 'green') {
          if (z >= this.boundaries.actual[target]) {
            return 'green'
          }
        }
      }
      return ''
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

/* bold active chip text */
span.v-chip.theme--light.red,
span.v-chip.theme--light.orange,
span.v-chip.theme--light.green {
  font-weight: 900;
}
</style>
