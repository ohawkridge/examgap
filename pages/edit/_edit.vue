<template>
  <div>
    <GroupHeader v-if="group && Object.keys(group).length > 0" :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav
          v-if="group && Object.keys(group).length > 0"
          :group="group"
        />
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="eg-card mt-n6 mt-sm-0">
          <v-card-title v-if="group" class="d-flex justify-space-between">
            Settings
            <!-- Hide archive button for archived groups -->
            <!-- Add un-archive feature -->
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
              <the-course-select :course-id="group.course.id" />
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
import { mapGetters } from 'vuex'
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import ArchiveGroup from '@/components/teacher/ArchiveGroup'
import TheCourseSelect from '@/components/teacher/TheCourseSelect'
import { mdiInformationOutline } from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
    ArchiveGroup,
    TheCourseSelect,
  },
  layout: 'app',
  data() {
    return {
      loading: false,
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
    ...mapGetters({ group: 'user/activeGroup' }),
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
    this.$icons = { mdiInformationOutline }
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
      this.loading = true
      try {
        // Dispatch store action to update group
        this.$store.dispatch('groups/updateGroup', {
          courseId: this.courseId,
          groupName: this.name,
        })
        this.$snack.showMessage({
          type: 'success',
          msg: 'Changes saved',
        })
      } catch (e) {
        console.error('Error dispatching updateGroup')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
