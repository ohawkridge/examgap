<template>
  <div>
    <!-- Skeletons -->
    <v-container v-if="$fetchState.pending">
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <v-skeleton-loader
            type="list-item-avatar"
            :loading="true"
            class="mt-3"
            width="16%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            class="mt-8"
            width="15%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            class="mt-8"
            width="15%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            class="my-8"
            width="10%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="image"
            :loading="true"
            height="14%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="image"
            :loading="true"
            height="14%"
            class="pt-1"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="image"
            :loading="true"
            height="14%"
            class="pt-1"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row class="justify-center">
        <v-col cols="12" md="10" class="d-flex align-center">
          <v-btn text rounded class="mr-2" @click="$router.go(-1)">
            <font-awesome-icon
              icon="fa-light fa-arrow-left"
              class="mr-2 ico-btn"
            />
            Back
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="7">
          <div class="d-flex align-center mb-2">
            <span class="fix-width font-weight-medium">Start:</span>
            {{ assignment.start | date }}
          </div>
          <div class="d-flex align-center mb-2">
            <span class="fix-width font-weight-medium">Due:</span>
            {{ assignment.dateDue | date }}
          </div>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-md-end">
          <!-- Hide label on mobile -->
          <span class="fix-width font-weight-medium"> Score: </span>
          {{ `${score.marks}/${score.max}` }}
          <v-chip label :color="rag" class="font-weight-bold adj ml-2">
            {{ ave }}%
          </v-chip>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <p class="text-subtitle-1 font-weight-bold">
            Question{{ assignment.questions.length | pluralize }} ({{
              assignment.questions.length
            }})
          </p>
          <v-list id="questions" class="py-0">
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
    const id = this.$route.params.assignment
    await this.$store.dispatch('assignment/getAssignment', id)
  },
  computed: {
    ...mapState({
      assignment: (state) => state.assignment.assignment,
    }),
    rag() {
      if (!this.started) return ''
      if (this.ave <= 33) return 'red'
      if (this.ave > 66) return 'green'
      else return 'orange'
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
  mounted() {
    this.$store.commit('app/setPageTitle', this.assignment.name)
  },
}
</script>

<style scoped>
/* align labels */
.fix-width {
  display: inline-block;
  width: 56px;
}

.ico-btn {
  height: 18px;
  width: 18px;
}

/* align chip with score */
.adj {
  position: relative;
  top: -4px;
}

#questions {
  border: 1px solid #d2d2d2 !important;
}
</style>
