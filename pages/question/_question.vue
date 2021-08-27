<template>
  <div>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" md="10" class="d-flex justify-space-between">
          <v-btn text rounded @click="$router.go(-1)">
            <v-icon left>{{ $icons.mdiArrowLeft }}</v-icon>
            Back
          </v-btn>
          <div>
            <v-btn
              elevation="0"
              rounded
              text
              nuxt
              :to="`/map/${question.id}`"
              class="mr-2"
            >
              Map Topics
            </v-btn>
            <v-btn
              elevation="0"
              rounded
              text
              nuxt
              :to="`/author/${question.id}`"
            >
              Edit
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <v-skeleton-loader
            v-if="$fetchState.pending"
            :loading="true"
            type="card"
          >
          </v-skeleton-loader>
          <template v-else>
            <div v-html="question.text"></div>
            <div class="d-flex justify-end">
              <v-chip outlined small
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
  </div>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'

export default {
  layout: 'app',
  data() {
    return {
      question: {},
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
  created() {
    this.$icons = {
      mdiArrowLeft,
    }
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Question')
  },
}
</script>
