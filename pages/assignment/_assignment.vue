<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <v-btn text nuxt to="/home">
          <v-icon left>{{ $icons.mdiArrowLeft }}</v-icon>
          Back
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <v-card class="pa-md-4">
          <v-card-title class="d-flex justify-space-between">
            {{ assignment.name }}
            <v-chip outlined color="primary" label>
              Due {{ assignment.dateDue | date }}
            </v-chip>
          </v-card-title>
          <v-card-text class="mt-6">
            <div class="text-body-1 font-weight-medium">
              Question{{ assignment.questions.length | pluralize }} ({{
                assignment.questions.length
              }})
            </div>
            <v-list>
              <AssignmentQuestion
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
  </div>
</template>

<script>
import AssignmentQuestion from '@/components/student/AssignmentQuestion'
import { mdiArrowLeft } from '@mdi/js'

export default {
  components: {
    AssignmentQuestion,
  },
  layout: 'app',
  async asyncData({ store, params, $config: { baseURL } }) {
    const url = new URL('/.netlify/functions/getAssignment', baseURL)
    const response = await fetch(url, {
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
  created() {
    this.$icons = { mdiArrowLeft }
  },
}
</script>
