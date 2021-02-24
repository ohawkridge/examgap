<template>
  <v-row class="justify-center">
    <v-col cols="12" md="10" class="pt-md-10">
      <v-card class="pa-md-4">
        <v-card-title
          class="text-h6 font-weight-bold d-flex justify-space-between"
        >
          {{ assignment.name }}
          <v-chip outlined color="primary" label>
            Due {{ assignment.dateDue | date }}
          </v-chip>
        </v-card-title>
        <v-card-text class="mt-6">
          <p class="text-body-1 font-weight-medium mb-0">
            Question{{ assignment.questions.length | pluralize }} ({{
              assignment.questions.length
            }})
          </p>
          <v-list>
            <Question
              v-for="(question, i) in assignment.questions"
              :key="i"
              :assignment-id="assignment.id"
              :question="question"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Question from '@/components/student/question'

export default {
  components: {
    Question,
  },
  layout: 'app',
  async asyncData({ store, params }) {
    const response = await fetch('/.netlify/functions/getAssignment', {
      body: JSON.stringify({
        secret: store.state.user.secret,
        assignmentId: params.assignment,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching assignment ${response.status}`)
    }
    const assignment = await response.json()
    return { assignment }
  },
}
</script>
