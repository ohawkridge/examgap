<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader v-if="loading" :loading="true" type="heading">
        </v-skeleton-loader>
        <v-skeleton-loader
          v-if="loading"
          :loading="true"
          type="text"
          width="50%"
        >
        </v-skeleton-loader>
        <template v-else>
          <div class="text-h6 font-weight-black">
            {{ group.name }}
          </div>
          <div>{{ group.course.name }} ({{ group.course.board }})</div>
        </template>
      </v-col>
    </v-row>
    <divider-row />
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
}
</script>
