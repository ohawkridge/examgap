<template>
  <v-select
    v-model="selectedCourse"
    :loading="$fetchState.pending"
    :items="courses"
    item-text="name"
    item-value="id"
    :rules="courseRules"
    label="Select course*"
    outlined
    @input="$nuxt.$emit('select-course', selectedCourse)"
  >
    <!-- Custom selection appearance -->
    <template #selection="data">
      {{ data.item.name }} ({{ data.item.board }})
    </template>
    <!-- Display chips in list -->
    <template #item="data">
      {{ data.item.name }}
      <v-chip small outlined color="primary" class="ml-2">{{
        data.item.board
      }}</v-chip>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'CourseSelect',
  props: {
    course: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      courses: [],
      selectedCourse: this.course, // Copy to avoid mutating prop
      courseRules: [(v) => !!v || 'Course is required'],
    }
  },
  async fetch() {
    try {
      const url = new URL(
        '/.netlify/functions/getCourses',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.$store.state.user.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching courses ${response.status}`)
      }
      this.courses = await response.json()
    } catch (e) {
      console.error(e)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching courses',
      })
    }
  },
}
</script>
