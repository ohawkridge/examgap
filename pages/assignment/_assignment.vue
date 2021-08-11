<template>
  <div>
    <!-- Skeletons -->
    <template v-if="$fetchState.pending">
      <div class="pa-3">
        <v-skeleton-loader
          v-bind="attrs"
          type="heading"
          :loading="true"
          class=""
          height="40"
          width="70%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          v-bind="attrs"
          type="text@2"
          :loading="true"
          width="200"
        ></v-skeleton-loader>
        <v-skeleton-loader
          v-bind="attrs"
          type="image"
          :loading="true"
          width="95%"
          class="mx-auto"
        ></v-skeleton-loader>
      </div>
    </template>
    <template v-else>
      <div class="pa-3 d-flex justify-space-between">
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
          <div class="ml-10">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <svg
                  height="42"
                  width="42"
                  viewBox="0 0 24 24"
                  role="img"
                  fill="#c0c0c0"
                  v-on="on"
                >
                  <path :d="$icons.mdiMedalOutline"></path>
                </svg>
              </template>
              <span>Reward</span>
            </v-tooltip>
          </div>
        </div>
        <div style="width: 40%">
          <div class="text-subtitle-1">
            <span class="fix-width font-weight-medium">Start:</span>
            {{ assignment.start | date }}
          </div>
          <div class="text-subtitle-1">
            <span class="fix-width font-weight-medium">Due:</span>
            {{ assignment.dateDue | date }}
          </div>
          <div class="text-subtitle-1">
            <span class="fix-width font-weight-medium">Score:</span>
            {{ `${s.total}/${s.max} (${s.ave}%)` }}
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
import { mdiArrowLeft, mdiMedalOutline } from '@mdi/js'
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
    s() {
      let total = 0
      let max = 0
      // Each question contains an array of responses
      for (const q of this.assignment.questions) {
        const mm = parseInt(q.maxMark)
        for (const r of q.responses) {
          total += r.tm
          max += mm
        }
      }
      return { total, max, ave: Math.round((total / max) * 100) }
    },
  },
  created() {
    this.$icons = {
      mdiArrowLeft,
      mdiMedalOutline,
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
