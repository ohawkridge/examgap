<template>
  <v-card class="rounded-lg mb-4 mb-md-6">
    <v-card-title class="truncate">
      {{ question.text | strip }}
    </v-card-title>
    <v-card-subtitle> 2 marks </v-card-subtitle>
    <v-card-text>
      <p
        v-if="response && response.feedback !== ''"
        class="green--text"
        :class="fbDark"
      >
        <font-awesome-icon icon="fa-light fa-pen-clip" class="mr-1" />
        {{ response.feedback }}
      </p>
      <div class="d-flex justify-end align-center font-weight-bold">
        <template v-if="response !== ''">
          <v-tooltip v-if="response.marked" bottom>
            <template #activator="{ on }">
              <span v-on="on">
                <font-awesome-icon
                  icon="fa-light fa-user-graduate"
                  class="mr-2 fa-lg"
                />
                {{ response.tm }}
              </span>
            </template>
            <span>Your teacher</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <span class="ml-6 mr-6" v-on="on">
                <font-awesome-icon icon="fa-light fa-user" class="mr-2 fa-lg" />
                {{ response.sm }}
              </span>
            </template>
            <span>You</span>
          </v-tooltip>
        </template>
        <v-btn
          v-if="response !== ''"
          :color="$vuetify.theme.dark ? '#620d1e' : '#ffd9dc'"
          elevation="0"
          rounded
          nuxt
          :to="`/response/${response.id}`"
        >
          View
        </v-btn>
        <v-btn v-else color="primary" elevation="0" rounded @click="answer()">
          <span :class="$vuetify.theme.dark ? 'pb-text' : ''"> Answer </span>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    response() {
      return this.question.response
    },
    fbDark() {
      return this.$vuetify.theme.dark ? 'text--lighten-1' : 'text--darken-3'
    },
  },
  methods: {
    answer() {
      // Store question id to associate with response later
      // (assignment id already on assignment in store)
      this.$store.commit('assignment/setQuestionId', this.question.id)
      this.$router.push(`/answer`)
    },
  },
}
</script>

<style scoped>
.truncate {
  width: 66%;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  display: block; /* turn off flexbox ! */
}
/* Don't truncate title on mobile */
@media only screen and (max-width: 600px) {
  .truncate {
    width: 100%;
  }
}
</style>
