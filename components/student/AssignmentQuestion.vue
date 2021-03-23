<template>
  <div>
    <!-- Create as many list items as there are responses -->
    <template v-for="(response, i) in question.responses">
      <v-list-item
        :key="i"
        nuxt
        :to="`/response/${response.id}`"
        class="px-0 px-md-3"
      >
        <v-list-item-content>
          <v-col cols="12" md="9" class="pa-0 pa-md-3 mb-2">
            <v-list-item-title>
              {{ question.text | strip }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-list-item-subtitle>
          </v-col>
          <v-col
            cols="12"
            md="3"
            class="pa-0 pa-md-3 d-flex justify-space-around"
          >
            <!-- Teacher mark -->
            <v-chip
              v-if="response.marked"
              :color="color(response.tm, question.maxMark)"
            >
              <v-avatar left>
                <v-icon>{{ $icons.mdiSchoolOutline }}</v-icon>
              </v-avatar>
              <span class="font-weight-black">{{ response.tm }}</span>
            </v-chip>
            <!-- Empty div so self mark aligns right -->
            <!-- <div v-else class="spacer flex-grow-0"></div> -->
            <!-- Self mark -->
            <v-chip :color="color(response.sm, question.maxMark)">
              <v-avatar left>
                <v-icon>{{ $icons.mdiAccountOutline }}</v-icon>
              </v-avatar>
              <span class="font-weight-black"> {{ response.sm }}</span>
            </v-chip>
          </v-col>
        </v-list-item-content>
      </v-list-item>
      <!-- If last response *and* repeated question add extra item -->
      <v-list-item
        v-if="
          i == question.responses.length - 1 && question.responses[i].repeat
        "
        :key="i + 1"
        @click="answer(question.id)"
      >
        <v-list-item-content>
          <v-col cols="12" md="9">
            <v-list-item-title>
              {{ question.text | strip }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-list-item-subtitle>
          </v-col>
          <v-col cols="12" md="3" class="d-flex justify-center">
            <v-btn outlined color="primary"> Reassigned </v-btn>
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
        <v-col cols="12" md="9">
          <v-list-item-title>
            {{ question.text | strip }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ question.maxMark }} mark{{ question.maxMark | pluralize }}
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-center">
          <v-btn elevation="0" color="primary"> Answer </v-btn>
        </v-col>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { mdiAccountOutline, mdiSchoolOutline } from '@mdi/js'

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
  created() {
    this.$icons = {
      mdiAccountOutline,
      mdiSchoolOutline,
    }
  },
  methods: {
    answer(questionId) {
      // Store assignment and question ids to associate
      // later with the student's saved response
      this.$store.commit(`assignments/setAnswerData`, {
        assignmentId: this.assignmentId,
        questionId,
      })
      this.$router.push(`/answer`)
    },
    color(n, max) {
      if (n / max <= 1 / 3) {
        return 'red'
      }
      if (n / max > 2 / 3) {
        return 'green'
      } else {
        return 'orange'
      }
    },
  },
}
</script>
