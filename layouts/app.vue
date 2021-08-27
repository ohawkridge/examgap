<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" width="232" app>
      <div class="pa-2">
        <nuxt-link to="/home">
          <the-logo />
        </nuxt-link>
        <the-greeting />
      </div>
      <v-list dense nav>
        <v-list-item-group v-model="nav" color="primary">
          <v-list-item v-if="groups.length === 0" @click="navHome()">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiGoogleClassroom }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Classes </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-else
            :value="true"
            :prepend-icon="$icons.mdiGoogleClassroom"
          >
            <template #activator>
              <v-list-item-title>Classes</v-list-item-title>
            </template>
            <template v-for="(group, i) in groups">
              <v-list-item
                v-if="!teacher || (teacher && group.active)"
                :key="i"
                @click="navTo(group.id)"
              >
                <v-list-item-content>
                  <v-list-item-title> {{ group.name }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-group>
          <v-divider class="my-4 mx-2" />
          <v-list-item nuxt to="/feedback">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiCommentAlertOutline }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Send feedback </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/profile">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiAccountCircleOutline }}</v-icon>
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
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="#fafafa"
      flat
      style="border-bottom: 1px solid #d2d2d2 !important"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-container class="d-flex justify-space-between align-center mob-right">
        <span class="font-weight-medium"> {{ pageTitle }} </span>
        <the-quote-of-the-day
          v-if="!teacher && $vuetify.breakpoint.name !== 'xs'"
        />
        <!-- **ACTIONS** -->
        <!-- Create class -->
        <v-btn
          v-if="createClass && $vuetify.breakpoint.name === 'xs'"
          elevation="0"
          icon
          color="primary"
          rounded
          @click="$nuxt.$emit('show-create')"
        >
          <v-icon>{{ $icons.mdiPlus }}</v-icon>
        </v-btn>
        <v-btn
          v-if="createClass && $vuetify.breakpoint.name !== 'xs'"
          elevation="0"
          text
          color="primary"
          rounded
          @click="$nuxt.$emit('show-create')"
        >
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Class
        </v-btn>
        <!-- Create assignment -->
        <v-btn
          v-if="createAss && $vuetify.breakpoint.name === 'xs'"
          elevation="0"
          icon
          color="primary"
          @click="createAssignment()"
        >
          <v-icon>{{ $icons.mdiPlus }}</v-icon>
        </v-btn>
        <v-btn
          v-if="createAss && $vuetify.breakpoint.name !== 'xs'"
          elevation="0"
          text
          color="primary"
          rounded
          @click="createAssignment()"
        >
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Assignment
        </v-btn>
        <!-- Add students -->
        <v-btn
          v-if="addStudents && $vuetify.breakpoint.name === 'xs'"
          elevation="0"
          icon
          color="primary"
          @click="$nuxt.$emit('open-invite')"
        >
          <v-icon>{{ $icons.mdiPlus }}</v-icon>
        </v-btn>
        <v-btn
          v-if="addStudents && $vuetify.breakpoint.name !== 'xs'"
          elevation="0"
          text
          color="primary"
          rounded
          @click="$nuxt.$emit('open-invite')"
        >
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Student
        </v-btn>
        <!-- + Assign (x) -->
        <create-assignment v-if="$route.name === 'course-course'" />
        <!-- Create question -->
        <v-btn
          v-if="createQ && $vuetify.breakpoint.name === 'xs'"
          color="primary"
          icon
          nuxt
          to="/author"
        >
          <v-icon>{{ $icons.mdiPlus }}</v-icon>
        </v-btn>
        <v-btn
          v-if="createQ && $vuetify.breakpoint.name !== 'xs'"
          color="primary"
          rounded
          text
          nuxt
          to="/author"
        >
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
      <the-loading-overlay />
    </v-main>
    <the-footer />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiPlus,
  mdiAccountCircleOutline,
  mdiChevronDown,
  mdiCheckCircleOutline,
  mdiCommentTextOutline,
  mdiFlashOutline,
  mdiGoogleClassroom,
  mdiLogoutVariant,
  mdiCommentAlertOutline,
} from '@mdi/js'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheOnboardingSnackbar from '@/components/teacher/TheOnboardingSnackbar'
import TheCreateClassDialog from '@/components/teacher/TheCreateClassDialog'
import TheLoadingOverlay from '@/components/common/TheLoadingOverlay'
import CreateAssignment from '@/components/teacher/CreateAssignment'
import TheGreeting from '@/components/common/TheGreeting'
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheSnackbar,
    TheJoinDialog,
    TheCreateClassDialog,
    TheOnboardingSnackbar,
    TheLoadingOverlay,
    TheGreeting,
    TheFooter,
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
      groups: (state) => state.user.groups,
      pageTitle: (state) => state.app.pageTitle,
    }),
    ...mapGetters({
      activeGroupCount: 'user/activeGroupCount',
      group: 'user/activeGroup',
    }),
    // Page title action logic
    createClass() {
      return this.teacher && this.$route.name === 'home'
    },
    addStudents() {
      return (
        this.teacher &&
        this.$route.name === 'group-group' &&
        this.$store.state.app.groupTab === 1
      )
    },
    createAss() {
      return (
        this.teacher &&
        this.$route.name === 'group-group' &&
        this.$store.state.app.groupTab !== 1
      )
    },
    createQ() {
      return this.$route.name === 'question-question'
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiAccountCircleOutline,
      mdiChevronDown,
      mdiCheckCircleOutline,
      mdiCommentTextOutline,
      mdiFlashOutline,
      mdiGoogleClassroom,
      mdiLogoutVariant,
      mdiCommentAlertOutline,
    }
  },
  methods: {
    navTo(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$router.push(this.teacher ? `/group/${groupId}` : '/home')
    },
    navHome() {
      // Make 'Classes' a link to home in empty state
      this.$store.commit('app/setTab', 0)
      this.$router.push('/home')
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
    logout() {
      this.$router.push('/')
      localStorage.removeItem('examgap')
      // Reload page to clear Vuex
      this.$router.go()
    },
  },
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .mob-right {
    padding-right: 0px;
  }
}
</style>
