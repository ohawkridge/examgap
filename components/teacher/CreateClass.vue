<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Create class </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Class name*"
            outlined
            autofocus
          ></v-text-field>
          <CourseSelect @clicked="updateCourse" />
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
      name: '',
      course: '',
      nameRules: [(v) => !!v || 'Name is required'],
      loading: false,
    }
  },
  mounted() {
    this.$nuxt.$on('show-create', () => {
      this.dialog = true
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
          const response = await fetch('/.netlify/functions/createGroup', {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              name: this.name,
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
            msg: `Success. Class created`,
          })
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: `Error creating class`,
          })
        } finally {
          // Close dialog and clear form
          this.dialog = false
          this.loading = false
          this.$refs.form.reset()
        }
      }
    },
  },
}
</script>
