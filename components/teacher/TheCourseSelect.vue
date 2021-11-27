<template>
  <div>
    <v-select
      v-model="selectedCourse"
      :loading="$fetchState.pending"
      :items="$store.state.group.courses"
      :rules="courseRules"
      label="Select course*"
      item-text="name"
      item-value="id"
      hide-details
      outlined
      @change="$nuxt.$emit('select-course', selectedCourse)"
    >
      <!-- Custom selection appearance -->
      <template #selection="data">
        {{ data.item.name }} ({{ data.item.board }})
      </template>
      <!-- Display chips in list -->
      <template #item="data">
        {{ data.item.name }}
        <v-chip dark small :color="color(data.item.board)" class="ml-2">{{
          data.item.board
        }}</v-chip>
      </template>
    </v-select>
    <v-checkbox v-model="showAll" label="Show all courses" hide-details />
  </div>
</template>

<script>
// N.B mapState not reactive for courses for some reason?

export default {
  name: 'TheCourseSelect',
  props: {
    courseId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedCourse: this.courseId, // Copy to avoid mutating prop
      courseRules: [(v) => !!v || 'Course is required'],
      showAll: false,
    }
  },
  async fetch() {
    try {
      // N.B. fetch() occurs before mounted()
      this.initShowAll()
      await this.$store.dispatch('group/getCourses', this.showAll)
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching courses',
      })
    }
  },
  methods: {
    // If the current course is not active on the site
    // yet default to show all courses in v-select
    initShowAll() {
      const active = [
        '262684008356250123',
        '263317250988048898',
        '300746340204282369',
        '300748140525388289',
      ]
      this.showAll = !active.includes(this.courseId)
    },
    color(board) {
      switch (board) {
        case 'AQA':
          return '#3d2c74'
        case 'OCR':
          return '#0e2a5e'
        case 'Pearson':
          return '#007fa3'
        case 'Eduqas':
          return '#f1561a'
        case 'Cambridge':
          return '#862b2d'
        default:
          return ''
      }
    },
  },
}
</script>
