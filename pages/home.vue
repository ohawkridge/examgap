<template>
  <!-- Student home page -->
  <div>
    <v-row>
      <v-col cols="12" class="px-3">
        <div class="pl-4">
          <div v-if="group !== undefined" class="text-h6 font-weight-bold">
            {{ group.name }}
          </div>
          <div v-if="group !== undefined">
            {{ group.course.name }} ({{ group.course.board }})
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="7">
        <v-card class="eg-card">
          <v-card-title v-if="assignments">
            Assignments ({{ assignments.length }})
          </v-card-title>
          <v-card-text>
            <HomeAssignments v-if="assignments" :assignments="assignments" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-row>
          <v-col cols="12">
            <HomeQuote />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-sheet v-if="loading" elevation="2" class="pa-4">
              <v-skeleton-loader
                v-bind="attrs"
                :loading="loading"
                width="200%"
                type="heading"
              >
              </v-skeleton-loader>
              <v-skeleton-loader
                v-for="n in 9"
                :key="n"
                :loading="loading"
                type="text"
                v-bind="attrs"
              >
              </v-skeleton-loader>
            </v-sheet>
            <v-card v-else>
              <v-card-title>
                Revision topics ({{ topics.length }})
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(topic, i) in topics"
                    :key="i"
                    :title="`Revise ${topic.name}`"
                    class="px-0 px-md-3"
                    :disabled="topic.count === 0"
                    @click="revise(topic)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ topic.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-chip :color="topic.answered > 0 ? 'green' : ''">{{
                        topic.answered
                      }}</v-chip>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <HomeRevisionDialog />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import HomeAssignments from '@/components/student/HomeAssignments'
import HomeRevisionDialog from '@/components/student/HomeRevisionDialog'
import HomeQuote from '@/components/student/HomeQuote'

export default {
  components: {
    HomeAssignments,
    HomeQuote,
    HomeRevisionDialog,
  },
  layout: 'app',
  data() {
    return {
      attrs: {
        class: 'mb-8',
      },
    }
  },
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    // Get current active group
    ...mapGetters({ group: 'groups/activeGroup' }),
    ...mapState({
      groups: (state) => state.groups.groups,
      topics: (state) => state.groups.revisionTopics,
      loading: (state) => state.groups.loading,
    }),
    // Filter out post-dated assignments
    assignments() {
      if (this.group === undefined) return false
      return this.group.assignments.filter(
        (ass) => ass.start === 'N/A' || new Date(ass.start) <= new Date()
      )
    },
  },
  watch: {
    group() {
      // Update revision topics if class is changed
      // (except if logging out)
      if (this.group !== undefined && Object.entries(this.group).length > 0) {
        this.getTopics()
      }
    },
  },
  created() {
    // User could return to /home without signing in
    // ∴ new assignments might be missing so call
    // getUser periodically or when /home URL entered
    if (
      this.$store.state.user.lastFetch !== '' &&
      Date.now() - this.$store.state.user.lastFetch > 900000 // 15 mins.
    ) {
      console.log('Stale data..')
      this.$store.dispatch('user/getUser')
    }
  },
  methods: {
    // Remember revision topic
    revise(topic) {
      this.$store.commit('groups/setCurrentRevisionTopic', topic)
      // Event bus using Nuxt
      // https://aneesshameed.medium.com/event-bus-in-nuxt-7728315e81b6
      this.$nuxt.$emit('show-revise')
    },
    // Dispatch action to fetch revision topics
    getTopics() {
      if (this.topics.length === 0) {
        this.$store.dispatch('groups/getRevisionTopics')
      }
    },
  },
}
</script>
