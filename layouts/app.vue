<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" width="232" app>
      <v-sheet class="pa-4">
        <nuxt-link to="/home">
          <the-logo />
        </nuxt-link>
        <div class="pa-4">
          <the-student-greeting v-if="!teacher" />
          <nuxt-link to="/profile" class="black--text text-subtitle-2">{{
            shortName
          }}</nuxt-link>
          <div>
            <v-chip x-small>
              {{ teacher ? 'Teacher' : 'Student' }}
            </v-chip>
          </div>
        </div>
        <v-list dense nav>
          <v-list-item-group v-model="nav" color="primary">
            <v-list-group
              :value="true"
              :prepend-icon="$icons.mdiAccountGroupOutline"
            >
              <template #activator>
                <v-list-item-title>Classes</v-list-item-title>
              </template>
              <template v-for="(group, i) in groups">
                <v-list-item
                  v-if="includeGroup(group)"
                  :key="i"
                  @click="navTo(group.id)"
                >
                  <v-list-item-content>
                    <v-list-item-title> {{ group.name }} </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-group>
          </v-list-item-group>
          <v-divider class="my-4" />
          <v-list-item nuxt to="/profile">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiAccountOutline }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Profile </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiLogoutVariant }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Sign Out </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
      <!-- <template #append>
        <div class="pa-4">
          <v-btn block text rounded @click="logout()"> Sign out </v-btn>
        </div>
      </template> -->
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
        <v-btn
          v-if="teacher && $route.name === 'home'"
          elevation="0"
          text
          color="primary"
          rounded
          @click="$nuxt.$emit('show-create')"
        >
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Class
        </v-btn>
        <the-quote-of-the-day v-if="!teacher" />
        <v-btn
          v-if="teacher && $route.name === 'group-group'"
          elevation="0"
          text
          color="primary"
          rounded
          @click="createAssignment()"
        >
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Assignment
        </v-btn>
        <create-assignment v-if="$route.name === 'course-course'" />
        <v-btn v-if="$route.name === 'question-question'" rounded text>
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Question
        </v-btn>
        <!-- TODO -->
        <!-- <v-btn elevation="0" text rounded> Join Class </v-btn> -->
      </v-container>
    </v-app-bar>
    <v-main>
      <nuxt />
      <the-snackbar />
      <the-onboarding-snackbar v-if="teacher" />
      <the-create-class-dialog v-if="teacher" />
      <the-join-dialog v-if="!teacher" />
      <the-feedback-dialog />
      <the-loading-overlay />
      <!-- <the-footer /> -->
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiPlus,
  mdiAccountOutline,
  mdiChevronDown,
  mdiCheckCircleOutline,
  mdiCommentTextOutline,
  mdiFlashOutline,
  mdiAccountGroupOutline,
  mdiLogoutVariant,
} from '@mdi/js'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
// import TheFooter from '@/components/common/TheFooter'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheFeedbackDialog from '@/components/common/TheFeedbackDialog'
import TheOnboardingSnackbar from '@/components/teacher/TheOnboardingSnackbar'
import TheCreateClassDialog from '@/components/teacher/TheCreateClassDialog'
import TheLoadingOverlay from '@/components/common/TheLoadingOverlay'
import CreateAssignment from '@/components/teacher/CreateAssignment'
import TheStudentGreeting from '@/components/student/TheStudentGreeting'
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheSnackbar,
    // TheFooter,
    TheJoinDialog,
    TheCreateClassDialog,
    TheFeedbackDialog,
    TheOnboardingSnackbar,
    TheLoadingOverlay,
    TheStudentGreeting,
    CreateAssignment,
    TheQuoteOfTheDay,
  },
  middleware: ['auth'],
  data() {
    return {
      drawer: null,
      nav: null,
    }
  },
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
      username: (state) => state.user.username,
      groups: (state) => state.user.groups,
      pageTitle: (state) => state.app.pageTitle,
    }),
    ...mapGetters({
      activeGroupCount: 'user/activeGroupCount',
      group: 'user/activeGroup',
    }),
    shortName() {
      return this.username.includes('@')
        ? this.username.substring(0, this.username.indexOf('@'))
        : this.username
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiAccountOutline,
      mdiChevronDown,
      mdiCheckCircleOutline,
      mdiCommentTextOutline,
      mdiFlashOutline,
      mdiAccountGroupOutline,
      mdiLogoutVariant,
    }
  },
  methods: {
    navTo(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$router.push(this.teacher ? `/group/${groupId}` : '/home')
    },
    createAssignment() {
      // Clear any previous selections
      this.$store.commit('topics/clearSelectedQuestions')
      // Continue onboarding if user hasn't set assignments
      this.$store.commit(
        'app/setOnboardStep',
        this.group.assignments.length < 3 ? 4 : 0
      )
      this.$router.push(`/course/${this.group.course.id}`)
    },
    // N.B. You *cannot* just filter groups (throws off i)
    // For students, show all classes in nav
    // For teachers, just show active classes
    includeGroup(group) {
      return this.teacher ? group.active === true : true
    },
    logout() {
      localStorage.removeItem('examgap')
      this.$router.push('/')
      // Reload page to clear Vuex
      this.$router.go()
    },
  },
}
</script>
