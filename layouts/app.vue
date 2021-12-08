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
        <v-list-item v-if="teacher" @click="$nuxt.$emit('show-create')">
          <v-list-item-icon class="d-flex justify-center align-center">
            <font-awesome-icon icon="fa-light fa-plus fa-lg" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Create class </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item-group v-model="nav" color="primary">
          <!-- No classes -->
          <v-list-item v-if="groups.length === 0">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-user-group fa-lg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Classes </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-else :value="true">
            <template #activator>
              <v-list-item-icon class="d-flex justify-center align-center">
                <font-awesome-icon icon="fa-light fa-user-group fa-lg" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Classes</v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-for="(group, i) in groups">
              <v-list-item :key="i" @click="navTo(group.id)">
                <v-list-item-content>
                  <v-list-item-title> {{ group.name }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-group>
          <v-list-item v-if="teacher" nuxt :to="`/archive`">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-box-archive fa-lg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Archive </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="my-4 mx-2" />
          <v-list-item v-if="teacher" nuxt to="/author">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-plus fa-lg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Create question </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="teacher" nuxt to="/feedback">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-comment-exclamation fa-lg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Send feedback </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/profile">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-circle-user fa-lg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Profile </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block elevation="0" plain @click="logout()"> Sign out </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      app
      flat
      color="white"
      style="border-bottom: 1px solid #d2d2d2 !important"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-app-bar-nav-icon @click="drawer = !drawer" v-on="on">
          </v-app-bar-nav-icon>
        </template>
        <span>{{ drawer ? 'Hide menu' : 'Show menu' }}</span>
      </v-tooltip>
      <div
        class="d-flex justify-space-between align-center pl-1"
        style="width: 100%"
      >
        <span class="text-subtitle-1 font-weight-medium">
          {{ pageTitle }}
        </span>
        <div id="headway"></div>
      </div>
    </v-app-bar>
    <v-main style="background-color: #fafafa">
      <nuxt />
      <the-snackbar />
      <the-loading-overlay />
      <the-onboarding-snackbar v-if="teacher" />
      <the-create-class-dialog v-if="teacher" />
      <the-delete-assignment-dialog v-if="teacher" />
      <the-join-dialog v-else />
    </v-main>
    <the-footer />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheOnboardingSnackbar from '@/components/teacher/TheOnboardingSnackbar'
import TheCreateClassDialog from '@/components/teacher/TheCreateClassDialog'
import TheGreeting from '@/components/common/TheGreeting'
import TheLoadingOverlay from '~/components/common/TheLoadingOverlay.vue'
import TheDeleteAssignmentDialog from '~/components/teacher/TheDeleteAssignmentDialog.vue'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheSnackbar,
    TheJoinDialog,
    TheCreateClassDialog,
    TheOnboardingSnackbar,
    TheGreeting,
    TheLoadingOverlay,
    TheFooter,
    TheDeleteAssignmentDialog,
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
      selected: (state) => state.topics.selected,
    }),
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    // Page title action logic
    createClass() {
      return this.teacher && this.$route.name === 'home'
    },
    createAss() {
      return this.teacher && this.$route.name === 'group-group'
    },
    createQ() {
      return this.$route.name === 'question-question'
    },
  },
  methods: {
    navTo(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$router.push(this.teacher ? `/group/${groupId}` : '/home')
    },
    logout() {
      this.$router.push('/signin')
      // Clear all stores
      this.$store.dispatch('snackbar/resetState')
      this.$store.dispatch('topics/resetState')
      this.$store.dispatch('assignment/resetState')
      this.$store.dispatch('group/resetState')
      this.$store.dispatch('app/resetState')
      this.$store.dispatch('user/resetState')
      // Clear local storage
      localStorage.clear()
    },
  },
}
</script>
