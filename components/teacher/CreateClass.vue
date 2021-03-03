<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Create class </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="groupName"
            :rules="nameRules"
            label="Class name*"
            outlined
            autofocus
          ></v-text-field>
          <CourseSelect />
        </v-form>
        <small>*Indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          elevation="0"
          :loading="loading"
          :disabled="loading"
          @click="create()"
        >
          Create class
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CourseSelect from '@/components/teacher/CourseSelect'

export default {
  name: 'CreateClass',
  components: {
    CourseSelect,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      groupName: '',
      nameRules: [(v) => !!v || 'Name is required'],
      course: '',
    }
  },
  mounted() {
    this.$nuxt.$on('show-create', () => {
      this.dialog = true
    })
    this.$nuxt.$on('select-course', (courseId) => {
      this.updateCourse(courseId)
    })
  },
  methods: {
    updateCourse(courseId) {
      this.course = courseId
    },
    async create() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const url = new URL(
            '/.netlify/functions/createGroup',
            this.$config.baseURL
          )
          const response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              groupName: this.groupName,
              courseId: this.course,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error fetching user data ${response.status}`)
          }
          const data = await response.json()
          this.$store.commit('groups/addGroup', data)
          this.$snack.showMessage({
            type: 'success',
            msg: `Class created`,
          })
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: `Error creating class`,
          })
        } finally {
          // Close dialog; clear form
          this.dialog = false
          this.loading = false
          this.$refs.form.reset()
        }
      }
    },
  },
}
</script>
