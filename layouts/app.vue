<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-navigation-drawer v-model="drawer" color="#fefcfb" app right temporary>
      <v-list nav dense>
        <v-list-item-group v-model="navGroup" color="primary">
          <v-list-item nuxt to="/author">
            <v-list-item-content>
              <v-btn elevation="0" color="primary" outlined>
                <v-icon left>{{ $icons.mdiPlus }}</v-icon>
                Create Question
              </v-btn>
            </v-list-item-content>
          </v-list-item>

          <the-feedback-dialog />

          <v-list-item @click="$nuxt.$emit('show-subscribe')">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiCheckCircleOutline }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Subscribe</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="my-2" />
          <v-list-item nuxt to="/profile">
            <v-list-item-icon>
              <v-icon>{{ $icons.mdiAccountOutline }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn elevation="0" outlined block @click="logout()"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="#fefcfb" elevation="2" app>
      <v-container class="d-flex align-center px-0">
        <nuxt-link :to="teacher ? '/classes' : '/home'">
          <TheLogo />
        </nuxt-link>
        <v-menu offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-btn elevation="0" class="ml-4 ml-md-10" v-bind="attrs" v-on="on">
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
              <v-divider />
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
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
              v-on="on"
            ></v-app-bar-nav-icon>
          </template>
          <span>{{ drawer ? 'Hide menu' : 'Show menu' }}</span>
        </v-tooltip>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
      <the-snackbar />
      <create-class v-if="teacher" />
      <the-join-dialog v-if="!teacher" />
      <the-loading-overlay />
    </v-main>
    <the-footer />
    <the-subscribe-dialog v-if="teacher" />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheSubscribeDialog from '@/components/teacher/TheSubscribeDialog'
import TheLoadingOverlay from '@/components/common/TheLoadingOverlay'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheFeedbackDialog from '@/components/common/TheFeedbackDialog'
import CreateClass from '@/components/teacher/CreateClass'

import {
  mdiPlus,
  mdiAccountOutline,
  mdiChevronDown,
  mdiOpenInNew,
  mdiCommentAlertOutline,
  mdiTrello,
  mdiLogout,
  mdiCheckCircleOutline,
} from '@mdi/js'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheSnackbar,
    TheFooter,
    TheSubscribeDialog,
    TheJoinDialog,
    TheLoadingOverlay,
    CreateClass,
    TheFeedbackDialog,
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
      mdiAccountOutline,
      mdiChevronDown,
      mdiOpenInNew,
      mdiCommentAlertOutline,
      mdiTrello,
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
