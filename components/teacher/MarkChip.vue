<template>
  <!-- fix alignment for reassigned questions -->
  <div
    :class="`${responses.length > 1 ? 'd-flex flex-column align-center' : ''}`"
  >
    <!-- Not answered yet -->
    <div v-if="responses.length === 0" class="chip-height">N/A</div>
    <template v-for="(response, i) in responses">
      <!-- Teacher marked -->
      <div v-if="response.marked" :key="i">
        <v-chip
          :class="`check fix-width ${
            responses.length > 1 && i < responses.length - 1 ? 'mb-2' : ''
          }`"
          @click="mark(i)"
        >
          <span class="font-weight-bold">{{ response.tm.length }}</span>
          <v-icon right>{{
            response.repeat ? $icons.mdiBoomerang : $icons.mdiCheckAll
          }}</v-icon>
        </v-chip>
        <v-icon v-if="response.flagged" color="accent" class="ff">{{
          $icons.mdiFlagOutline
        }}</v-icon>
      </div>
      <!-- Just self marked -->
      <v-chip
        v-else
        :key="i"
        outlined
        :class="`fix-width ${
          responses.length > 1 && i < responses.length - 1 ? 'mb-2' : ''
        }`"
        @click="mark(i)"
      >
        {{ response.sm.length }}
        <v-icon right color="grey">{{ $icons.mdiCheck }}</v-icon>
      </v-chip>
    </template>
  </div>
</template>

<script>
import { mdiCheck, mdiCheckAll, mdiFlagOutline, mdiBoomerang } from '@mdi/js'
export default {
  name: 'EgMarkChip',
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
    // Extract the array of responses for this question
    responses() {
      return this.data[Object.keys(this.data)[0]]
    },
  },
  created() {
    this.$icons = {
      mdiCheck,
      mdiCheckAll,
      mdiFlagOutline,
      mdiBoomerang,
    }
  },
  methods: {
    // Emit an event containing indexes into data structure
    mark(responseIndex) {
      const obj = {
        studentIndex: this.studentIndex,
        questionIndex: this.questionIndex,
        responseIndex,
      }
      // NOT a Nuxt event
      // This is picked up by @clicked in the parent
      this.$emit('clicked', obj)
    },
  },
}
</script>

<style scoped>
.v-chip.check {
  background-color: rgb(201, 237, 194) !important;
  color: rgb(18, 39, 14) !important;
}

.v-chip.fix-width {
  width: 58px;
}

/* adjust flags to keep chips aligned */
.ff {
  margin-left: -27px;
  left: 24px;
}

/* make N/A the same height as a chip */
.chip-height {
  height: 32px;
}
</style>
