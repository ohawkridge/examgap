<template>
  <v-container class="pt-10">
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <!-- Skeletons -->
        <v-card v-if="$fetchState.pending" class="rounded-lg">
          <v-skeleton-loader
            type="image"
            class="float-right ma-4"
            width="40%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="heading"
            :loading="true"
            class="ma-4 mb-8"
            width="20%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="paragraph@2"
            :loading="true"
            class="ma-4 mb-8"
            width="50%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="paragraph"
            :loading="true"
            class="ma-4 mb-8"
            width="50%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="heading"
            :loading="true"
            class="ma-4 mb-8"
            width="20%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="paragraph"
            :loading="true"
            class="ma-4 mb-8"
            width="50%"
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
                    <v-chip outlined small label>
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
                          <th></th>
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
                          <td
                            class="text-center"
                            :class="
                              color(
                                response.tm.length,
                                response.question.maxMark
                              )
                            "
                          >
                            {{ response.tm.length }}
                          </td>
                          <td
                            class="text-center"
                            :class="
                              color(
                                response.sm.length,
                                response.question.maxMark
                              )
                            "
                          >
                            {{ response.sm.length }}
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
                    elevation="0"
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
      const max = this.response.question.maxMark
      return Math.round(((max - x.concat(y).length) / max) * 100)
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

<style scoped>
.red {
  background-color: red;
}

.orange {
  background-color: orange;
}

.green {
  background-color: green;
}
</style>
