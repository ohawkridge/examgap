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
  beforeDestroy() {
    // Destroy event listeners to prevent memory leaks?
    this.$nuxt.$off('show-create')
    this.$nuxt.$off('select-course')
  },
  mounted() {
    this.$nuxt.$on('show-create', () => {
      this.dialog = true
    })
    this.$nuxt.$on('select-course', (courseId) => {
      this.course = courseId
    })
  },
  methods: {
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
            throw new Error(`Error creating class ${response.status}`)
          }
          const data = await response.json()
          // Update local data
          this.$store.commit('groups/addGroup', data)
          // Progress onboarding
          this.$store.commit('app/setOnboardStep', 2)
          // If on Archive, set back to Home
          this.$store.commit('app/setTab', true)
          this.$store.commit('user/setActiveGroupIndex', -1)
          this.$router.push(`/group/${data.id}`)
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
          // Close dialog + clear form
          this.dialog = false
          this.loading = false
          this.$refs.form.reset()
        }
      }
    },
  },
}
</script>
