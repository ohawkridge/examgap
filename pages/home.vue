<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader :loading="$fetchState.pending" type="heading">
          <div class="text-h6 font-weight-black">
            {{ $fetchState.pending ? 'Loading' : group.name }}
          </div>
        </v-skeleton-loader>
        <v-skeleton-loader
          :loading="$fetchState.pending"
          type="text"
          width="50%"
        >
          <!-- skeleton-loader buggy if v-if on div -->
          <div>
            {{
              $fetchState.pending
                ? '...'
                : `${group.course.name} (${group.course.board})`
            }}
          </div>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="7">
        <TheAssignmentsCard />
      </v-col>
      <v-col cols="12" md="5">
        <v-row>
          <v-col cols="12">
            <the-quote-of-the-day />
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="12">
            <v-sheet v-if="true" elevation="2" class="pa-4">
              <v-skeleton-loader
                v-bind="attrs"
                :loading="true"
                width="200%"
                type="heading"
              >
              </v-skeleton-loader>
              <v-skeleton-loader
                v-for="n in 8"
                :key="n"
                :loading="true"
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
        </v-row> -->
      </v-col>
    </v-row>
    <!-- <HomeRevisionDialog /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TheAssignmentsCard from '@/components/student/TheAssignmentsCard'
// import HomeRevisionDialog from '@/components/student/HomeRevisionDialog'
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'

export default {
  components: {
    TheAssignmentsCard,
    TheQuoteOfTheDay,
    // HomeRevisionDialog,
  },
  layout: 'app',
  data() {
    return {
      attrs: {
        class: 'mb-8',
      },
    }
  },
  async fetch() {
    // Dispatch store action to get groups + assignments
    await this.$store.dispatch('user/getGroups', {
      secret: this.$store.state.user.secret,
    })
  },
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
  },
  methods: {
    // Remember revision topic
    revise(topic) {
      this.$store.commit('topics/setTopicId', topic.id)
      // Event bus using Nuxt
      // https://aneesshameed.medium.com/event-bus-in-nuxt-7728315e81b6
      this.$nuxt.$emit('show-revise')
    },
    // Dispatch action to fetch revision topics
    // TODO
    // getTopics() {
    //   if (this.topics.length === 0) {
    //     this.$store.dispatch('groups/getRevisionTopics')
    //   }
    // },
  },
}
</script>
