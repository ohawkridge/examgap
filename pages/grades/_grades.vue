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
              <BoundariesDialog :boundaries="boundaries" :group-id="group.id" />
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
                    :color="toggle"
                    group
                    mandatory
                  >
                    <v-btn value="green"> Secure </v-btn>
                    <v-btn value="orange"> Middle </v-btn>
                    <v-btn value="red"> Vulnerable </v-btn>
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
                <v-data-table
                  :headers="data.headers"
                  :items="data.grades"
                  hide-default-footer
                  disable-pagination
                >
                  <template #body="{ items }">
                    <!-- Because we're using custom slots to render table body
                         we need to implement loading and no data ourselves -->
                    <!-- Loading -->
                    <tr class="v-data-table__progress">
                      <th :colspan="data.headers.length" class="px-0">
                        <v-progress-linear indeterminate></v-progress-linear>
                      </th>
                    </tr>
                    <!-- No data -->
                    <tbody>
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
                        <td
                          v-for="(field, j) in Object.keys(row)"
                          :key="j"
                          :class="
                            j > 0
                              ? color(
                                  row[data.headers[j].value],
                                  data.headers[j].max,
                                  row[data.headers[0].value].target[group.id]
                                )
                              : ''
                          "
                        >
                          <span>{{
                            j === 0 ? uname(row, j) : row[data.headers[j].value]
                          }}</span>
                          <v-icon v-if="j > 0">
                            {{
                              color(
                                row[data.headers[j].value],
                                data.headers[j].max,
                                row[data.headers[0].value].target[group.id],
                                true
                              )
                            }}
                          </v-icon>
                        </td>
                      </tr>
                    </tbody>
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
import BoundariesDialog from '@/components/teacher/BoundariesDialog'
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
    BoundariesDialog,
  },
  layout: 'app',
  async asyncData({ store, params }) {
    const url = new URL(
      '/.netlify/functions/getGrades',
      'http://localhost:8888'
    )
    let data = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        groupId: params.grades,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching grades ${data.status}`)
    }
    data = await data.json()
    return { data }
  },
  data() {
    return {
      toggle: 'orange',
      interval: false, // Scroll right
      csv: [],
    }
  },
  head() {
    return {
      title: `${this.group.name} grade book`,
    }
  },
  computed: {
    group() {
      return this.$store.getters['groups/groupById'](this.$route.params.grades)
    },
    boundaries() {
      if (Object.entries(this.group).length > 0) {
        return this.group.course.boundaries
      } else {
        return {}
      }
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
    uname(row, j) {
      const x = row[this.data.headers[0].value].target[this.group.id]
      const t = x === undefined ? `-` : x
      return `${row[this.data.headers[j].value].username} (${t})`
    },
    // Start scroll right https://jsfiddle.net/Herteby/x53494ef/
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
    // TODO Fix this ugly SHIT !!
    // And check color coding plan

    // Ugly code to RAG mark and icon and set icon type
    // If ico is true, this function returns the icon type
    color(n, max, target, ico = false) {
      // if (this.$fetchState.pending || !this.boundaries) {
      return ''
      // }
      // return ''
      // const z = n / max
      // switch (this.toggle) {
      //   case 'red':
      //     // Use default RAG or student's target?
      //     if (target === '-') {
      //       if (z <= this.boundaries.rag[0])
      //         return ico
      //           ? this.$icons.mdiMenuDown
      //           : 'red--text text--darken-2 font-weight-black'
      //     } else if (z < this.boundaries.actual[target] - 0.1)
      //       return ico
      //         ? this.$icons.mdiMenuDown
      //         : 'red--text text--darken-2 font-weight-black'
      //     break
      //   case 'green':
      //     if (target === '-') {
      //       if (z >= this.boundaries.rag[1])
      //         return ico
      //           ? this.$icons.mdiMenuUp
      //           : 'green--text text--darken-2 font-weight-black'
      //     } else if (z >= this.boundaries.actual[target])
      //       return ico
      //         ? this.$icons.mdiMenuUp
      //         : 'green--text text--darken-2 font-weight-black'
      //     break
      //   case 'orange':
      //     if (target === '-') {
      //       if (z > this.boundaries.rag[0] && z < this.boundaries.rag[1])
      //         return ico
      //           ? this.$icons.mdiMenuSwap
      //           : 'orange--text text--darken-3 font-weight-black'
      //     } else
      //       if (
      //         z >= this.boundaries.actual[target] - 0.1 &&
      //         z < this.boundaries.actual[target]
      //       )
      //         return ico
      //           ? this.$icons.mdiMenuSwap
      //           : 'orange--text text--darken-3 font-weight-black'
      //     }
      // }
    },
    exportTableToCSV() {
      for (const obj of this.data.headers) {
        this.csv += obj.text + ','
      }
      this.csv += '\n'
      for (const obj of this.data.grades) {
        this.csv += obj.name + ',' // Username
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
  font-size: 1.2rem !important;
}

/* use css to colour code icons */
td.red--text span.v-icon.notranslate.theme--light {
  color: #d32f2f !important;
}

td.orange--text span.v-icon.notranslate.theme--light {
  color: #ef6c00 !important;
}

td.green--text span.v-icon.notranslate.theme--light {
  color: #388e3c !important;
}

/* replicate header style */
.mob-th {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
