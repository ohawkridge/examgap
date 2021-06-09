<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
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
          </v-list>
        </v-menu>
        <v-spacer />
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-if="teacher"
              v-bind="attrs"
              elevation="0"
              nuxt
              to="/author"
              class="d-none d-md-flex"
              v-on="on"
            >
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              Create Question
            </v-btn>
          </template>
          <span>Create question</span>
        </v-tooltip>
        <the-subscribe-dialog v-if="teacher" />
        <v-menu offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-btn class="ml-2" elevation="0" icon v-bind="attrs" v-on="on">
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
            <v-list-item nuxt to="/settings">
              <v-list-item-content>
                <v-list-item-title>Change password</v-list-item-title>
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
      <TheSnackbar />
      <JoinClass v-if="!teacher" />
    </v-main>
    <TheFooter v-if="showFooter" />
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheSubscribeDialog from '@/components/teacher/TheSubscribeDialog'
import JoinClass from '@/components/student/JoinClass'

import {
  mdiPlus,
  mdiAccountCircleOutline,
  mdiChevronDown,
  mdiOpenInNew,
} from '@mdi/js'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheSnackbar,
    TheFooter,
    TheSubscribeDialog,
    JoinClass,
  },
  middleware: ['get-user', 'auth'],
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.groups.groups,
      loading: (state) => state.user.loading,
    }),
    ...mapGetters({
      activeGroupCount: 'groups/activeGroupCount',
    }),
    // Hide footer on pages with bottom-navigation
    showFooter() {
      return !(
        this.$vuetify.breakpoint.name === 'xs' &&
        (this.$route.name === 'group-group' ||
          this.$route.name === 'students-students' ||
          this.$route.name === 'grades-grades' ||
          this.$route.name === 'edit-edit')
      )
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiAccountCircleOutline,
      mdiChevronDown,
      mdiOpenInNew,
    }
  },
  methods: {
    nav(index, groupId) {
      // Store the index of the current group
      this.$store.commit('groups/setActiveGroupIndex', index)
      this.$router.push(this.teacher ? `/group/${groupId}` : `/home`)
    },
    logout() {
      this.$router.push('/')
      this.$store.commit('assignments/logout')
      this.$store.commit('groups/logout')
      this.$store.commit('user/logout')
      localStorage.removeItem('examgap')
    },
  },
}
</script>
