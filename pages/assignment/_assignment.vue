<template>
  <v-container v-if="!$fetchState.pending">
    <v-row class="justify-center">
      <v-col cols="8" md="6">
        <p>
          <span class="align-date text-subtitle-1 font-weight-medium"
            >Start:</span
          >
          <font-awesome-icon
            icon="fa-light fa-calendar-day"
            class="fa-lg mr-1"
          />
          {{ assignment.start | date }}
        </p>
        <p>
          <span class="align-date text-subtitle-1 font-weight-medium"
            >Due:</span
          >
          <font-awesome-icon
            icon="fa-light fa-calendar-day"
            class="fa-lg mr-1"
          />
          {{ assignment.dateDue | date }}
        </p>
      </v-col>
      <v-col cols="4" md="4">
        <p>
          <span
            v-if="$vuetify.breakpoint.name !== 'xs'"
            class="align-date text-subtitle-1 font-weight-medium"
          >
            Score:
          </span>
          {{ `${score.marks}/${score.max}` }}
          <v-chip :color="rag" class="ml-2 ave" label> {{ ave }}% </v-chip>
        </p>
        <!-- Room for more stats in future -->
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <p class="text-subtitle-1 font-weight-medium">
          Question{{ assignment.questions.length | pluralize }} ({{
            assignment.questions.length
          }})
        </p>
        <v-divider />
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="9">
        <question-card
          v-for="(question, i) in assignment.questions"
          :key="i"
          :question="question"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import QuestionCard from '~/components/student/QuestionCard.vue'

export default {
  components: { QuestionCard },
  layout: 'app',
  async fetch() {
    const id = this.$route.params.assignment
    await this.$store.dispatch('assignment/getAssignment', id)
    this.$store.commit('app/setPageTitle', this.assignment.name)
  },
  head() {
    return {
      title: this.assignment.name,
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      assignment: (state) => state.assignment.assignment,
    }),
    rag() {
      if (!this.teachHasMarked) return ''
      if (this.ave <= 33) return 'red'
      if (this.ave > 66) return 'green'
      else return 'orange'
    },
    ave() {
      if (!this.teachHasMarked) return '- '
      return Math.round((this.score.marks / this.score.max) * 100)
    },
    // Count teacher marks and max.
    // possible mark across questions
    score() {
      let marks = 0
      let max = 0
      for (const q of this.assignment.questions) {
        if (q.response !== '') {
          marks += q.response.tm
        }
        max += parseInt(q.maxMark)
      }
      return { marks, max }
    },
    // Has teacher started marking assignment?
    teachHasMarked() {
      for (const q of this.assignment.questions) {
        if (q.response !== '' && q.response.marked) {
          return true
        }
      }
      return false
    },
    items() {
      return [
        {
          text: this.group.name,
          disabled: false,
          to: `/class/${this.group.id}`,
          nuxt: true,
        },
        {
          text: this.assignment.name,
          disabled: true,
          to: '',
          nuxt: true,
        },
      ]
    },
  },
}
</script>

<style scoped>
/* align chip with score */
.ave {
  position: relative;
  top: -2px;
}
</style>
