<template>
  <div>
    <!-- Skeletons -->
    <template v-if="$fetchState.pending">
      <div class="px-4 py-8">
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
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex align-center">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-btn icon class="mr-2" @click="$router.go(-1)" v-on="on">
                  <font-awesome-icon
                    icon="fa-light fa-arrow-left"
                    class="ico-btn"
                  />
                </v-btn>
              </template>
              <span>Back</span>
            </v-tooltip>
            <span class="text-h6">{{ assignment.name }}</span>
          </v-col>
          <v-col cols="8">
            <div class="d-flex align-center mb-2" style="height: 32px">
              <span class="fix-width font-weight-medium">Start:</span>
              {{ assignment.start | date }}
            </div>
            <div class="d-flex align-center mb-2">
              <span class="fix-width font-weight-medium">Due:</span>
              {{ assignment.dateDue | date }}
            </div>
          </v-col>
          <v-col cols="4">
            <div class="mb-2 d-flex align-center">
              <span
                v-if="$vuetify.breakpoint.name !== 'xs'"
                class="fix-width2 font-weight-medium"
                >Score:</span
              >
              {{ `${s.total}/${s.max}` }}
              <v-chip label :color="s.color" class="ml-2 font-weight-bold">
                {{ s.ave }}%
              </v-chip>
            </div>
            <div>
              <span
                v-if="$vuetify.breakpoint.name !== 'xs'"
                class="fix-width2 font-weight-medium"
                >Accuracy:
              </span>
              <font-awesome-icon
                v-else
                icon="fa-light fa-bullseye-arrow"
                class="fa-lg mr-2"
              />
              <!-- XX% -->
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p class="text-subtitle-1 font-weight-bold">
              Question{{ assignment.questions.length | pluralize }} ({{
                assignment.questions.length
              }})
            </p>
          </v-col>
        </v-row>
      </v-container>
      <v-list id="q-list">
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
}
</script>

<style scoped>
/* Align start/due dates */
.fix-width {
  display: inline-block;
  width: 56px;
}

.fix-width2 {
  display: inline-block;
  width: 80px;
}

.ico-btn {
  height: 24px;
  width: 24px;
}

#q-list {
  border-top: 1px solid #d2d2d2 !important;
  background-color: #fafafa;
}
</style>
