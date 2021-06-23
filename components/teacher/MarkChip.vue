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
            :class="mb(i)"
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
    // Data for one table cell (an object)
    // Top level key is the question id
    // Followed by an array of obejct, one for each response
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
    // Students can have more than one attempt
    // so extract responses for this question
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
    // If multiple responses, add margin bottom
    mb(i) {
      return this.responses.length > 1 && i < this.responses.length - 1
        ? 'mb-2'
        : ''
    },
    // Emit an event containing indexes into big data structure
    mark(responseIndex) {
      const obj = {
        studentIndex: this.studentIndex,
        questionIndex: this.questionIndex,
        responseIndex,
      }
      // Not a Nuxt event
      // @clicked event bubbles up to _report.vue to trigger marking
      this.$emit('clicked', obj)
    },
  },
}
</script>

<style scoped>
/* adjust flags to keep chips aligned */
.fix-flag {
  margin-left: -25px;
  left: 24px;
}
</style>
