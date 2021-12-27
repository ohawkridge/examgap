<template>
  <v-container>
    <v-row>
      <v-col cols="12" offset="1" md="5">
        <p class="text-subtitle-2 mt-4">Class details</p>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Class name*"
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
            <span :class="$vuetify.theme.dark ? 'pb-text' : ''"> Save </span>
          </v-btn>
          <the-archive-group-dialog v-if="group.active" />
          <the-restore-group-dialog v-else />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" offset="1" md="5">
        <p class="text-subtitle-2 pt-8">General</p>
        <v-text-field
          label="Join code"
          readonly
          :value="code"
          outlined
        ></v-text-field>
        <v-text-field label="Link" readonly :value="link" outlined>
          <template #append>
            <v-btn icon class="fix-btn" @click="copy()">
              <font-awesome-icon icon="fa-light fa-copy" class="fa-lg" />
            </v-btn>
          </template>
        </v-text-field>
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
      code: 'user/activeGroupCode',
      link: 'user/activeGroupLink',
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
    async copy() {
      await navigator.clipboard.writeText(this.link)
      this.$snack.showMessage({
        msg: 'Link copied',
      })
    },
  },
}
</script>
