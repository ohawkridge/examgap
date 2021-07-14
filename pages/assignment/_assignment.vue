<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12">
      <v-sheet v-if="$fetchState.pending" elevation="2" class="pa-7 mt-sm-3">
        <v-skeleton-loader
          v-bind="attrs"
          type="heading"
          :loading="$fetchState.pending"
          class=""
          height="40"
        ></v-skeleton-loader>
        <v-skeleton-loader
          v-bind="attrs"
          type="text@2"
          :loading="$fetchState.pending"
          width="200"
        ></v-skeleton-loader>
        <v-skeleton-loader
          v-bind="attrs"
          type="image"
          :loading="$fetchState.pending"
          width="95%"
          class="mx-auto"
        ></v-skeleton-loader>
      </v-sheet>
      <v-card v-if="!$fetchState.pending" class="mt-sm-3">
        <v-card-text class="pa-md-3">
          <v-container>
            <p class="text-h6">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn nuxt to="/home" icon v-on="on">
                    <v-icon>{{ $icons.mdiArrowLeft }}</v-icon>
                  </v-btn>
                </template>
                <span>Back</span>
              </v-tooltip>
              {{ $fetchState.pending ? 'Loading...' : assignment.name }}
            </p>
            <div class="text-subtitle-1">
              <span class="fix-width font-weight-medium">Start:</span>
              {{ assignment.start | date }}
            </div>
            <div class="text-subtitle-1">
              <span class="fix-width font-weight-medium">Due:</span>
              {{ assignment.dateDue | date }}
            </div>
            <v-list>
              <AssignmentQuestion
                v-for="(question, i) in assignment.questions"
                :key="i"
                :assignment-id="assignment.id"
                :question="question"
              />
            </v-list>
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { mdiArrowLeft } from '@mdi/js'
import AssignmentQuestion from '@/components/student/AssignmentQuestion'

export default {
  components: {
    AssignmentQuestion,
  },
  layout: 'app',
  data() {
    return {
      // Common attributes for skeleton-loaders
      attrs: {
        class: 'mb-6',
      },
    }
  },
  async fetch() {
    // Dispatch store action to get assignment
    // (allows page to survive refresh as assignment data will be in store)
    console.log('%c' + 'fetch (getAssignment)', 'color:orange')
    await this.$store.dispatch(
      'assignment/getAssignment',
      this.$route.params.assignment
    )
  },
  head() {
    return {
      title: this.assignment.name,
    }
  },
  computed: {
    ...mapState({
      assignment: (state) => state.assignment.assignment,
      // '' until after first save
      responseId: (state) => state.assignment.responseId,
    }),
  },
  created() {
    this.$icons = {
      mdiArrowLeft,
    }
  },
}
</script>

<style scoped>
/* align start/due dates */
.fix-width {
  display: inline-block;
  width: 60px;
}
</style>
