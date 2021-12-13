<template>
  <v-container class="pt-10">
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <v-card v-if="$fetchState.pending" class="rounded-lg pa-4">
          <!-- Skeletons -->
          <v-skeleton-loader
            type="list-item-avatar"
            :loading="true"
            class="mt-3"
            width="48%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            class="mt-8 ml-6"
            width="20%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            class="my-8 ml-6"
            width="20%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="heading"
            :loading="true"
            class="my-8 ml-6"
            width="25%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="image"
            :loading="true"
            class="px-5 pb-6"
          ></v-skeleton-loader>
        </v-card>
        <v-card v-else class="rounded-lg pa-4">
          <v-card-title>
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
            {{ assignment.name }}
          </v-card-title>
          <v-card-text class="text-body-1">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center mb-2">
                    <span class="align-date font-weight-bold">Start:</span>
                    {{ assignment.start | date }}
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="align-date font-weight-bold">Due:</span>
                    {{ assignment.dateDue | date }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <span class="align-date font-weight-bold"> Score: </span>
                  {{ `${score.marks}/${score.max}` }}
                  <span
                    :class="rag"
                    class="font-weight-bold text--darken-2 ml-1"
                    >({{ ave }}%)</span
                  >
                </v-col>
              </v-row>
              <v-row class="justify-center">
                <v-col cols="12">
                  <p class="text-subtitle-1 font-weight-bold">
                    Question{{ assignment.questions.length | pluralize }} ({{
                      assignment.questions.length
                    }})
                  </p>
                  <v-divider />
                  <v-list>
                    <assignment-question
                      v-for="(question, i) in assignment.questions"
                      :key="i"
                      :assignment-id="assignment.id"
                      :question="question"
                    />
                  </v-list>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    const id = this.$route.params.assignment
    await this.$store.dispatch('assignment/getAssignment', id)
  },
  computed: {
    ...mapState({
      assignment: (state) => state.assignment.assignment,
    }),
    rag() {
      if (!this.started) return ''
      if (this.ave <= 33) return 'red--text'
      if (this.ave > 66) return 'green--text'
      else return 'orange--text'
    },
    ave() {
      if (!this.started || this.score.max === 0) return '-'
      return Math.round((this.score.marks / this.score.max) * 100)
    },
    // Count teacher marks for each response
    // for each question to find x/y score
    score() {
      let marks = 0
      let max = 0
      // Each question contains an array of responses
      // Logout defense
      if ('questions' in this.assignment) {
        for (const q of this.assignment.questions) {
          for (const r of q.responses) {
            marks += r.tm
          }
          max += parseInt(q.maxMark)
        }
      }
      return { marks, max }
    },
    // Has the student started the assignment?
    // If not, we don't calculate the ave.
    started() {
      for (const q of this.assignment.questions) {
        for (const r of q.responses) {
          if (r.marked === true) {
            return true
          }
        }
      }
      return false
    },
  },
}
</script>
