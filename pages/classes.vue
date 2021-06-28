<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <v-btn-toggle v-model="tab" color="primary" group mandatory>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn v-bind="attrs" :value="true" class="rounded" v-on="on">
                  <v-icon left>{{ $icons.mdiHomeOutline }}</v-icon>
                  Home
                </v-btn>
              </template>
              <span>Home</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn v-bind="attrs" :value="false" class="rounded" v-on="on">
                  <v-icon left>{{ $icons.mdiArchiveOutline }}</v-icon>
                  Archive
                </v-btn>
              </template>
              <span>Archive</span>
            </v-tooltip>
          </v-btn-toggle>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                elevation="0"
                :class="obs === 1 ? 'red-out' : ''"
                @click="$nuxt.$emit('show-create')"
                v-on="on"
              >
                <v-icon left>{{ $icons.mdiPlus }}</v-icon>
                {{
                  $vuetify.breakpoint.name == 'xs' ? 'Class' : 'Create Class'
                }}
              </v-btn>
            </template>
            <span>Create class</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="(group, i) in groups">
        <GroupCard
          v-if="group.active === tab"
          :key="i"
          :group="group"
          :group-index="i"
        />
      </template>
      <!-- Create class card -->
      <v-col v-if="tab && activeGroupCount > 0" cols="12" md="6" lg="4">
        <v-hover v-slot="{ hover }">
          <v-card
            :id="hover ? 'cc2' : 'cc1'"
            class="d-flex align-center justify-center"
            outlined
            hover
            height="172"
            @click="$nuxt.$emit('show-create')"
          >
            <v-btn text :color="hover ? 'primary' : ''">
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              Create class
            </v-btn>
          </v-card>
        </v-hover>
      </v-col>
      <!-- Empty state -->
      <template v-if="!loading && activeGroupCount === 0 && tab">
        <v-col id="empty" cols="12">
          <v-img src="/no-class.svg" alt="Empty chair illustration" />
        </v-col>
        <v-col cols="12" class="text-center">
          <p class="text-body-2 mt-4">No classes yet</p>
          <v-btn
            elevation="0"
            color="primary"
            @click="$nuxt.$emit('show-create')"
          >
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            Create class
          </v-btn>
        </v-col>
      </template>
    </v-row>
    <onboarding-snackbar />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mdiPlus, mdiHomeOutline, mdiArchiveOutline } from '@mdi/js'
import GroupCard from '@/components/teacher/GroupCard'
import OnboardingSnackbar from '@/components/teacher/OnboardingSnackbar.vue'

export default {
  components: {
    GroupCard,
    OnboardingSnackbar,
  },
  layout: 'app',
  data() {
    return {
      outline: false,
    }
  },
  async fetch() {
    // Dispatch store action to get groups + assignments
    if (this.$store.state.user.groups.length === 0) {
      console.log('%c' + 'fetch (classes.vue)..', 'color:purple')
      await this.$store.dispatch('user/getGroups', {
        secret: this.$store.state.user.secret,
        teacher: this.$store.state.user.teacher,
      })
    }
  },
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    ...mapGetters({
      // N.B. You *cannot* use this for GroupCards
      // The filter will throw off activeGroupIndex
      activeGroupCount: 'user/activeGroupCount',
    }),
    ...mapState({
      groups: (state) => state.user.groups,
      obs: (state) => state.user.onboardStep,
      loading: (state) => state.user.loading,
    }),
    // Remember active tab
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
  },
  created() {
    this.$icons = { mdiPlus, mdiHomeOutline, mdiArchiveOutline }
  },
}
</script>

<style scoped>
/* create class card hover */
#cc1 {
  background: #fefcfb !important;
  border: 1px dashed darkgray !important;
}

#cc2 {
  background: #fefcfb !important;
  border: 2px dashed #0078a0 !important;
}

/* shrink empty state graphic */
#empty {
  padding-left: 6em;
  padding-right: 6em;
}
/* window is 600px or more */
@media only screen and (min-width: 600px) {
  #empty {
    padding-left: 40%;
    padding-right: 40%;
  }
}
</style>
