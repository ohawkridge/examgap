<template>
  <div>
    <v-select
      v-model="selectedCourse"
      :loading="$fetchState.pending"
      :items="courses"
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
    <v-checkbox v-model="showAll" label="Show all courses" hide-details>
    </v-checkbox>
  </div>
</template>

<script>
export default {
  name: 'TheCourseSelect',
  // Passed if an existing course is selected
  props: {
    courseId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      courses: [],
      selectedCourse: this.courseId, // Copy to avoid mutating prop
      courseRules: [(v) => !!v || 'Course is required'],
      showAll: false,
    }
  },
  async fetch() {
    try {
      const url = new URL(
        '/.netlify/functions/getCourses',
        this.$config.baseURL
      )
      let response = await fetch(url, {
        body: JSON.stringify({
          secret: this.$store.state.user.secret,
          showAll: this.showAll,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching courses ${response.status}`)
      }
      response = await response.json()
      this.courses = response
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching courses',
      })
    }
  },
  watch: {
    showAll() {
      this.$fetch()
    },
  },
  methods: {
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
