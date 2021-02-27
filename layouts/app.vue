<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-app-bar id="nav" color="#f1eeee" app elevate-on-scroll elevation="2">
      <v-container class="d-flex align-center px-0">
        <nuxt-link to="/home">
          <Logo />
        </nuxt-link>
        <v-btn
          text
          color="#2e2e3a"
          nuxt
          to="/home"
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
            <v-list-item
              v-for="(group, i) in activeGroups"
              :key="i"
              @click="nav(i, group.id)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ group.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="activeGroups.length === 0" disabled>
              <v-list-item-content>
                <v-list-item-title> No active classes </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="teacher" class="mx-4" />
            <v-list-item v-if="teacher" @click="createClass()">
              <v-list-item-content>
                <v-list-item-title> Create class&hellip; </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer />
        <v-btn
          v-if="teacher"
          color="#2e2e3a"
          text
          nuxt
          to="/create"
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
      <Snackbar />
    </v-main>
    <AppFooter />
    <CreateClass v-if="teacher" />
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Logo from '@/components/common/Logo'
import Snackbar from '@/components/common/Snackbar'
import AppFooter from '@/components/common/AppFooter'
import CreateClass from '@/components/teacher/CreateClass'
import {
  mdiPlus,
  mdiAccountCircleOutline,
  mdiChevronDown,
  mdiOpenInNew,
} from '@mdi/js'

export default {
  name: 'App',
  components: {
    Logo,
    Snackbar,
    AppFooter,
    CreateClass,
  },
  middleware: ['get-user'],
  data() {
    return {
      // keyedClient: {},
      // stream: {},
    }
  },
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
    }),
    ...mapGetters({ activeGroups: 'groups/activeGroups' }),
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiAccountCircleOutline,
      mdiChevronDown,
      mdiOpenInNew,
    }
  },
  // TODO
  // async mounted() {
  //   this.keyedClient = await createClient(localStorage.getItem('secret'))
  //   // For students, open a document stream
  //   // This mirrors examMode and receives new assignments
  //   if (!this.user.teacher) {
  //     this.stream = this.keyedClient.stream
  //       .document(q.Ref(q.Collection('User'), this.user.id))
  //       .on('start', () => {
  //         console.log(`%c Stream started`, 'color:orange')
  //       })
  //       .on('version', async (data, event) => {
  //         console.log(`Received ${event.type} event`)
  //         if ('newAssignment' in data.document.data) {
  //           try {
  //             const assignment = await getNewAssignment(
  //               data.document.data.newAssignment
  //             )
  //             this.$snack.showMessage({
  //               type: '',
  //               msg: 'New assignment added',
  //             })
  //             this.$store.commit('user/newAssignment', assignment)
  //           } catch (e) {
  //             console.error(e)
  //           }
  //         }
  //         this.$store.commit('user/setExamMode', data.document.data.examMode)
  //       })
  //       .on('error', (data, event) => {
  //         console.error(data, event)
  //         // N.B. Do not manually restart stream
  //         // (it automatically retries?)
  //       })
  //     this.stream.start()
  //   }
  // },
  methods: {
    createClass() {
      this.$nuxt.$emit('new-class')
    },
    // Students and teachers have the same 'Classes' menu
    // so we need to customise how menu items links behave
    // For students, we navigate by changing the
    // activeGroupIndex store property
    nav(i, id) {
      if (this.teacher) {
        this.$router.push(`/group/${id}`)
      } else {
        this.$store.commit('groups/setActiveGroupIndex', i)
        this.$router.push(`/home`)
      }
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
