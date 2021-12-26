<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-breadcrumbs :items="items"></v-breadcrumbs>
        <div>
          <v-btn
            outlined
            rounded
            color="primary"
            nuxt
            :to="`/author/${question.id}`"
            class="mr-2"
          >
            Edit question
          </v-btn>
          <v-btn
            outlined
            rounded
            color="primary"
            nuxt
            :to="`/map/${question.id}`"
          >
            Map topics
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!$fetchState.pending" cols="12" md="8">
        <div v-html="question.text"></div>
        <div class="d-flex justify-end">
          <v-chip outlined label small color="tertiary"
            >{{ question.maxMark }} mark{{ question.maxMark | pluralize }}
          </v-chip>
        </div>
        <p class="text-subtitle-2">Mark Scheme</p>
        <ul class="mb-4">
          <li v-for="(mark, i) in question.marks" :key="i">
            {{ mark.text }}
          </li>
        </ul>
        <p class="text-subtitle-2">Guidance</p>
        <div v-if="question.guidance" v-html="question.guidance"></div>
        <p v-else>None</p>
        <p class="text-subtitle-2">Model Answer</p>
        <div v-html="question.modelAnswer"></div>
        <v-divider class="mb-6"></v-divider>
        <p>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <span v-on="on">
                <font-awesome-icon icon="fa-light fa-timer" class="mr-2" />
                {{ question.meanTime | time }}
              </span>
            </template>
            <span>Average time</span>
          </v-tooltip>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Question',
  layout: 'app',
  async fetch() {
    try {
      const id = this.$route.params.question
      await this.$store.dispatch('topics/getQuestion', id)
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching question',
      })
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
      topicName: 'topics/currentTopicName',
    }),
    ...mapState({
      question: (state) => state.topics.question,
    }),
    items() {
      return [
        {
          text: `${this.group.course.name} (${this.group.course.board})`,
          disabled: false,
          to: `/questions/${this.group.course.id}`,
          nuxt: true,
        },
        {
          text: this.topicName,
          disabled: true,
          to: '',
          nuxt: true,
        },
      ]
    },
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Question')
  },
}
</script>
