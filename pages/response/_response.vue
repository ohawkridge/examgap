<template>
  <div>
    <!-- Skeletons -->
    <v-container v-if="$fetchState.pending">
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <v-skeleton-loader
            type="button"
            :loading="true"
            class="mt-4 mr-4 float-right"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="chip"
            :loading="true"
            class="ma-4 mb-8"
          ></v-skeleton-loader>
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
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <v-btn text rounded nuxt :to="`/assignment/${response.assignmentId}`">
            <font-awesome-icon
              icon="fa-light fa-arrow-left"
              class="ico-btn mr-2"
            />
            Back
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="5">
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
            <font-awesome-icon icon="fa-light fa-pen-clip" class="mr-2 pt-1" />
            <p v-text="response.feedback"></p>
          </div>
          <p class="text-subtitle-1 font-weight-bold mt-4">Model answer</p>
          <p v-html="response.question.modelAnswer">Model answer</p>
        </v-col>
        <v-col cols="12" md="5">
          <p class="text-subtitle-1 font-weight-bold">Mark scheme</p>
          <v-simple-table id="marks">
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
                        <v-chip :color="color(accuracy)" label v-on="on">
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
                <tr v-for="(mark, i) in response.question.markScheme" :key="i">
                  <td class="text-center">
                    <font-awesome-icon
                      v-if="response.tm.includes(mark.id)"
                      icon="fa-light fa-check"
                      class="ico-blue fa-xl"
                    />
                  </td>
                  <td class="text-center">
                    <font-awesome-icon
                      v-if="response.sm.includes(mark.id)"
                      icon="fa-light fa-check"
                      class="ico-green fa-xl"
                    />
                  </td>
                  <td>{{ mark.text }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="text-center">
                    <v-chip :color="color(response.tm.length)">
                      {{ response.tm.length }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-chip :color="color(response.sm.length)">
                      {{ response.sm.length }}
                    </v-chip>
                  </td>
                  <td
                    v-if="response.question.guidance"
                    v-html="response.question.guidance"
                  ></td>
                  <td v-else colspan="3">None</td>
                </tr>
              </tfoot>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
.ico-btn {
  height: 18px;
  width: 18px;
}

#marks {
  border: 1px solid #d2d2d2 !important;
}
</style>
