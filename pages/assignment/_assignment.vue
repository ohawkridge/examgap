<template>
  <v-row class="justify-center">
    <v-col cols="12" lg="10">
      <v-sheet v-if="$fetchState.pending" elevation="2" class="pa-7 mt-md-3">
        <v-skeleton-loader
          v-bind="attrs"
          type="heading"
          :loading="$fetchState.pending"
          class=""
          height="40"
        ></v-skeleton-loader>
        <v-skeleton-loader
          v-bind="attrs"
          type="text@2"
          :loading="$fetchState.pending"
          width="200"
        ></v-skeleton-loader>
        <v-skeleton-loader
          v-bind="attrs"
          type="image@2"
          :loading="$fetchState.pending"
          width="95%"
          class="mx-auto"
        ></v-skeleton-loader>
      </v-sheet>
      <v-card v-if="!$fetchState.pending" class="pa-md-3 mt-md-3">
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
  // async asyncData({ store, params, $config: { baseURL } }) {
  //   const url = new URL('/.netlify/functions/getAssignment', baseURL)
  //   const response = await fetch(url, {
  //     body: JSON.stringify({
  //       secret: store.state.user.secret,
  //       assignmentId: params.assignment,
  //     }),
  //     method: 'POST',
  //   })
  //   if (!response.ok) {
  //     throw new Error(`Error fetching assignment ${response.status}`)
  //   }
  //   const assignment = await response.json()
  //   return { assignment }
  // },
  data() {
    return {
      assignment: {},
      attrs: {
        class: 'mb-6',
      },
    }
  },
  async fetch() {
    const url = new URL(
      '/.netlify/functions/getAssignment',
      this.$config.baseURL
    )
    const response = await fetch(url, {
      body: JSON.stringify({
        secret: this.$store.state.user.secret,
        assignmentId: this.$route.params.assignment,
      }),
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`Error fetching assignment ${response.status}`)
    }
    this.assignment = await response.json()
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
