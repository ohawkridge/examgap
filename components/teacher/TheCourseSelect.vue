<template>
  <div>
    <v-select
      v-model="selectedCourse"
      :loading="$fetchState.pending"
      :items="filteredCourses"
      no-data-text="No courses available"
      item-text="name"
      item-value="id"
      :rules="courseRules"
      label="Select course*"
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
        <v-chip small outlined color="black" class="ml-2">{{
          data.item.board
        }}</v-chip>
      </template>
    </v-select>
    <v-checkbox
      v-model="showAll"
      label="Show developing courses"
      class="mt-0"
      hide-details
    >
    </v-checkbox>
  </div>
</template>

<script>
export default {
  name: 'TheCourseSelect',
  // Passed if an existing course has been selected
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
  computed: {
    filteredCourses() {
      if (!this.showAll) {
        return this.courses.filter((c) => !('name' in c) || c.active)
      }
      return this.courses
    },
  },
}
</script>
