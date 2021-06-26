<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-app-bar color="#fefcfb" elevation="2" app>
      <v-container class="d-flex align-center px-0">
        <nuxt-link :to="teacher ? '/classes' : '/home'">
          <!-- Just show logo mark on mobile -->
          <TheLogoMark v-if="$vuetify.breakpoint.name === 'xs'" />
          <TheLogo v-else />
        </nuxt-link>
        <v-menu offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-btn elevation="0" class="ml-4 ml-md-10" v-bind="attrs" v-on="on">
              Classes
              <v-icon right>{{ $icons.mdiChevronDown }}</v-icon>
            </v-btn>
          </template>
          <!-- <v-list>
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
            <v-list-item v-if="activeGroupCount === 0" disabled>
              <v-list-item-content>
                <v-list-item-title> No active classes </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <template v-if="!teacher">
              <v-divider />
              <v-list-item @click="$nuxt.$emit('join-class')">
                <v-list-item-content>
                  <v-list-item-title> Join class&hellip; </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-else>
              <v-divider />
              <v-list-item @click="$nuxt.$emit('show-create')">
                <v-list-item-content>
                  <v-list-item-title> Create class&hellip; </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list> -->
        </v-menu>
        <v-spacer />
        <v-btn
          v-if="teacher"
          nuxt
          to="/author"
          class="mr-2 hidden-md-and-up"
          icon
        >
          <v-icon>{{ $icons.mdiPencilPlusOutline }}</v-icon>
        </v-btn>
        <v-btn
          v-if="teacher"
          elevation="0"
          nuxt
          to="/author"
          class="mr-2 hidden-sm-and-down"
        >
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Create Question
        </v-btn>
        <the-subscribe-dialog v-if="teacher" />
        <the-feedback-dialog />
        <v-menu offset-y open-on-hover>
          <template #activator="{ on }">
            <v-btn class="ml-2" elevation="0" icon v-on="on">
              <v-icon>{{ $icons.mdiAccountCircleOutline }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item nuxt to="/profile">
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              href="https://github.com/users/ohawkridge/projects/2"
              target="_blank"
            >
              <v-list-item-content>
                <v-list-item-title
                  >What's new
                  <v-icon small>{{ $icons.mdiOpenInNew }}</v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logout()">
              <v-list-item-content>
                <v-list-item-title>Sign out</v-list-item-title>
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
      <the-join-dialog v-if="!teacher" />
      <create-class v-if="teacher" />
      <the-loading-overlay />
    </v-main>
    <!-- TODO Clashes with v-bottom-nav? -->
    <the-footer />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheLogoMark from '@/components/common/TheLogoMark'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheSubscribeDialog from '@/components/teacher/TheSubscribeDialog'
import TheLoadingOverlay from '@/components/common/TheLoadingOverlay'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheFeedbackDialog from '@/components/common/TheFeedbackDialog'
import CreateClass from '@/components/teacher/CreateClass'

import {
  mdiPlus,
  mdiAccountCircleOutline,
  mdiChevronDown,
  mdiOpenInNew,
  mdiPencilPlusOutline,
} from '@mdi/js'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheLogoMark,
    TheSnackbar,
    TheFooter,
    TheSubscribeDialog,
    TheJoinDialog,
    TheLoadingOverlay,
    TheFeedbackDialog,
    CreateClass,
  },
  middleware: ['auth'],
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
      // groups: (state) => state.user.groups,
    }),
    ...mapGetters({
      activeGroupCount: 'user/activeGroupCount',
    }),
    // Hide footer on pages with bottom-navigation
    // showFooter() {
    //   return !(
    //     this.$vuetify.breakpoint.name === 'xs' &&
    //     (this.$route.name === 'group-group' ||
    //       this.$route.name === 'students-students' ||
    //       this.$route.name === 'grades-grades' ||
    //       this.$route.name === 'edit-edit')
    //   )
    // },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiAccountCircleOutline,
      mdiChevronDown,
      mdiOpenInNew,
      mdiPencilPlusOutline,
    }
  },
  methods: {
    nav(index, groupId) {
      // Store the index of the current group
      this.$store.commit('groups/setActiveGroupIndex', index)
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
