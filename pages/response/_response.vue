<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn text nuxt :to="`/assignment/${response.assignment}`">
          <v-icon left>{{ $icons.mdiArrowLeft }}</v-icon>
          Back
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-md-6">
          <v-card-title
            class="text-h5 font-weight-bold d-flex justify-space-between"
          >
            Question
            <div class="d-flex justify-end">
              <v-chip color="primary" outlined class="mr-2" label>
                <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                <span
                  v-if="response && !$fetchState.pending"
                  class="font-weight-black"
                  >{{ response.tm.length }}/{{
                    response.question.maxMark
                  }}</span
                >
                <v-icon right>{{ $icons.mdiCheck }}</v-icon>
              </v-chip>
              <v-chip color="green darken-1" outlined label>
                <v-icon left>{{ $icons.mdiAccountOutline }}</v-icon>
                <span
                  v-if="response && !$fetchState.pending"
                  class="font-weight-black"
                  >{{ response.sm.length }}/{{
                    response.question.maxMark
                  }}</span
                >
                <v-icon right>{{ $icons.mdiCheck }}</v-icon>
              </v-chip>
            </div>
          </v-card-title>
          <v-card-text v-if="!$fetchState.pending">
            <v-row>
              <v-col cols="12" md="6">
                <div>{{ response.question.text }}</div>
                <p class="text-subtitle-1 font-weight-medium">Your answer</p>
                <p id="ans" class="pa-4 breaks" v-text="response.text"></p>
                <p class="text-subtitle-1 font-weight-medium">Model answer</p>
                <div>{{ response.question.modelAnswer }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-subtitle-1 font-weight-medium">Mark scheme</p>
                <v-simple-table>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          <v-icon>{{ $icons.mdiSchoolOutline }}</v-icon>
                        </th>
                        <th class="text-left">
                          <v-icon>{{ $icons.mdiAccountOutline }}</v-icon>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(mark, i) in response.question.markScheme"
                        :key="i"
                      >
                        <td>
                          <v-icon
                            v-if="response.tm.includes(mark.id)"
                            color="primary"
                            >{{ $icons.mdiCheckboxMarked }}</v-icon
                          >
                        </td>
                        <td>
                          <v-icon
                            v-if="response.sm.includes(mark.id)"
                            color="green"
                            >{{ $icons.mdiCheckboxMarked }}</v-icon
                          >
                        </td>
                        <td>{{ mark.text }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div
                  v-if="response.feedback"
                  id="fb"
                  class="pa-4 mb-4"
                  v-text="response.feedback"
                ></div>
                <p class="text-subtitle-1 font-weight-medium">Guidance</p>
                <div v-if="response.question.guidance">
                  {{ response.question.guidance }}
                </div>
                <p v-else>None</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mdiCommentTextOutline,
  mdiSchoolOutline,
  mdiAccountOutline,
  mdiCheckboxMarked,
  mdiArrowLeft,
  mdiCheck,
} from '@mdi/js'

export default {
  layout: 'app',
  async asyncData({ store, params }) {
    const url = new URL(
      '/.netlify/functions/getResponse',
      'http://localhost:8888'
    )
    const data = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        responseId: params.response,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching assignment ${data.status}`)
    }
    const response = await data.json()
    return { response }
  },
  created() {
    this.$icons = {
      mdiCommentTextOutline,
      mdiSchoolOutline,
      mdiAccountOutline,
      mdiCheckboxMarked,
      mdiArrowLeft,
      mdiCheck,
    }
  },
}
</script>

<style scoped>
#fb {
  background: #c9d4ff;
}
</style>
