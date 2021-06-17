<template>
  <v-row>
    <v-col cols="12">
      <v-sheet v-if="$fetchState.pending" elevation="2" class="pa-md-3 mt-sm-3">
        <v-skeleton-loader
          type="chip"
          :loading="$fetchState.pending"
          class="mt-4 mr-4 float-right"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="chip"
          :loading="$fetchState.pending"
          class="mt-4 mr-4 float-right"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="button"
          :loading="$fetchState.pending"
          class="ma-4 mb-8"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="image"
          class="float-right ma-4"
          width="40%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="heading"
          :loading="$fetchState.pending"
          class="ma-4 mb-8"
          width="40%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="paragraph"
          :loading="$fetchState.pending"
          class="ma-4 mb-8"
          width="50%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="heading"
          :loading="$fetchState.pending"
          class="ma-4 mb-8"
          width="40%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="paragraph"
          :loading="$fetchState.pending"
          class="ma-4 mb-8"
          width="50%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="heading"
          :loading="$fetchState.pending"
          class="ma-4 mb-8"
          width="40%"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="paragraph"
          :loading="$fetchState.pending"
          class="ma-4 mb-8"
          width="50%"
        ></v-skeleton-loader>
      </v-sheet>
      <v-card v-if="!$fetchState.pending" class="pa-md-3 mt-sm-3">
        <v-card-title class="d-flex justify-space-between">
          <v-btn
            color="primary"
            nuxt
            :to="`/assignment/${response.assignmentId}`"
            elevation="0"
          >
            <v-icon left>{{ $icons.mdiArrowLeft }}</v-icon>
            Back
          </v-btn>
          <div class="d-flex justify-end">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  :color="color(response.tm.length, response.question.maxMark)"
                  class="mr-4"
                  v-on="on"
                >
                  <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                  <span class="font-weight-black">{{
                    response.tm.length
                  }}</span>
                  <v-icon right> {{ $icons.mdiCheck }} </v-icon>
                </v-chip>
              </template>
              <span>Your teacher</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  :color="color(response.sm.length, response.question.maxMark)"
                  v-on="on"
                >
                  <v-icon left>{{ $icons.mdiAccountOutline }}</v-icon>
                  <span class="font-weight-black">{{
                    response.sm.length
                  }}</span>
                  <v-icon right> {{ $icons.mdiCheck }} </v-icon>
                </v-chip>
              </template>
              <span>You</span>
            </v-tooltip>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <p class="text-subtitle-1 font-weight-medium">Question</p>
              <div v-html="response.question.text"></div>
              <div class="d-flex justify-end">
                <v-chip outlined
                  >{{ response.question.maxMark }} mark{{
                    response.question.maxMark | pluralize
                  }}
                </v-chip>
              </div>
              <p class="text-subtitle-1 font-weight-medium">Your answer</p>
              <p
                id="ans"
                class="pa-4 breaks mb-0"
                :class="noFb"
                v-text="response.text"
              ></p>
              <div
                v-if="response.feedback"
                id="fb"
                class="pa-4 mb-4 font-italic"
                v-text="response.feedback"
              ></div>
              <p class="text-subtitle-1 font-weight-medium">Model answer</p>
              <p v-html="response.question.modelAnswer">Model answer</p>
            </v-col>
            <v-col cols="12" md="6">
              <p class="text-subtitle-1 font-weight-medium">Mark scheme</p>
              <v-simple-table>
                <template #default>
                  <thead>
                    <!-- N.B. Tooltips cause NodeList mismatch here -->
                    <tr>
                      <th class="text-left" title="Your teacher">
                        <v-icon>{{ $icons.mdiSchoolOutline }}</v-icon>
                      </th>
                      <th class="text-left" title="You">
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
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiSchoolOutline,
  mdiAccountOutline,
  mdiCheckboxMarked,
  mdiArrowLeft,
  mdiCheck,
} from '@mdi/js'

export default {
  layout: 'app',
  fetch() {
    this.$store.dispatch('assignments/getResponse', this.$route.params.response)
  },
  computed: {
    ...mapState({ response: (state) => state.assignments.response }),
    noFb() {
      return this.response.feedback === '' ? 'mb-4' : ''
    },
  },
  created() {
    this.$icons = {
      mdiSchoolOutline,
      mdiAccountOutline,
      mdiCheckboxMarked,
      mdiArrowLeft,
      mdiCheck,
    }
  },
  methods: {
    color(n, max) {
      if (n / max <= 1 / 3) return 'red'
      if (n / max > 2 / 3) return 'green'
      return 'orange'
    },
  },
}
</script>

<style scoped>
#fb {
  background-color: #b7d1da;
}
</style>
