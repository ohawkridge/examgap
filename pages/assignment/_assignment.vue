<template>
  <div>
    <!-- Skeletons -->
    <template v-if="$fetchState.pending">
      <div class="pa-4">
        <v-skeleton-loader
          type="text@3"
          :loading="true"
          width="16%"
          class="float-right mt-4"
          style="margin-right: 22%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="list-item-avatar"
          :loading="true"
          width="40%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="image"
          :loading="true"
          width="100%"
          class="pt-8 pa-4"
        ></v-skeleton-loader>
      </div>
    </template>
    <template v-else>
      <div class="pa-4 d-flex justify-space-between">
        <div style="width: 60%">
          <div class="text-h6">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-btn nuxt to="/home" icon class="mr-2" v-on="on">
                  <v-icon>{{ $icons.mdiArrowLeft }}</v-icon>
                </v-btn>
              </template>
              <span>Back</span>
            </v-tooltip>
            {{ assignment.name }}
          </div>
          <p class="ml-12">
            {{ assignment.questions.length }} Question{{
              assignment.questions.length | pluralize
            }}
          </p>
        </div>
        <div style="width: 40%">
          <div class="d-flex align-center mb-2">
            <span class="fix-width font-weight-medium">Start:</span>
            {{ assignment.start | date }}
          </div>
          <div class="d-flex align-center mb-2">
            <span class="fix-width font-weight-medium">Due:</span>
            {{ assignment.dateDue | date }}
          </div>
          <div class="d-flex align-center">
            <span class="fix-width font-weight-medium">Score:</span>
            {{ `${s.total}/${s.max}` }}
            <v-chip small label :color="s.color" class="ml-2 font-weight-bold">
              {{ s.ave }}%
            </v-chip>
          </div>
        </div>
      </div>
      <v-list style="border-top: 1px solid #d2d2d2 !important" class="py-0">
        <assignment-question
          v-for="(question, i) in assignment.questions"
          :key="i"
          :assignment-id="assignment.id"
          :question="question"
        />
      </v-list>
    </template>
  </div>
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
  async fetch() {
    // Dispatch action to get assignment
    await this.$store.dispatch(
      'assignment/getAssignment',
      this.$route.params.assignment
    )
  },
  computed: {
    ...mapState({
      // Render page from store data
      assignment: (state) => state.assignment.assignment,
    }),
    // Create an object containing overall score
    // (including RAG colour-code)
    s() {
      let total = 0
      let max = 0
      let ave = 0
      let color = ''
      // Each question contains an array of responses
      for (const q of this.assignment.questions) {
        const mm = parseInt(q.maxMark)
        for (const r of q.responses) {
          // Only count teacher marked responses
          if (r.marked) {
            total += r.tm
            max += mm
          }
        }
      }
      // If max is 0, student probably hasn't answered any questions
      // Use questions to find max instead and avoid DIV0 in ave.
      if (max === 0) {
        ave = '-'
        const x = this.assignment.questions.map((q) => parseInt(q.maxMark))
        max = x.reduce((a, b) => a + b, 0)
      } else {
        ave = Math.round((total / max) * 100)
        // Add RAG color class
        if (ave <= 33) color = 'red'
        else if (ave > 66) color = 'green'
        else color = 'orange'
      }
      return { total, max, ave, color }
    },
  },
  created() {
    this.$icons = {
      mdiArrowLeft,
    }
  },
}
</script>

<style scoped>
/* Align start/due dates */
.fix-width {
  display: inline-block;
  width: 60px;
}
</style>
