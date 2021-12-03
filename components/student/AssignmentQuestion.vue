<template>
  <div>
    <!-- Create as many list items as there are responses -->
    <template v-for="(response, i) in question.responses">
      <v-list-item :key="i" nuxt :to="`/response/${response.id}`">
        <v-list-item-content class="d-flex align-start">
          <v-col cols="12" md="9" class="pa-0 pa-md-3">
            <v-list-item-title>
              {{ question.text | strip }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-list-item-subtitle>
            <div
              v-if="response.feedback !== ''"
              class="mt-3 green--text text--darken-3 d-flex align-center"
            >
              <font-awesome-icon icon="fa-light fa-pen-clip" class="mr-1" />
              {{ response.feedback }}
            </div>
          </v-col>
          <v-col
            cols="12"
            md="3"
            class="pa-0 pa-md-3 d-flex justify-space-around"
          >
            <!-- Teacher mark -->
            <v-tooltip v-if="response.marked" bottom>
              <template #activator="{ on }">
                <v-chip
                  :color="color(response.tm / question.maxMark)"
                  label
                  v-on="on"
                >
                  <font-awesome-icon
                    icon="fa-light fa-user-graduate"
                    class="mr-2"
                  />
                  {{ response.tm }}
                  <font-awesome-icon icon="fa-light fa-check" class="ml-2" />
                </v-chip>
              </template>
              <span>Your teacher</span>
            </v-tooltip>
            <div v-else class="blank"></div>
            <!-- Self mark -->
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-chip
                  :color="color(response.sm / question.maxMark)"
                  label
                  v-on="on"
                >
                  <font-awesome-icon icon="fa-light fa-user" class="mr-2" />
                  {{ response.sm }}
                  <font-awesome-icon icon="fa-light fa-check" class="ml-2" />
                </v-chip>
              </template>
              <span>You</span>
            </v-tooltip>
          </v-col>
        </v-list-item-content>
      </v-list-item>
      <!-- If last response *and* repeated question add extra item -->
      <v-list-item v-if="last(i)" :key="i + 1" @click="answer(question.id)">
        <v-list-item-content>
          <v-col cols="12" md="9" class="pa-0 pa-md-3">
            <v-list-item-title>
              {{ question.text | strip }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-list-item-subtitle>
          </v-col>
          <v-col cols="12" md="3" class="d-flex justify-center">
            <v-btn rounded elevation="0" color="primary"> Reassigned </v-btn>
          </v-col>
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- If no responses, question is unanswered -->
    <v-list-item
      v-if="question.responses.length === 0"
      @click="answer(question.id)"
    >
      <v-list-item-content>
        <v-col cols="12" md="9" class="pa-0 pa-md-3">
          <v-list-item-title>
            {{ question.text | strip }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-center">
          <v-btn rounded elevation="0" color="primary"> Answer </v-btn>
        </v-col>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: 'AssignmentQuestion',
  props: {
    question: {
      type: Object,
      default: () => {},
    },
    assignmentId: {
      type: String,
      default: () => {},
    },
  },
  methods: {
    last(i) {
      return (
        i === this.question.responses.length - 1 &&
        this.question.responses[i].repeat
      )
    },
    answer(questionId) {
      // Store assignment and question ids to associate
      // later with the student's saved response
      this.$store.commit(`assignment/setAnswerData`, {
        assignmentId: this.assignmentId,
        questionId,
      })
      this.$router.push(`/answer`)
    },
    color(pcnt) {
      if (pcnt <= 1 / 3) return 'red'
      if (pcnt > 2 / 3) return 'green'
      return 'orange'
    },
  },
}
</script>

<style scoped>
.blank {
  width: 76px;
}
</style>
