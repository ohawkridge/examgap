<template>
  <v-container>
    <v-row class="justify-center">
      <v-col class="12" md="6">
        <v-card outlined class="pa-4">
          <v-container>
            <v-row class="d-flex justify-center">
              <v-col cols="12">
                <div class="text-h5">Class details</div>
                <p class="font-weight-light mb-9">
                  Choose class name and course
                </p>
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Class name*"
                  value="Test"
                  outlined
                  autofocus
                ></v-text-field>
                <the-course-select :course-id="group.course.id" />
                <div class="d-flex justify-space-between mt-4">
                  <v-btn
                    color="primary"
                    elevation="0"
                    rounded
                    :loading="loading"
                    :disabled="loading"
                    @click="save"
                  >
                    Save
                  </v-btn>
                  <the-archive-group-dialog v-if="group.active" />
                  <the-restore-group-dialog v-else />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TheArchiveGroupDialog from '@/components/teacher/TheArchiveGroupDialog'
import TheCourseSelect from '@/components/teacher/TheCourseSelect'
import TheRestoreGroupDialog from '~/components/teacher/TheRestoreGroupDialog.vue'

export default {
  components: {
    TheArchiveGroupDialog,
    TheCourseSelect,
    TheRestoreGroupDialog,
  },
  data() {
    return {
      loading: false,
      courseId: '',
      nameRules: [(v) => !!v || 'Class name is required'],
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    name: {
      get() {
        return this.group.name
      },
      set(name) {
        this.$store.commit('user/setGroupName', { group: this.group, name })
        this.$store.commit('app/setPageTitle', name)
      },
    },
  },
  beforeDestroy() {
    this.$nuxt.$off('select-course')
  },
  mounted() {
    // Listen for select change event
    this.$nuxt.$on('select-course', (id) => {
      this.courseId = id
    })
    // Remember your Vue lifecycle !!
    // If you try and set this on data it won't be ready
    this.courseId = this.group.course.id
  },
  methods: {
    save() {
      try {
        this.loading = true
        // Dispatch store action to update group
        this.$store.dispatch('user/updateGroup', {
          courseId: this.courseId,
          groupName: this.name,
        })
        this.$snack.showMessage({
          type: 'success',
          msg: 'Changes saved',
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error updating group',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
