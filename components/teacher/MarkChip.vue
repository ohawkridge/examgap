<template>
  <!-- Switch to flex columns if more than one response -->
  <div :class="responses.length > 1 ? 'd-flex flex-column align-center' : ''">
    <!-- Not answered -->
    <div v-if="responses.length === 0" class="my-auto">N/A</div>
    <!-- Loop through responses (see note below) -->
    <template v-for="(response, i) in responses" v-else>
      <!-- Self marked -->
      <v-tooltip v-if="!response.marked" :key="i" bottom>
        <template #activator="{ on }">
          <v-chip outlined @click="mark(i)" v-on="on">
            {{ response.sm.length }}
            <v-icon right color="grey">{{ $icons.mdiCheck }}</v-icon>
          </v-chip>
        </template>
        <span>Mark response</span>
      </v-tooltip>
      <!-- Teacher marked -->
      <v-tooltip v-else :key="i" bottom>
        <template #activator="{ on }">
          <v-chip
            :key="i"
            :class="marginBottom(i)"
            class="green"
            @click="mark(i)"
            v-on="on"
          >
            <span class="font-weight-bold">{{ response.tm.length }}</span>
            <v-icon right>{{
              response.repeat ? $icons.mdiRepeat : $icons.mdiCheckAll
            }}</v-icon>
          </v-chip>
          <v-icon v-if="response.flagged" color="accent" class="fix-flag">{{
            $icons.mdiFlagOutline
          }}</v-icon>
        </template>
        <span>Mark response</span>
      </v-tooltip>
    </template>
  </div>
</template>

<script>
import { mdiCheck, mdiCheckAll, mdiFlagOutline, mdiRepeat } from '@mdi/js'
export default {
  props: {
    // data is an object representing one table cell
    // Top level key is the question id, followed by
    // an array of obejcts (one for each response)
    data: {
      type: Object,
      default: () => {},
    },
    studentIndex: {
      type: Number,
      default: 0,
    },
    questionIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    // Extract responses for this question. The
    // first key in data is the question id as a
    // string. Under this key is an array of
    // response objects.
    responses() {
      return this.data[Object.keys(this.data)[0]]
    },
  },
  created() {
    this.$icons = {
      mdiCheck,
      mdiCheckAll,
      mdiFlagOutline,
      mdiRepeat,
    }
  },
  methods: {
    // TODO (onboarding moved into Chip)
    // onboardClass(i, j) {
    //   return this.obs === 7 && i === 0 && j === 0 ? 'red-out' : ''
    // },
    // For reassigned responses, add margin bottom
    // (except for last one)
    marginBottom(i) {
      return this.responses.length > 1 && i < this.responses.length - 1
        ? 'mb-2'
        : ''
    },
    // Commit mutations setting indices
    // into _report.vue data structure
    mark(responseIndex) {
      this.$store.commit('assignment/setStudentIndex', this.studentIndex)
      this.$store.commit('assignment/setQuestionIndex', this.questionIndex)
      this.$store.commit('assignment/setResponseIndex', responseIndex)
      this.$store.commit('assignment/setMarking', true)
      // Onboarding is complete
      this.$store.commit('app/setOnboardStep', 0)
    },
  },
}
</script>

<style scoped>
/* Adjust flags to keep chips aligned */
.fix-flag {
  margin-left: -25px;
  left: 24px;
}
</style>
