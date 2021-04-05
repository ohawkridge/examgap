<template>
  <div>
    <v-row>
      <v-col cols="12" md="9">
        <div v-if="group.name !== undefined" class="text-h6 font-weight-bold">
          {{ group.name }}
        </div>
        <div v-if="group.course.name !== undefined">
          {{ group.course.name }} ({{ group.course.board }})
        </div>
      </v-col>
      <v-col cols="12" md="3" class="d-flex justify-end align-center">
        <the-invite-dialog :group="group" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-divider class="primary" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TheInviteDialog from '@/components/teacher/TheInviteDialog'

export default {
  components: {
    TheInviteDialog,
  },
  props: {
    group: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped>
.primary-divider {
  border-bottom: 1px solid #0078a0;
}
</style>
