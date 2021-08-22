<template>
  <div class="pa-4">
    <!-- Skeletons -->
    <div v-if="$fetchState.pending">
      <v-skeleton-loader
        type="chip"
        :loading="$fetchState.pending"
        class="mt-4 mr-4 float-right"
      ></v-skeleton-loader>
      <v-skeleton-loader
        type="button"
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
    </div>
    <template v-else>
      <v-row style="border-bottom: 1px solid #d2d2d2 !important">
        <v-col class="d-flex justify-space-between align-center">
          <v-btn rounded text nuxt :to="`/assignment/${response.assignmentId}`">
            <v-icon left>{{ $icons.mdiArrowLeft }}</v-icon>
            Back
          </v-btn>
          <div>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-chip
                  :color="color(response.tm.length, response.question.maxMark)"
                  class="mr-4"
                  label
                  v-on="on"
                >
                  <v-icon left>{{ $icons.mdiSchoolOutline }}</v-icon>
                  {{ response.tm.length }}
                  <v-icon right> {{ $icons.mdiCheck }} </v-icon>
                </v-chip>
              </template>
              <span>Your teacher</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-chip
                  :color="color(response.sm.length, response.question.maxMark)"
                  label
                  v-on="on"
                >
                  <v-icon left>{{ $icons.mdiAccountOutline }}</v-icon>
                  {{ response.sm.length }}
                  <v-icon right> {{ $icons.mdiCheck }} </v-icon>
                </v-chip>
              </template>
              <span>You</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-subtitle-1 font-weight-medium">Question</p>
          <div v-html="response.question.text"></div>
          <div class="d-flex justify-end">
            <v-chip outlined small
              >{{ response.question.maxMark }} mark{{
                response.question.maxMark | pluralize
              }}
            </v-chip>
          </div>
          <p class="text-subtitle-1 font-weight-medium">Your answer</p>
          <p class="pa-4 breaks mb-0" v-text="response.text"></p>
          <div
            v-if="response.feedback"
            id="fb"
            class="pa-4 mb-4 font-italic"
            v-text="response.feedback"
          ></div>
          <p class="text-subtitle-1 font-weight-medium mt-4">Model answer</p>
          <p v-html="response.question.modelAnswer">Model answer</p>
        </v-col>
        <v-col cols="12" md="6">
          <p class="text-subtitle-1 font-weight-medium">Mark scheme</p>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-center">
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-icon v-on="on">{{ $icons.mdiSchoolOutline }}</v-icon>
                      </template>
                      <span>Your teacher</span>
                    </v-tooltip>
                  </th>
                  <th class="text-center">
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-icon v-on="on">{{
                          $icons.mdiAccountOutline
                        }}</v-icon>
                      </template>
                      <span>You</span>
                    </v-tooltip>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(mark, i) in response.question.markScheme" :key="i">
                  <td class="text-center">
                    <v-icon
                      v-if="response.tm.includes(mark.id)"
                      color="primary"
                      >{{ $icons.mdiCheckboxMarked }}</v-icon
                    >
                  </td>
                  <td class="text-center">
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
    </template>
  </div>
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
  async fetch() {
    await this.$store.dispatch(
      'assignment/getResponse',
      this.$route.params.response
    )
  },
  computed: {
    ...mapState({
      response: (state) => state.assignment.response,
    }),
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
  mounted() {
    this.$store.commit('app/setPageTitle', 'Review')
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
