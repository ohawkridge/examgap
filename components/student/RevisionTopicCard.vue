<template>
  <v-hover v-slot="{ hover }">
    <v-card outlined class="rounded-lg outlined" hover @click="revise()">
      <!-- Create lock effect -->
      <!-- <v-overlay absolute :value="true">
        <font-awesome-icon icon="fa-light fa-lock-keyhole" class="fa-3x" />
      </v-overlay> -->
      <v-img
        src="/t/263858534213485067.jpeg"
        height="120px"
        :class="hover ? '' : 'desat'"
      />
      <div class="ml-2 chip-row">
        <v-chip
          label
          :color="$vuetify.theme.dark ? '#594400' : '#ffe089'"
          small
        >
          <span :class="$vuetify.theme.dark ? 'tb-dark' : 'tb-text'">
            {{ topic.numQuestions }} Q{{ topic.numQuestions | pluralize }}
          </span>
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
      this.$store.commit('topics/setTopicName', this.topic.name)
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

.desat {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.tb-text {
  color: #241a00;
}

.tb-dark {
  color: #e1e2e5;
}
</style>
