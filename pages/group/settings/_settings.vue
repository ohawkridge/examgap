<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav :group-id="group.id" />
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-n6 mt-sm-0">
          <v-card-title v-if="group" class="d-flex justify-space-between">
            Settings
            <!-- Hide archive button for archived groups -->
            <!-- TODO Add un-archive feature -->
            <ArchiveGroup v-if="group.active" :group-id="group.id" />
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Class name*"
                value="Test"
                outlined
                autofocus
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8">
              <CourseSelect :course="group.course.id" @clicked="updateCourse" />
              <v-alert
                v-if="alert"
                border="left"
                text
                type="info"
                :icon="$icons.mdiInformationOutline"
              >
                Change will take effect the next time you log in
              </v-alert>
            </v-col>
            <v-col cols="12" class="px-0">
              <v-btn
                color="primary"
                elevation="0"
                :loading="loading"
                :disabled="loading"
                @click="save"
              >
                Save changes
              </v-btn>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import ArchiveGroup from '@/components/teacher/ArchiveGroup'
import CourseSelect from '@/components/teacher/CourseSelect'
import { mdiInformationOutline } from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
    ArchiveGroup,
    CourseSelect,
  },
  layout: 'app',
  data() {
    return {
      loading: false,
      alert: false,
      courseId: '',
      nameRules: [(v) => !!v || 'Class name is required'],
    }
  },
  head() {
    return {
      title: this.group ? `${this.group.name} settings` : 'settings',
    }
  },
  computed: {
    group() {
      return this.$store.getters['groups/groupById'](
        this.$route.params.settings
      )
    },
    name: {
      get() {
        return this.group.name
      },
      set(value) {
        this.$store.commit('groups/updateGroupName', {
          id: this.group.id,
          name: value,
        })
      },
    },
  },
  created() {
    this.$icons = {
      mdiInformationOutline,
    }
  },
  methods: {
    updateCourse(courseId) {
      // N.B. This function is called without params,
      // but still receives the value courseId
      // emitted from the CourseSelect component
      // https://stackoverflow.com/questions/53738919/emit-event-with-parameters-in-vue
      this.courseId = courseId
      this.alert = true
    },
    save() {
      this.loading = true
      try {
        // If course hasn't been changed, courseId will be ""
        if (this.courseId === '') this.courseId = this.group.course.id
        // await updateGroup(this.group.id, this.name, this.courseId)
        this.$snack.showMessage({
          type: 'success',
          msg: `Success. Class updated`,
        })
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error updating class`,
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
