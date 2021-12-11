<template>
  <v-app :dark="$store.state.app.darkMode">
    <v-navigation-drawer
      v-model="drawer"
      :color="$vuetify.theme.themes.light.background"
      app
      floating
    >
      <div class="pa-2">
        <nuxt-link to="/home">
          <the-logo />
        </nuxt-link>
      </div>
      <v-list rounded dense>
        <v-list-item-group
          v-model="navbar"
          active-class="bold-nav"
          color="primary"
        >
          <v-list-item nuxt to="/home">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-house" class="fa-lg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Home </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader> Classes </v-subheader>
          <v-list-item
            v-for="(group, i) in groups"
            :key="i"
            @click="nav(group.id)"
          >
            <v-list-item-content>
              <v-list-item-title> {{ group.name }} </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action-text v-if="!teacher">
              {{ group.count }}
            </v-list-item-action-text>
          </v-list-item>
          <v-divider class="my-4 mx-2" />
          <v-list-item v-if="teacher" nuxt to="/archive">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-box-archive" class="fa-lg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Archive </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/profile">
            <v-list-item-icon class="d-flex justify-center align-center">
              <font-awesome-icon icon="fa-light fa-circle-user" class="fa-lg" />
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
    <v-app-bar app flat :color="$vuetify.theme.themes.light.background">
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-app-bar-nav-icon @click="drawer = !drawer" v-on="on">
          </v-app-bar-nav-icon>
        </template>
        <span>{{ drawer ? 'Hide menu' : 'Show menu' }}</span>
      </v-tooltip>
      <div
        class="d-flex justify-space-between align-center pl-2"
        style="width: 100%"
      >
        <span class="text-subtitle-1 font-weight-medium">
          {{ pageTitle }}
        </span>
        <div class="d-flex align-center">
          <div id="headway" class="pr-2"></div>
          <v-menu offset-y open-on-hover rounded="lg">
            <template #activator="{ on }">
              <v-btn icon color="primary" v-on="on">
                <font-awesome-icon icon="fa-light fa-plus" class="ico-btn" />
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="$nuxt.$emit('show-create')">
                <v-list-item-title> New class </v-list-item-title>
              </v-list-item>
              <v-list-item @click="$nuxt.$emit('show-new')">
                <v-list-item-title> New assignment </v-list-item-title>
              </v-list-item>
              <v-list-item nuxt to="/author">
                <v-list-item-title> New question </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-app-bar>
    <v-main :style="`background-color: ${color}`">
      <nuxt />
      <the-snackbar />
      <the-loading-overlay />
      <template v-if="teacher">
        <the-onboarding-snackbar />
        <the-create-class-dialog />
        <the-delete-assignment-dialog />
        <the-new-assignment-dialog />
      </template>
      <the-join-dialog v-else />
    </v-main>
    <the-footer />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import TheLogo from '@/components/common/TheLogo'
import TheSnackbar from '@/components/common/TheSnackbar'
import TheFooter from '@/components/common/TheFooter'
import TheJoinDialog from '@/components/student/TheJoinDialog'
import TheOnboardingSnackbar from '@/components/teacher/TheOnboardingSnackbar'
import TheCreateClassDialog from '@/components/teacher/TheCreateClassDialog'
import TheLoadingOverlay from '~/components/common/TheLoadingOverlay.vue'
import TheDeleteAssignmentDialog from '~/components/teacher/TheDeleteAssignmentDialog.vue'
import TheNewAssignmentDialog from '~/components/teacher/TheNewAssignmentDialog.vue'

export default {
  name: 'App',
  components: {
    TheLogo,
    TheSnackbar,
    TheJoinDialog,
    TheCreateClassDialog,
    TheOnboardingSnackbar,
    TheLoadingOverlay,
    TheFooter,
    TheDeleteAssignmentDialog,
    TheNewAssignmentDialog,
  },
  middleware: ['auth'],
  data() {
    return {
      drawer: null,
    }
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
      pageTitle: (state) => state.app.pageTitle,
      darkMode: (state) => state.app.darkMode,
    }),
    color() {
      return this.darkMode ? '#191c1e' : '#fbfcff'
    },
    navbar: {
      get() {
        return this.$store.state.app.navbar
      },
      set(val) {
        this.$store.commit('app/setNav', val)
      },
    },
  },
  mounted() {
    const config = {
      selector: '#headway',
      account: 'yE6G2x',
    }
    // eslint-disable-next-line no-undef
    Headway.init(config)
  },
  methods: {
    nav(groupId) {
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

<style scoped>
.bold-nav {
  outline: 2px solid #000000 !important;
  outline-offset: 2px;
}

.ico-btn {
  height: 24px;
  width: 24px;
}
</style>
