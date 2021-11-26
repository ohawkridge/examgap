<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card>
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
          <the-course-select />
          <!-- ^^^ Emits an event containing selected course id -->
        </v-form>
        <small>*Indicates required field</small>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            elevation="0"
            :loading="loading"
            :disabled="loading"
            rounded
            class="ml-2"
            @click="createGroup()"
          >
            Create class
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import TheCourseSelect from '@/components/teacher/TheCourseSelect'

export default {
  name: 'TheCreateClassDialog',
  components: {
    TheCourseSelect,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      groupName: '',
      nameRules: [(v) => !!v || 'Class name is required'],
      courseId: '',
    }
  },
  computed: {
    ...mapState({
      groups: (state) => state.user.groups,
    }),
  },
  beforeDestroy() {
    // Destroy event listeners to prevent memory leaks
    this.$nuxt.$off('show-create')
    this.$nuxt.$off('select-course')
  },
  mounted() {
    this.$nuxt.$on('show-create', () => {
      this.dialog = true
    })
    this.$nuxt.$on('select-course', (courseId) => {
      this.courseId = courseId
    })
  },
  methods: {
    async createGroup() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const payload = {
            groupName: this.groupName,
            courseId: this.courseId,
          }
          await this.$store.dispatch('user/createGroup', payload)
          // Route to _group.vue of new group
          const lastAddedId = this.groups[this.groups.length - 1].id
          this.$router.push(`/group/${lastAddedId}`)
          this.$snack.showMessage({
            type: 'success',
            msg: `Class created`,
          })
        } catch (err) {
          console.error(err)
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
