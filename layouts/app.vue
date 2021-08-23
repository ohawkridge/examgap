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
          <v-list-group :value="true" :prepend-icon="$icons.mdiGoogleClassroom">
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
        </v-list-item-group>
        <v-divider class="my-4 mx-2" />
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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="#fafafa"
      flat
      style="border-bottom: 1px solid #d2d2d2 !important"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-app-bar-nav-icon
            @click="drawer = !drawer"
            v-on="on"
          ></v-app-bar-nav-icon>
        </template>
        <span>{{ drawer ? 'Close menu' : 'Open menu' }}</span>
      </v-tooltip>
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
} from '@mdi/js'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheFeedbackDialog from '@/components/common/TheFeedbackDialog'
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
    TheFeedbackDialog,
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
    logout() {
      localStorage.removeItem('examgap')
      this.$router.push('/')
      // Reload page to clear Vuex
      this.$router.go()
    },
  },
}
</script>
