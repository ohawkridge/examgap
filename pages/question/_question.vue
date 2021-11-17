<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="10" class="d-flex justify-space-between">
        <!-- TODO If coming from /author don't want to go back? -->
        <v-btn elevation="0" rounded @click="$router.go(-1)">
          <font-awesome-icon icon="fa-light fa-arrow-left" class="mr-2" />
          Back
        </v-btn>
        <div>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                elevation="0"
                rounded
                nuxt
                :to="`/map/${question.id}`"
                class="mr-2"
                v-on="on"
              >
                Topics
              </v-btn>
            </template>
            <span>Question topics</span>
          </v-tooltip>
          <v-btn elevation="0" rounded nuxt :to="`/author/${question.id}`">
            Edit Question
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <!-- Skeletons -->
        <template v-if="$fetchState.pending">
          <v-skeleton-loader :loading="true" type="paragraph" v-bind="attrs">
          </v-skeleton-loader>
          <v-skeleton-loader :loading="true" type="paragraph" v-bind="attrs">
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="chip"
            v-bind="attrs"
            class="float-right"
            style="transform: scale(0.7)"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="heading"
            width="50%"
            v-bind="attrs"
            style="clear: right"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="text"
            v-bind="attrs"
            width="60%"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="text"
            v-bind="attrs"
            width="48%"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="text"
            v-bind="attrs"
            width="28%"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="text"
            v-bind="attrs"
            width="49%"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="heading"
            width="42%"
            v-bind="attrs"
            class="pt-4"
          >
          </v-skeleton-loader>
          <v-skeleton-loader :loading="true" type="sentences" v-bind="attrs">
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="heading"
            width="20%"
            v-bind="attrs"
            class="pt-4"
          >
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="true"
            type="text"
            width="33%"
            v-bind="attrs"
          >
          </v-skeleton-loader>
        </template>
        <template v-else>
          <div v-html="question.text"></div>
          <div class="d-flex justify-end">
            <v-chip outlined label
              >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
            </v-chip>
          </div>
          <p class="text-subtitle-1 font-weight-medium">Mark Scheme</p>
          <ul class="mb-4">
            <li v-for="(mark, i) in question.marks" :key="i">
              {{ mark.text }}
            </li>
          </ul>
          <p class="text-subtitle-1 font-weight-medium">Guidance</p>
          <div v-if="question.guidance" v-html="question.guidance"></div>
          <p v-else>None</p>
          <p class="text-subtitle-1 font-weight-medium mt-4">Model Answer</p>
          <div v-html="question.modelAnswer"></div>
          <p class="text-subtitle-1 font-weight-medium mt-4">Keywords</p>
          <p v-if="question.keywords !== ''">{{ question.keywords }}</p>
          <p v-else>None</p>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      question: {},
      attrs: {
        class: 'mb-4',
      },
    }
  },
  async fetch() {
    try {
      const url = new URL(
        '/.netlify/functions/getQuestion',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          secret: this.$store.state.user.secret,
          questionId: this.$route.params.question,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching question ${response.status}`)
      }
      this.question = await response.json()
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error loading question',
      })
    }
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Question')
  },
}
</script>
