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
        <the-assignments-card />
      </v-col>
      <v-col cols="12" md="5">
        <v-row>
          <v-col cols="12">
            <the-quote-of-the-day />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <the-revision-card />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TheAssignmentsCard from '@/components/student/TheAssignmentsCard'
import TheRevisionCard from '@/components/student/TheRevisionCard'
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'

export default {
  components: {
    TheAssignmentsCard,
    TheRevisionCard,
    TheQuoteOfTheDay,
  },
  layout: 'app',
  async fetch() {
    console.log('fetching groups..')
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
