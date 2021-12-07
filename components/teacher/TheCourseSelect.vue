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
    <v-checkbox v-model="showAll" hide-details
      ><template #label>
        Show all courses
        <v-menu offset-y open-on-hover>
          <template #activator="{ on }">
            <font-awesome-icon
              icon="fa-light fa-circle-info"
              class="ml-2 fa-lg"
              v-on="on"
            />
          </template>
          <v-card max-width="200">
            <v-card-text>
              'Stub' courses that don't have questions yet.
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </v-checkbox>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
      showAll: null,
    }
  },
  async fetch() {
    try {
      // N.B. fetch() occurs before mounted()
      // Get all courses by default and use
      // a store getter to filter results
      await this.$store.dispatch('group/getCourses')
      this.showAll = this.findCourseId()
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching courses',
      })
    }
  },
  computed: {
    ...mapGetters({ showCourses: 'group/showCourses' }),
    courses() {
      return this.showCourses(this.showAll)
    },
  },
  methods: {
    findCourseId() {
      // For CreateClassDialog.vue, coureId will be empty
      // (Don't show all courses by default)
      if (this.courseId === '') return false
      // Only show all courses if current course is not active
      const f = this.courses.find((o) => 'id' in o && o.id === this.courseId)
      return f === undefined
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
