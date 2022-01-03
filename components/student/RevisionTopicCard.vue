<template>
  <v-card outlined class="rounded-lg" min-height="136" hover @click="revise()">
    <v-card-title class="no-wrap">
      {{ topic.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ topic.numQuestions }} Question{{ topic.numQuestions | pluralize }}
    </v-card-subtitle>
    <v-card-text class="green--text d-flex justify-end">
      <font-awesome-icon
        v-for="(n, i) in topic.numAnswered"
        :key="i"
        :icon="['fas', 'circle-check']"
        class="ml-3 fa-xl"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    topic: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    revise() {
      this.$store.commit('topics/setTopicId', this.topic.id)
      this.$store.commit('topics/setTopicName', this.topic.name)
      this.$nuxt.$emit('show-revise')
    },
  },
}
</script>

<style scoped>
/* break on whole words */
.no-wrap {
  word-break: normal !important;
}
</style>
