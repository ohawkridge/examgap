<template>
  <!-- Student home page -->
  <div>
    <v-row>
      <v-col id="div1" cols="12">
        <div v-if="group !== undefined" class="text-h6 font-weight-bold">
          {{ group.name }}
        </div>
        <div v-if="group !== undefined">
          {{ group.course.name }} ({{ group.course.board }})
        </div>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title>
            Assignments ({{
              group !== undefined && group.assignments
                ? group.assignments.length
                : '-'
            }})
          </v-card-title>
          <v-card-text>
            <HomeAssignments
              v-if="group !== undefined"
              :assignments="group.assignments"
            />
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
            <v-skeleton-loader :loading="$fetchState.pending" type="card">
              <v-card>
                <v-card-title>
                  Revision topics ({{ topics.length }})
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="(topic, i) in topics"
                      :key="i"
                      :title="`Revise ${topic.name}`"
                      class="rev-item"
                      :disabled="topic.count === 0"
                      @click="revise(topic)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ topic.name }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-chip
                          :color="topic.answered > 0 ? 'green-chip' : ''"
                          >{{ topic.answered }}</v-chip
                        >
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-skeleton-loader>
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
      forceFetch: false,
    }
  },
  async fetch() {
    // Dispatch action to fetch + store revision topics
    if (this.forceFetch || this.topics.length === 0) {
      await this.$store.dispatch('groups/getRevisionTopics')
      this.forceFetch = false
    }
  },
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    ...mapState({
      assignments: (state) => state.assignments.assignments,
      topics: (state) => state.groups.revisionTopics,
    }),
    // Get the current active group
    // Get groups for 'Classes' menu
    ...mapGetters({
      group: 'groups/activeGroup',
      groups: 'groups/activeGroups',
    }),
  },
  watch: {
    // Update revision topics if class is changed
    // (Except if logging out)
    group() {
      if (this.group !== undefined && Object.entries(this.group).length > 0) {
        this.forceFetch = true
        this.$fetch()
      }
    },
  },
  methods: {
    // Remember topic being revised
    revise(topic) {
      this.$store.commit('groups/setCurrentRevisionTopic', topic)
      // Event bus using Nuxt
      // https://aneesshameed.medium.com/event-bus-in-nuxt-7728315e81b6
      this.$nuxt.$emit('show-revise')
    },
  },
}
</script>

<style scoped>
/* revision count chips */
span.v-chip.theme--light.green-chip {
  background-color: rgb(201, 237, 194) !important;
  color: rgb(18, 39, 14) !important;
}
</style>
