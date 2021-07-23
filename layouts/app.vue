<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-app-bar color="#fefcfb" elevate-on-scroll app>
      <v-container class="d-flex align-center px-0">
        <nuxt-link :to="teacher ? '/classes' : '/home'">
          <!-- Only show logomark on mobile -->
          <the-logo-mark v-if="$vuetify.breakpoint.name === 'xs'" />
          <the-logo v-else />
        </nuxt-link>
        <v-menu offset-y open-on-hover>
          <template #activator="{ on }">
            <v-btn elevation="0" class="ml-4 ml-md-10" v-on="on">
              Classes
              <v-icon right>{{ $icons.mdiChevronDown }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <!-- Filter teacher groups for active on-the-fly -->
            <template v-for="(group, i) in groups">
              <v-list-item
                v-if="!teacher || group.active"
                :key="i"
                @click="nav(i, group.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ group.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-if="teacher && activeGroupCount === 0" disabled>
              <v-list-item-content>
                <v-list-item-title> No active classes </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <template v-if="!teacher">
              <v-divider class="my-2" />
              <v-list-item @click="$nuxt.$emit('join-class')">
                <v-list-item-content>
                  <v-list-item-title> Join class&hellip; </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-else>
              <v-divider class="my-2" />
              <v-list-item @click="$nuxt.$emit('show-create')">
                <v-list-item-content>
                  <v-list-item-title> Create Class&hellip; </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
        <v-spacer />
        <template v-if="teacher">
          <v-btn
            v-if="$vuetify.breakpoint.name === 'xs'"
            nuxt
            to="/author"
            color="primary"
            class="mr-2"
            icon
          >
            <v-icon>{{ $icons.mdiPlus }}</v-icon>
          </v-btn>
          <v-btn
            v-else
            nuxt
            to="/author"
            elevation="0"
            color="primary"
            class="mr-2"
            text
          >
            <v-icon>{{ $icons.mdiPlus }}</v-icon>
            Create Question
          </v-btn>
        </template>
        <v-menu offset-y open-on-hover>
          <template #activator="{ on }">
            <v-btn icon elevation="0" v-on="on">
              <v-icon>{{ $icons.mdiAccountCircleOutline }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item nuxt to="/profile">
              <v-list-item-content>
                <v-list-item-title> Profile </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="$nuxt.$emit('show-feedback')">
              <v-list-item-content>
                <v-list-item-title> Send Feedback </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item @click="logout()">
              <v-list-item-content>
                <v-list-item-title> Sign Out </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
      <the-snackbar />
      <the-onboarding-snackbar v-if="teacher" />
      <the-create-class-dialog v-if="teacher" />
      <the-join-dialog v-if="!teacher" />
      <the-feedback-dialog />
    </v-main>
    <the-footer />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheLogoMark from '@/components/common/TheLogoMark'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheFeedbackDialog from '@/components/common/TheFeedbackDialog'
import TheOnboardingSnackbar from '@/components/teacher/TheOnboardingSnackbar'
import TheCreateClassDialog from '@/components/teacher/TheCreateClassDialog'

import {
  mdiPlus,
  mdiAccountCircleOutline,
  mdiChevronDown,
  mdiLogout,
  mdiCheckCircleOutline,
} from '@mdi/js'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheLogoMark,
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
    // Only needed to display 'No active classes' menu item
    ...mapGetters({
      activeGroupCount: 'user/activeGroupCount',
    }),
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiAccountCircleOutline,
      mdiChevronDown,
      mdiLogout,
      mdiCheckCircleOutline,
    }
  },
  methods: {
    nav(index, groupId) {
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
