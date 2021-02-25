<template>
  <v-row>
    <v-col id="div1" cols="12">
      <div class="text-h6 font-weight-bold">
        {{ group.name }}
      </div>
      <div>{{ group.course.name }} ({{ group.course.board }})</div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    group: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
