<template>
  <v-row>
    <v-col cols="12">
      <v-sheet v-if="$fetchState.pending" elevation="2" class="pa-7 mt-md-3">
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
          type="image@2"
          :loading="$fetchState.pending"
          width="95%"
          class="mx-auto"
        ></v-skeleton-loader>
      </v-sheet>
      <v-card v-if="!$fetchState.pending" class="pa-md-3 mt-md-3">
        <v-card-text>
          <v-row>
            <v-col>
              <p class="text-h6">{{ assignment.name }}</p>
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
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
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
  fetch() {
    // Dispatch store action to get assignment
    // (allows page to survive refresh as assignment data will be in store)
    this.$store.dispatch(
      'assignments/getAssignment',
      this.$route.params.assignment
    )
  },
  head() {
    return {
      title: this.assignment.name,
    }
  },
  computed: {
    ...mapState({ assignment: (state) => state.assignments.assignment }),
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
