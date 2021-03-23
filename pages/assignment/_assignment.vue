<template>
  <v-row class="justify-center">
    <v-col cols="12" md="10">
      <v-card class="pa-md-4 mt-md-3">
        <v-card-text>
          <v-row>
            <v-col>
              <p class="text-h6">{{ assignment.name }}</p>
              <div class="text-subtitle-1">
                <span class="fix-width font-weight-medium">Start:</span>
                {{ assignment.start | date }}
              </div>
              <div class="text-subtitle-1">
                <span class="fix-width font-weight-medium">Due:</span>
                {{ assignment.dateDue | date }}
              </div>
              <v-list>
                <AssignmentQuestion
                  v-for="(question, i) in assignment.questions"
                  :key="i"
                  :assignment-id="assignment.id"
                  :question="question"
                />
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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

<style scoped>
.fix-width {
  display: inline-block;
  width: 60px;
}
</style>
