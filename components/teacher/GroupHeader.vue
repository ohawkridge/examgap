<template>
  <v-row>
    <v-col id="div1" cols="12">
      <div v-if="group.name !== undefined" class="text-h6 font-weight-bold">
        {{ group.name }}
      </div>
      <div v-if="group.course.name !== undefined">
        {{ group.course.name }} ({{ group.course.board }})
      </div>
      <v-divider class="primary" />
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
