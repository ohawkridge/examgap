<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-app-bar color="#f1eeee" app elevate-on-scroll elevation="2">
      <v-container class="d-flex align-center px-0">
        <nuxt-link :to="teacher ? '/classes' : '/home'">
          <TheLogo />
        </nuxt-link>
        <v-btn
          text
          color="#2e2e3a"
          nuxt
          :to="teacher ? '/classes' : '/home'"
          class="ml-8 d-none d-sm-flex"
        >
          Home
        </v-btn>
        <v-menu offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-btn color="#2e2e3a" text class="ml-2" v-bind="attrs" v-on="on">
              Classes
              <v-icon right>{{ $icons.mdiChevronDown }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <template v-for="(group, i) in activeGroups">
              <v-list-item
                v-if="group.active"
                :key="i"
                @click="nav(i, group.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ group.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-if="activeGroups.length === 0" disabled>
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
          </v-list>
        </v-menu>
        <v-spacer />
        <v-btn
          v-if="teacher"
          color="#2e2e3a"
          text
          nuxt
          to="/author"
          class="mr-4 d-none d-sm-flex"
        >
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Create Question
        </v-btn>
        <v-menu offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-btn color="#2e2e3a" icon v-bind="attrs" v-on="on">
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
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
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
    JoinClass,
  },
  middleware: ['get-user'],
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
    }),
    ...mapGetters({
      tabGroups: 'groups/tabGroups',
      activeGroups: 'groups/activeGroups',
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
