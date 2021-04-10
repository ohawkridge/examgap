<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <v-btn-toggle v-model="tab" color="primary" group mandatory>
            <v-btn :value="true" class="rounded"> Classes </v-btn>
            <v-btn :value="false" class="rounded"> Archive </v-btn>
          </v-btn-toggle>
          <v-btn
            color="primary"
            elevation="0"
            :class="onboard && n === 1 ? 'red-outline' : ''"
            @click="$nuxt.$emit('show-create')"
          >
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            {{ $vuetify.breakpoint.name == 'xs' ? 'Class' : 'Create Class' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-divider class="primary" />
      </v-col>
    </v-row>
    <v-row>
      <template v-for="(group, i) in groups">
        <GroupCard
          v-if="group.active === tab"
          :key="i"
          :group="group"
          :group-index="i"
          :outline="onboard && n === 2"
        />
      </template>
      <!-- Create class card -->
      <v-col v-if="tab" cols="12" md="6" lg="4">
        <v-card
          id="create-class"
          class="d-flex align-center justify-center"
          outlined
          hover
          height="172"
          @click="$nuxt.$emit('show-create')"
        >
          <v-btn color="primary" text>
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            Create class
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <create-class />
    <onboarding-snackbar />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mdiPlus } from '@mdi/js'
import GroupCard from '@/components/teacher/GroupCard'
import CreateClass from '@/components/teacher/CreateClass'
import OnboardingSnackbar from '@/components/teacher/OnboardingSnackbar.vue'

export default {
  components: {
    GroupCard,
    CreateClass,
    OnboardingSnackbar,
  },
  layout: 'app',
  data() {
    return {
      outline: false,
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
      activeGroupCount: 'groups/activeGroupCount',
    }),
    ...mapState({
      groups: (state) => state.groups.groups,
      onboard: (state) => state.user.onboard,
      n: (state) => state.user.onboardStep,
    }),
    // Remember active tab
    tab: {
      get() {
        return this.$store.state.groups.tab
      },
      set(value) {
        this.$store.commit('groups/setTab', value)
      },
    },
  },
  watch: {
    tab() {
      this.isOnboarding()
    },
  },
  mounted() {
    this.isOnboarding()
  },
  created() {
    this.$icons = { mdiPlus }
  },
  methods: {
    isOnboarding() {
      if (this.activeGroupCount === 0 && this.tab) {
        this.$store.commit('user/setOnboard', true)
        this.$store.commit('user/setOnboardStep', 1)
      } else {
        this.$store.commit('user/setOnboard', false)
      }
    },
  },
}
</script>

<style scoped>
#create-class {
  background: #f1eeee !important;
  border: 1px dashed #0078a0 !important;
}
</style>
