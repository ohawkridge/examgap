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
            :class="onboard && n === 1 ? 'point-out' : ''"
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
          :onboard="n === '2' && onboard"
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
    <onboarding-snackbar :n="n" :text="text" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      onboard: false,
    }
  },
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    ...mapGetters({ groups: 'groups/activeGroups' }),
    // Remember active tab
    tab: {
      get() {
        return this.$store.state.groups.tab
      },
      set(value) {
        this.$store.commit('groups/setTab', value)
      },
    },
    // Onboarding info
    n() {
      return this.groups.length === 0 ? '1' : '2'
    },
    text() {
      return this.groups.length === 0
        ? `To get started, click + ${
            this.$vuetify.breakpoint.name === 'xs' ? 'Class' : 'Create Class'
          }.`
        : 'Click on the class you created.'
    },
  },
  created() {
    this.$icons = { mdiPlus }
  },
  mounted() {
    this.$nuxt.$on('close', () => {
      this.onboard = false
    })
    if (this.groups.length < 2) this.onboard = true
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
