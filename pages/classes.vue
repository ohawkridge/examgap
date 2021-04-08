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
            :class="outline && n === 1 ? 'point-out' : ''"
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
      <template v-for="(group, i) in tabGroups">
        <GroupCard
          v-if="group.active === tab"
          :key="i"
          :group="group"
          :group-index="i"
          :outline="outline && n === 2"
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
      tabGroups: 'groups/tabGroups',
      activeGroups: 'groups/activeGroups',
    }),
    ...mapState({ n: (state) => state.user.onboardStep }),
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
  created() {
    this.$icons = { mdiPlus }
  },
  mounted() {
    // Hide outline when snackbar closed
    this.$nuxt.$on('close', () => {
      this.outline = false
    })
    // Show onboarding? Which step?
    if (this.activeGroups.length === 0 || this.activeGroups.length === 1) {
      this.$store.commit('user/setOnboardStep', this.activeGroups.length + 1)
      this.outline = true
      this.$nuxt.$emit('onboarding', true)
    }
  },
}
</script>

<style scoped>
/* create class card */
#create-class {
  background: #f1eeee !important;
  border: 1px dashed #0078a0 !important;
}
</style>
