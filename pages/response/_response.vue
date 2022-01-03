<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          rounded
          text
          color="primary"
          nuxt
          :to="`/assignment/${response.assignmentId}`"
        >
          <font-awesome-icon icon="fa-light fa-arrow-left" class="mr-2" />
          Back
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <!-- Skeletons -->
        <v-card v-if="$fetchState.pending" class="rounded-lg pa-md-3">
          <v-skeleton-loader
            type="image"
            class="float-right ma-3"
            width="46%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="heading"
            :loading="true"
            class="pa-3 mb-6"
            width="26%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="paragraph@2"
            :loading="true"
            class="ma-4 mb-8"
            width="40%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="paragraph"
            :loading="true"
            class="ma-4 mb-8"
            width="40%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="heading"
            :loading="true"
            class="ma-4 mb-8"
            width="26%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="paragraph"
            :loading="true"
            class="ma-4 mb-8"
            width="40%"
          ></v-skeleton-loader>
        </v-card>
        <v-card v-else class="rounded-lg">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <p class="text-subtitle-2 font-weight-bold">Question</p>
                  <div v-html="response.question.text"></div>
                  <div class="d-flex justify-end">
                    <v-chip color="tertiary" outlined small label>
                      {{ max }} mark{{ max | pluralize }}
                    </v-chip>
                  </div>
                  <div
                    id="answer"
                    class="breaks mt-4"
                    v-text="response.text"
                  ></div>
                  <div
                    v-if="response.feedback"
                    class="mt-4 d-flex green--text text--darken-3"
                  >
                    <font-awesome-icon
                      icon="fa-light fa-pen-clip"
                      class="mr-2 pt-1"
                    />
                    <p v-text="response.feedback"></p>
                  </div>
                  <p class="text-subtitle-2 mt-4">Model answer</p>
                  <p v-html="response.question.modelAnswer">Model answer</p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-subtitle-2">Mark scheme</p>
                  <v-simple-table>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-center">
                            <v-tooltip bottom>
                              <template #activator="{ on }">
                                <font-awesome-icon
                                  icon="fa-light fa-user-graduate"
                                  class="fa-xl"
                                  v-on="on"
                                />
                              </template>
                              <span>Your teacher</span>
                            </v-tooltip>
                          </th>
                          <th class="text-center">
                            <v-tooltip bottom>
                              <template #activator="{ on }">
                                <font-awesome-icon
                                  icon="fa-light fa-user"
                                  class="fa-xl"
                                  v-on="on"
                                />
                              </template>
                              <span>You</span>
                            </v-tooltip>
                          </th>
                          <th>
                            <v-tooltip bottom>
                              <template #activator="{ on }">
                                <font-awesome-icon
                                  icon="fa-light fa-bullseye-pointer"
                                  class="mr-2 fa-xl"
                                  v-on="on"
                                />
                              </template>
                              <span>Marking accuracy</span>
                            </v-tooltip>
                            <span
                              :class="
                                $root.$options.filters.ragText(accuracy, max)
                              "
                            >
                              {{ accuracy }}%
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(mark, i) in response.question.markScheme"
                          :key="i"
                        >
                          <td class="text-center">
                            <font-awesome-icon
                              v-if="response.tm.includes(mark.id)"
                              icon="fa-light fa-check"
                              class="fa-xl green--text"
                            />
                          </td>
                          <td class="text-center">
                            <font-awesome-icon
                              v-if="response.sm.includes(mark.id)"
                              icon="fa-light fa-check"
                              class="fa-xl green--text"
                            />
                          </td>
                          <td>{{ mark.text }}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td class="text-center">
                            <v-chip :color="tRag" label>
                              {{ response.tm.length }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-chip :color="sRag" label>
                              {{ response.sm.length }}
                            </v-chip>
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </template>
                  </v-simple-table>
                  <p class="text-subtitle-2 mt-4">Guidance</p>
                  <div
                    v-if="response.question.guidance"
                    v-html="response.question.guidance"
                  ></div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  layout: 'app',
  async fetch() {
    try {
      const id = this.$route.params.response
      await this.$store.dispatch('assignment/getResponse', id)
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching response',
      })
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      response: (state) => state.assignment.response,
    }),
    max() {
      return this.response.question.maxMark
    },
    accuracy() {
      // tm not in sm
      const x = this.response.tm.filter((x) => !this.response.sm.includes(x))
      // sm not in tm
      // (all other marks must match)
      const y = this.response.sm.filter((x) => !this.response.tm.includes(x))
      // Max. possible matches (*not* max. mark)
      const z = this.response.question.markScheme.length
      return Math.round(((z - (x.length + y.length)) / z) * 100)
    },
    sRag() {
      return this.color(this.response.sm.length)
    },
    tRag() {
      return this.color(this.response.tm.length)
    },
  },
  methods: {
    color(n) {
      if (n / this.max <= 1 / 3) return 'red'
      if (n / this.max > 2 / 3) return 'green'
      return 'orange'
    },
  },
}
</script>
