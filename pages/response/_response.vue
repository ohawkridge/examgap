<template>
  <v-container>
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
                  <p class="text-subtitle-1 font-weight-bold">Question</p>
                  <div v-html="response.question.text"></div>
                  <div class="d-flex justify-end">
                    <v-chip color="tertiary" outlined small label>
                      {{ max }} mark{{ max | pluralize }}
                    </v-chip>
                  </div>
                  <p class="breaks mt-4" v-text="response.text"></p>
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
                  <p class="text-subtitle-1 font-weight-bold mt-4">
                    Model answer
                  </p>
                  <p v-html="response.question.modelAnswer">Model answer</p>
                </v-col>
                <v-col cols="12" md="6">
                  <p class="text-subtitle-1 font-weight-bold">Mark scheme</p>
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
                                <v-chip
                                  :color="color(accuracy)"
                                  label
                                  v-on="on"
                                >
                                  <font-awesome-icon
                                    icon="fa-light fa-bullseye-pointer"
                                    class="fa-lg mr-2"
                                  />
                                  {{ accuracy }}%
                                </v-chip>
                              </template>
                              <span>Marking accuracy</span>
                            </v-tooltip>
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
                            <v-chip :color="tRag">
                              {{ response.tm.length }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-chip :color="sRag">
                              {{ response.sm.length }}
                            </v-chip>
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </template>
                  </v-simple-table>
                  <div
                    v-if="response.question.guidance"
                    class="mt-3"
                    v-html="response.question.guidance"
                  ></div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    rounded
                    color="primary"
                    nuxt
                    :to="`/assignment/${response.assignmentId}`"
                  >
                    Done
                  </v-btn>
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
import { mapState } from 'vuex'

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
    ...mapState({
      response: (state) => state.assignment.response,
    }),
    max() {
      return this.response.question.maxMark
    },
    // Use size of symmetric difference to calculate accuracy
    accuracy() {
      const x = this.response.tm.filter((x) => !this.response.sm.includes(x))
      const y = this.response.sm.filter((x) => !this.response.tm.includes(x))
      return Math.round(((this.max - x.concat(y).length) / this.max) * 100)
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
