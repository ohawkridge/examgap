<template>
  <v-card
    outlined
    class="mb-4 ass-card"
    hover
    nuxt
    :to="`/report/${assignment.id}`"
  >
    <v-card-title>
      {{ assignment.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ assignment.group }}
    </v-card-subtitle>
    <v-card-text class="text-body-1">
      <div>
        <span class="align-date font-weight-bold">Start:</span
        >{{ assignment.start | date }}
      </div>
      <v-chip label outlined color="primary darken-1" small class="float-right">
        {{ assignment.count }} Student{{ assignment.count | pluralize }}
      </v-chip>
      <div>
        <span class="align-date font-weight-bold">Due:</span
        >{{ assignment.dateDue | date }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    assignment: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped>
.ass-card {
  border-left: 4px solid #0099cc;
}

.align-date {
  display: inline-block;
  width: 80px;
}
</style>
