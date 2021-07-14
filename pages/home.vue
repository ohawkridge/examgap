<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader :loading="loading" type="heading">
          <div class="text-h6 font-weight-black">
            {{ loading ? 'Loading' : group.name }}
          </div>
        </v-skeleton-loader>
        <v-skeleton-loader :loading="loading" type="text" width="50%">
          <!-- skeleton-loader buggy if v-if on div -->
          <div>
            {{
              loading ? '...' : `${group.course.name} (${group.course.board})`
            }}
          </div>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <divider-row />
    <v-row>
      <v-col cols="12" md="7">
        <the-assignments-card :fetching="loading" />
      </v-col>
      <v-col cols="12" md="5">
        <v-row>
          <v-col cols="12">
            <the-quote-of-the-day />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <the-revision-card :fetching="loading" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TheAssignmentsCard from '@/components/student/TheAssignmentsCard'
import TheRevisionCard from '@/components/student/TheRevisionCard'
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'
import DividerRow from '@/components/common/DividerRow'

export default {
  components: {
    TheAssignmentsCard,
    TheRevisionCard,
    TheQuoteOfTheDay,
    DividerRow,
  },
  layout: 'app',
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    ...mapState({
      loading: (state) => state.app.loading,
    }),
  },
  methods: {
    // Remember revision topic
    revise(topic) {
      this.$store.commit('topics/setTopicId', topic.id)
      // Event bus using Nuxt
      // https://aneesshameed.medium.com/event-bus-in-nuxt-7728315e81b6
      this.$nuxt.$emit('show-revise')
    },
  },
}
</script>
