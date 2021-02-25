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
    @input="updateCourse"
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
</template>

<script>
export default {
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
        'http://localhost:8888'
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.$store.state.user.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching user data ${response.status}`)
      }
      this.couses = await response.json()
    } catch (e) {
      console.error(e)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching courses',
      })
    }
  },
  methods: {
    updateCourse() {
      this.$emit('clicked', this.selectedCourse)
    },
  },
}
</script>
