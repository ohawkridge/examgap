<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn text nuxt :to="`/assignment/${response.assignmentId}`">
          <v-icon left>{{ $icons.mdiArrowLeft }}</v-icon>
          {{ response.assignmentName }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-md-4">
          <v-card-title class="d-flex justify-space-between">
            Question
            <div class="d-flex justify-end">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-chip
                    v-bind="attrs"
                    :color="
                      color(response.tm.length, response.question.maxMark)
                    "
                    class="mr-4"
                    v-on="on"
                  >
                    <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                    <span class="font-weight-black">{{
                      response.tm.length
                    }}</span>
                  </v-chip>
                </template>
                <span>Teacher mark</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-chip
                    v-bind="attrs"
                    :color="
                      color(response.sm.length, response.question.maxMark)
                    "
                    v-on="on"
                  >
                    <v-icon left>{{ $icons.mdiAccountOutline }}</v-icon>
                    <span class="font-weight-black">{{
                      response.sm.length
                    }}</span>
                  </v-chip>
                </template>
                <span>Self mark</span>
              </v-tooltip>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div v-html="response.question.text"></div>
                <div class="d-flex justify-end">
                  <v-chip outlined
                    >{{ response.question.maxMark }} mark{{
                      response.question.maxMark | pluralize
                    }}
                  </v-chip>
                </div>
                <p class="text-subtitle-1 font-weight-medium">Your answer</p>
                <p id="ans" class="pa-4 breaks" v-text="response.text"></p>
                <p
                  class="text-subtitle-1"
                  v-html="response.question.modelAnswer"
                >
                  Model answer
                </p>
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
                <p class="text-subtitle-1 font-weight-medium mt-4">
                  Marking guidance
                </p>
                <div
                  v-if="response.question.guidance"
                  v-html="response.question.guidance"
                ></div>
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
} from '@mdi/js'

export default {
  layout: 'app',
  async asyncData({ store, params, $config: { baseURL } }) {
    const url = new URL('/.netlify/functions/getResponse', baseURL)
    const data = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        responseId: params.response,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching response ${data.status}`)
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
    }
  },
  methods: {
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

<style scoped>
#fb {
  background: #c9d4ff;
}
</style>
