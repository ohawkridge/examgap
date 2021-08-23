<template>
  <div>
    <div class="d-flex justify-end pa-4">
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn elevation="0" rounded @click="exportTableToCSV()" v-on="on">
            Csv
            <v-icon right>{{ $icons.mdiDownloadOutline }}</v-icon>
          </v-btn>
        </template>
        <span>Download csv</span>
      </v-tooltip>
      <v-btn
        class="d-none d-sm-flex ml-2"
        elevation="0"
        rounded
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
    <v-data-table
      :headers="data.headers"
      :items="data.data"
      :loading="$fetchState.pending"
      loading-text="Loading grades..."
      no-data-text="No data yet"
      hide-default-footer
      disable-pagination
      sort-by="username"
    >
      <template v-for="(obj, i) in assIds" #[gk(obj)]="{ item }">
        <span v-if="item[obj] === 'N/A'" :key="i">N/A</span>
        <v-chip
          v-else
          :key="i"
          :color="ragX(item[obj], data.headers[i + 2].max, item.target)"
        >
          {{ item[obj] }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  mdiArrowRight,
  mdiDownloadOutline,
  mdiInformationOutline,
  mdiChartBoxOutline,
} from '@mdi/js'

export default {
  components: {},
  beforeRouteLeave(to, from, next) {
    this.stop() // Stop scrolling
    next()
  },
  data() {
    return {
      data: [],
      interval: false, // Scroll right
      csv: [],
    }
  },
  async fetch() {
    try {
      await this.$store.dispatch('group/getGrades')
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching grades',
      })
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
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
      mdiChartBoxOutline,
    }
  },
  methods: {
    // Helper function due to dynamic argument expression constraints
    // https://vuejs.org/v2/guide/syntax.html#Dynamic-Argument-Expression-Constraints
    gk(val) {
      return `item.${val}`
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
        this.group.name.replace(/[/\\?%*:|"<>]/g, '-') + '-grades'
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
