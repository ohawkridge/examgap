<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-breadcrumbs :items="items"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <!-- Skeletons -->
        <v-card v-if="$fetchState.pending" class="rounded-lg pa-4">
          <v-skeleton-loader
            type="list-item-avatar"
            :loading="true"
            class="mt-3"
            width="48%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            class="mt-8 ml-6"
            width="20%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            class="my-8 ml-6"
            width="20%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="heading"
            :loading="true"
            class="my-8 ml-6"
            width="25%"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="image"
            :loading="true"
            class="px-5 pb-6"
          ></v-skeleton-loader>
        </v-card>
        <v-card v-else class="rounded-lg">
          <v-card-title>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-btn
                  icon
                  class="mr-2"
                  nuxt
                  :to="`/class/${group.id}`"
                  v-on="on"
                >
                  <font-awesome-icon
                    icon="fa-light fa-arrow-left"
                    class="ico-btn"
                  />
                </v-btn>
              </template>
              <span>Back</span>
            </v-tooltip>
            {{ assignment.name }}
          </v-card-title>
          <v-card-text class="text-body-1">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center mb-2">
                    <span class="align-date font-weight-bold">Start:</span>
                    {{ assignment.start | date }}
                  </div>
                  <div class="d-flex align-center mb-2">
                    <span class="align-date font-weight-bold">Due:</span>
                    {{ assignment.dateDue | date }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <span class="align-date font-weight-bold"> Score: </span>
                  <strong>{{ `${score.marks}/${score.max}` }}</strong>
                  <v-chip :color="rag" class="ml-1 ave" label>
                    {{ ave }}%
                  </v-chip>
                </v-col>
              </v-row>
              <v-row class="justify-center">
                <v-col cols="12">
                  <p class="text-subtitle-1 font-weight-bold">
                    Question{{ assignment.questions.length | pluralize }} ({{
                      assignment.questions.length
                    }})
                  </p>
                  <v-divider />
                  <v-list>
                    <v-list-item
                      v-for="(q, i) in assignment.questions"
                      :key="i"
                      @click="action(q)"
                    >
                      <v-list-item-content>
                        <v-col cols="12" md="8">
                          <v-list-item-title>
                            {{ q.text | strip }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ q.maxMark }} mark{{ q.maxMark | pluralize }}
                          </v-list-item-subtitle>
                          <!-- If not answered yet, feedback won't exist -->
                          <!-- Alternatively, could be marked and blank -->
                          <div
                            v-if="
                              q.response.feedback !== undefined &&
                              q.response.feedback !== ''
                            "
                            class="my-3 green--text text--darken-3 d-flex align-center"
                          >
                            <font-awesome-icon
                              icon="fa-light fa-pen-clip"
                              class="mr-2"
                            />
                            {{ q.response.feedback }}
                          </div>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          class="d-flex justify-space-around"
                        >
                          <!-- Not answered yet xx -->
                          <v-btn
                            v-if="q.response === ''"
                            rounded
                            elevation="0"
                            :color="$vuetify.theme.dark ? '#620d1e' : '#ffd9dc'"
                          >
                            Answer
                          </v-btn>
                          <template v-else>
                            <!-- Self mark xx -->
                            <v-tooltip bottom>
                              <template #activator="{ on }">
                                <span v-on="on">
                                  <font-awesome-icon
                                    icon="fa-light fa-user"
                                    class="mr-2"
                                  />
                                  {{ q.response.sm }}
                                  <span class="green--text">
                                    <font-awesome-icon
                                      icon="fa-light fa-check"
                                      class="ml-2"
                                  /></span>
                                </span>
                              </template>
                              <span>You</span>
                            </v-tooltip>
                            <!-- Teacher mark xx -->
                            <v-tooltip v-if="q.response.marked" bottom>
                              <template #activator="{ on }">
                                <span v-on="on">
                                  <font-awesome-icon
                                    icon="fa-light fa-user-graduate"
                                    class="mr-2"
                                  />
                                  {{ q.response.tm }}
                                  <span class="green--text">
                                    <font-awesome-icon
                                      icon="fa-light fa-check-double"
                                      class="ml-2"
                                  /></span>
                                </span>
                              </template>
                              <span>Your teacher</span>
                            </v-tooltip>
                            <div v-else class="blank"></div>
                          </template>
                        </v-col>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
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
    const id = this.$route.params.assignment
    await this.$store.dispatch('assignment/getAssignment', id)
  },
  head() {
    return {
      title: this.assignment.name,
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      assignment: (state) => state.assignment.assignment,
    }),
    rag() {
      if (!this.teachHasMarked) return ''
      if (this.ave <= 33) return 'red'
      if (this.ave > 66) return 'green'
      else return 'orange'
    },
    ave() {
      if (!this.teachHasMarked) return '- '
      return Math.round((this.score.marks / this.score.max) * 100)
    },
    // Count teacher marks and max.
    // possible mark across questions
    score() {
      let marks = 0
      let max = 0
      for (const q of this.assignment.questions) {
        if (q.response !== '') {
          marks += q.response.tm
        }
        max += parseInt(q.maxMark)
      }
      return { marks, max }
    },
    // Has teacher started marking assignment?
    teachHasMarked() {
      for (const q of this.assignment.questions) {
        if (q.response !== '' && q.response.marked) {
          return true
        }
      }
      return false
    },
    items() {
      return [
        {
          text: this.group.name,
          disabled: false,
          to: `/class/${this.group.id}`,
          nuxt: true,
        },
        {
          text: this.assignment.name,
          disabled: true,
          to: '',
          nuxt: true,
        },
      ]
    },
  },
  mounted() {
    this.$store.commit('app/setPageTitle', this.assignment.name)
  },
  methods: {
    action(question) {
      // Answer question
      if (question.response === '') {
        // Store data needed to save response later
        this.$store.commit(`assignment/setAnswerData`, {
          assignmentId: this.assignment.id,
          questionId: question.id,
        })
        this.$router.push(`/answer`)
      } else {
        this.$router.push(`/response/${question.response.id}`)
      }
    },
  },
}
</script>

<style scoped>
/* align chip with score */
.ave {
  position: relative;
  top: -2px;
}

/* spacer if teacher not marked yet */
.blank {
  width: 65px;
}
</style>
