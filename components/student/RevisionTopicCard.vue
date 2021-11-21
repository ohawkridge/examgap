<template>
  <v-col cols="12" md="4">
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-card
          outlined
          :class="$vuetify.breakpoint.name === 'xs' ? '' : 'mb-4'"
          hover
          height="100"
          @click="revise()"
          v-on="on"
        >
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ topic.name }}
          </v-card-title>
          <v-card-text>
            <font-awesome-icon
              v-for="(n, i) in topic.answered"
              :key="i"
              icon="fa-light fa-circle-check"
              class="mr-3 fa-xl ico-green"
            />
          </v-card-text>
        </v-card>
      </template>
      <span>Revise {{ topic.name }}</span>
    </v-tooltip>
  </v-col>
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
