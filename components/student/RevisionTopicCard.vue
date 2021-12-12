<template>
  <v-hover v-slot="{ hover }">
    <v-card outlined class="rounded-lg outlined" hover @click="revise()">
      <v-img
        src="/t/263858534213485067.jpeg"
        height="120px"
        :class="hover ? '' : 'xx'"
      />
      <div class="ml-2 chip-row">
        <v-chip label color="tertiary" small dark>
          {{ topic.numQuestions }} Q{{ topic.numQuestions | pluralize }}
        </v-chip>
      </div>
      <v-card-title class="no-wrap text-subtitle-1 font-weight-medium">
        {{ topic.name }}
      </v-card-title>
      <v-card-text class="green--text">
        <font-awesome-icon
          v-for="(n, i) in topic.numAnswered"
          :key="i"
          :icon="['fas', 'circle-check']"
          class="mr-3 fa-xl"
        />
      </v-card-text>
    </v-card>
  </v-hover>
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
      this.$nuxt.$emit('show-revise')
    },
  },
}
</script>

<style scoped>
/* don't wrap card titles */
.no-wrap {
  word-break: normal !important;
}

.chip-row {
  position: relative;
  top: -30px;
  margin-bottom: -30px;
}

.xx {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
</style>
