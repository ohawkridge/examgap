<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet class="pa-4">
        <the-logo />
        <!-- <v-list-item>
          <v-chip color="accent">
            <v-avatar left>
              <v-icon>{{ $icons.mdiFlashOutline }}</v-icon>
            </v-avatar>
            Subscribe to Examgap
          </v-chip>
        </v-list-item> -->
        <v-list-item class="d-flex justify-center">
          <v-btn
            nuxt
            to="/author"
            elevation="0"
            color="primary"
            rounded
            outlined
          >
            <v-icon>{{ $icons.mdiPlus }}</v-icon>
            Question
          </v-btn>
        </v-list-item>
        <v-divider class="my-3" />
        <v-list dense nav>
          <v-list-item nuxt to="/profile">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiAccountOutline }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Profile </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$nuxt.$emit('show-feedback')">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiCommentTextOutline }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Send Feedback </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiLogout }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Sign Out </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="#fafafa"
      flat
      style="border-bottom: 1px solid #d2d2d2 !important"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-container class="d-flex justify-space-between align-center">
        <span class="font-weight-medium"> {{ pageTitle }} </span>
        <v-btn elevation="0" text rounded @click="$nuxt.$emit('show-create')">
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Class
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container id="app-bar" class="pa-0">
        <nuxt />
      </v-container>
      <the-snackbar />
      <the-onboarding-snackbar v-if="teacher" />
      <the-create-class-dialog v-if="teacher" />
      <the-join-dialog v-if="!teacher" />
      <the-feedback-dialog />
      <the-footer />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheFeedbackDialog from '@/components/common/TheFeedbackDialog'
import TheOnboardingSnackbar from '@/components/teacher/TheOnboardingSnackbar'
import TheCreateClassDialog from '@/components/teacher/TheCreateClassDialog'

import {
  mdiPlus,
  mdiAccountOutline,
  mdiChevronDown,
  mdiLogout,
  mdiCheckCircleOutline,
  mdiCommentTextOutline,
  mdiFlashOutline,
} from '@mdi/js'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheSnackbar,
    TheFooter,
    TheJoinDialog,
    TheCreateClassDialog,
    TheFeedbackDialog,
    TheOnboardingSnackbar,
  },
  middleware: ['auth'],
  data() {
    return {
      drawer: null,
      navGroup: '',
    }
  },
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
    }),
    ...mapGetters({
      // Only needed to display 'No active classes' menu item
      activeGroupCount: 'user/activeGroupCount',
      group: 'user/activeGroup',
    }),
    pageTitle() {
      return this.$route.name === 'home' ? 'Classes' : this.group.name
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiAccountOutline,
      mdiChevronDown,
      mdiLogout,
      mdiCheckCircleOutline,
      mdiCommentTextOutline,
      mdiFlashOutline,
    }
  },
  methods: {
    nav(index, groupId) {
      this.$store.commit('students/clearStudents')
      // Store the index of the current group
      this.$store.commit('user/setActiveGroupIndex', index)
      this.$router.push(this.teacher ? `/group/${groupId}` : `/home`)
    },
    logout() {
      localStorage.removeItem('secret')
      this.$router.push('/')
      // Reload page to clear Vuex
      this.$router.go()
    },
  },
}
</script>
